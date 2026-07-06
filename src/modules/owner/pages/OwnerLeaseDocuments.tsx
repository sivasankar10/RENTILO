import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Download, FileSignature, Printer, ReceiptText } from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { useOnboardingStore } from '@shared/store/onboardingStore'
import { DEMO_OWNER } from '@shared/store/onboardingStore'
import { useAuth } from '@shared/hooks/useAuth'
import { printPaymentReceipt } from '@shared/utils/downloadReceipt'
import { usePaymentsStore } from '@shared/store/paymentsStore'

export function OwnerLeaseDocuments() {
  const { onboardingId } = useParams<{ onboardingId: string }>()
  const { user } = useAuth()
  const ownerId = user?.id ?? DEMO_OWNER.id
  const navigate = useNavigate()
  const record = useOnboardingStore((state) =>
    state.records.find((item) => item.id === onboardingId && item.owner.id === ownerId),
  )
  const payments = usePaymentsStore((state) =>
    state.payments.filter((payment) => payment.onboardingId === onboardingId),
  )
  const latest = record?.agreementVersions.at(-1)

  if (!record || !['active', 'payment_completed'].includes(record.status)) {
    return (
      <div className="rounded-card border border-outline bg-white p-10 text-center shadow-surface">
        <h1 className="text-heading-2 font-bold text-navy">Lease documents unavailable</h1>
        <button type="button" onClick={() => navigate(ROUTES.OWNER.LEASES)} className="mt-5 rounded-button bg-navy px-5 py-3 font-bold text-white">
          Back to Leases
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate(ROUTES.OWNER.LEASES)}
        className="inline-flex items-center gap-2 text-body font-semibold text-text-muted hover:text-navy"
      >
        <ArrowLeft size={16} />
        Back to Leases
      </button>

      <div>
        <p className="text-filter-label font-bold uppercase tracking-wider text-primary">Active Lease Documents</p>
        <h1 className="mt-2 text-heading-1 font-extrabold text-navy">{record.propertyName}</h1>
        <p className="mt-1 text-body text-text-muted">{record.tenant.name} - {record.unit} - Lease {record.lease?.id}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-card border border-outline bg-white p-6 shadow-surface">
          <div className="flex items-center gap-3">
            <FileSignature className="text-primary" />
            <h2 className="text-heading-3 font-bold text-navy">Signed Rental Agreement</h2>
          </div>
          {latest ? (
            <div className="mt-5 space-y-3 text-body">
              <p><span className="font-semibold text-text-muted">Signed on:</span> {latest.tenantApprovedAt ?? 'Pending signature'}</p>
              <p><span className="font-semibold text-text-muted">Lease term:</span> {latest.startDate} to {latest.endDate}</p>
              <p><span className="font-semibold text-text-muted">Monthly rent:</span> {latest.monthlyRent}</p>
              <p><span className="font-semibold text-text-muted">Security deposit:</span> {latest.securityDeposit}</p>
              <p><span className="font-semibold text-text-muted">Tenant signature:</span> {latest.tenantSignature ?? record.tenant.name}</p>
            </div>
          ) : (
            <p className="mt-5 text-body text-text-muted">No agreement document on file.</p>
          )}
          <div className="mt-6 flex gap-3">
            <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-button border border-outline px-4 py-2.5 text-body font-bold text-navy">
              <Printer size={16} /> Print
            </button>
          </div>
        </article>

        <article className="rounded-card border border-outline bg-white p-6 shadow-surface">
          <div className="flex items-center gap-3">
            <ReceiptText className="text-primary" />
            <h2 className="text-heading-3 font-bold text-navy">Onboarding Payment</h2>
          </div>
          {record.payment ? (
            <div className="mt-5 space-y-3 text-body">
              <p><span className="font-semibold text-text-muted">Transaction:</span> {record.payment.transactionId}</p>
              <p><span className="font-semibold text-text-muted">Amount:</span> {record.payment.amount}</p>
              <p><span className="font-semibold text-text-muted">Method:</span> {record.payment.method}</p>
              <p><span className="font-semibold text-text-muted">Paid on:</span> {record.payment.paidAt}</p>
            </div>
          ) : (
            <p className="mt-5 text-body text-text-muted">Payment record not found.</p>
          )}
          {payments[0] && (
            <button
              type="button"
              onClick={() => printPaymentReceipt(payments[0]!, 'Owner Lease Payment Receipt')}
              className="mt-6 inline-flex items-center gap-2 rounded-button bg-navy px-4 py-2.5 text-body font-bold text-white"
            >
              <Download size={16} /> Export Receipt
            </button>
          )}
        </article>
      </div>
    </div>
  )
}
