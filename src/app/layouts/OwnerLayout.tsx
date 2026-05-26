import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  Bell,
  Building2,
  CreditCard,
  FileText,
  HelpCircle,
  Home,
  LayoutGrid,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  X,
  type LucideIcon,
} from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { useAuth } from '@shared/hooks/useAuth'
import { useMediaQuery } from '@shared/hooks/useMediaQuery'
import { cn } from '@shared/utils/cn'

const topNavItems = [
  { label: 'Dashboard', href: ROUTES.OWNER.DASHBOARD },
  { label: 'Properties', href: ROUTES.OWNER.PROPERTIES },
  { label: 'Analytics', href: ROUTES.OWNER.ANALYTICS },
]

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
  { label: 'Leases', href: ROUTES.OWNER.TENANTS, icon: FileText },
  { label: 'Finances', href: ROUTES.OWNER.ANALYTICS, icon: CreditCard, disabled: true },
  { label: 'Settings', href: ROUTES.OWNER.SETTINGS, icon: Settings },
]

const mobileNavItems = [
  { label: 'Overview', href: ROUTES.OWNER.DASHBOARD, icon: LayoutGrid },
  { label: 'Portfolio', href: ROUTES.OWNER.PORTFOLIO, icon: Building2 },
  { label: 'Leases', href: ROUTES.OWNER.TENANTS, icon: FileText },
  { label: 'Analytics', href: ROUTES.OWNER.ANALYTICS, icon: BarChart3 },
]

export function OwnerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width: 1024px)')
  const displayName = user ? `${user.firstName} ${user.lastName}` : 'Johnathan Smith'
  const initials = user ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}` : 'JS'

  const handleLogout = () => {
    logout()
    navigate(ROUTES.AUTH.LOGIN)
  }

  return (
    <div className="min-h-screen bg-canvas-alt font-manrope text-text-primary">
      <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-primary bg-navy text-text-inverse shadow-sm">
        <div className="flex h-full items-center gap-6 px-6">
          <button
            type="button"
            className="rounded-button p-2 text-slate-200 transition-colors duration-200 hover:bg-white/10 lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>

          <NavLink to={ROUTES.OWNER.DASHBOARD} className="flex items-center gap-2">
            <span className="text-body-lg font-extrabold tracking-tight">Rentillo</span>
          </NavLink>

          <nav className="hidden h-full items-center gap-8 md:flex">
            {topNavItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex h-full items-center border-b-2 px-1 text-label font-medium transition-colors duration-200',
                    isActive
                      ? 'border-primary text-white'
                      : 'border-transparent text-slate-300 hover:text-white'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <NavLink
              to={ROUTES.OWNER.PLANS_RULES}
              className="hidden rounded-button bg-primary px-4 py-2 text-label font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-700 hover:shadow-md sm:inline-flex"
            >
              Upgrade Plan
            </NavLink>
            <NavLink
              to={ROUTES.OWNER.NOTIFICATIONS}
              className="rounded-button p-2 text-slate-300 transition-colors duration-200 hover:bg-white/10 hover:text-white"
              aria-label="Notifications"
            >
              <Bell size={18} />
            </NavLink>
            <NavLink
              to={ROUTES.OWNER.MESSAGES}
              className="rounded-button p-2 text-slate-300 transition-colors duration-200 hover:bg-white/10 hover:text-white"
              aria-label="Messages"
            >
              <MessageSquare size={18} />
            </NavLink>
            <NavLink
              to={ROUTES.OWNER.SETTINGS}
              className="rounded-button p-2 text-slate-300 transition-colors duration-200 hover:bg-white/10 hover:text-white"
              aria-label="Settings"
            >
              <Settings size={18} />
            </NavLink>
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-primary-100 text-label font-bold text-primary">
              {user?.avatar ? (
                <img src={user.avatar} alt={displayName} className="h-full w-full object-cover" />
              ) : (
                initials
              )}
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
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-button bg-navy text-white">
              <Home size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-body font-semibold text-text-primary">Main Portfolio</p>
              <p className="text-filter-label uppercase text-text-muted">Free Plan</p>
            </div>
          </div>
          <select className="mt-4 w-full rounded-input border border-outline bg-white px-3 py-2 text-label font-medium text-text-primary outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary-100">
            <option>Switch Property</option>
            <option>Modern Loft in Downtown</option>
            <option>Parkview Residences</option>
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

        <div className="space-y-2 border-t border-outline p-4">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-button px-3 py-3 text-body font-medium text-text-muted transition-colors duration-200 hover:bg-hover-light hover:text-text-primary"
          >
            <HelpCircle size={18} />
            <span>Help Center</span>
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-button px-3 py-3 text-body font-medium text-text-muted transition-colors duration-200 hover:bg-hover-light hover:text-status-error"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

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

      <nav className="fixed inset-x-0 bottom-0 z-30 grid h-16-mobile grid-cols-4 border-t border-outline bg-white shadow-surface lg:hidden">
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
