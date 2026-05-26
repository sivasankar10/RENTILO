import { useAuthStore } from '@app/store/authStore'
import { userHasRole } from '@shared/utils/normalizeUser'
import type { UserRole } from '@shared/constants/roles'

/**
 * Convenience hook for accessing auth state.
 * `role` is an alias for `activeRole` (current UI mode).
 */
export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)
  const activeRole = useAuthStore((s) => s.activeRole)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const setAuth = useAuthStore((s) => s.setAuth)
  const setUser = useAuthStore((s) => s.setUser)
  const setActiveRole = useAuthStore((s) => s.setActiveRole)
  const addRole = useAuthStore((s) => s.addRole)
  const logout = useAuthStore((s) => s.logout)

  const hasRole = (role: UserRole) => userHasRole(user, role)

  return {
    user,
    token,
    activeRole,
    /** @deprecated Use activeRole — kept for gradual migration */
    role: activeRole,
    roles: user?.roles ?? [],
    isAuthenticated,
    setAuth,
    setUser,
    setActiveRole,
    addRole,
    hasRole,
    logout,
  }
}
