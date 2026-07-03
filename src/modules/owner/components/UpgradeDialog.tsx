import { useNavigate } from 'react-router-dom'
import { X, Crown, Check, Zap } from 'lucide-react'
import { useOwnerStore } from '../store/ownerStore'
import { FEATURE_LABELS, FEATURE_DESCRIPTIONS, PLAN_CONFIG, getUpgradeFeatures } from '../config/features'
import type { OwnerFeature } from '../config/features'
import { ROUTES } from '@shared/constants/routes'

const PREMIUM_HIGHLIGHTS: OwnerFeature[] = [
  'analytics',
  'inquiry_management',
  'promoted_listings',
  'financial_reports',
  'priority_support',
]

export function UpgradeDialog() {
  const navigate = useNavigate()
  const showUpgradeDialog = useOwnerStore((state) => state.showUpgradeDialog)
  const upgradeFeature = useOwnerStore((state) => state.upgradeFeature)
  const hideUpgradeDialog = useOwnerStore((state) => state.hideUpgradeDialog)
  const subscriptionPlan = useOwnerStore((state) => state.subscriptionPlan)
  
  if (!showUpgradeDialog) return null
  
  const premiumConfig = PLAN_CONFIG.PREMIUM
  const upgradeFeatures = getUpgradeFeatures(subscriptionPlan, 'PREMIUM')
  
  const handleUpgrade = () => {
    hideUpgradeDialog()
    navigate(ROUTES.OWNER.PREMIUM_PAYMENT)
  }
  
  const handleClose = () => {
    hideUpgradeDialog()
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Dialog */}
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0f172a] to-[#1e3a5f] px-6 py-8 text-center">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
            <Crown size={32} className="text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">
            Upgrade to Premium
          </h2>
          
          {upgradeFeature && (
            <p className="text-white/80">
              Unlock <span className="font-semibold text-amber-400">{FEATURE_LABELS[upgradeFeature]}</span> and more
            </p>
          )}
          
          {upgradeFeature && FEATURE_DESCRIPTIONS[upgradeFeature] && (
            <p className="text-sm text-white/60 mt-2">
              {FEATURE_DESCRIPTIONS[upgradeFeature]}
            </p>
          )}
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Pricing */}
          <div className="text-center mb-6">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold text-[#0f172a]">
                ${premiumConfig.monthlyPrice}
              </span>
              <span className="text-[#64748b]">/month</span>
            </div>
            <p className="text-sm text-[#64748b] mt-1">
              or ${premiumConfig.yearlyPrice}/year (save 20%)
            </p>
          </div>
          
          {/* Features */}
          <div className="space-y-3 mb-6">
            <p className="text-sm font-semibold text-[#64748b] uppercase tracking-wide">
              What you'll get:
            </p>
            {PREMIUM_HIGHLIGHTS.map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#dcfce7] flex items-center justify-center">
                  <Check size={12} className="text-[#16a34a]" />
                </div>
                <span className="text-[14px] text-[#475569]">
                  {FEATURE_LABELS[feature]}
                </span>
              </div>
            ))}
            {upgradeFeatures.length > PREMIUM_HIGHLIGHTS.length && (
              <p className="text-sm text-[#64748b] pl-8">
                + {upgradeFeatures.length - PREMIUM_HIGHLIGHTS.length} more features
              </p>
            )}
          </div>
          
          {/* CTA */}
          <button
            onClick={handleUpgrade}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0f172a] to-[#1e3a5f] text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Zap size={18} />
            Upgrade Now
          </button>
          
          <p className="text-center text-xs text-[#94a3b8] mt-4">
            Cancel anytime. No questions asked.
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Locked Feature Card - shown in sidebar for locked features
 */
interface LockedNavItemProps {
  label: string
  feature: OwnerFeature
  icon: React.ReactNode
}

export function LockedNavItem({ label, feature, icon }: LockedNavItemProps) {
  const showUpgradePrompt = useOwnerStore((state) => state.showUpgradePrompt)
  
  return (
    <button
      type="button"
      onClick={() => showUpgradePrompt(feature)}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-[#94a3b8] hover:bg-[#f8fafc] transition-colors"
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
      <span className="text-amber-500">🔒</span>
    </button>
  )
}
