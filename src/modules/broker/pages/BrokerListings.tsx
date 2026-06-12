import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Star,
  TrendingUp,
  Sparkles,
  Search,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
  Zap,
  MoreVertical,
  X,
} from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { cn } from '@shared/utils/cn'
import skylinePlazaImg from '@/assets/images/skyline_plaza.png'
import harborResidencesImg from '@/assets/images/harbor_residences.png'
import skylineHeightsImg from '@/assets/images/skyline_heights.png'
import alpineTerraceImg from '@/assets/images/alpine_terrace_exterior.png'
import canaryWharfImg from '@/assets/images/canary_wharf.png'
import shoreditchImg from '@/assets/images/shoreditch_penthouse.png'
import greenwichImg from '@/assets/images/greenwich_home.png'

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type ListingStatus = 'active' | 'pending' | 'closed'

interface ActiveListing {
  id: string
  propertyId: string
  image: string
  name: string
  location: string
  type: string
  price: string
  beds: number
  baths: number
  sqft: string
  status: ListingStatus
  views: number
  leads: number
  daysListed: number
}

interface SuggestedProperty {
  id: string
  image: string
  name: string
  location: string
  type: string
  price: string
  beds: number
  baths: number
  sqft: string
  matchScore: number
  tags: string[]
  trending?: boolean
  propertyId: string
}

type RemovalRequest = {
  reason: string
  status: 'pending'
}

/* ─────────────────────────────────────────────
   Mock data — Active Listings
───────────────────────────────────────────── */
const activeListings: ActiveListing[] = [
  {
    id: 'sl-1',
    propertyId: 'skyline-plaza',
    image: skylinePlazaImg,
    name: 'Skyline Plaza',
    location: 'Financial District, NYC',
    type: 'Commercial',
    price: '$42,000,000',
    beds: 0,
    baths: 4,
    sqft: '18,400',
    status: 'active',
    views: 284,
    leads: 12,
    daysListed: 18,
  },
  {
    id: 'sl-2',
    propertyId: 'harbor-residences',
    image: harborResidencesImg,
    name: 'Harbor Residences 8C',
    location: 'Seaport Area, NYC',
    type: 'Mixed-Use',
    price: '$68,500,000',
    beds: 3,
    baths: 3,
    sqft: '3,200',
    status: 'active',
    views: 196,
    leads: 7,
    daysListed: 31,
  },
  {
    id: 'sl-3',
    propertyId: 'skyline-plaza',
    image: skylineHeightsImg,
    name: 'Skyline Heights 14B',
    location: 'Midtown, NYC',
    type: 'Residential',
    price: '$2,400,000',
    beds: 2,
    baths: 2,
    sqft: '1,850',
    status: 'pending',
    views: 412,
    leads: 21,
    daysListed: 9,
  },
]

/* ─────────────────────────────────────────────
   Mock data — Suggested Properties
───────────────────────────────────────────── */
const suggestedProperties: SuggestedProperty[] = [
  {
    id: 'sg-1',
    propertyId: 'shoreditch-penthouse',
    image: shoreditchImg,
    name: 'Shoreditch Penthouse',
    location: 'East London, UK',
    type: 'Penthouse',
    price: '$5,800,000',
    beds: 4,
    baths: 3,
    sqft: '4,100',
    matchScore: 98,
    tags: ['High Demand', 'Luxury'],
    trending: true,
  },
  {
    id: 'sg-2',
    propertyId: 'greenwich-modern-home',
    image: alpineTerraceImg,
    name: 'Alpine Terrace Estate',
    location: 'Upper West Side, NYC',
    type: 'Residential',
    price: '$3,250,000',
    beds: 4,
    baths: 3,
    sqft: '3,600',
    matchScore: 94,
    tags: ['New Listing', 'Hot Lead'],
  },
  {
    id: 'sg-3',
    propertyId: 'canary-wharf',
    image: canaryWharfImg,
    name: 'Canary Wharf Offices',
    location: 'Isle of Dogs, London',
    type: 'Commercial',
    price: '$12,100,000',
    beds: 0,
    baths: 6,
    sqft: '9,800',
    matchScore: 91,
    tags: ['Commercial', 'Prime Location'],
    trending: true,
  },
  {
    id: 'sg-4',
    propertyId: 'greenwich-modern-home',
    image: greenwichImg,
    name: 'Greenwich Park Home',
    location: 'Greenwich, London',
    type: 'Residential',
    price: '$1,875,000',
    beds: 3,
    baths: 2,
    sqft: '2,400',
    matchScore: 87,
    tags: ['Family Home', 'Garden'],
  },
]

