import type { User } from '@shared/types'
import type { UserRole } from '@shared/constants/roles'

type RawUser = Partial<User> & {
  role?: UserRole
  roles?: UserRole[]
}

/** Normalize API / legacy user payloads to multi-role User shape */
export function normalizeUser(raw: RawUser): User {
  const roles: UserRole[] =
    raw.roles && raw.roles.length > 0
      ? [...raw.roles]
      : raw.role
        ? [raw.role]
        : []

  const primaryRole = raw.primaryRole ?? roles[0]

  return {
    id: raw.id ?? '',
    email: raw.email ?? '',
    firstName: raw.firstName ?? '',
    lastName: raw.lastName ?? '',
    roles,
    primaryRole,
    avatar: raw.avatar,
    phone: raw.phone,
    isVerified: raw.isVerified ?? false,
    createdAt: raw.createdAt ?? new Date().toISOString(),
    updatedAt: raw.updatedAt ?? new Date().toISOString(),
  }
}

export function userHasRole(user: User | null, role: UserRole): boolean {
  return Boolean(user?.roles.includes(role))
}
