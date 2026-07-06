import { FormEvent, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Send, StickyNote } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { ROUTES } from '@shared/constants/routes'
import {
  useOwnerMaintenanceStore,
  type TicketStatus,
} from '../../owner/store/maintenanceStore'
import { useTenantId } from '../hooks/useTenantId'

const statusStyles: Record<TicketStatus, string> = {
  Open: 'bg-blue-50 text-blue-700',
  'In Progress': 'bg-amber-50 text-amber-700',
  Resolved: 'bg-green-50 text-green-700',
  Closed: 'bg-slate-100 text-slate-600',
}

const DEFAULT_OWNER_NOTE = 'Raised from the active tenant lease.'

function hasOwnerUpdate(note: string) {
  const trimmed = note.trim()
  return trimmed.length > 0 && trimmed !== DEFAULT_OWNER_NOTE
}

export function TenantMaintenanceDetail() {
  const { ticketId } = useParams<{ ticketId: string }>()
  const navigate = useNavigate()
  const tenantId = useTenantId()
  const ticket = useOwnerMaintenanceStore((state) =>
    state.tickets.find((item) => item.id === ticketId && item.tenantId === tenantId),
  )
  const sendTenantTicketMessage = useOwnerMaintenanceStore((state) => state.sendTenantTicketMessage)
  const [chatDraft, setChatDraft] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  const canEdit = ticket?.status === 'Open'

  if (!ticket) {
    return (
      <div className="rounded-card border border-outline bg-white p-10 text-center shadow-surface">
        <h1 className="text-heading-2 font-bold text-navy">Ticket not found</h1>
        <button type="button" onClick={() => navigate(ROUTES.TENANT.MAINTENANCE)} className="mt-5 rounded-button bg-navy px-5 py-3 font-bold text-white">
          Back to Maintenance
        </button>
      </div>
    )
  }

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!chatDraft.trim()) return
    sendTenantTicketMessage(ticket.id, tenantId, chatDraft.trim())
    setChatDraft('')
    requestAnimationFrame(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }))
  }

  return (
    <div className="space-y-6">
      <div className="rounded-card border border-outline bg-white p-6 shadow-surface">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-filter-label font-bold uppercase tracking-wider text-text-muted">{ticket.ticketNo}</p>
            <h1 className="mt-2 text-heading-2 font-bold text-navy">{ticket.category} Request</h1>
            <p className="mt-1 text-body text-text-muted">Submitted {ticket.submittedAt}</p>
          </div>
          <span className={cn('rounded-pill px-3 py-1 text-badge font-bold', statusStyles[ticket.status])}>{ticket.status}</span>
        </div>
        <p className="mt-5 text-body leading-relaxed text-text-primary">{ticket.problem}</p>
        {ticket.images.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {ticket.images.map((src, index) => (
              <img key={index} src={src} alt={`Attachment ${index + 1}`} className="h-20 w-20 rounded-lg object-cover border border-outline" />
            ))}
          </div>
        )}
        <div className="mt-5 grid gap-3 sm:grid-cols-2 text-body">
          <p><span className="font-semibold text-text-muted">Assigned to:</span> {ticket.assignedTo}</p>
          <p><span className="font-semibold text-text-muted">Preferred slot:</span> {ticket.preferredSlot}</p>
        </div>
        {canEdit && (
          <button
            type="button"
            onClick={() => navigate(ROUTES.TENANT.MAINTENANCE, { state: { editTicketId: ticket.id } })}
            className="mt-5 rounded-button border border-outline px-4 py-2.5 text-body font-bold text-navy"
          >
            Edit Request
          </button>
        )}
      </div>

      {hasOwnerUpdate(ticket.ownerNote) && (
        <section className="rounded-card border border-primary/20 bg-primary-50/40 p-5 shadow-surface">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
              <StickyNote size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-filter-label font-bold uppercase tracking-wider text-primary">Update from Owner</p>
              <p className="mt-2 text-body leading-relaxed text-text-primary">{ticket.ownerNote}</p>
              {ticket.lastUpdated && (
                <p className="mt-2 text-label text-text-muted">Last updated {ticket.lastUpdated}</p>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="rounded-card border border-outline bg-white shadow-surface">
        <div className="border-b border-outline px-5 py-4">
          <h2 className="text-body-lg font-bold text-text-primary">Ticket Chat</h2>
          <p className="mt-1 text-label text-text-muted">Messages with your property owner for this request</p>
        </div>
        <div className="max-h-[360px] space-y-3 overflow-y-auto px-5 py-4">
          {ticket.messages.length === 0 && (
            <p className="text-center text-body text-text-muted">No messages yet. Send an update to the owner.</p>
          )}
          {ticket.messages.map((message) => (
            <div key={message.id} className={cn('flex', message.sender === 'tenant' ? 'justify-end' : 'justify-start')}>
              <div
                className={cn(
                  'max-w-[85%] rounded-2xl px-4 py-3 text-body shadow-sm',
                  message.sender === 'tenant'
                    ? 'rounded-br-sm bg-navy text-white'
                    : 'rounded-bl-sm bg-canvas-alt text-text-primary',
                )}
              >
                <p>{message.text}</p>
                <p className={cn('mt-1 text-[11px] font-semibold', message.sender === 'tenant' ? 'text-white/70' : 'text-text-muted')}>
                  {message.time}
                </p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={handleSendMessage} className="border-t border-outline p-4">
          <div className="flex items-center gap-2 rounded-input border border-outline bg-white px-3 py-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary-100">
            <input
              value={chatDraft}
              onChange={(event) => setChatDraft(event.target.value)}
              placeholder="Message owner..."
              className="h-9 min-w-0 flex-1 border-0 bg-transparent text-body text-text-primary outline-none placeholder:text-text-muted"
            />
            <button
              type="submit"
              disabled={!chatDraft.trim()}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full transition-colors',
                chatDraft.trim() ? 'bg-navy text-white hover:bg-slate-800' : 'cursor-not-allowed bg-slate-100 text-text-muted',
              )}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
