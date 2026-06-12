import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@shared/hooks/useAuth'
import { MODE_SWITCHABLE_ROLES, getRoleFromPath, getRoleHome } from '@shared/constants/roleHome'
import { ROLE_LABELS, type UserRole } from '@shared/constants/roles'
import { cn } from '@shared/utils/cn'

const SWITCH_LABELS: Partial<Record<UserRole, string>> = {
  tenant: 'Tenant',
  owner: 'Owner',
}

interface RoleModeSwitcherProps {
  className?: string
  compact?: boolean
}

/**
 * Zomato-style mode toggle — only shown when user has 2+ switchable roles.
 */
export function RoleModeSwitcher({ className, compact }: RoleModeSwitcherProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user, activeRole, setActiveRole } = useAuth()

  if (!user) return null

  const switchable = MODE_SWITCHABLE_ROLES.filter((r) => user.roles.includes(r))
  if (switchable.length < 2) return null
  const routeRole = getRoleFromPath(pathname)
  const currentRole =
    routeRole && switchable.includes(routeRole) ? routeRole : activeRole

  const handleSwitch = (role: UserRole) => {
    if (role === currentRole) return
    setActiveRole(role)
    navigate(getRoleHome(role), { replace: true })
  }

  return (
    <div
      className={cn(
        'inline-flex p-1 rounded-full bg-brand-container-low border border-brand-outline-variant',
        className
      )}
      role="group"
      aria-label="Switch account mode"
    >
      {switchable.map((role) => {
        const isActive = currentRole === role
        const label = SWITCH_LABELS[role] ?? ROLE_LABELS[role]
        return (
          <button
            key={role}
            type="button"
            onClick={() => handleSwitch(role)}
            className={cn(
              'px-3 py-1.5 rounded-full border-0 font-body text-xs font-bold cursor-pointer transition-all',
              compact ? 'px-2.5 py-1 text-[11px]' : 'text-xs',
              isActive
                ? 'bg-brand text-white shadow-sm'
                : 'bg-transparent text-brand-on-surface-variant hover:text-brand'
            )}
            aria-pressed={isActive}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
