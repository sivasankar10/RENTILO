import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Bell,
  Building2,
  Calendar,
  ChevronRight,
  CreditCard,
  Crown,
  FileText,
  HelpCircle,
  Home,
  LayoutGrid,
  LogOut,
  Megaphone,
  Menu,
  MessageSquare,
  Settings,
  Users,
  Wrench,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { ROLES } from '@shared/constants/roles'
import { useAuth } from '@shared/hooks/useAuth'
import { useMediaQuery } from '@shared/hooks/useMediaQuery'
import { cn } from '@shared/utils/cn'
import { RoleModeSwitcher } from '@shared/components/RoleModeSwitcher'
import { OWNER_MANAGED_PROPERTIES, useOwnerStore } from '@modules/owner/store/ownerStore'
import { UpgradeDialog } from '@modules/owner/components/UpgradeDialog'
import type { OwnerFeature } from '@modules/owner/config/features'

interface OwnerSidebarItem {
  label: string
  href: string
  icon: LucideIcon
  feature?: OwnerFeature // If set, requires this feature to access
}

// Base items available to all owners
const baseSidebarItems: OwnerSidebarItem[] = [
  { label: 'Overview', href: ROUTES.OWNER.DASHBOARD, icon: LayoutGrid },
  { label: 'Plans & Rules', href: ROUTES.OWNER.PLANS_RULES, icon: Settings },
  { label: 'Portfolio', href: ROUTES.OWNER.PORTFOLIO, icon: Building2 },
  { label: 'Maintenance', href: ROUTES.OWNER.MAINTENANCE, icon: Wrench },
  { label: 'Leases', href: ROUTES.OWNER.LEASES, icon: FileText },
  { label: 'Payments', href: ROUTES.OWNER.PAYMENTS, icon: CreditCard },
]

// Premium features (locked for FREE users)
const premiumSidebarItems: OwnerSidebarItem[] = [
  { label: 'Inquiries', href: `${ROUTES.OWNER.ROOT}/inquiries`, icon: Users, feature: 'inquiry_management' },
  { label: 'Viewings', href: `${ROUTES.OWNER.ROOT}/viewings`, icon: Calendar, feature: 'viewings_calendar' },
  { label: 'Brokers', href: `${ROUTES.OWNER.ROOT}/brokers`, icon: Users, feature: 'broker_management' },
  { label: 'Promotions', href: `${ROUTES.OWNER.ROOT}/promotions`, icon: Megaphone, feature: 'promoted_listings' },
  { label: 'Financials', href: `${ROUTES.OWNER.ROOT}/financials`, icon: CreditCard, feature: 'financial_reports' },
]

const mobileNavItems = [
  { label: 'Overview', href: ROUTES.OWNER.DASHBOARD, icon: LayoutGrid },
  { label: 'Portfolio', href: ROUTES.OWNER.PORTFOLIO, icon: Building2 },
  { label: 'Tickets', href: ROUTES.OWNER.MAINTENANCE, icon: Wrench },
  { label: 'Leases', href: ROUTES.OWNER.LEASES, icon: FileText },
  { label: 'Payments', href: ROUTES.OWNER.PAYMENTS, icon: CreditCard },
]

interface OwnerProfileMenuProps {
  open: boolean
  onClose: () => void
  displayName: string
  initials: string
  avatar?: string
  subscriptionPlan: string
  onLogout: () => void
}

