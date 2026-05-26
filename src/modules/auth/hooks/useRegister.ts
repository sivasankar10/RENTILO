import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../services/auth.api'
import { useAuth } from '@shared/hooks/useAuth'
import { ROUTES } from '@shared/constants/routes'
import type { UserRole } from '@shared/constants/roles'
import type { RegisterPayload } from '../types'
import type { User } from '@shared/types'

const ROLE_HOME: Record<UserRole, string> = {
  tenant: ROUTES.TENANT.LISTINGS,
  owner: ROUTES.OWNER.DASHBOARD,
  broker: ROUTES.BROKER.DASHBOARD,
  enterprise: ROUTES.ENTERPRISE.DASHBOARD,
}

export function useRegister() {
  const { setAuth } = useAuth()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (response) => {
      const { user, token } = response.data
      setAuth(user as User, token)
      navigate(ROLE_HOME[user.role as UserRole] ?? ROUTES.AUTH.LOGIN)
    },
  })
}
