import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Award,
  BadgeInfo,
  Bath,
  Bed,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  Info,
  MessageCircle,
  Phone,
  Ruler,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  UserCheck,
  UserX,
  Users,
  X,
} from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { useOwnerStore } from '../store/ownerStore'

type BrokerCandidate = {
  id: string
  conversationId: number
  name: string
  title: string
  rating: number
  reviews: number
  propertiesManaged: string
  occupancyRate: string
  responseTime: string
  specialty: string
  location: string
  avatar: string
  quote: string
}

type BrokerAssignmentUpdate = {
  leadsFound: number
  qualifiedLeads: number
  status: string
  nextAction: string
  lastUpdated: string
}

const portfolioProperty = {
  name: 'Skyline Heights - Unit 402',
  address: '1248 Park Avenue, New York',
}

const suggestedBroker: BrokerCandidate = {
  id: 'alexander-pierce',
  conversationId: 6,
  name: 'Alexander Pierce',
  title: 'Senior Portfolio Manager',
  rating: 4.9,
  reviews: 128,
  propertiesManaged: '150+',
  occupancyRate: '98%',
  responseTime: '12 mins',
  specialty: 'Luxury rentals and premium tenant vetting',
  location: 'New York',
  avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&q=80',
  quote:
    '12 years of experience in the NY luxury rental market. Specialized in high-occupancy strategies and premium tenant vetting.',
}

const brokerCandidates: BrokerCandidate[] = [
  suggestedBroker,
  {
    id: 'maya-deshpande',
    conversationId: 2,
    name: 'Maya Deshpande',
    title: 'Tenant Acquisition Lead',
    rating: 4.8,
    reviews: 96,
    propertiesManaged: '118',
    occupancyRate: '96%',
    responseTime: '18 mins',
    specialty: 'Family tenants and lease negotiation',
    location: 'Manhattan',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
    quote:
      'Strong leasing record for mid and premium apartments with a focus on fast tenant onboarding.',
  },
  {
    id: 'jordan-lee',
    conversationId: 1,
    name: 'Jordan Lee',
    title: 'Residential Leasing Specialist',
    rating: 4.7,
    reviews: 84,
    propertiesManaged: '92',
    occupancyRate: '94%',
    responseTime: '21 mins',
    specialty: 'Young professionals and furnished units',
    location: 'Brooklyn',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
    quote:
      'Experienced in high-response listing campaigns and guided virtual property tours.',
  },
  {
    id: 'priya-menon',
    conversationId: 7,
    name: 'Priya Menon',
    title: 'Premium Homes Advisor',
    rating: 4.6,
    reviews: 73,
    propertiesManaged: '76',
    occupancyRate: '93%',
    responseTime: '25 mins',
    specialty: 'Verified leads and move-in coordination',
    location: 'Queens',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&q=80',
    quote:
      'Known for tight follow-ups, tenant checks, and clean handoffs from viewing to lease signing.',
  },
]

const brokerAssignmentUpdates: Record<string, BrokerAssignmentUpdate> = {
  'alexander-pierce': {
    leadsFound: 24,
    qualifiedLeads: 9,
    status: 'Tenant matching active',
    nextAction: 'Shortlist review due today',
    lastUpdated: 'Updated 8 mins ago',
  },
  'maya-deshpande': {
    leadsFound: 18,
    qualifiedLeads: 7,
    status: 'Viewing slots being filled',
    nextAction: 'Follow up with family leads',
    lastUpdated: 'Updated 14 mins ago',
  },
  'jordan-lee': {
    leadsFound: 15,
    qualifiedLeads: 5,
    status: 'Campaign in progress',
    nextAction: 'Review furnished-unit leads',
    lastUpdated: 'Updated 21 mins ago',
  },
  'priya-menon': {
    leadsFound: 12,
    qualifiedLeads: 4,
    status: 'Verification calls active',
    nextAction: 'Confirm two move-in dates',
    lastUpdated: 'Updated 30 mins ago',
  },
}

const benefits = [
  {
    icon: ShieldCheck,
    title: '20% Faster Matching',
    description: 'with the suitable tenants',
  },
  {
    icon: Users,
    title: 'Rigorous Vetting',
    description: 'with 5-point tenant screening.',
  },
]

