import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { CheckCircle2, Clock, ClipboardList, MessageSquare, Phone, Search, Send, Wrench } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { useAuth } from '@shared/hooks/useAuth'
import { usePrototypeStore } from '@shared/store/prototypeStore'
import { useOwnerMaintenanceStore, type TicketPriority, type TicketStatus } from '@modules/owner/store/maintenanceStore'
import { useEnterpriseContext } from '../hooks/useEnterpriseContext'

const ticketStatuses: TicketStatus[] = ['Open', 'In Progress', 'Resolved', 'Closed']
const statusStyles: Record<TicketStatus, { dot: string; badge: string }> = {
  Open: { dot: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700' },
  'In Progress': { dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700' },
  Resolved: { dot: 'bg-green-500', badge: 'bg-green-50 text-green-700' },
  Closed: { dot: 'bg-slate-400', badge: 'bg-slate-100 text-slate-600' },
}
const priorityStyles: Record<TicketPriority, string> = { Low: 'bg-slate-100 text-slate-600', Medium: 'bg-sky-50 text-sky-700', High: 'bg-orange-50 text-orange-700', Urgent: 'bg-red-50 text-red-700' }

export function EnterpriseMaintenance() {
  const { user } = useAuth()
  const { currentBlockId, enterpriseBlocks } = useEnterpriseContext()
  const allProperties = usePrototypeStore((s) => s.properties)
  const tickets = useOwnerMaintenanceStore((s) => s.tickets)
  const updateTicket = useOwnerMaintenanceStore((s) => s.updateTicket)
  const sendMaintenanceMessage = usePrototypeStore((s) => s.sendMaintenanceMessage)

  const [selectedBlockId, setSelectedBlockId] = useState(currentBlockId)
  const [selectedUnitPropertyId, setSelectedUnitPropertyId] = useState('all')
  const [activeTicketId, setActiveTicketId] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'All'>('All')
  const [chatDraft, setChatDraft] = useState('')
  const [callStatus, setCallStatus] = useState('')
  const chatRef = useRef<HTMLElement>(null)
  const chatInputRef = useRef<HTMLInputElement>(null)

  // Unit properties for the selected block — match by checking block's units array
  const unitProperties = useMemo(() => {
    const block = enterpriseBlocks.find((b) => b.id === selectedBlockId)
    if (!block?.enterpriseBlock) return []
    const unitPropIds = block.enterpriseBlock.units.map((u) => u.propertyId).filter(Boolean) as string[]
    return allProperties.filter((p) => unitPropIds.includes(p.id))
  }, [allProperties, selectedBlockId, enterpriseBlocks])

  // All unit property IDs across all enterprise blocks
  const allEnterpriseUnitPropertyIds = useMemo(() => {
    const ids = new Set<string>()
    enterpriseBlocks.forEach((b) => {
      ids.add(b.id)
      b.enterpriseBlock?.units.forEach((u) => { if (u.propertyId) ids.add(u.propertyId) })
    })
    // Also include standalone unit properties owned by this enterprise user
    allProperties.filter((p) => p.ownerId === (user?.id ?? '') && !p.enterpriseBlock && p.id.startsWith('property-unit-')).forEach((p) => ids.add(p.id))
    return ids
  }, [enterpriseBlocks, allProperties, user?.id])

  // Filter tickets by selected block/unit
  const filteredByProperty = useMemo(() => {
    if (selectedUnitPropertyId !== 'all') {
      // Specific unit selected
      return tickets.filter((t) => t.propertyId === selectedUnitPropertyId)
    }
    if (selectedBlockId) {
      // All units in selected block
      const blockUnitIds = new Set(unitProperties.map((p) => p.id))
      blockUnitIds.add(selectedBlockId)
      return tickets.filter((t) => blockUnitIds.has(t.propertyId))
    }
    // Fallback: all enterprise tickets
    return tickets.filter((t) => allEnterpriseUnitPropertyIds.has(t.propertyId))
  }, [tickets, selectedUnitPropertyId, selectedBlockId, unitProperties, allEnterpriseUnitPropertyIds])

  const filteredTickets = useMemo(() => {
    const query = search.trim().toLowerCase()
    return filteredByProperty.filter((t) => {
      if (statusFilter !== 'All' && t.status !== statusFilter) return false
      if (query && !t.ticketNo.toLowerCase().includes(query) && !t.tenantName.toLowerCase().includes(query) && !t.category.toLowerCase().includes(query) && !t.problem.toLowerCase().includes(query)) return false
      return true
    })
  }, [filteredByProperty, search, statusFilter])

  useEffect(() => {
    if (!filteredTickets.some((t) => t.id === activeTicketId)) setActiveTicketId(filteredTickets[0]?.id ?? '')
  }, [activeTicketId, filteredTickets])

  const activeTicket = tickets.find((t) => t.id === activeTicketId) ?? filteredTickets[0]
  const summary = useMemo(() => ({
    open: filteredByProperty.filter((t) => t.status === 'Open').length,
    inProgress: filteredByProperty.filter((t) => t.status === 'In Progress').length,
    resolved: filteredByProperty.filter((t) => t.status === 'Resolved' || t.status === 'Closed').length,
  }), [filteredByProperty])

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault()
    if (!activeTicket || !chatDraft.trim()) return
    sendMaintenanceMessage(activeTicket.id, user?.id ?? '', chatDraft.trim())
    setChatDraft('')
  }
  const handleCall = () => { if (activeTicket) { setCallStatus(`Calling ${activeTicket.tenantName}...`); setTimeout(() => setCallStatus(`Call logged for ${activeTicket.tenantName}.`), 800) } }
  const handleOpenChat = () => { chatRef.current?.scrollIntoView({ behavior: 'smooth' }); setTimeout(() => chatInputRef.current?.focus(), 300) }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Enterprise Operations</p>
          <h1 className="mt-2 text-[28px] font-extrabold text-[#0f172a] tracking-tight">Maintenance Tickets</h1>
          <p className="mt-2 text-[14px] text-text-muted">Review and manage maintenance requests across all enterprise units.</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Block</span>
            <select value={selectedBlockId} onChange={(e) => { setSelectedBlockId(e.target.value); setSelectedUnitPropertyId('all') }} className="mt-1 h-11 w-full min-w-[160px] rounded-lg border border-outline bg-white px-3 text-[13px] font-semibold text-[#0f172a] outline-none focus:border-primary">
              {enterpriseBlocks.map((b) => <option key={b.id} value={b.id}>{b.enterpriseBlock?.blockName ? `Block ${b.enterpriseBlock.blockName}` : b.title}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Unit</span>
            <select value={selectedUnitPropertyId} onChange={(e) => setSelectedUnitPropertyId(e.target.value)} className="mt-1 h-11 w-full min-w-[180px] rounded-lg border border-outline bg-white px-3 text-[13px] font-semibold text-[#0f172a] outline-none focus:border-primary">
              <option value="all">All Units</option>
              {unitProperties.map((p) => <option key={p.id} value={p.id}>{p.title.split(' - ').pop() ?? p.unit}</option>)}
            </select>
          </label>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-outline bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><ClipboardList size={18} /></div><div><p className="text-[10px] font-bold uppercase text-text-muted">Open</p><p className="text-[24px] font-extrabold text-[#0f172a]">{summary.open}</p></div></div></div>
        <div className="rounded-xl border border-outline bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700"><Clock size={18} /></div><div><p className="text-[10px] font-bold uppercase text-text-muted">In Progress</p><p className="text-[24px] font-extrabold text-[#0f172a]">{summary.inProgress}</p></div></div></div>
        <div className="rounded-xl border border-outline bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-700"><CheckCircle2 size={18} /></div><div><p className="text-[10px] font-bold uppercase text-text-muted">Resolved</p><p className="text-[24px] font-extrabold text-[#0f172a]">{summary.resolved}</p></div></div></div>
      </div>

      {/* Main: Ticket List + Detail */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        {/* Left: Ticket List */}
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tickets..." className="h-11 w-full rounded-lg border border-outline bg-white pl-10 pr-4 text-[13px] text-text-primary outline-none focus:border-primary" /></div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as TicketStatus | 'All')} className="h-11 rounded-lg border border-outline bg-white px-3 text-[13px] font-semibold text-[#0f172a] outline-none focus:border-primary">
              <option value="All">All Status</option>
              {ticketStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="rounded-xl border border-outline bg-white shadow-sm overflow-hidden max-h-[600px] overflow-y-auto">
            {filteredTickets.length > 0 ? filteredTickets.map((ticket) => (
              <button key={ticket.id} type="button" onClick={() => { setActiveTicketId(ticket.id); setCallStatus('') }} className={cn('block w-full border-b border-outline px-5 py-4 text-left transition-colors last:border-0', ticket.id === activeTicket?.id ? 'bg-primary-50/60' : 'hover:bg-hover-light')}>
                <div className="flex items-start gap-3">
                  <img src={ticket.tenantAvatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2"><p className="text-[13px] font-bold text-[#0f172a] truncate">{ticket.unit}</p><span className="text-[10px] text-text-muted shrink-0">{ticket.lastUpdated}</span></div>
                    <p className="mt-1 text-[11px] text-text-muted">{ticket.ticketNo} · {ticket.tenantName}</p>
                    <p className="mt-1 text-[11px] text-text-primary truncate">{ticket.category} — {ticket.problem}</p>
                    <div className="mt-2 flex gap-2">
                      <span className={cn('inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-[9px] font-bold', statusStyles[ticket.status]?.badge ?? 'bg-slate-100 text-slate-600')}><span className={cn('h-1.5 w-1.5 rounded-full', statusStyles[ticket.status]?.dot ?? 'bg-slate-400')} />{ticket.status}</span>
                      <span className={cn('rounded-pill px-2 py-0.5 text-[9px] font-bold', priorityStyles[ticket.priority])}>{ticket.priority}</span>
                    </div>
                  </div>
                </div>
              </button>
            )) : (
              <div className="px-6 py-16 text-center"><Wrench size={32} className="mx-auto text-text-muted" /><p className="mt-3 text-[14px] font-bold text-[#0f172a]">No tickets found</p><p className="mt-1 text-[12px] text-text-muted">Try changing filters or select a different unit.</p></div>
            )}
          </div>
        </div>

        {/* Right: Ticket Detail */}
        {activeTicket ? (
          <aside className="space-y-5">
            <div className="rounded-xl border border-outline bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{activeTicket.ticketNo}</span>
                <span className={cn('inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-[10px] font-bold', statusStyles[activeTicket.status]?.badge)}><span className={cn('h-1.5 w-1.5 rounded-full', statusStyles[activeTicket.status]?.dot)} />{activeTicket.status}</span>
              </div>
              <h2 className="text-[17px] font-bold text-[#0f172a]">{activeTicket.unit}</h2>
              <p className="mt-1 text-[12px] text-text-muted">{activeTicket.category} · {activeTicket.priority} Priority</p>
              <p className="mt-3 text-[13px] text-text-primary leading-relaxed">{activeTicket.problem}</p>
              <div className="mt-4 flex gap-2">
                <button type="button" onClick={handleCall} className="inline-flex items-center gap-2 rounded-lg bg-[#0f172a] px-4 py-2.5 text-[12px] font-bold text-white"><Phone size={14} /> Call</button>
                <button type="button" onClick={handleOpenChat} className="inline-flex items-center gap-2 rounded-lg border border-outline bg-white px-4 py-2.5 text-[12px] font-bold text-[#0f172a]"><MessageSquare size={14} /> Chat</button>
              </div>
              {callStatus && <p className="mt-3 rounded-lg bg-primary-50 px-3 py-2 text-[11px] font-semibold text-primary">{callStatus}</p>}
            </div>

            {/* Ticket Info */}
            <div className="rounded-xl border border-outline bg-white p-5 shadow-sm space-y-3">
              <div className="grid grid-cols-2 gap-3 text-[12px]">
                <div><p className="text-[10px] font-bold uppercase text-text-muted">Raised By</p><p className="mt-1 font-semibold text-[#0f172a]">{activeTicket.tenantName}</p></div>
                <div><p className="text-[10px] font-bold uppercase text-text-muted">Phone</p><p className="mt-1 font-semibold text-[#0f172a]">{activeTicket.tenantPhone}</p></div>
                <div><p className="text-[10px] font-bold uppercase text-text-muted">Preferred Slot</p><p className="mt-1 font-semibold text-[#0f172a]">{activeTicket.preferredSlot}</p></div>
                <div><p className="text-[10px] font-bold uppercase text-text-muted">Submitted</p><p className="mt-1 font-semibold text-[#0f172a]">{activeTicket.submittedAt}</p></div>
              </div>
              <div className="border-t border-outline pt-3">
                <label className="block"><span className="text-[10px] font-bold uppercase text-text-muted">Status</span>
                  <select value={activeTicket.status} onChange={(e) => updateTicket(activeTicket.id, { status: e.target.value as TicketStatus })} className="mt-1 h-10 w-full rounded-lg border border-outline bg-white px-3 text-[13px] font-semibold text-[#0f172a] outline-none focus:border-primary">
                    {ticketStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>
              </div>
              <div>
                <label className="block"><span className="text-[10px] font-bold uppercase text-text-muted">Assigned To</span>
                  <input value={activeTicket.assignedTo} onChange={(e) => updateTicket(activeTicket.id, { assignedTo: e.target.value })} className="mt-1 h-10 w-full rounded-lg border border-outline bg-white px-3 text-[13px] text-[#0f172a] outline-none focus:border-primary" />
                </label>
              </div>
              <div>
                <label className="block"><span className="text-[10px] font-bold uppercase text-text-muted">Owner Note</span>
                  <textarea value={activeTicket.ownerNote} onChange={(e) => updateTicket(activeTicket.id, { ownerNote: e.target.value })} rows={3} className="mt-1 w-full rounded-lg border border-outline bg-white px-3 py-2 text-[13px] text-[#0f172a] outline-none resize-none focus:border-primary" />
                </label>
              </div>
            </div>

            {/* Chat */}
            <section ref={chatRef} className="rounded-xl border border-outline bg-white shadow-sm overflow-hidden">
              <div className="border-b border-outline px-5 py-3"><p className="text-[12px] font-bold text-[#0f172a]">Chat with {activeTicket.tenantName}</p></div>
              <div className="min-h-[180px] max-h-[260px] overflow-y-auto bg-canvas-alt px-4 py-4 space-y-2">
                {activeTicket.messages.map((m) => (
                  <div key={m.id} className={cn('flex', m.sender === 'tenant' ? 'justify-start' : 'justify-end')}>
                    <div className={cn('max-w-[80%] rounded-2xl px-4 py-2.5 text-[13px] shadow-sm', m.sender === 'tenant' ? 'rounded-bl-sm bg-white text-[#0f172a]' : 'rounded-br-sm bg-[#0f172a] text-white')}>
                      <p>{m.text}</p>
                      <p className={cn('mt-1 text-[10px]', m.sender === 'tenant' ? 'text-text-muted' : 'text-white/60')}>{m.time}</p>
                    </div>
                  </div>
                ))}
                {activeTicket.messages.length === 0 && <p className="text-center text-[12px] text-text-muted italic py-6">No messages yet.</p>}
              </div>
              <form onSubmit={handleSendMessage} className="border-t border-outline p-3">
                <div className="flex items-center gap-2">
                  <input ref={chatInputRef} value={chatDraft} onChange={(e) => setChatDraft(e.target.value)} placeholder="Type a message..." className="h-10 min-w-0 flex-1 rounded-lg border border-outline bg-white px-3 text-[13px] text-[#0f172a] outline-none focus:border-primary" />
                  <button type="submit" disabled={!chatDraft.trim()} className={cn('flex h-10 w-10 items-center justify-center rounded-full', chatDraft.trim() ? 'bg-[#0f172a] text-white' : 'bg-slate-100 text-text-muted')}><Send size={16} /></button>
                </div>
              </form>
            </section>
          </aside>
        ) : (
          <aside className="flex items-center justify-center rounded-xl border border-outline bg-white p-10">
            <div className="text-center"><Wrench size={32} className="mx-auto text-text-muted" /><p className="mt-3 text-[14px] font-bold text-[#0f172a]">Select a ticket</p></div>
          </aside>
        )}
      </div>
    </div>
  )
}
