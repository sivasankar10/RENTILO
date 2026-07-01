import { useState } from 'react'
import { Bell, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@shared/constants/routes'
import { useOnboardingStore, tenantCanViewAgreement } from '@shared/store/onboardingStore'
import { TenantAccountSidebar } from '../components/TenantAccountSidebar'
import { useTenantId } from '../hooks/useTenantId'

const filters = ['All', 'Unread', 'Important'] as const

export function NotificationsPage() {
  const navigate = useNavigate()
  const tenantId = useTenantId()
  const [filter, setFilter] = useState<(typeof filters)[number]>('All')
  const notifications = useOnboardingStore((state) => state.notifications.filter((item) => item.audience === 'tenant'))
  const records = useOnboardingStore((state) => state.records)
  const markRead = useOnboardingStore((state) => state.markNotificationRead)
  const toggleImportant = useOnboardingStore((state) => state.toggleNotificationImportant)
  const tenantNotifications = notifications.filter((item) => records.some((record) => record.id === item.onboardingId && record.tenant.id === tenantId))
  const unreadCount = tenantNotifications.filter((item) => item.unread).length
  const visible = tenantNotifications.filter((item) => filter === 'All' || (filter === 'Unread' ? item.unread : item.important))

  const open = (notification: (typeof notifications)[number]) => {
    markRead(notification.id)
    const record = records.find((item) => item.id === notification.onboardingId && item.tenant.id === tenantId)
    if (!record) return
    if (notification.action === 'review_agreement' && tenantCanViewAgreement(record)) {
      navigate(ROUTES.TENANT.AGREEMENT(record.id))
    } else if (notification.action === 'pay') navigate(ROUTES.TENANT.ONBOARDING_PAYMENT(record.id))
    else if (notification.action === 'view_lease') navigate(ROUTES.TENANT.MY_LEASE)
    else navigate(`/tenant/properties/${record.tenantPropertyId}`)
  }

  return (
    <div className="flex min-h-0 flex-1 bg-brand-background">
      <TenantAccountSidebar />
      <main className="flex-1 overflow-y-auto px-6 py-10">
        <div className="mx-auto max-w-3xl">
          <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div><h1 className="font-display text-[32px] font-extrabold text-brand">Notifications</h1><p className="mt-2 font-body text-[15px] text-brand-on-surface-variant">Follow application approvals, agreements, payments, and check-in.</p></div>
            <div className="flex flex-col items-start gap-2 sm:items-end"><div className="flex rounded-full bg-brand-container-high p-1">{filters.map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={filter === item ? 'rounded-full bg-white px-4 py-2 text-sm font-bold text-brand shadow-sm' : 'px-4 py-2 text-sm font-semibold text-brand-outline'}>{item}{item === 'Unread' && unreadCount ? ` (${unreadCount})` : ''}</button>)}</div><button type="button" disabled={!unreadCount} onClick={() => tenantNotifications.forEach((item) => item.unread && markRead(item.id))} className="text-xs font-bold text-brand disabled:opacity-40">Mark all as read</button></div>
          </header>

          <section className="mt-8 space-y-4">
            {visible.map((notification) => (
              <article key={notification.id} onClick={() => open(notification)} className={notification.unread ? 'cursor-pointer rounded-xl border border-brand/30 bg-white p-5 shadow-sm' : 'cursor-pointer rounded-xl border border-brand-outline-variant bg-white p-5'}>
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-brand"><Bell size={19} /></div>
                  <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-body text-sm font-bold text-brand">{notification.title}</h2>{notification.unread && <span className="h-2 w-2 rounded-full bg-blue-500" />}{notification.important && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-700">Important</span>}</div><p className="mt-1 font-body text-sm text-brand-on-surface-variant">{notification.description}</p><p className="mt-2 text-[11px] font-bold uppercase text-brand-outline">{notification.createdAt}</p></div>
                  <button type="button" onClick={(event) => { event.stopPropagation(); toggleImportant(notification.id) }} className={notification.important ? 'p-2 text-amber-600' : 'p-2 text-brand-outline'}><Star size={18} fill={notification.important ? 'currentColor' : 'none'} /></button>
                </div>
              </article>
            ))}
            {visible.length === 0 && <div className="rounded-xl border border-dashed border-brand-outline-variant bg-white p-12 text-center"><Bell className="mx-auto text-brand-outline" /><h2 className="mt-3 font-display text-xl font-bold text-brand">No notifications</h2><p className="mt-2 font-body text-sm text-brand-on-surface-variant">Onboarding updates will appear here during this browser session.</p></div>}
          </section>
        </div>
      </main>
    </div>
  )
}
