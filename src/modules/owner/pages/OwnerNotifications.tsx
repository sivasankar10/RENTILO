import { useState } from 'react'
import { Bell, Check, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { usePrototypeStore } from '@shared/store/prototypeStore'
import { useOnboardingStore } from '@shared/store/onboardingStore'
import { useAuth } from '@shared/hooks/useAuth'

const filters = ['All', 'Unread', 'Important'] as const

export function OwnerNotifications() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const ownerId = user?.id ?? ''
  const [filter, setFilter] = useState<(typeof filters)[number]>('All')

  // ── Prototype store notifications (broker requests, assignments, etc.)
  const protoNotifications = usePrototypeStore((state) =>
    state.notifications.filter(
      (n) =>
        n.userId === ownerId ||
        ((n.role === 'owner' || n.role === 'all') && !n.userId), // broadcast to owners or everyone
    ),
  )
  const markProtoRead = usePrototypeStore((state) => state.markNotificationRead)

  // ── Onboarding store notifications (tenant workflow: agreements, payments, etc.)
  const onboardingNotifications = useOnboardingStore((state) =>
    state.notifications.filter((n) => n.audience === 'owner'),
  )
  const records = useOnboardingStore((state) => state.records)
  const confirmOnboarding = useOnboardingStore((state) => state.confirmTenantOnboarding)
  const markOnboardingRead = useOnboardingStore((state) => state.markNotificationRead)
  const ownerOnboardingNotifs = onboardingNotifications.filter((n) =>
    records.some((r) => r.id === n.onboardingId && r.owner.id === ownerId),
  )

  // ── Merge both sources into a unified list ──────────────────────────────────
  type UnifiedNotif = {
    id: string
    title: string
    description: string
    unread: boolean
    important: boolean
    createdAt: string
    action?: string
    relatedId?: string
    source: 'proto' | 'onboarding'
    onboardingId?: string
  }

  const merged: UnifiedNotif[] = [
    ...protoNotifications.map((n) => ({
      id: n.id,
      title: n.title,
      description: n.description,
      unread: n.unread,
      important: n.important,
      createdAt: new Date(n.createdAt).toLocaleString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
      }),
      action: n.action,
      relatedId: n.relatedId,
      source: 'proto' as const,
    })),
    ...ownerOnboardingNotifs.map((n) => ({
      id: n.id,
      title: n.title,
      description: n.description,
      unread: n.unread,
      important: n.important,
      createdAt: n.createdAt,
      action: n.action,
      onboardingId: n.onboardingId,
      source: 'onboarding' as const,
    })),
  ].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))

  const visible = merged.filter((n) =>
    filter === 'All' ||
    (filter === 'Unread' && n.unread) ||
    (filter === 'Important' && n.important),
  )
  const unreadCount = merged.filter((n) => n.unread).length

  function handleClick(n: UnifiedNotif) {
    if (n.source === 'proto') {
      markProtoRead(n.id)
      if (n.action === 'review_broker_request') navigate('/owner/brokers')
      else if (n.action === 'view_assignment') navigate('/owner/brokers')
      else if (n.action === 'view_listing') navigate('/owner/portfolio')
    } else {
      markOnboardingRead(n.id)
      if (n.onboardingId) navigate(`/owner/leases?tab=applications&application=${n.onboardingId}`)
    }
  }

  return (
    <div className="min-h-screen bg-canvas-alt px-5 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-heading-1 font-extrabold text-navy">Notifications</h1>
            <p className="mt-2 text-body text-text-muted">
              Application approvals, agreement signatures, broker requests, and tenant onboarding actions.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-button bg-slate-100 p-1">
              {filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={filter === f
                    ? 'rounded-button bg-white px-4 py-2 text-label font-bold text-navy shadow-sm'
                    : 'px-4 py-2 text-label font-semibold text-text-muted'}
                >
                  {f}{f === 'Unread' && unreadCount > 0 ? ` (${unreadCount})` : ''}
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={!unreadCount}
              onClick={() => {
                protoNotifications.filter((n) => n.unread).forEach((n) => markProtoRead(n.id))
                ownerOnboardingNotifs.filter((n) => n.unread).forEach((n) => markOnboardingRead(n.id))
              }}
              className="text-label font-bold text-primary disabled:opacity-40"
            >
              Mark all as read
            </button>
          </div>
        </header>

        <section className="mt-8 space-y-4">
          {visible.map((n) => {
            const onboardingRecord = n.onboardingId
              ? records.find((r) => r.id === n.onboardingId && r.owner.id === ownerId)
              : undefined

            return (
              <article
                key={n.id}
                onClick={() => handleClick(n)}
                className={
                  n.unread
                    ? 'cursor-pointer rounded-card border border-primary/30 bg-white p-5 shadow-surface'
                    : 'cursor-pointer rounded-card border border-outline bg-white p-5'
                }
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-button bg-primary-50 text-primary">
                    <Bell size={19} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-body font-bold text-navy">{n.title}</h2>
                      {n.unread && <span className="h-2 w-2 rounded-full bg-primary" />}
                      {n.important && (
                        <span className="rounded-pill bg-status-warning-bg px-2 py-0.5 text-[10px] font-bold uppercase text-status-warning-text">
                          Important
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-label text-text-primary">{n.description}</p>
                    <p className="mt-2 text-filter-label uppercase text-text-muted">{n.createdAt}</p>

                    {/* Inline onboard action for tenant payment notifications */}
                    {n.action === 'onboard' && onboardingRecord?.status === 'payment_completed' && n.onboardingId && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          confirmOnboarding(n.onboardingId!)
                          markOnboardingRead(n.id)
                        }}
                        className="mt-4 flex items-center gap-2 rounded-button bg-status-success px-4 py-2.5 text-label font-bold text-white"
                      >
                        <Check size={16} /> Yes, onboard tenant
                      </button>
                    )}

                    {/* Inline action for broker requests */}
                    {n.action === 'review_broker_request' && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleClick(n) }}
                        className="mt-3 text-label font-bold text-primary hover:underline"
                      >
                        Review request →
                      </button>
                    )}
                  </div>
                  <Star size={18} className={n.important ? 'text-status-warning-text' : 'text-text-muted'} fill={n.important ? 'currentColor' : 'none'} />
                </div>
              </article>
            )
          })}

          {visible.length === 0 && (
            <div className="rounded-card border border-dashed border-outline bg-white p-12 text-center">
              <Bell className="mx-auto text-text-muted" />
              <h2 className="mt-3 text-heading-3 font-bold text-navy">No notifications</h2>
              <p className="mt-2 text-body text-text-muted">
                Tenant workflow updates and broker requests will appear here.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
