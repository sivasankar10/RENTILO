import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  FileSignature,
  Filter,
  Search,
  ShieldCheck,
} from 'lucide-react'
import { cn } from '@shared/utils/cn'

const leaseRecords = [
  {
    id: 'LSE-402',
    property: 'Skyline Heights - Unit 402',
    tenant: 'Rajesh Kumar',
    rent: '$4,500',
    deposit: '$9,000',
    start: 'Nov 01, 2024',
    end: 'Oct 31, 2025',
    payment: 'Paid',
    status: 'Active',
    renewal: 'Signed',
  },
  {
    id: 'LSE-14B',
    property: 'The Opus Tower, 14B',
    tenant: 'Sarah Miller',
    rent: '$6,200',
    deposit: '$12,400',
    start: 'Dec 15, 2024',
    end: 'Dec 14, 2025',
    payment: 'Due Soon',
    status: 'Review',
    renewal: 'Pending',
  },
  {
    id: 'LSE-88A',
    property: 'Parkview Residences - 88A',
    tenant: 'Amit Shah',
    rent: '$3,850',
    deposit: '$7,700',
    start: 'Aug 01, 2024',
    end: 'Jul 31, 2025',
    payment: 'Paid',
    status: 'Active',
    renewal: 'Auto-Renew',
  },
]

const summaryCards = [
  { label: 'Active Leases', value: '2', icon: ShieldCheck, tone: 'success' },
  { label: 'Needs Review', value: '1', icon: AlertTriangle, tone: 'warning' },
  { label: 'Documents Signed', value: '7', icon: FileSignature, tone: 'primary' },
]

const statusStyles = {
  Active: 'bg-status-success-bg text-status-success',
  Review: 'bg-status-warning-bg text-status-warning',
  Paid: 'bg-status-success-bg text-status-success',
  'Due Soon': 'bg-status-warning-bg text-status-warning',
  Signed: 'bg-primary-50 text-primary',
  Pending: 'bg-status-warning-bg text-status-warning',
  'Auto-Renew': 'bg-slate-100 text-text-primary',
}

