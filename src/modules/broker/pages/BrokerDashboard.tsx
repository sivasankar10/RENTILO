import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building2,
  Users,
  Handshake,
  DollarSign,
  MessageCircle,
  Phone,
  MapPin,
  Calendar,
  CalendarDays,
  TrendingUp,
  Download,
  FileText,
  X,
} from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import skylineImg from '@/assets/images/skyline_heights.png'

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
  conversationId: string
  onChat: (conversationId: string) => void
}

function LeadRow({ avatar, name, property, pill, conversationId, onChat }: LeadRowProps) {
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
      <button
        type="button"
        onClick={() => onChat(conversationId)}
        className="p-1.5 rounded-full text-text-muted hover:bg-hover-light hover:text-primary transition-colors"
        title="Chat"
        aria-label={`Chat with ${name}`}
      >
        <MessageCircle size={15} />
      </button>
      <button
        type="button"
        className="p-1.5 rounded-full text-text-muted hover:bg-hover-light transition-colors"
        title="Call"
      >
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

type Visit = {
  id: number
  month: string
  day: string
  title: string
  client: string
  time: string
  property: string
}

const initialVisits: Visit[] = [
  {
    id: 1,
    month: 'OCT',
    day: '15',
    title: 'Penthouse Tour',
    client: 'Julianna Smith',
    time: '2:00 PM',
    property: 'Skyline Heights 14B',
  },
]

const visitProperties = ['Skyline Heights 14B', 'Harbor Residences 8C', 'Garden Lofts Apt 12']
const visitClients = ['Julianna Smith', 'Robert King', 'Meera Iyer', 'Arjun Patel']

const last30DayMetrics = [
  { label: 'Assigned Properties', value: '8', detail: '+2 new assignments' },
  { label: 'Active Leads', value: '12', detail: '5 hot leads, 7 follow-ups' },
  { label: 'Visits Scheduled', value: '9', detail: '6 completed, 3 upcoming' },
  { label: 'Closed Deals', value: '3', detail: 'Rs. 45,000 commission' },
]

const last30DayProperties = [
  {
    property: 'Skyline Heights 14B',
    leads: 6,
    visits: 3,
    status: 'High Priority',
    nextStep: 'Robert King site visit tomorrow',
  },
  {
    property: 'Penthouse Loft A',
    leads: 4,
    visits: 2,
    status: 'Hot',
    nextStep: 'Julianna Smith private showing',
  },
  {
    property: 'Harbor Residences 8C',
    leads: 2,
    visits: 1,
    status: 'Follow-up',
    nextStep: 'Owner availability confirmation',
  },
]

const last30DayActivities = [
  {
    title: 'Lead conversion improved',
    description: 'Hot lead response time reduced to 18 minutes across assigned properties.',
  },
  {
    title: 'Visits scheduled',
    description: 'Three new tenant visits were scheduled for Skyline Heights and Penthouse Loft A.',
  },
  {
    title: 'Deal progress',
    description: 'Three deals are in closing review with owner approval pending.',
  },
]

function escapeCsvValue(value: string | number) {
  const text = String(value)
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }

  return text
}

