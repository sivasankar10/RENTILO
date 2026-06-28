import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@shared/hooks/useAuth'
import { ROUTES } from '@shared/constants/routes'
import { ROLES } from '@shared/constants/roles'
import { cn } from '@shared/utils/cn'
import { RoleModeSwitcher } from '@shared/components/RoleModeSwitcher'
import { MaterialIcon } from './MaterialIcon'
import { useOnboardingStore } from '@shared/store/onboardingStore'
import { useTenantId } from '../hooks/useTenantId'

const AVATAR_SRC =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBsjFwGI8TSSdoEXUZWAE-nRGmK8p1eH8KgYLjT3Urn8_obEczpwXsONy_TGRwKE0xPxoIiwJBviAzhbr8_8hIDA4l_kLNXdDbBX6-QfmRcjzG89x6vzPJXOX37ffQJu6xx0_zNwcREd9vf8PK0Du-IaTWhO6oVo0nqBbRArkk5eIc0SIYI174D3jXGPi3s-g82-4iFdrt9-Rhjwsej9Y7K0PTNiC4gdcsm5cL4dCFxk6wfXLf_ncUSgwvGRPdp_YbPZzioXRLYcnuV'

const MENU_ITEMS = [
  { id: 'payments', label: 'Payments', icon: 'payments', href: ROUTES.TENANT.PAYMENTS },
  { id: 'maintenance', label: 'Maintenance', icon: 'build', href: ROUTES.TENANT.MAINTENANCE },
  { id: 'documents', label: 'Documents', icon: 'description', href: ROUTES.TENANT.DOCUMENTS },
] as const

interface TenantProfileMenuProps {
  open: boolean
  onClose: () => void
}

function isProfileSectionActive(pathname: string, id: string): boolean {
  if (id === 'profile') return pathname.includes('/profile')
  if (id === 'payments') return pathname.includes('/payments')
  if (id === 'maintenance') return pathname.includes('/maintenance')
  if (id === 'documents') return pathname.includes('/documents')
  if (id === 'my-lease') return pathname.includes('/my-lease')
  return false
}

export function TenantProfileMenu({ open, onClose }: TenantProfileMenuProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const panelRef = useRef<HTMLDivElement>(null)
  const displayName = user ? `${user.firstName} ${user.lastName}`.trim() || 'Tenant account' : 'Tenant account'
  const profileMeta = user?.email ?? user?.phone ?? 'Manage your account'
  const canSwitchMode =
    Boolean(user?.roles.includes(ROLES.TENANT)) && Boolean(user?.roles.includes(ROLES.OWNER))
  const tenantId = useTenantId()
  const hasLease = useOnboardingStore((state) =>
    state.records.some((record) => record.tenant.id === tenantId && Boolean(record.lease))
  )
  const menuItems = hasLease
    ? [...MENU_ITEMS, { id: 'my-lease', label: 'My Lease', icon: 'key', href: ROUTES.TENANT.MY_LEASE }]
    : [...MENU_ITEMS]

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, onClose])

  if (!open) return null

  const handleNavigate = (href: string) => {
    navigate(href)
    onClose()
  }

  const handleLogout = () => {
    logout()
    navigate(ROUTES.AUTH.LOGIN)
    onClose()
  }

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 z-50 flex w-[300px] overflow-hidden rounded-xl border border-brand-outline-variant bg-brand-container-lowest shadow-modal"
      role="menu"
      aria-label="Profile menu"
    >
      <nav className="flex w-full flex-col py-2">
        <button
          type="button"
          role="menuitem"
          className={cn(
            'mx-2 mb-1 flex items-center gap-3 rounded-lg border-0 px-3 py-3 text-left transition-colors',
            pathname.includes('/profile')
              ? 'bg-brand-container-low text-brand'
              : 'bg-transparent text-brand hover:bg-brand-container-low'
          )}
          onClick={() => handleNavigate(ROUTES.TENANT.PROFILE)}
        >
          <img
            src={AVATAR_SRC}
            alt=""
            className="w-10 h-10 rounded-full object-cover border-2 border-brand-container-low"
          />
          <span className="min-w-0 flex-1">
            <span className="block truncate font-body text-sm font-bold text-brand">My Profile</span>
            <span className="mt-0.5 block truncate font-body text-xs font-semibold text-brand-on-surface-variant">
              {displayName}
            </span>
            <span className="mt-0.5 block truncate font-body text-[11px] font-medium text-brand-outline">
              {profileMeta}
            </span>
          </span>
          <MaterialIcon name="chevron_right" className="!text-xl shrink-0 text-brand-outline" />
        </button>

        <div className="h-px bg-brand-outline-variant my-1" />

        {canSwitchMode && (
          <>
            <div className="px-4 py-3 sm:hidden">
              <p className="mb-2 font-body text-[11px] font-bold uppercase tracking-wider text-brand-outline">
                Dashboard Mode
              </p>
              <RoleModeSwitcher compact />
            </div>

            <div className="h-px bg-brand-outline-variant my-1 sm:hidden" />
          </>
        )}

        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            role="menuitem"
            className={cn(
              'flex items-center gap-3 px-4 py-3 border-0 bg-transparent text-left font-body text-sm font-semibold tracking-wide cursor-pointer transition-colors',
              isProfileSectionActive(pathname, item.id)
                ? 'bg-brand-container-low text-brand'
                : 'text-brand-outline hover:bg-brand-container-low hover:text-brand'
            )}
            onClick={() => handleNavigate(item.href)}
          >
            <MaterialIcon name={item.icon} className="!text-xl shrink-0" />
            {item.label}
          </button>
        ))}

        <div className="h-px bg-brand-outline-variant my-1" />

        <button
          type="button"
          role="menuitem"
          className="flex items-center gap-3 px-4 py-3 border-0 bg-transparent text-left font-body text-sm font-semibold tracking-wide text-brand-outline cursor-pointer transition-colors hover:bg-brand-container-low hover:text-brand"
        >
          <MaterialIcon name="help" className="!text-xl shrink-0" />
          Help Center
        </button>
        <button
          type="button"
          role="menuitem"
          className="flex items-center gap-3 px-4 py-3 border-0 bg-transparent text-left font-body text-sm font-semibold tracking-wide text-red-600 cursor-pointer transition-colors hover:bg-red-50 hover:text-red-700"
          onClick={handleLogout}
        >
          <MaterialIcon name="logout" className="!text-xl shrink-0" />
          Log out
        </button>
      </nav>
    </div>
  )
}

export function isProfileSectionPath(pathname: string): boolean {
  return (
    pathname.includes('/profile') ||
    pathname.includes('/payments') ||
    pathname.includes('/maintenance') ||
    pathname.includes('/documents') ||
    pathname.includes('/my-lease')
  )
}


