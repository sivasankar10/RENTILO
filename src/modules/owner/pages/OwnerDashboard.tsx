import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bath,
  Bed,
  CheckCircle2,
  Circle,
  Crown,
  Eye,
  Info,
  MessageSquare,
  Pencil,
  Ruler,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { useAuth } from '@shared/hooks/useAuth'
import { DEMO_OWNER, getOwnerLeaseForProperty, useOnboardingStore } from '@shared/store/onboardingStore'
import { ListingPromotionPromoCard } from '../components/ListingPromotionPromoCard'
import { PRIMARY_OWNER_PROPERTY_ID } from '../constants/portfolioProperty'
import { PLAN_CONFIG } from '../config/features'
import { formatSubscriptionDate } from '../services/subscription.service'
import { useOwnerStore } from '../store/ownerStore'

const tenantSignals = [
  {
    icon: Eye,
    title: '3 people interested',
    description: 'Viewing listing details right now',
    state: 'active',
  },
  {
    icon: CheckCircle2,
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
  const { user } = useAuth()
  const { properties } = useOwnerPrototype()
  const selectedPropertyId = useOwnerStore((state) => state.selectedPropertyId)
  const currentPropertyId = properties.some((property) => property.id === selectedPropertyId) ? selectedPropertyId ?? PRIMARY_OWNER_PROPERTY_ID : properties[0]?.id ?? PRIMARY_OWNER_PROPERTY_ID
  const ownerId = user?.id ?? DEMO_OWNER.id
  const onboardingRecords = useOnboardingStore((state) => state.records)
  const activeLease = useMemo(
    () =>
      getOwnerLeaseForProperty(onboardingRecords, ownerId, currentPropertyId, ['active']),
    [currentPropertyId, onboardingRecords, ownerId],
  )
  const leaseWithPayment = useMemo(
    () =>
      getOwnerLeaseForProperty(onboardingRecords, ownerId, currentPropertyId, [
        'payment_completed',
        'active',
      ]),
    [currentPropertyId, onboardingRecords, ownerId],
  )
  const propertyOccupied = Boolean(activeLease)
  const [activityItems, setActivityItems] = useState(initialActivityItems)
  const completedCount = activityItems.filter((item) => item.complete).length
  
  // Get subscription state
  const { subscriptionPlan, subscribedAt } = useOwnerStore()
  const isPremium = subscriptionPlan === 'PREMIUM'
  const planConfig = PLAN_CONFIG[subscriptionPlan]

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
                  {isPremium ? 'Premium Dashboard' : 'Free Plan Dashboard'}
                </h1>
                <span className={`rounded-pill px-2.5 py-1 text-badge uppercase ${
                  isPremium 
                    ? 'bg-amber-100 text-amber-700' 
                    : 'bg-primary-100 text-primary'
                }`}>
                  {isPremium && <Crown size={12} className="inline mr-1 -mt-0.5" />}
                  {planConfig.name.replace(' Plan', '')}
                </span>
              </div>
              <p className="mt-2 text-body text-text-muted">
                {propertyOccupied
                  ? 'Your property is occupied. Manage the active tenant from the property overview.'
                  : leaseWithPayment
                    ? 'Payment received — complete tenant onboarding from Leases.'
                    : 'Manage your active listing and monitor tenant signals.'}
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-3 rounded-button border border-outline bg-white px-4 py-2 text-label font-semibold text-text-primary shadow-sm">
              <span className="h-2 w-2 rounded-full bg-status-success" />
              <span>Online: Johnathan Smith</span>
            </div>
          </div>

          {/* Premium Welcome Banner - Only show for premium users */}
          {isPremium && (
            <PremiumWelcomeBanner subscribedAt={subscribedAt} />
          )}

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
            <div className="space-y-6">
              {/* Premium Stats Row */}
              {isPremium && <PremiumStatsRow />}
              
              <article className="overflow-hidden rounded-card border border-outline bg-white shadow-surface">
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.OWNER.PROPERTY_DETAIL(currentPropertyId))}
                  className="block w-full text-left"
                >
                  <div className="relative h-64 overflow-hidden bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                    alt="Modern rental property with pool and glass facade"
                    className="h-full w-full object-cover"
                  />
                  <span
                    className={
                      propertyOccupied
                        ? 'absolute left-6 top-6 rounded-pill bg-primary-50 px-2.5 py-1 text-badge uppercase text-primary'
                        : leaseWithPayment
                          ? 'absolute left-6 top-6 rounded-pill bg-status-warning-bg px-2.5 py-1 text-badge uppercase text-status-warning-text'
                          : 'absolute left-6 top-6 rounded-pill bg-status-success-bg px-2.5 py-1 text-badge uppercase text-status-success-text'
                    }
                  >
                    {propertyOccupied ? 'Occupied' : leaseWithPayment ? 'Pending onboarding' : 'Vacant'}
                  </span>
                  {isPremium && (
                    <span className="absolute right-6 top-6 rounded-pill bg-amber-500 px-2.5 py-1 text-badge uppercase text-white flex items-center gap-1">
                      <Sparkles size={12} />
                      Promoted
                    </span>
                  )}
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
                      {leaseWithPayment && (
                        <p className="mt-3 inline-flex items-center gap-2 text-label font-semibold text-navy">
                          <Users size={14} />
                          {propertyOccupied
                            ? `Tenant: ${leaseWithPayment.tenant.name}`
                            : `Paid by ${leaseWithPayment.tenant.name}`}
                        </p>
                      )}
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
                      onClick={() => navigate(ROUTES.OWNER.PROPERTY_EDIT(currentPropertyId))}
                      className="mt-2 inline-flex items-center gap-2 text-label font-bold text-primary transition-colors duration-200 hover:text-primary-700"
                    >
                      Edit Details
                      <Pencil size={14} />
                    </button>
                </div>
              </article>

              {!leaseWithPayment && (
              <article className="rounded-card border border-outline bg-white p-6 shadow-surface">
                <div className="flex items-center justify-between gap-4 border-b border-outline pb-4">
                  <h2 className="text-body-lg font-semibold text-text-primary">Tenant Signals</h2>
                  <span className="text-label text-text-muted">Past 24 Hours</span>
                </div>

                <div className="mt-4 space-y-4">
                  {tenantSignals.map((signal) => {
                    const Icon = signal.icon
                    const isRestricted = signal.state === 'restricted' && !isPremium

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
              )}

              {leaseWithPayment && (
                <article className="rounded-card border border-primary/20 bg-primary-50/50 p-6 shadow-surface">
                  <h2 className="text-body-lg font-semibold text-navy">Active tenant application</h2>
                  <p className="mt-2 text-body text-text-muted">
                    {propertyOccupied
                      ? `${leaseWithPayment.tenant.name} is onboarded. Open the property overview for chat and lease documents.`
                      : `${leaseWithPayment.tenant.name} has paid. Confirm onboarding from Leases to mark the unit occupied.`}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => navigate(ROUTES.OWNER.PROPERTY_DETAIL(currentPropertyId))}
                      className="rounded-button bg-navy px-4 py-2.5 text-label font-bold text-white"
                    >
                      View tenant & documents
                    </button>
                    {!propertyOccupied && (
                      <button
                        type="button"
                        onClick={() => navigate(ROUTES.OWNER.LEASES)}
                        className="rounded-button border border-outline bg-white px-4 py-2.5 text-label font-bold text-navy"
                      >
                        Go to Leases
                      </button>
                    )}
                  </div>
                </article>
              )}

              <p className="flex items-center gap-2 text-label text-slate-400">
                <Info size={14} />
                {leaseWithPayment
                  ? 'Broker assignment is closed after the tenant completes onboarding payment.'
                  : 'Your listing is currently ranked based on daily activity.'}
              </p>
            </div>

            <aside className="space-y-6">
              <ListingPromotionPromoCard compact />

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
                  onClick={() => navigate(ROUTES.OWNER.PREMIUM_PAYMENT)}
                  className="mt-6 w-full rounded-button bg-primary px-4 py-3 text-body font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-700 hover:shadow-md"
                >
                  Upgrade to Premium
                </button>
              </article>
            </aside>
          </div>
        </section>
      </div>
    </div>
  )
}


