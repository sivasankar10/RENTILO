import { useState } from 'react'
import { CheckCircle2, Megaphone, ReceiptText, Star, Wrench } from 'lucide-react'

const filters = ['All', 'Unread', 'Important']

const notifications = [
  {
    id: 'owner-notification-maintenance',
    icon: Wrench,
    title: 'Owner responded to your request',
    description:
      "Regarding the plumbing maintenance at 402 Redwood Grove. Status updated to 'In Progress'.",
    time: '2 mins ago',
    tone: 'blue',
    unread: true,
    important: true,
  },
  {
    id: 'owner-notification-payment',
    icon: ReceiptText,
    title: 'Rent Payment Confirmed',
    description: 'Your payment for October has been successfully processed. View your receipt in the billing section.',
    time: 'Yesterday',
    tone: 'amber',
    unread: false,
    important: false,
  },
  {
    id: 'owner-notification-building',
    icon: Megaphone,
    title: 'Building Maintenance Notice',
    description: 'Routine elevator inspection scheduled for Monday morning between 8 AM and 11 AM.',
    time: '3 days ago',
    tone: 'slate',
    unread: false,
    important: true,
  },
  {
    id: 'owner-notification-lease',
    icon: CheckCircle2,
    title: 'Lease Renewal Signed',
    description: 'All parties have signed the lease renewal for Unit 204. You can download the final PDF in your documents.',
    time: 'Oct 12',
    tone: 'blue',
    unread: false,
    important: false,
  },
]

export function OwnerNotifications() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [items, setItems] = useState(notifications)
  const unreadCount = items.filter((item) => item.unread).length
  const visibleItems = items.filter((item) => {
    if (activeFilter === 'Unread') return item.unread
    if (activeFilter === 'Important') return item.important
    return true
  })

  const markAsRead = (id: string) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, unread: false } : item))
    )
  }

  const markAllAsRead = () => {
    if (unreadCount === 0) return
    setItems((current) => current.map((item) => ({ ...item, unread: false })))
  }

  const toggleImportant = (id: string) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, important: !item.important } : item
      )
    )
  }

  return (
    <div className="min-h-screen bg-canvas-alt px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-heading-1 font-bold tracking-tight text-navy">Notifications</h1>
            <p className="mt-2 text-body text-text-primary">
              Manage your property alerts, payment updates, and messages from landlords.
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 md:items-end">
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
                    <span className="ml-1.5 inline-flex min-w-4 h-4 items-center justify-center rounded-pill bg-primary px-1 text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className={
                unreadCount > 0
                  ? 'text-label font-semibold text-primary transition-colors hover:text-primary-700'
                  : 'cursor-not-allowed text-label font-semibold text-text-muted opacity-60'
              }
            >
              {unreadCount > 0 ? 'Mark all as read' : 'All notifications read'}
            </button>
          </div>
        </div>

        <div className="mt-10 space-y-6">
          {visibleItems.map((notification) => {
            const Icon = notification.icon

            return (
              <article
                key={notification.id}
                role="button"
                tabIndex={0}
                onClick={() => markAsRead(notification.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    markAsRead(notification.id)
                  }
                }}
                aria-label={`${notification.title}. Click to mark as read.`}
                className={
                  notification.unread
                    ? 'flex w-full cursor-pointer items-center gap-5 rounded-card border border-primary/30 bg-white px-5 py-4 text-left shadow-sm transition-all duration-200 hover:shadow-surface focus:outline-none focus:ring-2 focus:ring-primary-100'
                    : 'flex w-full cursor-pointer items-center gap-5 rounded-card border border-outline bg-white px-5 py-4 text-left shadow-sm transition-all duration-200 hover:shadow-surface focus:outline-none focus:ring-2 focus:ring-primary-100'
                }
              >
                <div
                  className={
                    notification.tone === 'amber'
                      ? 'flex h-10 w-10 items-center justify-center rounded-button bg-status-warning-bg text-status-warning-text'
                      : notification.tone === 'slate'
                        ? 'flex h-10 w-10 items-center justify-center rounded-button bg-slate-100 text-text-primary'
                        : 'flex h-10 w-10 items-center justify-center rounded-button bg-primary-100 text-primary'
                  }
                >
                  <Icon size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="flex flex-wrap items-center gap-2 text-body font-bold text-text-primary">
                    {notification.title}
                    {notification.unread && <span className="h-2 w-2 rounded-full bg-primary" />}
                    {notification.important && (
                      <span className="rounded-pill bg-status-warning-bg px-2 py-0.5 text-[10px] font-bold uppercase text-status-warning-text">
                        Important
                      </span>
                    )}
                  </h2>
                  <p className="mt-1 truncate text-label text-text-primary">{notification.description}</p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-filter-label uppercase text-text-primary">
                    {notification.time}
                  </span>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      toggleImportant(notification.id)
                    }}
                    aria-pressed={notification.important}
                    title={notification.important ? 'Remove from important' : 'Mark as important'}
                    className={
                      notification.important
                        ? 'rounded-button p-2 text-status-warning-text transition-colors hover:bg-status-warning-bg'
                        : 'rounded-button p-2 text-text-muted transition-colors hover:bg-slate-100 hover:text-status-warning-text'
                    }
                  >
                    <Star size={18} fill={notification.important ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </article>
            )
          })}
          {visibleItems.length === 0 && (
            <div className="rounded-card border border-outline bg-white p-8 text-center text-body text-text-muted">
              No notifications match this filter.
            </div>
          )}
        </div>

        <p className="mt-24 text-center text-filter-label uppercase tracking-wider text-text-muted">
          Property ID: RTL-882-DAN • Lease active until Oct 2024
        </p>
      </div>
    </div>
  )
}
