import api from '@shared/services/api'
import type {
  LoginPayload,
  RegisterPayload,
  ForgotPasswordPayload,
  AuthResponse,
} from '../types'

/** Authentication API service */
export const authApi = {
  login: (payload: LoginPayload) =>
    api.post<AuthResponse>('/auth/login', payload),

  register: (payload: RegisterPayload) =>
    api.post<AuthResponse>('/auth/register', payload),

  forgotPassword: (payload: ForgotPasswordPayload) =>
    api.post<{ message: string }>('/auth/forgot-password', payload),

  me: () => api.get<AuthResponse['user']>('/auth/me'),

  logout: () => api.post('/auth/logout'),
}