/* ─────────────────────────────────────────────
   Premium Welcome Banner
───────────────────────────────────────────── */
function PremiumWelcomeBanner({ subscribedAt }: { subscribedAt: string | null }) {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 p-6 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Crown size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Premium Active</h2>
            <p className="text-white/80 text-sm mt-0.5">
              {subscribedAt 
                ? `Subscribed on ${formatSubscriptionDate(subscribedAt)}`
                : 'All premium features unlocked'
              }
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
          <CheckCircle2 size={16} />
          <span className="text-sm font-semibold">Subscription Active</span>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Premium Stats Row
───────────────────────────────────────────── */
function PremiumStatsRow() {
  const navigate = useNavigate()
  
  const stats = [
    { 
      label: 'Total Views', 
      value: '2,847', 
      change: '+12%', 
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    { 
      label: 'Active Inquiries', 
      value: '24', 
      change: '+8%', 
      icon: Users,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    { 
      label: 'Messages', 
      value: '156', 
      change: '+23%', 
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    { 
      label: 'Conversion Rate', 
      value: '8.4%', 
      change: '+2.1%', 
      icon: TrendingUp,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div 
            key={stat.label}
            className="rounded-xl border border-outline bg-white p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(ROUTES.OWNER.ANALYTICS)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <Icon size={18} className={stat.color} />
              </div>
              <span className="text-xs font-semibold text-emerald-600">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
            <p className="text-xs text-text-muted mt-1">{stat.label}</p>
          </div>
        )
      })}
    </div>
  )
}
