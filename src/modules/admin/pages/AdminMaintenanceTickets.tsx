import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
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
  ShieldAlert,
  UserRound,
  Wrench,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { OWNER_MANAGED_PROPERTIES } from '@modules/owner/store/ownerStore'
import {
  useOwnerMaintenanceStore,
  type OwnerMaintenanceTicket,
  type TicketCategory,
  type TicketPriority,
  type TicketStatus,
} from '@modules/owner/store/maintenanceStore'
import { toast } from '../components/Toast'

const ticketStatuses: TicketStatus[] = ['Open', 'In Progress', 'Resolved', 'Closed']
const ticketPriorities: TicketPriority[] = ['Low', 'Medium', 'High', 'Urgent']

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

function getProperty(propertyId: string) {
  return OWNER_MANAGED_PROPERTIES.find((property) => property.id === propertyId)
}

function getPropertyName(ticket: OwnerMaintenanceTicket) {
  return getProperty(ticket.propertyId)?.name ?? ticket.propertyId.replace(/-/g, ' ')
}

function getPropertyAddress(ticket: OwnerMaintenanceTicket) {
  return getProperty(ticket.propertyId)?.address ?? 'Address unavailable'
}

export function AdminMaintenanceTickets() {
  const tickets = useOwnerMaintenanceStore((state) => state.tickets)
  const updateTicket = useOwnerMaintenanceStore((state) => state.updateTicket)
  const sendTicketMessage = useOwnerMaintenanceStore((state) => state.sendTicketMessage)

  const [activeTicketId, setActiveTicketId] = useState('')
  const [search, setSearch] = useState('')
  const [propertyFilter, setPropertyFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'All'>('All')
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'All'>('All')
  const [categoryFilter, setCategoryFilter] = useState<TicketCategory | 'All'>('All')
  const [chatDraft, setChatDraft] = useState('')
  const [callStatus, setCallStatus] = useState('')
  const chatSectionRef = useRef<HTMLElement>(null)
  const chatInputRef = useRef<HTMLInputElement>(null)

  const categories = useMemo(
    () => Array.from(new Set(tickets.map((ticket) => ticket.category))),
    [tickets]
  )

  const filteredTickets = useMemo(() => {
    const query = search.trim().toLowerCase()

    return tickets.filter((ticket) => {
      const propertyName = getPropertyName(ticket).toLowerCase()
      const matchesProperty = propertyFilter === 'All' || ticket.propertyId === propertyFilter
      const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter
      const matchesPriority = priorityFilter === 'All' || ticket.priority === priorityFilter
      const matchesCategory = categoryFilter === 'All' || ticket.category === categoryFilter
      const matchesSearch =
        !query ||
        ticket.ticketNo.toLowerCase().includes(query) ||
        ticket.tenantName.toLowerCase().includes(query) ||
        ticket.category.toLowerCase().includes(query) ||
        ticket.priority.toLowerCase().includes(query) ||
        ticket.problem.toLowerCase().includes(query) ||
        ticket.unit.toLowerCase().includes(query) ||
        ticket.assignedTo.toLowerCase().includes(query) ||
        propertyName.includes(query)

      return matchesProperty && matchesStatus && matchesPriority && matchesCategory && matchesSearch
    })
  }, [categoryFilter, priorityFilter, propertyFilter, search, statusFilter, tickets])

  useEffect(() => {
    if (!filteredTickets.some((ticket) => ticket.id === activeTicketId)) {
      setActiveTicketId(filteredTickets[0]?.id ?? '')
      setCallStatus('')
    }
  }, [activeTicketId, filteredTickets])

  const activeTicket =
    tickets.find((ticket) => ticket.id === activeTicketId) ?? filteredTickets[0]

  const summary = useMemo(
    () => ({
      total: tickets.length,
      open: tickets.filter((ticket) => ticket.status === 'Open').length,
      urgent: tickets.filter((ticket) => ticket.priority === 'Urgent').length,
      resolved: tickets.filter((ticket) => ticket.status === 'Resolved' || ticket.status === 'Closed').length,
    }),
    [tickets]
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
      toast.success('Call logged', `${activeTicket.ticketNo} call activity was recorded.`)
    }, 800)
  }

  const handleOpenChat = () => {
    chatSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.setTimeout(() => chatInputRef.current?.focus(), 350)
  }

  const handleStatusChange = (status: TicketStatus) => {
    if (!activeTicket) return

    updateTicket(activeTicket.id, { status })
    toast.success('Ticket updated', `${activeTicket.ticketNo} moved to ${status}.`)
  }

  return (
    <div className="min-h-screen bg-canvas-alt px-2 py-4 sm:px-4">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-label font-semibold uppercase tracking-widest text-text-muted">Admin Operations</p>
            <h1 className="mt-2 text-heading-1 font-bold tracking-tight text-text-primary">Maintenance Tickets</h1>
            <p className="mt-2 max-w-2xl text-body text-text-muted">
              Monitor tenant maintenance requests across all properties, update ownership workflow, and contact tenants from one place.
            </p>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <SummaryCard icon={ClipboardList} label="Total Tickets" value={summary.total} tone="primary" />
          <SummaryCard icon={Clock} label="Open" value={summary.open} tone="info" />
          <SummaryCard icon={ShieldAlert} label="Urgent" value={summary.urgent} tone="danger" />
          <SummaryCard icon={CheckCircle2} label="Resolved / Closed" value={summary.resolved} tone="success" />
        </section>

        <section className="grid min-h-[680px] overflow-hidden rounded-card border border-outline bg-white shadow-surface xl:grid-cols-[390px_minmax(0,1fr)]">
          <aside className="flex min-h-0 flex-col border-b border-outline xl:border-b-0 xl:border-r">
            <div className="space-y-4 border-b border-outline p-4">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search ticket, tenant, property..."
                  className="h-11 w-full rounded-input border border-outline bg-white pl-10 pr-4 text-body text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary-100"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <SelectFilter
                  label="Property"
                  value={propertyFilter}
                  onChange={setPropertyFilter}
                  options={[
                    { value: 'All', label: 'All Properties' },
                    ...OWNER_MANAGED_PROPERTIES.map((property) => ({
                      value: property.id,
                      label: property.name,
                    })),
                  ]}
                />
                <SelectFilter
                  label="Status"
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value as TicketStatus | 'All')}
                  options={[
                    { value: 'All', label: 'All Status' },
                    ...ticketStatuses.map((status) => ({ value: status, label: status })),
                  ]}
                />
                <SelectFilter
                  label="Severity"
                  value={priorityFilter}
                  onChange={(value) => setPriorityFilter(value as TicketPriority | 'All')}
                  options={[
                    { value: 'All', label: 'All Severity' },
                    ...ticketPriorities.map((priority) => ({ value: priority, label: priority })),
                  ]}
                />
                <SelectFilter
                  label="Raised For"
                  value={categoryFilter}
                  onChange={(value) => setCategoryFilter(value as TicketCategory | 'All')}
                  options={[
                    { value: 'All', label: 'All Categories' },
                    ...categories.map((category) => ({ value: category, label: category })),
                  ]}
                />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <TicketListItem
                    key={ticket.id}
                    ticket={ticket}
                    active={ticket.id === activeTicket?.id}
                    onClick={() => {
                      setActiveTicketId(ticket.id)
                      setCallStatus('')
                    }}
                  />
                ))
              ) : (
                <div className="px-6 py-16 text-center">
                  <Wrench size={42} className="mx-auto text-text-muted" />
                  <p className="mt-3 text-body font-bold text-text-primary">No tickets found</p>
                  <p className="mt-1 text-label text-text-muted">Try another search or filter combination.</p>
                </div>
              )}
            </div>
          </aside>

          {activeTicket ? (
            <main className="flex min-h-0 flex-col">
              <div className="border-b border-outline p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-label font-bold uppercase tracking-widest text-text-muted">
                        {activeTicket.ticketNo}
                      </span>
                      <StatusBadge status={activeTicket.status} />
                      <PriorityBadge priority={activeTicket.priority} />
                    </div>
                    <h2 className="mt-2 text-heading-2 font-bold text-text-primary">
                      {getPropertyName(activeTicket)}
                    </h2>
                    <p className="mt-1 flex flex-wrap items-center gap-2 text-body text-text-muted">
                      <Home size={15} />
                      {getPropertyAddress(activeTicket)} - {activeTicket.unit}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleCallTenant}
                      className="inline-flex items-center justify-center gap-2 rounded-button bg-navy px-4 py-2.5 text-body font-semibold text-white transition-colors hover:bg-slate-800"
                    >
                      <Phone size={16} />
                      Call Tenant
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenChat}
                      className="inline-flex items-center justify-center gap-2 rounded-button border border-outline bg-white px-4 py-2.5 text-body font-semibold text-text-primary transition-colors hover:bg-hover-light"
                    >
                      <MessageSquare size={16} />
                      Chat
                    </button>
                  </div>
                </div>
                {callStatus && (
                  <p className="mt-4 rounded-button bg-primary-100 px-3 py-2 text-label font-semibold text-primary">
                    {callStatus}
                  </p>
                )}
              </div>

              <div className="grid gap-5 border-b border-outline p-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                <section className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <MetaTile icon={UserRound} label="Ticket Raised By" value={activeTicket.tenantName} subValue={activeTicket.tenantPhone} />
                    <MetaTile icon={Wrench} label="Raised For" value={activeTicket.category} subValue={activeTicket.problem} />
                    <MetaTile icon={ShieldAlert} label="Severity" value={activeTicket.priority} subValue={`Submitted ${activeTicket.submittedAt}`} />
                    <MetaTile icon={CalendarClock} label="Preferred Slot" value={activeTicket.preferredSlot} subValue={`Updated ${activeTicket.lastUpdated}`} />
                  </div>

                  <div className="rounded-card border border-outline bg-canvas-alt p-4">
                    <p className="text-label font-bold uppercase tracking-widest text-text-muted">Problem Details</p>
                    <p className="mt-2 text-body leading-relaxed text-text-primary">{activeTicket.problem}</p>
                  </div>
                </section>

                <section className="space-y-4">
                  <label className="block">
                    <span className="text-label font-bold uppercase tracking-widest text-text-muted">Status</span>
                    <select
                      value={activeTicket.status}
                      onChange={(event) => handleStatusChange(event.target.value as TicketStatus)}
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
                    <span className="text-label font-bold uppercase tracking-widest text-text-muted">Severity</span>
                    <select
                      value={activeTicket.priority}
                      onChange={(event) =>
                        updateTicket(activeTicket.id, { priority: event.target.value as TicketPriority })
                      }
                      className="mt-2 h-11 w-full rounded-input border border-outline bg-white px-3 text-body font-semibold text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary-100"
                    >
                      {ticketPriorities.map((priority) => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-label font-bold uppercase tracking-widest text-text-muted">Raised For</span>
                    <select
                      value={activeTicket.category}
                      onChange={(event) =>
                        updateTicket(activeTicket.id, { category: event.target.value as TicketCategory })
                      }
                      className="mt-2 h-11 w-full rounded-input border border-outline bg-white px-3 text-body font-semibold text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary-100"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
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
                    <span className="text-label font-bold uppercase tracking-widest text-text-muted">Admin / Owner Note</span>
                    <textarea
                      value={activeTicket.ownerNote}
                      onChange={(event) => updateTicket(activeTicket.id, { ownerNote: event.target.value })}
                      rows={5}
                      className="mt-2 w-full resize-none rounded-input border border-outline bg-white px-3 py-3 text-body text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary-100"
                    />
                  </label>
                </section>
              </div>

              <section ref={chatSectionRef} className="flex min-h-0 flex-1 scroll-mt-4 flex-col">
                <div className="border-b border-outline px-5 py-4">
                  <h3 className="text-body-lg font-bold text-text-primary">Ticket Chat</h3>
                  <p className="mt-1 text-label text-text-muted">
                    Session messages with {activeTicket.tenantName}
                  </p>
                </div>

                <div className="min-h-[260px] flex-1 space-y-3 overflow-y-auto bg-canvas-alt px-5 py-5">
                  {activeTicket.messages.map((message) => {
                    const fromTenant = message.sender === 'tenant'
                    return (
                      <div key={message.id} className={cn('flex', fromTenant ? 'justify-start' : 'justify-end')}>
                        <div
                          className={cn(
                            'max-w-[78%] rounded-2xl px-4 py-3 text-body shadow-sm',
                            fromTenant
                              ? 'rounded-bl-sm bg-white text-text-primary'
                              : 'rounded-br-sm bg-navy text-white'
                          )}
                        >
                          <p>{message.text}</p>
                          <p
                            className={cn(
                              'mt-1 text-[11px] font-semibold',
                              fromTenant ? 'text-text-muted' : 'text-white/70'
                            )}
                          >
                            {fromTenant ? activeTicket.tenantName : 'Admin'} - {message.time}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <form onSubmit={handleSendMessage} className="border-t border-outline bg-white p-4">
                  <div className="flex items-center gap-2 rounded-input border border-outline bg-white px-3 py-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary-100">
                    <input
                      ref={chatInputRef}
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
            </main>
          ) : (
            <main className="flex items-center justify-center p-8">
              <div className="text-center">
                <AlertTriangle size={42} className="mx-auto text-text-muted" />
                <p className="mt-3 text-body font-bold text-text-primary">No ticket selected</p>
                <p className="mt-1 text-label text-text-muted">Select a request to edit status or contact the tenant.</p>
              </div>
            </main>
          )}
        </section>
      </div>
    </div>
  )
}

function SelectFilter({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="text-filter-label uppercase tracking-wider text-text-muted">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 h-10 w-full rounded-input border border-outline bg-white px-3 text-body font-semibold text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function TicketListItem({
  ticket,
  active,
  onClick,
}: {
  ticket: OwnerMaintenanceTicket
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'block w-full border-b border-outline px-4 py-4 text-left transition-colors last:border-0',
        active ? 'bg-primary-100/70' : 'bg-white hover:bg-hover-light'
      )}
    >
      <div className="flex items-start gap-3">
        <img src={ticket.tenantAvatar} alt={ticket.tenantName} className="h-11 w-11 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-body font-bold text-text-primary">{getPropertyName(ticket)}</p>
            <span className="shrink-0 text-label font-semibold text-text-muted">{ticket.lastUpdated}</span>
          </div>
          <p className="mt-1 truncate text-label text-text-muted">
            {ticket.ticketNo} - Raised by {ticket.tenantName}
          </p>
          <p className="mt-1 truncate text-label text-text-primary">
            Raised for {ticket.category} in {ticket.unit}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
        </div>
      </div>
    </button>
  )
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

function SummaryCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon
  label: string
  value: number
  tone: 'primary' | 'info' | 'danger' | 'success'
}) {
  return (
    <div className="rounded-card border border-outline bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-button',
            tone === 'primary' && 'bg-primary-100 text-primary',
            tone === 'info' && 'bg-blue-50 text-blue-700',
            tone === 'danger' && 'bg-red-50 text-red-700',
            tone === 'success' && 'bg-green-50 text-green-700'
          )}
        >
          <Icon size={18} />
        </div>
        <div>
          <p className="text-label font-bold uppercase tracking-widest text-text-muted">{label}</p>
          <p className="text-heading-3 font-bold text-text-primary">{value}</p>
        </div>
      </div>
    </div>
  )
}

function MetaTile({
  icon: Icon,
  label,
  value,
  subValue,
}: {
  icon: LucideIcon
  label: string
  value: string
  subValue: string
}) {
  return (
    <div className="rounded-card border border-outline bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-button bg-canvas-alt text-navy">
          <Icon size={17} />
        </div>
        <div className="min-w-0">
          <p className="text-filter-label uppercase tracking-wider text-text-muted">{label}</p>
          <p className="mt-1 truncate text-body font-bold text-text-primary">{value}</p>
          <p className="mt-1 line-clamp-2 text-label text-text-muted">{subValue}</p>
        </div>
      </div>
    </div>
  )
}
