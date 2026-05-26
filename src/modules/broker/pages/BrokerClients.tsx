import { useMemo, useState } from 'react'
import {
  ChevronLeft,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Download,
  Filter,
  MapPin,
  Plus,
  Search,
  UserPlus,
} from 'lucide-react'
import brokerProfileImg from '@/assets/images/broker_profile.png'
import julianVaneImg from '@/assets/images/julian_vane_owner.png'
import sarahJenkinsImg from '@/assets/images/sarah_jenkins.png'
import { ManagementTiersModal } from '../components/ManagementTiersModal'

type LeadStatus = 'New' | 'Contacted' | 'Visit Scheduled'

type Lead = {
  id: string
  avatar: string
  name: string
  email: string
  interestedProperty: string
  receivedDate: { date: string; meta: string }
  status: LeadStatus
}

function StatusPill({ status }: { status: LeadStatus }) {
  const map: Record<
    LeadStatus,
    { dot: string; bg: string; text: string }
  > = {
    New: { dot: '#3b82f6', bg: '#dbeafe', text: '#2563eb' },
    Contacted: { dot: '#f97316', bg: '#ffedd5', text: '#ea580c' },
    'Visit Scheduled': { dot: '#22c55e', bg: '#dcfce7', text: '#15803d' },
  }

  const sc = map[status]

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold border border-transparent"
      style={{ background: sc.bg, color: sc.text }}
    >
      <span
        className="w-2 h-2 rounded-full inline-block"
        style={{ background: sc.dot }}
      />
      {status}
    </span>
  )
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number
  totalPages: number
  onPageChange: (next: number) => void
}) {
  const pageNumbers = useMemo(() => {
    // Matches screenshot pattern: 1 2 3 ... last
    const base: (number | '...')[] = [1, 2, 3]
    if (totalPages > 4) base.push('...', totalPages)
    else for (let p = 4; p <= totalPages; p++) base.push(p)
    return base
  }, [totalPages])

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="w-8 h-8 rounded-md border border-outline bg-white/50 hover:bg-hover-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={page === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} className="mx-auto text-text-muted" />
      </button>

      <div className="flex items-center gap-2">
        {pageNumbers.map((n, idx) =>
          n === '...' ? (
            <span key={`e-${idx}`} className="text-label text-text-muted px-1">
              ...
            </span>
          ) : (
            <button
              key={n}
              type="button"
              onClick={() => onPageChange(Number(n))}
              aria-current={n === page ? 'page' : undefined}
              className={[
                'w-8 h-8 rounded-md border border-outline transition-colors',
                n === page
                  ? 'bg-[#0f172a] text-white border-[#0f172a]'
                  : 'bg-white/50 text-text-muted hover:bg-hover-light',
              ].join(' ')}
            >
              {n}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        className="w-8 h-8 rounded-md border border-outline bg-white/50 hover:bg-hover-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={page === totalPages}
        aria-label="Next page"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
      >
        <ChevronRight size={16} className="mx-auto text-text-muted" />
      </button>
    </div>
  )
}

export function BrokerClients() {
  const [page, setPage] = useState(1)
  const [plansModalOpen, setPlansModalOpen] = useState(false)

  const totalLeads = 42
  const totalPages = 14
  const leads: Lead[] = useMemo(
    () => [
      {
        id: '1',
        avatar: sarahJenkinsImg,
        name: 'Eleonor Vance',
        email: 'e.vance@example.com',
        interestedProperty: 'Zenith Penthouse',
        receivedDate: { date: 'Oct 24, 2023', meta: '2 hours ago' },
        status: 'New',
      },
      {
        id: '2',
        avatar: julianVaneImg,
        name: 'Julian Thorne',
        email: 'j.thorne.archeweb.com',
        interestedProperty: 'Harbor View',
        receivedDate: { date: 'Oct 23, 2023', meta: '1 day ago' },
        status: 'Contacted',
      },
      {
        id: '3',
        avatar: brokerProfileImg,
        name: 'Marcus Chen',
        email: 'ch.m@agency.org',
        interestedProperty: 'Industrial Loft',
        receivedDate: { date: 'Oct 21, 2023', meta: '3 days ago' },
        status: 'Visit Scheduled',
      },
    ],
    [],
  )

  const shownCount = 3
  const newLeadsCount = 24
  const visitsSetCount = 12

  return (
    <div className="space-y-10 pb-10">
      {/* ── Breadcrumb + Heading ── */}
      <div>
        <div className="text-[12px] text-text-muted flex items-center gap-1">
          <span>Tenants</span>
          <span className="text-text-muted/70">›</span>
          <span className="font-semibold text-text-muted">Leads Management</span>
        </div>
        <h1 className="text-[34px] font-extrabold tracking-tight text-[#0f172a] mt-2">
          Leads Management
        </h1>
        <p className="text-[14px] text-text-muted mt-2 max-w-2xl">
          Manage incoming inquiries and nurture prospective tenants for your portfolio.
        </p>
      </div>

      {/* ── Summary cards ── */}
      <div className="flex items-stretch justify-end gap-4">
        <div className="bg-white border border-outline rounded-xl px-5 py-4 shadow-ambient flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary">
            <UserPlus size={18} />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-text-muted">New Leads</p>
            <p className="text-[20px] font-bold leading-none text-[#0f172a] mt-1">
              {newLeadsCount}
            </p>
          </div>
        </div>

        <div className="bg-white border border-outline rounded-xl px-5 py-4 shadow-ambient flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary">
            <CalendarDays size={18} />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-text-muted">Visits Set</p>
            <p className="text-[20px] font-bold leading-none text-[#0f172a] mt-1">
              {visitsSetCount}
            </p>
          </div>
        </div>
      </div>

      {/* ── Leads table card ── */}
      <div className="bg-white border border-outline rounded-xl shadow-ambient overflow-hidden">
        {/* Top controls */}
        <div className="p-5 border-b border-outline">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                  />
                  <input
                    className="w-[250px] pl-9 pr-4 py-2 rounded-lg bg-canvas border border-outline text-body text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    placeholder="Search by name or property"
                    defaultValue=""
                  />
                </div>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-outline bg-white hover:bg-hover-light transition-colors shadow-ambient"
                >
                  <Filter size={14} className="text-text-muted" />
                  <span className="text-label text-text-muted font-semibold">Status: All</span>
                  <ChevronDown size={14} className="text-text-muted" />
                </button>
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-outline bg-white hover:bg-hover-light transition-colors shadow-ambient w-fit"
              >
                <CalendarDays size={14} className="text-text-muted" />
                <span className="text-label text-text-muted font-semibold">
                  Received: Last 30 Days
                </span>
                <ChevronDown size={14} className="text-text-muted" />
              </button>
            </div>

            <div className="flex items-center gap-3 pt-0.5">
              <button
                type="button"
                className="inline-flex items-center gap-2 text-label font-semibold text-text-muted hover:text-primary transition-colors"
                onClick={() => {}}
              >
                <Download size={14} />
                Export
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0f172a] text-white text-label font-bold hover:bg-navy/90 transition-colors shadow-ambient"
                onClick={() => {}}
              >
                <Plus size={14} />
                Add Lead
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-outline">
                <th className="text-left px-6 py-4 text-label font-semibold uppercase tracking-wider text-text-muted">
                  Tenant Name
                </th>
                <th className="text-left px-6 py-4 text-label font-semibold uppercase tracking-wider text-text-muted">
                  Interested Property
                </th>
                <th className="text-left px-6 py-4 text-label font-semibold uppercase tracking-wider text-text-muted">
                  Received Date
                </th>
                <th className="text-left px-6 py-4 text-label font-semibold uppercase tracking-wider text-text-muted">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-label font-semibold uppercase tracking-wider text-text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-outline last:border-b-0">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={lead.avatar}
                        alt={lead.name}
                        className="w-10 h-10 rounded-full object-cover bg-slate-200"
                      />
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-[#0f172a] truncate">
                          {lead.name}
                        </p>
                        <p className="text-label text-text-muted truncate">
                          {lead.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="text-text-muted mt-0.5" />
                      <div className="leading-tight">
                        <p className="text-[13px] font-semibold text-[#0f172a]">
                          {lead.interestedProperty.split(' ').slice(0, 1).join(' ')}
                        </p>
                        <p className="text-[12px] text-text-muted">
                          {lead.interestedProperty
                            .split(' ')
                            .slice(1)
                            .join(' ')
                            .trim() || lead.interestedProperty}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div>
                      {(() => {
                        const parts = lead.receivedDate.date.split(',')
                        const top = parts[0]?.trim() ?? lead.receivedDate.date
                        const bottom = parts[1]?.trim() ?? ''
                        return (
                          <>
                            <p className="text-[13px] font-semibold text-[#0f172a] leading-tight">
                              {top}
                            </p>
                            {bottom && (
                              <p className="text-[13px] font-semibold text-[#0f172a] leading-tight">
                                {bottom}
                              </p>
                            )}
                          </>
                        )
                      })()}
                      <p className="text-label text-text-muted mt-1">{lead.receivedDate.meta}</p>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <StatusPill status={lead.status} />
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-label text-text-muted">—</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom: showing + pagination */}
        <div className="flex items-center justify-between px-6 py-4">
          <p className="text-label text-text-muted">
            Showing {shownCount} of {totalLeads} leads
          </p>

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      {/* ── In-demand properties CTA section ── */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-[#0f172a]">In-Demand Properties</h2>
          <button
            type="button"
            className="text-label font-semibold text-text-muted hover:text-primary transition-colors inline-flex items-center gap-1"
            onClick={() => {}}
          >
            View All Listings <ChevronRight size={14} />
          </button>
        </div>

        <div className="flex items-center justify-center gap-6">
          {/* Left blurred placeholder */}
          <div className="w-[240px] h-[150px] rounded-2xl bg-white border border-outline shadow-ambient blur-[2px] opacity-50 pointer-events-none">
            <div className="p-6">
              <div className="h-4 bg-hover-light rounded w-3/4" />
              <div className="mt-3 h-3 bg-hover-light rounded w-2/3" />
              <div className="mt-8 h-8 bg-hover-light rounded w-full" />
            </div>
          </div>

          {/* Middle CTA */}
          <div className="w-[380px] rounded-2xl bg-white border border-outline shadow-ambient p-10 text-center">
            <p className="text-[12px] font-extrabold uppercase tracking-wider text-[#0f172a] leading-tight">
              Explore the plans to view in demanded properties
            </p>
            <button
              type="button"
              className="mt-6 inline-flex items-center justify-center gap-2 bg-[#0f172a] text-white text-label font-bold rounded-lg px-6 py-3 hover:bg-navy/90 transition-colors"
              onClick={() => setPlansModalOpen(true)}
            >
              View Plans
            </button>
          </div>

          {/* Right blurred placeholder */}
          <div className="w-[240px] h-[150px] rounded-2xl bg-white border border-outline shadow-ambient blur-[2px] opacity-50 pointer-events-none">
            <div className="p-6">
              <div className="h-4 bg-hover-light rounded w-3/5" />
              <div className="mt-3 h-3 bg-hover-light rounded w-2/3" />
              <div className="mt-8 h-8 bg-hover-light rounded w-full" />
            </div>
          </div>
        </div>
      </div>

      <ManagementTiersModal
        isOpen={plansModalOpen}
        onClose={() => setPlansModalOpen(false)}
      />
    </div>
  )
}
