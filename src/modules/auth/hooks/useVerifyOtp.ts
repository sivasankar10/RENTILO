import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../services/auth.api'
import { useAuth } from '@shared/hooks/useAuth'
import { ROUTES } from '@shared/constants/routes'
import { getRoleHome } from '@shared/constants/roleHome'
import type { UserRole } from '@shared/constants/roles'
import type { VerifyOtpPayload } from '../types'
import type { User } from '@shared/types'
import { normalizeUser } from '@shared/utils/normalizeUser'

export function useVerifyOtp() {
  const { setAuth } = useAuth()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: VerifyOtpPayload) => authApi.verifyOtp(payload),
    onSuccess: (response, variables) => {
      const { user, token, isNewUser } = response.data

      if (isNewUser || !user) {
        navigate(ROUTES.AUTH.REGISTER, {
          state: {
            phone: variables.phone,
            otpSessionId: variables.otpSessionId,
          },
        })
        return
      }

      const normalized = normalizeUser(user as User)
      setAuth(normalized, token)
      const homeRole = normalized.primaryRole ?? normalized.roles[0]
      navigate(getRoleHome(homeRole as UserRole))
    },
  })
}
