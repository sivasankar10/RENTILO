import type { UserRole } from '@shared/constants/roles'

export interface SendOtpPayload {
  phone: string
}

export interface SendOtpResponse {
  otpSessionId: string
  message?: string
}

export interface VerifyOtpPayload {
  phone: string
  otp: string
  otpSessionId: string
}

export interface AuthUserPayload {
  id: string
  email: string
  firstName: string
  lastName: string
  roles?: UserRole[]
  role?: UserRole
  primaryRole?: UserRole
  avatar?: string
  phone?: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface VerifyOtpResponse {
  user: AuthUserPayload | null
  token: string
  isNewUser: boolean
}

export interface CompleteRegistrationPayload {
  phone: string
  otpSessionId: string
  firstName: string
  lastName: string
  role: UserRole
  email?: string
}

export interface EnableRolePayload {
  role: UserRole
}

export interface AuthResponse {
  user: AuthUserPayload
  token: string
}

/** @deprecated Legacy email login — kept for API compatibility */
export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  password: string
  role: string
  phone?: string
}

export interface ForgotPasswordPayload {
  email: string
}
