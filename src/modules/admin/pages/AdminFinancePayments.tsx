import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  CheckCircle2,
  Download,
  RefreshCw,
  RotateCcw,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { ROUTES } from '@shared/constants/routes'
import { confirm } from '../components/ConfirmDialog'
import { toast } from '../components/Toast'
import { exportToCsv } from '../utils/exportCsv'
import {
  ALL_PAYMENTS,
  statusConfig,
  typeColors,
  roleColors,
  type AdminPayment,
  type PaymentStatus,
  type PaymentType,
} from '../constants/payments'

type DateRange = 'Last 7 Days' | 'Last 30 Days' | 'Last 90 Days' | 'This Year'
const PAGE_SIZE = 6

// â”€â”€â”€ Sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function StatusBadge({ status }: { status: PaymentStatus }) {
  const c = statusConfig[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-bold', c.bg, c.text)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} />
      {status}
    </span>
  )
}

function TypeBadge({ type }: { type: PaymentType }) {
  return (
    <span className={cn('inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide', typeColors[type])}>
      {type}
    </span>
  )
}

function DirectionIcon({ direction }: { direction: 'inbound' | 'outbound' }) {
  return direction === 'inbound' ? (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50">
      <ArrowDownLeft size={16} className="text-green-600" />
    </div>
  ) : (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-50">
      <ArrowUpRight size={16} className="text-orange-600" />
    </div>
  )
}

