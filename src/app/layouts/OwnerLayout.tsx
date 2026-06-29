import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Bell,
  Building2,
  ChevronRight,
  CreditCard,
  FileText,
  HelpCircle,
  Home,
  LayoutGrid,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Wrench,
  X,
  type LucideIcon,
} from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { ROLES } from '@shared/constants/roles'
import { useAuth } from '@shared/hooks/useAuth'
import { useMediaQuery } from '@shared/hooks/useMediaQuery'
import { cn } from '@shared/utils/cn'
import { RoleModeSwitcher } from '@shared/components/RoleModeSwitcher'
import { OWNER_MANAGED_PROPERTIES, useOwnerStore } from '@modules/owner/store/ownerStore'

interface OwnerSidebarItem {
  label: string
  href: string
  icon: LucideIcon
  disabled?: boolean
  actionOnly?: boolean
}

const sidebarItems: OwnerSidebarItem[] = [
  { label: 'Overview', href: ROUTES.OWNER.DASHBOARD, icon: LayoutGrid },
  { label: 'Owner Plans & Rules', href: ROUTES.OWNER.PLANS_RULES, icon: Settings },
  { label: 'Portfolio', href: ROUTES.OWNER.PORTFOLIO, icon: Building2 },
  { label: 'Maintenance Tickets', href: ROUTES.OWNER.MAINTENANCE, icon: Wrench },
  { label: 'Payments', href: ROUTES.OWNER.PAYMENTS, icon: CreditCard },
  { label: 'Leases', href: ROUTES.OWNER.LEASES, icon: FileText },
  { label: 'Payments', href: ROUTES.OWNER.PAYMENTS, icon: CreditCard },
]

const mobileNavItems = [
  { label: 'Overview', href: ROUTES.OWNER.DASHBOARD, icon: LayoutGrid },
  { label: 'Portfolio', href: ROUTES.OWNER.PORTFOLIO, icon: Building2 },
  { label: 'Tickets', href: ROUTES.OWNER.MAINTENANCE, icon: Wrench },
  { label: 'Payments', href: ROUTES.OWNER.PAYMENTS, icon: CreditCard },
  { label: 'Leases', href: ROUTES.OWNER.LEASES, icon: FileText },
  { label: 'Payments', href: ROUTES.OWNER.PAYMENTS, icon: CreditCard },
]

interface OwnerProfileMenuProps {
  open: boolean
  onClose: () => void
  displayName: string
  initials: string
  avatar?: string
  profileMeta: string
  onLogout: () => void
}

function OwnerProfileMenu({
  open,
  onClose,
  displayName,
  initials,
  avatar,
  profileMeta,
  onLogout,
}: OwnerProfileMenuProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
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

  const settingsActive = pathname.startsWith(ROUTES.OWNER.SETTINGS)

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full z-50 mt-2 flex w-[300px] overflow-hidden rounded-xl border border-brand-outline-variant bg-brand-container-lowest shadow-modal"
      role="menu"
      aria-label="Owner profile menu"
    >
      <nav className="flex w-full flex-col py-2">
        <button
          type="button"
          role="menuitem"
          className={cn(
            'mx-2 mb-1 flex items-center gap-3 rounded-lg border-0 px-3 py-3 text-left transition-colors',
            settingsActive
              ? 'bg-brand-container-low text-brand'
              : 'bg-transparent text-brand hover:bg-brand-container-low'
          )}
          onClick={() => handleNavigate(ROUTES.OWNER.SETTINGS)}
        >
          {avatar ? (
            <img src={avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary">
              {initials}
            </span>
          )}
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold text-brand">My Profile</span>
            <span className="mt-0.5 block truncate text-xs font-semibold text-brand-on-surface-variant">
              {displayName}
            </span>
            <span className="mt-0.5 block truncate text-[11px] font-medium text-brand-outline">
              {profileMeta}
            </span>
          </span>
          <ChevronRight size={18} className="shrink-0 text-brand-outline" />
        </button>

        <div className="my-1 h-px bg-brand-outline-variant" />

        <button
          type="button"
          role="menuitem"
          className="flex items-center gap-3 border-0 bg-transparent px-4 py-3 text-left text-sm font-semibold tracking-wide text-brand-outline transition-colors hover:bg-brand-container-low hover:text-brand"
        >
          <HelpCircle size={18} className="shrink-0" />
          Help Center
        </button>
        <button
          type="button"
          role="menuitem"
          onClick={onLogout}
          className="flex items-center gap-3 border-0 bg-transparent px-4 py-3 text-left text-sm font-semibold tracking-wide text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
        >
          <LogOut size={18} className="shrink-0" />
          Log out
        </button>
      </nav>
    </div>
  )
}

