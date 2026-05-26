import { useMutation } from '@tanstack/react-query'
import { authApi } from '../services/auth.api'
import type { SendOtpPayload } from '../types'

export function useSendOtp() {
  return useMutation({
    mutationFn: (payload: SendOtpPayload) => authApi.sendOtp(payload),
  })
}
