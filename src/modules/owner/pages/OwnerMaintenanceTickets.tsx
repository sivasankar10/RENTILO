import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Clock,
  ClipboardList,
  Home,
  MessageSquare,
  Phone,
  Search,
  Send,
  UserRound,
  Wrench,
} from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { OWNER_MANAGED_PROPERTIES, useOwnerStore } from '../store/ownerStore'
import {
  useOwnerMaintenanceStore,
  type TicketPriority,
  type TicketStatus,
} from '../store/maintenanceStore'

const ticketStatuses: TicketStatus[] = ['Open', 'In Progress', 'Resolved', 'Closed']

const statusStyles: Record<TicketStatus, { dot: string; badge: string }> = {
  Open: { dot: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700' },
  'In Progress': { dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700' },
  Resolved: { dot: 'bg-green-500', badge: 'bg-green-50 text-green-700' },
  Closed: { dot: 'bg-slate-400', badge: 'bg-slate-100 text-slate-600' },
}

const priorityStyles: Record<TicketPriority, string> = {
  Low: 'bg-slate-100 text-slate-600',
  Medium: 'bg-sky-50 text-sky-700',
  High: 'bg-orange-50 text-orange-700',
  Urgent: 'bg-red-50 text-red-700',
}

function StatusBadge({ status }: { status: TicketStatus }) {
  const style = statusStyles[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-badge font-bold', style.badge)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', style.dot)} />
      {status}
    </span>
  )
}

function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return (
    <span className={cn('inline-flex items-center rounded-pill px-2.5 py-1 text-badge font-bold', priorityStyles[priority])}>
      {priority}
    </span>
  )
}

