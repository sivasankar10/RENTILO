import { useState } from 'react'
import { AlertCircle, MoreVertical, Search, TrendingUp } from 'lucide-react'
import { cn } from '@shared/utils/cn'

type BrokerStatus = 'ACTIVE' | 'BANNED'
type TabFilter = 'All' | 'Active' | 'Banned'
type EnterpriseTab = 'Enterprise' | 'Non-Enterprise'

interface Broker {
  name: string
  role: string
  avatar: string
  id: string
  status: BrokerStatus
  activeDeals: number
  dealsClosed: number
  successRate: number
  avgTime: string
}

interface EnterpriseBroker {
  name: string
  role: string
  avatar: string
  commission: string
  property: string
  valuation: number
  status: 'Open' | 'Closed' | 'closed'
}

interface QueueItem {
  name: string
  location: string
}

const brokers: Broker[] = [
  {
    name: 'Arjun Mehta',
    role: 'Premium Broker',
    avatar: 'AM',
    id: '#BRK-9281',
    status: 'ACTIVE',
    activeDeals: 12,
    dealsClosed: 148,
    successRate: 98,
    avgTime: '14 Days',
  },
  {
    name: 'Priya Sharma',
    role: 'Senior Associate',
    avatar: 'PS',
    id: '#BRK-4412',
    status: 'ACTIVE',
    activeDeals: 8,
    dealsClosed: 92,
    successRate: 92,
    avgTime: '18 Days',
  },
  {
    name: 'Vikram Singh',
    role: 'Ex-Broker',
    avatar: 'VS',
    id: '#BRK-1053',
    status: 'BANNED',
    activeDeals: 0,
    dealsClosed: 12,
    successRate: 45,
    avgTime: 'N/A',
  },
  {
    name: 'Rohan Desai',
    role: 'Associate Broker',
    avatar: 'RD',
    id: '#BRK-3398',
    status: 'ACTIVE',
    activeDeals: 15,
    dealsClosed: 64,
    successRate: 89,
    avgTime: '22 Days',
  },
]

const enterpriseBrokers: EnterpriseBroker[] = [
  { name: 'Arjun Mehta', role: 'Premium Broker', avatar: 'AM', commission: '45%', property: 'Sarjapur', valuation: 150, status: 'Open' },
  { name: 'Priya Sharma', role: 'Senior Associate', avatar: 'PS', commission: '28%', property: 'Sarjapur', valuation: 92, status: 'Closed' },
  { name: 'Vikram Singh', role: 'Ex-Broker', avatar: 'VS', commission: '35%', property: 'Sarjapur', valuation: 12, status: 'Open' },
  { name: 'Rohan Desai', role: 'Associate Broker', avatar: 'RD', commission: '27%', property: 'Sarjapur', valuation: 64, status: 'closed' },
]

const assignmentQueue: QueueItem[] = [
  { name: 'Skyline Heights II', location: 'Whitefield, Bangalore' },
  { name: 'Retail Complex', location: 'Banjara Hills' },
]

