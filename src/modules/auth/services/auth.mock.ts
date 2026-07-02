import type { UserRole } from '@shared/constants/roles'
import type { AuthUserPayload, VerifyOtpResponse } from '../types'
import { PROTOTYPE_OTP, prototypeUsers } from '@shared/data/prototypeSeed'

const MOCK_OTP = '123456'

/** Subscription plan type for owner accounts */
type SubscriptionPlan = 'FREE' | 'PREMIUM'

/** Dev mock: phone (digits only) → account definition */
const MOCK_ACCOUNTS: Record<
  string,
  { roles: UserRole[]; firstName: string; lastName: string; email: string; subscriptionPlan?: SubscriptionPlan }
> = {
  '9000000001': { roles: ['tenant'], firstName: 'Test', lastName: 'Tenant', email: 'tenant@rentilo.com' },
  '9000000002': { roles: ['owner'], firstName: 'Test', lastName: 'Owner', email: 'owner@rentilo.com', subscriptionPlan: 'FREE' },
  '9000000003': {
    roles: ['tenant', 'owner'],
    firstName: 'Test',
    lastName: 'Dual',
    email: 'dual@rentilo.com',
    subscriptionPlan: 'FREE',
  },
  '9000000004': { roles: ['broker'], firstName: 'Test', lastName: 'Broker', email: 'broker@rentilo.com' },
  '9000000005': {
    roles: ['enterprise'],
    firstName: 'Test',
    lastName: 'Enterprise',
    email: 'enterprise@rentilo.com',
  },
  '9000000006': {
    roles: ['admin'],
    firstName: 'Test',
    lastName: 'Admin',
    email: 'admin@rentilo.com',
  },
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

  const account = MOCK_ACCOUNTS.get(normalized)

  if (!account) {
    return {
      user: null,
      token: `mock-pending-${normalized}`,
      isNewUser: true,
    }
  }

  const user: AuthUserPayload = {
    id: account.id,
    email: account.email,
    firstName: account.firstName,
    lastName: account.lastName,
    roles: account.roles,
    primaryRole: account.primaryRole,
    avatar: account.avatar,
    phone: normalized,
    isVerified: true,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  }

  return {
    user,
    token: `mock-jwt-${normalized}`,
    isNewUser: false,
    subscriptionPlan: account.subscriptionPlan,
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
  'Demo OTP: 123456. Tenant1 9000001001, Tenant2 9000001002, MultiPropertyOwner 9000002001, Owner1 9000002002, Owner2 9000002003, Broker1 9000003001, Broker2 9000003002, Admin1 9000009001, TenantOwner 9000004001.'
