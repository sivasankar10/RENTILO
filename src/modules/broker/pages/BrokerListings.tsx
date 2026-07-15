import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Sparkles,
  Search,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  Zap,
  MoreVertical,
  X,
} from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { cn } from '@shared/utils/cn'
import { usePrototypeStore } from '@shared/store/prototypeStore'
import { useAuth } from '@shared/hooks/useAuth'
import { useBrokerPrototype } from '../hooks/useBrokerPrototype'

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

type RemovalRequest = {
  reason: string
  status: 'pending'
}

/* ─────────────────────────────────────────────
   Mock data — Active Listings
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
   Main page
───────────────────────────────────────────── */
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
  const { user } = useAuth()
  const brokerId = user?.id ?? ''
  const commissionNegotiations = usePrototypeStore((s) => s.commissionNegotiations)
  const prototypeProperties = usePrototypeStore((s) => s.properties)
  const prototypeUsers = usePrototypeStore((s) => s.users)
  const decideBrokerOffer = usePrototypeStore((s) => s.decideBrokerOffer)
  const {
    assignedBundles,
    leads,
    requests,
    requestRemoval,
  } = useBrokerPrototype()

  // Pending offers for this broker
  const pendingOffers = useMemo(() =>
    commissionNegotiations
      .filter((n) => n.brokerOffers.some((o) => o.brokerId === brokerId && o.status === 'pending'))
      .map((n) => {
        const property = prototypeProperties.find((p) => p.id === n.propertyId)
        const owner = prototypeUsers.find((u) => u.id === n.ownerId)
        const offer = n.brokerOffers.find((o) => o.brokerId === brokerId && o.status === 'pending')!
        return { negotiation: n, property, owner, offer }
      }),
    [commissionNegotiations, brokerId, prototypeProperties, prototypeUsers],
  )
  const activeListings: ActiveListing[] = assignedBundles.map(({ listing, property }) => ({
    id: listing.id,
    propertyId: property.id,
    image: property.image,
    name: property.title,
    location: `${property.neighborhood}, ${property.city}`,
    type: property.propertyType,
    price: property.price,
    beds: property.beds,
    baths: property.baths,
    sqft: property.sqft,
    status: listing.status === 'Active' ? 'active' : listing.status === 'Removed' ? 'closed' : 'pending',
    views: property.views,
    leads: leads.filter((lead) => lead.listingId === listing.id).length,
    daysListed: Math.max(1, Math.round((Date.now() - new Date(listing.createdAt).getTime()) / 86400000)),
  }))
  const [search, setSearch] = useState('')
  const [filterTab, setFilterTab] = useState<FilterTab>('all')
  const [openActionId, setOpenActionId] = useState<string | null>(null)
  const [removalTarget, setRemovalTarget] = useState<ActiveListing | null>(null)
  const [removalReason, setRemovalReason] = useState('')
  const removalRequests = Object.fromEntries(
    requests
      .filter((request) => request.type === 'broker_listing_removal' && request.status === 'Pending' && request.listingId)
      .map((request) => [request.listingId!, { reason: request.reason ?? '', status: 'pending' as const }]),
  ) as Record<string, RemovalRequest>

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

  const openRemovalModal = (listing: ActiveListing) => {
    setRemovalTarget(listing)
    setRemovalReason('')
    setOpenActionId(null)
  }

  const submitRemovalRequest = () => {
    if (!removalTarget || !removalReason.trim()) {
      return
    }

    requestRemoval(removalTarget.id, removalReason.trim())

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
          onClick={() => navigate(ROUTES.BROKER.PORTFOLIO)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f172a] text-white text-[13px] font-bold hover:bg-navy/80 transition-colors shadow-ambient"
        >
          <Sparkles size={14} />
          Browse In Demand
        </button>
      </div>

      {/* ── Pending Offers ── */}
      {pendingOffers.length > 0 && (
        <div className="rounded-card border border-amber-200 bg-amber-50/50 shadow-surface overflow-hidden">
          <div className="border-b border-amber-200 px-6 py-4">
            <h2 className="text-body-lg font-bold text-text-primary">Commission Offers</h2>
            <p className="mt-0.5 text-label text-text-muted">{pendingOffers.length} pending assignment offer{pendingOffers.length > 1 ? 's' : ''}</p>
          </div>
          <div className="divide-y divide-amber-200">
            {pendingOffers.map(({ negotiation, property, owner, offer }) => {
              const ownerName = owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown Owner'
              return (
                <div key={negotiation.id} className="px-6 py-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {property && <img src={property.image} alt="" className="h-14 w-20 rounded-lg object-cover shrink-0" />}
                      <div className="min-w-0">
                        <p className="text-body font-bold text-text-primary truncate">{property?.title ?? 'Unknown Property'}</p>
                        <p className="mt-0.5 text-label text-text-muted flex items-center gap-1"><MapPin size={11} />{property ? `${property.neighborhood}, ${property.city}` : '—'}</p>
                        <p className="mt-1 text-label text-text-muted">Owner: {ownerName} · Rent: {property?.price ?? '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-center px-4">
                        <p className="text-heading-3 font-bold text-primary">{offer.commission}%</p>
                        <p className="text-[10px] text-text-muted">Commission</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => decideBrokerOffer(negotiation.id, brokerId, 'accepted')}
                        className="rounded-button bg-primary px-4 py-2.5 text-label font-bold text-white hover:bg-primary-700"
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => decideBrokerOffer(negotiation.id, brokerId, 'rejected')}
                        className="rounded-button border border-status-error px-4 py-2.5 text-label font-bold text-status-error hover:bg-red-50"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

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
