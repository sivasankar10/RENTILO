import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, Ban, Eye, Mail, Search, Trash2, TrendingUp, UserCheck } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { useAdminStore } from '../store/adminStore'
import type { AdminBroker } from '../store/adminStore'
import { ActionMenu } from '../components/ActionMenu'
import { confirm } from '../components/ConfirmDialog'
import { toast } from '../components/Toast'
import { exportToCsv } from '../utils/exportCsv'
import { ROUTES } from '@shared/constants/routes'
import { usePrototypeStore } from '@shared/store/prototypeStore'

type TabFilter = 'All' | 'Active' | 'Banned'
type EnterpriseTab = 'Enterprise' | 'Non-Enterprise'
type SortKey = 'success' | 'deals' | 'active' | 'name'

function compareBrokers(a: AdminBroker, b: AdminBroker, sortKey: SortKey): number {
  switch (sortKey) {
    case 'success':
      return b.successRate - a.successRate
    case 'deals':
      return b.dealsClosed - a.dealsClosed
    case 'active':
      return b.activeDeals - a.activeDeals
    case 'name':
      return a.name.localeCompare(b.name)
    default:
      return 0
  }
}

export function AdminBrokerManagement() {
  const brokers = useAdminStore((s) => s.brokers)
  const enterpriseBrokers = useAdminStore((s) => s.enterpriseBrokers)
  const queue = useAdminStore((s) => s.assignmentQueue)
  const setBrokerStatus = useAdminStore((s) => s.setBrokerStatus)
  const removeBroker = useAdminStore((s) => s.removeBroker)
  const removeEnterpriseBroker = useAdminStore((s) => s.removeEnterpriseBroker)
  const navigate = useNavigate()

  // Dynamic non-enterprise brokers from prototype store
  const prototypeAssignments = usePrototypeStore((s) => s.brokerAssignments)
  const prototypeUsers = usePrototypeStore((s) => s.users)
  const prototypeProperties = usePrototypeStore((s) => s.properties)
  const removeBrokerAssignment = usePrototypeStore((s) => s.removeBrokerAssignment)

  const nonEnterpriseBrokers = useMemo(() => {
    return prototypeAssignments
      .filter((a) => a.status === 'Active')
      .map((assignment) => {
        const broker = prototypeUsers.find((u) => u.id === assignment.brokerId)
        const property = prototypeProperties.find((p) => p.id === assignment.propertyId)
        const brokerName = broker ? `${broker.firstName} ${broker.lastName}` : 'Unknown Broker'
        const initials = broker ? `${broker.firstName[0]}${broker.lastName[0]}` : '??'
        return {
          id: assignment.id,
          name: brokerName,
          role: 'Assigned Broker',
          avatar: initials,
          commission: '—',
          property: property?.neighborhood ?? property?.city ?? 'Unknown',
          valuation: property ? parseInt(property.price.replace(/\D/g, '')) / 1000 : 0,
          status: 'Open' as const,
          propertyId: assignment.propertyId,
          brokerId: assignment.brokerId,
        }
      })
  }, [prototypeAssignments, prototypeUsers, prototypeProperties])

  const [activeTab, setActiveTab] = useState<TabFilter>('All')
  const [enterpriseTab, setEnterpriseTab] = useState<EnterpriseTab>('Enterprise')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('success')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredBrokers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    const filtered = brokers.filter((broker) => {
      if (activeTab === 'Active' && broker.status !== 'ACTIVE') return false
      if (activeTab === 'Banned' && broker.status !== 'BANNED') return false
      if (query && !broker.name.toLowerCase().includes(query)) return false
      return true
    })

    return [...filtered].sort((a, b) => compareBrokers(a, b, sortKey))
  }, [brokers, activeTab, searchQuery, sortKey])

  const handleSortChange = (nextSortKey: SortKey) => {
    setSortKey(nextSortKey)
    setCurrentPage(1)
  }

  const handleViewDetails = (broker: AdminBroker) => {
    toast.info(`Viewing ${broker.name}`, `Broker ID ${broker.brokerId}`)
  }

  const handleSendMessage = (broker: AdminBroker) => {
    toast.success('Message drafted', `New conversation with ${broker.name}`)
  }

  const handleToggleBan = (broker: AdminBroker) => {
    const isBanning = broker.status === 'ACTIVE'
    confirm({
      title: isBanning ? 'Ban broker?' : 'Reinstate broker?',
      description: isBanning
        ? `${broker.name} will lose access to active deals and won't receive new assignments.`
        : `${broker.name} will regain platform access immediately.`,
      confirmLabel: isBanning ? 'Ban broker' : 'Reinstate',
      variant: isBanning ? 'danger' : 'default',
      onConfirm: () => {
        setBrokerStatus(broker.id, isBanning ? 'BANNED' : 'ACTIVE')
        toast.success(
          isBanning ? 'Broker banned' : 'Broker reinstated',
          `${broker.name} is now ${isBanning ? 'banned' : 'active'}.`,
        )
      },
    })
  }

  const handleRemoveBroker = (broker: AdminBroker) => {
    confirm({
      title: 'Remove broker permanently?',
      description: `${broker.name} (${broker.brokerId}) will be removed from the platform. This cannot be undone.`,
      confirmLabel: 'Remove',
      variant: 'danger',
      onConfirm: () => {
        removeBroker(broker.id)
        toast.success('Broker removed', `${broker.name} no longer appears in the directory.`)
      },
    })
  }

  const handleAssignQueue = (name: string, type: 'enterprise' | 'standard') => {
    navigate(`${ROUTES.ADMIN.ASSIGNMENT_MANAGEMENT}?assign=${encodeURIComponent(name)}&type=${type}`)
  }

  const handleAssignAll = () => {
    navigate(ROUTES.ADMIN.ASSIGNMENT_MANAGEMENT)
  }

  const handleAddBroker = () => {
    const dummyNames = ['Anil Kumar', 'Neha Patel', 'Karthik Reddy', 'Divya Nair', 'Suresh Babu', 'Pooja Verma']
    const randomName = dummyNames[Math.floor(Math.random() * dummyNames.length)]
    const [firstName, lastName] = randomName.split(' ')
    const phone = `90000${Math.floor(10000 + Math.random() * 90000)}`

    // Add broker as a user in the prototype store so the merged admin store picks it up
    const protoState = usePrototypeStore.getState()
    const newUser = {
      id: `user-broker-${Date.now()}`,
      accountName: randomName.replace(' ', ''),
      phone,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@rentilo.test`,
      firstName,
      lastName,
      roles: ['broker'] as ('broker')[],
      primaryRole: 'broker' as const,
      avatar: undefined,
      kycStatus: 'Verified' as const,
      status: 'Active' as const,
      flags: 0,
      lastActive: 'Just now',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    protoState.addUser(newUser)
    toast.success('Broker added', `${randomName} (${phone}) has been onboarded.`)
  }

  return (
    <div className="min-h-screen bg-canvas-alt px-2 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-heading-1 font-bold tracking-tight text-text-primary">
            Broker Management
          </h1>
          <button
            type="button"
            onClick={handleAddBroker}
            className="inline-flex items-center gap-2 rounded-button bg-navy px-4 py-2.5 text-body font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
          >
            <UserCheck size={16} />
            New Broker
          </button>
        </div>

        {/* Alert Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <AlertCard
            tone="error"
            title="Attention Required"
            value="3 Expiring Deal Windows"
            description="Review active windows before automatic termination."
            onClick={() => toast.info('Review queue opened', 'Showing 3 deals nearing expiry.')}
          />
          <AlertCard
            tone="error"
            title="System Alert"
            value="2 Failed Deals"
            description="Transactions flagged for non-compliance or timeout."
            onClick={() => toast.info('Compliance log opened', 'Routing to investigation panel.')}
          />
          <AlertCard
            tone="success"
            title="Performance"
            value="94.2% Success Rate"
            description="Avg broker performance is up 2.4% this month."
            onClick={() => toast.info('Performance details', 'Opening detailed analytics view.')}
          />
        </div>

        {/* Broker Table Section */}
        <div className="rounded-card border border-outline bg-white shadow-surface">
          {/* Filters Row */}
          <div className="flex flex-col gap-4 border-b border-outline px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-1">
              {(['All', 'Active', 'Banned'] as TabFilter[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => { setActiveTab(tab); setCurrentPage(1) }}
                  className={cn(
                    'rounded-button px-4 py-2 text-body font-medium transition-colors',
                    activeTab === tab
                      ? 'bg-navy text-white'
                      : 'text-text-muted hover:bg-hover-light hover:text-text-primary',
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search brokers..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="h-9 w-56 rounded-input border border-outline bg-white pl-9 pr-3 text-body text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>
              <select
                value={sortKey}
                onChange={(e) => handleSortChange(e.target.value as SortKey)}
                className="h-9 rounded-input border border-outline bg-white px-3 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
              >
                <option value="success">Sort: Success Rate</option>
                <option value="deals">Sort: Deals Closed</option>
                <option value="active">Sort: Active Deals</option>
                <option value="name">Sort: Name A-Z</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline">
                  <SortableHeader label="Broker Name" column="name" align="left" sortKey={sortKey} onSort={handleSortChange} className="px-6 py-3" />
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">Broker ID</th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">Status</th>
                  <SortableHeader label="Active Deals" column="active" sortKey={sortKey} onSort={handleSortChange} className="px-4 py-3" />
                  <SortableHeader label="Deals Closed" column="deals" sortKey={sortKey} onSort={handleSortChange} className="px-4 py-3" />
                  <SortableHeader label="Success Rate" column="success" sortKey={sortKey} onSort={handleSortChange} className="px-4 py-3" />
                  <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">Avg Time</th>
                  <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBrokers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-body text-text-muted">
                      No brokers match the current filters.
                    </td>
                  </tr>
                ) : (
                  filteredBrokers.map((broker) => (
                    <tr key={broker.id} className="border-b border-outline last:border-0 hover:bg-hover-light transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-badge font-bold text-text-primary">
                            {broker.avatar}
                          </div>
                          <div>
                            <p className="text-body font-semibold text-text-primary">{broker.name}</p>
                            <p className="text-label text-text-muted">{broker.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-body text-text-primary">{broker.brokerId}</td>
                      <td className="px-4 py-4">
                        <span className={cn('text-badge font-bold uppercase', broker.status === 'ACTIVE' ? 'text-status-success' : 'text-status-error')}>
                          {broker.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center text-body text-text-primary">{broker.activeDeals}</td>
                      <td className="px-4 py-4 text-center text-body text-text-primary">{broker.dealsClosed}</td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center">
                          <SuccessRateBar rate={broker.successRate} banned={broker.status === 'BANNED'} />
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center text-body text-text-muted">{broker.avgTime}</td>
                      <td className="px-4 py-4 text-center">
                        <ActionMenu
                          ariaLabel={`Actions for ${broker.name}`}
                          items={[
                            { label: 'View profile', icon: Eye, onClick: () => handleViewDetails(broker) },
                            { label: 'Send message', icon: Mail, onClick: () => handleSendMessage(broker) },
                            {
                              label: broker.status === 'ACTIVE' ? 'Ban broker' : 'Reinstate',
                              icon: broker.status === 'ACTIVE' ? Ban : UserCheck,
                              variant: broker.status === 'ACTIVE' ? 'danger' : 'default',
                              onClick: () => handleToggleBan(broker),
                            },
                            { label: 'Remove', icon: Trash2, variant: 'danger', onClick: () => handleRemoveBroker(broker) },
                          ]}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-outline px-6 py-4">
            <p className="text-label text-text-muted">
              Showing {filteredBrokers.length} of {brokers.length} brokers
            </p>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className="rounded-button px-3 py-1.5 text-label font-medium text-text-muted hover:bg-hover-light transition-colors">Previous</button>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={cn('h-8 w-8 rounded-button text-label font-medium transition-colors', currentPage === page ? 'bg-primary text-white' : 'text-text-muted hover:bg-hover-light')}
                >
                  {page}
                </button>
              ))}
              <button type="button" onClick={() => setCurrentPage((p) => Math.min(3, p + 1))} className="rounded-button px-3 py-1.5 text-label font-medium text-text-muted hover:bg-hover-light transition-colors">Next</button>
            </div>
          </div>
        </div>

        {/* Enterprise / Non-Enterprise Section */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="flex border-b border-outline">
              {(['Enterprise', 'Non-Enterprise'] as EnterpriseTab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setEnterpriseTab(tab)}
                  className={cn(
                    'px-8 py-4 text-heading-3 font-bold transition-colors border-b-2',
                    enterpriseTab === tab ? 'border-navy text-text-primary' : 'border-transparent text-text-muted hover:text-text-primary',
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="rounded-b-card border border-t-0 border-outline bg-white shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline">
                    <th className="px-6 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">Broker Name</th>
                    <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">Commission</th>
                    <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">Property</th>
                    <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">Valuation (In Lakhs)</th>
                    <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">Status</th>
                    <th className="w-10 px-2 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {enterpriseTab === 'Enterprise' ? (
                    enterpriseBrokers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-body text-text-muted">
                          No enterprise brokers to display.
                        </td>
                      </tr>
                    ) : (
                      enterpriseBrokers.map((broker) => (
                        <tr key={broker.id} className="border-b border-outline last:border-0 hover:bg-hover-light transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-badge font-bold text-text-primary">
                                {broker.avatar}
                              </div>
                              <div>
                                <p className="text-body font-semibold text-text-primary">{broker.name}</p>
                                <p className="text-label text-text-muted">{broker.role}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="rounded-pill bg-teal-50 px-2.5 py-1 text-badge font-bold text-teal-700">
                              {broker.commission}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-body text-text-primary">{broker.property}</td>
                          <td className="px-4 py-4 text-center text-body text-text-primary">{broker.valuation}</td>
                          <td className="px-4 py-4 text-center text-body font-semibold text-text-primary">
                            {broker.status}
                          </td>
                          <td className="px-2 py-4 text-center">
                            <ActionMenu
                              ariaLabel={`Actions for ${broker.name}`}
                              items={[
                                { label: 'View deal', icon: Eye, onClick: () => toast.info('Deal opened', `Showing details for ${broker.property}.`) },
                                { label: 'Send message', icon: Mail, onClick: () => toast.success('Message sent', `Notified ${broker.name}.`) },
                                {
                                  label: 'Remove from deal',
                                  icon: Trash2,
                                  variant: 'danger',
                                  onClick: () => confirm({
                                    title: 'Remove from deal?',
                                    description: `${broker.name} will be unassigned from ${broker.property}.`,
                                    confirmLabel: 'Remove',
                                    variant: 'danger',
                                    onConfirm: () => {
                                      removeEnterpriseBroker(broker.id)
                                      toast.success('Broker removed from deal')
                                    },
                                  }),
                                },
                              ]}
                            />
                          </td>
                        </tr>
                      ))
                    )
                  ) : (
                    nonEnterpriseBrokers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-body text-text-muted">
                          No non-enterprise broker assignments yet.
                        </td>
                      </tr>
                    ) : (
                      nonEnterpriseBrokers.map((broker) => (
                        <tr key={broker.id} className="border-b border-outline last:border-0 hover:bg-hover-light transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-badge font-bold text-text-primary">
                                {broker.avatar}
                              </div>
                              <div>
                                <p className="text-body font-semibold text-text-primary">{broker.name}</p>
                                <p className="text-label text-text-muted">{broker.role}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="rounded-pill bg-teal-50 px-2.5 py-1 text-badge font-bold text-teal-700">
                              {broker.commission}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-body text-text-primary">{broker.property}</td>
                          <td className="px-4 py-4 text-center text-body text-text-primary">{broker.valuation}</td>
                          <td className="px-4 py-4 text-center text-body font-semibold text-text-primary">
                            {broker.status}
                          </td>
                          <td className="px-2 py-4 text-center">
                            <ActionMenu
                              ariaLabel={`Actions for ${broker.name}`}
                              items={[
                                { label: 'View details', icon: Eye, onClick: () => toast.info('Assignment details', `${broker.name} assigned to ${broker.property}.`) },
                                { label: 'Send message', icon: Mail, onClick: () => toast.success('Message sent', `Notified ${broker.name}.`) },
                                {
                                  label: 'Remove assignment',
                                  icon: Trash2,
                                  variant: 'danger',
                                  onClick: () => confirm({
                                    title: 'Remove broker assignment?',
                                    description: `${broker.name} will be unassigned from ${broker.property}.`,
                                    confirmLabel: 'Remove',
                                    variant: 'danger',
                                    onConfirm: () => {
                                      removeBrokerAssignment(broker.propertyId, broker.brokerId)
                                      toast.success('Broker assignment removed')
                                    },
                                  }),
                                },
                              ]}
                            />
                          </td>
                        </tr>
                      ))
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Assignment Queue Sidebar */}
          <div className="rounded-card border border-outline bg-white p-6 shadow-surface h-fit">
            <h3 className="text-heading-3 font-bold text-text-primary">Assignment Queue</h3>
            <p className="mt-1 text-label text-text-muted">
              Unassigned high-value listings awaiting broker deployment.
            </p>

            <div className="mt-5 space-y-4">
              {queue.slice(0, 2).map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-button bg-slate-100">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-text-muted">
                        <path d="M2 14V6l6-4 6 4v8H2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                        <path d="M6 14v-4h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-body font-semibold text-text-primary truncate">{item.name}</p>
                      <p className="text-label text-text-muted truncate">{item.location}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAssignQueue(item.name, item.type)}
                    className="shrink-0 rounded-button bg-primary px-3 py-1.5 text-badge font-bold text-white transition-colors hover:bg-primary-700"
                  >
                    Assign
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAssignAll}
              className="mt-5 w-full rounded-button border border-outline py-2.5 text-body font-medium text-text-muted hover:bg-hover-light hover:text-text-primary transition-colors"
            >
              View All Queue ({queue.length})
            </button>

            <button
              type="button"
              onClick={() => {
                exportToCsv('broker-list.csv', brokers, [
                  { key: 'brokerId', label: 'Broker ID' },
                  { key: 'name', label: 'Name' },
                  { key: 'role', label: 'Role' },
                  { key: 'status', label: 'Status' },
                  { key: 'activeDeals', label: 'Active Deals' },
                  { key: 'dealsClosed', label: 'Deals Closed' },
                  { key: 'successRate', label: 'Success Rate (%)' },
                  { key: 'avgTime', label: 'Avg Time' },
                ])
                toast.success('Export started', 'Broker list downloaded as CSV.')
              }}
              className="mt-2 w-full rounded-button bg-navy py-2.5 text-body font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              Export Broker List
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SortableHeader({
  label,
  column,
  sortKey,
  onSort,
  align = 'center',
  className,
}: {
  label: string
  column: SortKey
  sortKey: SortKey
  onSort: (column: SortKey) => void
  align?: 'left' | 'center'
  className?: string
}) {
  const active = sortKey === column

  return (
    <th
      className={cn(
        className,
        align === 'left' ? 'text-left' : 'text-center',
      )}
    >
      <button
        type="button"
        onClick={() => onSort(column)}
        className={cn(
          'inline-flex items-center gap-1 text-filter-label uppercase tracking-wider transition-colors',
          align === 'center' && 'mx-auto',
          active ? 'font-bold text-primary' : 'font-semibold text-text-muted hover:text-text-primary',
        )}
      >
        {label}
        {active && <span aria-hidden="true">â†“</span>}
      </button>
    </th>
  )
}

function AlertCard({
  tone,
  title,
  value,
  description,
  onClick,
}: {
  tone: 'error' | 'success'
  title: string
  value: string
  description: string
  onClick: () => void
}) {
  const Icon = tone === 'success' ? TrendingUp : AlertCircle
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-card border border-outline bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
            tone === 'success' ? 'bg-teal-50' : 'bg-status-error-bg',
          )}
        >
          <Icon size={20} className={tone === 'success' ? 'text-teal-600' : 'text-status-error'} />
        </div>
        <div>
          <p className="text-filter-label uppercase tracking-wider text-text-muted">{title}</p>
          <p className="mt-1 text-body font-bold text-text-primary">{value}</p>
          <p className="mt-0.5 text-label text-text-muted">{description}</p>
        </div>
      </div>
    </button>
  )
}

function SuccessRateBar({ rate, banned }: { rate: number; banned?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-16 overflow-hidden rounded-pill bg-slate-100">
        <div
          className={cn(
            'h-full rounded-pill transition-all',
            banned ? 'bg-status-error' : rate >= 90 ? 'bg-teal-500' : rate >= 70 ? 'bg-status-warning' : 'bg-status-error',
          )}
          style={{ width: `${rate}%` }}
        />
      </div>
      <span
        className={cn(
          'rounded-pill px-2 py-0.5 text-badge font-bold',
          banned ? 'bg-status-error-bg text-status-error-text' : rate >= 90 ? 'bg-teal-50 text-teal-700' : rate >= 70 ? 'bg-status-warning-bg text-status-warning-text' : 'bg-status-error-bg text-status-error-text',
        )}
      >
        {rate}%
      </span>
    </div>
  )
}