export function OwnerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isMobile = useMediaQuery('(max-width: 1024px)')
  const displayName = user ? `${user.firstName} ${user.lastName}` : 'Johnathan Smith'
  const initials = user ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}` : 'JS'
  const profileMeta = user?.email ?? user?.phone ?? 'Manage owner profile'
  const notificationsActive = pathname.startsWith(ROUTES.OWNER.NOTIFICATIONS)
  const messagesActive = pathname.startsWith(ROUTES.OWNER.MESSAGES)
  const profileActive = pathname.startsWith(ROUTES.OWNER.SETTINGS)
  const selectedPropertyId = useOwnerStore((state) => state.selectedPropertyId)
  const setSelectedProperty = useOwnerStore((state) => state.setSelectedProperty)
  const currentPropertyId = selectedPropertyId ?? OWNER_MANAGED_PROPERTIES[0]?.id ?? ''
  const canSwitchMode =
    Boolean(user?.roles.includes(ROLES.TENANT)) && Boolean(user?.roles.includes(ROLES.OWNER))

  const handleLogout = () => {
    logout()
    navigate(ROUTES.AUTH.LOGIN)
  }

  return (
    <div className="min-h-screen bg-canvas-alt font-manrope text-text-primary">
      <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-brand-container-low bg-brand-surface text-brand shadow-sm">
        <div className="mx-auto flex h-full w-full items-center gap-6 px-6">
          <button
            type="button"
            className="rounded-button p-2 text-brand transition-colors duration-200 hover:bg-brand-container-low lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>

          <NavLink
            to={ROUTES.OWNER.DASHBOARD}
            className="flex items-center gap-2 no-underline hover:opacity-80"
            aria-label="Go to owner dashboard"
          >
            <span className="font-display text-2xl font-black tracking-tight text-brand">RENTILO</span>
          </NavLink>

          <div className="ml-auto flex items-center gap-3">
            <RoleModeSwitcher className="hidden sm:inline-flex" />
            <button
              type="button"
              onClick={() => navigate(ROUTES.OWNER.REGISTER_PROPERTY)}
              title="Post a new property"
              className="hidden rounded-button bg-brand px-4 py-2 text-label font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-90 sm:inline-flex"
            >
              Post New Property
            </button>
            <NavLink
              to={ROUTES.OWNER.NOTIFICATIONS}
              className={cn(
                'rounded-button p-2 text-brand transition-colors duration-200 hover:bg-brand-container-low',
                notificationsActive && 'bg-brand-container-low'
              )}
              aria-label="Notifications"
              aria-current={notificationsActive ? 'page' : undefined}
            >
              <Bell size={18} />
            </NavLink>
            <NavLink
              to={ROUTES.OWNER.MESSAGES}
              className={cn(
                'rounded-button p-2 text-brand transition-colors duration-200 hover:bg-brand-container-low',
                messagesActive && 'bg-brand-container-low'
              )}
              aria-label="Messages"
              aria-current={messagesActive ? 'page' : undefined}
            >
              <MessageSquare size={18} />
            </NavLink>
            <div className="relative">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-0 bg-primary-100 p-0 text-sm font-bold text-primary transition-shadow"
                onClick={() => setProfileMenuOpen((open) => !open)}
                aria-label="Account menu"
                aria-expanded={profileMenuOpen}
                aria-haspopup="menu"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={displayName}
                    className={cn(
                      'h-full w-full rounded-full object-cover border-2 border-brand-container-low',
                      (profileActive || profileMenuOpen) &&
                        'border-brand shadow-[0_0_0_2px] shadow-brand-verified'
                    )}
                  />
                ) : (
                  <span
                    className={cn(
                      'flex h-full w-full items-center justify-center rounded-full border-2 border-brand-container-low',
                      (profileActive || profileMenuOpen) &&
                        'border-brand shadow-[0_0_0_2px] shadow-brand-verified'
                    )}
                  >
                    {initials}
                  </span>
                )}
              </button>
              <OwnerProfileMenu
                open={profileMenuOpen}
                onClose={() => setProfileMenuOpen(false)}
                displayName={displayName}
                initials={initials}
                avatar={user?.avatar}
                profileMeta={profileMeta}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </div>
      </header>

      {isMobile && sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-navy/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}

      <aside
        className={cn(
          'fixed bottom-0 left-0 top-16 z-50 flex w-70 flex-col border-r border-outline bg-surface transition-transform duration-200 ease-in-out',
          isMobile && !sidebarOpen && 'hidden',
          isMobile && sidebarOpen && 'translate-x-0',
          !isMobile && 'translate-x-0'
        )}
      >
        <div className="border-b border-outline px-6 py-6">
          {canSwitchMode && <RoleModeSwitcher className="mb-4 sm:hidden" />}
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-button bg-navy text-white">
              <Home size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-body font-semibold text-text-primary">Main Portfolio</p>
              <p className="text-filter-label uppercase text-text-muted">Free Plan</p>
            </div>
          </div>
          <select
            value={currentPropertyId}
            onChange={(event) => setSelectedProperty(event.target.value)}
            className="mt-4 w-full rounded-input border border-outline bg-white px-3 py-2 text-label font-medium text-text-primary outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary-100"
          >
            {OWNER_MANAGED_PROPERTIES.map((property) => (
              <option key={property.id} value={property.id}>
                {property.name}
              </option>
            ))}
          </select>
        </div>

        <nav className="flex-1 px-4 py-8">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              if (item.disabled || item.actionOnly) {
                return (
                  <li key={item.label}>
                    <div
                      className={cn(
                        'flex items-center gap-3 rounded-button px-3 py-3',
                        item.disabled
                          ? 'text-slate-300'
                          : 'text-text-muted transition-colors duration-200 hover:bg-hover-light hover:text-text-primary'
                      )}
                    >
                      <Icon size={18} />
                      <span className="text-body font-semibold">{item.label}</span>
                      {item.disabled && (
                        <span className="ml-auto text-slate-300">
                          <CreditCard size={12} />
                        </span>
                      )}
                    </div>
                  </li>
                )
              }

              return (
                <li key={item.href}>
                  <NavLink
                    to={item.href}
                    onClick={() => isMobile && setSidebarOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-button border-r-3 px-3 py-3 text-body font-semibold transition-all duration-200',
                        isActive
                          ? 'border-primary bg-hover-light text-text-primary'
                          : 'border-transparent text-text-muted hover:bg-hover-light hover:text-text-primary'
                      )
                    }
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        {isMobile && (
          <button
            type="button"
            className="absolute right-4 top-4 rounded-button p-2 text-text-muted transition-colors duration-200 hover:bg-hover-light"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        )}
      </aside>

      <main className="min-h-screen pt-16 lg:pl-70">
        <div className="pb-20 lg:pb-0">
          <Outlet />
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid h-16-mobile grid-cols-5 border-t border-outline bg-white shadow-surface lg:hidden">
        {mobileNavItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center gap-1 text-filter-label uppercase transition-colors duration-200',
                  isActive ? 'text-primary' : 'text-text-muted'
                )
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}
