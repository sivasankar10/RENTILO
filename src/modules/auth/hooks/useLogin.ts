import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../services/auth.api'
import { useAuth } from '@shared/hooks/useAuth'
import { ROUTES } from '@shared/constants/routes'
import type { UserRole } from '@shared/constants/roles'
import type { LoginPayload } from '../types'
import type { User } from '@shared/types'

const ROLE_HOME: Record<UserRole, string> = {
  tenant: ROUTES.TENANT.LISTINGS,
  owner: ROUTES.OWNER.DASHBOARD,
  broker: ROUTES.BROKER.DASHBOARD,
  enterprise: ROUTES.ENTERPRISE.DASHBOARD,
}

export function useLogin() {
  const { setAuth } = useAuth()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      // Hardcoded bypass for testing all 4 roles
      const validRoles = ['tenant', 'owner', 'broker', 'enterprise']
      if (validRoles.includes(payload.email) && payload.password === '123') {
        const role = payload.email // The username corresponds to the role
        return {
          data: {
            user: {
              id: `mock-${role}-id`,
              email: `${role}@rentilo.com`,
              firstName: 'Test',
              lastName: role.charAt(0).toUpperCase() + role.slice(1),
              role: role,
              isVerified: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            token: `mock-jwt-token-${role}`,
          },
        } as any
      }
      // If it doesn't match the mock, attempt the real API call
      return authApi.login(payload)
    },
    onSuccess: (response) => {
      const { user, token } = response.data
      setAuth(user as User, token)
      navigate(ROLE_HOME[user.role as UserRole] ?? ROUTES.AUTH.LOGIN)
    },
  })
}