export function AdminBrokerManagement() {
  const [activeTab, setActiveTab] = useState<TabFilter>('All')
  const [enterpriseTab, setEnterpriseTab] = useState<EnterpriseTab>('Enterprise')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredBrokers = brokers.filter((broker) => {
    if (activeTab === 'Active') return broker.status === 'ACTIVE'
    if (activeTab === 'Banned') return broker.status === 'BANNED'
    return true
  }).filter((broker) =>
    broker.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-canvas-alt px-2 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <h1 className="text-heading-1 font-bold tracking-tight text-text-primary">
          Broker Management
        </h1>

        {/* Alert Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Attention Required */}
          <div className="rounded-card border border-outline bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-status-error-bg">
                <AlertCircle size={20} className="text-status-error" />
              </div>
              <div>
                <p className="text-filter-label uppercase tracking-wider text-text-muted">
                  Attention Required
                </p>
                <p className="mt-1 text-body font-bold text-text-primary">
                  3 Expiring Deal Windows
                </p>
                <p className="mt-0.5 text-label text-text-muted">
                  Review active windows before automatic termination.
                </p>
              </div>
            </div>
          </div>

          {/* System Alert */}
          <div className="rounded-card border border-outline bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-status-error-bg">
                <AlertCircle size={20} className="text-status-error" />
              </div>
              <div>
                <p className="text-filter-label uppercase tracking-wider text-text-muted">
                  System Alert
                </p>
                <p className="mt-1 text-body font-bold text-text-primary">
                  2 Failed Deals
                </p>
                <p className="mt-0.5 text-label text-text-muted">
                  Transactions flagged for non-compliance or timeout.
                </p>
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="rounded-card border border-outline bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50">
                <TrendingUp size={20} className="text-teal-600" />
              </div>
              <div>
                <p className="text-filter-label uppercase tracking-wider text-text-muted">
                  Performance
                </p>
                <p className="mt-1 text-body font-bold text-text-primary">
                  94.2% Success Rate
                </p>
                <p className="mt-0.5 text-label text-text-muted">
                  Avg broker performance is up 2.4% this month.
                </p>
              </div>
            </div>
          </div>
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
                  onClick={() => setActiveTab(tab)}
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-56 rounded-input border border-outline bg-white pl-9 pr-3 text-body text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>
              <select className="h-9 rounded-input border border-outline bg-white px-3 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30">
                <option>Sort: Success Rate↓</option>
                <option>Sort: Deals Closed↓</option>
                <option>Sort: Name A-Z</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline">
                  <th className="px-6 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    Broker Name
                  </th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    Broker ID
                  </th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">
                    Active Deals
                  </th>
                  <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">
                    Deals Closed
                  </th>
                  <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">
                    Success Rate
                  </th>
                  <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">
                    Avg Time
                  </th>
                  <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBrokers.map((broker) => (
                  <tr
                    key={broker.id}
                    className="border-b border-outline last:border-0 hover:bg-hover-light transition-colors"
                  >
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
                    <td className="px-4 py-4 text-body text-text-primary">{broker.id}</td>
                    <td className="px-4 py-4">
                      <span
                        className={cn(
                          'text-badge font-bold uppercase',
                          broker.status === 'ACTIVE' ? 'text-status-success' : 'text-status-error',
                        )}
                      >
                        {broker.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center text-body text-text-primary">
                      {broker.activeDeals}
                    </td>
                    <td className="px-4 py-4 text-center text-body text-text-primary">
                      {broker.dealsClosed}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center">
                        <SuccessRateBar rate={broker.successRate} banned={broker.status === 'BANNED'} />
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-body text-text-muted">
                      {broker.avgTime}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        type="button"
                        className="p-1.5 rounded-button text-text-muted hover:bg-hover-light hover:text-text-primary transition-colors"
                        aria-label={`Actions for ${broker.name}`}
                      >
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-outline px-6 py-4">
            <p className="text-label text-text-muted">
              Showing 1 to 4 of 128 brokers
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="rounded-button px-3 py-1.5 text-label font-medium text-text-muted hover:bg-hover-light transition-colors"
              >
                Previous
              </button>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    'h-8 w-8 rounded-button text-label font-medium transition-colors',
                    currentPage === page
                      ? 'bg-primary text-white'
                      : 'text-text-muted hover:bg-hover-light',
                  )}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                className="rounded-button px-3 py-1.5 text-label font-medium text-text-muted hover:bg-hover-light transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Enterprise / Non-Enterprise Section */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-0">
            {/* Tabs */}
            <div className="flex border-b border-outline">
              {(['Enterprise', 'Non-Enterprise'] as EnterpriseTab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setEnterpriseTab(tab)}
                  className={cn(
                    'px-8 py-4 text-heading-3 font-bold transition-colors border-b-2',
                    enterpriseTab === tab
                      ? 'border-navy text-text-primary'
                      : 'border-transparent text-text-muted hover:text-text-primary',
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Enterprise Table */}
            <div className="rounded-b-card border border-t-0 border-outline bg-white shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline">
                    <th className="px-6 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                      Broker Name
                    </th>
                    <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">
                      Commission
                    </th>
                    <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                      Property
                    </th>
                    <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">
                      Valuation (In Lakhs)
                    </th>
                    <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">
                      Status
                    </th>
                    <th className="w-10 px-2 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {enterpriseBrokers.map((broker, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-outline last:border-0 hover:bg-hover-light transition-colors"
                    >
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
                      <td className="px-4 py-4 text-center text-body text-text-primary">
                        {broker.valuation}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={cn(
                            'text-body font-semibold',
                            broker.status === 'Closed' || broker.status === 'closed'
                              ? 'text-text-primary'
                              : 'text-text-primary',
                          )}
                        >
                          {broker.status}
                        </span>
                      </td>
                      <td className="px-2 py-4 text-center">
                        <button
                          type="button"
                          className="p-1.5 rounded-button text-text-muted hover:bg-hover-light hover:text-text-primary transition-colors"
                          aria-label={`Actions for ${broker.name}`}
                        >
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
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
              {assignmentQueue.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-button bg-slate-100">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-text-muted">
                        <path d="M2 14V6l6-4 6 4v8H2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                        <path d="M6 14v-4h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-body font-semibold text-text-primary">{item.name}</p>
                      <p className="text-label text-text-muted">{item.location}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="rounded-button bg-primary px-3 py-1.5 text-badge font-bold text-white transition-colors hover:bg-primary-700"
                  >
                    Assign
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="mt-5 w-full rounded-button border border-outline py-2.5 text-body font-medium text-text-muted hover:bg-hover-light hover:text-text-primary transition-colors"
            >
              View All Queue (18)
            </button>
          </div>
        </div>
      </div>
    </div>
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
          banned
            ? 'bg-status-error-bg text-status-error-text'
            : rate >= 90
              ? 'bg-teal-50 text-teal-700'
              : rate >= 70
                ? 'bg-status-warning-bg text-status-warning-text'
                : 'bg-status-error-bg text-status-error-text',
        )}
      >
        {rate}%
      </span>
    </div>
  )
}
