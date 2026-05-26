import {
  Building2,
  Users,
  Handshake,
  DollarSign,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  Download,
  ChevronRight,
  FileText,
} from 'lucide-react'
import skylineImg from '@/assets/images/skyline_heights.png'
import marketImg from '@/assets/images/market_insights.png'

/* ─────────────────────────────────────────────
   Stat Card
───────────────────────────────────────────── */
interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  badge?: React.ReactNode
  dark?: boolean
}

function StatCard({ icon, label, value, badge, dark }: StatCardProps) {
  return (
    <div
      className={`rounded-xl p-5 flex flex-col gap-3 shadow-ambient ${
        dark ? 'bg-[#0f172a] text-white' : 'bg-white border border-outline'
      }`}
    >
      <div className={`flex items-center gap-2 ${dark ? 'text-slate-400' : 'text-text-muted'}`}>
        <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
        <span className="text-label font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <div className={`text-[2rem] font-bold leading-none tracking-tight ${dark ? 'text-white' : 'text-[#0f172a]'}`}>
        {value}
      </div>
      {badge && <div>{badge}</div>}
    </div>
  )
}

/* ─────────────────────────────────────────────
   Badge helpers
───────────────────────────────────────────── */
function GreenBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-status-success">
      <TrendingUp size={12} />
      {children}
    </span>
  )
}

function NeutralBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-text-muted">
      — {children}
    </span>
  )
}

function WarningBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-status-warning">
      ⚠ {children}
    </span>
  )
}

function CurrentPeriodBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
      <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
      Current period
    </span>
  )
}

/* ─────────────────────────────────────────────
   Lead pills
───────────────────────────────────────────── */
function LeadPill({ type }: { type: 'hot' | 'follow-up' }) {
  if (type === 'hot') {
    return (
      <span className="px-2 py-0.5 rounded-pill text-[10px] font-bold bg-red-100 text-red-600">
        Hot Lead
      </span>
    )
  }
  return (
    <span className="px-2 py-0.5 rounded-pill text-[10px] font-bold bg-blue-100 text-blue-600">
      Follow-up
    </span>
  )
}

/* ─────────────────────────────────────────────
   Lead Row
───────────────────────────────────────────── */
interface LeadRowProps {
  avatar: string
  name: string
  property: string
  pill: 'hot' | 'follow-up'
}

