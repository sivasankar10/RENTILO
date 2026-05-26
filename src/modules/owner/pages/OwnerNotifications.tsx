import { useState } from 'react'
import { CheckCircle2, Megaphone, ReceiptText, Wrench } from 'lucide-react'

const filters = ['All', 'Unread', 'Important']

const notifications = [
  {
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
    icon: ReceiptText,
    title: 'Rent Payment Confirmed',
    description: 'Your payment for October has been successfully processed. View your receipt in the billing section.',
    time: 'Yesterday',
    tone: 'amber',
    unread: false,
    important: false,
  },
  {
    icon: Megaphone,
    title: 'Building Maintenance Notice',
    description: 'Routine elevator inspection scheduled for Monday morning between 8 AM and 11 AM.',
    time: '3 days ago',
    tone: 'slate',
    unread: false,
    important: true,
  },
  {
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
  const visibleItems = items.filter((item) => {
    if (activeFilter === 'Unread') return item.unread
    if (activeFilter === 'Important') return item.important
    return true
  })

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
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 space-y-6">
          {visibleItems.map((notification) => {
            const Icon = notification.icon

            return (
              <button
                type="button"
                key={notification.title}
                onClick={() =>
                  setItems((current) =>
                    current.map((item) =>
                      item.title === notification.title ? { ...item, unread: false } : item
                    )
                  )
                }
                className="flex w-full items-center gap-5 rounded-card bg-white px-5 py-4 text-left shadow-sm transition-all duration-200 hover:shadow-surface"
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
                  <h2 className="flex items-center gap-2 text-body font-bold text-text-primary">
                    {notification.title}
                    {notification.unread && <span className="h-2 w-2 rounded-full bg-primary" />}
                  </h2>
                  <p className="mt-1 truncate text-label text-text-primary">{notification.description}</p>
                </div>

                <span className="shrink-0 text-filter-label uppercase text-text-primary">
                  {notification.time}
                </span>
              </button>
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
