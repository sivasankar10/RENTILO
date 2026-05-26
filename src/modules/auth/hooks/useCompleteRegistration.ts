import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../services/auth.api'
import { useAuth } from '@shared/hooks/useAuth'
import { getRoleHome } from '@shared/constants/roleHome'
import type { UserRole } from '@shared/constants/roles'
import type { CompleteRegistrationPayload } from '../types'
import type { User } from '@shared/types'
import { normalizeUser } from '@shared/utils/normalizeUser'

export function useCompleteRegistration() {
  const { setAuth } = useAuth()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: CompleteRegistrationPayload) => authApi.completeRegistration(payload),
    onSuccess: (response) => {
      const { user, token } = response.data
      const normalized = normalizeUser(user as User)
      setAuth(normalized, token)
      const homeRole = normalized.primaryRole ?? normalized.roles[0]
      navigate(getRoleHome(homeRole as UserRole))
    },
  })
}
