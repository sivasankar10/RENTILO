import { useState, useMemo } from 'react'
import { cn } from '@shared/utils/cn'
import { MaterialIcon } from '../components/MaterialIcon'
import { tenantStyles } from '../utils/tenantStyles'

// ─── Types ────────────────────────────────────────────────────────────────────

type PaymentStatus = 'Successful' | 'Failed' | 'Pending'
type PaymentCategory = 'RENT' | 'SECURITY DEPOSIT' | 'UTILITY BILL' | 'MAINTENANCE'
type PaymentMethod = 'UPI' | 'Net Banking' | 'Credit Card' | 'Debit Card'

interface Payment {
  id: string
  to: string
  category: PaymentCategory
  amount: number
  txnId: string
  refId: string
  via: PaymentMethod
  status: PaymentStatus
  date: string
  time: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ALL_PAYMENTS: Payment[] = [
  { id: '1', to: 'Civic Realty Group',      category: 'RENT',             amount: 45000,  txnId: 'RT-9928341', refId: '0021-X99', via: 'UPI',          status: 'Successful', date: '12 Apr 2026', time: '4:30 PM' },
  { id: '2', to: 'Green Valley Estates',    category: 'SECURITY DEPOSIT', amount: 120000, txnId: 'RT-8821034', refId: '0021-Z02', via: 'Net Banking',   status: 'Failed',     date: '08 Apr 2026', time: '11:15 AM' },
  { id: '3', to: 'Urban Lofts Management',  category: 'UTILITY BILL',     amount: 3450,   txnId: 'RT-7761022', refId: '0021-A12', via: 'Credit Card',   status: 'Pending',    date: '14 Apr 2026', time: '9:00 AM' },
  { id: '4', to: 'Civic Realty Group',      category: 'RENT',             amount: 45000,  txnId: 'RT-6652011', refId: '0021-X98', via: 'UPI',          status: 'Successful', date: '12 Mar 2026', time: '4:15 PM' },
  { id: '5', to: 'Skyline Properties',      category: 'MAINTENANCE',      amount: 8200,   txnId: 'RT-5541009', refId: '0021-M03', via: 'Debit Card',   status: 'Successful', date: '02 Mar 2026', time: '2:00 PM' },
  { id: '6', to: 'Green Valley Estates',    category: 'RENT',             amount: 45000,  txnId: 'RT-4430998', refId: '0021-X97', via: 'UPI',          status: 'Successful', date: '12 Feb 2026', time: '4:45 PM' },
  { id: '7', to: 'Urban Lofts Management',  category: 'UTILITY BILL',     amount: 2900,   txnId: 'RT-3320887', refId: '0021-A11', via: 'Credit Card',  status: 'Failed',     date: '05 Feb 2026', time: '10:30 AM' },
  { id: '8', to: 'Civic Realty Group',      category: 'RENT',             amount: 45000,  txnId: 'RT-2210776', refId: '0021-X96', via: 'UPI',          status: 'Successful', date: '12 Jan 2026', time: '4:20 PM' },
]

const PAGE_SIZE = 4

// ─── Status Badge ─────────────────────────────────────────────────────────────

const statusConfig: Record<PaymentStatus, { icon: string; dot: string; text: string; bg: string }> = {
  Successful: { icon: 'check_circle', dot: 'bg-green-500',  text: 'text-green-700',  bg: 'bg-green-50' },
  Failed:     { icon: 'cancel',       dot: 'bg-red-500',    text: 'text-red-700',    bg: 'bg-red-50'   },
  Pending:    { icon: 'pending',      dot: 'bg-amber-500',  text: 'text-amber-700',  bg: 'bg-amber-50' },
}

function StatusBadge({ status }: { status: PaymentStatus }) {
  const c = statusConfig[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-bold', c.bg, c.text)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', c.dot)} />
      {status}
    </span>
  )
}

// ─── Category Badge ───────────────────────────────────────────────────────────

const categoryColors: Record<PaymentCategory, string> = {
  'RENT':             'bg-blue-50 text-blue-700',
  'SECURITY DEPOSIT': 'bg-purple-50 text-purple-700',
  'UTILITY BILL':     'bg-teal-50 text-teal-700',
  'MAINTENANCE':      'bg-orange-50 text-orange-700',
}

function CategoryBadge({ category }: { category: PaymentCategory }) {
  return (
    <span className={cn('inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide', categoryColors[category])}>
      {category}
    </span>
  )
}

// ─── Payment Row ──────────────────────────────────────────────────────────────

