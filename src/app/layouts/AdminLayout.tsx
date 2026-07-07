import { useState } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  Bell,
  CircleHelp,
  ClipboardCheck,
  CreditCard,
  FileText,
  LayoutGrid,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Users,
  UserCog,
  Wrench,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useMediaQuery } from '@shared/hooks/useMediaQuery'
import { ROUTES } from '@shared/constants/routes'
import { cn } from '@shared/utils/cn'
import { useAuthStore } from '@app/store/authStore'
import { ToastContainer } from '@modules/admin/components/Toast'
import { ConfirmDialog } from '@modules/admin/components/ConfirmDialog'

type AdminNavItem = {
  label: string
  href: string
  icon: LucideIcon
  isActive?: (pathname: string) => boolean
}

const mainNavItems: AdminNavItem[] = [
  {
    label: 'Dashboard & Reporting',
    href: ROUTES.ADMIN.DASHBOARD,
    icon: BarChart3,
    isActive: (pathname) =>
      pathname === ROUTES.ADMIN.ROOT || pathname === ROUTES.ADMIN.DASHBOARD,
  },
  { label: 'Broker Management', href: ROUTES.ADMIN.BROKER_MANAGEMENT, icon: UserCog },
  { label: 'Listing Management', href: ROUTES.ADMIN.LISTING_MANAGEMENT, icon: FileText },
  { label: 'Maintenance Tickets', href: ROUTES.ADMIN.MAINTENANCE_TICKETS, icon: Wrench },
  { label: 'User Management', href: ROUTES.ADMIN.USER_MANAGEMENT, icon: Users },
  { label: 'Finance & Payments', href: ROUTES.ADMIN.FINANCE_PAYMENTS, icon: CreditCard },
  { label: 'Platform Configuration', href: ROUTES.ADMIN.PLATFORM_CONFIGURATION, icon: Settings },
  { label: 'Approval Requests', href: ROUTES.ADMIN.APPROVAL_REQUESTS, icon: ClipboardCheck },
  { label: 'Assignment Management', href: ROUTES.ADMIN.ASSIGNMENT_MANAGEMENT, icon: LayoutGrid },
]

function NavItemLink({
  item,
  onNavigate,
}: {
  item: AdminNavItem
  onNavigate?: () => void
}) {
  const Icon = item.icon
  const { pathname } = useLocation()
  const activeOverride = item.isActive?.(pathname)

  return (
    <NavLink
      to={item.href}
      onClick={onNavigate}
      className={({ isActive }) => {
        const active = activeOverride ?? isActive
        return cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors',
          active
            ? 'bg-primary-100 text-primary font-semibold'
            : 'text-text-muted hover:bg-hover-light hover:text-text-primary',
        )
      }}
    >
      {({ isActive }) => {
        const active = activeOverride ?? isActive
        return (
          <>
            <Icon
              size={18}
              strokeWidth={1.75}
              className={cn('shrink-0', active ? 'text-primary' : 'text-text-muted')}
            />
            <span>{item.label}</span>
          </>
        )
      }}
    </NavLink>
  )
}

/**
 * Admin portal shell: navy top bar + white sidebar with admin navigation.
 */
