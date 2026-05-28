import { useState } from 'react'
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Star,
  TrendingUp,
  Sparkles,
  Search,
  SlidersHorizontal,
  Eye,
  Heart,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
  Zap,
} from 'lucide-react'
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
}

/* ─────────────────────────────────────────────
   Mock data — Active Listings
───────────────────────────────────────────── */
const activeListings: ActiveListing[] = [
  {
    id: 'sl-1',
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
function ActiveListingRow({ listing }: { listing: ActiveListing }) {
  const [saved, setSaved] = useState(false)

  return (
    <div className="flex items-start gap-4 bg-white border border-outline rounded-xl p-4 shadow-ambient hover:shadow-card-hover transition-shadow group">
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
          <StatusBadge status={listing.status} />
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
      <div className="flex flex-col items-end gap-2 shrink-0">
        <button
          type="button"
          onClick={() => setSaved((s) => !s)}
          className={cn(
            'p-1.5 rounded-lg border transition-colors',
            saved
              ? 'border-red-200 bg-red-50 text-red-500'
              : 'border-outline bg-white text-text-muted hover:text-red-400 hover:border-red-200',
          )}
          title="Save listing"
        >
          <Heart size={13} fill={saved ? 'currentColor' : 'none'} />
        </button>
        <button
          type="button"
          className="px-3 py-1.5 rounded-lg bg-[#0f172a] text-white text-[11px] font-bold hover:bg-navy/80 transition-colors"
        >
          Manage
        </button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Suggested property card
───────────────────────────────────────────── */
function SuggestedCard({ prop }: { prop: SuggestedProperty }) {
  const [saved, setSaved] = useState(false)

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
        {/* Save btn */}
        <button
          type="button"
          onClick={() => setSaved((s) => !s)}
          className={cn(
            'absolute bottom-3 right-3 p-1.5 rounded-full border backdrop-blur-sm transition-colors',
            saved
              ? 'bg-red-500 border-red-500 text-white'
              : 'bg-white/80 border-white/50 text-text-muted hover:text-red-500',
          )}
        >
          <Heart size={13} fill={saved ? 'currentColor' : 'none'} />
        </button>
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
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0f172a] text-white text-[11px] font-bold hover:bg-navy/80 transition-colors"
          >
            Add to Listings <ChevronRight size={11} />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main page
───────────────────────────────────────────── */
type FilterTab = 'all' | 'active' | 'pending' | 'closed'

export function BrokerListings() {
  const [search, setSearch] = useState('')
  const [filterTab, setFilterTab] = useState<FilterTab>('all')

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
    const matchesTab = filterTab === 'all' || l.status === filterTab
    return matchesSearch && matchesTab
  })

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
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f172a] text-white text-[13px] font-bold hover:bg-navy/80 transition-colors shadow-ambient"
        >
          <Sparkles size={14} />
          Add New Listing
        </button>
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Listings', value: String(activeListings.length), color: 'bg-blue-50 text-blue-700' },
          { label: 'Active', value: String(activeListings.filter((l) => l.status === 'active').length), color: 'bg-green-50 text-green-700' },
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

          {/* Search + filter row */}
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
            <button
              type="button"
              className="h-9 px-3 flex items-center gap-1.5 rounded-lg border border-outline bg-white text-[13px] text-text-muted hover:bg-hover-light transition-colors"
            >
              <SlidersHorizontal size={13} />
              Filter
            </button>
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
              <ActiveListingRow key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      {/* ── Suggested Properties ── */}
      <section>
        {/* Section header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
              <Sparkles size={15} />
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-[#0f172a]">Suggested for You</h2>
              <p className="text-[12px] text-text-muted">
                AI-matched properties based on your portfolio and client demand
              </p>
            </div>
          </div>
          <button
            type="button"
            className="text-[13px] font-semibold text-primary hover:underline flex items-center gap-1"
          >
            View all <ChevronRight size={14} />
          </button>
        </div>

        {/* Match score legend */}
        <div className="flex items-center gap-2 mb-4 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
          <Star size={14} className="text-amber-500" fill="currentColor" />
          <p className="text-[12px] text-amber-800 font-medium">
            Match score is calculated based on your current clients' demand, preferred property types, and location history.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {suggestedProperties.map((prop) => (
            <SuggestedCard key={prop.id} prop={prop} />
          ))}
        </div>
      </section>
    </div>
  )
}
