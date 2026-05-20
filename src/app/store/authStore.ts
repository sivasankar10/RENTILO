import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@modules/shared/types'
import type { UserRole } from '@modules/shared/constants/roles'

interface AuthState {
  user: User | null
  token: string | null
  role: UserRole | null
  isAuthenticated: boolean

  // Actions
  setAuth: (user: User, token: string) => void
  setUser: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        localStorage.setItem('rentilo_token', token)
        set({
          user,
          token,
          role: user.role,
          isAuthenticated: true,
        })
      },

      setUser: (user) =>
        set({
          user,
          role: user.role,
        }),

      logout: () => {
        localStorage.removeItem('rentilo_token')
        set({
          user: null,
          token: null,
          role: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: 'rentilo-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
