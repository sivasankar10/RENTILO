import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2, Clock3, FileSignature, Printer, Send } from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { cn } from '@shared/utils/cn'
import { useOnboardingStore, tenantCanViewAgreement } from '@shared/store/onboardingStore'

const MIN_CHANGE_COMMENT = 10
const MAX_CHANGE_COMMENT = 500

export function TenantAgreementReview() {
  const { onboardingId } = useParams<{ onboardingId: string }>()
  const navigate = useNavigate()
  const record = useOnboardingStore((state) => state.records.find((item) => item.id === onboardingId))
  const approveAgreement = useOnboardingStore((state) => state.approveAgreement)
  const requestChanges = useOnboardingStore((state) => state.requestAgreementChanges)
  const [signature, setSignature] = useState(record?.tenant.name ?? '')
  const [comment, setComment] = useState('')
  const [signatureError, setSignatureError] = useState('')
  const [commentError, setCommentError] = useState('')
  const [submitting, setSubmitting] = useState<'approve' | 'changes' | null>(null)
  const latest = record?.agreementVersions[record.agreementVersions.length - 1]

  const validateSignature = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return 'Typed signature is required to approve the agreement.'
    if (trimmed.length < 2) return 'Signature must be at least 2 characters.'
    return ''
  }

  const validateComment = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return 'Please explain which term needs to be revised.'
    if (trimmed.length < MIN_CHANGE_COMMENT) {
      return `Please provide at least ${MIN_CHANGE_COMMENT} characters so the owner can understand your request.`
    }
    if (trimmed.length > MAX_CHANGE_COMMENT) {
      return `Keep your request under ${MAX_CHANGE_COMMENT} characters.`
    }
    return ''
  }

  const handleApprove = async () => {
    if (!record) return
    const error = validateSignature(signature)
    setSignatureError(error)
    if (error) return

    setSubmitting('approve')
    await new Promise((resolve) => window.setTimeout(resolve, 400))
    approveAgreement(record.id, signature.trim())
    setSubmitting(null)
  }

  const handleRequestChanges = async () => {
    if (!record) return
    const error = validateComment(comment)
    setCommentError(error)
    if (error) return

    setSubmitting('changes')
    await new Promise((resolve) => window.setTimeout(resolve, 400))
    requestChanges(record.id, comment.trim())
    setSubmitting(null)
    navigate(ROUTES.TENANT.PROPERTY(record.tenantPropertyId))
  }

  if (!record || !tenantCanViewAgreement(record) || !latest) {
    return (
      <div className="rounded-card border border-outline bg-white p-10 text-center shadow-surface">
        <FileSignature size={42} className="mx-auto text-text-muted" />
        <h1 className="mt-4 text-heading-2 font-bold text-navy">Agreement not available</h1>
        <p className="mt-2 text-body text-text-muted">
          {record?.status === 'agreement_requested' || record?.status === 'changes_requested'
            ? 'The owner has not sent a rental agreement yet. You will be notified when it is ready to review.'
            : 'Request a lease agreement from the property page and wait for the owner to send it.'}
        </p>
        <button onClick={() => navigate(ROUTES.TENANT.LISTINGS)} className="mt-5 rounded-button bg-navy px-5 py-3 text-white">
          Back to Listings
        </button>
      </div>
    )
  }

  const approved = ['agreement_approved', 'payment_completed', 'active'].includes(record.status)
  const changesPending = record.status === 'changes_requested'
  const canRequestChanges = record.status === 'agreement_sent'
  const commentLength = comment.length
  const commentOverLimit = commentLength > MAX_CHANGE_COMMENT

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-end gap-3">
        <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-button border border-outline bg-white px-4 py-2 text-body font-semibold text-navy">
          <Printer size={16} /> Print / Save PDF
        </button>
      </div>

      <section className="overflow-hidden rounded-card border border-outline bg-white shadow-surface">
        <header className="bg-navy px-7 py-6 text-white">
          <p className="text-filter-label font-bold uppercase tracking-[0.2em] text-white/60">Rental Agreement</p>
          <h1 className="mt-2 text-heading-1 font-extrabold">{record.propertyName}</h1>
          <p className="mt-2 text-body text-white/70">Version {latest.version} - Sent {latest.sentAt}</p>
        </header>

        <div className="grid gap-5 p-7 md:grid-cols-2">
          <AgreementField label="Tenant" value={record.tenant.name} />
          <AgreementField label="Owner" value={record.owner.name} />
          <AgreementField label="Property" value={`${record.propertyName}, ${record.unit}`} />
          <AgreementField label="Address" value={record.address} />
          <AgreementField label="Lease Term" value={`${latest.startDate} to ${latest.endDate}`} />
          <AgreementField label="Monthly Rent" value={latest.monthlyRent} />
          <AgreementField label="Security Deposit" value={latest.securityDeposit} />
          <AgreementField label="Notice Period" value={latest.noticePeriod} />
          <AgreementField label="Utilities" value={latest.utilities} />
          <AgreementField label="Maintenance" value={latest.maintenanceResponsibility} />
          <AgreementField label="Pet Policy" value={latest.petPolicy} />
          <AgreementField label="Owner Signature" value={latest.ownerSignature} />
          <div className="md:col-span-2 rounded-button bg-canvas-alt p-4">
            <p className="text-filter-label font-bold uppercase tracking-wider text-text-muted">Special Clauses</p>
            <p className="mt-2 text-body leading-relaxed text-text-primary">{latest.specialClauses}</p>
          </div>
        </div>
      </section>

      {approved ? (
        <section className="rounded-card border border-status-success/30 bg-status-success-bg p-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="text-status-success" />
            <div>
              <h2 className="text-heading-3 font-bold text-status-success-text">Agreement approved</h2>
              <p className="mt-1 text-body text-text-muted">Signed by {latest.tenantSignature} on {latest.tenantApprovedAt}.</p>
              {record.status === 'agreement_approved' && (
                <button onClick={() => navigate(ROUTES.TENANT.ONBOARDING_PAYMENT(record.id))} className="mt-4 rounded-button bg-navy px-5 py-3 text-body font-bold text-white">
                  Complete Onboarding Payment
                </button>
              )}
            </div>
          </div>
        </section>
      ) : changesPending ? (
        <section className="rounded-card border border-status-warning/30 bg-status-warning-bg p-6">
          <div className="flex items-start gap-3">
            <Clock3 className="shrink-0 text-status-warning-text" />
            <div className="min-w-0">
              <h2 className="text-heading-3 font-bold text-status-warning-text">Change request sent</h2>
              <p className="mt-1 text-body text-text-muted">
                Your requested revisions are with the owner. You will be notified when a revised agreement is ready.
              </p>
              {latest.changeRequest && (
                <div className="mt-4 rounded-button border border-status-warning/20 bg-white p-4">
                  <p className="text-filter-label font-bold uppercase tracking-wider text-text-muted">Your request</p>
                  <p className="mt-2 text-body leading-relaxed text-text-primary">{latest.changeRequest}</p>
                </div>
              )}
              <button
                type="button"
                onClick={() => navigate(ROUTES.TENANT.PROPERTY(record.tenantPropertyId))}
                className="mt-5 rounded-button bg-navy px-5 py-3 text-body font-bold text-white"
              >
                Back to Application Progress
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="grid gap-6 rounded-card border border-outline bg-white p-6 shadow-surface lg:grid-cols-2">
          <div>
            <label htmlFor="agreement-signature" className="text-filter-label font-bold uppercase tracking-wider text-text-muted">
              Typed Signature
            </label>
            <input
              id="agreement-signature"
              value={signature}
              onChange={(event) => {
                setSignature(event.target.value)
                if (signatureError) setSignatureError(validateSignature(event.target.value))
              }}
              onBlur={() => setSignatureError(validateSignature(signature))}
              aria-invalid={Boolean(signatureError)}
              aria-describedby={signatureError ? 'agreement-signature-error' : undefined}
              className={cn(
                'mt-2 h-11 w-full rounded-input border px-4 outline-none focus:ring-2 focus:ring-primary-100',
                signatureError ? 'border-red-400 bg-red-50 focus:border-red-400' : 'border-outline focus:border-primary',
              )}
            />
            {signatureError && (
              <p id="agreement-signature-error" className="mt-2 text-label font-semibold text-red-600">
                {signatureError}
              </p>
            )}
            <button
              type="button"
              onClick={handleApprove}
              disabled={submitting !== null}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-button bg-navy px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCircle2 size={17} />
              {submitting === 'approve' ? 'Approving…' : 'Approve Agreement'}
            </button>
          </div>
          <div>
            <label htmlFor="agreement-change-request" className="text-filter-label font-bold uppercase tracking-wider text-text-muted">
              Request Changes
            </label>
            <textarea
              id="agreement-change-request"
              value={comment}
              onChange={(event) => {
                setComment(event.target.value)
                if (commentError) setCommentError(validateComment(event.target.value))
              }}
              onBlur={() => setCommentError(validateComment(comment))}
              rows={4}
              placeholder="Explain the term that needs revision — e.g. notice period, pet policy, or deposit amount..."
              aria-invalid={Boolean(commentError)}
              aria-describedby="agreement-change-request-help agreement-change-request-error"
              disabled={!canRequestChanges}
              className={cn(
                'mt-2 w-full resize-none rounded-input border px-4 py-3 outline-none focus:ring-2 focus:ring-primary-100',
                commentError || commentOverLimit
                  ? 'border-red-400 bg-red-50 focus:border-red-400'
                  : 'border-outline focus:border-primary',
                !canRequestChanges && 'cursor-not-allowed opacity-60',
              )}
            />
            <div className="mt-1 flex items-center justify-between gap-3">
              <p id="agreement-change-request-help" className="text-label text-text-muted">
                Minimum {MIN_CHANGE_COMMENT} characters required.
              </p>
              <span className={cn('text-label font-semibold', commentOverLimit ? 'text-red-600' : 'text-text-muted')}>
                {commentLength}/{MAX_CHANGE_COMMENT}
              </span>
            </div>
            {commentError && (
              <p id="agreement-change-request-error" className="mt-2 text-label font-semibold text-red-600">
                {commentError}
              </p>
            )}
            <button
              type="button"
              onClick={handleRequestChanges}
              disabled={submitting !== null || !canRequestChanges || commentOverLimit}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-button border border-outline px-5 py-3 font-bold text-navy disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={17} />
              {submitting === 'changes' ? 'Sending…' : 'Send Change Request'}
            </button>
          </div>
        </section>
      )}
    </div>
  )
}

function AgreementField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-button bg-canvas-alt p-4">
      <p className="text-filter-label font-bold uppercase tracking-wider text-text-muted">{label}</p>
      <p className="mt-1 text-body font-bold text-text-primary">{value}</p>
    </div>
  )
}
