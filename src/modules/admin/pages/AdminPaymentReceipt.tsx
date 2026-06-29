import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  FileText,
  Printer,
  ReceiptText,
  RotateCcw,
  UserRound,
} from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { cn } from '@shared/utils/cn'
import { useAdminStore, type AdminTransaction, type TransactionStatus } from '../store/adminStore'
import { toast } from '../components/Toast'

const statusStyles: Record<TransactionStatus, string> = {
  Success: 'bg-status-success-bg text-status-success-text',
  Pending: 'bg-amber-50 text-amber-700',
  Failed: 'bg-status-error-bg text-status-error-text',
  Refunded: 'bg-slate-100 text-slate-600',
}

function normalizeTransactionId(id: string | undefined) {
  return decodeURIComponent(id ?? '').replace(/^#/, '')
}

function findTransaction(transactions: AdminTransaction[], routeId: string | undefined) {
  const normalized = normalizeTransactionId(routeId)
  return (
    transactions.find((transaction) => transaction.id.replace(/^#/, '') === normalized) ??
    transactions.find((transaction) => transaction.id === routeId)
  )
}

function getReceiptMeta(transaction: AdminTransaction) {
  const cleanId = transaction.id.replace(/^#/, '')
  const method =
    transaction.type === 'Rent'
      ? 'UPI AutoPay'
      : transaction.type === 'Commission'
        ? 'Bank Transfer'
        : 'Credit Card'

  const taxableAmount = Number(transaction.amount.replace(/[^0-9.]/g, '')) || 0
  const platformFee = transaction.type === 'Subscription' ? 99 : Math.round(taxableAmount * 0.01)
  const tax = Math.round(platformFee * 0.18)

  return {
    receiptNo: `RCT-${cleanId}`,
    paymentMethod: method,
    referenceNo: `PAY-${cleanId.slice(-5)}-${transaction.userInitials}`,
    platformFee,
    tax,
    netAmount: Math.max(taxableAmount - platformFee - tax, 0),
  }
}

export function AdminPaymentReceipt() {
  const { transactionId } = useParams<{ transactionId: string }>()
  const navigate = useNavigate()
  const transactions = useAdminStore((state) => state.transactions)
  const transaction = useMemo(
    () => findTransaction(transactions, transactionId),
    [transactionId, transactions]
  )

  if (!transaction) {
    return (
      <div className="min-h-screen bg-canvas-alt px-2 py-8 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-card border border-outline bg-white p-8 text-center shadow-surface">
          <ReceiptText size={42} className="mx-auto text-text-muted" />
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

  const receipt = getReceiptMeta(transaction)

  const handleDownload = () => {
    toast.success('Receipt ready', `${receipt.receiptNo} is ready to download.`)
  }

  return (
    <div className="min-h-screen bg-canvas-alt px-2 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => navigate(ROUTES.ADMIN.FINANCE_PAYMENTS)}
            className="inline-flex w-fit items-center gap-2 rounded-button border border-outline bg-white px-4 py-2.5 text-body font-semibold text-text-primary hover:bg-hover-light"
          >
            <ArrowLeft size={16} />
            Back to Finance
          </button>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-button border border-outline bg-white px-4 py-2.5 text-body font-semibold text-text-primary hover:bg-hover-light"
            >
              <Printer size={16} />
              Print
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-button bg-navy px-4 py-2.5 text-body font-semibold text-white hover:bg-slate-800"
            >
              <Download size={16} />
              Download
            </button>
          </div>
        </div>

        <section className="overflow-hidden rounded-card border border-outline bg-white shadow-surface">
          <div className="border-b border-outline bg-navy px-6 py-6 text-white">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-label font-bold uppercase tracking-[0.24em] text-white/60">RENTILO Admin</p>
                <h1 className="mt-2 text-[34px] font-extrabold leading-none">Payment Receipt</h1>
                <p className="mt-2 text-body text-white/70">
                  Official transaction receipt for finance and audit records.
                </p>
              </div>
              <div className="rounded-card border border-white/15 bg-white/10 px-5 py-4 text-left sm:text-right">
                <p className="text-label uppercase tracking-widest text-white/60">Receipt No</p>
                <p className="mt-1 text-heading-3 font-bold">{receipt.receiptNo}</p>
                <span className={cn('mt-3 inline-flex rounded-pill px-3 py-1 text-badge font-bold', statusStyles[transaction.status])}>
                  {transaction.status}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-6 lg:grid-cols-[1.15fr_0.85fr]">
            <main className="space-y-5">
              <div className="rounded-card border border-outline p-5">
                <div className="flex items-center gap-2">
                  <UserRound size={18} className="text-primary" />
                  <h2 className="text-heading-3 font-bold text-text-primary">Paid By</h2>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className={cn('flex h-12 w-12 items-center justify-center rounded-full text-body font-bold text-white', transaction.avatarColor)}>
                    {transaction.userInitials}
                  </div>
                  <div>
                    <p className="text-body-lg font-bold text-text-primary">{transaction.user}</p>
                    <p className="text-label text-text-muted">
                      {transaction.type} transaction - {transaction.id}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-card border border-outline p-5">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-primary" />
                  <h2 className="text-heading-3 font-bold text-text-primary">Transaction Details</h2>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <DetailTile label="Transaction ID" value={transaction.id} />
                  <DetailTile label="Payment Date" value={transaction.date} />
                  <DetailTile label="Payment Method" value={receipt.paymentMethod} />
                  <DetailTile label="Reference No" value={receipt.referenceNo} />
                  <DetailTile label="Transaction Type" value={transaction.type} />
                  <DetailTile label="Processed By" value="RENTILO Admin Finance" />
                </div>
              </div>

              <div className="rounded-card border border-outline p-5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-status-success" />
                  <h2 className="text-heading-3 font-bold text-text-primary">Audit Notes</h2>
                </div>
                <p className="mt-3 text-body leading-relaxed text-text-muted">
                  This receipt is generated from RENTILO admin transaction records. Refund and retry actions
                  remain available from the Finance & Payments table based on the current transaction status.
                </p>
              </div>
            </main>

            <aside className="space-y-5">
              <div className="rounded-card border border-outline bg-canvas-alt p-5">
                <p className="text-label font-bold uppercase tracking-widest text-text-muted">Amount Summary</p>
                <div className="mt-5 space-y-3">
                  <AmountRow label="Gross Amount" value={transaction.amount} strong />
                  <AmountRow label="Platform Fee" value={`Rs. ${receipt.platformFee.toLocaleString('en-IN')}`} />
                  <AmountRow label="Tax / GST" value={`Rs. ${receipt.tax.toLocaleString('en-IN')}`} />
                  <div className="border-t border-outline pt-3">
                    <AmountRow label="Net Settled" value={`Rs. ${receipt.netAmount.toLocaleString('en-IN')}`} strong />
                  </div>
                </div>
              </div>

              <div className="rounded-card border border-outline p-5">
                <p className="text-label font-bold uppercase tracking-widest text-text-muted">Receipt Status</p>
                <div className="mt-4 flex items-start gap-3 rounded-button bg-primary-100 p-3">
                  <ReceiptText size={18} className="mt-0.5 text-primary" />
                  <div>
                    <p className="text-body font-bold text-primary">{transaction.status}</p>
                    <p className="mt-1 text-label text-text-muted">
                      Receipt available for transaction audits and user support.
                    </p>
                  </div>
                </div>
              </div>

              {transaction.status !== 'Success' && (
                <div className="rounded-card border border-amber-200 bg-amber-50 p-5">
                  <div className="flex items-start gap-3">
                    <RotateCcw size={18} className="mt-0.5 text-amber-700" />
                    <div>
                      <p className="text-body font-bold text-amber-800">Attention required</p>
                      <p className="mt-1 text-label leading-relaxed text-amber-700">
                        This receipt is linked to a {transaction.status.toLowerCase()} transaction. Confirm the
                        latest payment action before sharing externally.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </section>
      </div>
    </div>
  )
}

function DetailTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-button bg-canvas-alt px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{label}</p>
      <p className="mt-1 text-body font-bold text-text-primary">{value}</p>
    </div>
  )
}

function AmountRow({
  label,
  value,
  strong = false,
}: {
  label: string
  value: string
  strong?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={cn('text-body', strong ? 'font-bold text-text-primary' : 'text-text-muted')}>
        {label}
      </span>
      <span className={cn('text-body', strong ? 'font-extrabold text-text-primary' : 'font-semibold text-text-primary')}>
        {value}
      </span>
    </div>
  )
}
