import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@shared/hooks/useAuth'
import { getRoleHome } from '@shared/constants/roleHome'
import type { UserRole } from '@shared/constants/roles'
import type { User } from '@shared/types'
import { normalizeUser } from '@shared/utils/normalizeUser'
/**
 * @deprecated Use useVerifyOtp — kept for internal/dev compatibility
 */
export function useLogin() {
  const { setAuth } = useAuth()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const validRoles: UserRole[] = ['tenant', 'owner', 'broker', 'enterprise']
      if (validRoles.includes(payload.email as UserRole) && payload.password === '123') {
        const role = payload.email as UserRole
        const roles: UserRole[] =
          role === 'tenant' ? ['tenant', 'owner'] : [role]
        return {
          data: {
            user: {
              id: `mock-${role}-id`,
              email: `${role}@rentilo.com`,
              firstName: 'Test',
              lastName: role.charAt(0).toUpperCase() + role.slice(1),
              roles,
              primaryRole: role,
              isVerified: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            token: `mock-jwt-token-${role}`,
          },
        }
      }
      throw new Error('Use phone OTP login. Demo phones: 9000000001–9000000005, OTP 123456')
    },
    onSuccess: (response) => {
      const { user, token } = response.data
      const normalized = normalizeUser(user as User)
      setAuth(normalized, token)
      const homeRole = normalized.primaryRole ?? normalized.roles[0]
      navigate(getRoleHome(homeRole as UserRole))
    },
  })
}
