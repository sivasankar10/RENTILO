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

export interface AuthResponse {
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    role: string
    avatar?: string
    phone?: string
    isVerified: boolean
    createdAt: string
    updatedAt: string
  }
  token: string
}
