import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, TrendingUp, CheckCircle2, BadgeCheck, ChevronRight } from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { BrokerPropertyIntel } from '../components/BrokerPropertyIntel'
import {
  BROKER_ASSIGNED_PROPERTIES,
  getBrokerPropertyById,
  type BrokerAssignedProperty,
} from '../constants/assignedProperties'
import brokerProfileImg from '@/assets/images/broker_profile.png'
import sarahJenkinsImg from '@/assets/images/sarah_jenkins.png'

/* ─────────────────────────────────────────────
   Quarterly Performance Bar Chart (pure SVG)
───────────────────────────────────────────── */
const volumeData = [
  { quarter: 'Q1', value: 42 },
  { quarter: 'Q2', value: 65 },
  { quarter: 'Q3', value: 88 },
  { quarter: 'Q4 (Proj)', value: 71 },
]
const revenueData = [
  { quarter: 'Q1', value: 30 },
  { quarter: 'Q2', value: 55 },
  { quarter: 'Q3', value: 95 },
  { quarter: 'Q4 (Proj)', value: 62 },
]

function QuarterlyChart({ mode }: { mode: 'volume' | 'revenue' }) {
  const data = mode === 'volume' ? volumeData : revenueData
  const chartH = 180
  const barW = 80
  const gap = 24
  const chartW = data.length * (barW + gap) - gap
  const maxVal = 100

  return (
    <svg
      viewBox={`0 0 ${chartW + 20} ${chartH + 32}`}
      className="w-full"
      style={{ maxHeight: 240 }}
    >
      {data.map((d, i) => {
        const barH = (d.value / maxVal) * chartH
        const x = i * (barW + gap)
        const y = chartH - barH
        const isLast = i === data.length - 1
        return (
          <g key={d.quarter}>
            {/* Shadow bar */}
            <rect
              x={x + 4}
              y={y + 4}
              width={barW}
              height={barH}
              rx={4}
              fill="rgba(0,0,0,0.06)"
            />
            {/* Main bar */}
            <rect
              x={x}
              y={y}
              width={barW}
              height={barH}
              rx={4}
              fill={isLast ? '#94a3b8' : '#0f172a'}
              opacity={isLast ? 0.6 : 1}
            />
            {/* Quarter label */}
            <text
              x={x + barW / 2}
              y={chartH + 22}
              textAnchor="middle"
              fontSize={11}
              fill="#64748b"
              fontFamily="Manrope, sans-serif"
              fontWeight={500}
            >
              {d.quarter}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/* ─────────────────────────────────────────────
   Stat Card
───────────────────────────────────────────── */
interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  badge?: React.ReactNode
  dark?: boolean
}

function StatCard({ label, value, icon, badge, dark }: StatCardProps) {
  return (
    <div
      className={`rounded-xl p-5 flex flex-col gap-3 shadow-ambient ${
        dark
          ? 'bg-[#0f172a] text-white'
          : 'bg-white border border-outline'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={`text-label font-semibold uppercase tracking-wider ${dark ? 'text-slate-400' : 'text-text-muted'}`}>
          {label}
        </span>
        <span className={`w-8 h-8 flex items-center justify-center rounded-lg ${dark ? 'bg-white/10 text-white/60' : 'bg-canvas text-text-muted'}`}>
          {icon}
        </span>
      </div>
      <div className={`text-[2rem] font-bold leading-none tracking-tight ${dark ? 'text-white' : 'text-[#0f172a]'}`}>
        {value}
      </div>
      {badge && <div>{badge}</div>}
    </div>
  )
}

/* ─────────────────────────────────────────────
   Property Card
───────────────────────────────────────────── */
interface PropertyCardProps {
  property: BrokerAssignedProperty
  active: boolean
  onSelect: () => void
}

function PropertyCard({ property, active, onSelect }: PropertyCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`block w-full overflow-hidden rounded-xl border bg-white text-left shadow-ambient transition-shadow duration-200 hover:shadow-card-hover focus:outline-none focus:ring-2 focus:ring-primary ${
        active ? 'border-primary ring-2 ring-primary/15' : 'border-outline'
      }`}
    >
      <div className="relative">
        <img src={property.image} alt={property.name} className="w-full h-44 object-cover" />
        <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold bg-white/90 text-[#0f172a] backdrop-blur-sm">
          {property.type}
        </span>
        {active && (
          <span className="absolute right-3 top-3 rounded-full bg-[#0f172a] px-2.5 py-1 text-[10px] font-bold text-white">
            Selected
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-[16px] font-bold text-[#0f172a]">{property.name}</h3>
        <div className="flex items-center gap-1 mt-1 text-label text-text-muted">
          <MapPin size={11} />
          <span>{property.location}</span>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-[15px] font-bold text-[#0f172a]">{property.value}</span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              property.leased ? 'text-status-success-text bg-status-success-bg' : 'text-status-warning-text bg-status-warning-bg'
            }`}
            style={{
              color: property.leasePercent >= 95 ? '#15803d' : '#b45309',
              background: property.leasePercent >= 95 ? '#f0fdf4' : '#fffbeb',
            }}
          >
            {property.leasePercent}% LEASED
          </span>
        </div>
      </div>
    </button>
  )
}

/* ─────────────────────────────────────────────
   Main Portfolio Page
───────────────────────────────────────────── */
export function BrokerPortfolio() {
  const [chartMode, setChartMode] = useState<'volume' | 'revenue'>('revenue')
  const navigate = useNavigate()
  const portfolioProperties = BROKER_ASSIGNED_PROPERTIES.slice(0, 2)
  const defaultPortfolioProperty = portfolioProperties[0] ?? BROKER_ASSIGNED_PROPERTIES[0]!
  const [selectedPropertyId, setSelectedPropertyId] = useState(defaultPortfolioProperty.id)
  const selectedProperty = getBrokerPropertyById(selectedPropertyId) ?? defaultPortfolioProperty

  return (
    <div className="space-y-6 pb-10">

      {/* ── Broker Profile Header ── */}
      <div className="bg-white border border-outline rounded-xl p-6 shadow-ambient">
        <div className="flex items-start gap-5 flex-wrap">
          {/* Avatar */}
          <div className="relative shrink-0">
            <img
              src={brokerProfileImg}
              alt="Jonathan Sterling"
              className="w-[100px] h-[100px] rounded-xl object-cover border-2 border-outline"
            />
            <span className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-primary rounded-full flex items-center justify-center">
              <BadgeCheck size={16} className="text-white" />
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-[22px] font-bold text-[#0f172a] tracking-tight">Jonathan Sterling</h1>
            <p className="text-body text-text-muted mt-0.5">Senior Real Estate Consultant</p>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-50 text-green-700 border border-green-200">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                Active
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Enterprise Tier
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0 mt-1">
            <button className="px-4 py-2 rounded-lg border border-outline text-[13px] font-semibold text-[#0f172a] bg-white hover:bg-hover-light transition-colors">
              Remove Broker
            </button>
            <button className="px-4 py-2 rounded-lg text-[13px] font-bold text-white bg-[#0f172a] hover:bg-navy/80 transition-colors">
              Reassign Broker
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Deals Closed"
          value="24"
          icon={<CheckCircle2 size={16} />}
          badge={
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-status-success" style={{ color: '#15803d' }}>
              <TrendingUp size={11} /> +12% this quarter
            </span>
          }
        />
        <StatCard
          label="Success Rate"
          value="94%"
          icon={<CheckCircle2 size={16} />}
          badge={
            <div className="w-full h-1.5 bg-outline rounded-full overflow-hidden">
              <div className="h-full bg-[#0f172a] rounded-full" style={{ width: '94%' }} />
            </div>
          }
        />
        <StatCard
          label="Total Asset Value"
          value="$184.5M"
          icon={
            <span className="text-[18px] font-bold text-white/30">$</span>
          }
          badge={
            <span className="text-label text-slate-400 font-medium">Managing 12 High-Value Assets</span>
          }
          dark
        />
      </div>

      {/* ── Chart + Notes Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">

        {/* Quarterly Performance Chart */}
        <div className="bg-white border border-outline rounded-xl p-6 shadow-ambient">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[16px] font-bold text-[#0f172a]">Quarterly Performance</h2>
            <div className="flex items-center gap-0 border border-outline rounded-lg overflow-hidden">
              <button
                onClick={() => setChartMode('volume')}
                className={`px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                  chartMode === 'volume'
                    ? 'bg-[#0f172a] text-white'
                    : 'bg-white text-text-muted hover:bg-hover-light'
                }`}
              >
                Volume
              </button>
              <button
                onClick={() => setChartMode('revenue')}
                className={`px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                  chartMode === 'revenue'
                    ? 'bg-[#0f172a] text-white'
                    : 'bg-white text-text-muted hover:bg-hover-light'
                }`}
              >
                Revenue
              </button>
            </div>
          </div>
          <div className="px-2">
            <QuarterlyChart mode={chartMode} />
          </div>
        </div>

        {/* Internal Broker Notes */}
        <div className="bg-[#eef2ff] border border-[#c7d2fe] rounded-xl p-5 shadow-ambient flex flex-col gap-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#4338ca]">
            Internal Broker Notes
          </p>
          <blockquote className="text-[13px] text-[#1e1b4b] leading-relaxed font-medium">
            "Jonathan has consistently outperformed in the luxury commercial segment. Recommended for the upcoming Waterfront Development Project expansion."
          </blockquote>
          <div className="flex items-center gap-3 mt-auto pt-3 border-t border-[#c7d2fe]">
            <img
              src={sarahJenkinsImg}
              alt="Sarah Jenkins"
              className="w-9 h-9 rounded-full object-cover shrink-0"
            />
            <div>
              <p className="text-[12px] font-bold text-[#1e1b4b]">Sarah Jenkins</p>
              <p className="text-[11px] text-[#4338ca]">Regional Director</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Assigned Properties ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-bold text-[#0f172a]">Assigned Properties</h2>
          <button
            onClick={() => navigate(ROUTES.BROKER.ASSIGNED_PROPERTIES)}
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline"
          >
            View All <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {portfolioProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              active={selectedProperty.id === property.id}
              onSelect={() => setSelectedPropertyId(property.id)}
            />
          ))}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={() => navigate(ROUTES.BROKER.PROPERTY(selectedProperty.id))}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0f172a] px-4 py-2 text-[13px] font-bold text-white hover:bg-navy/80"
          >
            Open Full Property Page
            <ChevronRight size={15} />
          </button>
        </div>

        <div className="mt-6">
          <BrokerPropertyIntel
            property={selectedProperty}
            heading={`${selectedProperty.name} Details`}
          />
        </div>
      </div>

    </div>
  )
}
