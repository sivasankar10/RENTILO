import { useAuthStore } from '@app/store/authStore'

/**
 * Convenience hook for accessing auth state.
 * Provides a cleaner API than directly using the Zustand store.
 */
export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)
  const role = useAuthStore((s) => s.role)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const setAuth = useAuthStore((s) => s.setAuth)
  const setUser = useAuthStore((s) => s.setUser)
  const logout = useAuthStore((s) => s.logout)

  return {
    user,
    token,
    role,
    isAuthenticated,
    setAuth,
    setUser,
    logout,
  }
}
