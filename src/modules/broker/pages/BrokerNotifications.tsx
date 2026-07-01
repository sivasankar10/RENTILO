import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Check, DollarSign, FileText, Star, Trash2, UserPlus } from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { cn } from '@shared/utils/cn'
import { useBrokerPrototype } from '../hooks/useBrokerPrototype'

type FilterKey = 'All' | 'Unread' | 'Important'

export function BrokerNotifications() {
  const navigate = useNavigate()
  const { notifications, markNotificationRead } = useBrokerPrototype()
  const [activeFilter, setActiveFilter] = useState<FilterKey>('All')
  const [deleted, setDeleted] = useState<string[]>([])
  const [importantOverrides, setImportantOverrides] = useState<Record<string, boolean>>({})

  const items = useMemo(
    () => notifications
      .filter((item) => !deleted.includes(item.id))
      .map((item) => ({ ...item, important: importantOverrides[item.id] ?? item.important })),
    [deleted, importantOverrides, notifications],
  )
  const visible = items.filter((item) =>
    activeFilter === 'Unread' ? item.unread : activeFilter === 'Important' ? item.important : true,
  )
  const unreadCount = items.filter((item) => item.unread).length

  const openAction = (action?: string) => {
    if (action === 'view_assignment') navigate(ROUTES.BROKER.ASSIGNED_PROPERTIES)
    else if (action === 'view_lead') navigate(ROUTES.BROKER.CLIENTS)
    else if (action === 'view_commission') navigate(ROUTES.BROKER.COMMISSION)
    else navigate(ROUTES.BROKER.LISTINGS)
  }

  return (
    <div className="min-h-screen bg-canvas-alt px-2 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-text-primary">Notifications</h1>
            <p className="mt-2 text-body text-text-muted">
              Assignment, lead, request-decision, listing, and commission activity for this broker.
            </p>
          </div>
          <div className="inline-flex w-fit rounded-button bg-slate-100 p-1">
            {(['All', 'Unread', 'Important'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  'rounded-button px-5 py-2 text-label font-semibold',
                  activeFilter === filter ? 'bg-white text-navy shadow-sm' : 'text-text-primary',
                )}
              >
                {filter}{filter === 'Unread' && unreadCount ? ` (${unreadCount})` : ''}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {visible.length === 0 ? (
            <div className="rounded-card border border-outline bg-white p-10 text-center">
              <Bell className="mx-auto text-text-muted" />
              <p className="mt-3 text-body font-bold text-text-primary">No notifications in this view</p>
            </div>
          ) : visible.map((notification) => {
            const Icon = notification.action === 'view_commission'
              ? DollarSign
              : notification.action === 'view_lead'
                ? UserPlus
                : notification.action === 'view_assignment'
                  ? FileText
                  : Bell
            return (
              <article
                key={notification.id}
                className={cn(
                  'flex items-start gap-4 rounded-card border bg-white p-5',
                  notification.unread ? 'border-primary/40' : 'border-outline',
                )}
              >
                <div className="rounded-button bg-primary-50 p-3 text-primary"><Icon size={18} /></div>
                <button
                  type="button"
                  onClick={() => {
                    markNotificationRead(notification.id)
                    openAction(notification.action)
                  }}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="text-body font-bold text-text-primary">{notification.title}</p>
                  <p className="mt-1 text-label text-text-muted">{notification.description}</p>
                  <p className="mt-2 text-filter-label text-text-muted">
                    {new Date(notification.createdAt).toLocaleString('en-IN')}
                  </p>
                </button>
                <div className="flex gap-1">
                  {notification.unread && (
                    <button type="button" title="Mark as read" onClick={() => markNotificationRead(notification.id)} className="p-2 text-text-muted">
                      <Check size={15} />
                    </button>
                  )}
                  <button
                    type="button"
                    title="Toggle important"
                    onClick={() => setImportantOverrides((current) => ({ ...current, [notification.id]: !notification.important }))}
                    className="p-2 text-text-muted"
                  >
                    <Star size={15} fill={notification.important ? 'currentColor' : 'none'} />
                  </button>
                  <button type="button" title="Hide notification" onClick={() => setDeleted((current) => [...current, notification.id])} className="p-2 text-text-muted">
                    <Trash2 size={15} />
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}