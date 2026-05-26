import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@shared/hooks/useAuth'
import { ROUTES } from '@shared/constants/routes'
import { cn } from '@shared/utils/cn'
import { MaterialIcon } from '../components/MaterialIcon'
import { TENANT_NOTIFICATIONS } from '../constants/notifications'
import type { NotificationFilter } from '../types/notification'
import { TenantAccountSidebar } from '../components/TenantAccountSidebar'
import { NotificationCard } from '../components/NotificationCard'

const FILTERS: { id: NotificationFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'important', label: 'Important' },
]

export function NotificationsPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [filter, setFilter] = useState<NotificationFilter>('all')

  const handleLogout = () => {
    logout()
    navigate(ROUTES.AUTH.LOGIN)
  }

  const filtered = useMemo(() => {
    if (filter === 'unread') {
      return TENANT_NOTIFICATIONS.filter((n) => n.unread)
    }
    if (filter === 'important') {
      return TENANT_NOTIFICATIONS.filter((n) => n.important)
    }
    return TENANT_NOTIFICATIONS
  }, [filter])

  return (
    <div className="flex flex-1 min-h-0 bg-brand-background">
      <TenantAccountSidebar />

      <div className="flex-1 flex justify-center overflow-y-auto px-6 py-10 md:px-10">
        <div className="w-full max-w-3xl">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8">
            <div>
              <h1 className="font-display text-[32px] font-extrabold text-brand tracking-tight mb-2">
                Notifications
              </h1>
              <p className="font-body text-[15px] text-brand-on-surface-variant max-w-xl leading-relaxed">
                Manage your property alerts, payment updates, and messages from landlords.
              </p>
            </div>

            <div
              className="inline-flex shrink-0 p-1 rounded-full bg-brand-container-high border border-brand-outline-variant/50"
              role="tablist"
              aria-label="Filter notifications"
            >
              {FILTERS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={filter === item.id}
                  className={cn(
                    'px-5 py-2 rounded-full border-0 font-body text-sm font-semibold cursor-pointer transition-all',
                    filter === item.id
                      ? 'bg-brand-container-lowest text-brand shadow-sm'
                      : 'bg-transparent text-brand-outline hover:text-brand'
                  )}
                  onClick={() => setFilter(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {filtered.length === 0 ? (
              <div className="text-center py-16 px-6 rounded-xl bg-brand-container-lowest border border-brand-outline-variant">
                <p className="font-body text-brand-on-surface-variant">
                  No notifications in this view.
                </p>
              </div>
            ) : (
              filtered.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))
            )}
          </div>

          <p className="mt-12 text-center font-body text-[11px] font-semibold tracking-wider text-brand-outline uppercase">
            PROPERTY ID: RTL-882-DAN • LEASE ACTIVE UNTIL OCT 2024
          </p>

          <div className="lg:hidden flex flex-col gap-4 mt-10 pt-8 border-t border-brand-outline-variant">
            <button
              type="button"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-[10px] border-0 bg-brand text-white font-body text-sm font-semibold"
            >
              <MaterialIcon name="help" />
              Help Center
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 border-0 bg-transparent font-body text-xs font-bold tracking-widest text-brand-outline"
            >
              <MaterialIcon name="logout" />
              LOG OUT
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
