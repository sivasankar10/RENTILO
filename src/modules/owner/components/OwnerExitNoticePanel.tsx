import { useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { useOnboardingStore, type OnboardingRecord } from '@shared/store/onboardingStore'
import { RefundPaymentModal } from './RefundPaymentModal'

interface OwnerExitNoticePanelProps {
  record: OnboardingRecord
  onClose: () => void
}

function moneyToNumber(value: string) {
  return Number(value.replace(/\D/g, '')) || 0
}
function formatRs(amount: number) {
  return `Rs. ${amount.toLocaleString('en-IN')}`
}

export function OwnerExitNoticePanel({ record, onClose }: OwnerExitNoticePanelProps) {
  const setEarlyExitPenalty = useOnboardingStore((state) => state.setEarlyExitPenalty)
  const settleExitRefund = useOnboardingStore((state) => state.settleExitRefund)

  const leaseId = record.lease?.id ?? ''
  const exitNotice = record.lease?.exitNotice

  const [penalty, setPenalty] = useState(String(record.monthlyRentAmount || ''))
  const [damage, setDamage] = useState('0')
  const [damageNotes, setDamageNotes] = useState('')
  const [showRefundGateway, setShowRefundGateway] = useState(false)
  const [error, setError] = useState('')

  if (!exitNotice) return null

  const deposit = exitNotice.securityDepositAmount
  const damageValue = Math.min(Math.max(0, moneyToNumber(damage)), deposit)
  const refundPreview = Math.max(0, deposit - damageValue)

  const handleSetPenalty = () => {
    const amount = moneyToNumber(penalty)
    if (penalty.trim() === '') { setError('Enter a penalty amount (use 0 to waive it).'); return }
    setError('')
    setEarlyExitPenalty(leaseId, amount)
  }

  const handleRefundConfirmed = (method: string, refId: string) => {
    settleExitRefund(leaseId, { damageAmount: damageValue, damageNotes: damageNotes.trim() || undefined, method, refId })
    setShowRefundGateway(false)
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-navy/55 p-4" role="dialog" aria-modal="true">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-card bg-white shadow-modal">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-outline bg-white p-6">
          <div>
            <p className="text-filter-label font-bold uppercase tracking-wider text-primary">Tenant exit</p>
            <h2 className="mt-1 text-heading-2 font-bold text-navy">{record.propertyName}</h2>
            <p className="mt-1 text-label text-text-muted">{record.tenant.name} - {record.unit}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-button border border-outline p-2"><X size={18} /></button>
        </div>

        <div className="space-y-5 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Info label="Exit type" value={exitNotice.type === 'immediate' ? 'Early exit (penalty)' : `${exitNotice.noticePeriodDays}-day notice`} />
            <Info label={exitNotice.type === 'immediate' ? 'Requested move-out' : 'Move-out date'} value={exitNotice.moveOutDate} />
            <Info label="Deposit refund due by" value={exitNotice.refundDueDate} />
            <Info label="Security deposit" value={exitNotice.securityDepositDisplay} />
          </div>

          {/* Step: set penalty (early exit) */}
          {exitNotice.status === 'penalty_pending' && (
            <div className="rounded-card border border-outline bg-canvas-alt p-5">
              <h3 className="text-heading-3 font-bold text-navy">Set the early-exit penalty</h3>
              <p className="mt-1 text-label text-text-muted">The tenant pays this to skip the {exitNotice.noticePeriodDays}-day notice period. One month's rent is {record.monthlyRent}. Enter <span className="font-bold">0</span> to waive the penalty and let the tenant leave without a charge.</p>
              <label className="mt-4 block">
                <span className="text-label font-bold text-text-primary">Penalty amount (Rs.)</span>
                <input value={penalty} onChange={(e) => { setPenalty(e.target.value); setError('') }} inputMode="numeric" placeholder="0"
                  className="mt-1.5 h-12 w-full rounded-input border border-outline px-4 outline-none focus:border-primary" />
              </label>
              <button onClick={handleSetPenalty} className="mt-4 rounded-button bg-navy px-5 py-3 font-bold text-white">
                {moneyToNumber(penalty) === 0 ? 'Waive Penalty (Rs. 0)' : `Set Penalty (${formatRs(moneyToNumber(penalty))})`}
              </button>
            </div>
          )}

          {exitNotice.status === 'penalty_payment' && (
            <StatusNote title={`Penalty set: ${exitNotice.penaltyAmountDisplay}`}>Waiting for the tenant to pay the early-exit penalty.</StatusNote>
          )}

          {exitNotice.status === 'inspection_pending' && (
            <StatusNote title="Waiting for inspection scheduling">The tenant needs to schedule the damage-inspection visit.</StatusNote>
          )}

          {/* Step: assess damage + refund */}
          {exitNotice.status === 'inspection_scheduled' && (
            <div className="rounded-card border border-outline bg-canvas-alt p-5">
              <h3 className="text-heading-3 font-bold text-navy">Assess damages & refund deposit</h3>
              <p className="mt-1 text-label text-text-muted">
                Inspection scheduled for {exitNotice.inspectionVisit?.date} at {exitNotice.inspectionVisit?.time}. Enter the damage cost;
                the remaining deposit is refunded to the tenant. Refund is due by {exitNotice.refundDueDate}.
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-label font-bold text-text-primary">Damage amount (Rs.)</span>
                  <input value={damage} onChange={(e) => { setDamage(e.target.value); setError('') }} inputMode="numeric"
                    className="mt-1.5 h-12 w-full rounded-input border border-outline px-4 outline-none focus:border-primary" />
                  <span className="mt-1 block text-label text-text-muted">Capped at the deposit ({exitNotice.securityDepositDisplay}).</span>
                </label>
                <label className="block">
                  <span className="text-label font-bold text-text-primary">Damage notes (optional)</span>
                  <textarea rows={2} value={damageNotes} onChange={(e) => setDamageNotes(e.target.value)}
                    className="mt-1.5 w-full resize-none rounded-input border border-outline px-4 py-2.5 outline-none focus:border-primary" />
                </label>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-button bg-white border border-outline px-4 py-3">
                <div className="text-label">
                  <p className="font-semibold text-text-muted">Deposit {exitNotice.securityDepositDisplay} - Damages {formatRs(damageValue)}</p>
                  <p className="mt-0.5 text-heading-3 font-bold text-navy">Refund: {formatRs(refundPreview)}</p>
                </div>
                <button onClick={() => setShowRefundGateway(true)} className="rounded-button bg-status-success px-5 py-3 font-bold text-white">Proceed to Refund</button>
              </div>
            </div>
          )}

          {exitNotice.status === 'refunded' && (
            <StatusNote tone="done" title="Deposit refunded - property released">
              Refunded {exitNotice.refundAmountDisplay} after {exitNotice.damageAmountDisplay} in damages on {exitNotice.refundedAt}.
              {exitNotice.damageNotes ? ` Notes: ${exitNotice.damageNotes}` : ''}
            </StatusNote>
          )}

          {error && <p className="text-body text-red-500 font-medium">{error}</p>}
        </div>
      </div>

      <RefundPaymentModal
        isOpen={showRefundGateway}
        propertyTitle={`${record.propertyName} - ${record.unit}`}
        tenantName={record.tenant.name}
        depositDisplay={exitNotice.securityDepositDisplay}
        damageDisplay={formatRs(damageValue)}
        refundAmount={refundPreview}
        refundDisplay={formatRs(refundPreview)}
        onClose={() => setShowRefundGateway(false)}
        onConfirm={handleRefundConfirmed}
      />
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-button bg-canvas-alt p-4">
      <p className="text-filter-label font-bold uppercase tracking-wider text-text-muted">{label}</p>
      <p className="mt-1 break-words text-body font-bold text-navy">{value}</p>
    </div>
  )
}

function StatusNote({ tone = 'wait', title, children }: { tone?: 'wait' | 'done'; title: string; children: React.ReactNode }) {
  return (
    <div className={cn('rounded-button border px-5 py-4', tone === 'done' ? 'border-status-success/30 bg-status-success/5' : 'border-status-warning/30 bg-status-warning-bg')}>
      <p className="text-body font-bold text-navy">{title}</p>
      <p className="mt-1 text-body text-text-muted">{children}</p>
    </div>
  )
}
