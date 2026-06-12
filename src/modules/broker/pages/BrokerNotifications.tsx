import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  Check,
  CheckCircle2,
  DollarSign,
  FileText,
  Mail,
  Megaphone,
  Star,
  Trash2,
  UserPlus,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { ROUTES } from '@shared/constants/routes'

type FilterKey = 'All' | 'Unread' | 'Important'
type Tone = 'blue' | 'amber' | 'slate' | 'green' | 'purple'

interface BrokerNotification {
  id: string
  icon: LucideIcon
  title: string
  description: string
  time: string
  tone: Tone
  unread: boolean
  important: boolean
  actionLabel?: string
  actionRoute?: string
}

const filters: FilterKey[] = ['All', 'Unread', 'Important']

const initialNotifications: BrokerNotification[] = [
  {
    id: 'n-1',
    icon: FileText,
    title: 'New Property Assignment',
    description:
      'You have been assigned to Skyline Heights - Unit 402. Review property details and contact the owner to begin marketing.',
    time: '15 mins ago',
    tone: 'blue',
    unread: true,
    important: true,
    actionLabel: 'View property',
    actionRoute: ROUTES.BROKER.PORTFOLIO,
  },
  {
    id: 'n-2',
    icon: Bell,
    title: 'Client Viewing Request',
    description:
      'Sarah Martinez has requested a viewing for Harbor Residences on Friday, Nov 15 at 3:00 PM.',
    time: '1 hour ago',
    tone: 'purple',
    unread: true,
    important: true,
    actionLabel: 'View client',
    actionRoute: ROUTES.BROKER.CLIENTS,
  },
  {
    id: 'n-3',
    icon: DollarSign,
    title: 'Commission Payment Received',
    description:
      'Your commission of $3,200 for Parkview Residences lease has been successfully processed. View details in your earnings.',
    time: 'Yesterday',
    tone: 'green',
    unread: false,
    important: true,
    actionLabel: 'View earnings',
    actionRoute: ROUTES.BROKER.COMMISSION,
  },
  {
    id: 'n-4',
    icon: Mail,
    title: 'Owner Message',
    description:
      'Julian Vane sent you a message regarding Alpine Terrace pricing strategy. Respond to maintain your high rating.',
    time: 'Yesterday',
    tone: 'blue',
    unread: false,
    important: false,
    actionLabel: 'Open messages',
    actionRoute: ROUTES.BROKER.MESSAGES,
  },
  {
    id: 'n-5',
    icon: CheckCircle2,
    title: 'Lease Agreement Signed',
    description:
      'Congratulations! The lease for Greenwich Penthouse has been signed by all parties. Commission will be processed within 48 hours.',
    time: '2 days ago',
    tone: 'green',
    unread: false,
    important: false,
  },
  {
    id: 'n-6',
    icon: Star,
    title: 'Performance Rating Updated',
    description:
      'Your average rating has increased to 4.9/5.0 after receiving excellent feedback from recent clients.',
    time: '3 days ago',
    tone: 'amber',
    unread: false,
    important: false,
    actionLabel: 'View profile',
    actionRoute: ROUTES.BROKER.PROFILE,
  },
  {
    id: 'n-7',
    icon: Megaphone,
    title: 'Property Listing Update Required',
    description:
      'The owner of Canary Wharf Loft has updated pricing. Please review and update the listing details accordingly.',
    time: 'Oct 28',
    tone: 'slate',
    unread: false,
    important: false,
    actionLabel: 'Update listing',
    actionRoute: ROUTES.BROKER.LISTINGS,
  },
  {
    id: 'n-8',
    icon: UserPlus,
    title: 'New Lead Inquiry',
    description:
      'A new qualified lead has shown interest in Shoreditch Penthouse. Contact details available in your dashboard.',
    time: 'Oct 26',
    tone: 'purple',
    unread: false,
    important: false,
    actionLabel: 'View lead',
    actionRoute: ROUTES.BROKER.DASHBOARD,
  },
]

const toneStyles: Record<Tone, string> = {
  blue: 'bg-primary-100 text-primary',
  amber: 'bg-status-warning-bg text-status-warning-text',
  slate: 'bg-slate-100 text-text-primary',
  green: 'bg-status-success-bg text-status-success-text',
  purple: 'bg-purple-50 text-purple-600',
}

