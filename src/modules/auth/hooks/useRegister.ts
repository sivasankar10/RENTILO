import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../services/auth.api'
import { useAuth } from '@shared/hooks/useAuth'
import type { RegisterPayload } from '../types'
import type { User } from '@shared/types'

export function useRegister() {
  const { setAuth } = useAuth()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (response) => {
      const { user, token } = response.data
      setAuth(user as User, token)
      navigate(`/${user.role}/dashboard`)
    },
  })
}
