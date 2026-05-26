import api from '@shared/services/api'
import { useAuthStore } from '@app/store/authStore'
import {
  mockCompleteRegistration,
  mockEnableRole,
  mockSendOtp,
  mockVerifyOtp,
  normalizePhone,
} from './auth.mock'
import { normalizeUser } from '@shared/utils/normalizeUser'
import type {
  SendOtpPayload,
  SendOtpResponse,
  VerifyOtpPayload,
  VerifyOtpResponse,
  CompleteRegistrationPayload,
  EnableRolePayload,
  AuthResponse,
  AuthUserPayload,
  RegisterPayload,
  ForgotPasswordPayload,
} from '../types'

const USE_MOCK = true

/** Authentication API service */
export const authApi = {
  sendOtp: async (payload: SendOtpPayload): Promise<{ data: SendOtpResponse }> => {
    if (USE_MOCK) {
      const { otpSessionId } = mockSendOtp(payload.phone)
      return { data: { otpSessionId, message: 'OTP sent' } }
    }
    return api.post<SendOtpResponse>('/auth/otp/send', payload)
  },

  verifyOtp: async (payload: VerifyOtpPayload): Promise<{ data: VerifyOtpResponse }> => {
    if (USE_MOCK) {
      const data = mockVerifyOtp(payload.phone, payload.otp, payload.otpSessionId)
      return { data }
    }
    return api.post<VerifyOtpResponse>('/auth/otp/verify', payload)
  },

  completeRegistration: async (
    payload: CompleteRegistrationPayload
  ): Promise<{ data: AuthResponse }> => {
    if (USE_MOCK) {
      const user = mockCompleteRegistration(
        payload.phone,
        payload.role,
        payload.firstName,
        payload.lastName,
        payload.email
      )
      return {
        data: {
          user,
          token: `mock-jwt-${normalizePhone(payload.phone)}`,
        },
      }
    }
    return api.post<AuthResponse>('/auth/complete-registration', payload)
  },

  enableRole: async (payload: EnableRolePayload): Promise<{ data: AuthUserPayload }> => {
    if (USE_MOCK) {
      const current = useAuthStore.getState().user
      if (!current) throw new Error('Not authenticated')
      const user = mockEnableRole(normalizeUser(current) as AuthUserPayload, payload.role)
      return { data: user }
    }
    return api.post<AuthUserPayload>('/users/me/roles', payload)
  },

  register: (payload: RegisterPayload) =>
    api.post<AuthResponse>('/auth/register', payload),

  forgotPassword: (payload: ForgotPasswordPayload) =>
    api.post<{ message: string }>('/auth/forgot-password', payload),

  me: () => api.get<AuthResponse['user']>('/auth/me'),

  logout: () => api.post('/auth/logout'),
}