function LeadRow({ avatar, name, property, pill }: LeadRowProps) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-outline last:border-0">
      <img
        src={avatar}
        alt={name}
        className="w-10 h-10 rounded-full object-cover shrink-0 bg-slate-200"
      />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-[#0f172a] truncate">{name}</p>
        <p className="text-label text-text-muted truncate">{property}</p>
      </div>
      <LeadPill type={pill} />
      <button className="p-1.5 rounded-full text-text-muted hover:bg-hover-light transition-colors" title="Email">
        <Mail size={15} />
      </button>
      <button className="p-1.5 rounded-full text-text-muted hover:bg-hover-light transition-colors" title="Call">
        <Phone size={15} />
      </button>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Activity Timeline item
───────────────────────────────────────────── */
interface ActivityItemProps {
  title: string
  time: string
  description: string
  attachment?: string
  dotActive?: boolean
}

function ActivityItem({ title, time, description, attachment, dotActive }: ActivityItemProps) {
  return (
    <div className="relative pl-6 pb-5 last:pb-0">
      {/* vertical line */}
      <span className="absolute left-[6px] top-5 bottom-0 w-px bg-outline" />
      {/* dot */}
      <span
        className={`absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 ${
          dotActive ? 'border-[#0f172a] bg-[#0f172a]' : 'border-outline bg-white'
        }`}
      />
      <div className="flex items-baseline gap-2 mb-0.5">
        <span className="text-[13px] font-semibold text-[#0f172a]">{title}</span>
        <span className="text-[10px] text-text-muted ml-auto shrink-0">{time}</span>
      </div>
      <p className="text-label text-text-muted leading-relaxed">{description}</p>
      {attachment && (
        <div className="mt-2 flex items-center gap-2 border border-outline rounded-lg px-3 py-2 bg-canvas w-fit">
          <FileText size={14} className="text-red-500" />
          <span className="text-label text-[#0f172a] font-medium">{attachment}</span>
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   Upcoming Visit Card
───────────────────────────────────────────── */
function UpcomingVisitCard() {
  return (
    <div className="border-l-4 border-primary rounded-r-xl bg-white shadow-ambient p-4 flex items-start gap-4">
      <div className="text-center min-w-[48px]">
        <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">OCT</p>
        <p className="text-[2rem] font-bold leading-none text-[#0f172a]">15</p>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold text-[#0f172a]">Penthouse Tour</p>
        <p className="text-label text-text-muted">Julianna Smith · 2:00 PM</p>
        <button className="mt-2 inline-flex items-center gap-1 text-label font-semibold text-primary hover:underline">
          <MapPin size={11} />
          Get Directions
        </button>
      </div>
    </div>
  )
}



/* ─────────────────────────────────────────────
   Main Dashboard
───────────────────────────────────────────── */
export function BrokerDashboard() {
  return (
    <div className="space-y-6 pb-10">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[22px] font-bold text-[#0f172a] tracking-tight">Broker Overview</h1>
          <p className="text-label text-text-muted mt-0.5">
            Welcome back, Agent Smith. Here is your portfolio performance.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="inline-flex items-center gap-1.5 border border-outline rounded-lg px-3 py-2 text-label font-semibold text-text-muted bg-white hover:bg-hover-light transition-colors shadow-ambient">
            <CalendarDays size={13} />
            Last 30 Days
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-label font-bold text-white bg-[#0f172a] hover:bg-navy/90 transition-colors shadow-ambient">
            <Download size={13} />
            Export Data
          </button>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Building2 size={16} />}
          label="Assigned Properties"
          value="8"
          badge={<GreenBadge>2 this month</GreenBadge>}
        />
        <StatCard
          icon={<Users size={16} />}
          label="Active Leads"
          value="12"
          badge={<NeutralBadge>Stable interest</NeutralBadge>}
        />
        <StatCard
          icon={<Handshake size={16} />}
          label="Deals in Progress"
          value="3"
          badge={<WarningBadge>Closing pending</WarningBadge>}
        />
        <StatCard
          icon={<DollarSign size={16} />}
          label="Monthly Earnings"
          value="$4,500"
          badge={<CurrentPeriodBadge />}
          dark
        />
      </div>

      {/* ── Middle Row: Recent Leads + Activity Timeline ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">

        {/* Recent Leads */}
        <div className="bg-white border border-outline rounded-xl p-5 shadow-ambient">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-[15px] font-bold text-[#0f172a]">Recent Leads</h2>
            <button className="text-label font-semibold text-primary hover:underline">View CRM</button>
          </div>
          <LeadRow
            avatar="https://randomuser.me/api/portraits/women/44.jpg"
            name="Julianna Smith"
            property="Penthouse Loft A"
            pill="hot"
          />
          <LeadRow
            avatar="https://randomuser.me/api/portraits/men/32.jpg"
            name="Robert King"
            property="Skyline Heights 14B"
            pill="follow-up"
          />
        </div>

        {/* Activity Timeline */}
        <div className="bg-white border border-outline rounded-xl p-5 shadow-ambient">
          <h2 className="text-[15px] font-bold text-[#0f172a] mb-4">Activity Timeline</h2>
          <ActivityItem
            title="property assigned"
            time="2h ago"
            description="Robert King finalized papers for Unit 14B."
            attachment="Lease_King_14B.pdf"
            dotActive
          />
          <ActivityItem
            title="Lead assigned"
            time="5h ago"
            description="Julianna Smith inquired about Penthouse A."
          />
          <ActivityItem
            title="Tenant Property tour"
            time="Yesterday"
            description="Plumbing issue reported in Loft C."
          />
          <ActivityItem
            title="Status"
            time="Oct 12"
            description="3 prospects visited the Business Center."
          />
        </div>
      </div>

      {/* ── Bottom Row: Property card + Visits ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4">

        {/* Skyline Heights property card */}
        <div className="relative rounded-xl overflow-hidden shadow-card min-h-[230px]">
          <img
            src={skylineImg}
            alt="Skyline Heights"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="text-white text-[17px] font-bold">Skyline Heights</h3>
            <p className="text-white/70 text-label mt-0.5">Unit 14B · Available for Showing</p>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white">
                High Priority
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white backdrop-blur-sm">
                $2.4M
              </span>
            </div>
          </div>
        </div>

        {/* Upcoming Visits panel */}
        <div className="bg-white border border-outline rounded-xl p-5 shadow-ambient flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-text-muted" />
            <h2 className="text-[14px] font-bold text-[#0f172a]">Upcoming Visits</h2>
          </div>

          <UpcomingVisitCard />

          {/* No other visits today */}
          <div className="flex-1 border-2 border-dashed border-outline rounded-xl flex flex-col items-center justify-center gap-2 py-5">
            <CalendarDays size={28} className="text-text-muted opacity-50" />
            <p className="text-label text-text-muted font-medium">No other visits today</p>
            <button className="mt-1 px-4 py-1.5 rounded-lg bg-[#0f172a] text-white text-label font-bold hover:bg-navy/80 transition-colors">
              Schedule Visit
            </button>
          </div>
        </div>
      </div>

      {/* ── Market Insights ── */}
      <div className="relative rounded-2xl overflow-hidden shadow-card min-h-[260px]">
        {/* Background image (right side) */}
        <img
          src={marketImg}
          alt="Market Insights"
          className="absolute right-0 top-0 h-full w-[60%] object-cover"
        />
        {/* gradient left overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent" />

        <div className="relative z-10 p-8 max-w-[400px]">
          <h2 className="text-[26px] font-bold text-[#0f172a] leading-tight">
            Market<br />Insights
          </h2>
          <p className="text-body text-text-muted mt-3 leading-relaxed">
            Residential property values in your sector have increased by 4.2% this quarter.
            High demand for lofts continues.
          </p>

          {/* Market stats chips — overlay on image side */}
          <div className="flex gap-2 mt-4 flex-wrap">
            <div className="bg-[#0f172a] rounded-lg px-3 py-2 min-w-[90px]">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Avg Rent</p>
              <p className="text-base font-bold text-white mt-0.5">$3,200</p>
              <p className="text-[10px] font-semibold text-green-400 mt-0.5 inline-flex items-center gap-0.5">
                <TrendingUp size={9} /> +1.2%
              </p>
            </div>
            <div className="bg-[#0f172a] rounded-lg px-3 py-2 min-w-[90px]">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Occupancy</p>
              <p className="text-base font-bold text-white mt-0.5">94%</p>
              <p className="text-[10px] font-semibold text-red-400 mt-0.5 inline-flex items-center gap-0.5">
                <TrendingDown size={9} /> -0.5%
              </p>
            </div>
            <div className="bg-[#0f172a] rounded-lg px-3 py-2 min-w-[90px]">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Days on Market</p>
              <p className="text-base font-bold text-white mt-0.5">18</p>
              <p className="text-[10px] font-semibold text-green-400 mt-0.5 inline-flex items-center gap-0.5">
                <TrendingUp size={9} /> -4 days
              </p>
            </div>
          </div>

          <button className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0f172a] hover:text-primary transition-colors">
            View Detailed Report
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

    </div>
  )
}
