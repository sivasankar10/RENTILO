import { useNavigate } from 'react-router-dom'
import {
  Pencil,
  Share2,
  ArrowRight,
  Star,
  ParkingSquare,
  Zap,
  Shield,
  Droplets,
  Home,
  Trees,
} from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { ROUTES } from '@shared/constants/routes'

import harborResidencesImg from '@/assets/images/harbor_residences.png'
import brokerProfileImg from '@/assets/images/broker_profile.png'

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface PropertyStat {
  label: string
  value: string
}

interface Amenity {
  icon: React.ReactNode
  label: string
}

interface TenantBrokerItem {
  icon: React.ReactNode
  label: string
}

/* ─────────────────────────────────────────────
   Mock Data
───────────────────────────────────────────── */
const propertyStats: PropertyStat[] = [
  { label: 'Configuration', value: '3 BHK + Study' },
  { label: 'Total Area', value: '2,400 Sq. Ft.' },
  { label: 'Furnishing', value: 'Semi-Furnished' },
]

const keyAmenities: Amenity[] = [
  { icon: <ParkingSquare size={16} className="text-[#64748b]" />, label: 'Private Parking' },
  { icon: <Zap size={16} className="text-[#64748b]" />, label: 'Power Backup' },
  { icon: <Shield size={16} className="text-[#64748b]" />, label: 'CCTV Security' },
  { icon: <Droplets size={16} className="text-[#64748b]" />, label: 'Cauvery Water' },
  { icon: <Home size={16} className="text-[#64748b]" />, label: 'Private Terrace' },
  { icon: <Trees size={16} className="text-[#64748b]" />, label: 'Garden Space' },
]

