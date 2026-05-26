import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@modules/shared/types'
import type { UserRole } from '@modules/shared/constants/roles'
import { normalizeUser } from '@shared/utils/normalizeUser'
import { queryClient } from '@app/queryClient'

interface AuthState {
  user: User | null
  token: string | null
  /** Currently active UI mode (which route tree / layout) */
  activeRole: UserRole | null
  isAuthenticated: boolean

  setAuth: (user: User, token: string, activeRole?: UserRole) => void
  setUser: (user: User) => void
  setActiveRole: (role: UserRole) => void
  addRole: (role: UserRole) => void
  logout: () => void
}

function pickInitialActiveRole(user: User, preferred?: UserRole): UserRole {
  if (preferred && user.roles.includes(preferred)) return preferred
  if (user.primaryRole && user.roles.includes(user.primaryRole)) return user.primaryRole
  return user.roles[0]
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      activeRole: null,
      isAuthenticated: false,

      setAuth: (rawUser, token, preferredActiveRole) => {
        const user = normalizeUser(rawUser)
        const activeRole = pickInitialActiveRole(user, preferredActiveRole ?? get().activeRole ?? undefined)
        localStorage.setItem('rentilo_token', token)
        set({
          user,
          token,
          activeRole,
          isAuthenticated: true,
        })
      },

      setUser: (rawUser) => {
        const user = normalizeUser(rawUser)
        const { activeRole } = get()
        const nextActive =
          activeRole && user.roles.includes(activeRole)
            ? activeRole
            : pickInitialActiveRole(user)
        set({ user, activeRole: nextActive })
      },

      setActiveRole: (role) => {
        const { user } = get()
        if (!user?.roles.includes(role)) return
        set({ activeRole: role })
        void queryClient.invalidateQueries()
      },

      addRole: (role) => {
        const { user } = get()
        if (!user || user.roles.includes(role)) return
        const updated = normalizeUser({
          ...user,
          roles: [...user.roles, role],
        })
        set({ user: updated })
      },

      logout: () => {
        localStorage.removeItem('rentilo_token')
        void queryClient.clear()
        set({
          user: null,
          token: null,
          activeRole: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: 'rentilo-auth',
      version: 2,
      migrate: (persisted: unknown) => {
        const state = persisted as {
          user?: User & { role?: UserRole }
          token?: string
          activeRole?: UserRole | null
          role?: UserRole | null
          isAuthenticated?: boolean
        }
        if (state?.user) {
          const user = normalizeUser(state.user)
          const activeRole =
            state.activeRole && user.roles.includes(state.activeRole)
              ? state.activeRole
              : state.role && user.roles.includes(state.role)
                ? state.role
                : pickInitialActiveRole(user)
          return {
            user,
            token: state.token ?? null,
            activeRole,
            isAuthenticated: state.isAuthenticated ?? false,
          }
        }
        return persisted
      },
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        activeRole: state.activeRole,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