export function OwnerLeases() {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedLease, setSelectedLease] = useState(leaseRecords[0])
  const [notice, setNotice] = useState('')

  const filteredLeases = useMemo(
    () =>
      leaseRecords.filter((lease) => {
        const matchesQuery = `${lease.property} ${lease.tenant} ${lease.id}`
          .toLowerCase()
          .includes(query.toLowerCase())
        const matchesStatus = statusFilter === 'All' || lease.status === statusFilter
        return matchesQuery && matchesStatus
      }),
    [query, statusFilter]
  )

  return (
    <div className="min-h-screen bg-canvas-alt px-6 py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-filter-label font-bold uppercase tracking-wider text-primary">
              Lease Operations
            </p>
            <h1 className="mt-2 text-heading-1 font-extrabold tracking-tight text-navy">
              Lease Management
            </h1>
            <p className="mt-2 max-w-2xl text-body text-text-muted">
              Track agreements, renewals, rent status, and document readiness across your active
              owner portfolio.
            </p>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {summaryCards.map((card) => {
            const Icon = card.icon
            return (
              <article key={card.label} className="rounded-card border border-outline bg-white p-6 shadow-surface">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-label font-semibold text-text-muted">{card.label}</p>
                    <p className="mt-2 text-heading-2 font-extrabold tracking-tight text-navy">
                      {card.value}
                    </p>
                  </div>
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-button',
                      card.tone === 'success' && 'bg-status-success-bg text-status-success',
                      card.tone === 'warning' && 'bg-status-warning-bg text-status-warning',
                      card.tone === 'primary' && 'bg-primary-50 text-primary'
                    )}
                  >
                    <Icon size={22} />
                  </div>
                </div>
              </article>
            )
          })}
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-card border border-outline bg-white shadow-surface">
            <div className="flex flex-col gap-4 border-b border-outline p-6 lg:flex-row lg:items-center lg:justify-between">
              <label className="relative block flex-1">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search leases, tenants, or property..."
                  className="w-full rounded-input border border-outline bg-white py-3 pl-11 pr-4 text-body text-text-primary outline-none transition-all duration-200 placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary-100"
                />
              </label>
              <label className="flex items-center gap-2 rounded-input border border-outline bg-white px-3 py-3 text-label font-bold text-text-primary">
                <Filter size={16} className="text-text-muted" />
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="bg-transparent outline-none"
                >
                  <option>All</option>
                  <option>Active</option>
                  <option>Review</option>
                </select>
              </label>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse">
                <thead>
                  <tr className="border-b border-outline bg-slate-50 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    <th className="px-6 py-4 font-bold">Lease</th>
                    <th className="px-6 py-4 font-bold">Tenant</th>
                    <th className="px-6 py-4 font-bold">Term</th>
                    <th className="px-6 py-4 font-bold">Rent</th>
                    <th className="px-6 py-4 font-bold">Payment</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeases.map((lease) => (
                    <tr
                      key={lease.id}
                      className={cn(
                        'cursor-pointer border-b border-outline transition-colors duration-200 hover:bg-hover-light',
                        selectedLease.id === lease.id && 'bg-primary-50'
                      )}
                      onClick={() => {
                        setSelectedLease(lease)
                        setNotice('')
                      }}
                    >
                      <td className="px-6 py-5">
                        <p className="text-body font-bold text-navy">{lease.property}</p>
                        <p className="mt-1 text-label text-text-muted">{lease.id}</p>
                      </td>
                      <td className="px-6 py-5 text-body font-semibold text-text-primary">
                        {lease.tenant}
                      </td>
                      <td className="px-6 py-5 text-label text-text-muted">
                        {lease.start} - {lease.end}
                      </td>
                      <td className="px-6 py-5 text-body font-bold text-navy">{lease.rent}</td>
                      <td className="px-6 py-5">
                        <span
                          className={cn(
                            'rounded-pill px-2.5 py-1 text-badge font-bold uppercase',
                            statusStyles[lease.payment as keyof typeof statusStyles]
                          )}
                        >
                          {lease.payment}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={cn(
                            'rounded-pill px-2.5 py-1 text-badge font-bold uppercase',
                            statusStyles[lease.status as keyof typeof statusStyles]
                          )}
                        >
                          {lease.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="space-y-6">
            <article className="rounded-card border border-outline bg-white p-6 shadow-surface">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-filter-label font-bold uppercase text-primary">Selected Lease</p>
                  <h2 className="mt-2 text-heading-3 font-bold text-navy">{selectedLease.id}</h2>
                </div>
                <span
                  className={cn(
                    'rounded-pill px-2.5 py-1 text-badge font-bold uppercase',
                    statusStyles[selectedLease.status as keyof typeof statusStyles]
                  )}
                >
                  {selectedLease.status}
                </span>
              </div>

              <div className="mt-6 space-y-4 border-y border-outline py-6">
                <div>
                  <p className="text-label font-semibold text-text-muted">Property</p>
                  <p className="mt-1 text-body font-bold text-text-primary">{selectedLease.property}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-label font-semibold text-text-muted">Tenant</p>
                    <p className="mt-1 text-body font-bold text-text-primary">{selectedLease.tenant}</p>
                  </div>
                  <div>
                    <p className="text-label font-semibold text-text-muted">Deposit</p>
                    <p className="mt-1 text-body font-bold text-text-primary">{selectedLease.deposit}</p>
                  </div>
                </div>
                <div>
                  <p className="text-label font-semibold text-text-muted">Renewal State</p>
                  <span
                    className={cn(
                      'mt-2 inline-flex rounded-pill px-2.5 py-1 text-badge font-bold uppercase',
                      statusStyles[selectedLease.renewal as keyof typeof statusStyles]
                    )}
                  >
                    {selectedLease.renewal}
                  </span>
                </div>
              </div>

              {notice && (
                <p className="mt-4 rounded-button bg-primary-50 px-3 py-2 text-label font-semibold text-primary">
                  {notice}
                </p>
              )}
            </article>

            <article className="rounded-card border border-outline bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <CalendarDays size={18} className="text-primary" />
                <h2 className="text-body-lg font-bold text-navy">Upcoming Milestones</h2>
              </div>
              <div className="mt-5 space-y-4">
                <div className="flex gap-3">
                  <CheckCircle2 size={18} className="mt-0.5 text-status-success" />
                  <div>
                    <p className="text-label font-bold text-text-primary">Rent receipt issued</p>
                    <p className="text-label text-text-muted">Skyline Heights - Unit 402</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <AlertTriangle size={18} className="mt-0.5 text-status-warning" />
                  <div>
                    <p className="text-label font-bold text-text-primary">Renewal review due</p>
                    <p className="text-label text-text-muted">The Opus Tower, 14B</p>
                  </div>
                </div>
              </div>
            </article>
          </aside>
        </section>
      </div>
    </div>
  )
}