const tenantBrokerItems: TenantBrokerItem[] = [
  { icon: <ParkingSquare size={16} className="text-[#64748b]" />, label: 'Private Parking' },
  { icon: <Zap size={16} className="text-[#64748b]" />, label: 'Power Backup' },
  { icon: <Shield size={16} className="text-[#64748b]" />, label: 'CCTV Security' },
  { icon: <Droplets size={16} className="text-[#64748b]" />, label: 'Cauvery Water' },
  { icon: <Home size={16} className="text-[#64748b]" />, label: 'Private Terrace' },
  { icon: <Trees size={16} className="text-[#64748b]" />, label: 'Garden Space' },
]

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export function AdminPropertyOverview() {
  const navigate = useNavigate()

  const handleEditDetails = () => {
    console.log('Edit details clicked')
  }

  const handleShareReport = () => {
    console.log('Share report clicked')
  }

  const handleViewBreakdown = () => {
    console.log('View breakdown clicked')
  }

  const handleContactBroker = () => {
    navigate(ROUTES.ADMIN.BROKER_MANAGEMENT)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12">
      <div className="max-w-[1100px] mx-auto px-6 py-8">
        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-[12px] text-[#64748b] uppercase tracking-wide mb-1 flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#64748b]/20 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#64748b]" />
              </span>
              HSR LAYOUT, BANGALORE
            </p>
            <h1 className="text-[32px] font-bold text-[#0f172a] tracking-tight">
              Property Overview
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleEditDetails}
              className="px-5 py-2.5 rounded-xl border border-[#e2e8f0] bg-white text-[14px] font-medium text-[#0f172a] hover:bg-[#f8fafc] transition-colors flex items-center gap-2"
            >
              <Pencil size={14} />
              Edit Details
            </button>
            <button
              onClick={handleShareReport}
              className="px-5 py-2.5 rounded-xl bg-[#0f172a] text-white text-[14px] font-medium hover:bg-[#1e293b] transition-colors flex items-center gap-2"
            >
              <Share2 size={14} />
              Share Report
            </button>
          </div>
        </div>

        {/* ── Stats Cards Row ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Platform Commission Card */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#0f172a] flex items-center justify-center">
                <span className="text-white text-[14px] font-bold">₹</span>
              </div>
              <span className="text-[13px] font-semibold text-[#10b981]">+12.5%</span>
            </div>
            <p className="text-[12px] text-[#64748b] uppercase tracking-wide mb-1">
              Platform Commission
            </p>
            <p className="text-[28px] font-bold text-[#0f172a]">₹ 42,500</p>
            <p className="text-[13px] text-[#94a3b8] mt-1">
              Accrued from current rental cycle
            </p>
          </div>

          {/* Evaluation Amount Card */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5">
            <p className="text-[12px] text-[#64748b] uppercase tracking-wide mb-1">
              Evaluation Amount (Owner)
            </p>
            <p className="text-[28px] font-bold text-[#0f172a] mb-3">₹ 2,45,00,000</p>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex -space-x-1">
                <div className="w-6 h-6 rounded-full bg-[#0f172a] border-2 border-white" />
                <div className="w-6 h-6 rounded-full bg-[#64748b] border-2 border-white" />
              </div>
              <span className="text-[13px] text-[#64748b]">
                Evaluated by 3 certified agents
              </span>
            </div>

            <button
              onClick={handleViewBreakdown}
              className="text-[13px] font-semibold text-[#3b82f6] flex items-center gap-1 hover:underline"
            >
              VIEW BREAKDOWN
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* ── Main Content Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Property Image Card */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
              <div className="relative h-[280px]">
                <img
                  src={harborResidencesImg}
                  alt="Property"
                  className="w-full h-full object-cover"
                />
                {/* Tags */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm text-[11px] font-bold text-[#0f172a] uppercase tracking-wide">
                    Independent House
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-[#10b981] text-[11px] font-bold text-white uppercase tracking-wide">
                    Verified
                  </span>
                </div>
              </div>

              {/* Property Stats */}
              <div className="grid grid-cols-3 divide-x divide-[#e2e8f0] p-4">
                {propertyStats.map((stat, index) => (
                  <div key={index} className="text-center px-4">
                    <p className="text-[12px] text-[#94a3b8] mb-1">{stat.label}</p>
                    <p className="text-[15px] font-bold text-[#0f172a]">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Amenities Card */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5">
              <h2 className="text-[16px] font-bold text-[#0f172a] mb-4">
                Key Amenities
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {keyAmenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]"
                  >
                    {amenity.icon}
                    <span className="text-[13px] text-[#475569]">{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Tenant + Broker Card */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5">
              <h2 className="text-[16px] font-bold text-[#0f172a] mb-4">
                Active Tenant + Broker (if any)
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {tenantBrokerItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]"
                  >
                    {item.icon}
                    <span className="text-[13px] text-[#475569]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Suggested Broker Card */}
          <div className="bg-[#0f172a] rounded-2xl p-6 h-fit">
            {/* Header Badge */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-5 h-5 rounded-full bg-[#3b82f6] flex items-center justify-center">
                <span className="text-white text-[10px]">★</span>
              </div>
              <span className="text-[12px] text-[#94a3b8] uppercase tracking-wide">
                Suggested for You
              </span>
            </div>

            {/* Broker Avatar */}
            <div className="text-center mb-5">
              <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-[#1e293b] mb-4">
                <img
                  src={brokerProfileImg}
                  alt="Broker"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-[18px] font-bold text-white mb-1">
                Alexander Pierce
              </h3>
              <p className="text-[13px] text-[#94a3b8] mb-3">
                Senior Portfolio Manager
              </p>
              
              {/* Rating */}
              <div className="flex items-center justify-center gap-1 mb-5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={cn(
                      star <= 4 ? 'text-[#f59e0b] fill-[#f59e0b]' : 'text-[#f59e0b] fill-[#f59e0b]/50'
                    )}
                  />
                ))}
                <span className="text-[13px] text-white ml-1">4.9/5.0</span>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-[#1e293b] rounded-xl p-4 mb-5">
              <p className="text-[13px] text-[#94a3b8] leading-relaxed">
                "12 years of experience in the NY luxury rental market. Specialized in high-occupancy strategies and premium tenant vetting."
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-[#1e293b] rounded-xl p-4 text-center">
                <p className="text-[20px] font-bold text-white">150+</p>
                <p className="text-[11px] text-[#64748b] uppercase tracking-wide">
                  Properties Managed
                </p>
              </div>
              <div className="bg-[#1e293b] rounded-xl p-4 text-center">
                <p className="text-[20px] font-bold text-white">98%</p>
                <p className="text-[11px] text-[#64748b] uppercase tracking-wide">
                  Occupancy Rate
                </p>
              </div>
            </div>

            {/* Contact Button */}
            <button
              onClick={handleContactBroker}
              className="w-full py-3.5 rounded-xl bg-[#0ea5e9] text-white text-[14px] font-semibold hover:bg-[#0284c7] transition-colors flex items-center justify-center gap-2"
            >
              Contact Broker
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
