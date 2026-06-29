import { useAuth } from '@shared/hooks/useAuth'
import { DEMO_TENANT } from '@shared/store/onboardingStore'

/** Current tenant id for session onboarding records */
export function useTenantId() {
  const { user } = useAuth()
  return user?.id ?? DEMO_TENANT.id
}
