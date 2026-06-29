import { useState } from 'react'
import {
  Eye,
  MousePointerClick,
  Wallet,
  Plus,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Bed,
  Bath,
  Square,
  Check,
  ArrowLeft,
} from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { FeatureGate } from '../components/FeatureGate'

import skylineHeightsImg from '@/assets/images/skyline_heights.png'
import harborResidencesImg from '@/assets/images/harbor_residences.png'
import canaryWharfImg from '@/assets/images/canary_wharf.png'
import greenwichHomeImg from '@/assets/images/greenwich_home.png'
import skylinePlazaImg from '@/assets/images/skyline_plaza.png'
import alpineTerrace from '@/assets/images/alpine_terrace_exterior.png'

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type ViewType = 'listings' | 'selection'
type PromotionStatus = 'Active' | 'Scheduled' | 'Paused' | 'Ended'
type PropertyStatus = 'Occupied' | 'Available' | 'Maintenance'

interface Property {
  id: string
  name: string
  price: string
  address: string
  image: string
  status: PropertyStatus
  beds?: number
  baths?: number
  sqft?: number
}

interface PromotedProperty {
  id: string
  name: string
  address: string
  image: string
  status: PromotionStatus
  adType: string
  adSubtype: string
  endDate: string
  daysInfo: string
  daysInfoType: 'warning' | 'info'
}

/* ─────────────────────────────────────────────
   Mock Data
───────────────────────────────────────────── */
const statCards = [
  {
    icon: <Eye size={18} className="text-[#0f172a]" />,
    label: 'Total Impressions',
    value: '245,892',
    change: '+12% vs last week',
    changeType: 'positive' as const,
  },
  {
    icon: <MousePointerClick size={18} className="text-[#0f172a]" />,
    label: 'Click-Through Rate',
    value: '3.82%',
    change: '+5.4% conversion',
    changeType: 'positive' as const,
  },
  {
    icon: <Wallet size={18} className="text-[#0f172a]" />,
    label: 'Monthly Ad Spend',
    value: '$1,240.00',
    sublabel: 'Budget Remaining',
  },
]

const promotedProperties: PromotedProperty[] = [
  {
    id: '1',
    name: 'Skyline Vista Apartments',
    address: '4200 Broadway, NY',
    image: skylineHeightsImg,
    status: 'Active',
    adType: 'Premium Boost',
    adSubtype: 'Marketplace Header',
    endDate: 'Oct 24, 2024',
    daysInfo: '12 days left',
    daysInfoType: 'warning',
  },
  {
    id: '2',
    name: 'Oakwood Estate',
    address: '15 Oak Rd, Greenwich',
    image: harborResidencesImg,
    status: 'Scheduled',
    adType: 'Featured Slot',
    adSubtype: 'Search Top Result',
    endDate: 'Nov 01, 2024',
    daysInfo: 'Starts in 6 days',
    daysInfoType: 'info',
  },
  {
    id: '3',
    name: 'The Glass House',
    address: '99 Valley Path, Aspen',
    image: greenwichHomeImg,
    status: 'Active',
    adType: 'Regional Boost',
    adSubtype: 'Aspen Search Cluster',
    endDate: 'Dec 15, 2024',
    daysInfo: '64 days left',
    daysInfoType: 'info',
  },
]

const selectableProperties: Property[] = [
  {
    id: '1',
    name: 'Skyline Residence',
    price: '$4,500',
    address: '450 Park Avenue, Suite 12B, New York, NY',
    image: skylineHeightsImg,
    status: 'Occupied',
    beds: 3,
    baths: 2,
    sqft: 1800,
  },
  {
    id: '2',
    name: 'The Obsidian Lofts',
    price: '$3,200',
    address: '88 Industrial Way, Lofts 4-G, Brooklyn, NY',
    image: harborResidencesImg,
    status: 'Maintenance',
    beds: 1,
    sqft: 950,
  },
  {
    id: '3',
    name: 'Cedar Point Estate',
    price: '$7,800',
    address: '1200 Lakeview Drive, Greenwich, CT',
    image: canaryWharfImg,
    status: 'Available',
    beds: 5,
    baths: 4,
    sqft: 4200,
  },
  {
    id: '4',
    name: 'Marble Court Townhomes',
    price: '$2,900',
    address: '44 Marble Ave, Unit 2, Hoboken, NJ',
    image: greenwichHomeImg,
    status: 'Occupied',
    beds: 2,
    sqft: 1250,
  },
  {
    id: '5',
    name: 'Azure Shore Villa',
    price: '$9,500',
    address: '7 Ocean View, Malibu, CA',
    image: skylinePlazaImg,
    status: 'Available',
    beds: 4,
    baths: 4,
  },
  {
    id: '6',
    name: 'Summit Plaza Suites',
    price: '$5,100',
    address: '11 Financial District, Chicago, IL',
    image: alpineTerrace,
    status: 'Occupied',
    beds: 2,
    sqft: 1400,
  },
]