function PaymentRow({ payment }: { payment: Payment }) {
  const canDownload = payment.status === 'Successful' || payment.status === 'Pending'
  return (
    <div className="px-6 py-5 border-b border-[#f1f5f9] last:border-0 hover:bg-[#fafbfc] transition-colors">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        {/* Left */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[14px] font-semibold text-[#0F172A]">To: {payment.to}</span>
            <CategoryBadge category={payment.category} />
          </div>
          <div className="font-display text-[26px] font-extrabold text-[#0F172A] leading-none mb-2">
            ₹{payment.amount.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-3 flex-wrap text-[12px] text-[#64748b] font-medium">
            <span>TXN ID: <span className="text-[#0F172A] font-semibold">{payment.txnId}</span></span>
            <span className="text-[#cbd5e1]">•</span>
            <span>REF ID: <span className="text-[#0F172A] font-semibold">{payment.refId}</span></span>
            <span className="text-[#cbd5e1]">•</span>
            <span>VIA: <span className="text-[#0F172A] font-semibold">{payment.via}</span></span>
          </div>
        </div>
        {/* Right */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <StatusBadge status={payment.status} />
          <span className="text-[12px] text-[#64748b]">{payment.date}, {payment.time}</span>
          {canDownload ? (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#0F172A] hover:text-[#2563eb] border-0 bg-transparent cursor-pointer transition-colors p-0"
            >
              <MaterialIcon name="download" className="!text-[16px]" />
              Download Invoice
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#94a3b8]">
              <MaterialIcon name="schedule" className="!text-[16px]" />
              Unavailable
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Make Payment Modal ───────────────────────────────────────────────────────

const PAYMENT_CATEGORIES: PaymentCategory[] = ['RENT', 'SECURITY DEPOSIT', 'UTILITY BILL', 'MAINTENANCE']
const PAYMENT_METHODS: PaymentMethod[] = ['UPI', 'Net Banking', 'Credit Card', 'Debit Card']

function MakePaymentModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<PaymentCategory>('RENT')
  const [method, setMethod] = useState<PaymentMethod>('UPI')
  const [upiId, setUpiId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const inputCls = (field: string) => cn(
    'w-full px-4 py-3 rounded-xl border-2 outline-none font-body text-[14px] text-[#0F172A] bg-[#f8fafc]',
    'transition-all duration-150 placeholder:text-[#cbd5e1]',
    errors[field] ? 'border-red-400 bg-red-50' : 'border-[#e2e8f0] focus:border-[#0F172A] focus:bg-white'
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!to.trim()) errs.to = 'Recipient is required.'
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) errs.amount = 'Enter a valid amount.'
    if (method === 'UPI' && !upiId.trim()) errs.upiId = 'UPI ID is required.'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1200))
    setSubmitting(false)
    onSuccess()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-md" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-[460px] bg-white rounded-2xl shadow-[0_24px_48px_-8px_rgba(0,0,0,0.18)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-[#f1f5f9]">
          <div>
            <h2 className="font-display text-[20px] font-extrabold text-[#0F172A]">Make a New Payment</h2>
            <p className="text-[13px] text-[#64748b] mt-0.5">Fill in the details to initiate a payment.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#94a3b8] hover:text-[#0F172A] hover:bg-[#f1f5f9] border-0 bg-transparent cursor-pointer transition-colors">
            <MaterialIcon name="close" className="!text-[20px]" />
          </button>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="px-7 py-6 flex flex-col gap-4">
          <div>
            <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-1.5">Pay To</label>
            <input type="text" placeholder="e.g. Civic Realty Group" value={to} onChange={(e) => setTo(e.target.value)} className={inputCls('to')} />
            {errors.to && <p className="mt-1 text-[12px] text-red-500">{errors.to}</p>}
          </div>
          <div>
            <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-1.5">Amount (₹)</label>
            <input type="number" placeholder="0" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputCls('amount')} />
            {errors.amount && <p className="mt-1 text-[12px] text-red-500">{errors.amount}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-1.5">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as PaymentCategory)}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#e2e8f0] outline-none font-body text-[14px] text-[#0F172A] bg-[#f8fafc] focus:border-[#0F172A] cursor-pointer">
                {PAYMENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-1.5">Payment Via</label>
              <select value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#e2e8f0] outline-none font-body text-[14px] text-[#0F172A] bg-[#f8fafc] focus:border-[#0F172A] cursor-pointer">
                {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          {method === 'UPI' && (
            <div>
              <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-1.5">UPI ID</label>
              <input type="text" placeholder="e.g. name@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} className={inputCls('upiId')} />
              {errors.upiId && <p className="mt-1 text-[12px] text-red-500">{errors.upiId}</p>}
            </div>
          )}
          <button type="submit" disabled={submitting}
            className={cn('w-full py-3.5 rounded-xl font-display text-[15px] font-bold text-white border-0 transition-all duration-150 mt-1',
              submitting ? 'bg-[#94a3b8] cursor-not-allowed' : 'bg-[#0F172A] hover:bg-[#1e293b] cursor-pointer')}>
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Processing…
              </span>
            ) : 'Send Payment'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function TenantPayments() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'All Status'>('All Status')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  const filtered = useMemo(() => {
    return ALL_PAYMENTS.filter((p) => {
      const matchSearch =
        !search ||
        p.txnId.toLowerCase().includes(search.toLowerCase()) ||
        p.to.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'All Status' || p.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [search, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value)
    setPage(1)
  }

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setStatusFilter(e.target.value as PaymentStatus | 'All Status')
    setPage(1)
  }

  // Build page numbers: 1, 2, 3, ..., last
  const pageNumbers: (number | '...')[] = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (currentPage <= 3) return [1, 2, 3, '...', totalPages]
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 2, totalPages - 1, totalPages]
    return [1, '...', currentPage, '...', totalPages]
  }, [totalPages, currentPage])

  return (
    <div className="space-y-0">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="font-display text-[28px] font-extrabold text-[#0F172A] leading-tight">
            Payment History
          </h1>
          <p className="text-[14px] text-[#64748b] mt-1">
            Track all your transactions and rental payments
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0F172A] text-white font-display text-[14px] font-bold border-0 cursor-pointer hover:bg-[#1e293b] transition-colors shrink-0"
        >
          <MaterialIcon name="add" className="!text-[18px]" />
          Make a New Payment
        </button>
      </div>

      {/* Search + Filter bar */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <MaterialIcon name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 !text-[18px] text-[#94a3b8] pointer-events-none" />
          <input
            type="text"
            placeholder="Search by Transaction ID or Sender..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e2e8f0] bg-white outline-none font-body text-[14px] text-[#0F172A] placeholder:text-[#94a3b8] focus:border-[#0F172A] transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={handleStatusChange}
          className="px-4 py-3 rounded-xl border border-[#e2e8f0] bg-white outline-none font-body text-[14px] text-[#0F172A] cursor-pointer focus:border-[#0F172A] min-w-[140px]"
        >
          <option value="All Status">All Status</option>
          <option value="Successful">Successful</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      {/* Transactions card */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] overflow-hidden mb-6">
        {paginated.length > 0 ? (
          paginated.map((p) => <PaymentRow key={p.id} payment={p} />)
        ) : (
          <div className="py-16 text-center">
            <MaterialIcon name="receipt_long" className="!text-[48px] text-[#cbd5e1] mb-3" />
            <p className="text-[15px] font-semibold text-[#64748b]">No transactions found</p>
            <p className="text-[13px] text-[#94a3b8] mt-1">Try adjusting your search or filter.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={cn(
              'inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-body text-[14px] font-semibold border-0 transition-colors',
              currentPage === 1
                ? 'text-[#cbd5e1] cursor-not-allowed bg-transparent'
                : 'text-[#0F172A] cursor-pointer hover:bg-[#f1f5f9] bg-transparent'
            )}
          >
            <MaterialIcon name="arrow_back" className="!text-[16px]" />
            Previous
          </button>

          <div className="flex items-center gap-1">
            {pageNumbers.map((n, i) =>
              n === '...' ? (
                <span key={`ellipsis-${i}`} className="px-2 text-[#94a3b8] text-[14px]">…</span>
              ) : (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n as number)}
                  className={cn(
                    'w-9 h-9 rounded-lg font-body text-[14px] font-semibold border-0 cursor-pointer transition-colors',
                    currentPage === n
                      ? 'bg-[#0F172A] text-white'
                      : 'bg-transparent text-[#64748b] hover:bg-[#f1f5f9]'
                  )}
                >
                  {n}
                </button>
              )
            )}
          </div>

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={cn(
              'inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-body text-[14px] font-semibold border-0 transition-colors',
              currentPage === totalPages
                ? 'text-[#cbd5e1] cursor-not-allowed bg-transparent'
                : 'text-[#0F172A] cursor-pointer hover:bg-[#f1f5f9] bg-transparent'
            )}
          >
            Next
            <MaterialIcon name="arrow_forward" className="!text-[16px]" />
          </button>
        </div>
      )}

      {/* Footer note */}
      <p className="text-center text-[11px] font-semibold tracking-wider text-[#94a3b8] uppercase pb-2">
        Property ID: RTL-882-DAN • Lease Active Until Oct 2024
      </p>

      {/* Make Payment Modal */}
      {showModal && (
        <MakePaymentModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowSuccessToast(true)
            setTimeout(() => setShowSuccessToast(false), 4000)
          }}
        />
      )}

      {/* Success toast */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-[9999] flex items-start gap-3.5 w-[360px] max-w-[calc(100vw-32px)] bg-white rounded-xl shadow-[0_8px_24px_-4px_rgba(0,0,0,0.12)] border border-[#e2e8f0] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-green-500" />
          <div className="flex items-start gap-3 pl-5 pr-4 py-4 w-full">
            <span className="material-symbols-outlined text-[22px] text-green-500 mt-0.5" aria-hidden="true">check_circle</span>
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-[#0F172A]">Payment initiated!</p>
              <p className="text-[13px] text-[#64748b] mt-0.5">Your payment is being processed.</p>
            </div>
            <button type="button" onClick={() => setShowSuccessToast(false)}
              className="w-6 h-6 flex items-center justify-center rounded-md text-[#94a3b8] hover:text-[#0F172A] hover:bg-[#f1f5f9] border-0 bg-transparent cursor-pointer mt-0.5 transition-colors">
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