function OwnerProfileMenu({
  open,
  onClose,
  displayName,
  initials,
  avatar,
  subscriptionPlan,
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
            <span className="mt-0.5 flex items-center gap-1 text-[11px] font-medium">
              {subscriptionPlan === 'PREMIUM' ? (
                <>
                  <Crown size={12} className="text-amber-500" />
                  <span className="text-amber-600">Premium</span>
                </>
              ) : (
                <span className="text-brand-outline">Free Plan</span>
              )}
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
  
  // Owner store
  const subscriptionPlan = useOwnerStore((state) => state.subscriptionPlan)
  const selectedPropertyId = useOwnerStore((state) => state.selectedPropertyId)
  const setSelectedProperty = useOwnerStore((state) => state.setSelectedProperty)
  const hasFeature = useOwnerStore((state) => state.hasFeature)
  const showUpgradePrompt = useOwnerStore((state) => state.showUpgradePrompt)
  
  const displayName = user ? `${user.firstName} ${user.lastName}` : 'Johnathan Smith'
  const initials = user ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}` : 'JS'
  const notificationsActive = pathname.startsWith(ROUTES.OWNER.NOTIFICATIONS)
  const messagesActive = pathname.startsWith(ROUTES.OWNER.MESSAGES)
  const profileActive = pathname.startsWith(ROUTES.OWNER.SETTINGS)
  // const selectedPropertyId = useOwnerStore((state) => state.selectedPropertyId)
  // const setSelectedProperty = useOwnerStore((state) => state.setSelectedProperty)
  const currentPropertyId = selectedPropertyId ?? OWNER_MANAGED_PROPERTIES[0]?.id ?? ''
  const canSwitchMode =
    Boolean(user?.roles.includes(ROLES.TENANT)) && Boolean(user?.roles.includes(ROLES.OWNER))
  
  // const planConfig = PLAN_CONFIG[subscriptionPlan]
  const isPremium = subscriptionPlan === 'PREMIUM'
  // const propertyLimitReached = !isPremium && planConfig.propertyLimit > 0 && planConfig.propertyLimit <= 1

  const handleLogout = () => {
    logout()
    navigate(ROUTES.AUTH.LOGIN)
  }

  const handleNavClick = (item: OwnerSidebarItem) => {
    if (item.feature && !hasFeature(item.feature)) {
      showUpgradePrompt(item.feature)
      return false
    }
    if (isMobile) setSidebarOpen(false)
    return true
  }

  return (
    <div className="min-h-screen bg-canvas-alt font-manrope text-text-primary">
      {/* Upgrade Dialog */}
      <UpgradeDialog />
      
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
                subscriptionPlan={subscriptionPlan}
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
              <p className="flex items-center gap-1 text-filter-label uppercase">
                {isPremium ? (
                  <>
                    <Crown size={12} className="text-amber-500" />
                    <span className="text-amber-600">Premium</span>
                  </>
                ) : (
                  <span className="text-text-muted">Free Plan</span>
                )}
              </p>
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

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          {/* Base Items */}
          <ul className="space-y-1">
            {baseSidebarItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <NavLink
                    to={item.href}
                    onClick={() => handleNavClick(item)}
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
          
          {/* Premium Section */}
          <div className="mt-6 pt-4 border-t border-outline">
            <p className="px-3 mb-2 text-filter-label uppercase text-text-muted flex items-center gap-1">
              <Crown size={12} className="text-amber-500" />
              Premium Features
            </p>
            <ul className="space-y-1">
              {premiumSidebarItems.map((item) => {
                const Icon = item.icon
                const isLocked = item.feature && !hasFeature(item.feature)
                
                if (isLocked) {
                  return (
                    <li key={item.label}>
                      <button
                        type="button"
                        onClick={() => item.feature && showUpgradePrompt(item.feature)}
                        className="flex w-full items-center gap-3 rounded-button px-3 py-3 text-body font-semibold text-slate-400 hover:bg-hover-light transition-colors"
                      >
                        <Icon size={18} />
                        <span>{item.label}</span>
                        <span className="ml-auto text-amber-500">🔒</span>
                      </button>
                    </li>
                  )
                }
                
                return (
                  <li key={item.href}>
                    <NavLink
                      to={item.href}
                      onClick={() => handleNavClick(item)}
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
          </div>
        </nav>

        {/* Upgrade Card - Only show for FREE users */}
        {!isPremium && (
          <div className="mx-4 mb-4 rounded-xl bg-gradient-to-br from-navy to-slate-800 p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-amber-400" />
              <span className="text-sm font-bold">Upgrade to Premium</span>
            </div>
            <p className="text-xs text-white/70 mb-3">
              Unlock analytics, inquiries, promotions & more
            </p>
            <button
              onClick={() => navigate(ROUTES.OWNER.PREMIUM_PAYMENT)}
              className="w-full py-2 rounded-lg bg-white text-navy text-xs font-bold hover:bg-white/90 transition-colors"
            >
              Upgrade Now
            </button>
          </div>
        )}

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
