/**
 * Mock Subscription Service
 * 
 * This service handles subscription state management entirely on the frontend.
 * It uses Local Storage for persistence and will be replaced with backend APIs later.
 */

import type { SubscriptionPlan, SubscriptionStatus, OwnerFeature } from '../config/features'
import { getEnabledFeatures } from '../config/features'

const STORAGE_KEY = 'rentilo_subscription'

export interface SubscriptionData {
  subscriptionPlan: SubscriptionPlan
  subscriptionStatus: SubscriptionStatus
  enabledFeatures: OwnerFeature[]
  subscribedAt?: string
  expiresAt?: string
}

const DEFAULT_SUBSCRIPTION: SubscriptionData = {
  subscriptionPlan: 'FREE',
  subscriptionStatus: 'active',
  enabledFeatures: [],
}

/**
 * Get subscription data from Local Storage
 */
export function getSubscription(): SubscriptionData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const data = JSON.parse(stored) as Partial<SubscriptionData>
      return {
        subscriptionPlan: data.subscriptionPlan ?? 'FREE',
        subscriptionStatus: data.subscriptionStatus ?? 'active',
        enabledFeatures: data.enabledFeatures ?? getEnabledFeatures(data.subscriptionPlan ?? 'FREE'),
        subscribedAt: data.subscribedAt,
        expiresAt: data.expiresAt,
      }
    }
  } catch (error) {
    console.warn('Failed to read subscription from storage:', error)
  }
  return { ...DEFAULT_SUBSCRIPTION }
}

/**
 * Save subscription data to Local Storage
 */
function saveSubscription(data: SubscriptionData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.warn('Failed to save subscription to storage:', error)
  }
}

/**
 * Simulate payment processing delay
 */
function simulatePaymentDelay(ms: number = 2500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Mock upgrade to Premium plan
 * Simulates a payment flow with artificial delay
 */
export async function upgradeToPremium(
  onProgress?: (status: 'processing' | 'verifying' | 'success') => void
): Promise<SubscriptionData> {
  // Simulate payment processing
  onProgress?.('processing')
  await simulatePaymentDelay(1500)
  
  // Simulate payment verification
  onProgress?.('verifying')
  await simulatePaymentDelay(1000)
  
  // Create premium subscription
  const now = new Date()
  const expiresAt = new Date(now)
  expiresAt.setFullYear(expiresAt.getFullYear() + 1) // 1 year subscription
  
  const subscriptionData: SubscriptionData = {
    subscriptionPlan: 'PREMIUM',
    subscriptionStatus: 'active',
    enabledFeatures: getEnabledFeatures('PREMIUM'),
    subscribedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  }
  
  saveSubscription(subscriptionData)
  onProgress?.('success')
  
  return subscriptionData
}

/**
 * Mock downgrade to Free plan
 */
export function downgradeToFree(): SubscriptionData {
  const subscriptionData: SubscriptionData = {
    subscriptionPlan: 'FREE',
    subscriptionStatus: 'active',
    enabledFeatures: getEnabledFeatures('FREE'),
  }
  
  saveSubscription(subscriptionData)
  return subscriptionData
}

/**
 * Reset subscription to default (FREE)
 * Useful for development/testing
 */
export function resetSubscription(): SubscriptionData {
  localStorage.removeItem(STORAGE_KEY)
  return { ...DEFAULT_SUBSCRIPTION }
}

/**
 * Check if subscription is premium
 */
export function isPremiumSubscription(): boolean {
  const { subscriptionPlan, subscriptionStatus } = getSubscription()
  return subscriptionPlan === 'PREMIUM' && subscriptionStatus === 'active'
}

/**
 * Get subscription age in days
 */
export function getSubscriptionAge(): number | null {
  const { subscribedAt } = getSubscription()
  if (!subscribedAt) return null
  
  const subscribed = new Date(subscribedAt)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - subscribed.getTime())
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Format subscription date for display
 */
export function formatSubscriptionDate(isoDate?: string): string {
  if (!isoDate) return 'N/A'
  
  const date = new Date(isoDate)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