/* ─────────────────────────────────────────────
   Status badge
───────────────────────────────────────────── */
function StatusBadge({ status }: { status: ListingStatus }) {
  const map: Record<ListingStatus, { label: string; icon: React.ReactNode; cls: string }> = {
    active: {
      label: 'Active',
      icon: <CheckCircle2 size={11} />,
      cls: 'bg-green-50 text-green-700 border-green-200',
    },
    pending: {
      label: 'Pending',
      icon: <Clock size={11} />,
      cls: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    closed: {
      label: 'Closed',
      icon: <XCircle size={11} />,
      cls: 'bg-red-50 text-red-600 border-red-200',
    },
  }
  const { label, icon, cls } = map[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border',
        cls,
      )}
    >
      {icon}
      {label}
    </span>
  )
}

/* ─────────────────────────────────────────────
   Active listing row
───────────────────────────────────────────── */
function ActiveListingRow({
  listing,
  removalRequest,
  actionOpen,
  onToggleAction,
  onRequestRemove,
  onOpenDetails,
}: {
  listing: ActiveListing
  removalRequest?: RemovalRequest
  actionOpen: boolean
  onToggleAction: () => void
  onRequestRemove: () => void
  onOpenDetails: () => void
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpenDetails}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpenDetails()
        }
      }}
      className="flex cursor-pointer items-start gap-4 bg-white border border-outline rounded-xl p-4 shadow-ambient hover:shadow-card-hover transition-shadow group focus:outline-none focus:ring-2 focus:ring-primary"
    >
      {/* Thumbnail */}
      <div className="relative shrink-0 w-24 h-20 rounded-lg overflow-hidden">
        <img
          src={listing.image}
          alt={listing.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/90 text-[#0f172a] backdrop-blur-sm">
          {listing.type}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <h3 className="text-[14px] font-bold text-[#0f172a]">{listing.name}</h3>
            <div className="flex items-center gap-1 mt-0.5 text-[12px] text-text-muted">
              <MapPin size={11} />
              <span>{listing.location}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <StatusBadge status={removalRequest ? 'pending' : listing.status} />
            {removalRequest && (
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                Waiting for admin reply
              </span>
            )}
          </div>
        </div>

        {/* Specs row */}
        <div className="flex items-center gap-3 mt-2 text-[12px] text-text-muted flex-wrap">
          {listing.beds > 0 && (
            <span className="flex items-center gap-1">
              <Bed size={11} /> {listing.beds} bed
            </span>
          )}
          <span className="flex items-center gap-1">
            <Bath size={11} /> {listing.baths} bath
          </span>
          <span className="flex items-center gap-1">
            <Square size={11} /> {listing.sqft} sq ft
          </span>
          <span className="font-bold text-[#0f172a] text-[13px]">{listing.price}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-2 text-[11px] text-text-muted">
          <span className="flex items-center gap-1">
            <Eye size={11} /> {listing.views} views
          </span>
          <span className="flex items-center gap-1 text-primary font-semibold">
            <Zap size={11} /> {listing.leads} leads
          </span>
          <span>{listing.daysListed}d listed</span>
        </div>
      </div>

      {/* Actions */}
      <div className="relative flex shrink-0 flex-col items-end gap-2">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onToggleAction()
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-[#0f172a] px-3 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-navy/80"
          aria-expanded={actionOpen}
        >
          Action
          <MoreVertical size={13} />
        </button>
        {actionOpen && (
          <div
            className="absolute right-0 top-9 z-30 w-52 overflow-hidden rounded-xl border border-outline bg-white shadow-card"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onRequestRemove}
              disabled={Boolean(removalRequest)}
              className="w-full px-4 py-3 text-left text-[12px] font-bold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:text-text-muted"
            >
              {removalRequest ? 'Removal request pending' : 'Request remove listing'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Suggested property card
───────────────────────────────────────────── */
function RequestListingCard({
  prop,
  requested,
  onToggleRequest,
}: {
  prop: SuggestedProperty
  requested: boolean
  onToggleRequest: () => void
}) {
  return (
    <div className="bg-white border border-outline rounded-xl overflow-hidden shadow-ambient hover:shadow-card-hover transition-all duration-200 group">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={prop.image}
          alt={prop.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/90 text-[#0f172a] backdrop-blur-sm">
            {prop.type}
          </span>
          {prop.trending && (
            <span className="flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white">
              <TrendingUp size={9} /> Trending
            </span>
          )}
        </div>
        {/* Match score pill */}
        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-1 bg-[#0f172a]/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-[10px] font-bold">
            <Star size={9} fill="currentColor" className="text-amber-300" />
            {prop.matchScore}% match
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="text-[15px] font-bold text-[#0f172a]">{prop.name}</h3>
        <div className="flex items-center gap-1 mt-0.5 text-[12px] text-text-muted">
          <MapPin size={11} />
          <span>{prop.location}</span>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-3 mt-2.5 text-[12px] text-text-muted">
          {prop.beds > 0 && (
            <span className="flex items-center gap-1">
              <Bed size={11} /> {prop.beds}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Bath size={11} /> {prop.baths}
          </span>
          <span className="flex items-center gap-1">
            <Square size={11} /> {prop.sqft}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {prop.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-outline">
          <span className="text-[15px] font-extrabold text-[#0f172a]">{prop.price}</span>
          <button
            type="button"
            onClick={onToggleRequest}
            className={cn(
              'flex items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] font-bold transition-colors',
              requested
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'bg-[#0f172a] text-white hover:bg-navy/80',
            )}
          >
            {requested ? 'Cancel Request' : 'Request'} <ChevronRight size={11} />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main page
───────────────────────────────────────────── */
function RequestNewListingModal({
  requestedIds,
  onToggleRequest,
  onClose,
}: {
  requestedIds: string[]
  onToggleRequest: (propertyId: string) => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-[#0f172a]/60 px-4 py-6 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-listing-title"
        className="w-full max-w-6xl rounded-2xl bg-canvas shadow-card"
      >
        <div className="flex items-start justify-between gap-4 border-b border-outline bg-white px-6 py-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Available Properties
            </p>
            <h2 id="request-listing-title" className="mt-1 text-[24px] font-extrabold text-[#0f172a]">
              Request New Listing
            </h2>
            <p className="mt-1 text-[13px] leading-relaxed text-text-muted">
              Pick properties you want to request for listing access. Requested properties can be cancelled from here.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-outline bg-white text-text-muted hover:bg-hover-light hover:text-[#0f172a]"
            aria-label="Close request listing popup"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid max-h-[70vh] gap-4 overflow-y-auto p-6 md:grid-cols-2 xl:grid-cols-3">
          {suggestedProperties.map((property) => (
            <RequestListingCard
              key={property.id}
              prop={property}
              requested={requestedIds.includes(property.id)}
              onToggleRequest={() => onToggleRequest(property.id)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

function RemovalReasonModal({
  listing,
  reason,
  onReasonChange,
  onSubmit,
  onClose,
}: {
  listing: ActiveListing
  reason: string
  onReasonChange: (reason: string) => void
  onSubmit: () => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#0f172a]/60 px-4 py-6 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="remove-listing-title"
        className="w-full max-w-lg rounded-2xl bg-white shadow-card"
      >
        <div className="flex items-start justify-between gap-4 border-b border-outline px-5 py-4">
          <div>
            <h2 id="remove-listing-title" className="text-[18px] font-extrabold text-[#0f172a]">
              Request Listing Removal
            </h2>
            <p className="mt-1 text-[13px] text-text-muted">{listing.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-text-muted hover:bg-hover-light hover:text-[#0f172a]"
            aria-label="Close removal reason popup"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          <label className="block">
            <span className="mb-2 block text-[12px] font-bold uppercase tracking-wider text-text-muted">
              Reason for removal
            </span>
            <textarea
              value={reason}
              onChange={(event) => onReasonChange(event.target.value)}
              rows={5}
              placeholder="Example: Owner asked to pause the listing while lease terms are updated."
              className="w-full resize-none rounded-xl border border-outline bg-canvas px-4 py-3 text-[14px] leading-relaxed text-[#0f172a] outline-none placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <p className="mt-3 rounded-lg bg-amber-50 px-4 py-3 text-[12px] leading-relaxed text-amber-700">
            Once submitted, the listing will show as pending until the admin replies.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-outline px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-lg border border-outline bg-white px-4 text-[13px] font-bold text-text-muted hover:bg-hover-light hover:text-[#0f172a]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!reason.trim()}
            className="h-10 rounded-lg bg-[#0f172a] px-4 text-[13px] font-bold text-white hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Submit Request
          </button>
        </div>
      </section>
    </div>
  )
}

type FilterTab = 'all' | 'active' | 'pending' | 'closed'

export function BrokerListings() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filterTab, setFilterTab] = useState<FilterTab>('all')
  const [requestModalOpen, setRequestModalOpen] = useState(false)
  const [requestedPropertyIds, setRequestedPropertyIds] = useState<string[]>([])
  const [openActionId, setOpenActionId] = useState<string | null>(null)
  const [removalTarget, setRemovalTarget] = useState<ActiveListing | null>(null)
  const [removalReason, setRemovalReason] = useState('')
  const [removalRequests, setRemovalRequests] = useState<Record<string, RemovalRequest>>({})

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'pending', label: 'Pending' },
    { key: 'closed', label: 'Closed' },
  ]

  const filtered = activeListings.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase())
    const effectiveStatus: ListingStatus = removalRequests[l.id] ? 'pending' : l.status
    const matchesTab = filterTab === 'all' || effectiveStatus === filterTab
    return matchesSearch && matchesTab
  })

  const toggleListingRequest = (propertyId: string) => {
    setRequestedPropertyIds((current) =>
      current.includes(propertyId)
        ? current.filter((id) => id !== propertyId)
        : [...current, propertyId],
    )
  }

  const openRemovalModal = (listing: ActiveListing) => {
    setRemovalTarget(listing)
    setRemovalReason('')
    setOpenActionId(null)
  }

  const submitRemovalRequest = () => {
    if (!removalTarget || !removalReason.trim()) {
      return
    }

    setRemovalRequests((current) => ({
      ...current,
      [removalTarget.id]: {
        reason: removalReason.trim(),
        status: 'pending',
      },
    }))
    setRemovalTarget(null)
    setRemovalReason('')
  }

  const activeCount = activeListings.filter(
    (listing) => listing.status === 'active' && !removalRequests[listing.id],
  ).length

  return (
    <div className="space-y-8 pb-12">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[26px] font-bold text-[#0f172a] tracking-tight">Listings</h1>
          <p className="text-[13px] text-text-muted mt-1">
            Manage your assigned property listings and discover new opportunities.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setRequestModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f172a] text-white text-[13px] font-bold hover:bg-navy/80 transition-colors shadow-ambient"
        >
          <Sparkles size={14} />
          Request New Listing
        </button>
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Listings', value: String(activeListings.length), color: 'bg-blue-50 text-blue-700' },
          { label: 'Active', value: String(activeCount), color: 'bg-green-50 text-green-700' },
          { label: 'Total Leads', value: String(activeListings.reduce((s, l) => s + l.leads, 0)), color: 'bg-amber-50 text-amber-700' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-outline rounded-xl p-4 shadow-ambient flex flex-col gap-1"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              {stat.label}
            </p>
            <p className="text-[24px] font-extrabold text-[#0f172a]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ── Active Listings ── */}
      <section>
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <h2 className="text-[18px] font-bold text-[#0f172a]">My Listings</h2>

          {/* Search row */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="search"
                placeholder="Search listings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pl-9 pr-3 rounded-lg border border-outline bg-white text-[13px] text-[#0f172a] placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-48"
              />
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 mb-4 bg-white border border-outline rounded-xl p-1 shadow-ambient w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterTab(tab.key)}
              className={cn(
                'px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-colors',
                filterTab === tab.key
                  ? 'bg-[#0f172a] text-white shadow-sm'
                  : 'text-text-muted hover:text-[#0f172a] hover:bg-hover-light',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center bg-white border border-outline rounded-xl shadow-ambient">
            <Search size={32} className="text-slate-300" />
            <p className="text-[14px] font-semibold text-[#0f172a]">No listings found</p>
            <p className="text-[12px] text-text-muted">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((listing) => (
              <ActiveListingRow
                key={listing.id}
                listing={listing}
                removalRequest={removalRequests[listing.id]}
                actionOpen={openActionId === listing.id}
                onToggleAction={() =>
                  setOpenActionId((current) => (current === listing.id ? null : listing.id))
                }
                onRequestRemove={() => openRemovalModal(listing)}
                onOpenDetails={() => navigate(ROUTES.BROKER.PROPERTY(listing.propertyId))}
              />
            ))}
          </div>
        )}
      </section>

      {requestModalOpen && (
        <RequestNewListingModal
          requestedIds={requestedPropertyIds}
          onToggleRequest={toggleListingRequest}
          onClose={() => setRequestModalOpen(false)}
        />
      )}

      {removalTarget && (
        <RemovalReasonModal
          listing={removalTarget}
          reason={removalReason}
          onReasonChange={setRemovalReason}
          onSubmit={submitRemovalRequest}
          onClose={() => {
            setRemovalTarget(null)
            setRemovalReason('')
          }}
        />
      )}
    </div>
  )
}
