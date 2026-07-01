import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Download,
  Filter,
  MapPin,
  MessageCircle,
  MoreVertical,
  Phone,
  Search,
  UserPlus,
} from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { ManagementTiersModal } from '../components/ManagementTiersModal'
import { useBrokerPrototype } from '../hooks/useBrokerPrototype'

type LeadStatus = 'New' | 'Contacted' | 'Visit Scheduled'
type StatusFilter = 'All' | LeadStatus
type ReceivedFilter = 'All Time' | 'Last 30 Days' | 'Last 7 Days' | 'Today'

type Lead = {
  id: string
  avatar: string
  name: string
  email: string
  interestedProperty: string
  receivedDate: { date: string; meta: string }
  daysAgo: number
  status: LeadStatus
  conversationId: string
}

const STATUS_OPTIONS: StatusFilter[] = ['All', 'New', 'Contacted', 'Visit Scheduled']
const RECEIVED_OPTIONS: ReceivedFilter[] = ['Last 30 Days', 'Last 7 Days', 'Today', 'All Time']
const LEADS_PER_PAGE = 3

function escapeCsvValue(value: string | number) {
  const text = String(value)
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }

  return text
}

function downloadLeadCsv(leads: Lead[]) {
  const headers = ['Name', 'Email', 'Interested Property', 'Received Date', 'Received', 'Status']
  const rows = leads.map((lead) => [
    lead.name,
    lead.email,
    lead.interestedProperty,
    lead.receivedDate.date,
    lead.receivedDate.meta,
    lead.status,
  ])
  const csv = [headers, ...rows].map((row) => row.map(escapeCsvValue).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'rentilo-broker-tenant-leads.csv'
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
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
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1)
    }

    const middle = Math.min(Math.max(page, 2), totalPages - 1)
    const pages: (number | '...')[] = [1]

    if (middle > 2) pages.push('...')
    pages.push(middle)
    if (middle < totalPages - 1) pages.push('...')
    pages.push(totalPages)

    return pages
  }, [page, totalPages])

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="w-8 h-8 rounded-md border border-outline bg-white/50 hover:bg-hover-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={page === 1}
        aria-label="Previous page"
        onClick={() => onPageChange(Math.max(1, page - 1))}
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
  const navigate = useNavigate()
  const { leads: applications, users, properties, chats } = useBrokerPrototype()
  const allLeads = useMemo<Lead[]>(() => applications.map((application) => {
    const tenant = users.find((user) => user.id === application.tenantId)
    const property = properties.find((item) => item.id === application.propertyId)
    const thread = chats.find((item) => item.applicationId === application.id)
    const created = new Date(application.createdAt)
    const daysAgo = Math.max(0, Math.floor((Date.now() - created.getTime()) / 86400000))
    const status: LeadStatus = application.status === 'interest_shown'
      ? 'New'
      : application.status === 'visit_scheduled' || application.status === 'visit_confirmed'
        ? 'Visit Scheduled'
        : 'Contacted'
    return {
      id: application.id,
      avatar: tenant?.avatar ?? '',
      name: tenant ? `${tenant.firstName} ${tenant.lastName}` : application.tenantId,
      email: tenant?.email ?? '',
      interestedProperty: property?.title ?? application.propertyId,
      receivedDate: {
        date: created.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        meta: daysAgo === 0 ? 'Today' : `${daysAgo} days ago`,
      },
      daysAgo,
      status,
      conversationId: thread?.id ?? application.id,
    }
  }), [applications, chats, properties, users])
  const [page, setPage] = useState(1)
  const [plansModalOpen, setPlansModalOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')
  const [receivedFilter, setReceivedFilter] = useState<ReceivedFilter>('Last 30 Days')
  const [openActionId, setOpenActionId] = useState<string | null>(null)
  const [actionStatus, setActionStatus] = useState('')

  const filteredLeads = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return allLeads.filter((lead) => {
      const matchesSearch =
        !normalizedSearch ||
        [lead.name, lead.email, lead.interestedProperty]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch)

      const matchesStatus = statusFilter === 'All' || lead.status === statusFilter

      const matchesReceived =
        receivedFilter === 'All Time' ||
        (receivedFilter === 'Today' && lead.daysAgo === 0) ||
        (receivedFilter === 'Last 7 Days' && lead.daysAgo <= 7) ||
        (receivedFilter === 'Last 30 Days' && lead.daysAgo <= 30)

      return matchesSearch && matchesStatus && matchesReceived
    })
  }, [allLeads, search, statusFilter, receivedFilter])

  const totalLeads = filteredLeads.length
  const totalPages = Math.max(1, Math.ceil(totalLeads / LEADS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * LEADS_PER_PAGE,
    currentPage * LEADS_PER_PAGE,
  )
  const shownFrom = totalLeads === 0 ? 0 : (currentPage - 1) * LEADS_PER_PAGE + 1
  const shownTo = Math.min(currentPage * LEADS_PER_PAGE, totalLeads)
  const newLeadsCount = allLeads.filter((lead) => lead.status === 'New').length
  const visitsSetCount = allLeads.filter((lead) => lead.status === 'Visit Scheduled').length

  const resetToFirstPage = () => {
    setPage(1)
    setOpenActionId(null)
  }

  const openLeadChat = (lead: Lead) => {
    navigate(`${ROUTES.BROKER.MESSAGES}?conversation=${encodeURIComponent(lead.conversationId)}`)
  }

  const callLead = (lead: Lead) => {
    setActionStatus(`Calling ${lead.name} for ${lead.interestedProperty}.`)
    setOpenActionId(null)
  }

  const exportLeads = () => {
    downloadLeadCsv(filteredLeads)
    setActionStatus(`Exported ${filteredLeads.length} leads.`)
  }

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
                    type="search"
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value)
                      resetToFirstPage()
                    }}
                    className="w-[250px] pl-9 pr-4 py-2 rounded-lg bg-canvas border border-outline text-body text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    placeholder="Search by name or property"
                  />
                </div>

                <label className="relative inline-flex items-center gap-2 rounded-lg border border-outline bg-white px-4 py-2 shadow-ambient transition-colors hover:bg-hover-light">
                  <Filter size={14} className="text-text-muted" />
                  <span className="text-label font-semibold text-text-muted">Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(event) => {
                      setStatusFilter(event.target.value as StatusFilter)
                      resetToFirstPage()
                    }}
                    className="appearance-none bg-transparent pr-6 text-label font-semibold text-text-muted outline-none"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 text-text-muted" />
                </label>
              </div>

              <label className="relative inline-flex w-fit items-center gap-2 rounded-lg border border-outline bg-white px-4 py-2 shadow-ambient transition-colors hover:bg-hover-light">
                <CalendarDays size={14} className="text-text-muted" />
                <span className="text-label font-semibold text-text-muted">Received:</span>
                <select
                  value={receivedFilter}
                  onChange={(event) => {
                    setReceivedFilter(event.target.value as ReceivedFilter)
                    resetToFirstPage()
                  }}
                  className="appearance-none bg-transparent pr-6 text-label font-semibold text-text-muted outline-none"
                >
                  {RECEIVED_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 text-text-muted" />
              </label>
            </div>

            <div className="flex items-center gap-3 pt-0.5">
              <button
                type="button"
                className="inline-flex items-center gap-2 text-label font-semibold text-text-muted hover:text-primary transition-colors"
                onClick={exportLeads}
              >
                <Download size={14} />
                Export
              </button>
            </div>
          </div>
          {actionStatus && (
            <p className="mt-3 text-label font-semibold text-primary">{actionStatus}</p>
          )}
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
              {paginatedLeads.map((lead) => (
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
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenActionId((current) => (current === lead.id ? null : lead.id))
                        }
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-outline bg-white text-text-muted transition-colors hover:bg-hover-light hover:text-[#0f172a]"
                        aria-label={`Open actions for ${lead.name}`}
                        aria-expanded={openActionId === lead.id}
                      >
                        <MoreVertical size={16} />
                      </button>

                      {openActionId === lead.id && (
                        <div className="absolute right-0 top-10 z-30 w-40 overflow-hidden rounded-xl border border-outline bg-white shadow-card">
                          <button
                            type="button"
                            onClick={() => openLeadChat(lead)}
                            className="flex w-full items-center gap-2 px-4 py-3 text-left text-label font-semibold text-[#0f172a] hover:bg-primary-50"
                          >
                            <MessageCircle size={15} />
                            Chat
                          </button>
                          <button
                            type="button"
                            onClick={() => callLead(lead)}
                            className="flex w-full items-center gap-2 px-4 py-3 text-left text-label font-semibold text-[#0f172a] hover:bg-primary-50"
                          >
                            <Phone size={15} />
                            Call
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Search size={32} className="mx-auto text-slate-300" />
                    <p className="mt-3 text-[14px] font-bold text-[#0f172a]">No leads found</p>
                    <p className="mt-1 text-label text-text-muted">
                      Try changing the search term, status, or received date filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom: showing + pagination */}
        <div className="flex items-center justify-between px-6 py-4">
          <p className="text-label text-text-muted">
            Showing {shownFrom}-{shownTo} of {totalLeads} leads
          </p>

        <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      {/* ── In-demand properties CTA section ── */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-[#0f172a]">In-Demand Properties</h2>
          <button
            type="button"
            className="text-label font-semibold text-text-muted hover:text-primary transition-colors inline-flex items-center gap-1"
            onClick={() => navigate(ROUTES.BROKER.LISTINGS)}
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
