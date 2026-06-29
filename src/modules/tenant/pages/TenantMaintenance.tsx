import { useState, useRef, useMemo } from 'react'
import { cn } from '@shared/utils/cn'

// ─── Types ────────────────────────────────────────────────────────────────────

type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed'
type TicketCategory =
  | 'Plumbing'
  | 'Electrical'
  | 'Appliance'
  | 'Structural'
  | 'Pest Control'
  | 'HVAC'
  | 'Other'

interface Ticket {
  id: string
  ticketNo: string
  category: TicketCategory
  problem: string
  status: TicketStatus
  date: string
  time: string
  images: string[]
}

// ─── Mock seed data ───────────────────────────────────────────────────────────

const SEED_TICKETS: Ticket[] = [
  { id: '1', ticketNo: 'MNT-4421', category: 'Plumbing',     problem: 'Kitchen sink is leaking under the cabinet. Water pooling on the floor.',         status: 'Resolved',    date: '10 Apr 2026', time: '9:15 AM',  images: [] },
  { id: '2', ticketNo: 'MNT-4398', category: 'Electrical',   problem: 'Living room circuit breaker trips every time the AC and microwave run together.', status: 'In Progress', date: '06 Apr 2026', time: '3:40 PM',  images: [] },
  { id: '3', ticketNo: 'MNT-4375', category: 'Appliance',    problem: 'Washing machine makes loud grinding noise during spin cycle.',                    status: 'Open',        date: '01 Apr 2026', time: '11:00 AM', images: [] },
  { id: '4', ticketNo: 'MNT-4310', category: 'Pest Control', problem: 'Cockroach infestation noticed in the kitchen and bathroom.',                      status: 'Closed',      date: '18 Mar 2026', time: '8:30 AM',  images: [] },
  { id: '5', ticketNo: 'MNT-4280', category: 'Structural',   problem: 'Crack appearing on the bedroom ceiling near the window frame.',                   status: 'Resolved',    date: '05 Mar 2026', time: '2:00 PM',  images: [] },
]

const PAGE_SIZE = 4
const CATEGORIES: TicketCategory[] = ['Plumbing', 'Electrical', 'Appliance', 'Structural', 'Pest Control', 'HVAC', 'Other']

// ─── Lookup maps ──────────────────────────────────────────────────────────────

const statusConfig: Record<TicketStatus, { dot: string; text: string; bg: string }> = {
  'Open':        { dot: 'bg-blue-500',  text: 'text-blue-700',  bg: 'bg-blue-50'   },
  'In Progress': { dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50'  },
  'Resolved':    { dot: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50'  },
  'Closed':      { dot: 'bg-slate-400', text: 'text-slate-600', bg: 'bg-slate-100' },
}

const categoryColors: Record<TicketCategory, string> = {
  'Plumbing':    'bg-cyan-50 text-cyan-700',
  'Electrical':  'bg-yellow-50 text-yellow-700',
  'Appliance':   'bg-purple-50 text-purple-700',
  'Structural':  'bg-orange-50 text-orange-700',
  'Pest Control':'bg-red-50 text-red-700',
  'HVAC':        'bg-teal-50 text-teal-700',
  'Other':       'bg-slate-50 text-slate-600',
}

const categoryIcons: Record<TicketCategory, string> = {
  'Plumbing':    'water_drop',
  'Electrical':  'bolt',
  'Appliance':   'kitchen',
  'Structural':  'foundation',
  'Pest Control':'pest_control',
  'HVAC':        'ac_unit',
  'Other':       'build',
}

/** Tickets in these statuses cannot be edited */
const LOCKED_STATUSES: TicketStatus[] = ['Resolved', 'Closed']

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: TicketStatus }) {
  const c = statusConfig[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-bold', c.bg, c.text)}>
      <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', c.dot)} />
      {status}
    </span>
  )
}

// ─── Ticket Row ───────────────────────────────────────────────────────────────

interface TicketRowProps {
  ticket: Ticket
  onEdit: (ticket: Ticket) => void
}