/* ─────────────────────────────────────────────
   Status Badge Components
───────────────────────────────────────────── */
function PromotionStatusBadge({ status }: { status: PromotionStatus }) {
  const styles: Record<PromotionStatus, string> = {
    Active: 'bg-[#dcfce7] text-[#16a34a] border-[#bbf7d0]',
    Scheduled: 'bg-[#fef3c7] text-[#d97706] border-[#fde68a]',
    Paused: 'bg-[#f1f5f9] text-[#64748b] border-[#e2e8f0]',
    Ended: 'bg-[#fee2e2] text-[#dc2626] border-[#fecaca]',
  }

  return (
    <span className={cn(
      'px-3 py-1 rounded-full text-[11px] font-semibold border uppercase tracking-wide',
      styles[status]
    )}>
      {status}
    </span>
  )
}

function PropertyStatusBadge({ status }: { status: PropertyStatus }) {
  const styles: Record<PropertyStatus, string> = {
    Occupied: 'bg-[#0f172a] text-white',
    Available: 'bg-[#10b981] text-white',
    Maintenance: 'bg-[#f59e0b] text-white',
  }

  return (
    <span className={cn('px-2.5 py-1 rounded-md text-[11px] font-semibold', styles[status])}>
      {status}
    </span>
  )
}