export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 1024px)')
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isNotificationsPage = pathname.startsWith(ROUTES.ADMIN.NOTIFICATIONS)
  const isMessagesPage = pathname.startsWith(ROUTES.ADMIN.MESSAGES)
  const logout = useAuthStore((s) => s.logout)

  return (
    <div className="min-h-screen bg-canvas">
      {/* ── Top navigation (full width) ── */}
      <header className="sticky top-0 z-50 h-16 bg-[#0f172a] text-white">
        <div className="flex items-center h-full gap-4 px-4 lg:px-6">
          {isMobile && (
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-white/80 hover:bg-white/10 transition-colors lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          )}

          <div className="hidden lg:block sidebar-width shrink-0">
            <button
              type="button"
              onClick={() => navigate(ROUTES.ADMIN.DASHBOARD)}
              className="border-0 bg-transparent p-0 text-[18px] font-extrabold tracking-tight text-white hover:text-white/80"
              aria-label="Go to admin dashboard"
            >
              RENTILO
            </button>
          </div>

          {isMobile && (
            <button
              type="button"
              onClick={() => {
                navigate(ROUTES.ADMIN.DASHBOARD)
                setSidebarOpen(false)
              }}
              className="shrink-0 border-0 bg-transparent p-0 text-[18px] font-extrabold tracking-tight text-white hover:text-white/80"
              aria-label="Go to admin dashboard"
            >
              RENTILO
            </button>
          )}

          <div className="flex-1" />

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                navigate(ROUTES.ADMIN.NOTIFICATIONS)
                setHelpOpen(false)
              }}
              className={cn(
                'relative p-2.5 rounded-lg text-white/90 hover:bg-white/10 transition-colors',
                isNotificationsPage && 'bg-white/15 text-white',
              )}
              aria-label="Notifications"
              aria-current={isNotificationsPage ? 'page' : undefined}
            >
              <Bell size={20} strokeWidth={1.75} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-status-error rounded-full ring-2 ring-[#0f172a]" />
            </button>
            <button
              type="button"
              onClick={() => {
                navigate(ROUTES.ADMIN.MESSAGES)
                setHelpOpen(false)
              }}
              className={cn(
                'p-2.5 rounded-lg text-white/90 hover:bg-white/10 transition-colors',
                isMessagesPage && 'bg-white/15 text-white',
              )}
              aria-label="Messages"
              aria-current={isMessagesPage ? 'page' : undefined}
            >
              <MessageSquare size={20} strokeWidth={1.75} />
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setHelpOpen((v) => !v)}
                className="p-2.5 rounded-lg text-white/90 hover:bg-white/10 transition-colors"
                aria-label="Help"
              >
                <CircleHelp size={20} strokeWidth={1.75} />
              </button>
              {helpOpen && <HelpPopover onClose={() => setHelpOpen(false)} />}
            </div>
            <button
              type="button"
              className="ml-1 p-0.5 rounded-full ring-2 ring-white/20 hover:ring-white/40 transition-all"
              aria-label="Admin profile"
            >
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-[13px] font-bold text-white">
                A
              </div>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 top-16 bg-navy/50 z-40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
        )}

        {/* ── Sidebar ── */}
        <aside
          className={cn(
            'fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] bg-surface border-r border-outline',
            'flex flex-col sidebar-width transition-transform duration-200 ease-in-out',
            isMobile && !sidebarOpen && '-translate-x-full',
            isMobile && sidebarOpen && 'translate-x-0',
          )}
        >
          <div className="flex items-center justify-between px-6 pt-5 pb-2 lg:hidden">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              Admin Control
            </p>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg text-text-muted hover:bg-hover-light"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          <p className="hidden lg:block px-6 pt-5 pb-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Admin Control
          </p>

          <nav className="flex-1 px-3 overflow-y-auto">
            <ul className="space-y-1">
              {mainNavItems.map((item) => (
                <li key={item.href}>
                  <NavItemLink item={item} onNavigate={() => isMobile && setSidebarOpen(false)} />
                </li>
              ))}
            </ul>
          </nav>

          <div className="px-3 py-4 mt-auto border-t border-outline">
            <button
              type="button"
              onClick={() => {
                logout()
                navigate(ROUTES.AUTH.LOGIN)
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut size={18} strokeWidth={1.75} className="shrink-0" />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main
          className={cn(
            'flex-1 min-w-0 p-6',
            !isMobile && 'ml-70',
          )}
        >
          <Outlet />
        </main>
      </div>

      <ToastContainer />
      <ConfirmDialog />
    </div>
  )
}

function HelpPopover({ onClose }: { onClose: () => void }) {
  const items = [
    { title: 'Documentation', desc: 'Read the admin handbook' },
    { title: 'Contact support', desc: '24/7 enterprise success team' },
    { title: 'Keyboard shortcuts', desc: 'View all available shortcuts' },
    { title: "What's new", desc: 'See the latest platform updates' },
  ]
  return (
    <div className="absolute right-0 top-full mt-2 w-72 rounded-card border border-outline bg-white shadow-modal overflow-hidden z-50">
      <div className="flex items-center justify-between border-b border-outline px-4 py-3">
        <p className="text-body font-bold text-text-primary">Help & Support</p>
        <button
          type="button"
          onClick={onClose}
          className="text-label text-text-muted hover:text-text-primary transition-colors"
        >
          Close
        </button>
      </div>
      <div className="divide-y divide-outline">
        {items.map((item) => (
          <button
            key={item.title}
            type="button"
            onClick={onClose}
            className="block w-full px-4 py-3 text-left hover:bg-hover-light transition-colors"
          >
            <p className="text-body font-semibold text-text-primary">{item.title}</p>
            <p className="text-label text-text-muted">{item.desc}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
