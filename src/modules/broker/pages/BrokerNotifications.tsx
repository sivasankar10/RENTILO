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
            </button>
          ))}
        </div>
      </div>

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
          ))
        )}
      </div>

      {/* ── Footer info ── */}
      {notifications.length > 0 && (
        <p className="text-center text-[11px] font-medium text-text-muted uppercase tracking-widest pt-4 border-t border-outline">
          Property ID: RTL-882-BRK &bull; Broker Portal Active
        </p>
      )}
    </div>
  )
}
