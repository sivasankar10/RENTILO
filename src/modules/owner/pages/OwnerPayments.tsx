import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { ROUTES } from '@shared/constants/routes'
import {
  usePaymentsStore,
  type PaymentCategory,
  type PaymentStatus,
  type PlatformPayment,
} from '@shared/store/paymentsStore'
import { DEMO_OWNER } from '@shared/store/onboardingStore'

const PAGE_SIZE = 6

const statusConfig: Record<PaymentStatus, { dot: string; text: string; bg: string }> = {
  Successful: { dot: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50' },
  Failed: { dot: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50' },
  Pending: { dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' },
}

const categoryColors: Record<PaymentCategory, string> = {
  RENT: 'bg-blue-50 text-blue-700',
  'SECURITY DEPOSIT': 'bg-purple-50 text-purple-700',
  'UTILITY BILL': 'bg-teal-50 text-teal-700',
  MAINTENANCE: 'bg-orange-50 text-orange-700',
  PREMIUM: 'bg-indigo-50 text-indigo-700',
  OTHER: 'bg-slate-50 text-slate-700',
}

function StatusBadge({ status }: { status: PaymentStatus }) {
  const c = statusConfig[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-bold', c.bg, c.text)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} />
      {status}
    </span>
  )
}

function PaymentRow({
  payment,
  mode,
  onView,
}: {
  payment: PlatformPayment
  mode: 'received' | 'sent'
  onView: (payment: PlatformPayment) => void
}) {
  const stamp = new Date(payment.paidAtIso)
  const date = stamp.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  const time = stamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onView(payment)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onView(payment)
        }
      }}
      className="cursor-pointer border-b border-outline px-6 py-5 last:border-0 hover:bg-canvas-alt/60 transition-colors"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-navy">
              {mode === 'received' ? (
                <>
                  <ArrowDownLeft size={16} className="text-status-success" />
                  From: {payment.tenantName ?? 'Tenant'}
                </>
              ) : (
                <>
                  <ArrowUpRight size={16} className="text-primary" />
                  To: {payment.counterparty}
                </>
              )}
            </span>
            <span className={cn('inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide', categoryColors[payment.category])}>
              {payment.category}
            </span>
          </div>
          <div className="font-display text-[26px] font-extrabold leading-none text-navy">
            {payment.amountDisplay.startsWith('$') || payment.amountDisplay.startsWith('₹')
              ? payment.amountDisplay
              : `₹${payment.amount.toLocaleString('en-IN')}`}
          </div>
          {payment.propertyName && (
            <p className="mt-2 text-[13px] font-medium text-text-primary">
              {payment.propertyName}
              {payment.unit ? ` · ${payment.unit}` : ''}
            </p>
          )}
          {payment.description && (
            <p className="mt-1 text-[12px] text-text-muted">{payment.description}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-[12px] font-medium text-text-muted">
            <span>
              TXN: <span className="font-semibold text-text-primary">{payment.txnId}</span>
            </span>
            <span className="text-outline">•</span>
            <span>
              REF: <span className="font-semibold text-text-primary">{payment.refId}</span>
            </span>
            <span className="text-outline">•</span>
            <span>
              VIA: <span className="font-semibold text-text-primary">{payment.method}</span>
            </span>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <StatusBadge status={payment.status} />
          <span className="text-[12px] text-text-muted">
            {date}, {time}
          </span>
        </div>
      </div>
    </div>
  )
}

export function OwnerPayments() {
  const navigate = useNavigate()
  const payments = usePaymentsStore((state) => state.payments)
  const [tab, setTab] = useState<'received' | 'sent'>('received')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const ownerId = DEMO_OWNER.id

  const received = useMemo(
    () =>
      payments.filter(
        (payment) => payment.ownerId === ownerId && payment.flow === 'tenant_to_owner',
      ),
    [payments, ownerId],
  )

  const sent = useMemo(
    () =>
      payments.filter(
        (payment) => payment.ownerId === ownerId && payment.flow === 'owner_outgoing',
      ),
    [payments, ownerId],
  )

  const activeList = tab === 'received' ? received : sent

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return activeList
    return activeList.filter(
      (payment) =>
        payment.txnId.toLowerCase().includes(query) ||
        payment.tenantName?.toLowerCase().includes(query) ||
        payment.propertyName?.toLowerCase().includes(query) ||
        payment.counterparty.toLowerCase().includes(query) ||
        payment.category.toLowerCase().includes(query),
    )
  }, [activeList, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const receivedTotal = received.reduce((sum, payment) => sum + payment.amount, 0)
  const sentTotal = sent.reduce((sum, payment) => sum + payment.amount, 0)

  return (
    <div className="min-h-screen bg-canvas-alt px-5 py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 border-b border-outline pb-6">
          <p className="text-filter-label font-bold uppercase tracking-wider text-primary">Finances</p>
          <h1 className="mt-2 text-heading-1 font-extrabold text-navy">Payments</h1>
          <p className="mt-2 text-body text-text-muted">
            Track rent and deposits received from tenants, and outgoing platform payments.
          </p>
        </header>

        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-card border border-outline bg-white p-5 shadow-surface">
            <p className="text-filter-label font-bold uppercase tracking-wider text-text-muted">Received</p>
            <p className="mt-2 font-display text-[28px] font-extrabold text-navy">
              ₹{receivedTotal.toLocaleString('en-IN')}
            </p>
            <p className="mt-1 text-label text-text-muted">{received.length} incoming transactions</p>
          </div>
          <div className="rounded-card border border-outline bg-white p-5 shadow-surface">
            <p className="text-filter-label font-bold uppercase tracking-wider text-text-muted">Sent</p>
            <p className="mt-2 font-display text-[28px] font-extrabold text-navy">
              {sent.some((p) => p.amountDisplay.startsWith('$'))
                ? sent.map((p) => p.amountDisplay).join(', ') || '₹0'
                : `₹${sentTotal.toLocaleString('en-IN')}`}
            </p>
            <p className="mt-1 text-label text-text-muted">{sent.length} outgoing transactions</p>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {(['received', 'sent'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setTab(item)
                setPage(1)
              }}
              className={cn(
                'rounded-button px-4 py-2 text-label font-bold capitalize',
                tab === item ? 'bg-navy text-white' : 'border border-outline bg-white text-text-primary',
              )}
            >
              {item === 'received' ? `Received (${received.length})` : `Sent (${sent.length})`}
            </button>
          ))}
        </div>

        <div className="mb-5">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Search by tenant, property, transaction ID..."
            className="w-full rounded-input border border-outline bg-white px-4 py-3 text-body outline-none focus:border-primary"
          />
        </div>

        <div className="overflow-hidden rounded-card border border-outline bg-white shadow-surface">
          {paginated.length > 0 ? (
            paginated.map((payment) => (
              <PaymentRow
                key={payment.id}
                payment={payment}
                mode={tab}
                onView={(item) => navigate(ROUTES.OWNER.PAYMENT_RECEIPT(item.id))}
              />
            ))
          ) : (
            <div className="py-16 text-center">
              <p className="text-body-lg font-semibold text-text-muted">No payments yet</p>
              <p className="mt-1 text-body text-text-muted">
                {tab === 'received'
                  ? 'Tenant onboarding and rent payments will appear here once received.'
                  : 'Outgoing payments such as premium subscriptions will appear here.'}
              </p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-5 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={cn(
                  'h-9 w-9 rounded-lg text-body font-semibold',
                  currentPage === n ? 'bg-navy text-white' : 'bg-white text-text-muted border border-outline',
                )}
              >
                {n}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
