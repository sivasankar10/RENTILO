import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bath,
  Bed,
  Calendar,
  CheckCircle2,
  Circle,
  Eye,
  Info,
  Pencil,
  Ruler,
  Zap,
} from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'

const tenantSignals = [
  {
    icon: Eye,
    title: '3 people interested',
    description: 'Viewing listing details right now',
    state: 'active',
  },
  {
    icon: Calendar,
    title: 'New viewing request',
    description: 'Request received 15 mins ago',
    state: 'restricted',
  },
]

const initialActivityItems = [
  { label: 'Login / Check-in', complete: true },
  { label: 'Edit Listing', complete: true },
  { label: 'Respond to Requests', complete: false },
]

const advantageItems = [
  'Detailed Viewer Insights',
  'Direct Message Tenants',
  'Lease Templates',
]

export function OwnerDashboard() {
  const navigate = useNavigate()
  const [activityItems, setActivityItems] = useState(initialActivityItems)
  const completedCount = activityItems.filter((item) => item.complete).length

  const toggleActivity = (label: string) => {
    setActivityItems((items) =>
      items.map((item) =>
        item.label === label ? { ...item, complete: !item.complete } : item
      )
    )
  }

  return (
    <div className="min-h-screen bg-canvas-alt px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <section className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-body-lg font-semibold tracking-tight text-text-primary">
                  Free Plan Dashboard
                </h1>
                <span className="rounded-pill bg-primary-100 px-2.5 py-1 text-badge uppercase text-primary">
                  Free
                </span>
              </div>
              <p className="mt-2 text-body text-text-muted">
                Manage your active listing and monitor tenant signals.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-3 rounded-button border border-outline bg-white px-4 py-2 text-label font-semibold text-text-primary shadow-sm">
              <span className="h-2 w-2 rounded-full bg-status-success" />
              <span>Online: Johnathan Smith</span>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
            <div className="space-y-6">
              <article className="overflow-hidden rounded-card border border-outline bg-white shadow-surface">
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.OWNER.PROPERTY_DETAIL('opus-tower-14b'))}
                  className="block w-full text-left"
                >
                  <div className="relative h-64 overflow-hidden bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                    alt="Modern rental property with pool and glass facade"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-6 top-6 rounded-pill bg-primary-50 px-2.5 py-1 text-badge uppercase text-primary">
                    Active
                  </span>
                  </div>

                  <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2 className="text-body-lg font-semibold text-text-primary">
                        The Opus Tower, 14B
                      </h2>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-label text-text-muted">
                        <span className="inline-flex items-center gap-1">
                          <Bed size={14} />
                          2 Beds
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Bath size={14} />
                          2 Baths
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Ruler size={14} />
                          1,200 sqft
                        </span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-heading-2 font-bold tracking-tight text-primary">
                        $4,500/mo
                      </p>
                    </div>
                  </div>
                </button>

                <div className="border-t border-outline px-6 pb-6 pt-0 text-left sm:text-right">
                    <button
                      type="button"
                      onClick={() => navigate(ROUTES.OWNER.PROPERTIES)}
                      className="mt-2 inline-flex items-center gap-2 text-label font-bold text-primary transition-colors duration-200 hover:text-primary-700"
                    >
                      Edit Details
                      <Pencil size={14} />
                    </button>
                </div>
              </article>

              <article className="rounded-card border border-outline bg-white p-6 shadow-surface">
                <div className="flex items-center justify-between gap-4 border-b border-outline pb-4">
                  <h2 className="text-body-lg font-semibold text-text-primary">Tenant Signals</h2>
                  <span className="text-label text-text-muted">Past 24 Hours</span>
                </div>

                <div className="mt-4 space-y-4">
                  {tenantSignals.map((signal) => {
                    const Icon = signal.icon
                    const isRestricted = signal.state === 'restricted'

                    return (
                      <div
                        key={signal.title}
                        className="relative flex items-center gap-4 rounded-button border border-outline bg-white p-4"
                      >
                        <div
                          className={
                            isRestricted
                              ? 'flex h-10 w-10 items-center justify-center rounded-button bg-status-warning-bg text-status-warning'
                              : 'flex h-10 w-10 items-center justify-center rounded-button bg-primary-50 text-primary'
                          }
                        >
                          <Icon size={18} />
                        </div>
                        <div className={isRestricted ? 'blur-sm' : ''}>
                          <p className="text-body font-semibold text-text-primary">{signal.title}</p>
                          <p className="text-label text-text-muted">{signal.description}</p>
                        </div>
                        {isRestricted && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-button bg-white/40 text-center">
                            <span className="text-badge font-bold text-text-primary">
                              Details Restricted
                            </span>
                            <button
                              type="button"
                              onClick={() => navigate(ROUTES.OWNER.PLANS_RULES)}
                              className="mt-1 text-badge uppercase text-primary"
                            >
                              Upgrade Plan
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </article>

              <p className="flex items-center gap-2 text-label text-slate-400">
                <Info size={14} />
                Your listing is currently ranked based on daily activity.
              </p>
            </div>

            <aside className="space-y-6">
              <article className="rounded-card border border-navy bg-navy p-6 text-white shadow-modal">
                <h2 className="text-body-lg font-semibold">Daily Activity</h2>
                <div className="mt-6">
                  <div className="flex items-center justify-between text-label">
                    <span>Visibility Boost</span>
                    <span>
                      {completedCount}/{activityItems.length} Completed
                    </span>
                  </div>
                  <div className="mt-3 h-2 rounded-pill bg-slate-800">
                    <div
                      className="h-full rounded-pill bg-primary transition-all duration-200"
                      style={{ width: `${(completedCount / activityItems.length) * 100}%` }}
                    />
                  </div>
                  <p className="mt-4 text-label leading-5 text-slate-400">
                    Complete these to boost visibility in local searches.
                  </p>
                </div>

                <div className="mt-8 space-y-4">
                  {activityItems.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => toggleActivity(item.label)}
                      className={
                        item.complete
                          ? 'flex w-full items-center gap-3 rounded-button border border-slate-700 bg-white/5 px-4 py-3 text-left text-label font-semibold text-white transition-colors duration-200 hover:bg-white/10'
                          : 'flex w-full items-center gap-3 rounded-button border border-slate-800 bg-navy px-4 py-3 text-left text-label font-semibold text-slate-500'
                      }
                    >
                      {item.complete ? (
                        <CheckCircle2 size={18} className="text-status-success" />
                      ) : (
                        <Circle size={18} className="text-slate-600" />
                      )}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </article>

              <article className="rounded-card border border-dashed border-primary-100 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <Zap size={18} className="text-primary" />
                  <h2 className="text-body-lg font-semibold text-text-primary">Pro Advantage</h2>
                </div>
                <p className="mt-4 text-label leading-5 text-text-muted">
                  Unlock full analytics, unlimited listings, and priority tenant communication
                  tools.
                </p>
                <ul className="mt-6 space-y-3">
                  {advantageItems.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-label text-text-muted">
                      <CheckCircle2 size={14} className="text-status-success" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.OWNER.PLANS_RULES)}
                  className="mt-6 w-full rounded-button bg-primary px-4 py-3 text-body font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-700 hover:shadow-md"
                >
                  Start 7-Day Trial
                </button>
              </article>
            </aside>
          </div>
        </section>
      </div>
    </div>
  )
}