/* ─────────────────────────────────────────────
   Property Card Component
───────────────────────────────────────────── */
function PropertyCard({
  property,
  isSelected,
  onToggle,
}: {
  property: Property
  isSelected: boolean
  onToggle: () => void
}) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border-2 overflow-hidden transition-all cursor-pointer',
        isSelected ? 'border-[#0f172a] shadow-lg' : 'border-[#e2e8f0] hover:border-[#cbd5e1]'
      )}
      onClick={onToggle}
    >
      <div className="relative h-[160px]">
        <img src={property.image} alt={property.name} className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3">
          <div className={cn(
            'w-6 h-6 rounded-md flex items-center justify-center transition-colors',
            isSelected ? 'bg-[#0f172a]' : 'bg-white/90 border border-[#e2e8f0]'
          )}>
            {isSelected && <Check size={14} className="text-white" />}
          </div>
        </div>
        <div className="absolute bottom-3 left-3">
          <PropertyStatusBadge status={property.status} />
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-[15px] font-bold text-[#0f172a] leading-tight">{property.name}</h3>
          <p className="text-[15px] font-bold text-[#0f172a] whitespace-nowrap">
            {property.price}<span className="text-[12px] font-normal text-[#64748b]">/mo</span>
          </p>
        </div>
        <p className="text-[13px] text-[#64748b] mb-4 line-clamp-2 leading-relaxed">{property.address}</p>
        <div className="flex items-center gap-4 pt-3 border-t border-[#f1f5f9]">
          {property.beds && (
            <div className="flex items-center gap-1.5">
              <Bed size={14} className="text-[#94a3b8]" />
              <span className="text-[12px] text-[#64748b]">{property.beds} {property.beds === 1 ? 'Bed' : 'Beds'}</span>
            </div>
          )}
          {property.baths && (
            <div className="flex items-center gap-1.5">
              <Bath size={14} className="text-[#94a3b8]" />
              <span className="text-[12px] text-[#64748b]">{property.baths} {property.baths === 1 ? 'Bath' : 'Baths'}</span>
            </div>
          )}
          {property.sqft && (
            <div className="flex items-center gap-1.5">
              <Square size={14} className="text-[#94a3b8]" />
              <span className="text-[12px] text-[#64748b]">{property.sqft.toLocaleString()} sqft</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export function OwnerPromotions() {
  const [view, setView] = useState<ViewType>('listings')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const totalPages = 4
  const totalListings = 12

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id])
  }

  const clearAll = () => setSelectedIds([])

  const handlePromote = () => {
    console.log('Promoting properties:', selectedIds)
    setView('listings')
    setSelectedIds([])
  }

  const estimatedImpressions = selectedIds.length * 6200

  return (
    <FeatureGate feature="promoted_listings">
      <div className="min-h-screen bg-[#f8fafc] pb-12">
        <div className="max-w-[1000px] mx-auto px-6 py-8">
          {view === 'listings' ? (
            <>
              {/* ── Header ── */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h1 className="text-[28px] font-bold text-[#0f172a] tracking-tight mb-2">
                    Promoted Listings
                  </h1>
                  <p className="text-[15px] text-[#64748b] leading-relaxed max-w-xl">
                    Manage your active property advertisements and track performance across the Rentilo marketplace.
                  </p>
                </div>
                <button
                  onClick={() => setView('selection')}
                  className="px-5 py-2.5 rounded-xl bg-[#0f172a] text-white text-[14px] font-semibold hover:bg-[#1e293b] transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Property
                </button>
              </div>

              {/* ── Stats Cards ── */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {statCards.map((card, index) => (
                  <div key={index} className="bg-white rounded-2xl border border-[#e2e8f0] p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#f1f5f9] flex items-center justify-center">
                        {card.icon}
                      </div>
                      {card.change && (
                        <span className={cn('text-[12px] font-medium', card.changeType === 'positive' ? 'text-[#10b981]' : 'text-[#64748b]')}>
                          {card.change}
                        </span>
                      )}
                      {card.sublabel && <span className="text-[12px] text-[#64748b]">{card.sublabel}</span>}
                    </div>
                    <p className="text-[13px] text-[#64748b] mb-1">{card.label}</p>
                    <p className="text-[28px] font-bold text-[#0f172a]">{card.value}</p>
                  </div>
                ))}
              </div>

              {/* ── Active Promotions Table ── */}
              <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-[#e2e8f0]">
                  <h2 className="text-[16px] font-bold text-[#0f172a]">Active Promotions</h2>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 rounded-lg border border-[#e2e8f0] bg-white text-[13px] font-medium text-[#475569] hover:bg-[#f8fafc] transition-colors flex items-center gap-2">
                      <Filter size={14} />
                      Filter
                    </button>
                    <button className="px-4 py-2 rounded-lg border border-[#e2e8f0] bg-white text-[13px] font-medium text-[#475569] hover:bg-[#f8fafc] transition-colors flex items-center gap-2">
                      <Download size={14} />
                      Export
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                        <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#64748b] uppercase tracking-wide">Property Name</th>
                        <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#64748b] uppercase tracking-wide">Status</th>
                        <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#64748b] uppercase tracking-wide">Ad Type</th>
                        <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#64748b] uppercase tracking-wide">End Date</th>
                        <th className="text-right px-5 py-3 text-[11px] font-semibold text-[#64748b] uppercase tracking-wide">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {promotedProperties.map((property) => (
                        <tr key={property.id} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#e2e8f0] shrink-0">
                                <img src={property.image} alt={property.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="text-[14px] font-semibold text-[#0f172a]">{property.name}</p>
                                <p className="text-[12px] text-[#64748b]">{property.address}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4"><PromotionStatusBadge status={property.status} /></td>
                          <td className="px-5 py-4">
                            <p className="text-[14px] font-medium text-[#0f172a]">{property.adType}</p>
                            <p className="text-[12px] text-[#64748b]">{property.adSubtype}</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-[14px] text-[#0f172a]">{property.endDate}</p>
                            <p className={cn('text-[12px]', property.daysInfoType === 'warning' ? 'text-[#f59e0b]' : 'text-[#64748b]')}>
                              {property.daysInfo}
                            </p>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button className="text-[14px] font-medium text-[#0f172a] hover:underline">Manage</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between px-5 py-4 border-t border-[#e2e8f0]">
                  <p className="text-[13px] text-[#64748b]">Showing 3 of {totalListings} promoted listings</p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="w-8 h-8 rounded-lg border border-[#e2e8f0] flex items-center justify-center text-[#64748b] hover:bg-[#f8fafc] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                      <ChevronLeft size={16} />
                    </button>
                    <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="w-8 h-8 rounded-lg border border-[#e2e8f0] flex items-center justify-center text-[#64748b] hover:bg-[#f8fafc] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (

            /* ── Selection View ── */
            <>
              <div className="mb-8">
                <button onClick={() => setView('listings')} className="flex items-center gap-2 text-[14px] text-[#64748b] hover:text-[#0f172a] transition-colors mb-4">
                  <ArrowLeft size={16} />
                  Back to Promoted Listings
                </button>
                <h1 className="text-[28px] font-bold text-[#0f172a] tracking-tight mb-2">Promotion Selection</h1>
                <p className="text-[15px] text-[#64748b] leading-relaxed max-w-xl">
                  Select the premium properties you wish to highlight. Sponsored properties receive 3x more visibility.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-24">
                {selectableProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    isSelected={selectedIds.includes(property.id)}
                    onToggle={() => toggleSelection(property.id)}
                  />
                ))}
              </div>

              {/* Bottom Action Bar */}
              {selectedIds.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e2e8f0] py-4 px-6 shadow-lg z-50">
                  <div className="max-w-[1000px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {selectedIds.slice(0, 3).map((id, index) => {
                          const property = selectableProperties.find(p => p.id === id)
                          return (
                            <div key={id} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-[#e2e8f0]" style={{ zIndex: 3 - index }}>
                              {property && <img src={property.image} alt="" className="w-full h-full object-cover" />}
                            </div>
                          )
                        })}
                        {selectedIds.length > 3 && (
                          <div className="w-8 h-8 rounded-full bg-[#f1f5f9] border-2 border-white flex items-center justify-center -ml-2">
                            <span className="text-[11px] font-semibold text-[#64748b]">+{selectedIds.length - 3}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-[15px] font-bold text-[#0f172a]">{selectedIds.length} {selectedIds.length === 1 ? 'Property' : 'Properties'} Selected</p>
                        <p className="text-[12px] text-[#64748b]">Estimated Daily Impressions: {estimatedImpressions.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button onClick={clearAll} className="text-[14px] font-medium text-[#64748b] hover:text-[#0f172a] transition-colors">Clear All</button>
                      <button onClick={handlePromote} className="px-6 py-3 rounded-xl bg-[#0f172a] text-white text-[14px] font-semibold hover:bg-[#1e293b] transition-colors">Promote Selected</button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </FeatureGate>
  )
}
