import type { UserRole } from '@shared/constants/roles'
import type { AuthUserPayload, VerifyOtpResponse } from '../types'
import { PROTOTYPE_OTP, prototypeUsers } from '@shared/data/prototypeSeed'

/** Subscription plan type for owner accounts */
type SubscriptionPlan = 'FREE' | 'PREMIUM'

/** Subscription plans keyed by userId — matches auth.mock MOCK_ACCOUNTS */
const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  'user-owner-multi': 'FREE',
  'user-owner-1': 'FREE',
  'user-owner-2': 'FREE',
  'user-tenant-owner': 'FREE',
}

// Override Victoria Ashworth (user-owner-7 doesn't exist in seed,
// but 9000000007 was the old premium test account — keep for compatibility)
const EXTRA_ACCOUNTS: Record<string, {
  roles: UserRole[]
  firstName: string
  lastName: string
  email: string
  subscriptionPlan?: SubscriptionPlan
}> = {
  '9000000007': {
    roles: ['owner'],
    firstName: 'Victoria',
    lastName: 'Ashworth',
    email: 'victoria@ashworthproperties.com',
    subscriptionPlan: 'PREMIUM',
  },
}

const otpSessions = new Map<string, { phone: string; createdAt: number }>()

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '').slice(-10)
}

export function mockSendOtp(phone: string): { otpSessionId: string } {
  const normalized = normalizePhone(phone)
  const otpSessionId = `mock-session-${normalized}-${Date.now()}`
  otpSessions.set(otpSessionId, { phone: normalized, createdAt: Date.now() })
  return { otpSessionId }
}

export function mockVerifyOtp(
  phone: string,
  otp: string,
  otpSessionId: string
): VerifyOtpResponse & { subscriptionPlan?: SubscriptionPlan } {
  const normalized = normalizePhone(phone)
  const session = otpSessions.get(otpSessionId)

  if (!session || session.phone !== normalized) {
    throw new Error('Invalid or expired OTP session')
  }

  if (otp !== PROTOTYPE_OTP) {
    throw new Error('Invalid OTP. Use 123456 for demo.')
  }

  // First look up in the prototype seed users (canonical source of truth)
  const seedUser = prototypeUsers.find((u) => normalizePhone(u.phone) === normalized)
  if (seedUser) {
    const subscriptionPlan = SUBSCRIPTION_PLANS[seedUser.id]
    const user: AuthUserPayload = {
      id: seedUser.id,
      email: seedUser.email,
      firstName: seedUser.firstName,
      lastName: seedUser.lastName,
      roles: seedUser.roles,
      primaryRole: seedUser.primaryRole,
      avatar: seedUser.avatar,
      phone: normalized,
      isVerified: seedUser.kycStatus === 'Verified',
      createdAt: seedUser.createdAt,
      updatedAt: seedUser.updatedAt,
    }
    return {
      user,
      token: `mock-jwt-${normalized}`,
      isNewUser: false,
      subscriptionPlan,
    }
  }

  // Fallback: extra accounts not in the seed (e.g. legacy premium test account)
  const extra = EXTRA_ACCOUNTS[normalized]
  if (extra) {
    const now = new Date().toISOString()
    const user: AuthUserPayload = {
      id: `mock-${normalized}`,
      email: extra.email,
      firstName: extra.firstName,
      lastName: extra.lastName,
      roles: extra.roles,
      primaryRole: extra.roles[0],
      phone: normalized,
      isVerified: true,
      createdAt: now,
      updatedAt: now,
    }
    return {
      user,
      token: `mock-jwt-${normalized}`,
      isNewUser: false,
      subscriptionPlan: extra.subscriptionPlan,
    }
  }

  // Unknown phone
  return {
    user: null,
    token: `mock-pending-${normalized}`,
    isNewUser: false,
  }
}

export function mockCompleteRegistration(
  phone: string,
  role: UserRole,
  firstName: string,
  lastName: string,
  email?: string
): AuthUserPayload {
  const normalized = normalizePhone(phone)
  return {
    id: `mock-${normalized}`,
    email: email ?? `${normalized}@rentilo.com`,
    firstName,
    lastName,
    roles: [role],
    primaryRole: role,
    phone: normalized,
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export function mockEnableRole(
  user: AuthUserPayload,
  role: UserRole
): AuthUserPayload {
  const roles = user.roles ?? (user.role ? [user.role] : [])
  if (roles.includes(role)) return { ...user, roles }
  return {
    ...user,
    roles: [...roles, role],
    updatedAt: new Date().toISOString(),
  }
}

export const AUTH_MOCK_HINT =
  'Demo OTP: 123456 · Tenant1 9000001001 · Tenant2 9000001002 · MultiOwner 9000002001 · Owner1 9000002002 · Owner2 9000002003 · Broker1 9000003001 · Broker2 9000003002 · Admin1 9000009001 · TenantOwner 9000004001 · Enterprise 9000005001'