export function OwnerPortfolio() {
  const navigate = useNavigate()
  const registerPropertyDraft = useOwnerStore((state) => state.registerPropertyDraft)
  const [brokerStatus, setBrokerStatus] = useState('Awaiting broker decision.')
  const [propertyPosted, setPropertyPosted] = useState(false)
  const [brokerPickerOpen, setBrokerPickerOpen] = useState(false)
  const [brokerSearch, setBrokerSearch] = useState('')
  const [assignedBrokerId, setAssignedBrokerId] = useState<string | null>(null)
  const [rejectedBrokerIds, setRejectedBrokerIds] = useState<string[]>([])

  const assignedBroker =
    brokerCandidates.find((broker) => broker.id === assignedBrokerId) ?? null
  const cardBroker = assignedBroker ?? suggestedBroker
  const assignedBrokerUpdate = assignedBroker
    ? brokerAssignmentUpdates[assignedBroker.id]
    : null
  const suggestedBrokerRejected = rejectedBrokerIds.includes(suggestedBroker.id)
  const suggestedBrokerAssigned = assignedBrokerId === suggestedBroker.id
  const visibleBrokers = brokerCandidates.filter((broker) => {
    const query = brokerSearch.trim().toLowerCase()
    if (!query) {
      return true
    }

    return [broker.name, broker.title, broker.specialty, broker.location].some((field) =>
      field.toLowerCase().includes(query),
    )
  })

  const assignBroker = (broker: BrokerCandidate) => {
    setAssignedBrokerId(broker.id)
    setRejectedBrokerIds((current) => current.filter((id) => id !== broker.id))
    setBrokerStatus(`${broker.name} has been assigned to ${portfolioProperty.name}.`)
    setPropertyPosted(true)
    setBrokerPickerOpen(false)
    navigate(`${ROUTES.OWNER.MESSAGES}?conversation=${broker.conversationId}`)
  }

  const rejectBroker = (broker: BrokerCandidate) => {
    setRejectedBrokerIds((current) =>
      current.includes(broker.id) ? current : [...current, broker.id],
    )
    setBrokerStatus(`${broker.name} was rejected for ${portfolioProperty.name}.`)
  }

  const removeAssignedBroker = () => {
    if (!assignedBroker) {
      return
    }

    setBrokerStatus(`${assignedBroker.name} was removed from ${portfolioProperty.name}.`)
    setAssignedBrokerId(null)
    setPropertyPosted(false)
  }

  return (
    <div className="min-h-screen bg-canvas-alt px-6 py-10">
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 text-filter-label uppercase tracking-normal text-navy">
                <CircleDollarSign size={14} />
                Portfolio Overview
              </p>
              <h1 className="mt-2 text-heading-1 font-bold tracking-tight text-navy">
                Your Properties
              </h1>
              <p className="mt-2 max-w-xl text-body leading-6 text-text-primary">
                Monitor and manage your luxury estates. Upgrade your plan to expand your portfolio
                beyond the initial starter asset.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="inline-flex items-center gap-2 rounded-button bg-status-error-bg px-4 py-3 text-label font-bold text-status-error-text">
                <BadgeInfo size={16} />
                Free Plan: 1/1 Property Listed
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-label text-text-primary">
            <span>Eligible Properties</span>
            <span className="text-primary">3 Properties Available</span>
          </div>

          <article className="rounded-card border border-outline bg-white p-6 shadow-surface">
            <div className="grid gap-5 md:grid-cols-[220px_minmax(0,1fr)_160px] md:items-center">
              <img
                src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=700&q=80"
                alt="Skyline Heights apartment building"
                className="h-36 w-full rounded-button object-cover"
              />

              <div>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-body-lg font-bold text-text-primary">
                      {portfolioProperty.name}
                    </h2>
                    <p className="mt-1 text-label text-text-primary">{portfolioProperty.address}</p>
                  </div>
                  <span className="rounded-pill bg-status-success-bg px-3 py-1.5 text-badge uppercase text-status-success-text">
                    Vacant
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-label text-text-muted">
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

                <p className="mt-8 text-heading-2 font-bold tracking-tight text-primary">
                  ${Number(registerPropertyDraft.baseRent || 4500).toLocaleString('en-US')}{' '}
                  <span className="text-label font-medium text-text-muted">/ mo</span>
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-label font-semibold">
                  <span className="inline-flex items-center gap-1.5 rounded-pill bg-canvas-alt px-3 py-1.5 text-text-primary">
                    <CalendarClock size={14} />
                    Visits: {registerPropertyDraft.visitWeekday}, {registerPropertyDraft.visitStartTime} - {registerPropertyDraft.visitEndTime}
                  </span>
                  <span className="inline-flex items-center gap-2 text-text-primary">
                    Price
                    <span className="rounded-pill bg-canvas-alt px-3 py-1.5">
                      {registerPropertyDraft.priceNegotiable ? 'negotiable' : 'non negotiable'}
                    </span>
                  </span>
                </div>

                {assignedBroker && (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-button bg-primary-50 px-3 py-2 text-label font-semibold text-primary">
                    <UserCheck size={15} />
                    Broker assigned: {assignedBroker.name}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {assignedBroker && (
                  <div className="rounded-button border border-primary-100 bg-primary-50 p-3 text-label text-primary">
                    <p className="font-bold">{assignedBroker.rating.toFixed(1)}/5.0 rated</p>
                    <p className="mt-1 text-primary-700">{assignedBroker.responseTime} response</p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setBrokerPickerOpen(true)}
                  className="w-full rounded-button bg-navy px-4 py-3 text-body font-semibold text-white transition-all duration-200 hover:bg-slate-800 hover:shadow-md"
                >
                  {assignedBroker ? 'Change Broker' : 'Assign Broker'}
                </button>
              </div>
            </div>
          </article>

          <article className="rounded-card bg-[#1f4b6d] p-8 text-white shadow-surface">
            <h2 className="text-heading-2 font-bold leading-tight">
              Scale your legacy
              <br />
              with Premium
            </h2>
            <ul className="mt-5 space-y-3 text-body text-blue-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} />
                Unlimited property listings
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} />
                Advanced financial analytics
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} />
                AI-driven tenant matching
              </li>
            </ul>
            <button
              type="button"
              onClick={() => navigate(ROUTES.OWNER.PREMIUM_PAYMENT)}
              className="mt-6 w-full rounded-button bg-blue-100 px-4 py-4 text-body font-bold text-navy transition-all duration-200 hover:bg-white hover:shadow-md"
            >
              Go Premium
            </button>
          </article>
        </section>

        <aside className="space-y-6">
          <article className="rounded-modal bg-navy p-6 text-white shadow-modal">
            <p className="inline-flex items-center gap-2 text-filter-label uppercase tracking-normal text-blue-200">
              <Sparkles size={14} />
              {assignedBroker ? 'Assigned Broker' : 'Suggested For You'}
            </p>

            <div className="mt-6 text-center">
              <div className="mx-auto h-24 w-24 overflow-hidden rounded-modal border-4 border-primary-700 bg-primary-100 p-1">
                <img
                  src={cardBroker.avatar}
                  alt={`${cardBroker.name} broker portrait`}
                  className="h-full w-full rounded-card object-cover"
                />
              </div>
              <h2 className="mt-4 text-heading-3 font-semibold text-white">{cardBroker.name}</h2>
              <p className="mt-1 text-body text-slate-300">{cardBroker.title}</p>
              <div className="mt-3 flex items-center justify-center gap-1">
                {[1, 2, 3, 4, 5].map((item) => (
                  <Star key={item} size={16} className="fill-status-warning text-status-warning" />
                ))}
                <span className="ml-2 text-body font-semibold">
                  {cardBroker.rating.toFixed(1)}/5.0
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-button border border-slate-700 p-4 text-label leading-5 text-slate-300">
              "{cardBroker.quote}"
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-button border border-slate-700 p-4 text-center">
                <p className="text-body font-bold text-primary-100">
                  {cardBroker.propertiesManaged}
                </p>
                <p className="mt-1 text-filter-label uppercase text-slate-400">Properties Managed</p>
              </div>
              <div className="rounded-button border border-slate-700 p-4 text-center">
                <p className="text-body font-bold text-primary-100">
                  {cardBroker.occupancyRate}
                </p>
                <p className="mt-1 text-filter-label uppercase text-slate-400">Occupancy Rate</p>
              </div>
            </div>

            {assignedBrokerUpdate && (
              <div className="mt-4 rounded-button border border-primary-700 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-filter-label uppercase tracking-normal text-blue-200">
                    Assignment Updates
                  </p>
                  <span className="rounded-pill bg-status-success-bg px-2.5 py-1 text-badge uppercase text-status-success-text">
                    Active
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-heading-3 font-bold text-white">
                      {assignedBrokerUpdate.leadsFound}
                    </p>
                    <p className="mt-1 text-filter-label uppercase text-slate-400">Leads Found</p>
                  </div>
                  <div>
                    <p className="text-heading-3 font-bold text-white">
                      {assignedBrokerUpdate.qualifiedLeads}
                    </p>
                    <p className="mt-1 text-filter-label uppercase text-slate-400">Qualified</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-label leading-5 text-slate-300">
                  <p>
                    <span className="font-bold text-white">Status:</span>{' '}
                    {assignedBrokerUpdate.status}
                  </p>
                  <p>
                    <span className="font-bold text-white">Next:</span>{' '}
                    {assignedBrokerUpdate.nextAction}
                  </p>
                  <p className="text-slate-400">{assignedBrokerUpdate.lastUpdated}</p>
                </div>
              </div>
            )}

            {assignedBroker ? (
              <button
                type="button"
                onClick={removeAssignedBroker}
                className="mt-6 w-full rounded-button bg-red-700 px-4 py-4 text-body font-semibold text-white transition-colors duration-200 hover:bg-red-800"
              >
                Remove Broker
              </button>
            ) : (
              <div className="mt-6 space-y-0">
                <button
                  type="button"
                  onClick={() => assignBroker(suggestedBroker)}
                  disabled={suggestedBrokerAssigned || suggestedBrokerRejected}
                  className="flex w-full items-center justify-center gap-3 rounded-t-button bg-primary px-4 py-4 text-body font-semibold text-white transition-colors duration-200 hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-600"
                >
                  {suggestedBrokerAssigned
                    ? 'Assigned'
                    : suggestedBrokerRejected
                      ? 'Rejected'
                      : 'Assign'}
                  <ArrowRight size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => rejectBroker(suggestedBroker)}
                  disabled={suggestedBrokerAssigned || suggestedBrokerRejected}
                  className="w-full rounded-b-button bg-red-700 px-4 py-4 text-body font-semibold text-white transition-colors duration-200 hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-slate-700"
                >
                  {suggestedBrokerRejected ? 'Rejected' : 'Reject'}
                </button>
              </div>
            )}
          </article>

          <article className="border-l-4 border-primary bg-primary-50 p-5">
            <div className="flex gap-3">
              <Info size={18} className="mt-1 text-primary" />
              <div>
                <h3 className="text-body font-bold text-primary">Request Status</h3>
                <p className="mt-1 text-label leading-5 text-primary">
                  {brokerStatus}
                  {propertyPosted && ' Expect a verification call within 24 hours.'}
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-card border border-outline bg-white p-5 shadow-sm">
            <h3 className="text-body font-bold text-text-primary">Management Benefits</h3>
            <div className="mt-5 space-y-4">
              {benefits.map((benefit) => {
                const Icon = benefit.icon
                return (
                  <div key={benefit.title} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-button bg-primary-50 text-primary">
                      <Icon size={16} />
                    </div>
                    <div>
                      <p className="text-label font-bold text-text-primary">{benefit.title}</p>
                      <p className="text-label leading-5 text-text-muted">{benefit.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </article>
        </aside>
      </div>

      {brokerPickerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/60 px-4 py-6 backdrop-blur-sm md:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="broker-picker-title"
        >
          <section className="flex max-h-[calc(100vh-3rem)] w-full max-w-5xl flex-col overflow-hidden rounded-modal bg-white shadow-modal">
            <header className="shrink-0 flex flex-col gap-4 border-b border-outline p-6 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 text-filter-label uppercase tracking-normal text-primary">
                  <BriefcaseBusiness size={14} />
                  Broker Assignment
                </p>
                <h2 id="broker-picker-title" className="mt-2 text-heading-2 font-bold text-navy">
                  Choose a Broker
                </h2>
                <p className="mt-1 text-body text-text-muted">
                  Assign a broker to {portfolioProperty.name} or reject unsuitable matches.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBrokerPickerOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-button border border-outline text-text-muted transition-colors duration-200 hover:bg-canvas-alt hover:text-navy"
                aria-label="Close broker picker"
              >
                <X size={18} />
              </button>
            </header>

            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-6">
              <label className="flex max-w-md items-center gap-3 rounded-button border border-outline bg-canvas-alt px-4 py-3 text-text-muted">
                <Search size={18} />
                <input
                  value={brokerSearch}
                  onChange={(event) => setBrokerSearch(event.target.value)}
                  placeholder="Search broker, specialty, location..."
                  className="w-full bg-transparent text-body text-text-primary outline-none placeholder:text-text-muted"
                />
              </label>

              <div className="overflow-x-auto rounded-card border border-outline">
                <table className="min-w-[860px] w-full border-collapse bg-white text-left">
                  <thead className="bg-canvas-alt text-filter-label uppercase tracking-normal text-text-muted">
                    <tr>
                      <th className="px-5 py-4 font-bold">Broker</th>
                      <th className="px-5 py-4 font-bold">Rating</th>
                      <th className="px-5 py-4 font-bold">Performance</th>
                      <th className="px-5 py-4 font-bold">Specialty</th>
                      <th className="px-5 py-4 font-bold">Contact</th>
                      <th className="px-5 py-4 font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline">
                    {visibleBrokers.map((broker) => {
                      const brokerAssigned = assignedBrokerId === broker.id
                      const brokerRejected = rejectedBrokerIds.includes(broker.id)

                      return (
                        <tr key={broker.id} className="align-top">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={broker.avatar}
                                alt={`${broker.name} broker`}
                                className="h-12 w-12 rounded-button object-cover"
                              />
                              <div>
                                <p className="text-body font-bold text-text-primary">{broker.name}</p>
                                <p className="text-label text-text-muted">{broker.title}</p>
                                <p className="mt-1 text-label text-text-muted">{broker.location}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="inline-flex items-center gap-1 text-body font-bold text-text-primary">
                              <Star size={15} className="fill-status-warning text-status-warning" />
                              {broker.rating.toFixed(1)}
                            </div>
                            <p className="mt-1 text-label text-text-muted">{broker.reviews} reviews</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-label font-semibold text-text-primary">
                              {broker.propertiesManaged} managed
                            </p>
                            <p className="mt-1 text-label text-text-muted">
                              {broker.occupancyRate} occupancy
                            </p>
                            <p className="mt-1 text-label text-text-muted">
                              {broker.responseTime} avg response
                            </p>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-start gap-2 text-label leading-5 text-text-primary">
                              <Award size={15} className="mt-0.5 text-primary" />
                              {broker.specialty}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setBrokerStatus(`Chat opened with ${broker.name} for ${portfolioProperty.name}.`)
                                }
                                className="inline-flex h-9 w-9 items-center justify-center rounded-button border border-outline text-navy transition-colors duration-200 hover:bg-primary-50"
                                aria-label={`Chat with ${broker.name}`}
                              >
                                <MessageCircle size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setBrokerStatus(`Calling ${broker.name} about ${portfolioProperty.name}.`)
                                }
                                className="inline-flex h-9 w-9 items-center justify-center rounded-button border border-outline text-navy transition-colors duration-200 hover:bg-primary-50"
                                aria-label={`Call ${broker.name}`}
                              >
                                <Phone size={16} />
                              </button>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex flex-col gap-2">
                              <button
                                type="button"
                                onClick={() => assignBroker(broker)}
                                disabled={brokerAssigned || brokerRejected}
                                className="inline-flex items-center justify-center gap-2 rounded-button bg-navy px-4 py-2.5 text-label font-bold text-white transition-colors duration-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-text-muted"
                              >
                                <UserCheck size={15} />
                                {brokerAssigned ? 'Assigned' : 'Assign'}
                              </button>
                              <button
                                type="button"
                                onClick={() => rejectBroker(broker)}
                                disabled={brokerAssigned || brokerRejected}
                                className="inline-flex items-center justify-center gap-2 rounded-button border border-red-200 px-4 py-2.5 text-label font-bold text-red-700 transition-colors duration-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:border-outline disabled:text-text-muted"
                              >
                                <UserX size={15} />
                                {brokerRejected ? 'Rejected' : 'Reject'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                    {visibleBrokers.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-5 py-10 text-center text-body text-text-muted">
                          No brokers match this search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