function TicketRow({ ticket, onEdit }: TicketRowProps) {
  const [expanded, setExpanded] = useState(false)
  const isLocked = LOCKED_STATUSES.includes(ticket.status)

  return (
    <div className="px-6 py-5 border-b border-[#f1f5f9] last:border-0 hover:bg-[#fafbfc] transition-colors">
      <div className="flex items-start justify-between gap-4 flex-wrap">

        {/* ── Left ── */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[13px] font-bold text-[#94a3b8] tracking-wide">{ticket.ticketNo}</span>
            <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide', categoryColors[ticket.category])}>
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }} aria-hidden="true">{categoryIcons[ticket.category]}</span>
              {ticket.category}
            </span>
          </div>

          <p className={cn('text-[14px] text-[#0F172A] font-medium leading-snug', !expanded && 'line-clamp-2')}>
            {ticket.problem}
          </p>
          {ticket.problem.length > 90 && (
            <button type="button" onClick={() => setExpanded((v) => !v)}
              className="mt-1 text-[12px] font-semibold text-[#2563eb] border-0 bg-transparent cursor-pointer p-0 hover:underline">
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}

          {ticket.images.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {ticket.images.map((src, i) => (
                <img key={i} src={src} alt={`Attachment ${i + 1}`}
                  className="w-14 h-14 rounded-lg object-cover border border-[#e2e8f0]" />
              ))}
            </div>
          )}
        </div>

        {/* ── Right ── */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <StatusBadge status={ticket.status} />
          <span className="text-[12px] text-[#64748b]">{ticket.date}, {ticket.time}</span>

          {/* Status label */}
          {ticket.status === 'Open' || ticket.status === 'In Progress' ? (
            <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#0F172A]">
              <span className="material-symbols-outlined text-[15px]" aria-hidden="true">support_agent</span>
              Awaiting Response
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#94a3b8]">
              <span className="material-symbols-outlined text-[15px]" aria-hidden="true">task_alt</span>
              {ticket.status}
            </span>
          )}

          {/* Edit button */}
          <div className="relative group/edit mt-0.5">
            <button
              type="button"
              onClick={() => !isLocked && onEdit(ticket)}
              disabled={isLocked}
              aria-label={isLocked ? `Cannot edit — ticket is ${ticket.status}` : `Edit ticket ${ticket.ticketNo}`}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12px] font-semibold transition-all duration-150',
                isLocked
                  ? 'border-[#e2e8f0] text-[#cbd5e1] bg-[#f8fafc] cursor-not-allowed'
                  : 'border-[#e2e8f0] text-[#475569] bg-white hover:border-[#0F172A] hover:text-[#0F172A] hover:bg-[#f8fafc] cursor-pointer'
              )}
            >
              <span className="material-symbols-outlined text-[14px]" aria-hidden="true">
                {isLocked ? 'lock' : 'edit'}
              </span>
              Edit
            </button>
            {/* Tooltip for locked tickets */}
            {isLocked && (
              <div className="absolute bottom-full right-0 mb-2 px-2.5 py-1.5 rounded-lg bg-[#0F172A] text-white text-[11px] font-medium whitespace-nowrap opacity-0 group-hover/edit:opacity-100 transition-opacity pointer-events-none z-10">
                Cannot edit a {ticket.status.toLowerCase()} ticket
                <div className="absolute top-full right-3 border-4 border-transparent border-t-[#0F172A]" />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

// ─── Ticket Form Modal (create + edit) ───────────────────────────────────────

interface TicketFormModalProps {
  /** When provided the modal is in edit mode */
  initialData?: Ticket
  onClose: () => void
  onSubmit: (data: Pick<Ticket, 'category' | 'problem' | 'images'>) => void
}

function TicketFormModal({ initialData, onClose, onSubmit }: TicketFormModalProps) {
  const isEdit = Boolean(initialData)
  const [category, setCategory] = useState<TicketCategory>(initialData?.category ?? 'Plumbing')
  const [problem, setProblem] = useState(initialData?.problem ?? '')
  const [previews, setPreviews] = useState<string[]>(initialData?.images ?? [])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const inputCls = (field: string) => cn(
    'w-full px-4 py-3 rounded-xl border-2 outline-none font-body text-[14px] text-[#0F172A] bg-[#f8fafc]',
    'transition-all duration-150 placeholder:text-[#cbd5e1]',
    errors[field] ? 'border-red-400 bg-red-50' : 'border-[#e2e8f0] focus:border-[#0F172A] focus:bg-white'
  )

  function handleFiles(files: FileList | null) {
    if (!files) return
    const slots = 5 - previews.length
    if (slots <= 0) return
    const batch: string[] = []
    const toRead = Array.from(files).filter((f) => f.type.startsWith('image/')).slice(0, slots)
    toRead.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          batch.push(e.target.result as string)
          if (batch.length === toRead.length) {
            setPreviews((prev) => [...prev, ...batch].slice(0, 5))
          }
        }
      }
      reader.readAsDataURL(file)
    })
  }

  function removeImage(index: number) {
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!problem.trim() || problem.trim().length < 10)
      errs.problem = 'Please describe the issue in at least 10 characters.'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 900))
    setSubmitting(false)
    onSubmit({ category, problem: problem.trim(), images: previews })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-md" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-[500px] bg-white rounded-2xl shadow-[0_24px_48px_-8px_rgba(0,0,0,0.18)] overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-[#f1f5f9] flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Mode indicator pill */}
            <div className={cn(
              'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
              isEdit ? 'bg-amber-50' : 'bg-[#f1f5f9]'
            )}>
              <span className={cn('material-symbols-outlined text-[20px]', isEdit ? 'text-amber-600' : 'text-[#0F172A]')} aria-hidden="true">
                {isEdit ? 'edit_note' : 'add_circle'}
              </span>
            </div>
            <div>
              <h2 className="font-display text-[20px] font-extrabold text-[#0F172A] leading-tight">
                {isEdit ? `Edit Ticket` : 'New Maintenance Request'}
              </h2>
              <p className="text-[12px] text-[#64748b] mt-0.5">
                {isEdit
                  ? <span>Updating <span className="font-bold text-[#0F172A]">{initialData!.ticketNo}</span></span>
                  : "Describe the issue and we'll get it sorted."}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#94a3b8] hover:text-[#0F172A] hover:bg-[#f1f5f9] border-0 bg-transparent cursor-pointer transition-colors flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">close</span>
          </button>
        </div>

        {/* Scrollable form */}
        <form onSubmit={handleSubmit} className="px-7 py-6 flex flex-col gap-5 overflow-y-auto flex-1">

          {/* Category */}
          <div>
            <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">Category</label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <button key={cat} type="button" onClick={() => setCategory(cat)}
                  className={cn(
                    'flex items-center gap-2 px-3.5 py-2.5 rounded-xl border-2 text-[13px] font-semibold transition-all duration-150 cursor-pointer',
                    category === cat
                      ? 'border-[#0F172A] bg-[#0F172A] text-white'
                      : 'border-[#e2e8f0] bg-[#f8fafc] text-[#475569] hover:border-[#94a3b8]'
                  )}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }} aria-hidden="true">{categoryIcons[cat]}</span>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Problem description */}
          <div>
            <label htmlFor="problem-desc" className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">
              Problem Description
            </label>
            <textarea id="problem-desc" rows={4}
              placeholder="Describe the issue in detail — what happened, when it started, how severe it is..."
              value={problem}
              onChange={(e) => { setProblem(e.target.value); if (errors.problem) setErrors({}) }}
              className={cn(inputCls('problem'), 'resize-none leading-relaxed')} />
            <div className="flex items-center justify-between mt-1">
              {errors.problem
                ? <p className="text-[12px] text-red-500">{errors.problem}</p>
                : <span />}
              <span className={cn('text-[11px]', problem.length > 500 ? 'text-red-500' : 'text-[#94a3b8]')}>
                {problem.length}/500
              </span>
            </div>
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">
              Attach Photos <span className="normal-case font-normal text-[#94a3b8]">(optional, up to 5)</span>
            </label>
            {previews.length < 5 && (
              <div
                onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 py-6 rounded-xl border-2 border-dashed border-[#e2e8f0] bg-[#f8fafc] cursor-pointer hover:border-[#94a3b8] hover:bg-[#f1f5f9] transition-all duration-150">
                <span className="material-symbols-outlined text-[32px] text-[#94a3b8]" aria-hidden="true">cloud_upload</span>
                <p className="text-[13px] font-semibold text-[#64748b]">Click or drag images here</p>
                <p className="text-[11px] text-[#94a3b8]">PNG, JPG, WEBP — max 5 images</p>
                <input ref={fileRef} type="file" accept="image/*" multiple className="sr-only"
                  onChange={(e) => handleFiles(e.target.files)} />
              </div>
            )}
            {previews.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {previews.map((src, i) => (
                  <div key={i} className="relative group">
                    <img src={src} alt={`Preview ${i + 1}`} className="w-16 h-16 rounded-lg object-cover border border-[#e2e8f0]" />
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#0F172A] text-white flex items-center justify-center border-0 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined" style={{ fontSize: '12px' }} aria-hidden="true">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-3.5 rounded-xl font-display text-[15px] font-bold text-[#475569] border-2 border-[#e2e8f0] bg-white hover:bg-[#f8fafc] transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={submitting || problem.length > 500}
              className={cn('flex-1 py-3.5 rounded-xl font-display text-[15px] font-bold text-white border-0 transition-all duration-150',
                submitting || problem.length > 500
                  ? 'bg-[#94a3b8] cursor-not-allowed'
                  : isEdit
                    ? 'bg-amber-600 hover:bg-amber-700 cursor-pointer'
                    : 'bg-[#0F172A] hover:bg-[#1e293b] cursor-pointer')}>
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  {isEdit ? 'Saving…' : 'Submitting…'}
                </span>
              ) : isEdit ? 'Save Changes' : 'Submit Request'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

let ticketCounter = SEED_TICKETS.length + 1

export function TenantMaintenance() {
  const [tickets, setTickets] = useState<Ticket[]>(SEED_TICKETS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'All'>('All')
  const [page, setPage] = useState(1)

  // Modal state — null = closed, undefined = new, Ticket = edit
  const [modalTicket, setModalTicket] = useState<Ticket | null | undefined>(null)

  // Toast
  const [toast, setToast] = useState<{ message: string; sub: string } | null>(null)

  function showToast(message: string, sub: string) {
    setToast({ message, sub })
    setTimeout(() => setToast(null), 5000)
  }

  // ── Create ──────────────────────────────────────────────────────────────────
  function handleCreate(data: Pick<Ticket, 'category' | 'problem' | 'images'>) {
    const now = new Date()
    const ticketNo = `MNT-${4421 + ticketCounter++}`
    const newTicket: Ticket = {
      id: String(Date.now()),
      ticketNo,
      status: 'Open',
      date: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      ...data,
    }
    setTickets((prev) => [newTicket, ...prev])
    setPage(1)
    showToast('Request submitted!', `Ticket ${ticketNo} has been raised. We'll be in touch shortly.`)
  }

  // ── Update ──────────────────────────────────────────────────────────────────
  function handleUpdate(data: Pick<Ticket, 'category' | 'problem' | 'images'>) {
    if (!modalTicket) return
    setTickets((prev) =>
      prev.map((t) => t.id === modalTicket.id ? { ...t, ...data } : t)
    )
    showToast('Ticket updated!', `Changes to ${modalTicket.ticketNo} have been saved.`)
  }

  // ── Filtered + paginated ────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      const matchSearch = !search ||
        t.ticketNo.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase()) ||
        t.problem.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'All' || t.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [tickets, search, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const pageNumbers: (number | '...')[] = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (currentPage <= 3) return [1, 2, 3, '...', totalPages]
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 2, totalPages - 1, totalPages]
    return [1, '...', currentPage, '...', totalPages]
  }, [totalPages, currentPage])

  const openCount       = tickets.filter((t) => t.status === 'Open').length
  const inProgressCount = tickets.filter((t) => t.status === 'In Progress').length
  const resolvedCount   = tickets.filter((t) => t.status === 'Resolved').length

  return (
    <div className="space-y-0">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="font-display text-[28px] font-extrabold text-[#0F172A] leading-tight">Maintenance</h1>
          <p className="text-[14px] text-[#64748b] mt-1">Submit and track your maintenance requests.</p>
        </div>
        <button type="button" onClick={() => setModalTicket(undefined)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0F172A] text-white font-display text-[14px] font-bold border-0 cursor-pointer hover:bg-[#1e293b] transition-colors shrink-0">
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">add</span>
          New Request
        </button>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Open',        count: openCount,       dot: 'bg-blue-500',  text: 'text-blue-700',  bg: 'bg-blue-50'  },
          { label: 'In Progress', count: inProgressCount, dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' },
          { label: 'Resolved',    count: resolvedCount,   dot: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50' },
        ].map((s) => (
          <div key={s.label} className={cn('rounded-xl px-5 py-4 border border-[#e2e8f0]', s.bg)}>
            <div className="flex items-center gap-2 mb-1">
              <span className={cn('w-2 h-2 rounded-full', s.dot)} />
              <span className={cn('text-[11px] font-bold tracking-widest uppercase', s.text)}>{s.label}</span>
            </div>
            <span className={cn('font-display text-[28px] font-extrabold', s.text)}>{s.count}</span>
          </div>
        ))}
      </div>

      {/* ── Search + filter ── */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-[#94a3b8] pointer-events-none" aria-hidden="true">search</span>
          <input type="text" placeholder="Search by ticket ID, category or description..."
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e2e8f0] bg-white outline-none font-body text-[14px] text-[#0F172A] placeholder:text-[#94a3b8] focus:border-[#0F172A] transition-colors" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as TicketStatus | 'All'); setPage(1) }}
          className="px-4 py-3 rounded-xl border border-[#e2e8f0] bg-white outline-none font-body text-[14px] text-[#0F172A] cursor-pointer focus:border-[#0F172A] min-w-[140px]">
          <option value="All">All Status</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* ── Ticket list ── */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] overflow-hidden mb-6">
        {paginated.length > 0 ? (
          paginated.map((t) => (
            <TicketRow key={t.id} ticket={t} onEdit={(ticket) => setModalTicket(ticket)} />
          ))
        ) : (
          <div className="py-16 text-center">
            <span className="material-symbols-outlined text-[48px] text-[#cbd5e1] block mb-3" aria-hidden="true">build</span>
            <p className="text-[15px] font-semibold text-[#64748b]">No tickets found</p>
            <p className="text-[13px] text-[#94a3b8] mt-1">
              {tickets.length === 0 ? "You haven't submitted any requests yet." : 'Try adjusting your search or filter.'}
            </p>
            {tickets.length === 0 && (
              <button type="button" onClick={() => setModalTicket(undefined)}
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F172A] text-white font-display text-[13px] font-bold border-0 cursor-pointer hover:bg-[#1e293b] transition-colors">
                <span className="material-symbols-outlined text-[16px]" aria-hidden="true">add</span>
                New Request
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
            className={cn('inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-body text-[14px] font-semibold border-0 transition-colors',
              currentPage === 1 ? 'text-[#cbd5e1] cursor-not-allowed bg-transparent' : 'text-[#0F172A] cursor-pointer hover:bg-[#f1f5f9] bg-transparent')}>
            <span className="material-symbols-outlined text-[16px]" aria-hidden="true">arrow_back</span>
            Previous
          </button>
          <div className="flex items-center gap-1">
            {pageNumbers.map((n, i) =>
              n === '...' ? (
                <span key={`e-${i}`} className="px-2 text-[#94a3b8] text-[14px]">…</span>
              ) : (
                <button key={n} type="button" onClick={() => setPage(n as number)}
                  className={cn('w-9 h-9 rounded-lg font-body text-[14px] font-semibold border-0 cursor-pointer transition-colors',
                    currentPage === n ? 'bg-[#0F172A] text-white' : 'bg-transparent text-[#64748b] hover:bg-[#f1f5f9]')}>
                  {n}
                </button>
              )
            )}
          </div>
          <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
            className={cn('inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-body text-[14px] font-semibold border-0 transition-colors',
              currentPage === totalPages ? 'text-[#cbd5e1] cursor-not-allowed bg-transparent' : 'text-[#0F172A] cursor-pointer hover:bg-[#f1f5f9] bg-transparent')}>
            Next
            <span className="material-symbols-outlined text-[16px]" aria-hidden="true">arrow_forward</span>
          </button>
        </div>
      )}

      {/* ── Footer ── */}
      <p className="text-center text-[11px] font-semibold tracking-wider text-[#94a3b8] uppercase pb-2">
        Property ID: RTL-882-DAN • Lease Active Until Oct 2024
      </p>

      {/* ── Modal ── */}
      {modalTicket !== null && (
        <TicketFormModal
          initialData={modalTicket ?? undefined}
          onClose={() => setModalTicket(null)}
          onSubmit={modalTicket ? handleUpdate : handleCreate}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[9999] flex items-start gap-3.5 w-[380px] max-w-[calc(100vw-32px)] bg-white rounded-xl shadow-[0_8px_24px_-4px_rgba(0,0,0,0.12)] border border-[#e2e8f0] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-green-500" />
          <div className="flex items-start gap-3 pl-5 pr-4 py-4 w-full">
            <span className="material-symbols-outlined text-[22px] text-green-500 mt-0.5" aria-hidden="true">check_circle</span>
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-[#0F172A]">{toast.message}</p>
              <p className="text-[13px] text-[#64748b] mt-0.5">{toast.sub}</p>
            </div>
            <button type="button" onClick={() => setToast(null)}
              className="w-6 h-6 flex items-center justify-center rounded-md text-[#94a3b8] hover:text-[#0F172A] hover:bg-[#f1f5f9] border-0 bg-transparent cursor-pointer mt-0.5 transition-colors">
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">close</span>
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
