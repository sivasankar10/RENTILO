import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Ban,
  Briefcase,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  TrendingUp,
  UserCheck,
} from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { ROUTES } from '@shared/constants/routes'
import { useAdminStore } from '../store/adminStore'
import { usePrototypeStore } from '@shared/store/prototypeStore'
import type { PrototypeUser } from '@shared/types/prototype'
import { confirm } from '../components/ConfirmDialog'
import { toast } from '../components/Toast'

interface DealRow {
  id: string
  property: string
  location: string
  party: string
  rent: string
  date: string
}

function userName(user?: PrototypeUser): string {
  if (!user) return 'Unknown'
  return user.accountName || `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'Unknown'
}

export function AdminBrokerProfile() {
  const navigate = useNavigate()
  const { brokerId } = useParams<{ brokerId: string }>()

  const brokers = useAdminStore((s) => s.brokers)
  const setBrokerStatus = useAdminStore((s) => s.setBrokerStatus)
  const applications = usePrototypeStore((s) => s.applications)
  const assignments = usePrototypeStore((s) => s.brokerAssignments)
  const properties = usePrototypeStore((s) => s.properties)
  const users = usePrototypeStore((s) => s.users)

  const broker = useMemo(
    () => brokers.find((item) => item.id === brokerId),
    [brokers, brokerId],
  )

  // Active deals = the broker's active property assignments (matches the KPI count).
  // Released assignments drop out automatically since we only keep status === 'Active'.
  const activeDeals = useMemo<DealRow[]>(() => {
    if (!broker) return []
    return assignments
      .filter((assignment) => assignment.brokerId === broker.id && assignment.status === 'Active')
      .map((assignment) => {
        const property = properties.find((item) => item.id === assignment.propertyId)
        const owner = users.find((item) => item.id === assignment.ownerId)
        return {
          id: assignment.id,
          property: property?.title ?? 'Unknown property',
          location: property ? `${property.neighborhood}, ${property.city}` : '—',
          party: userName(owner),
          rent: property?.price ?? '—',
          date: assignment.updatedAt,
        }
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [assignments, properties, users, broker])

  // Closed deals = the broker's applications that reached an active lease (won).
  // Rejected/removed applications never appear here.
  const closedDeals = useMemo<DealRow[]>(() => {
    if (!broker) return []
    return applications
      .filter((application) => application.brokerId === broker.id && application.status === 'active')
      .map((application) => {
        const property = properties.find((item) => item.id === application.propertyId)
        const tenant = users.find((item) => item.id === application.tenantId)
        return {
          id: application.id,
          property: property?.title ?? 'Unknown property',
          location: property ? `${property.neighborhood}, ${property.city}` : '—',
          party: userName(tenant),
          rent: property?.price ?? '—',
          date: application.updatedAt,
        }
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [applications, properties, users, broker])

  if (!broker) {
    return (
      <div className="min-h-screen bg-canvas-alt px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={() => navigate(ROUTES.ADMIN.BROKER_MANAGEMENT)}
            className="inline-flex items-center gap-2 text-label font-semibold text-text-muted hover:text-text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Broker Management
          </button>
          <div className="mt-8 rounded-card border border-outline bg-white p-12 text-center shadow-surface">
            <h1 className="text-heading-2 font-bold text-text-primary">Broker not found</h1>
            <p className="mt-2 text-body text-text-muted">
              This broker may have been removed or the link is no longer valid.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const isActive = broker.status === 'ACTIVE'

  const handleToggleBan = () => {
    confirm({
      title: isActive ? 'Ban broker?' : 'Reinstate broker?',
      description: isActive
        ? `${broker.name} will lose access to active deals and won't receive new assignments.`
        : `${broker.name} will regain platform access immediately.`,
      confirmLabel: isActive ? 'Ban broker' : 'Reinstate',
      variant: isActive ? 'danger' : 'default',
      onConfirm: () => {
        setBrokerStatus(broker.id, isActive ? 'BANNED' : 'ACTIVE')
        toast.success(
          isActive ? 'Broker banned' : 'Broker reinstated',
          `${broker.name} is now ${isActive ? 'banned' : 'active'}.`,
        )
      },
    })
  }

  return (
    <div className="min-h-screen bg-canvas-alt px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <button
          type="button"
          onClick={() => navigate(ROUTES.ADMIN.BROKER_MANAGEMENT)}
          className="inline-flex items-center gap-2 text-label font-semibold text-text-muted hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Broker Management
        </button>

        {/* Header */}
        <div className="rounded-card border border-outline bg-white p-6 shadow-surface">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-heading-3 font-bold text-text-primary">
                {broker.avatar}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-heading-2 font-bold text-text-primary">{broker.name}</h1>
                  <span
                    className={cn(
                      'text-badge font-bold uppercase',
                      isActive ? 'text-status-success' : 'text-status-error',
                    )}
                  >
                    {broker.status}
                  </span>
                </div>
                <p className="mt-1 text-body text-text-muted">{broker.role}</p>
                <p className="mt-0.5 text-label text-text-muted">{broker.brokerId}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  toast.success('Message drafted', `New conversation with ${broker.name}`)
                }
                className="inline-flex items-center gap-2 rounded-button border border-outline bg-white px-4 py-2.5 text-label font-bold text-navy hover:bg-hover-light transition-colors"
              >
                <Mail size={16} />
                Send message
              </button>
              <button
                type="button"
                onClick={handleToggleBan}
                className={cn(
                  'inline-flex items-center gap-2 rounded-button px-4 py-2.5 text-label font-bold text-white transition-colors',
                  isActive ? 'bg-status-error hover:opacity-90' : 'bg-status-success hover:opacity-90',
                )}
              >
                {isActive ? <Ban size={16} /> : <UserCheck size={16} />}
                {isActive ? 'Ban broker' : 'Reinstate'}
              </button>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<Briefcase size={18} />} label="Active Deals" value={broker.activeDeals} />
          <StatCard icon={<CheckCircle2 size={18} />} label="Deals Closed" value={broker.dealsClosed} />
          <StatCard icon={<TrendingUp size={18} />} label="Success Rate" value={`${broker.successRate}%`} />
          <StatCard icon={<Clock size={18} />} label="Avg. Time to Close" value={broker.avgTime} />
        </div>

        {/* Contact */}
        <div className="rounded-card border border-outline bg-white p-6 shadow-surface">
          <h2 className="text-heading-3 font-bold text-text-primary">Contact & identity</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoRow icon={<Phone size={16} />} label="Broker ID" value={broker.brokerId} />
            <InfoRow icon={<Briefcase size={16} />} label="Role" value={broker.role} />
          </div>
        </div>

        {/* Active deals = active assignments */}
        <DealsTable
          title="Active Deals"
          rows={activeDeals}
          partyHeader="Owner"
          dateHeader="Assigned on"
          emptyText="No active deals for this broker."
        />

        {/* Closed deals = won applications (lease active) */}
        <DealsTable
          title="Closed Deals"
          rows={closedDeals}
          partyHeader="Tenant"
          dateHeader="Closed on"
          emptyText="No closed deals for this broker yet."
        />
      </div>
    </div>
  )
}

