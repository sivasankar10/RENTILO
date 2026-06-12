<<<<<<< HEAD
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
=======
import { useState } from 'react'
import {
  Mail,
  CreditCard,
  Megaphone,
  CheckCircle2,
  Bell,
  Trash2,
  Check,
  Star,
} from 'lucide-react'
import { cn } from '@shared/utils/cn'

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type NotifCategory = 'message' | 'payment' | 'maintenance' | 'lease'
type NotifFilter = 'all' | 'unread' | 'important'

interface Notification {
  id: number
  category: NotifCategory
  title: string
  description: string
  timestamp: string
  isRead: boolean
  isImportant: boolean
}

/* ─────────────────────────────────────────────
   Initial data
───────────────────────────────────────────── */
const initialNotifications: Notification[] = [
  {
    id: 1,
    category: 'message',
    title: 'Owner responded to your request',
    description:
      "Regarding the plumbing maintenance at 402 Redwood Grove. Status updated to 'In Progress'.",
    timestamp: '2 mins ago',
    isRead: false,
    isImportant: true,
  },
  {
    id: 2,
    category: 'payment',
    title: 'Rent Payment Confirmed',
    description:
      'Your payment for October has been successfully processed. View your receipt in the billing section.',
    timestamp: 'Yesterday',
    isRead: false,
    isImportant: true,
  },
  {
    id: 3,
    category: 'maintenance',
    title: 'Building Maintenance Notice',
    description:
      'Routine elevator inspection scheduled for Monday morning between 9 AM and 11 AM.',
    timestamp: '3 days ago',
    isRead: true,
    isImportant: false,
  },
  {
    id: 4,
    category: 'lease',
    title: 'Lease Renewal Signed',
    description:
      'All parties have signed the lease renewal for Unit 204. You can download the final PDF in your documents.',
    timestamp: 'Oct 12',
    isRead: true,
    isImportant: false,
  },
  {
    id: 5,
    category: 'message',
    title: 'New client inquiry',
    description:
      'Arjun Patel has sent a message regarding Skyline Heights Unit 14B. Respond to keep the lead warm.',
    timestamp: 'Oct 10',
    isRead: true,
    isImportant: false,
  },
  {
    id: 6,
    category: 'payment',
    title: 'Commission Payout Scheduled',
    description:
      'Your commission of $1,200 for the Harbor Residences deal will be transferred on Oct 20.',
    timestamp: 'Oct 9',
    isRead: true,
    isImportant: true,
  },
]

/* ─────────────────────────────────────────────
   Category icon + color
───────────────────────────────────────────── */
function NotifIcon({ category }: { category: NotifCategory }) {
  const config: Record<
    NotifCategory,
    { icon: React.ReactNode; bg: string; color: string }
  > = {
    message: {
      icon: <Mail size={16} />,
      bg: 'bg-blue-50',
      color: 'text-blue-500',
    },
    payment: {
      icon: <CreditCard size={16} />,
      bg: 'bg-amber-50',
      color: 'text-amber-500',
    },
    maintenance: {
      icon: <Megaphone size={16} />,
      bg: 'bg-slate-100',
      color: 'text-slate-500',
    },
    lease: {
      icon: <CheckCircle2 size={16} />,
      bg: 'bg-green-50',
      color: 'text-green-500',
    },
  }

  const { icon, bg, color } = config[category]
  return (
    <div
      className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
        bg,
        color,
      )}
    >
      {icon}
    </div>
  )
}