export function BrokerNotifications() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<FilterKey>('All')
  const [items, setItems] = useState<BrokerNotification[]>(initialNotifications)

  const visibleItems = useMemo(() => {
    if (activeFilter === 'Unread') return items.filter((i) => i.unread)
    if (activeFilter === 'Important') return items.filter((i) => i.important)
    return items
  }, [items, activeFilter])

  const unreadCount = items.filter((i) => i.unread).length

  const markAsRead = (id: string) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, unread: false } : item)),
    )
  }

  const handleNotificationClick = (notification: BrokerNotification) => {
    markAsRead(notification.id)
  }

  const handleDelete = (notification: BrokerNotification, e: React.MouseEvent) => {
    e.stopPropagation()
    setItems((current) => current.filter((item) => item.id !== notification.id))
  }

  const handleMarkAllRead = () => {
    if (unreadCount === 0) {
      return
    }
    setItems((current) => current.map((item) => ({ ...item, unread: false })))
  }

  const toggleImportant = (id: string) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, important: !item.important } : item
      )
    )
  }

  const handleToggleImportant = (notification: BrokerNotification, e: React.MouseEvent) => {
    e.stopPropagation()
    toggleImportant(notification.id)
  }

  const handleAction = (notification: BrokerNotification, e: React.MouseEvent) => {
    e.stopPropagation()
    markAsRead(notification.id)
    if (notification.actionRoute) {
      navigate(notification.actionRoute)
    }
  }

  return (
    <div className="min-h-screen bg-canvas-alt px-2 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-heading-1 font-bold tracking-tight text-text-primary">
              Notifications
            </h1>
            <p className="mt-2 text-body text-text-muted">
              Stay updated with property assignments, client requests, commission payments, and important updates.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <div className="inline-flex w-fit rounded-button bg-slate-100 p-1">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={
                    activeFilter === filter
                      ? 'rounded-button bg-white px-5 py-2 text-label font-bold text-navy shadow-sm'
                      : 'rounded-button px-5 py-2 text-label font-semibold text-text-primary transition-colors duration-200 hover:bg-white'
                  }
                >
                  {filter}
                  {filter === 'Unread' && unreadCount > 0 && (
                    <span
                      className={cn(
                        'ml-1.5 inline-block rounded-pill px-1.5 py-0.5 text-[10px] font-bold',
                        activeFilter === filter
                          ? 'bg-primary text-white'
                          : 'bg-status-error text-white',
                      )}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-label font-semibold text-primary hover:text-primary-700 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Notifications list */}
        <div className="mt-10 space-y-4">
          {visibleItems.length === 0 ? (
            <div className="rounded-card border border-outline bg-white p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-canvas-alt">
                <Bell size={22} className="text-text-muted" />
              </div>
              <p className="mt-4 text-body font-bold text-text-primary">
                No notifications in this view
              </p>
              <p className="mt-1 text-label text-text-muted">
                {activeFilter === 'Unread'
                  ? "You're all caught up."
                  : activeFilter === 'Important'
                    ? 'No items flagged as important right now.'
                    : 'New alerts will appear here.'}
              </p>
            </div>
          ) : (
            visibleItems.map((notification) => {
              const Icon = notification.icon
              return (
                <article
                  key={notification.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleNotificationClick(notification)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      handleNotificationClick(notification)
                    }
                  }}
                  className={cn(
                    'group flex w-full items-start gap-5 rounded-card border bg-white px-5 py-4 text-left shadow-sm transition-all duration-200 hover:bg-slate-50 hover:shadow-surface',
                    notification.unread ? 'border-primary/30' : 'border-outline',
                  )}
                >
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-button',
                      toneStyles[notification.tone],
                    )}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-body font-bold text-text-primary">
                        {notification.title}
                      </h2>
                      {notification.unread && (
                        <span className="h-2 w-2 rounded-full bg-primary" aria-label="Unread" />
                      )}
                      {notification.important && (
                        <span className="rounded-pill bg-status-error-bg px-2 py-0.5 text-[10px] font-bold uppercase text-status-error-text">
                          Important
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-label leading-5 text-text-muted">
                      {notification.description}
                    </p>
                    {notification.actionLabel && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => handleAction(notification, e)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleAction(notification, e as unknown as React.MouseEvent)
                          }
                        }}
                        className="mt-2 inline-block text-label font-semibold text-primary hover:text-primary-700 transition-colors cursor-pointer"
                      >
                        {notification.actionLabel}
                        {' ->'}
                      </span>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span className="text-filter-label uppercase text-text-muted">
                      {notification.time}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={(e) => handleToggleImportant(notification, e)}
                        aria-pressed={notification.important}
                        title={
                          notification.important ? 'Remove from important' : 'Mark as important'
                        }
                        className={cn(
                          'rounded-button p-1.5 transition-colors',
                          notification.important
                            ? 'text-status-warning-text hover:bg-status-warning-bg'
                            : 'text-text-muted hover:bg-status-warning-bg hover:text-status-warning-text'
                        )}
                      >
                        <Star
                          size={15}
                          fill={notification.important ? 'currentColor' : 'none'}
                        />
                      </button>
                      {notification.unread && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            markAsRead(notification.id)
                          }}
                          title="Mark as read"
                          className="rounded-button p-1.5 text-text-muted transition-colors hover:bg-primary-50 hover:text-primary"
                        >
                          <Check size={15} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={(e) => handleDelete(notification, e)}
                        title="Delete notification"
                        className="rounded-button p-1.5 text-text-muted transition-colors hover:bg-status-error-bg hover:text-status-error"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              )
            })
          )}
        </div>

        {items.length > 0 && (
          <p className="mt-12 text-center text-filter-label uppercase tracking-wider text-text-muted">
            Broker Portal - {items.length} total notifications
          </p>
        )}
      </div>
    </div>
  )
}
