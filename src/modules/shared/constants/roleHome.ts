import type { UserRole } from './roles'
import { ROUTES } from './routes'

/** Default landing route after login or role switch */
export const ROLE_HOME: Record<UserRole, string> = {
  tenant: ROUTES.TENANT.LISTINGS,
  owner: ROUTES.OWNER.DASHBOARD,
  broker: ROUTES.BROKER.DASHBOARD,
  enterprise: ROUTES.ENTERPRISE.DASHBOARD,
  admin: ROUTES.ADMIN.DASHBOARD,
}

/** Roles supported in the tenant/owner mode switcher (v1) */
export const MODE_SWITCHABLE_ROLES: UserRole[] = ['tenant', 'owner']

export function getRoleHome(role: UserRole): string {
  return ROLE_HOME[role] ?? ROUTES.AUTH.LOGIN
}

/** Derive route tree role from URL pathname */
export function getRoleFromPath(pathname: string): UserRole | null {
  const segment = pathname.split('/').filter(Boolean)[0]
  if (segment === 'tenant' || segment === 'owner' || segment === 'broker' || segment === 'enterprise' || segment === 'admin') {
    return segment as UserRole
  }
  return null
}
