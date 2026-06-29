import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  Clock,
  Home,
  MessageCircle,
  Phone,
  ShieldCheck,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { useOwnerChatStore } from '../store/chatStore'

const fallbackProfile = {
  id: 0,
  name: 'Broker Profile',
  role: 'Assigned Broker',
  avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&q=80',
  property: 'Assigned Property',
  propertyImage: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=180&q=80',
  listing: 'Owner Listing',
  location: 'Location unavailable',
  price: '$0',
}

const profileMetrics = {
  'Jordan Lee': {
    rating: '4.7',
    reviews: '84',
    managed: '92',
    occupancy: '94%',
    response: '21 mins',
    specialty: 'Young professionals and furnished units',
    bio: 'Jordan is a residential leasing specialist focused on quick tenant qualification, clean handoffs, and steady occupancy for premium owner portfolios.',
  },
  'Maya Deshpande': {
    rating: '4.8',
    reviews: '96',
    managed: '118',
    occupancy: '96%',
    response: '18 mins',
    specialty: 'Family tenants and lease negotiation',
    bio: 'Maya works with family tenants and mid-to-premium homes, combining fast follow-up with careful lease coordination.',
  },
  'Alexander Pierce': {
    rating: '4.9',
    reviews: '128',
    managed: '150+',
    occupancy: '98%',
    response: '12 mins',
    specialty: 'Luxury rentals and premium tenant vetting',
    bio: 'Alexander specializes in luxury rental strategy, tenant vetting, and high-occupancy campaigns for owner-managed premium listings.',
  },
  'Priya Menon': {
    rating: '4.6',
    reviews: '73',
    managed: '76',
    occupancy: '93%',
    response: '25 mins',
    specialty: 'Verified leads and move-in coordination',
    bio: 'Priya is known for verification calls, move-in coordination, and clear owner updates from first lead to final shortlist.',
  },
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Star
  label: string
  value: string
}) {
  return (
    <div className="rounded-card border border-outline bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-button bg-primary-100 text-primary">
          <Icon size={18} />
        </div>
        <div>
          <p className="text-label font-bold uppercase tracking-widest text-text-muted">{label}</p>
          <p className="mt-1 text-heading-3 font-bold text-text-primary">{value}</p>
        </div>
      </div>
    </div>
  )
}

export function OwnerBrokerProfile() {
  const { brokerId } = useParams()
  const navigate = useNavigate()
  const conversations = useOwnerChatStore((state) => state.conversations)

  const brokerConversation =
    conversations.find(
      (conversation) =>
        conversation.contactType === 'broker' && String(conversation.id) === String(brokerId)
    ) ?? null

  const broker = brokerConversation ?? fallbackProfile
  const metrics = profileMetrics[broker.name as keyof typeof profileMetrics] ?? profileMetrics['Alexander Pierce']

  const recentUpdates = useMemo(
    () => [
      `Assigned to ${broker.property}`,
      `Average response time: ${metrics.response}`,
      `Specialty match: ${metrics.specialty}`,
    ],
    [broker.property, metrics.response, metrics.specialty]
  )

  const openChat = () => {
    if (brokerConversation) {
      navigate(`${ROUTES.OWNER.MESSAGES}?conversation=${brokerConversation.id}`)
    } else {
      navigate(ROUTES.OWNER.MESSAGES)
    }
  }

  return (
    <div className="min-h-screen bg-canvas-alt px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <button
          type="button"
          onClick={() => navigate(ROUTES.OWNER.MESSAGES)}
          className="inline-flex items-center gap-2 text-body font-semibold text-text-muted transition-colors hover:text-text-primary"
        >
          <ArrowLeft size={16} />
          Back to Messages
        </button>

        <section className="overflow-hidden rounded-card border border-outline bg-white shadow-surface">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <img
                  src={broker.avatar}
                  alt={broker.name}
                  className="h-28 w-28 rounded-modal object-cover shadow-sm"
                />
                <div className="min-w-0 flex-1">
                  <p className="inline-flex items-center gap-2 text-filter-label uppercase tracking-normal text-primary">
                    <BriefcaseBusiness size={14} />
                    Broker Profile
                  </p>
                  <h1 className="mt-2 text-heading-1 font-bold tracking-tight text-text-primary">
                    {broker.name}
                  </h1>
                  <p className="mt-1 text-body-lg text-text-muted">{broker.role}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-pill bg-status-success-bg px-3 py-1.5 text-badge font-bold text-status-success-text">
                      <ShieldCheck size={14} />
                      Verified Broker
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-6 max-w-3xl text-body leading-7 text-text-primary">{metrics.bio}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={openChat}
                  className="inline-flex items-center gap-2 rounded-button bg-navy px-5 py-3 text-body font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  <MessageCircle size={17} />
                  Open Chat
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-button border border-outline bg-white px-5 py-3 text-body font-semibold text-text-primary transition-colors hover:bg-hover-light"
                >
                  <Phone size={17} />
                  Call Broker
                </button>
              </div>
            </div>

            <aside className="border-t border-outline bg-navy p-6 text-white lg:border-l lg:border-t-0">
              <p className="text-filter-label uppercase tracking-normal text-blue-200">Assigned Listing</p>
              <img
                src={broker.propertyImage}
                alt={broker.listing}
                className="mt-4 h-40 w-full rounded-card object-cover"
              />
              <h2 className="mt-4 text-heading-3 font-bold text-white">{broker.property}</h2>
              <p className="mt-1 text-label text-slate-300">{broker.location}</p>
              <div className="mt-4 rounded-button border border-slate-700 p-4">
                <p className="text-label text-slate-400">Current listing</p>
                <p className="mt-1 text-body font-bold text-white">{broker.listing}</p>
                <p className="mt-1 text-label text-slate-300">{broker.price} per month</p>
              </div>
            </aside>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <StatCard icon={Star} label="Rating" value={`${metrics.rating}/5.0`} />
          <StatCard icon={Users} label="Reviews" value={metrics.reviews} />
          <StatCard icon={Home} label="Managed" value={metrics.managed} />
          <StatCard icon={TrendingUp} label="Occupancy" value={metrics.occupancy} />
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="rounded-card border border-outline bg-white p-6 shadow-sm">
            <h2 className="text-heading-3 font-bold text-text-primary">Broker Performance</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-button bg-canvas-alt p-4">
                <p className="text-label font-bold uppercase tracking-widest text-text-muted">Response Time</p>
                <p className="mt-2 flex items-center gap-2 text-body-lg font-bold text-text-primary">
                  <Clock size={18} className="text-primary" />
                  {metrics.response}
                </p>
              </div>
              <div className="rounded-button bg-canvas-alt p-4">
                <p className="text-label font-bold uppercase tracking-widest text-text-muted">Specialty</p>
                <p className="mt-2 flex items-start gap-2 text-body font-bold text-text-primary">
                  <Award size={18} className="mt-0.5 text-primary" />
                  {metrics.specialty}
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-card border border-outline bg-white p-6 shadow-sm">
            <h2 className="text-heading-3 font-bold text-text-primary">Recent Updates</h2>
            <div className="mt-5 space-y-3">
              {recentUpdates.map((update) => (
                <div key={update} className="flex items-start gap-3 rounded-button bg-canvas-alt p-3">
                  <CheckCircle2 size={17} className="mt-0.5 text-status-success" />
                  <p className="text-label font-semibold text-text-primary">{update}</p>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </div>
  )
}