function downloadCsv(filename: string, rows: Array<Record<string, string | number>>) {
  if (!rows.length) return

  const headers = Object.keys(rows[0])
  const csv = [
    headers.map(escapeCsvValue).join(','),
    ...rows.map((row) => headers.map((header) => escapeCsvValue(row[header])).join(',')),
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function buildBrokerDashboardExportRows() {
  return [
    ...last30DayMetrics.map((metric) => ({
      section: 'Summary',
      item: metric.label,
      value: metric.value,
      detail: metric.detail,
    })),
    ...last30DayProperties.map((property) => ({
      section: 'Property Performance',
      item: property.property,
      value: `${property.leads} leads / ${property.visits} visits`,
      detail: `${property.status} - ${property.nextStep}`,
    })),
    ...last30DayActivities.map((activity) => ({
      section: 'Activity',
      item: activity.title,
      value: 'Last 30 Days',
      detail: activity.description,
    })),
  ]
}

/* ─────────────────────────────────────────────
   Upcoming Visit Card
───────────────────────────────────────────── */
function UpcomingVisitCard({ visit }: { visit: Visit }) {
  return (
    <div className="border-l-4 border-primary rounded-r-xl bg-white shadow-ambient p-4 flex items-start gap-4">
      <div className="text-center min-w-[48px]">
        <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">{visit.month}</p>
        <p className="text-[2rem] font-bold leading-none text-[#0f172a]">{visit.day}</p>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold text-[#0f172a]">{visit.title}</p>
        <p className="text-label text-text-muted">{visit.client} · {visit.time}</p>
        <button className="mt-2 inline-flex items-center gap-1 text-label font-semibold text-primary hover:underline">
          <MapPin size={11} />
          {visit.property}
        </button>
      </div>
    </div>
  )
}

function Last30DaysReportModal({
  onClose,
  onExport,
}: {
  onClose: () => void
  onExport: () => void
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-[#0f172a]/60 px-4 py-6 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="last-30-days-title"
        className="w-full max-w-5xl rounded-2xl bg-white shadow-card"
      >
        <div className="flex flex-col gap-4 border-b border-outline px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Broker Performance
            </p>
            <h2 id="last-30-days-title" className="mt-1 text-[24px] font-extrabold text-[#0f172a]">
              Last 30 Days Report
            </h2>
            <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-text-muted">
              Sample dashboard view for recent broker activity, property performance, lead health,
              and upcoming follow-ups.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onExport}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0f172a] px-4 text-[13px] font-bold text-white hover:bg-navy/90"
            >
              <Download size={14} />
              Export CSV
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-outline bg-white text-text-muted hover:bg-hover-light hover:text-[#0f172a]"
              aria-label="Close last 30 days report"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-6 p-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {last30DayMetrics.map((metric) => (
              <article key={metric.label} className="rounded-xl border border-outline bg-canvas p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  {metric.label}
                </p>
                <p className="mt-2 text-[28px] font-extrabold leading-none text-[#0f172a]">
                  {metric.value}
                </p>
                <p className="mt-2 text-[12px] font-semibold text-primary">{metric.detail}</p>
              </article>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <section className="overflow-hidden rounded-xl border border-outline">
              <div className="border-b border-outline bg-canvas px-5 py-4">
                <h3 className="text-[15px] font-bold text-[#0f172a]">Property Performance</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left">
                  <thead className="bg-white text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    <tr>
                      <th className="px-5 py-3">Property</th>
                      <th className="px-5 py-3">Leads</th>
                      <th className="px-5 py-3">Visits</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Next Step</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline">
                    {last30DayProperties.map((property) => (
                      <tr key={property.property}>
                        <td className="px-5 py-4 text-[13px] font-bold text-[#0f172a]">
                          {property.property}
                        </td>
                        <td className="px-5 py-4 text-[13px] text-text-muted">{property.leads}</td>
                        <td className="px-5 py-4 text-[13px] text-text-muted">{property.visits}</td>
                        <td className="px-5 py-4">
                          <span className="rounded-pill bg-primary-100 px-2.5 py-1 text-[10px] font-bold uppercase text-primary">
                            {property.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-[13px] text-text-muted">{property.nextStep}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <aside className="rounded-xl border border-outline bg-canvas p-5">
              <h3 className="text-[15px] font-bold text-[#0f172a]">Activity Highlights</h3>
              <div className="mt-5 space-y-4">
                {last30DayActivities.map((activity) => (
                  <div key={activity.title} className="rounded-lg bg-white p-4 shadow-ambient">
                    <p className="text-[13px] font-bold text-[#0f172a]">{activity.title}</p>
                    <p className="mt-1 text-[12px] leading-relaxed text-text-muted">
                      {activity.description}
                    </p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}

function ScheduleVisitModal({
  onClose,
  onSchedule,
}: {
  onClose: () => void
  onSchedule: (visit: Visit) => void
}) {
  const [client, setClient] = useState(visitClients[0])
  const [property, setProperty] = useState(visitProperties[0])
  const [date, setDate] = useState('2024-10-16')
  const [time, setTime] = useState('11:30 AM')
  const [visitType, setVisitType] = useState('Guided property tour')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const visitDate = new Date(`${date}T00:00:00`)
    onSchedule({
      id: Date.now(),
      month: visitDate.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
      day: String(visitDate.getDate()).padStart(2, '0'),
      title: visitType,
      client,
      time,
      property,
    })
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#0f172a]/60 px-4 py-6 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl bg-white shadow-card"
      >
        <div className="flex items-center justify-between border-b border-outline px-5 py-4">
          <div>
            <h2 className="text-[18px] font-bold text-[#0f172a]">Schedule Visit</h2>
            <p className="mt-0.5 text-[12px] text-text-muted">
              Mock appointment data for the broker dashboard.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-text-muted hover:bg-hover-light hover:text-[#0f172a]"
            aria-label="Close schedule visit"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-[12px] font-bold uppercase tracking-wider text-text-muted">
              Client
            </span>
            <select
              value={client}
              onChange={(event) => setClient(event.target.value)}
              className="h-11 w-full rounded-lg border border-outline bg-white px-3 text-[14px] text-[#0f172a] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {visitClients.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-[12px] font-bold uppercase tracking-wider text-text-muted">
              Property
            </span>
            <select
              value={property}
              onChange={(event) => setProperty(event.target.value)}
              className="h-11 w-full rounded-lg border border-outline bg-white px-3 text-[14px] text-[#0f172a] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {visitProperties.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-[12px] font-bold uppercase tracking-wider text-text-muted">
              Date
            </span>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="h-11 w-full rounded-lg border border-outline bg-white px-3 text-[14px] text-[#0f172a] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-[12px] font-bold uppercase tracking-wider text-text-muted">
              Time
            </span>
            <select
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className="h-11 w-full rounded-lg border border-outline bg-white px-3 text-[14px] text-[#0f172a] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {['10:00 AM', '11:30 AM', '2:00 PM', '4:30 PM'].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-[12px] font-bold uppercase tracking-wider text-text-muted">
              Visit Type
            </span>
            <input
              value={visitType}
              onChange={(event) => setVisitType(event.target.value)}
              className="h-11 w-full rounded-lg border border-outline bg-white px-3.5 text-[14px] text-[#0f172a] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
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
            type="submit"
            className="h-10 rounded-lg bg-[#0f172a] px-4 text-[13px] font-bold text-white hover:bg-navy/90"
          >
            Add Visit
          </button>
        </div>
      </form>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main Dashboard
───────────────────────────────────────────── */
export function BrokerDashboard() {
  const navigate = useNavigate()
  const [visits, setVisits] = useState(initialVisits)
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [exportStatus, setExportStatus] = useState('')

  const openLeadChat = (conversationId: string) => {
    navigate(`${ROUTES.BROKER.MESSAGES}?conversation=${encodeURIComponent(conversationId)}`)
  }

  const exportDashboardData = () => {
    downloadCsv('rentilo-broker-last-30-days.csv', buildBrokerDashboardExportRows())
    setExportStatus('Last 30 days CSV exported.')
  }

  const handleScheduleVisit = (visit: Visit) => {
    setVisits((currentVisits) => [visit, ...currentVisits])
    setScheduleOpen(false)
  }

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
          <button
            type="button"
            onClick={() => {
              setReportOpen(true)
              setExportStatus('')
            }}
            className="inline-flex items-center gap-1.5 border border-outline rounded-lg px-3 py-2 text-label font-semibold text-text-muted bg-white hover:bg-hover-light transition-colors shadow-ambient"
          >
            <CalendarDays size={13} />
            Last 30 Days
          </button>
          <button
            type="button"
            onClick={exportDashboardData}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-label font-bold text-white bg-[#0f172a] hover:bg-navy/90 transition-colors shadow-ambient"
          >
            <Download size={13} />
            Export Data
          </button>
        </div>
        {exportStatus && (
          <p className="w-full text-right text-label font-semibold text-status-success">
            {exportStatus}
          </p>
        )}
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
          value="₹45,000"
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
            conversationId="lead-julianna-smith"
            onChat={openLeadChat}
          />
          <LeadRow
            avatar="https://randomuser.me/api/portraits/men/32.jpg"
            name="Robert King"
            property="Skyline Heights 14B"
            pill="follow-up"
            conversationId="lead-robert-king"
            onChat={openLeadChat}
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

          <div className="space-y-3">
            {visits.map((visit) => (
              <UpcomingVisitCard key={visit.id} visit={visit} />
            ))}
          </div>

          {/* No other visits today */}
          <div className="flex-1 border-2 border-dashed border-outline rounded-xl flex flex-col items-center justify-center gap-2 py-5">
            <CalendarDays size={28} className="text-text-muted opacity-50" />
            <p className="text-label text-text-muted font-medium">
              {visits.length > 1 ? `${visits.length - 1} mock visit added` : 'No other visits today'}
            </p>
            <button
              type="button"
              onClick={() => setScheduleOpen(true)}
              className="mt-1 px-4 py-1.5 rounded-lg bg-[#0f172a] text-white text-label font-bold hover:bg-navy/80 transition-colors"
            >
              Schedule Visit
            </button>
          </div>
        </div>
      </div>

      {scheduleOpen && (
        <ScheduleVisitModal
          onClose={() => setScheduleOpen(false)}
          onSchedule={handleScheduleVisit}
        />
      )}

      {reportOpen && (
        <Last30DaysReportModal
          onClose={() => setReportOpen(false)}
          onExport={exportDashboardData}
        />
      )}
    </div>
  )
}
