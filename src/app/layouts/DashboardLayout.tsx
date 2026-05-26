import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, Bell, Search } from 'lucide-react'
import { useAuth } from '@shared/hooks/useAuth'
import { useMediaQuery } from '@shared/hooks/useMediaQuery'
import { RoleModeSwitcher } from '@shared/components/RoleModeSwitcher'
import { cn } from '@shared/utils/cn'
import type { NavItem } from '@shared/types'

interface DashboardLayoutProps {
  navItems: NavItem[]
  roleLabel: string
}

/**
 * Base dashboard layout with 280px sidebar + top navbar + main content.
 * Each role-specific layout wraps this with its own nav items.
 */
export function DashboardLayout({ navItems, roleLabel }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width: 1024px)')

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  return (
    <div className="min-h-screen bg-canvas flex">
      {/* ── Sidebar (Desktop: fixed 280px, Mobile: overlay) ── */}
      <>
        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-navy/50 z-40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={cn(
            'fixed top-0 left-0 h-full bg-surface border-r border-outline z-50',
            'flex flex-col transition-transform duration-200 ease-in-out',
            'sidebar-width',
            isMobile && !sidebarOpen && '-translate-x-full',
            isMobile && sidebarOpen && 'translate-x-0'
          )}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-outline">
            <h2 className="text-heading-3 text-primary font-bold tracking-tight">
              Rentilo
            </h2>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-button text-text-muted hover:bg-hover-light"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Role Badge */}
          <div className="px-6 py-3">
            <span className="text-badge font-bold uppercase tracking-wider text-primary bg-primary-100 px-2.5 py-1 rounded-pill">
              {roleLabel}
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-2 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <NavLink
                    to={item.href}
                    onClick={() => isMobile && setSidebarOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-button',
                        'text-body font-medium transition-all duration-200',
                        isActive
                          ? 'bg-primary-100 text-primary border-l-3 border-primary'
                          : 'text-text-muted hover:bg-hover-light hover:text-text-primary'
                      )
                    }
                  >
                    <span className="text-label">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto text-badge bg-primary text-white px-2 py-0.5 rounded-pill">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar Footer — User Info */}
          <div className="p-4 border-t border-outline">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary font-bold text-body">
                {user?.firstName?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body font-semibold text-text-primary truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-label text-text-muted truncate">
                  {user?.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-button text-text-muted hover:bg-hover-light hover:text-status-error transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </aside>
      </>

      {/* ── Main Content Area ── */}
      <div className={cn('flex-1 flex flex-col', !isMobile && 'ml-70')}>
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md border-b border-outline h-16 flex items-center px-6">
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 mr-4 rounded-button text-text-muted hover:bg-hover-light"
            >
              <Menu size={20} />
            </button>
          )}

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 rounded-input bg-canvas border border-outline text-body text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
              />
            </div>
          </div>

          {/* Navbar Actions */}
          <div className="flex items-center gap-3 ml-4">
            <RoleModeSwitcher className="hidden md:inline-flex" />
            <button className="relative p-2 rounded-button text-text-muted hover:bg-hover-light transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-error rounded-full" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
