import { useState } from 'react'
import { Bell, Check, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { DEMO_OWNER, useOnboardingStore } from '@shared/store/onboardingStore'

const filters = ['All', 'Unread', 'Important'] as const

export function OwnerNotifications() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<(typeof filters)[number]>('All')
  const notifications = useOnboardingStore((state) => state.notifications.filter((item) => item.audience === 'owner'))
  const markRead = useOnboardingStore((state) => state.markNotificationRead)
  const toggleImportant = useOnboardingStore((state) => state.toggleNotificationImportant)
  const confirmOnboarding = useOnboardingStore((state) => state.confirmTenantOnboarding)
  const records = useOnboardingStore((state) => state.records)
  const visible = notifications.filter((item) => filter === 'All' || (filter === 'Unread' ? item.unread : item.important))
  const unreadCount = notifications.filter((item) => item.unread).length

  const openNotification = (id: string, onboardingId: string) => {
    markRead(id)
    navigate(`/owner/leases?tab=applications&application=${onboardingId}`)
  }

  return (
    <div className="min-h-screen bg-canvas-alt px-5 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div><h1 className="text-heading-1 font-extrabold text-navy">Notifications</h1><p className="mt-2 text-body text-text-muted">Application approvals, agreement signatures, and tenant onboarding actions.</p></div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-button bg-slate-100 p-1">{filters.map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={filter === item ? 'rounded-button bg-white px-4 py-2 text-label font-bold text-navy shadow-sm' : 'px-4 py-2 text-label font-semibold text-text-muted'}>{item}{item === 'Unread' && unreadCount > 0 ? ` (${unreadCount})` : ''}</button>)}</div>
            <button type="button" disabled={!unreadCount} onClick={() => notifications.forEach((item) => item.unread && markRead(item.id))} className="text-label font-bold text-primary disabled:opacity-40">Mark all as read</button>
          </div>
        </header>

        <section className="mt-8 space-y-4">
          {visible.map((notification) => {
            const record = records.find((item) => item.id === notification.onboardingId && item.owner.id === DEMO_OWNER.id)
            return (
              <article key={notification.id} onClick={() => openNotification(notification.id, notification.onboardingId)} className={notification.unread ? 'cursor-pointer rounded-card border border-primary/30 bg-white p-5 shadow-surface' : 'cursor-pointer rounded-card border border-outline bg-white p-5'}>
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-button bg-primary-50 text-primary"><Bell size={19} /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2"><h2 className="text-body font-bold text-navy">{notification.title}</h2>{notification.unread && <span className="h-2 w-2 rounded-full bg-primary" />}{notification.important && <span className="rounded-pill bg-status-warning-bg px-2 py-0.5 text-[10px] font-bold uppercase text-status-warning-text">Important</span>}</div>
                    <p className="mt-1 text-label text-text-primary">{notification.description}</p>
                    <p className="mt-2 text-filter-label uppercase text-text-muted">{notification.createdAt}</p>
                    {notification.action === 'onboard' && record?.status === 'payment_completed' && (
                      <button type="button" onClick={(event) => { event.stopPropagation(); confirmOnboarding(notification.onboardingId); markRead(notification.id) }} className="mt-4 flex items-center gap-2 rounded-button bg-status-success px-4 py-2.5 text-label font-bold text-white"><Check size={16} /> Yes, onboard tenant</button>
                    )}
                  </div>
                  <button type="button" onClick={(event) => { event.stopPropagation(); toggleImportant(notification.id) }} title={notification.important ? 'Remove important' : 'Mark important'} className={notification.important ? 'rounded-button p-2 text-status-warning-text' : 'rounded-button p-2 text-text-muted hover:bg-slate-100'}><Star size={18} fill={notification.important ? 'currentColor' : 'none'} /></button>
                </div>
              </article>
            )
          })}
          {visible.length === 0 && <div className="rounded-card border border-dashed border-outline bg-white p-12 text-center"><Bell className="mx-auto text-text-muted" /><h2 className="mt-3 text-heading-3 font-bold text-navy">No notifications</h2><p className="mt-2 text-body text-text-muted">Tenant workflow updates will appear here during this browser session.</p></div>}
        </section>
      </div>
    </div>
  )
}
