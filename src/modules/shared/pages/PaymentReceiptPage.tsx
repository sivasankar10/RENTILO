import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Download, Printer } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { usePaymentsStore, type PlatformPayment } from '@shared/store/paymentsStore'
import { downloadPaymentReceipt, printPaymentReceipt } from '@shared/utils/downloadReceipt'

const statusStyles = {
  Successful: 'bg-green-50 text-green-700',
  Pending: 'bg-amber-50 text-amber-700',
  Failed: 'bg-red-50 text-red-700',
}

interface PaymentReceiptPageProps {
  backRoute: string
  backLabel: string
  audience: 'tenant' | 'owner'
}

export function PaymentReceiptPage({ backRoute, backLabel, audience }: PaymentReceiptPageProps) {
  const { paymentId } = useParams<{ paymentId: string }>()
  const navigate = useNavigate()
  const payments = usePaymentsStore((state) => state.payments)

  const payment = useMemo(
    () => payments.find((item) => item.id === paymentId),
    [payments, paymentId],
  )

  if (!payment) {
    return (
      <div className="rounded-card border border-outline bg-white p-10 text-center shadow-surface">
        <h1 className="text-heading-2 font-bold text-navy">Receipt not found</h1>
        <button
          type="button"
          onClick={() => navigate(backRoute)}
          className="mt-5 rounded-button bg-navy px-5 py-3 font-bold text-white"
        >
          {backLabel}
        </button>
      </div>
    )
  }

  const amountLabel =
    payment.amountDisplay.startsWith('$') || payment.amountDisplay.startsWith('₹')
      ? payment.amountDisplay
      : `₹${payment.amount.toLocaleString('en-IN')}`

  const title = audience === 'tenant' ? 'Tenant Payment Receipt' : 'Owner Payment Receipt'

  return (
    <div className="space-y-6" id="payment-receipt-print">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate(backRoute)}
          className="inline-flex items-center gap-2 rounded-button border border-outline bg-white px-4 py-2.5 text-body font-semibold text-text-primary"
        >
          <ArrowLeft size={16} />
          {backLabel}
        </button>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => printPaymentReceipt(payment, title)}
            className="inline-flex items-center gap-2 rounded-button border border-outline bg-white px-4 py-2.5 text-body font-semibold text-text-primary"
          >
            <Printer size={16} />
            Print
          </button>
          <button
            type="button"
            onClick={() => downloadPaymentReceipt(payment, title)}
            className="inline-flex items-center gap-2 rounded-button bg-navy px-4 py-2.5 text-body font-semibold text-white"
          >
            <Download size={16} />
            Save / Export
          </button>
        </div>
      </div>

      <ReceiptBody payment={payment} amountLabel={amountLabel} title={title} />
    </div>
  )
}

function ReceiptBody({
  payment,
  amountLabel,
  title,
}: {
  payment: PlatformPayment
  amountLabel: string
  title: string
}) {
  return (
    <div className="overflow-hidden rounded-card border border-outline bg-white shadow-surface">
      <div className="border-b border-white/10 bg-navy px-8 py-7 text-white">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/50">RENTILO · {title}</p>
        <h1 className="mt-2 text-[32px] font-extrabold leading-none">Payment Receipt</h1>
        <p className="mt-2 text-body text-white/70">{payment.paidAt}</p>
        <p className="mt-6 text-[42px] font-extrabold leading-none">{amountLabel}</p>
      </div>

      <div className="grid gap-4 p-8 md:grid-cols-2">
        <ReceiptField label="Status" value={payment.status} badge={statusStyles[payment.status]} />
        <ReceiptField label="Category" value={payment.category} />
        <ReceiptField label="Transaction ID" value={payment.txnId} mono />
        <ReceiptField label="Reference ID" value={payment.refId} mono />
        <ReceiptField label="Payment Method" value={payment.method} />
        <ReceiptField label="Counterparty" value={payment.counterparty} />
        {payment.propertyName && <ReceiptField label="Property" value={`${payment.propertyName}${payment.unit ? ` · ${payment.unit}` : ''}`} />}
        {payment.tenantName && <ReceiptField label="Tenant" value={payment.tenantName} />}
        {payment.description && <ReceiptField label="Description" value={payment.description} className="md:col-span-2" />}
      </div>
    </div>
  )
}

function ReceiptField({
  label,
  value,
  mono,
  badge,
  className,
}: {
  label: string
  value: string
  mono?: boolean
  badge?: string
  className?: string
}) {
  return (
    <div className={cn('rounded-button bg-canvas-alt px-4 py-3', className)}>
      <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{label}</p>
      {badge ? (
        <span className={cn('mt-2 inline-flex rounded-pill px-2.5 py-1 text-badge font-bold', badge)}>{value}</span>
      ) : (
        <p className={cn('mt-1 text-body font-bold text-text-primary break-all', mono && 'font-mono text-[13px]')}>{value}</p>
      )}
    </div>
  )
}
