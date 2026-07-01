import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Download,
  Plus,
  ReceiptText,
  Search,
  X,
} from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { useAuth } from '@shared/hooks/useAuth'
import { usePaymentsStore } from '@shared/store/paymentsStore'

type PaymentStatus = 'Received' | 'Pending' | 'Failed'
type PaymentCategory = 'Rent' | 'Security Deposit' | 'Maintenance' | 'Late Fee' | 'Platform Service'
type PaymentMethod = 'UPI' | 'Bank Transfer' | 'Credit Card' | 'Cash'

interface OwnerPayment {
  id: string
  from: string
  property: string
  category: PaymentCategory
  amount: number
  txnId: string
  refId: string
  via: PaymentMethod
  status: PaymentStatus
  date: string
  time: string
}

const PAGE_SIZE = 4

const statusStyles: Record<PaymentStatus, string> = {
  Received: 'bg-green-50 text-green-700',
  Pending: 'bg-amber-50 text-amber-700',
  Failed: 'bg-red-50 text-red-700',
}

const categoryStyles: Record<PaymentCategory, string> = {
  Rent: 'bg-blue-50 text-blue-700',
  'Security Deposit': 'bg-violet-50 text-violet-700',
  Maintenance: 'bg-orange-50 text-orange-700',
  'Late Fee': 'bg-slate-100 text-slate-700',
  'Platform Service': 'bg-cyan-50 text-cyan-700',
}

function StatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-badge font-bold', statusStyles[status])}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}

function CategoryBadge({ category }: { category: PaymentCategory }) {
  return (
    <span className={cn('inline-flex rounded-pill px-2.5 py-1 text-badge font-bold', categoryStyles[category])}>
      {category}
    </span>
  )
}

function PaymentRow({ payment }: { payment: OwnerPayment }) {
  const canDownload = payment.status !== 'Failed'

  return (
    <div className="border-b border-outline px-6 py-5 transition-colors last:border-0 hover:bg-canvas-alt">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="text-body font-bold text-text-primary">From: {payment.from}</span>
            <CategoryBadge category={payment.category} />
          </div>
          <p className="text-heading-2 font-black leading-none text-text-primary">
            ${payment.amount.toLocaleString('en-US')}
          </p>
          <p className="mt-2 text-label font-semibold text-text-muted">{payment.property}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-label text-text-muted">
            <span>TXN ID: <span className="font-bold text-text-primary">{payment.txnId}</span></span>
            <span className="text-outline">|</span>
            <span>REF ID: <span className="font-bold text-text-primary">{payment.refId}</span></span>
            <span className="text-outline">|</span>
            <span>VIA: <span className="font-bold text-text-primary">{payment.via}</span></span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 lg:items-end">
          <StatusBadge status={payment.status} />
          <span className="text-label text-text-muted">{payment.date}, {payment.time}</span>
          {canDownload ? (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-label font-bold text-text-primary transition-colors hover:text-primary"
            >
              <Download size={15} />
              Download Receipt
            </button>
          ) : (
            <span className="text-label font-semibold text-text-muted">Receipt unavailable</span>
          )}
        </div>
      </div>
    </div>
  )
}

function RecordPaymentModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (input: { tenant: string; amount: number; category: PaymentCategory; method: PaymentMethod }) => void }) {
  const [tenant, setTenant] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<PaymentCategory>('Rent')
  const [method, setMethod] = useState<PaymentMethod>('Bank Transfer')
  const [error, setError] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!tenant.trim() || !amount.trim() || Number(amount) <= 0) {
      setError('Enter a tenant name and valid amount.')
      return
    }

    setError('')
    onSuccess({ tenant: tenant.trim(), amount: Number(amount), category, method })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <section className="relative w-full max-w-lg overflow-hidden rounded-modal bg-white shadow-modal">
        <header className="flex items-start justify-between gap-4 border-b border-outline px-6 py-5">
          <div>
            <h2 className="text-heading-3 font-bold text-text-primary">Record Payment</h2>
            <p className="mt-1 text-label text-text-muted">Add an owner-side payment entry.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-button p-2 text-text-muted hover:bg-hover-light" aria-label="Close">
            <X size={18} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <label className="block">
            <span className="text-filter-label uppercase tracking-wider text-text-muted">Tenant</span>
            <input value={tenant} onChange={(event) => setTenant(event.target.value)} placeholder="e.g. Sarah Miller" className="mt-1.5 h-11 w-full rounded-input border border-outline bg-canvas-alt px-4 text-body outline-none focus:border-primary focus:ring-2 focus:ring-primary-100" />
          </label>
          <label className="block">
            <span className="text-filter-label uppercase tracking-wider text-text-muted">Amount</span>
            <input type="number" min="1" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0" className="mt-1.5 h-11 w-full rounded-input border border-outline bg-canvas-alt px-4 text-body outline-none focus:border-primary focus:ring-2 focus:ring-primary-100" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-filter-label uppercase tracking-wider text-text-muted">Category</span>
              <select value={category} onChange={(event) => setCategory(event.target.value as PaymentCategory)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-canvas-alt px-3 text-body outline-none focus:border-primary focus:ring-2 focus:ring-primary-100">
                {(['Rent', 'Security Deposit', 'Maintenance', 'Late Fee'] as PaymentCategory[]).map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-filter-label uppercase tracking-wider text-text-muted">Payment Via</span>
              <select value={method} onChange={(event) => setMethod(event.target.value as PaymentMethod)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-canvas-alt px-3 text-body outline-none focus:border-primary focus:ring-2 focus:ring-primary-100">
                {(['UPI', 'Bank Transfer', 'Credit Card', 'Cash'] as PaymentMethod[]).map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>
          {error && <p className="text-label font-semibold text-status-error-text">{error}</p>}
          <button type="submit" className="w-full rounded-button bg-navy px-4 py-3 text-body font-semibold text-white transition-colors hover:bg-slate-800">
            Save Payment
          </button>
        </form>
      </section>
    </div>
  )
}

export function OwnerPayments() {
  const { user } = useAuth()
  const ownerId = user?.id ?? ''
  const storePayments = usePaymentsStore((state) => state.payments)
  const addTenantPayment = usePaymentsStore((state) => state.addTenantPayment)
  const ownerPayments = useMemo<OwnerPayment[]>(() => storePayments.filter((payment) => payment.ownerId === ownerId).map((payment) => {
    const date = new Date(payment.paidAtIso)
    const category: PaymentCategory = payment.category === 'RENT' ? 'Rent' : payment.category === 'SECURITY DEPOSIT' ? 'Security Deposit' : payment.category === 'MAINTENANCE' ? 'Maintenance' : 'Platform Service'
    return {
      id: payment.id,
      from: payment.flow === 'owner_outgoing' ? payment.counterparty : payment.tenantName ?? payment.counterparty,
      property: payment.propertyName ?? payment.description ?? 'Rentilo platform',
      category,
      amount: payment.amount,
      txnId: payment.txnId,
      refId: payment.refId,
      via: (['UPI', 'Bank Transfer', 'Credit Card', 'Cash'].includes(payment.method) ? payment.method : 'UPI') as PaymentMethod,
      status: payment.status === 'Successful' ? 'Received' : payment.status,
      date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    }
  }), [ownerId, storePayments])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'All Status'>('All Status')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return ownerPayments.filter((payment) => {
      const matchesSearch =
        !query ||
        payment.from.toLowerCase().includes(query) ||
        payment.property.toLowerCase().includes(query) ||
        payment.txnId.toLowerCase().includes(query) ||
        payment.refId.toLowerCase().includes(query)
      const matchesStatus = statusFilter === 'All Status' || payment.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [ownerPayments, search, statusFilter])

  const summary = useMemo(
    () => ({
      received: ownerPayments.filter((payment) => payment.status === 'Received').reduce((total, payment) => total + payment.amount, 0),
      pending: ownerPayments.filter((payment) => payment.status === 'Pending').reduce((total, payment) => total + payment.amount, 0),
      failed: ownerPayments.filter((payment) => payment.status === 'Failed').length,
    }),
    [ownerPayments]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <div className="min-h-screen bg-canvas-alt px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-heading-1 font-bold tracking-tight text-text-primary">Payments</h1>
            <p className="mt-2 text-body text-text-muted">Track owner payouts, rent receipts, deposits, and payment records.</p>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex w-fit items-center gap-2 rounded-button bg-navy px-5 py-3 text-body font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
          >
            <Plus size={17} />
            Record Payment
          </button>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-card border border-outline bg-white p-5 shadow-sm">
            <p className="text-label font-bold uppercase tracking-widest text-text-muted">Received</p>
            <p className="mt-2 text-heading-2 font-black text-text-primary">${summary.received.toLocaleString('en-US')}</p>
          </div>
          <div className="rounded-card border border-outline bg-white p-5 shadow-sm">
            <p className="text-label font-bold uppercase tracking-widest text-text-muted">Pending</p>
            <p className="mt-2 text-heading-2 font-black text-text-primary">${summary.pending.toLocaleString('en-US')}</p>
          </div>
          <div className="rounded-card border border-outline bg-white p-5 shadow-sm">
            <p className="text-label font-bold uppercase tracking-widest text-text-muted">Failed</p>
            <p className="mt-2 text-heading-2 font-black text-text-primary">{summary.failed}</p>
          </div>
        </section>

        <section className="flex flex-col gap-3 sm:flex-row">
          <label className="relative min-w-0 flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              placeholder="Search by tenant, property, transaction ID..."
              className="h-12 w-full rounded-input border border-outline bg-white pl-11 pr-4 text-body text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary-100"
            />
          </label>
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as PaymentStatus | 'All Status')
              setPage(1)
            }}
            className="h-12 rounded-input border border-outline bg-white px-4 text-body font-semibold text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary-100"
          >
            <option>All Status</option>
            <option>Received</option>
            <option>Pending</option>
            <option>Failed</option>
          </select>
        </section>

        <section className="overflow-hidden rounded-card border border-outline bg-white shadow-sm">
          {paginated.length > 0 ? (
            paginated.map((payment) => <PaymentRow key={payment.id} payment={payment} />)
          ) : (
            <div className="py-16 text-center">
              <ReceiptText size={44} className="mx-auto text-text-muted" />
              <p className="mt-3 text-body font-bold text-text-primary">No payments found</p>
              <p className="mt-1 text-label text-text-muted">Try another search or status filter.</p>
            </div>
          )}
        </section>

        {totalPages > 1 && (
          <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-2 rounded-button px-4 py-2 text-body font-semibold text-text-primary transition-colors hover:bg-hover-light disabled:cursor-not-allowed disabled:text-text-muted"
            >
              <ArrowLeft size={16} />
              Previous
            </button>
            <div className="flex items-center justify-center gap-1">
              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={cn(
                    'h-9 w-9 rounded-button text-body font-bold transition-colors',
                    currentPage === pageNumber ? 'bg-navy text-white' : 'text-text-muted hover:bg-hover-light'
                  )}
                >
                  {pageNumber}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-2 rounded-button px-4 py-2 text-body font-semibold text-text-primary transition-colors hover:bg-hover-light disabled:cursor-not-allowed disabled:text-text-muted"
            >
              Next
              <ArrowRight size={16} />
            </button>
          </section>
        )}
      </div>

      {modalOpen && (
        <RecordPaymentModal
          onClose={() => setModalOpen(false)}
          onSuccess={(input) => {
            addTenantPayment({
              tenantId: `manual-${Date.now()}`,
              tenantName: input.tenant,
              ownerId,
              ownerName: user ? `${user.firstName} ${user.lastName}` : 'Owner',
              to: user ? `${user.firstName} ${user.lastName}` : 'Owner',
              category: input.category === 'Rent' ? 'RENT' : input.category === 'Security Deposit' ? 'SECURITY DEPOSIT' : input.category === 'Maintenance' ? 'MAINTENANCE' : 'OTHER',
              amount: input.amount,
              method: input.method,
            })
            setToastVisible(true)
            window.setTimeout(() => setToastVisible(false), 3500)
          }}        />
      )}

      {toastVisible && (
        <div className="fixed bottom-6 right-6 z-[9999] flex w-[360px] max-w-[calc(100vw-32px)] items-start gap-3 overflow-hidden rounded-card border border-outline bg-white p-4 shadow-modal">
          <CheckCircle2 size={22} className="shrink-0 text-status-success" />
          <div className="min-w-0 flex-1">
            <p className="text-body font-bold text-text-primary">Payment recorded</p>
            <p className="mt-1 text-label text-text-muted">The payment entry has been saved.</p>
          </div>
          <button type="button" onClick={() => setToastVisible(false)} className="rounded-button p-1 text-text-muted hover:bg-hover-light" aria-label="Dismiss">
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
