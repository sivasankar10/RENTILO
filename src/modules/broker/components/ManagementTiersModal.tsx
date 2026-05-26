import { CircleCheck, X } from 'lucide-react'
import { Modal } from '@shared/components'

const PREMIUM_FEATURES = [
  'Up to 50 Properties',
  'Advanced Analytics',
  'Tenant Screening',
  'Priority Email Support',
] as const

interface ManagementTiersModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectPremium?: () => void
}

export function ManagementTiersModal({
  isOpen,
  onClose,
  onSelectPremium,
}: ManagementTiersModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" className="max-w-[420px]">
      <div className="relative -mt-2">
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-1 right-0 p-2 rounded-button text-text-muted hover:bg-hover-light transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2 className="text-[28px] font-bold tracking-tight text-[#0f172a] pr-10">
          Management Tiers
        </h2>
        <p className="text-[14px] text-text-muted mt-2 leading-relaxed">
          Choose the infrastructure that scales with your portfolio.
        </p>

        <div className="relative mt-8 rounded-xl border border-outline px-8 pb-8 pt-10">
          <span className="absolute -top-3 left-8 bg-surface px-2 text-[13px] font-medium text-text-muted">
            Popular
          </span>

          <p className="text-[15px] font-bold text-[#0f172a]">Premium</p>

          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-[44px] font-bold leading-none tracking-tight text-[#0f172a]">
              $149
            </span>
            <span className="text-[15px] text-text-muted font-medium">/month</span>
          </div>

          <ul className="mt-8 space-y-4">
            {PREMIUM_FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <CircleCheck
                  size={20}
                  strokeWidth={1.5}
                  className="shrink-0 text-[#0f172a]"
                />
                <span className="text-[14px] text-[#0f172a]">{feature}</span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => {
              onSelectPremium?.()
              onClose()
            }}
            className="mt-10 w-full py-3 rounded-lg border-2 border-[#0f172a] bg-white text-[14px] font-medium text-[#0f172a] hover:bg-hover-light transition-colors"
          >
            Select Premium
          </button>
        </div>
      </div>
    </Modal>
  )
}
