import { ReactNode } from 'react'
import { useOwnerStore } from '../store/ownerStore'
import type { OwnerFeature } from '../config/features'

interface FeatureGateProps {
  feature: OwnerFeature
  children: ReactNode
  fallback?: ReactNode
}

/**
 * FeatureGate component that conditionally renders content based on feature access.
 * If the user doesn't have access to the feature, it renders the fallback or nothing.
 */
export function FeatureGate({ feature, children, fallback = null }: FeatureGateProps) {
  const hasFeature = useOwnerStore((state) => state.hasFeature)
  
  if (hasFeature(feature)) {
    return <>{children}</>
  }
  
  return <>{fallback}</>
}

/**
 * Hook to check feature access
 */
export function useFeatureAccess(feature: OwnerFeature): boolean {
  const hasFeature = useOwnerStore((state) => state.hasFeature)
  return hasFeature(feature)
}

/**
 * Hook to get subscription info
 */
export function useSubscription() {
  const subscriptionPlan = useOwnerStore((state) => state.subscriptionPlan)
  const subscriptionStatus = useOwnerStore((state) => state.subscriptionStatus)
  const enabledFeatures = useOwnerStore((state) => state.enabledFeatures)
  const hasFeature = useOwnerStore((state) => state.hasFeature)
  const upgradeToPremium = useOwnerStore((state) => state.upgradeToPremium)
  const showUpgradePrompt = useOwnerStore((state) => state.showUpgradePrompt)
  
  return {
    plan: subscriptionPlan,
    status: subscriptionStatus,
    enabledFeatures,
    hasFeature,
    isPremium: subscriptionPlan === 'PREMIUM',
    isFree: subscriptionPlan === 'FREE',
    upgradeToPremium,
    showUpgradePrompt,
  }
}
