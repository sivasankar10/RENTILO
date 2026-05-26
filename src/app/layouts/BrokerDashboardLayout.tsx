import { useState } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  Bell,
  Briefcase,
  CircleHelp,
  FileText,
  LayoutGrid,
  Menu,
  MessageSquare,
  Search,
  Settings,
  Users,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useMediaQuery } from '@shared/hooks/useMediaQuery'
import { ROUTES } from '@shared/constants/routes'
import { cn } from '@shared/utils/cn'
import brokerProfileImg from '@/assets/images/broker_profile.png'

type BrokerNavItem = {
  label: string
  href: string
  icon: LucideIcon
  end?: boolean
  isActive?: (pathname: string) => boolean
}

const mainNavItems: BrokerNavItem[] = [
  {
    label: 'Dashboard',
    href: ROUTES.BROKER.DASHBOARD,
    icon: LayoutGrid,
    isActive: (pathname) =>
      pathname === ROUTES.BROKER.ROOT || pathname === ROUTES.BROKER.DASHBOARD,
  },
  { label: 'Portfolio', href: ROUTES.BROKER.PORTFOLIO, icon: Briefcase },
  { label: 'Tenant leads', href: ROUTES.BROKER.CLIENTS, icon: Users },
  { label: 'Listings', href: ROUTES.BROKER.LISTINGS, icon: FileText },
  { label: 'Analytics', href: ROUTES.BROKER.ANALYTICS, icon: BarChart3 },
]

const footerNavItems: BrokerNavItem[] = [
  { label: 'Settings', href: '#settings', icon: Settings },
  { label: 'Support', href: '#support', icon: CircleHelp },
]

function NavItemLink({
  item,
  onNavigate,
}: {
  item: BrokerNavItem
  onNavigate?: () => void
}) {
  const Icon = item.icon
  const { pathname } = useLocation()
  const activeOverride = item.isActive?.(pathname)

  if (item.href.startsWith('#')) {
    return (
      <a
        href={item.href}
        onClick={onNavigate}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium text-text-muted hover:bg-hover-light hover:text-text-primary transition-colors"
      >
        <Icon size={18} strokeWidth={1.75} className="shrink-0" />
        <span>{item.label}</span>
      </a>
    )
  }

  return (
    <NavLink
      to={item.href}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) => {
        const active = activeOverride ?? isActive
        return cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors',
          active
            ? 'bg-primary-100 text-primary'
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
 * Broker portal shell: full-width navy top bar + white sidebar (matches design mockup).
 */
export function BrokerDashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 1024px)')
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isMessagesPage = pathname.startsWith(ROUTES.BROKER.MESSAGES)
  const messagesActive = isMessagesPage

  return (
    <div className="min-h-screen bg-canvas">
      {/* ── Top navigation (full width) ── */}
      <header className="sticky top-0 z-50 h-16 bg-[#0f172a] text-white">
        <div className="flex items-center h-full gap-4 px-4 lg:px-6">
          {isMobile && !isMessagesPage && (
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
            <span className="text-[18px] font-extrabold tracking-tight text-white">
              RENTILO
            </span>
          </div>

          {!isMobile && (
            <span className="lg:hidden text-[18px] font-extrabold tracking-tight text-white shrink-0">
              RENTILO
            </span>
          )}

          <div className="flex-1 flex justify-center min-w-0 px-2 lg:px-8">
            <div className="relative w-full max-w-xl">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="search"
                placeholder="Search properties..."
                className="w-full h-10 pl-11 pr-4 rounded-full bg-[#1e293b] border border-white/10 text-[14px] text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/40 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              type="button"
              className="relative p-2.5 rounded-lg text-white/90 hover:bg-white/10 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} strokeWidth={1.75} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-status-error rounded-full ring-2 ring-[#0f172a]" />
            </button>
            <button
              type="button"
              onClick={() => navigate(ROUTES.BROKER.MESSAGES)}
              className={cn(
                'p-2.5 rounded-lg text-white/90 hover:bg-white/10 transition-colors',
                messagesActive && 'bg-white/15 text-white',
              )}
              aria-label="Messages"
              aria-current={messagesActive ? 'page' : undefined}
            >
              <MessageSquare size={20} strokeWidth={1.75} />
            </button>
            <button
              type="button"
              className="p-2.5 rounded-lg text-white/90 hover:bg-white/10 transition-colors"
              aria-label="Help"
            >
              <CircleHelp size={20} strokeWidth={1.75} />
            </button>
            <button
              type="button"
              className="p-2.5 rounded-lg text-white/90 hover:bg-white/10 transition-colors"
              aria-label="Settings"
            >
              <Settings size={20} strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={() => navigate(ROUTES.BROKER.PROFILE)}
              className="ml-1 p-0.5 rounded-full ring-2 ring-white/20 hover:ring-white/40 transition-all"
              aria-label="My profile"
            >
              <img
                src={brokerProfileImg}
                alt="Broker profile"
                className="w-9 h-9 rounded-full object-cover"
              />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Mobile overlay */}
        {isMobile && sidebarOpen && !isMessagesPage && (
          <div
            className="fixed inset-0 top-16 bg-navy/50 z-40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
        )}

        {/* ── Sidebar (hidden on messages — conversation list replaces it) ── */}
        {!isMessagesPage && (
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
              Broker Portal
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
            Broker Portal
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
            <ul className="space-y-1">
              {footerNavItems.map((item) => (
                <li key={item.label}>
                  <NavItemLink item={item} onNavigate={() => isMobile && setSidebarOpen(false)} />
                </li>
              ))}
            </ul>
          </div>
        </aside>
        )}

        {/* ── Main content ── */}
        <main
          className={cn(
            'flex-1 min-w-0',
            isMessagesPage ? 'p-0' : 'p-6',
            !isMobile && !isMessagesPage && 'ml-70',
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
