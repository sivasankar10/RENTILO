import { useState } from 'react'
import { cn } from '@shared/utils/cn'
import { useAuth } from '@shared/hooks/useAuth'
import { usePrototypeStore } from '@shared/store/prototypeStore'

type NotifFilter = 'All' | 'Unread' | 'Important'

export function EnterpriseNotifications() {
  const { user } = useAuth()
  const notifications = usePrototypeStore((s) => s.notifications)
  const markRead = usePrototypeStore((s) => s.markNotificationRead)
  const [filter, setFilter] = useState<NotifFilter>('All')

  // Get notifications for this enterprise user
  const userNotifications = notifications.filter(
    (n) => n.userId === user?.id || n.role === 'enterprise' || n.role === 'all'
  )

  const filtered = userNotifications.filter((n) => {
    if (filter === 'Unread') return n.unread
    if (filter === 'Important') return n.important
    return true
  })

  return (
    <div className="min-h-[70vh] flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-extrabold text-[#0f172a] tracking-tight">Notifications</h1>
            <p className="mt-1 text-[14px] text-text-muted">Manage your property alerts, payment updates, and messages.</p>
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-outline bg-white p-1">
            {(['All', 'Unread', 'Important'] as NotifFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-4 py-2 rounded-md text-[13px] font-semibold transition-colors',
                  filter === f ? 'bg-[#0f172a] text-white' : 'text-text-muted hover:bg-hover-light'
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Notification List */}
        <div className="rounded-xl border border-outline bg-white shadow-sm divide-y divide-outline">
          {filtered.length > 0 ? filtered.map((notif) => (
            <div
              key={notif.id}
              onClick={() => notif.unread && markRead(notif.id)}
              className="flex items-start gap-4 px-6 py-5 hover:bg-canvas-alt transition-colors cursor-pointer"
            >
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-full shrink-0', notif.important ? 'bg-amber-100' : 'bg-blue-100')}>
                <span className="text-[16px]">{notif.important ? '⚠️' : '✉️'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-[#0f172a] flex items-center gap-2">
                  {notif.title}
                  {notif.unread && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                </p>
                <p className="mt-1 text-[13px] text-text-muted leading-relaxed">{notif.description}</p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted shrink-0">
                {new Date(notif.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          )) : (
            <div className="px-6 py-12 text-center">
              <p className="text-[14px] text-text-muted">No notifications to display.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
