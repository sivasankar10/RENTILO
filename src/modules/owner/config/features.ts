/** 
 * Owner Module Feature Configuration
 * Centralizes feature access control based on subscription plan
 */

// Subscription plan types
export type SubscriptionPlan = 'FREE' | 'PREMIUM'

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'trial'

// Feature identifiers
export type OwnerFeature =
  | 'analytics'
  | 'advanced_analytics'
  | 'inquiry_management'
  | 'chat'
  | 'promoted_listings'
  | 'promotion_selection'
  | 'financial_reports'
  | 'bulk_property_management'
  | 'custom_branding'
  | 'api_access'
  | 'priority_support'
  | 'smart_match'
  | 'exit_path'

// Feature configuration by plan
const PLAN_FEATURES: Record<SubscriptionPlan, OwnerFeature[]> = {
  FREE: [],
  PREMIUM: [
    'analytics',
    'advanced_analytics',
    'inquiry_management',
    'chat',
    'promoted_listings',
    'promotion_selection',
    'financial_reports',
    'bulk_property_management',
    'custom_branding',
    'api_access',
    'priority_support',
    'smart_match',
    'exit_path',
  ],
}

// Feature display names for UI
export const FEATURE_LABELS: Record<OwnerFeature, string> = {
  analytics: 'Analytics',
  advanced_analytics: 'Advanced Analytics',
  inquiry_management: 'Inquiry Management',
  chat: 'Messaging',
  promoted_listings: 'Promoted Listings',
  promotion_selection: 'Promotion Selection',
  financial_reports: 'Financial Reports',
  bulk_property_management: 'Bulk Property Management',
  custom_branding: 'Custom Branding',
  api_access: 'API Access',
  priority_support: 'Priority Support',
  smart_match: 'Smart Match',
  exit_path: 'Exit Path Management',
}

// Feature descriptions for upgrade prompts
export const FEATURE_DESCRIPTIONS: Record<OwnerFeature, string> = {
  analytics: 'Track property performance with detailed analytics',
  advanced_analytics: 'Get market insights and advanced reporting',
  inquiry_management: 'Manage tenant inquiries efficiently',
  chat: 'Direct messaging with tenants and brokers',
  promoted_listings: 'Boost visibility with promoted listings',
  promotion_selection: 'Select properties for promotional campaigns',
  financial_reports: 'Generate comprehensive financial reports',
  bulk_property_management: 'Manage multiple properties at once',
  custom_branding: 'Add your brand to listings',
  api_access: 'Access Rentilo API for integrations',
  priority_support: '24/7 priority customer support',
  smart_match: 'AI-powered tenant matching',
  exit_path: 'Manage property exit strategies',
}

/**
 * Check if a feature is enabled for a given subscription plan
 */
export function hasFeature(plan: SubscriptionPlan, feature: OwnerFeature): boolean {
  return PLAN_FEATURES[plan]?.includes(feature) ?? false
}

/**
 * Get all enabled features for a subscription plan
 */
export function getEnabledFeatures(plan: SubscriptionPlan): OwnerFeature[] {
  return PLAN_FEATURES[plan] ?? []
}

/**
 * Get features that would be unlocked by upgrading to a plan
 */
export function getUpgradeFeatures(currentPlan: SubscriptionPlan, targetPlan: SubscriptionPlan): OwnerFeature[] {
  const currentFeatures = new Set(PLAN_FEATURES[currentPlan] ?? [])
  const targetFeatures = PLAN_FEATURES[targetPlan] ?? []
  return targetFeatures.filter(feature => !currentFeatures.has(feature))
}

/**
 * Plan display configuration
 */
export const PLAN_CONFIG: Record<SubscriptionPlan, {
  name: string
  description: string
  propertyLimit: number
  monthlyPrice: number
  yearlyPrice: number
}> = {
  FREE: {
    name: 'Free Plan',
    description: 'Perfect for getting started with a single property',
    propertyLimit: 1,
    monthlyPrice: 0,
    yearlyPrice: 0,
  },
  PREMIUM: {
    name: 'Premium Plan',
    description: 'Unlock all features for professional property management',
    propertyLimit: -1, // Unlimited
    monthlyPrice: 49,
    yearlyPrice: 470,
  },
}
