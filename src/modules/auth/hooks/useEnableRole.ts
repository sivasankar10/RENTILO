import { useMutation } from '@tanstack/react-query'
import { authApi } from '../services/auth.api'
import { useAuth } from '@shared/hooks/useAuth'
import type { UserRole } from '@shared/constants/roles'
import type { User } from '@shared/types'
import { normalizeUser } from '@shared/utils/normalizeUser'

export function useEnableRole() {
  const { setUser } = useAuth()

  return useMutation({
    mutationFn: (role: UserRole) => authApi.enableRole({ role }),
    onSuccess: (response) => {
      setUser(normalizeUser(response.data as User))
    },
  })
}