/* ─────────────────────────────────────────────
   Single notification row
───────────────────────────────────────────── */
function NotifRow({
  notif,
  onMarkRead,
  onDelete,
  onToggleImportant,
}: {
  notif: Notification
  onMarkRead: (id: number) => void
  onDelete: (id: number) => void
  onToggleImportant: (id: number) => void
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onMarkRead(notif.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onMarkRead(notif.id)
        }
      }}
      className={cn(
        'flex items-start gap-4 px-5 py-4 rounded-xl transition-colors group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20',
        notif.isRead
          ? 'bg-white hover:bg-slate-50'
          : 'bg-white hover:bg-slate-50 border-l-2 border-primary',
      )}
    >
      <NotifIcon category={notif.category} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p
            className={cn(
              'text-[13px] leading-snug',
              notif.isRead
                ? 'font-medium text-[#0f172a]'
                : 'font-semibold text-[#0f172a]',
            )}
          >
            {notif.title}
            {!notif.isRead && (
              <span className="inline-block ml-1.5 w-2 h-2 rounded-full bg-primary align-middle" />
            )}
            {notif.isImportant && (
              <span className="ml-1.5 inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-600">
                Important
              </span>
            )}
          </p>
        </div>
        <p className="text-[12px] text-text-muted leading-relaxed line-clamp-2">
          {notif.description}
        </p>
      </div>

      {/* Timestamp + actions */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className="text-[11px] font-medium text-text-muted uppercase tracking-wide whitespace-nowrap">
          {notif.timestamp}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onToggleImportant(notif.id)
            }}
            aria-pressed={notif.isImportant}
            title={notif.isImportant ? 'Remove from important' : 'Mark as important'}
            className={cn(
              'p-1 rounded-md transition-colors',
              notif.isImportant
                ? 'text-amber-500 hover:bg-amber-50'
                : 'text-text-muted hover:text-amber-500 hover:bg-amber-50'
            )}
          >
            <Star size={13} fill={notif.isImportant ? 'currentColor' : 'none'} />
          </button>
          {!notif.isRead && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onMarkRead(notif.id)
              }}
              title="Mark as read"
              className="p-1 rounded-md text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
            >
              <Check size={13} />
            </button>
          )}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onDelete(notif.id)
            }}
            title="Delete notification"
            className="p-1 rounded-md text-text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main page
───────────────────────────────────────────── */
export function BrokerNotifications() {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications)
  const [filter, setFilter] = useState<NotifFilter>('all')

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead
    if (filter === 'important') return n.isImportant
    return true
  })

  const handleMarkRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    )
  }

  const handleDelete = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const handleToggleImportant = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isImportant: !n.isImportant } : n)),
    )
  }

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const tabs: { key: NotifFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
    { key: 'important', label: 'Important' },
  ]

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[26px] font-bold text-[#0f172a] tracking-tight">
            Notifications
          </h1>
          <p className="text-[13px] text-text-muted mt-1">
            Manage your property alerts, payment updates, and messages from
            clients.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-white border border-outline rounded-xl p-1 shadow-ambient">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={cn(
                'px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-colors',
                filter === tab.key
                  ? 'bg-[#0f172a] text-white shadow-sm'
                  : 'text-text-muted hover:text-[#0f172a] hover:bg-hover-light',
              )}
            >
              {tab.label}
              {tab.key === 'unread' && unreadCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary text-white text-[9px] font-bold">
                  {unreadCount}
                </span>
              )}
>>>>>>> main
            </button>
          ))}
        </div>
      </div>

<<<<<<< HEAD
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
=======
      {/* ── Mark all read ── */}
      {unreadCount > 0 && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="text-[12px] font-semibold text-primary hover:underline"
          >
            Mark all as read
          </button>
        </div>
      )}

      {/* ── Notification list ── */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Bell size={24} />
            </div>
            <p className="text-[14px] font-semibold text-[#0f172a]">
              No notifications here
            </p>
            <p className="text-[12px] text-text-muted">
              {filter === 'unread'
                ? "You're all caught up!"
                : filter === 'important'
                  ? 'No important notifications yet.'
                  : 'No notifications yet.'}
            </p>
          </div>
        ) : (
          filtered.map((notif) => (
            <NotifRow
              key={notif.id}
              notif={notif}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
              onToggleImportant={handleToggleImportant}
            />
>>>>>>> main
          ))
        )}
      </div>

<<<<<<< HEAD
      <div className="mt-12 pt-8 border-t border-outline">
        <p className="text-center text-label text-text-muted">
          Showing {filtered.length} of {BROKER_NOTIFICATIONS.length} notifications
        </p>
      </div>
=======
      {/* ── Footer info ── */}
      {notifications.length > 0 && (
        <p className="text-center text-[11px] font-medium text-text-muted uppercase tracking-widest pt-4 border-t border-outline">
          Property ID: RTL-882-BRK &bull; Broker Portal Active
        </p>
      )}
>>>>>>> main
    </div>
  )
}