// â”€â”€â”€ Payment Row (tenant-style card row) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function PaymentRow({
  payment,
  onViewReceipt,
  onRefund,
  onRetry,
}: {
  payment: AdminPayment
  onViewReceipt: (p: AdminPayment) => void
  onRefund: (p: AdminPayment) => void
  onRetry: (p: AdminPayment) => void
}) {
  return (
    <div
      onClick={() => onViewReceipt(payment)}
      className="cursor-pointer border-b border-[#f1f5f9] px-6 py-5 last:border-0 hover:bg-[#f8fafc] transition-colors"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onViewReceipt(payment)}
      aria-label={`View receipt for ${payment.txnId}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        {/* Left side */}
        <div className="flex items-start gap-4 min-w-0">
          <DirectionIcon direction={payment.direction} />
          <div className="min-w-0">
            {/* User row */}
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <div className={cn('flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold shrink-0', payment.avatarColor, 'text-white')}>
                {payment.userInitials}
              </div>
              <span className="text-[14px] font-semibold text-[#0F172A]">{payment.user}</span>
              <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold', roleColors[payment.role])}>
                {payment.role}
              </span>
              <TypeBadge type={payment.type} />
            </div>
            {/* Amount */}
            <div className={cn('text-[26px] font-extrabold leading-none mb-2 font-display', payment.direction === 'inbound' ? 'text-green-700' : 'text-[#0F172A]')}>
              {payment.direction === 'inbound' ? '+' : 'âˆ’'}â‚¹{payment.amount.toLocaleString('en-IN')}
            </div>
            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-2 text-[12px] text-[#64748b] font-medium">
              <span>TXN: <span className="font-semibold text-[#0F172A]">{payment.txnId}</span></span>
              <span className="text-[#cbd5e1]">â€¢</span>
              <span>REF: <span className="font-semibold text-[#0F172A]">{payment.refId}</span></span>
              <span className="text-[#cbd5e1]">â€¢</span>
              <span>via <span className="font-semibold text-[#0F172A]">{payment.via}</span></span>
              {payment.property && (
                <>
                  <span className="text-[#cbd5e1]">â€¢</span>
                  <span className="text-[#0F172A]">{payment.property}</span>
                </>
              )}
            </div>
            {payment.note && (
              <p className="mt-1.5 text-[12px] italic text-[#94a3b8]">{payment.note}</p>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex shrink-0 flex-col items-end gap-2">
          <StatusBadge status={payment.status} />
          <span className="text-[12px] text-[#64748b]">{payment.date}, {payment.time}</span>
          <div className="flex items-center gap-3 mt-1">
            {(payment.status === 'Success' || payment.status === 'Refunded') && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onViewReceipt(payment) }}
                className="inline-flex items-center gap-1 text-[12px] font-bold text-[#0F172A] hover:text-primary transition-colors border-0 bg-transparent cursor-pointer p-0"
              >
                <Download size={13} />
                Receipt
              </button>
            )}
            {payment.status === 'Failed' && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onRetry(payment) }}
                className="inline-flex items-center gap-1 text-[12px] font-bold text-amber-700 hover:text-amber-900 transition-colors border-0 bg-transparent cursor-pointer p-0"
              >
                <RefreshCw size={13} />
                Retry
              </button>
            )}
            {(payment.status === 'Success' || payment.status === 'Pending') && payment.direction === 'inbound' && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onRefund(payment) }}
                className="inline-flex items-center gap-1 text-[12px] font-bold text-red-600 hover:text-red-800 transition-colors border-0 bg-transparent cursor-pointer p-0"
              >
                <RotateCcw size={13} />
                Refund
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// â”€â”€â”€ Process Payment Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const PAYMENT_TYPES: PaymentType[] = [
  'Commission', 'Rent', 'Subscription', 'Security Deposit', 'Maintenance Fee', 'Platform Fee',
]
const PAYMENT_METHODS = ['Bank Transfer', 'UPI', 'Net Banking', 'Credit Card', 'Debit Card']
const ROLES = ['Broker', 'Owner', 'Tenant', 'Enterprise']

function ProcessPaymentModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: (p: AdminPayment) => void
}) {
  const [user, setUser] = useState('')
  const [role, setRole] = useState('Broker')
  const [type, setType] = useState<PaymentType>('Commission')
  const [direction, setDirection] = useState<'inbound' | 'outbound'>('outbound')
  const [amount, setAmount] = useState('')
  const [via, setVia] = useState('Bank Transfer')
  const [property, setProperty] = useState('')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const inputCls = (field: string) => cn(
    'w-full px-4 py-2.5 rounded-input border-2 outline-none text-body text-text-primary bg-canvas-alt transition-all placeholder:text-text-muted',
    errors[field]
      ? 'border-status-error bg-red-50'
      : 'border-outline focus:border-navy focus:bg-white',
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!user.trim()) errs.user = 'Recipient / payer name is required.'
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) errs.amount = 'Enter a valid amount.'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSubmitting(false)

    const initials = user.trim().split(' ').map((w) => w[0]?.toUpperCase() ?? '').slice(0, 2).join('')
    const colors = ['bg-teal-500', 'bg-blue-500', 'bg-orange-500', 'bg-indigo-600', 'bg-purple-500']
    const newPayment: AdminPayment = {
      id: `p-${Date.now()}`,
      txnId: `TRX-${Math.floor(80000 + Math.random() * 9999)}`,
      refId: `REF-${Math.floor(1000 + Math.random() * 8999)}-ADM`,
      user: user.trim(),
      userInitials: initials,
      avatarColor: colors[Math.floor(Math.random() * colors.length)],
      role: role as AdminPayment['role'],
      type,
      direction,
      amount: Number(amount),
      via,
      status: 'Pending',
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      property: property.trim() || undefined,
      note: note.trim() || undefined,
    }
    onSuccess(newPayment)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-navy/50 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-modal overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline px-6 py-5">
          <div>
            <h2 className="text-heading-3 font-bold text-text-primary">Process Payment</h2>
            <p className="mt-0.5 text-label text-text-muted">Initiate a commission, rent, or other payment.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close"
            className="p-2 rounded-button text-text-muted hover:bg-hover-light hover:text-text-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
          {/* Direction toggle */}
          <div>
            <label className="block text-label font-bold uppercase tracking-wider text-text-muted mb-2">
              Direction
            </label>
            <div className="inline-flex rounded-button border border-outline p-1 gap-1">
              {(['outbound', 'inbound'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDirection(d)}
                  className={cn(
                    'flex items-center gap-2 rounded-button px-4 py-2 text-body font-semibold transition-colors',
                    direction === d ? 'bg-navy text-white' : 'text-text-muted hover:bg-hover-light',
                  )}
                >
                  {d === 'outbound' ? <ArrowUpRight size={15} /> : <ArrowDownLeft size={15} />}
                  {d === 'outbound' ? 'Pay Out' : 'Receive'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-label font-bold uppercase tracking-wider text-text-muted mb-1.5">
                {direction === 'outbound' ? 'Pay To' : 'Receive From'}
              </label>
              <input type="text" placeholder="e.g. Arjun Mehta" value={user}
                onChange={(e) => setUser(e.target.value)} className={inputCls('user')} />
              {errors.user && <p className="mt-1 text-label text-status-error">{errors.user}</p>}
            </div>
            <div>
              <label className="block text-label font-bold uppercase tracking-wider text-text-muted mb-1.5">Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-input border-2 border-outline bg-canvas-alt px-4 py-2.5 text-body text-text-primary outline-none focus:border-navy cursor-pointer">
                {ROLES.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-label font-bold uppercase tracking-wider text-text-muted mb-1.5">Payment Type</label>
              <select value={type} onChange={(e) => setType(e.target.value as PaymentType)}
                className="w-full rounded-input border-2 border-outline bg-canvas-alt px-4 py-2.5 text-body text-text-primary outline-none focus:border-navy cursor-pointer">
                {PAYMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-label font-bold uppercase tracking-wider text-text-muted mb-1.5">Amount (â‚¹)</label>
              <input type="number" placeholder="0" min="1" value={amount}
                onChange={(e) => setAmount(e.target.value)} className={inputCls('amount')} />
              {errors.amount && <p className="mt-1 text-label text-status-error">{errors.amount}</p>}
            </div>
          </div>

          <div>
            <label className="block text-label font-bold uppercase tracking-wider text-text-muted mb-1.5">Payment Method</label>
            <select value={via} onChange={(e) => setVia(e.target.value)}
              className="w-full rounded-input border-2 border-outline bg-canvas-alt px-4 py-2.5 text-body text-text-primary outline-none focus:border-navy cursor-pointer">
              {PAYMENT_METHODS.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-label font-bold uppercase tracking-wider text-text-muted mb-1.5">Property (Optional)</label>
            <input type="text" placeholder="e.g. Skyline Heights 14B" value={property}
              onChange={(e) => setProperty(e.target.value)} className={inputCls('property')} />
          </div>

          <div>
            <label className="block text-label font-bold uppercase tracking-wider text-text-muted mb-1.5">Note (Optional)</label>
            <textarea placeholder="e.g. Q3 commission settlement" value={note}
              onChange={(e) => setNote(e.target.value)} rows={2}
              className="w-full rounded-input border-2 border-outline bg-canvas-alt px-4 py-2.5 text-body text-text-primary placeholder:text-text-muted outline-none focus:border-navy focus:bg-white transition-all resize-none" />
          </div>

          <button type="submit" disabled={submitting}
            className={cn('w-full rounded-button py-3 text-body font-bold text-white transition-colors mt-1',
              submitting ? 'cursor-not-allowed bg-slate-400' : 'bg-navy hover:bg-slate-800 cursor-pointer')}>
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Processingâ€¦
              </span>
            ) : 'Confirm Payment'}
          </button>
        </form>
      </div>
    </div>
  )
}

// â”€â”€â”€ Summary Stat Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function StatCard({
  label, value, sub, icon: Icon, iconBg, trend,
}: {
  label: string
  value: string
  sub?: string
  icon: React.ElementType
  iconBg: string
  trend?: { value: string; positive: boolean }
}) {
  return (
    <div className="flex items-start gap-4 rounded-card border border-outline bg-white p-5 shadow-sm">
      <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-button', iconBg)}>
        <Icon size={22} className="text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-filter-label uppercase tracking-wider text-text-muted">{label}</p>
        <p className="mt-1 text-[28px] font-bold leading-none tracking-tight text-text-primary">{value}</p>
        {sub && <p className="mt-1 text-label text-text-muted">{sub}</p>}
        {trend && (
          <p className={cn('mt-1.5 flex items-center gap-1 text-label', trend.positive ? 'text-status-success' : 'text-status-error')}>
            {trend.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend.value}
          </p>
        )}
      </div>
    </div>
  )
}

// â”€â”€â”€ Main Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function AdminFinancePayments() {
  const navigate = useNavigate()
  const [localPayments, setLocalPayments] = useState<AdminPayment[]>(ALL_PAYMENTS)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<PaymentType | 'All Types'>('All Types')
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'All Status'>('All Status')
  const [directionFilter, setDirectionFilter] = useState<'inbound' | 'outbound' | 'All'>('All')
  const [dateRange, setDateRange] = useState<DateRange>('Last 30 Days')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [successToast, setSuccessToast] = useState('')

  // Derived stats
  const totalInbound = useMemo(() =>
    localPayments.filter((p) => p.status === 'Success' && p.direction === 'inbound')
      .reduce((s, p) => s + p.amount, 0), [localPayments])

  const totalOutbound = useMemo(() =>
    localPayments.filter((p) => p.status === 'Success' && p.direction === 'outbound')
      .reduce((s, p) => s + p.amount, 0), [localPayments])

  const pendingCount = useMemo(() =>
    localPayments.filter((p) => p.status === 'Pending').length, [localPayments])

  const failedCount = useMemo(() =>
    localPayments.filter((p) => p.status === 'Failed').length, [localPayments])

  const totalCommission = useMemo(() =>
    localPayments.filter((p) => p.status === 'Success' && p.type === 'Commission')
      .reduce((s, p) => s + p.amount, 0), [localPayments])

  // Filtered list
  const filtered = useMemo(() => {
    return localPayments.filter((p) => {
      if (typeFilter !== 'All Types' && p.type !== typeFilter) return false
      if (statusFilter !== 'All Status' && p.status !== statusFilter) return false
      if (directionFilter !== 'All' && p.direction !== directionFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          p.txnId.toLowerCase().includes(q) ||
          p.user.toLowerCase().includes(q) ||
          p.refId.toLowerCase().includes(q) ||
          (p.property?.toLowerCase().includes(q) ?? false)
        )
      }
      return true
    })
  }, [localPayments, typeFilter, statusFilter, directionFilter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const pageNumbers: (number | '...')[] = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (currentPage <= 3) return [1, 2, 3, '...', totalPages]
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 2, totalPages - 1, totalPages]
    return [1, '...', currentPage, '...', totalPages]
  }, [totalPages, currentPage])

  function showToast(msg: string) {
    setSuccessToast(msg)
    setTimeout(() => setSuccessToast(''), 4000)
  }

  const handleViewReceipt = (p: AdminPayment) => {
    navigate(`${ROUTES.ADMIN.FINANCE_PAYMENTS}/receipt/${encodeURIComponent(p.txnId)}`)
  }

  const handleRefund = (p: AdminPayment) => {
    confirm({
      title: 'Issue refund?',
      description: `â‚¹${p.amount.toLocaleString('en-IN')} will be refunded for ${p.txnId}.`,
      confirmLabel: 'Issue refund',
      variant: 'danger',
      onConfirm: () => {
        setLocalPayments((prev) =>
          prev.map((item) => item.id === p.id ? { ...item, status: 'Refunded' } : item)
        )
        showToast(`Refund issued for ${p.txnId}.`)
      },
    })
  }

  const handleRetry = (p: AdminPayment) => {
    confirm({
      title: 'Retry payment?',
      description: `Retry â‚¹${p.amount.toLocaleString('en-IN')} for ${p.user}?`,
      confirmLabel: 'Retry',
      onConfirm: () => {
        setLocalPayments((prev) =>
          prev.map((item) => item.id === p.id ? { ...item, status: 'Pending' } : item)
        )
        showToast(`Payment ${p.txnId} retried â€” now Pending.`)
      },
    })
  }

  const handleExport = () => {
    if (!filtered.length) { toast.error('Nothing to export', 'Adjust filters and try again.'); return }
    exportToCsv('admin-payments.csv', filtered, [
      { key: 'txnId', label: 'Transaction ID' },
      { key: 'refId', label: 'Reference ID' },
      { key: 'user', label: 'User' },
      { key: 'role', label: 'Role' },
      { key: 'type', label: 'Type' },
      { key: 'direction', label: 'Direction' },
      { key: 'amount', label: 'Amount (â‚¹)' },
      { key: 'via', label: 'Via' },
      { key: 'status', label: 'Status' },
      { key: 'date', label: 'Date' },
      { key: 'property', label: 'Property' },
      { key: 'note', label: 'Note' },
    ])
    toast.success('Export started', `${filtered.length} records downloaded.`)
  }

  return (
    <div className="min-h-screen bg-canvas-alt px-2 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-heading-1 font-bold tracking-tight text-text-primary">
              Finance & Payments
            </h1>
            <p className="mt-1 text-body text-text-muted">
              Monitor all capital flows â€” commissions, rent, subscriptions, refunds, and more.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button type="button" onClick={handleExport}
              className="inline-flex items-center gap-2 rounded-button border border-outline bg-white px-4 py-2.5 text-body font-medium text-text-primary shadow-sm hover:bg-hover-light transition-colors">
              <Download size={16} />
              Export CSV
            </button>
            <button type="button" onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 rounded-button bg-navy px-5 py-2.5 text-body font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors">
              <Banknote size={16} />
              Process Payment
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Total Inbound" value={`â‚¹${(totalInbound / 100000).toFixed(1)}L`}
            sub="Successful receipts" icon={ArrowDownLeft} iconBg="bg-green-600"
            trend={{ value: '+12.4% vs last month', positive: true }} />
          <StatCard label="Total Outbound" value={`â‚¹${(totalOutbound / 100000).toFixed(1)}L`}
            sub="Paid out successfully" icon={ArrowUpRight} iconBg="bg-navy"
            trend={{ value: '+8.1% vs last month', positive: true }} />
          <StatCard label="Commission Paid" value={`â‚¹${(totalCommission / 100000).toFixed(1)}L`}
            sub="To brokers this month" icon={CheckCircle2} iconBg="bg-orange-500"
            trend={{ value: '+5.2% vs last month', positive: true }} />
          <StatCard label="Pending" value={String(pendingCount)}
            sub="Awaiting clearance" icon={RefreshCw} iconBg="bg-amber-500" />
          <StatCard label="Failed" value={String(failedCount)}
            sub="Require attention" icon={RotateCcw} iconBg="bg-status-error"
            trend={{ value: '-2 from last week', positive: true }} />
        </div>

        {/* Filters + search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" placeholder="Search by TXN ID, user, propertyâ€¦"
              value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="h-10 w-full rounded-input border border-outline bg-white pl-10 pr-4 text-body text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
          </div>

          {([
            { label: 'Type', value: typeFilter, setter: (v: string) => { setTypeFilter(v as typeof typeFilter); setPage(1) },
              options: ['All Types', ...PAYMENT_TYPES] },
            { label: 'Status', value: statusFilter, setter: (v: string) => { setStatusFilter(v as typeof statusFilter); setPage(1) },
              options: ['All Status', 'Success', 'Pending', 'Failed', 'Refunded'] },
            { label: 'Direction', value: directionFilter, setter: (v: string) => { setDirectionFilter(v as typeof directionFilter); setPage(1) },
              options: ['All', 'inbound', 'outbound'] },
            { label: 'Range', value: dateRange, setter: (v: string) => setDateRange(v as DateRange),
              options: ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'This Year'] },
          ] as const).map((f) => (
            <div key={f.label} className="flex items-center gap-2 shrink-0">
              <span className="text-label font-semibold text-text-muted">{f.label}:</span>
              <select value={f.value} onChange={(e) => f.setter(e.target.value)}
                className="h-10 rounded-input border border-outline bg-white px-3 pr-8 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 cursor-pointer">
                {f.options.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>

        {/* Payments list */}
        <div className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
          <div className="border-b border-outline px-6 py-4 flex items-center justify-between">
            <p className="text-body font-semibold text-text-primary">
              {filtered.length} transaction{filtered.length !== 1 ? 's' : ''} found
            </p>
            <p className="text-label text-text-muted">{dateRange}</p>
          </div>

          {paginated.length > 0 ? (
            paginated.map((p) => (
              <PaymentRow
                key={p.id}
                payment={p}
                onViewReceipt={handleViewReceipt}
                onRefund={handleRefund}
                onRetry={handleRetry}
              />
            ))
          ) : (
            <div className="py-16 text-center">
              <Banknote size={40} className="mx-auto text-text-muted opacity-40 mb-3" />
              <p className="text-body font-semibold text-text-muted">No transactions found</p>
              <p className="mt-1 text-label text-text-muted">Try adjusting search or filters.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={cn('inline-flex items-center gap-1.5 rounded-button px-4 py-2 text-body font-semibold border-0 transition-colors',
                currentPage === 1 ? 'cursor-not-allowed text-text-muted opacity-40 bg-transparent' : 'cursor-pointer text-text-primary hover:bg-hover-light bg-transparent')}>
              â† Previous
            </button>
            <div className="flex items-center gap-1">
              {pageNumbers.map((n, i) =>
                n === '...' ? (
                  <span key={`e-${i}`} className="px-2 text-text-muted">â€¦</span>
                ) : (
                  <button key={n} type="button" onClick={() => setPage(n as number)}
                    className={cn('h-9 w-9 rounded-button text-body font-semibold border-0 cursor-pointer transition-colors',
                      currentPage === n ? 'bg-navy text-white' : 'bg-transparent text-text-muted hover:bg-hover-light')}>
                    {n}
                  </button>
                )
              )}
            </div>
            <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={cn('inline-flex items-center gap-1.5 rounded-button px-4 py-2 text-body font-semibold border-0 transition-colors',
                currentPage === totalPages ? 'cursor-not-allowed text-text-muted opacity-40 bg-transparent' : 'cursor-pointer text-text-primary hover:bg-hover-light bg-transparent')}>
              Next â†’
            </button>
          </div>
        )}

        {/* Footer note */}
        <p className="text-center text-[11px] font-semibold uppercase tracking-wider text-text-muted pb-2">
          RENTILO Admin Finance Portal â€¢ All figures in INR â€¢ Data refreshed on page load
        </p>
      </div>

      {/* Process Payment Modal */}
      {showModal && (
        <ProcessPaymentModal
          onClose={() => setShowModal(false)}
          onSuccess={(p) => {
            setLocalPayments((prev) => [p, ...prev])
            showToast(`Payment ${p.txnId} created â€” status: Pending.`)
          }}
        />
      )}

      {/* Success toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-[9999] flex w-[360px] max-w-[calc(100vw-32px)] items-start gap-3 overflow-hidden rounded-xl border border-outline bg-white shadow-modal">
          <div className="absolute bottom-0 left-0 top-0 w-1 rounded-l-xl bg-status-success" />
          <div className="flex w-full items-start gap-3 pl-5 pr-4 py-4">
            <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-status-success" />
            <p className="flex-1 text-body font-semibold text-text-primary">{successToast}</p>
            <button type="button" onClick={() => setSuccessToast('')}
              className="mt-0.5 rounded-button p-1 text-text-muted hover:bg-hover-light transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}


