import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  Download,
  FileText,
  Printer,
  ReceiptText,
  RefreshCw,
  RotateCcw,
  Shield,
  Tag,
  User,
  Wallet,
} from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { ROUTES } from '@shared/constants/routes'
import { usePrototypeStore } from '@shared/store/prototypeStore'
import { confirm } from '../components/ConfirmDialog'
import { toast } from '../components/Toast'
import {
  ALL_PAYMENTS,
  getPaymentReceiptMeta,
  statusConfig,
  typeColors,
  roleColors,
  type AdminPayment,
} from '../constants/payments'

// ─── Helper ──────────────────────────────────────────────────────────────────

function findPayment(txnId: string): AdminPayment | undefined {
  const decoded = decodeURIComponent(txnId)
  return ALL_PAYMENTS.find((p) => p.txnId === decoded || p.txnId === txnId)
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function InfoTile({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    void navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="group relative rounded-button bg-canvas-alt px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{label}</p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <p className={cn('text-body font-bold text-text-primary break-all', mono && 'font-mono text-[13px]')}>
          {value}
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded text-text-muted hover:text-text-primary"
          aria-label={`Copy ${label}`}
        >
          {copied ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  )
}

function AmountRow({ label, value, strong = false, color }: { label: string; value: string; strong?: boolean; color?: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={cn('text-body', strong ? 'font-bold text-text-primary' : 'text-text-muted')}>{label}</span>
      <span className={cn('text-body font-semibold', strong ? 'font-extrabold text-text-primary' : 'text-text-primary', color)}>
        {value}
      </span>
    </div>
  )
}

function StatusBadge({ payment }: { payment: AdminPayment }) {
  const c = statusConfig[payment.status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-bold', c.bg, c.text, 'border', c.border)}>
      <span className={cn('h-2 w-2 rounded-full', c.dot)} />
      {payment.status}
    </span>
  )
}

// ─── Timeline step ───────────────────────────────────────────────────────────

interface TimelineStep {
  label: string
  time: string
  done: boolean
  active?: boolean
}

function getTimeline(payment: AdminPayment): TimelineStep[] {
  const base = [
    { label: 'Payment Initiated',    time: payment.time,      done: true,  active: false },
    { label: 'Bank / Gateway Auth',  time: '+0:12',           done: payment.status !== 'Failed', active: false },
    { label: 'Processing',           time: '+0:45',           done: payment.status === 'Success' || payment.status === 'Refunded', active: payment.status === 'Pending' },
    { label: payment.status === 'Refunded' ? 'Refund Issued' : 'Settlement Complete',
      time: payment.status === 'Success' ? '+2:30' : payment.status === 'Refunded' ? '+5:00' : '—',
      done: payment.status === 'Success' || payment.status === 'Refunded',
      active: false },
  ]
  return base
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function AdminPaymentReceipt() {
  const { transactionId } = useParams<{ transactionId: string }>()
  const navigate = useNavigate()
  const sharedPayment = usePrototypeStore((state) =>
    state.payments.find((payment) => payment.txnId === decodeURIComponent(transactionId ?? '')),
  )
  const users = usePrototypeStore((state) => state.users)
  const properties = usePrototypeStore((state) => state.properties)
  const setPaymentStatus = usePrototypeStore((state) => state.setPaymentStatus)
  const [fallbackPayment, setFallbackPayment] = useState<AdminPayment | undefined>(() =>
    findPayment(transactionId ?? '')
  )
  const sharedUser = sharedPayment
    ? users.find((user) => user.id === (sharedPayment.brokerId ?? sharedPayment.tenantId ?? sharedPayment.ownerId))
    : undefined
  const sharedProperty = sharedPayment
    ? properties.find((property) => property.id === sharedPayment.propertyId)
    : undefined
  const payment: AdminPayment | undefined = sharedPayment ? {
    id: sharedPayment.id,
    txnId: sharedPayment.txnId,
    refId: sharedPayment.refId,
    user: sharedUser?.accountName ?? sharedPayment.counterparty,
    userInitials: sharedUser ? `${sharedUser.firstName[0] ?? ''}${sharedUser.lastName[0] ?? ''}` : 'SU',
    avatarColor: 'bg-primary',
    role: sharedPayment.brokerId ? 'Broker' : sharedPayment.tenantId ? 'Tenant' : 'Owner',
    type: sharedPayment.category === 'COMMISSION' ? 'Commission' : sharedPayment.category === 'SECURITY DEPOSIT' ? 'Security Deposit' : sharedPayment.category === 'PREMIUM' ? 'Subscription' : 'Rent',
    direction: sharedPayment.flow === 'tenant_to_owner' ? 'inbound' : 'outbound',
    amount: sharedPayment.amount,
    via: sharedPayment.method,
    status: sharedPayment.status === 'Successful' ? 'Success' : sharedPayment.status,
    date: new Date(sharedPayment.paidAtIso).toLocaleDateString('en-IN'),
    time: new Date(sharedPayment.paidAtIso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    property: sharedProperty?.title,
    note: sharedPayment.description,
  } : fallbackPayment

  // Not found state
  if (!payment) {
    return (
      <div className="min-h-screen bg-canvas-alt px-2 py-8 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-card border border-outline bg-white p-10 text-center shadow-surface">
          <ReceiptText size={48} className="mx-auto text-text-muted opacity-40" />
          <h1 className="mt-4 text-heading-2 font-bold text-text-primary">Receipt not found</h1>
          <p className="mt-2 text-body text-text-muted">
            The transaction receipt may have been removed or the link is invalid.
          </p>
          <button
            type="button"
            onClick={() => navigate(ROUTES.ADMIN.FINANCE_PAYMENTS)}
            className="mt-6 inline-flex items-center gap-2 rounded-button bg-navy px-5 py-2.5 text-body font-semibold text-white hover:bg-slate-800"
          >
            <ArrowLeft size={16} />
            Back to Finance
          </button>
        </div>
      </div>
    )
  }

  const meta = getPaymentReceiptMeta(payment)
  const timeline = getTimeline(payment)

  const handleRefund = () => {
    confirm({
      title: 'Issue refund?',
      description: `₹${payment.amount.toLocaleString('en-IN')} will be refunded for ${payment.txnId}.`,
      confirmLabel: 'Issue refund',
      variant: 'danger',
      onConfirm: () => {
        if (sharedPayment) setPaymentStatus(sharedPayment.id, 'Refunded')
        else setFallbackPayment({ ...payment, status: 'Refunded' })
        toast.success('Refund issued', `${payment.txnId} has been refunded.`)
      },
    })
  }

  const handleRetry = () => {
    confirm({
      title: 'Retry payment?',
      description: `Retry ₹${payment.amount.toLocaleString('en-IN')} for ${payment.user}?`,
      confirmLabel: 'Retry',
      onConfirm: () => {
        if (sharedPayment) setPaymentStatus(sharedPayment.id, 'Pending')
        else setFallbackPayment({ ...payment, status: 'Pending' })
        toast.success('Payment retried', `${payment.txnId} is now Pending.`)
      },
    })
  }

  const handleDownload = () => {
    toast.success('Receipt downloading', `${meta.receiptNo} will be saved to your device.`)
  }

  return (
    <div className="min-h-screen bg-canvas-alt px-2 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate(ROUTES.ADMIN.FINANCE_PAYMENTS)}
            className="inline-flex items-center gap-2 rounded-button border border-outline bg-white px-4 py-2.5 text-body font-semibold text-text-primary hover:bg-hover-light transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Finance
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {payment.status === 'Failed' && (
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center gap-2 rounded-button border border-amber-200 bg-amber-50 px-4 py-2.5 text-body font-semibold text-amber-700 hover:bg-amber-100 transition-colors"
              >
                <RefreshCw size={16} />
                Retry Payment
              </button>
            )}
            {(payment.status === 'Success' || payment.status === 'Pending') && payment.direction === 'inbound' && (
              <button
                type="button"
                onClick={handleRefund}
                className="inline-flex items-center gap-2 rounded-button border border-red-200 bg-red-50 px-4 py-2.5 text-body font-semibold text-red-600 hover:bg-red-100 transition-colors"
              >
                <RotateCcw size={16} />
                Issue Refund
              </button>
            )}
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-button border border-outline bg-white px-4 py-2.5 text-body font-semibold text-text-primary hover:bg-hover-light transition-colors"
            >
              <Printer size={16} />
              Print
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-button bg-navy px-4 py-2.5 text-body font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              <Download size={16} />
              Download PDF
            </button>
          </div>
        </div>

        {/* ── Hero receipt card ── */}
        <div className="overflow-hidden rounded-2xl border border-outline bg-white shadow-surface">

          {/* Navy header */}
          <div className="border-b border-white/10 bg-[#0F172A] px-8 py-7 text-white">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/50">
                  RENTILO Admin · Official Receipt
                </p>
                <h1 className="mt-2 text-[32px] font-extrabold leading-none tracking-tight">
                  Payment Receipt
                </h1>
                <p className="mt-2 text-body text-white/60">
                  {payment.date} at {payment.time}
                </p>
              </div>

              {/* Receipt meta chip */}
              <div className="flex flex-col items-start gap-3 rounded-xl border border-white/15 bg-white/10 px-5 py-4 sm:items-end">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Receipt No.</p>
                  <p className="mt-1 font-mono text-[18px] font-bold text-white">{meta.receiptNo}</p>
                </div>
                <StatusBadge payment={payment} />
              </div>
            </div>

            {/* Amount hero */}
            <div className="mt-6 flex flex-wrap items-end gap-4 border-t border-white/10 pt-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-white/50">
                  {payment.direction === 'inbound' ? 'Amount Received' : 'Amount Paid Out'}
                </p>
                <p className={cn(
                  'mt-1 text-[42px] font-extrabold leading-none tracking-tight',
                  payment.direction === 'inbound' ? 'text-green-400' : 'text-white',
                )}>
                  {payment.direction === 'inbound' ? '+' : '−'}₹{payment.amount.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 pb-1">
                <span className={cn('inline-block rounded-full px-3 py-1 text-[12px] font-bold', typeColors[payment.type])}>
                  {payment.type}
                </span>
                <span className={cn('inline-block rounded-full px-3 py-1 text-[12px] font-bold', roleColors[payment.role])}>
                  {payment.role}
                </span>
                <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1">
                  {payment.direction === 'inbound'
                    ? <ArrowDownLeft size={13} className="text-green-400" />
                    : <ArrowUpRight size={13} className="text-orange-400" />
                  }
                  <span className="text-[12px] font-bold text-white/80 capitalize">{payment.direction}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Body — two columns */}
          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_320px]">

            {/* ── Left column ── */}
            <div className="space-y-5">

              {/* Party info */}
              <div className="rounded-card border border-outline p-5">
                <div className="flex items-center gap-2 mb-4">
                  <User size={18} className="text-primary" />
                  <h2 className="text-heading-3 font-bold text-text-primary">
                    {payment.direction === 'inbound' ? 'Received From' : 'Paid To'}
                  </h2>
                </div>
                <div className="flex items-center gap-4">
                  <div className={cn('flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-body font-bold text-white text-[18px]', payment.avatarColor)}>
                    {payment.userInitials}
                  </div>
                  <div>
                    <p className="text-body-lg font-bold text-text-primary">{payment.user}</p>
                    <span className={cn('mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold', roleColors[payment.role])}>
                      {payment.role}
                    </span>
                    {payment.property && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-label text-text-muted">
                        <Building2 size={13} />
                        {payment.property}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Transaction details grid */}
              <div className="rounded-card border border-outline p-5">
                <div className="flex items-center gap-2 mb-4">
                  <FileText size={18} className="text-primary" />
                  <h2 className="text-heading-3 font-bold text-text-primary">Transaction Details</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoTile label="Transaction ID"    value={payment.txnId} mono />
                  <InfoTile label="Reference ID"      value={payment.refId} mono />
                  <InfoTile label="Payment Date"      value={payment.date} />
                  <InfoTile label="Payment Time"      value={payment.time} />
                  <InfoTile label="Payment Method"    value={payment.via} />
                  <InfoTile label="Direction"         value={payment.direction === 'inbound' ? 'Inbound Receipt' : 'Outbound Payout'} />
                  <InfoTile label="Payment Type"      value={payment.type} />
                  <InfoTile label="Processed By"      value="RENTILO Admin Finance" />
                  {payment.property && (
                    <InfoTile label="Property"        value={payment.property} />
                  )}
                  {payment.note && (
                    <div className="sm:col-span-2">
                      <InfoTile label="Note"          value={payment.note} />
                    </div>
                  )}
                </div>
              </div>

              {/* Payment timeline */}
              <div className="rounded-card border border-outline p-5">
                <div className="flex items-center gap-2 mb-5">
                  <Clock size={18} className="text-primary" />
                  <h2 className="text-heading-3 font-bold text-text-primary">Payment Timeline</h2>
                </div>
                <div className="relative pl-6">
                  {/* vertical line */}
                  <div className="absolute left-[9px] top-2 bottom-2 w-px bg-outline" />
                  <div className="space-y-5">
                    {timeline.map((step, idx) => (
                      <div key={idx} className="relative flex items-start gap-3">
                        <div className={cn(
                          'absolute -left-6 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                          step.done
                            ? 'border-green-500 bg-green-500'
                            : step.active
                              ? 'border-amber-500 bg-amber-50'
                              : 'border-outline bg-white',
                        )}>
                          {step.done && <CheckCircle2 size={11} className="text-white" />}
                          {step.active && <span className="h-2 w-2 rounded-full bg-amber-500" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={cn('text-body font-semibold', step.done ? 'text-text-primary' : step.active ? 'text-amber-700' : 'text-text-muted')}>
                            {step.label}
                          </p>
                          <p className="text-label text-text-muted">{step.done || step.active ? step.time : '—'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status-specific alert */}
              {payment.status === 'Failed' && (
                <div className="rounded-card border border-red-200 bg-red-50 p-5">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={18} className="mt-0.5 shrink-0 text-red-600" />
                    <div>
                      <p className="text-body font-bold text-red-800">Payment Failed</p>
                      <p className="mt-1 text-label leading-5 text-red-700">
                        This transaction did not complete. Use the Retry button to reprocess, or contact the user to confirm payment details.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {payment.status === 'Pending' && (
                <div className="rounded-card border border-amber-200 bg-amber-50 p-5">
                  <div className="flex items-start gap-3">
                    <Clock size={18} className="mt-0.5 shrink-0 text-amber-700" />
                    <div>
                      <p className="text-body font-bold text-amber-800">Awaiting Settlement</p>
                      <p className="mt-1 text-label leading-5 text-amber-700">
                        This payment is currently being processed. Settlement typically completes within 1–2 business days.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right column ── */}
            <div className="space-y-5">

              {/* Amount breakdown */}
              <div className="rounded-card border border-outline bg-canvas-alt p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Wallet size={18} className="text-primary" />
                  <p className="text-body font-bold text-text-primary">Amount Breakdown</p>
                </div>
                <div className="space-y-3">
                  <AmountRow
                    label="Gross Amount"
                    value={`₹${payment.amount.toLocaleString('en-IN')}`}
                    strong
                    color={payment.direction === 'inbound' ? 'text-green-700' : undefined}
                  />
                  {meta.platformFee > 0 && (
                    <AmountRow label="Platform Fee (1%)"  value={`−₹${meta.platformFee.toLocaleString('en-IN')}`} />
                  )}
                  {meta.gst > 0 && (
                    <AmountRow label="GST on Platform Fee (18%)" value={`−₹${meta.gst.toLocaleString('en-IN')}`} />
                  )}
                  {meta.tds > 0 && (
                    <AmountRow label="TDS (5% on Commission)"     value={`−₹${meta.tds.toLocaleString('en-IN')}`} />
                  )}
                  <div className="border-t border-outline pt-3">
                    <AmountRow
                      label="Net Settled"
                      value={`₹${meta.netSettled.toLocaleString('en-IN')}`}
                      strong
                    />
                  </div>
                </div>
              </div>

              {/* Payment method chip */}
              <div className="rounded-card border border-outline p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard size={18} className="text-primary" />
                  <p className="text-body font-bold text-text-primary">Payment Method</p>
                </div>
                <div className="flex items-center gap-3 rounded-button bg-canvas-alt px-4 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-button bg-white border border-outline">
                    <CreditCard size={16} className="text-text-muted" />
                  </div>
                  <div>
                    <p className="text-body font-bold text-text-primary">{payment.via}</p>
                    <p className="text-label text-text-muted">
                      {payment.direction === 'inbound' ? 'Used by payer' : 'Used for disbursement'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Receipt status chip */}
              <div className="rounded-card border border-outline p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Tag size={18} className="text-primary" />
                  <p className="text-body font-bold text-text-primary">Receipt Status</p>
                </div>
                <div className={cn('flex items-start gap-3 rounded-button border p-3', statusConfig[payment.status].bg, statusConfig[payment.status].border)}>
                  <ReceiptText size={18} className={cn('mt-0.5 shrink-0', statusConfig[payment.status].text)} />
                  <div>
                    <p className={cn('text-body font-bold', statusConfig[payment.status].text)}>{payment.status}</p>
                    <p className="mt-1 text-label text-text-muted">
                      {payment.status === 'Success' && 'Transaction completed and settled.'}
                      {payment.status === 'Pending' && 'Awaiting bank clearance.'}
                      {payment.status === 'Failed' && 'Transaction could not be processed.'}
                      {payment.status === 'Refunded' && 'Amount reversed to originating account.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Compliance / audit note */}
              <div className="rounded-card border border-outline p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={18} className="text-primary" />
                  <p className="text-body font-bold text-text-primary">Audit & Compliance</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-label text-text-muted">
                    <BadgeCheck size={14} className="text-green-500 shrink-0" />
                    All admin actions are logged for audit.
                  </div>
                  <div className="flex items-center gap-2 text-label text-text-muted">
                    <BadgeCheck size={14} className="text-green-500 shrink-0" />
                    Receipt is valid for finance and tax records.
                  </div>
                  <div className="flex items-center gap-2 text-label text-text-muted">
                    <BadgeCheck size={14} className="text-green-500 shrink-0" />
                    Processed under RENTILO Finance System v2.
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex w-full items-center justify-center gap-2 rounded-button bg-navy px-4 py-3 text-body font-semibold text-white hover:bg-slate-800 transition-colors"
                >
                  <Download size={16} />
                  Download PDF Receipt
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex w-full items-center justify-center gap-2 rounded-button border border-outline bg-white px-4 py-3 text-body font-semibold text-text-primary hover:bg-hover-light transition-colors"
                >
                  <Printer size={16} />
                  Print Receipt
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-outline bg-canvas-alt px-8 py-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-label text-text-muted">
                RENTILO Admin Finance Portal · {meta.receiptNo}
              </p>
              <p className="text-label text-text-muted">
                Generated: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