export function OwnerMaintenanceTickets() {
  const selectedPropertyId = useOwnerStore((state) => state.selectedPropertyId)
  const setSelectedProperty = useOwnerStore((state) => state.setSelectedProperty)
  const tickets = useOwnerMaintenanceStore((state) => state.tickets)
  const updateTicket = useOwnerMaintenanceStore((state) => state.updateTicket)
  const sendTicketMessage = useOwnerMaintenanceStore((state) => state.sendTicketMessage)
  const [activeTicketId, setActiveTicketId] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'All'>('All')
  const [chatDraft, setChatDraft] = useState('')
  const [callStatus, setCallStatus] = useState('')

  const currentPropertyId = selectedPropertyId ?? OWNER_MANAGED_PROPERTIES[0]?.id ?? ''
  const selectedProperty = OWNER_MANAGED_PROPERTIES.find((property) => property.id === currentPropertyId)

  const propertyTickets = useMemo(
    () => tickets.filter((ticket) => ticket.propertyId === currentPropertyId),
    [currentPropertyId, tickets]
  )

  useEffect(() => {
    if (!propertyTickets.some((ticket) => ticket.id === activeTicketId)) {
      setActiveTicketId(propertyTickets[0]?.id ?? '')
    }
  }, [activeTicketId, propertyTickets])

  const filteredTickets = useMemo(() => {
    const query = search.trim().toLowerCase()
    return propertyTickets.filter((ticket) => {
      const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter
      const matchesSearch =
        !query ||
        ticket.ticketNo.toLowerCase().includes(query) ||
        ticket.tenantName.toLowerCase().includes(query) ||
        ticket.category.toLowerCase().includes(query) ||
        ticket.problem.toLowerCase().includes(query) ||
        ticket.unit.toLowerCase().includes(query)

      return matchesStatus && matchesSearch
    })
  }, [propertyTickets, search, statusFilter])

  const activeTicket =
    tickets.find((ticket) => ticket.id === activeTicketId && ticket.propertyId === currentPropertyId) ??
    propertyTickets[0]

  const summary = useMemo(
    () => ({
      open: propertyTickets.filter((ticket) => ticket.status === 'Open').length,
      inProgress: propertyTickets.filter((ticket) => ticket.status === 'In Progress').length,
      resolved: propertyTickets.filter((ticket) => ticket.status === 'Resolved').length,
    }),
    [propertyTickets]
  )

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!activeTicket || !chatDraft.trim()) return

    sendTicketMessage(activeTicket.id, chatDraft.trim())
    setChatDraft('')
  }

  const handleCallTenant = () => {
    if (!activeTicket) return

    setCallStatus(`Calling ${activeTicket.tenantName} at ${activeTicket.tenantPhone}...`)
    window.setTimeout(() => {
      setCallStatus(`Call request logged for ${activeTicket.tenantName}.`)
    }, 900)
  }

  return (
    <div className="min-h-screen bg-canvas-alt px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-label font-semibold uppercase tracking-widest text-text-muted">Owner Operations</p>
            <h1 className="mt-2 text-heading-1 font-bold tracking-tight text-text-primary">Maintenance Tickets</h1>
            <p className="mt-2 max-w-2xl text-body text-text-muted">
              Review tenant maintenance requests for the selected property, update status, and contact tenants directly.
            </p>
          </div>

          <label className="w-full max-w-sm">
            <span className="text-label font-bold uppercase tracking-widest text-text-muted">Selected Property</span>
            <select
              value={currentPropertyId}
              onChange={(event) => setSelectedProperty(event.target.value)}
              className="mt-2 h-11 w-full rounded-input border border-outline bg-white px-3 text-body font-semibold text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary-100"
            >
              {OWNER_MANAGED_PROPERTIES.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.name} - {property.unit}
                </option>
              ))}
            </select>
          </label>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-card border border-outline bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-button bg-blue-50 text-blue-700">
                <ClipboardList size={18} />
              </div>
              <div>
                <p className="text-label font-bold uppercase tracking-widest text-text-muted">Open</p>
                <p className="text-heading-3 font-bold text-text-primary">{summary.open}</p>
              </div>
            </div>
          </div>
          <div className="rounded-card border border-outline bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-button bg-amber-50 text-amber-700">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-label font-bold uppercase tracking-widest text-text-muted">In Progress</p>
                <p className="text-heading-3 font-bold text-text-primary">{summary.inProgress}</p>
              </div>
            </div>
          </div>
          <div className="rounded-card border border-outline bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-button bg-green-50 text-green-700">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <p className="text-label font-bold uppercase tracking-widest text-text-muted">Resolved</p>
                <p className="text-heading-3 font-bold text-text-primary">{summary.resolved}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <section className="space-y-4">
            <div className="rounded-card border border-outline bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-heading-3 font-bold text-text-primary">
                    {selectedProperty?.name ?? 'Selected Property'}
                  </h2>
                  <p className="mt-1 flex items-center gap-2 text-label text-text-muted">
                    <Home size={14} />
                    {selectedProperty?.unit ?? 'Property'} - {selectedProperty?.address ?? 'Address unavailable'}
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative min-w-[240px] flex-1">
                    <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search tickets, tenants..."
                      className="h-11 w-full rounded-input border border-outline bg-white pl-10 pr-4 text-body text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value as TicketStatus | 'All')}
                    className="h-11 rounded-input border border-outline bg-white px-3 text-body font-semibold text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary-100"
                  >
                    <option value="All">All Status</option>
                    {ticketStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-card border border-outline bg-white shadow-sm">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => {
                  const active = activeTicket?.id === ticket.id
                  return (
                    <button
                      type="button"
                      key={ticket.id}
                      onClick={() => {
                        setActiveTicketId(ticket.id)
                        setCallStatus('')
                      }}
                      className={cn(
                        'block w-full border-b border-outline px-5 py-5 text-left transition-colors last:border-0',
                        active ? 'bg-primary-100/60' : 'bg-white hover:bg-hover-light'
                      )}
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-label font-bold uppercase tracking-widest text-text-muted">
                              {ticket.ticketNo}
                            </span>
                            <StatusBadge status={ticket.status} />
                            <PriorityBadge priority={ticket.priority} />
                          </div>
                          <h3 className="mt-3 text-body-lg font-bold text-text-primary">
                            {ticket.category} issue in {ticket.unit}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-body text-text-muted">{ticket.problem}</p>
                          <div className="mt-4 flex flex-wrap gap-3 text-label text-text-muted">
                            <span className="inline-flex items-center gap-1.5">
                              <UserRound size={14} />
                              {ticket.tenantName}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarClock size={14} />
                              {ticket.preferredSlot}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-start gap-2 lg:items-end">
                          <p className="text-label font-semibold text-text-primary">{ticket.submittedAt}</p>
                          <p className="text-label text-text-muted">Updated {ticket.lastUpdated}</p>
                          <p className="rounded-pill bg-canvas-alt px-3 py-1 text-label font-semibold text-text-muted">
                            {ticket.assignedTo}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })
              ) : (
                <div className="py-16 text-center">
                  <Wrench size={42} className="mx-auto text-text-muted" />
                  <p className="mt-3 text-body font-bold text-text-primary">No tickets found</p>
                  <p className="mt-1 text-label text-text-muted">Try another search or status filter.</p>
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-4">
            {activeTicket ? (
              <>
                <section className="rounded-card border border-outline bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-label font-bold uppercase tracking-widest text-text-muted">Active Ticket</p>
                      <h2 className="mt-1 text-heading-3 font-bold text-text-primary">{activeTicket.ticketNo}</h2>
                    </div>
                    <StatusBadge status={activeTicket.status} />
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <img
                      src={activeTicket.tenantAvatar}
                      alt={activeTicket.tenantName}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-body font-bold text-text-primary">{activeTicket.tenantName}</p>
                      <p className="text-label text-text-muted">{activeTicket.tenantPhone}</p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    <label className="block">
                      <span className="text-label font-bold uppercase tracking-widest text-text-muted">Status</span>
                      <select
                        value={activeTicket.status}
                        onChange={(event) =>
                          updateTicket(activeTicket.id, { status: event.target.value as TicketStatus })
                        }
                        className="mt-2 h-11 w-full rounded-input border border-outline bg-white px-3 text-body font-semibold text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary-100"
                      >
                        {ticketStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-label font-bold uppercase tracking-widest text-text-muted">Assigned Vendor</span>
                      <input
                        value={activeTicket.assignedTo}
                        onChange={(event) => updateTicket(activeTicket.id, { assignedTo: event.target.value })}
                        className="mt-2 h-11 w-full rounded-input border border-outline bg-white px-3 text-body text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary-100"
                      />
                    </label>

                    <label className="block">
                      <span className="text-label font-bold uppercase tracking-widest text-text-muted">Owner Note</span>
                      <textarea
                        value={activeTicket.ownerNote}
                        onChange={(event) => updateTicket(activeTicket.id, { ownerNote: event.target.value })}
                        rows={3}
                        className="mt-2 w-full resize-none rounded-input border border-outline bg-white px-3 py-3 text-body text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary-100"
                      />
                    </label>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleCallTenant}
                      className="inline-flex items-center justify-center gap-2 rounded-button bg-navy px-4 py-3 text-body font-semibold text-white transition-colors hover:bg-slate-800"
                    >
                      <Phone size={16} />
                      Call
                    </button>
                    <a
                      href={`sms:${activeTicket.tenantPhone}`}
                      className="inline-flex items-center justify-center gap-2 rounded-button border border-outline bg-white px-4 py-3 text-body font-semibold text-text-primary transition-colors hover:bg-hover-light"
                    >
                      <MessageSquare size={16} />
                      SMS
                    </a>
                  </div>
                  {callStatus && (
                    <p className="mt-3 rounded-button bg-primary-100 px-3 py-2 text-label font-semibold text-primary">
                      {callStatus}
                    </p>
                  )}
                </section>

                <section className="rounded-card border border-outline bg-white shadow-sm">
                  <div className="border-b border-outline px-5 py-4">
                    <h2 className="text-body-lg font-bold text-text-primary">Ticket Chat</h2>
                    <p className="mt-1 text-label text-text-muted">Session messages with {activeTicket.tenantName}</p>
                  </div>

                  <div className="max-h-[360px] space-y-3 overflow-y-auto px-5 py-4">
                    {activeTicket.messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          'flex',
                          message.sender === 'owner' ? 'justify-end' : 'justify-start'
                        )}
                      >
                        <div
                          className={cn(
                            'max-w-[85%] rounded-2xl px-4 py-3 text-body shadow-sm',
                            message.sender === 'owner'
                              ? 'rounded-br-sm bg-navy text-white'
                              : 'rounded-bl-sm bg-canvas-alt text-text-primary'
                          )}
                        >
                          <p>{message.text}</p>
                          <p
                            className={cn(
                              'mt-1 text-[11px] font-semibold',
                              message.sender === 'owner' ? 'text-white/70' : 'text-text-muted'
                            )}
                          >
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="border-t border-outline p-4">
                    <div className="flex items-center gap-2 rounded-input border border-outline bg-white px-3 py-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary-100">
                      <input
                        value={chatDraft}
                        onChange={(event) => setChatDraft(event.target.value)}
                        placeholder="Message tenant..."
                        className="h-9 min-w-0 flex-1 border-0 bg-transparent text-body text-text-primary outline-none placeholder:text-text-muted"
                      />
                      <button
                        type="submit"
                        disabled={!chatDraft.trim()}
                        className={cn(
                          'flex h-9 w-9 items-center justify-center rounded-full transition-colors',
                          chatDraft.trim()
                            ? 'bg-navy text-white hover:bg-slate-800'
                            : 'cursor-not-allowed bg-slate-100 text-text-muted'
                        )}
                        aria-label="Send message"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </form>
                </section>
              </>
            ) : (
              <section className="rounded-card border border-outline bg-white p-8 text-center shadow-sm">
                <AlertTriangle size={36} className="mx-auto text-text-muted" />
                <p className="mt-3 text-body font-bold text-text-primary">No ticket selected</p>
                <p className="mt-1 text-label text-text-muted">Select a request to edit status or contact the tenant.</p>
              </section>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}
