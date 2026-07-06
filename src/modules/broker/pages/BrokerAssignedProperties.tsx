import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Filter, TrendingUp, Plus, ChevronDown } from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { BrokerPropertyIntel } from '../components/BrokerPropertyIntel'
import { type BrokerAssignedProperty, type BrokerPropertyStatus } from '../constants/assignedProperties'
import { useBrokerPrototype } from '../hooks/useBrokerPrototype'

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */

/* ─────────────────────────────────────────────
   Owner chip (matches design's document icon + name layout)
───────────────────────────────────────────── */
function OwnerChip({
  name,
  initials,
  bg,
  verified,
}: {
  name: string
  initials: string
  bg: string
  verified?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-2 border border-outline rounded-lg px-3 py-2 bg-canvas">
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold text-[#0f172a] shrink-0"
          style={{ background: bg }}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] text-text-muted font-medium">Owner</p>
          <p className="text-[12px] font-bold text-[#0f172a] truncate">{name}</p>
        </div>
      </div>
      {/* Icon: verified shield or circle */}
      <div className="shrink-0 w-7 h-7 rounded-full border border-outline flex items-center justify-center text-text-muted">
        {verified ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
          </svg>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Property Card
───────────────────────────────────────────── */
function PropertyCard({
  property,
  active,
  onSelect,
}: {
  property: BrokerAssignedProperty
  active: boolean
  onSelect: () => void
}) {
  const navigate = useNavigate()
  const statusColors: Record<BrokerPropertyStatus, { bg: string; text: string; dot: string }> = {
    Active: { bg: '#f0fdf4', text: '#15803d', dot: '#22c55e' },
    Pending: { bg: '#fffbeb', text: '#b45309', dot: '#f59e0b' },
    Inactive: { bg: '#f1f5f9', text: '#64748b', dot: '#94a3b8' },
  }
  const sc = statusColors[property.status]

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect()
        }
      }}
      className={`bg-white border rounded-xl overflow-hidden shadow-ambient hover:shadow-card focus:outline-none focus:ring-2 focus:ring-primary transition-shadow duration-200 flex flex-col cursor-pointer ${
        active ? 'border-primary ring-2 ring-primary/15' : 'border-outline'
      }`}
    >
      {/* Image */}
      <div className="relative">
        <img
          src={property.image}
          alt={property.name}
          className="w-full h-[190px] object-cover"
        />
        {/* Status badge */}
        <span
          className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-sm"
          style={{ background: 'rgba(255,255,255,0.92)', color: sc.text }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full inline-block"
            style={{ background: sc.dot }}
          />
          {property.status}
        </span>
        {active && (
          <span className="absolute right-3 top-3 rounded-full bg-[#0f172a] px-2.5 py-1 text-[10px] font-bold text-white">
            Selected
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Title + price */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[17px] font-bold text-[#0f172a] leading-tight">{property.name}</h3>
            <span className="text-[15px] font-bold text-primary shrink-0 mt-0.5">{property.price}</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-label text-text-muted">
            <MapPin size={11} />
            <span>{property.location}</span>
          </div>
        </div>

        {/* Owner chip */}
        <OwnerChip
          name={property.ownerName}
          initials={property.ownerInitials}
          bg={property.ownerBg}
          verified={property.status === 'Active'}
        />

        {/* Action buttons */}
        <div className="flex gap-2 mt-auto pt-1">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              navigate(ROUTES.BROKER.PROPERTY(property.id))
            }}
            className="flex-1 py-2 rounded-lg bg-[#0f172a] text-white text-[12px] font-bold hover:bg-navy/80 transition-colors"
          >
            View Details
          </button>
          <button
            type="button"
            onClick={(event) => event.stopPropagation()}
            className="flex-1 py-2 rounded-lg border border-outline text-[12px] font-semibold text-[#0f172a] bg-white hover:bg-hover-light transition-colors"
          >
            Contact Owner
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export function BrokerAssignedProperties() {
  const { assignedProperties } = useBrokerPrototype()
  const [statusFilter, setStatusFilter] = useState('Active Status')
  const [sortFilter, setSortFilter] = useState('Rent: High to Low')
  const [selectedPropertyId, setSelectedPropertyId] = useState('')
  const visibleProperties = assignedProperties.filter((property) =>
    statusFilter === 'Active Status' ? property.status === 'Active' : true
  ).sort((a, b) => {
    const rentA = Number(a.price.replace(/[^0-9]/g, ''))
    const rentB = Number(b.price.replace(/[^0-9]/g, ''))
    return sortFilter === 'Rent: High to Low' ? rentB - rentA : rentA - rentB
  })
  const selectedProperty =
    assignedProperties.find((property) => property.id === selectedPropertyId) ??
    visibleProperties[0]

  if (!selectedProperty) {
    return (
      <div className="rounded-card border border-outline bg-white p-10 text-center">
        <h1 className="text-heading-2 font-bold text-text-primary">No assigned properties</h1>
        <p className="mt-2 text-body text-text-muted">
          Admin-approved assignments will appear here for this broker.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-10">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[22px] font-bold text-[#0f172a] tracking-tight">Assigned Properties</h1>
          <p className="text-label text-text-muted mt-1">
            Manage and monitor your active real estate portfolio in London.
          </p>
        </div>
        {/* Filter pills */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            onClick={() => setStatusFilter(statusFilter === 'Active Status' ? 'All Status' : 'Active Status')}
            className="inline-flex items-center gap-1.5 border border-outline rounded-lg px-3 py-2 text-[12px] font-semibold text-[#0f172a] bg-white hover:bg-hover-light transition-colors shadow-ambient"
          >
            <Filter size={12} />
            {statusFilter}
            <ChevronDown size={12} />
          </button>
          <button
            onClick={() => setSortFilter(sortFilter === 'Rent: High to Low' ? 'Rent: Low to High' : 'Rent: High to Low')}
            className="inline-flex items-center gap-1.5 border border-outline rounded-lg px-3 py-2 text-[12px] font-semibold text-[#0f172a] bg-white hover:bg-hover-light transition-colors shadow-ambient"
          >
            <Filter size={12} />
            {sortFilter}
            <ChevronDown size={12} />
          </button>
        </div>
      </div>

      {/* ── Property Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleProperties.map((p) => (
          <PropertyCard
            key={p.id}
            property={p}
            active={selectedProperty.id === p.id}
            onSelect={() => setSelectedPropertyId(p.id)}
          />
        ))}
      </div>

      {/* ── Bottom Row: Performance + CTA ── */}
      <BrokerPropertyIntel
        property={selectedProperty}
        heading={`${selectedProperty.name} Full Details`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">

        {/* Portfolio Performance — dark card */}
        <div className="relative rounded-xl overflow-hidden bg-[#0f172a] p-7 flex flex-col gap-5 shadow-card">
          {/* Decorative upward arrow watermark */}
          <svg
            className="absolute right-6 bottom-4 opacity-[0.07]"
            width="180"
            height="180"
            viewBox="0 0 24 24"
            fill="white"
          >
            <path d="M2.5 19.5L12 3l9.5 16.5H2.5z" />
          </svg>

          <div>
            <h2 className="text-[20px] font-bold text-white">Portfolio Performance</h2>
            <p className="text-label text-slate-400 mt-1.5 max-w-md leading-relaxed">
              Your assigned properties are currently 100% occupied with a rental yield 12% above the local market average.
            </p>
          </div>

          <div className="flex items-end gap-10 flex-wrap">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                Total Monthly Rent
              </p>
              <p className="text-[2.8rem] font-bold text-white leading-none tracking-tight">
                $14,250
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                Portfolio Growth
              </p>
              <p className="text-[2.8rem] font-bold text-white leading-none tracking-tight inline-flex items-baseline gap-2">
                +8.4%
                <TrendingUp size={20} className="text-green-400 mb-1" />
              </p>
            </div>
          </div>
        </div>

        {/* In-Demand Properties CTA */}
        <div className="bg-[#f1f5f9] border border-outline rounded-xl p-6 flex flex-col gap-4 justify-between shadow-ambient">
          <div>
            <h2 className="text-[18px] font-bold text-[#0f172a] leading-snug">
              Wanted to know about in demand properties?
            </h2>
          </div>
          <button className="inline-flex items-center justify-center gap-2 bg-[#0f172a] text-white text-[13px] font-bold rounded-lg px-5 py-2.5 hover:bg-navy/80 transition-colors w-fit">
            View Plans
          </button>
        </div>
      </div>

      {/* ── Add New Property FAB-style button ── */}
      <div className="fixed bottom-8 left-[calc(280px+24px)] z-20">
        <button className="inline-flex items-center gap-2 bg-[#0f172a] text-white text-[13px] font-bold rounded-full px-5 py-3 shadow-modal hover:bg-navy/80 transition-colors">
          <Plus size={16} />
          New Property
        </button>
      </div>

    </div>
  )
}
