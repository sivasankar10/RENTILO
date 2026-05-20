/** User roles in the Rentilo platform */
export const ROLES = {
  TENANT: 'tenant',
  OWNER: 'owner',
  BROKER: 'broker',
  ENTERPRISE: 'enterprise',
} as const

export type UserRole = (typeof ROLES)[keyof typeof ROLES]

/** Role display labels */
export const ROLE_LABELS: Record<UserRole, string> = {
  [ROLES.TENANT]: 'Tenant',
  [ROLES.OWNER]: 'Property Owner',
  [ROLES.BROKER]: 'Broker',
  [ROLES.ENTERPRISE]: 'Enterprise',
}
