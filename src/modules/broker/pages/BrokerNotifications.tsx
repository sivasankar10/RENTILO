import { useMemo, useState } from 'react'
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  DollarSign,
  FileText,
  Mail,
  Megaphone,
  Star,
  UserPlus,
} from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { BROKER_NOTIFICATIONS } from '../constants/notifications'
import type { BrokerNotification, NotificationFilter } from '../types/notification'

const FILTERS: { id: NotificationFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'important', label: 'Important' },
]

const ICON_MAP = {
  assignment: FileText,
  event: Bell,
  payments: DollarSign,
  mail: Mail,
  check_circle: CheckCircle2,
  star: Star,
  campaign: Megaphone,
  person_add: UserPlus,
}

const ICON_STYLES = {
  message: 'bg-blue-50 text-blue-600',
  payment: 'bg-amber-50 text-amber-600',
  announcement: 'bg-slate-50 text-slate-600',
  success: 'bg-green-50 text-green-600',
  assignment: 'bg-primary-100 text-primary',
  client: 'bg-purple-50 text-purple-600',
} as const

interface NotificationCardProps {
  notification: BrokerNotification
}

function NotificationCard({ notification }: NotificationCardProps) {
  const Icon = ICON_MAP[notification.icon as keyof typeof ICON_MAP] || AlertCircle

  return (
    <article
      className={cn(
        'flex items-start gap-4 p-5 rounded-card bg-white border border-outline',
        'shadow-sm transition-all hover:shadow-md hover:border-primary/30'
      )}
    >
      <div
        className={cn(
          'flex shrink-0 items-center justify-center w-11 h-11 rounded-button',
          ICON_STYLES[notification.iconVariant]
        )}
      >
        <Icon size={20} strokeWidth={2} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4 mb-1">
          <h3 className="flex items-center gap-2 text-body font-bold text-text-primary leading-snug">
            {notification.unread && (
              <span
                className="shrink-0 w-2 h-2 rounded-full bg-primary"
                aria-label="Unread"
              />
            )}
            {notification.title}
          </h3>
          <time className="shrink-0 text-filter-label font-semibold tracking-wide text-text-muted uppercase whitespace-nowrap pt-0.5">
            {notification.timestamp}
          </time>
        </div>
        <p className="text-body text-text-muted leading-relaxed pr-2">
          {notification.description}
        </p>
      </div>
    </article>
  )
}

export function BrokerNotifications() {
  const [filter, setFilter] = useState<NotificationFilter>('all')

  const filtered = useMemo(() => {
    if (filter === 'unread') {
      return BROKER_NOTIFICATIONS.filter((n) => n.unread)
    }
    if (filter === 'important') {
      return BROKER_NOTIFICATIONS.filter((n) => n.important)
    }
    return BROKER_NOTIFICATIONS
  }, [filter])

  const unreadCount = useMemo(
    () => BROKER_NOTIFICATIONS.filter((n) => n.unread).length,
    []
  )

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-heading-1 font-bold tracking-tight text-text-primary">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-pill bg-primary text-white text-badge font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          <p className="text-body text-text-muted max-w-xl leading-relaxed">
            Stay updated with property assignments, client requests, commission payments, and important updates.
          </p>
        </div>

        <div
          className="inline-flex shrink-0 p-1 rounded-button bg-canvas-alt border border-outline"
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
                'px-5 py-2 rounded-button border-0 text-body font-semibold cursor-pointer transition-all',
                filter === item.id
                  ? 'bg-navy text-white shadow-sm'
                  : 'bg-transparent text-text-muted hover:text-text-primary hover:bg-hover-light'
              )}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-outline">
        <button
          type="button"
          className="inline-flex items-center gap-2 text-body font-semibold text-primary hover:text-primary-700 transition-colors"
        >
          <CheckCircle2 size={18} />
          Mark all as read
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="text-label font-semibold text-text-muted hover:text-text-primary transition-colors"
          >
            Notification settings
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 px-6 rounded-card bg-canvas-alt border border-outline">
            <Bell size={48} className="mx-auto mb-4 text-text-muted opacity-50" strokeWidth={1.5} />
            <p className="text-body font-semibold text-text-primary mb-1">
              No notifications in this view
            </p>
            <p className="text-body text-text-muted">
              {filter === 'unread' && "You're all caught up!"}
              {filter === 'important' && 'No important notifications at the moment.'}
              {filter === 'all' && 'Check back later for updates.'}
            </p>
          </div>
        ) : (
          filtered.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))
        )}
      </div>

      <div className="mt-12 pt-8 border-t border-outline">
        <p className="text-center text-label text-text-muted">
          Showing {filtered.length} of {BROKER_NOTIFICATIONS.length} notifications
        </p>
      </div>
    </div>
  )
}
