import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarClock, CheckCircle2, Clock, DoorOpen, LogOut, ReceiptText, ShieldCheck, Wallet } from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { useOnboardingStore, type OnboardingRecord } from '@shared/store/onboardingStore'
import type { LeaseExitStatus } from '@shared/types/prototype'
import { useTenantId } from '../hooks/useTenantId'
import { ExitNoticeModal, type ExitNoticeSubmission } from '../components/ExitNoticeModal'
import { ExitPenaltyModal } from '../components/ExitPenaltyModal'
import { ScheduleVisitModal } from '../components/ScheduleVisitModal'

type ModalKind = 'initiate' | 'penalty' | 'inspection' | null

const STATUS_LABEL: Record<LeaseExitStatus, string> = {
  penalty_pending: 'AWAITING PENALTY',
  penalty_payment: 'PENALTY DUE',
  inspection_pending: 'SCHEDULE INSPECTION',
  inspection_scheduled: 'AWAITING REFUND',
  refunded: 'COMPLETED',
}

export function TenantExitNotice() {
  const navigate = useNavigate()
  const tenantId = useTenantId()
  const records = useOnboardingStore((state) =>
    state.records.filter((record) => record.tenant.id === tenantId && record.lease?.status === 'active'),
  )
  const initiateLeaseExit = useOnboardingStore((state) => state.initiateLeaseExit)
  const payEarlyExitPenalty = useOnboardingStore((state) => state.payEarlyExitPenalty)
  const scheduleExitInspection = useOnboardingStore((state) => state.scheduleExitInspection)

  const [modal, setModal] = useState<ModalKind>(null)
  const [activeLeaseId, setActiveLeaseId] = useState<string | null>(null)

  const activeRecord = records.find((record) => record.lease?.id === activeLeaseId)

  const openModal = (record: OnboardingRecord, kind: ModalKind) => {
    setActiveLeaseId(record.lease?.id ?? null)
    setModal(kind)
  }
  const closeModal = () => setModal(null)

  const handleInitiate = (submission: ExitNoticeSubmission) => {
    if (!activeRecord?.lease) return
    initiateLeaseExit(activeRecord.lease.id, submission)
    closeModal()
  }
  const handlePayPenalty = (method: string, refId: string) => {
    if (!activeRecord?.lease) return
    payEarlyExitPenalty(activeRecord.lease.id, { method, refId })
    closeModal()
  }
  const handleScheduleInspection = (date: string, time: string) => {
    if (!activeRecord?.lease) return
    scheduleExitInspection(activeRecord.lease.id, { date, time })
    closeModal()
  }

  if (!records.length) {
    return (
      <div className="rounded-card border border-outline bg-white p-10 text-center shadow-surface">
        <DoorOpen size={48} className="mx-auto text-text-muted" />
        <h1 className="mt-4 text-heading-2 font-bold text-navy">No active lease</h1>
        <p className="mt-2 text-body text-text-muted">Exit notice is available once your lease is active.</p>
        <button onClick={() => navigate(ROUTES.TENANT.MY_LEASE)} className="mt-6 rounded-button bg-navy px-6 py-3 font-bold text-white">Go to My Lease</button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-filter-label font-bold uppercase tracking-wider text-primary">Tenant Account</p>
        <h1 className="mt-2 text-heading-1 font-bold text-navy">Exit Notice</h1>
        <p className="mt-1 text-body text-text-muted">Give notice before vacating, schedule a damage inspection, and get your deposit refunded.</p>
      </div>

      {records.map((record) => {
        const exitNotice = record.lease?.exitNotice
        return (
          <section key={record.id} className="overflow-hidden rounded-card border border-outline bg-white shadow-surface">
            <header className="flex flex-wrap items-start justify-between gap-4 bg-navy px-7 py-6 text-white">
              <div>
                <p className="text-filter-label font-bold uppercase tracking-wider text-white/60">{record.lease?.id}</p>
                <h2 className="mt-2 text-heading-2 font-bold">{record.propertyName}</h2>
                <p className="mt-1 text-body text-white/70">{record.unit} - {record.address}</p>
              </div>
              {exitNotice && (
                <span className="rounded-pill bg-amber-100 px-3 py-1 text-badge font-bold text-amber-700">
                  {STATUS_LABEL[exitNotice.status]}
                </span>
              )}
            </header>

            {exitNotice ? (
              <ExitWorkflow
                record={record}
                onPayPenalty={() => openModal(record, 'penalty')}
                onScheduleInspection={() => openModal(record, 'inspection')}
              />
            ) : (
              <div className="space-y-4 p-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <InfoTile icon={CalendarClock} label="Notice period" value={`${record.noticePeriodDays} days`} />
                  <InfoTile icon={ShieldCheck} label="Security deposit" value={record.securityDeposit} />
                  <InfoTile icon={ReceiptText} label="Monthly rent" value={record.monthlyRent} />
                </div>
                <button
                  onClick={() => openModal(record, 'initiate')}
                  className="inline-flex items-center gap-2 rounded-button bg-navy px-5 py-3 text-body font-bold text-white"
                >
                  <LogOut size={16} /> Initiate Exit Notice
                </button>
              </div>
            )}
          </section>
        )
      })}

      {activeRecord && (
        <>
          <ExitNoticeModal
            isOpen={modal === 'initiate'}
            propertyTitle={`${activeRecord.propertyName} - ${activeRecord.unit}`}
            noticePeriodDays={activeRecord.noticePeriodDays}
            onClose={closeModal}
            onSubmit={handleInitiate}
          />
          <ExitPenaltyModal
            isOpen={modal === 'penalty'}
            propertyTitle={`${activeRecord.propertyName} - ${activeRecord.unit}`}
            penaltyDisplay={activeRecord.lease?.exitNotice?.penaltyAmountDisplay ?? '-'}
            onClose={closeModal}
            onPay={handlePayPenalty}
          />
          <ScheduleVisitModal
            isOpen={modal === 'inspection'}
            propertyTitle={`Damage inspection - ${activeRecord.propertyName}`}
            onClose={closeModal}
            onConfirmed={handleScheduleInspection}
          />
        </>
      )}
    </div>
  )
}

function ExitWorkflow({
  record,
  onPayPenalty,
  onScheduleInspection,
}: {
  record: OnboardingRecord
  onPayPenalty: () => void
  onScheduleInspection: () => void
}) {
  const exitNotice = record.lease!.exitNotice!
  const isImmediate = exitNotice.type === 'immediate'

  return (
    <div className="space-y-5 p-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <InfoTile icon={LogOut} label="Exit type" value={isImmediate ? 'Early exit (penalty)' : `${exitNotice.noticePeriodDays}-day notice`} />
        <InfoTile icon={CalendarClock} label={isImmediate ? 'Requested move-out' : 'Move-out date'} value={exitNotice.moveOutDate} />
        <InfoTile icon={Clock} label="Deposit refund due by" value={exitNotice.refundDueDate} />
        <InfoTile icon={ShieldCheck} label="Security deposit" value={exitNotice.securityDepositDisplay} />
        {exitNotice.penaltyAmountDisplay && (
          <InfoTile icon={Wallet} label={`Early-exit penalty${exitNotice.penaltyPaidAt ? ' (paid)' : ''}`} value={exitNotice.penaltyAmountDisplay} />
        )}
        {exitNotice.inspectionVisit && (
          <InfoTile icon={CalendarClock} label="Inspection visit" value={`${exitNotice.inspectionVisit.date}, ${exitNotice.inspectionVisit.time}`} />
        )}
        {exitNotice.status === 'refunded' && (
          <>
            <InfoTile icon={ReceiptText} label="Damages deducted" value={exitNotice.damageAmountDisplay ?? 'Rs. 0'} />
            <InfoTile icon={CheckCircle2} label="Deposit refunded" value={exitNotice.refundAmountDisplay ?? 'Rs. 0'} />
          </>
        )}
      </div>

      {/* Current step callout */}
      {exitNotice.status === 'penalty_pending' && (
        <StepBanner tone="wait" title="Waiting for the owner to set the early-exit penalty">
          You'll be able to pay the penalty here once the owner confirms the amount.
        </StepBanner>
      )}

      {exitNotice.status === 'penalty_payment' && (
        <StepBanner tone="action" title={`Pay the early-exit penalty of ${exitNotice.penaltyAmountDisplay}`}>
          <p className="mb-3">Pay the owner-set penalty to skip the notice period and move on to the damage inspection.</p>
          <button onClick={onPayPenalty} className="inline-flex items-center gap-2 rounded-button bg-navy px-5 py-2.5 text-body font-bold text-white">
            <Wallet size={16} /> Pay Penalty
          </button>
        </StepBanner>
      )}

      {exitNotice.status === 'inspection_pending' && (
        <StepBanner tone="action" title="Schedule your damage-inspection visit">
          <p className="mb-3">Pick a slot for the owner to inspect the property for damages. Your deposit is refunded after this visit.</p>
          <button onClick={onScheduleInspection} className="inline-flex items-center gap-2 rounded-button bg-navy px-5 py-2.5 text-body font-bold text-white">
            <CalendarClock size={16} /> Schedule Inspection
          </button>
        </StepBanner>
      )}

      {exitNotice.status === 'inspection_scheduled' && (
        <StepBanner tone="wait" title="Inspection scheduled">
          The owner will inspect the property on {exitNotice.inspectionVisit?.date} at {exitNotice.inspectionVisit?.time}, then
          refund your security deposit (minus any damages) by {exitNotice.refundDueDate}.
        </StepBanner>
      )}

      {exitNotice.status === 'refunded' && (
        <StepBanner tone="done" title="Exit complete - deposit refunded">
          <p>
            Your deposit of {exitNotice.securityDepositDisplay} was settled: {exitNotice.refundAmountDisplay} refunded after{' '}
            {exitNotice.damageAmountDisplay} in damages. The property has been released.
          </p>
          {exitNotice.damageNotes && <p className="mt-2 text-text-muted">Owner notes: {exitNotice.damageNotes}</p>}
        </StepBanner>
      )}
    </div>
  )
}

function StepBanner({ tone, title, children }: { tone: 'wait' | 'action' | 'done'; title: string; children: React.ReactNode }) {
  const styles = {
    wait: 'border-status-warning/30 bg-status-warning-bg',
    action: 'border-primary/30 bg-primary-50',
    done: 'border-status-success/30 bg-status-success/5',
  }[tone]
  const Icon = tone === 'done' ? CheckCircle2 : tone === 'action' ? DoorOpen : Clock
  const iconColor = tone === 'done' ? 'text-status-success' : tone === 'action' ? 'text-primary' : 'text-status-warning-text'
  return (
    <div className={`rounded-button border ${styles} px-5 py-4`}>
      <div className="flex items-start gap-3">
        <Icon size={20} className={`mt-0.5 flex-shrink-0 ${iconColor}`} />
        <div className="text-body text-navy">
          <p className="font-bold">{title}</p>
          <div className="mt-1 text-text-muted">{children}</div>
        </div>
      </div>
    </div>
  )
}

function InfoTile({ icon: Icon, label, value }: { icon: typeof CalendarClock; label: string; value: string }) {
  return (
    <div className="rounded-button bg-canvas-alt p-4">
      <Icon size={18} className="text-primary" />
      <p className="mt-3 text-filter-label font-bold uppercase tracking-wider text-text-muted">{label}</p>
      <p className="mt-1 break-words text-body font-bold text-navy">{value}</p>
    </div>
  )
}
