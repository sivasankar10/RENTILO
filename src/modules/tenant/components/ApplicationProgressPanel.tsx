import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, FileText, KeyRound, RefreshCw, WalletCards } from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { cn } from '@shared/utils/cn'
import {
  statusIndex,
  useOnboardingStore,
  type OnboardingStatus,
} from '@shared/store/onboardingStore'
import { useTenantId } from '../hooks/useTenantId'

type StepState = 'done' | 'active' | 'pending'

export function ApplicationProgressPanel({ propertyId }: { propertyId: string }) {
  const navigate = useNavigate()
  const tenantId = useTenantId()
  const record = useOnboardingStore((state) =>
    state.records.find(
      (item) => item.tenant.id === tenantId && item.tenantPropertyId === propertyId,
    ),
  )
  const confirmPropertyVisit = useOnboardingStore((state) => state.confirmPropertyVisit)
  const processDueOwnerApprovals = useOnboardingStore((state) => state.processDueOwnerApprovals)
  const requestLeaseAgreement = useOnboardingStore((state) => state.requestLeaseAgreement)
  const recordId = record?.id
  const recordStatus = record?.status
  const ownerApprovalDueAt = record?.ownerApprovalDueAt

  useEffect(() => {
    processDueOwnerApprovals()
    if (!recordId || recordStatus !== 'awaiting_owner_approval' || !ownerApprovalDueAt) return

    const dueMs = new Date(ownerApprovalDueAt).getTime() - Date.now()
    if (dueMs <= 0) {
      processDueOwnerApprovals()
      return
    }

    const timer = window.setTimeout(() => processDueOwnerApprovals(), dueMs)
    return () => window.clearTimeout(timer)
  }, [recordId, recordStatus, ownerApprovalDueAt, processDueOwnerApprovals])

  const stateFor = (target: OnboardingStatus): StepState => {
    if (!record) return 'pending'
    if (record.status === 'changes_requested' && target === 'agreement_approved') return 'active'
    if (record.status === 'agreement_sent' && target === 'agreement_approved') return 'active'
    if (record.status === 'rejected') return 'pending'

    const current = statusIndex(record.status)
    const targetIdx = statusIndex(target)
    if (current < 0 || targetIdx < 0) return 'pending'
    if (current > targetIdx) return 'done'
    if (current === targetIdx) return 'active'
    return 'pending'
  }

  const steps = [
    {
      id: 'interest',
      label: 'Interest Shown',
      description: 'Your interest in this property is recorded',
      state: 'done' as const,
      icon: Check,
    },
    {
      id: 'visit',
      label: 'Visit Scheduled',
      description: record?.scheduledVisit
        ? `${record.scheduledVisit.date} at ${record.scheduledVisit.time}`
        : 'Property visit scheduled',
      state: stateFor('visit_scheduled'),
      icon: Check,
    },
    {
      id: 'visited',
      label: 'Visited Property',
      description: 'Confirm once you have completed the property visit',
      state:
        record?.status === 'visit_scheduled'
          ? ('active' as const)
          : stateFor('visit_confirmed'),
      icon: Check,
    },
    {
      id: 'approval',
      label: 'Approval from Owner',
      description:
        record?.status === 'awaiting_owner_approval'
          ? 'Waiting for owner approval'
          : 'Owner profile review and approval',
      state:
        record?.status === 'awaiting_owner_approval'
          ? ('active' as const)
          : stateFor('owner_approved'),
      icon: RefreshCw,
    },
    {
      id: 'lease',
      label: 'Lease Signed',
      description:
        record?.status === 'changes_requested'
          ? 'Your requested changes are with the owner'
          : record?.status === 'agreement_requested'
            ? 'Waiting for owner to send the rental agreement'
            : 'Review and approve the rental agreement',
      state:
        record?.status === 'changes_requested' ||
        record?.status === 'agreement_sent' ||
        record?.status === 'agreement_requested'
          ? ('active' as const)
          : stateFor('agreement_approved'),
      icon: FileText,
    },
    {
      id: 'payment',
      label: 'Payment',
      description: 'First month and security deposit',
      state: stateFor('payment_completed'),
      icon: WalletCards,
    },
    {
      id: 'checkin',
      label: 'Check-in',
      description: record?.lease?.accessKey ?? 'Receive digital access keys',
      state: stateFor('active'),
      icon: KeyRound,
    },
  ]

  const primaryAction = () => {
    if (!record) return null
    if (record.status === 'owner_approved') {
      return { label: 'Request Lease Agreement', onClick: () => requestLeaseAgreement(record.id) }
    }
    if (record.status === 'agreement_requested' || record.status === 'changes_requested') {
      return {
        label:
          record.status === 'changes_requested'
            ? 'Awaiting Revised Agreement'
            : 'Awaiting Agreement from Owner',
        onClick: () => {},
        disabled: true,
      }
    }
    if (record.status === 'agreement_sent') {
      return { label: 'Review Agreement', onClick: () => navigate(ROUTES.TENANT.AGREEMENT(record.id)) }
    }
    if (record.status === 'agreement_approved') {
      return {
        label: 'Complete Payment',
        onClick: () => navigate(ROUTES.TENANT.ONBOARDING_PAYMENT(record.id)),
      }
    }
    if (record.status === 'payment_completed' || record.status === 'active') {
      return { label: 'View My Lease', onClick: () => navigate(ROUTES.TENANT.MY_LEASE) }
    }
    if (record.status === 'awaiting_owner_approval') {
      return { label: 'Awaiting Owner Approval', onClick: () => {}, disabled: true }
    }
    return null
  }

  const action = primaryAction()
  const showVisitConfirmation = record?.status === 'visit_scheduled'

  return (
    <div className="overflow-hidden rounded-2xl border border-brand-outline-variant bg-brand-container-lowest shadow-card">
      <div className="border-b border-brand-outline-variant px-7 py-6">
        <h2 className="font-display text-[22px] font-extrabold text-brand">Application Progress</h2>
        {record && (
          <p className="mt-1 text-xs font-semibold text-brand-outline">Application {record.id}</p>
        )}
      </div>
      <div className="px-7 py-7">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <div key={step.id} className="relative flex gap-5 pb-7 last:pb-0">
              {index < steps.length - 1 && (
                <span className="absolute left-[22px] top-11 h-[calc(100%-30px)] w-px bg-brand-outline-variant" />
              )}
              <div
                className={cn(
                  'relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2',
                  step.state === 'done' && 'border-navy bg-navy text-white',
                  step.state === 'active' && 'border-primary bg-primary text-white',
                  step.state === 'pending' &&
                    'border-brand-outline-variant bg-brand-container-low text-brand-outline',
                )}
              >
                <Icon
                  size={18}
                  className={step.state === 'active' && step.id === 'approval' ? 'animate-spin' : ''}
                />
              </div>
              <div className="pt-1">
                <p
                  className={cn(
                    'font-display text-[16px] font-bold',
                    step.state === 'pending' ? 'text-brand-outline' : 'text-brand',
                  )}
                >
                  {step.label}
                </p>
                <p
                  className={cn(
                    'mt-1 text-[13px] leading-5',
                    step.state === 'pending' ? 'text-brand-outline/70' : 'text-brand-on-surface-variant',
                  )}
                >
                  {step.description}
                </p>
                {step.state === 'active' && (
                  <span className="mt-2 inline-flex rounded-md bg-primary-50 px-2.5 py-1 text-[10px] font-bold uppercase text-primary">
                    Current Step
                  </span>
                )}
              </div>
            </div>
          )
        })}

        {showVisitConfirmation && record && (
          <div className="mt-2 rounded-xl border border-brand-outline-variant bg-brand-container-low p-4">
            <p className="text-[14px] font-semibold text-brand">Did you complete the property visit?</p>
            <p className="mt-1 text-[12px] text-brand-on-surface-variant">
              Confirm only after you have visited the property in person.
            </p>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => confirmPropertyVisit(record.id, true)}
                className="flex-1 rounded-[10px] bg-brand px-4 py-2.5 text-[14px] font-semibold text-white hover:opacity-90"
              >
                Yes, visited
              </button>
              <button
                type="button"
                onClick={() => confirmPropertyVisit(record.id, false)}
                className="flex-1 rounded-[10px] border border-brand-outline-variant bg-brand-container-lowest px-4 py-2.5 text-[14px] font-semibold text-brand hover:bg-brand-container-high"
              >
                Not yet
              </button>
            </div>
          </div>
        )}

        {action && (
          <button
            type="button"
            onClick={action.onClick}
            disabled={action.disabled}
            className={cn(
              'mt-7 w-full rounded-[10px] px-5 py-3.5 font-body text-[15px] font-semibold',
              action.disabled
                ? 'cursor-not-allowed bg-brand-container-high text-brand-outline'
                : 'bg-brand text-white hover:opacity-90',
            )}
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  )
}