function DealsTable({
  title,
  rows,
  partyHeader,
  dateHeader,
  emptyText,
}: {
  title: string
  rows: DealRow[]
  partyHeader: string
  dateHeader: string
  emptyText: string
}) {
  return (
    <div className="rounded-card border border-outline bg-white shadow-surface overflow-hidden">
      <div className="flex items-center justify-between border-b border-outline px-6 py-4">
        <h2 className="text-heading-3 font-bold text-text-primary">{title}</h2>
        <span className="text-label text-text-muted">{rows.length} total</span>
      </div>
      {rows.length === 0 ? (
        <p className="px-6 py-10 text-center text-body text-text-muted">{emptyText}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-outline">
                <th className="px-6 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">Property</th>
                <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">{partyHeader}</th>
                <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">Rent</th>
                <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">{dateHeader}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-outline last:border-0">
                  <td className="px-6 py-4">
                    <p className="text-body font-semibold text-text-primary">{row.property}</p>
                    <p className="text-label text-text-muted">{row.location}</p>
                  </td>
                  <td className="px-4 py-4 text-body text-text-primary">{row.party}</td>
                  <td className="px-4 py-4 text-center text-body text-text-primary">{row.rent}</td>
                  <td className="px-4 py-4 text-center text-body text-text-muted">
                    {new Date(row.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-card border border-outline bg-white p-5 shadow-surface">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary">
        {icon}
      </div>
      <p className="mt-4 text-filter-label uppercase tracking-wider text-text-muted">{label}</p>
      <p className="mt-1 text-heading-2 font-bold text-text-primary">{value}</p>
    </div>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-button border border-outline px-4 py-3">
      <span className="text-text-muted">{icon}</span>
      <div>
        <p className="text-filter-label uppercase tracking-wider text-text-muted">{label}</p>
        <p className="text-body font-semibold text-text-primary">{value}</p>
      </div>
    </div>
  )
}
