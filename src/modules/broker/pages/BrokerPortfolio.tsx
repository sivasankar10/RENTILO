import { useNavigate } from 'react-router-dom'
import { MapPin, TrendingUp, CheckCircle2, BadgeCheck, ChevronRight, Medal, Trophy } from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { type BrokerAssignedProperty } from '../constants/assignedProperties'
import { useBrokerPrototype } from '../hooks/useBrokerPrototype'
import brokerProfileImg from '@/assets/images/broker_profile.png'
import sarahJenkinsImg from '@/assets/images/sarah_jenkins.png'

const monthlyLeaderboard = [
  { rank: 1, name: 'Ava Montgomery', deals: 31, leads: 42, score: 98, change: '+4' },
  { rank: 2, name: 'Ethan Clarke', deals: 28, leads: 39, score: 94, change: '+2' },
  { rank: 3, name: 'Jonathan Sterling', deals: 24, leads: 36, score: 91, change: '+6', current: true },
  { rank: 4, name: 'Maya Deshpande', deals: 22, leads: 34, score: 87, change: '+1' },
  { rank: 5, name: 'Daniel Brooks', deals: 20, leads: 31, score: 84, change: '-1' },
]

/* ─────────────────────────────────────────────
   Quarterly Performance Bar Chart (pure SVG)
───────────────────────────────────────────── */
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
  onOpen: () => void
}

function PropertyCard({ property, onOpen }: PropertyCardProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="block w-full overflow-hidden rounded-xl border border-outline bg-white text-left shadow-ambient transition-shadow duration-200 hover:shadow-card-hover focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <div className="relative">
        <img src={property.image} alt={property.name} className="w-full h-44 object-cover" />
        <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold bg-white/90 text-[#0f172a] backdrop-blur-sm">
          {property.type}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-[16px] font-bold text-[#0f172a]">{property.name}</h3>
        <div className="flex items-center gap-1 mt-1 text-label text-text-muted">
          <MapPin size={11} />
          <span>{property.location}</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3">
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
          <span className="inline-flex items-center gap-0.5 text-[12px] font-semibold text-primary">
            View <ChevronRight size={13} />
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
  const navigate = useNavigate()
  const { assignedProperties: portfolioProperties } = useBrokerPrototype()

  if (portfolioProperties.length === 0) {
    return (
      <div className="rounded-card border border-outline bg-white p-10 text-center">
        <h1 className="text-heading-2 font-bold text-text-primary">Portfolio awaiting assignment</h1>
        <p className="mt-2 text-body text-text-muted">Approved properties will populate this portfolio.</p>
      </div>
    )
  }

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
                Premium Tier
              </span>
            </div>
          </div>

          {/* Action buttons */}
          {/* <div className="flex items-center gap-2 shrink-0 mt-1">
            <button className="px-4 py-2 rounded-lg border border-outline text-[13px] font-semibold text-[#0f172a] bg-white hover:bg-hover-light transition-colors">
              Remove Broker
            </button>
            <button className="px-4 py-2 rounded-lg text-[13px] font-bold text-white bg-[#0f172a] hover:bg-navy/80 transition-colors">
              Reassign Broker
            </button>
          </div> */}
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
          value="₹184.5L"
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

        {/* Monthly Broker Leaderboard */}
        <div className="bg-white border border-outline rounded-xl p-6 shadow-ambient">
          <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                June Leaderboard
              </p>
              <h2 className="mt-1 text-[16px] font-bold text-[#0f172a]">Broker Ranking Dashboard</h2>
              <p className="mt-1 text-label text-text-muted">
                Ranked by closed deals, lead response quality, and verified tenant conversions.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0f172a] px-3 py-1.5 text-[11px] font-bold text-white">
              <Trophy size={13} />
              Rank #3 this month
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
            <article className="rounded-xl bg-[#0f172a] p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                  <Medal size={24} className="text-amber-300" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Current Rank
                  </p>
                  <p className="text-[36px] font-extrabold leading-none">#3</p>
                </div>
              </div>
              <p className="mt-4 text-[13px] leading-6 text-slate-300">
                Jonathan is performing better than 96% of brokers this month.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-white/10 p-3">
                  <p className="text-[20px] font-bold">24</p>
                  <p className="mt-1 text-[10px] uppercase text-slate-400">Deals</p>
                </div>
                <div className="rounded-lg bg-white/10 p-3">
                  <p className="text-[20px] font-bold">91</p>
                  <p className="mt-1 text-[10px] uppercase text-slate-400">Score</p>
                </div>
              </div>
            </article>

            <div className="space-y-2">
              {monthlyLeaderboard.map((broker) => (
                <div
                  key={broker.rank}
                  className={`grid grid-cols-[40px_minmax(0,1fr)_70px_72px] items-center gap-3 rounded-xl border px-4 py-3 ${
                    broker.current
                      ? 'border-primary bg-primary-50'
                      : 'border-outline bg-canvas'
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-[13px] font-extrabold ${
                      broker.current ? 'bg-primary text-white' : 'bg-white text-[#0f172a]'
                    }`}
                  >
                    {broker.rank}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-bold text-[#0f172a]">{broker.name}</p>
                    <p className="mt-0.5 text-[11px] text-text-muted">
                      {broker.deals} deals - {broker.leads} active leads
                    </p>
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-[#0f172a]">{broker.score}</p>
                    <p className="text-[10px] uppercase text-text-muted">Score</p>
                  </div>
                  <span
                    className={`rounded-pill px-2 py-1 text-center text-[10px] font-bold ${
                      broker.change.startsWith('+')
                        ? 'bg-green-50 text-green-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {broker.change}
                  </span>
                </div>
              ))}
            </div>
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
          <span className="text-[13px] font-semibold text-text-muted">{portfolioProperties.length} properties</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
          {portfolioProperties.map((property) => (
            <div key={property.id} className="min-w-[300px] max-w-[340px] shrink-0">
              <PropertyCard
                property={property}
                onOpen={() => navigate(ROUTES.BROKER.PROPERTY(property.id))}
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
