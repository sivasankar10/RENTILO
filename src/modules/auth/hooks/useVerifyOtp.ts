import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../services/auth.api'
import { useAuth } from '@shared/hooks/useAuth'
import { getRoleHome } from '@shared/constants/roleHome'
import type { UserRole } from '@shared/constants/roles'
import type { VerifyOtpPayload } from '../types'
import type { User } from '@shared/types'
import { normalizeUser } from '@shared/utils/normalizeUser'
import { useOwnerStore } from '@modules/owner/store/ownerStore'

export function useVerifyOtp() {
  const { setAuth } = useAuth()
  const navigate = useNavigate()
  const setSubscriptionPlan = useOwnerStore((s) => s.setSubscriptionPlan)

  return useMutation({
    mutationFn: (payload: VerifyOtpPayload) => authApi.verifyOtp(payload),
    onSuccess: (response) => {
      const { user, token } = response.data
      // Get subscriptionPlan from extended response (mock only)
      const subscriptionPlan = (response.data as { subscriptionPlan?: 'FREE' | 'PREMIUM' }).subscriptionPlan

      // Unknown phone — not in mock accounts. Surface as an error.
      if (!user) {
        throw new Error('Phone number not recognised. Use one of the demo accounts.')
      }

      const normalized = normalizeUser(user as User)
      setAuth(normalized, token)
      
      // Set subscription plan for owner users
      if (normalized.roles.includes('owner') && subscriptionPlan) {
        setSubscriptionPlan(subscriptionPlan)
      }
      
      const homeRole = normalized.primaryRole ?? normalized.roles[0]
      navigate(getRoleHome(homeRole as UserRole))
    },
  })
}
