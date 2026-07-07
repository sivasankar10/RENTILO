import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building2,
  Users,
  Handshake,
  DollarSign,
  MessageCircle,
  Phone,
  Calendar,
  CalendarDays,
  CheckCircle,
  TrendingUp,
  Download,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { useBrokerPrototype } from '../hooks/useBrokerPrototype'

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
type Activity = {
  id: number
  title: string
  time: string
  description: string
  done?: boolean
  dotActive?: boolean
}

interface ActivityItemProps extends Activity {
  onEdit: (activity: Activity) => void
  onMarkDone: (activityId: number) => void
}

function ActivityItem({
  id,
  title,
  time,
  description,
  done,
  dotActive,
  onEdit,
  onMarkDone,
}: ActivityItemProps) {
  return (
    <div className={`relative pl-6 pb-5 last:pb-0 ${done ? 'opacity-50' : ''}`}>
      {/* vertical line */}
      <span className="absolute left-[6px] top-5 bottom-0 w-px bg-outline" />
      {/* dot */}
      <span
        className={`absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 ${
          done ? 'border-green-500 bg-green-500' : dotActive ? 'border-[#0f172a] bg-[#0f172a]' : 'border-outline bg-white'
        }`}
      />
      <div className="flex items-start gap-2 mb-0.5">
        <span className={`text-[13px] font-semibold ${done ? 'line-through text-text-muted' : 'text-[#0f172a]'}`}>{title}</span>
        <div className="ml-auto flex shrink-0 items-center gap-1">
          <span className="text-[10px] text-text-muted">{time}</span>
          {!done && (
            <>
              <button
                type="button"
                onClick={() => onEdit({ id, title, time, description, done, dotActive })}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-text-muted hover:bg-hover-light hover:text-primary"
                title={`Edit ${title}`}
                aria-label={`Edit ${title}`}
              >
                <Pencil size={13} />
              </button>
              <button
                type="button"
                onClick={() => onMarkDone(id)}
                className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-[10px] font-bold text-green-700 bg-green-50 hover:bg-green-100"
                title="Mark as done"
              >
                <CheckCircle size={12} />
                Done
              </button>
            </>
          )}
        </div>
      </div>
      <p className="text-label text-text-muted leading-relaxed">{description}</p>
    </div>
  )
}

const last30DayMetrics = [
  { label: 'Assigned Properties', value: '8', detail: '+2 new assignments' },
  { label: 'Active Leads', value: '12', detail: '5 hot leads, 7 follow-ups' },
  { label: 'Visits Scheduled', value: '9', detail: '6 completed, 3 upcoming' },
  { label: 'Closed Deals', value: '3', detail: 'Rs. 45,000 commission' },
]

const ACTIVITY_STORAGE_KEY = 'rentilo-broker-dashboard-activities'

function loadActivities() {
  try {
    const savedActivities = sessionStorage.getItem(ACTIVITY_STORAGE_KEY)
    return savedActivities ? (JSON.parse(savedActivities) as Activity[]) : []
  } catch {
    return []
  }
}

function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

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
  ]
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

          <div>
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

          </div>
        </div>
      </section>
    </div>
  )
}

function ActivityEditorModal({
  activity,
  onClose,
  onSave,
  onDelete,
}: {
  activity: Activity | null
  onClose: () => void
  onSave: (activity: Activity) => void
  onDelete: (activityId: number) => void
}) {
  const [title, setTitle] = useState(activity?.title ?? '')
  const [time, setTime] = useState(activity?.time ?? 'Just now')
  const [description, setDescription] = useState(activity?.description ?? '')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSave({
      id: activity?.id ?? Date.now(),
      title: title.trim(),
      time: time.trim(),
      description: description.trim(),
      dotActive: activity?.dotActive ?? true,
    })
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#0f172a]/60 px-4 py-6 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-card"
      >
        <div className="flex items-center justify-between border-b border-outline px-5 py-4">
          <div>
            <h2 className="text-[18px] font-bold text-[#0f172a]">
              {activity ? 'Edit Activity' : 'Add Activity'}
            </h2>
            <p className="mt-0.5 text-[12px] text-text-muted">
              Keep the broker timeline accurate and up to date.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-text-muted hover:bg-hover-light hover:text-[#0f172a]"
            aria-label="Close activity editor"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-[12px] font-bold uppercase tracking-wider text-text-muted">
              Activity
            </span>
            <input
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Follow-up completed"
              className="h-11 w-full rounded-lg border border-outline px-3.5 text-[14px] text-[#0f172a] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-[12px] font-bold uppercase tracking-wider text-text-muted">
              Time Label
            </span>
            <input
              required
              value={time}
              onChange={(event) => setTime(event.target.value)}
              placeholder="e.g. 10 mins ago"
              className="h-11 w-full rounded-lg border border-outline px-3.5 text-[14px] text-[#0f172a] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-[12px] font-bold uppercase tracking-wider text-text-muted">
              Description
            </span>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Add the activity details"
              className="w-full resize-none rounded-lg border border-outline px-3.5 py-3 text-[14px] text-[#0f172a] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-outline px-5 py-4">
          {activity ? (
            <button
              type="button"
              onClick={() => onDelete(activity.id)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
              title="Delete activity"
              aria-label="Delete activity"
            >
              <Trash2 size={16} />
            </button>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-lg border border-outline px-4 text-[13px] font-bold text-text-muted hover:bg-hover-light"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0f172a] px-4 text-[13px] font-bold text-white hover:bg-navy/90"
            >
              <Save size={15} />
              Save Activity
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

/* ─────────────────────────────────────────────
/* ─────────────────────────────────────────────
   Main Dashboard
    `${defaultDate.getFullYear()}-${String(defaultDate.getMonth() + 1).padStart(2, '0')}-${String(defaultDate.getDate()).padStart(2, '0')}`,
  )
  const [time, setTime] = useState('11:30 AM')
  const [visitType, setVisitType] = useState('Guided property tour')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSchedule({
      id: Date.now(),
      date,
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
              min={new Date().toISOString().slice(0, 10)}
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
/* ─────────────────────────────────────────────
   Main Dashboard
───────────────────────────────────────────── */

export function BrokerDashboard() {
  const navigate = useNavigate()
  const { assignedProperties, leads, commissions, users, properties } = useBrokerPrototype()
  const successfulCommission = commissions.filter((item) => item.status === 'Successful').reduce((sum, item) => sum + item.amount, 0)

  // Dynamic interested tenants from leads (applications that are still active leads)
  const interestedTenants = useMemo(() => leads
    .filter((app) => !['active', 'rejected', 'payment_completed'].includes(app.status))
    .map((app) => {
      const tenant = users.find((u) => u.id === app.tenantId)
      const property = properties.find((p) => p.id === app.propertyId)
      return {
        id: app.id,
        name: tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Unknown',
        avatar: tenant?.avatar ?? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
        property: property?.title ?? 'Unknown Property',
        time: new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      }
    }), [leads, users, properties])

  // Dynamic upcoming visits from leads with scheduledVisit
  const upcomingVisits = useMemo(() => leads
    .filter((app) => app.scheduledVisit && ['visit_scheduled', 'visit_confirmed'].includes(app.status))
    .map((app) => {
      const tenant = users.find((u) => u.id === app.tenantId)
      const visit = app.scheduledVisit!
      return {
        id: app.id,
        name: tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Unknown',
        avatar: tenant?.avatar ?? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
        date: visit.date,
        time: visit.time,
        status: app.status === 'visit_confirmed' ? 'Confirmed' : 'Pending',
      }
    }), [leads, users])
  const [manualActivities, setManualActivities] = useState<Activity[]>(loadActivities)
  const [doneActivityIds, setDoneActivityIds] = useState<Set<number>>(() => {
    try {
      const saved = sessionStorage.getItem('rentilo-broker-done-activities')
      return saved ? new Set(JSON.parse(saved) as number[]) : new Set()
    } catch { return new Set() }
  })
  const [activityEditorOpen, setActivityEditorOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [reportOpen, setReportOpen] = useState(false)
  const [exportStatus, setExportStatus] = useState('')

  // Generate dynamic activities from assignments and leads
  const dynamicActivities = useMemo<Activity[]>(() => {
    const items: Activity[] = []

    // Property assignments
    assignedProperties.forEach((prop) => {
      items.push({
        id: simpleHash(`assign-${prop.id}`),
        title: 'Property assigned',
        time: 'Recent',
        description: `${prop.name} has been assigned to you for tenant matching.`,
        dotActive: true,
      })
    })

    // Interested tenants (leads)
    leads.forEach((lead) => {
      const tenant = users.find((u) => u.id === lead.tenantId)
      const property = properties.find((p) => p.id === lead.propertyId)
      const tenantName = tenant ? `${tenant.firstName} ${tenant.lastName}` : 'A tenant'
      items.push({
        id: simpleHash(`lead-${lead.id}`),
        title: 'New tenant interested',
        time: new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        description: `${tenantName} showed interest in ${property?.title ?? 'a property'}.`,
        dotActive: lead.status === 'interest_shown',
      })

      // Visit scheduled
      if (lead.scheduledVisit && ['visit_scheduled', 'visit_confirmed'].includes(lead.status)) {
        items.push({
          id: simpleHash(`visit-${lead.id}`),
          title: 'Visit scheduled',
          time: lead.scheduledVisit.date,
          description: `${tenantName} scheduled a visit for ${property?.title ?? 'a property'} at ${lead.scheduledVisit.time}.`,
          dotActive: true,
        })
      }
    })

    return items
  }, [assignedProperties, leads, users, properties])

  // Merge dynamic + manual, apply done state, sort: non-done first, done at bottom
  const activities = useMemo(() => {
    const all = [...dynamicActivities, ...manualActivities].map((activity) => ({
      ...activity,
      done: activity.done || doneActivityIds.has(activity.id),
    }))
    return all.sort((a, b) => {
      if (a.done && !b.done) return 1
      if (!a.done && b.done) return -1
      return 0
    })
  }, [dynamicActivities, manualActivities, doneActivityIds])

  useEffect(() => {
    sessionStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(manualActivities))
  }, [manualActivities])

  const openLeadChat = (conversationId: string) => {
    navigate(`${ROUTES.BROKER.MESSAGES}?conversation=${encodeURIComponent(conversationId)}`)
  }

  const exportDashboardData = () => {
    downloadCsv('rentilo-broker-last-30-days.csv', buildBrokerDashboardExportRows())
    setExportStatus('Last 30 days CSV exported.')
  }

  const openActivityEditor = (activity: Activity | null) => {
    setSelectedActivity(activity)
    setActivityEditorOpen(true)
  }

  const saveActivity = (activity: Activity) => {
    setManualActivities((currentActivities) => {
      const exists = currentActivities.some((item) => item.id === activity.id)
      return exists
        ? currentActivities.map((item) => (item.id === activity.id ? activity : item))
        : [activity, ...currentActivities]
    })
    setActivityEditorOpen(false)
    setSelectedActivity(null)
  }

  const markActivityDone = (activityId: number) => {
    setDoneActivityIds((current) => {
      const updated = new Set(current)
      updated.add(activityId)
      sessionStorage.setItem('rentilo-broker-done-activities', JSON.stringify([...updated]))
      return updated
    })
    // Also mark manual activities
    setManualActivities((currentActivities) =>
      currentActivities.map((activity) =>
        activity.id === activityId ? { ...activity, done: true } : activity,
      ),
    )
  }

  const deleteActivity = (activityId: number) => {
    setManualActivities((currentActivities) =>
      currentActivities.filter((activity) => activity.id !== activityId),
    )
    setActivityEditorOpen(false)
    setSelectedActivity(null)
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
          value={String(assignedProperties.length)}
          badge={<GreenBadge>2 this month</GreenBadge>}
        />
        <StatCard
          icon={<Users size={16} />}
          label="Active Leads"
          value={String(leads.length)}
          badge={<NeutralBadge>Stable interest</NeutralBadge>}
        />
        <StatCard
          icon={<Handshake size={16} />}
          label="Deals in Progress"
          value={String(leads.filter((lead) => !['active', 'rejected'].includes(lead.status)).length)}
          badge={<WarningBadge>Closing pending</WarningBadge>}
        />
        <StatCard
          icon={<DollarSign size={16} />}
          label="Monthly Earnings"
          value={`Rs. ${successfulCommission.toLocaleString('en-IN')}`}
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
          {leads.length > 0 ? (
            leads.slice(0, 5).map((lead) => {
              const tenant = users.find((u) => u.id === lead.tenantId)
              const property = properties.find((p) => p.id === lead.propertyId)
              return (
                <LeadRow
                  key={lead.id}
                  avatar={tenant?.avatar ?? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80'}
                  name={tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Unknown Tenant'}
                  property={property?.title ?? 'Unknown Property'}
                  pill={lead.status === 'interest_shown' ? 'hot' : 'follow-up'}
                  conversationId={lead.id}
                  onChat={openLeadChat}
                />
              )
            })
          ) : (
            <div className="py-8 text-center">
              <p className="text-[13px] text-text-muted">No tenant leads yet.</p>
              <p className="text-[12px] text-text-muted mt-1">Leads will appear when tenants show interest in your assigned listings.</p>
            </div>
          )}
        </div>

        {/* Activity Timeline */}
        <div className="bg-white border border-outline rounded-xl p-5 shadow-ambient">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-[15px] font-bold text-[#0f172a]">Activity Timeline</h2>
            <button
              type="button"
              onClick={() => openActivityEditor(null)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-outline text-text-muted hover:bg-hover-light hover:text-primary"
              title="Add activity"
              aria-label="Add activity"
            >
              <Plus size={15} />
            </button>
          </div>
          {activities.length > 0 ? (
            activities.map((activity) => (
              <ActivityItem key={activity.id} {...activity} onEdit={openActivityEditor} onMarkDone={markActivityDone} />
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-outline px-4 py-6 text-center">
              <p className="text-[12px] font-medium text-text-muted">No activity recorded yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom Row: Interested Tenants + Upcoming Schedules ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4">

        {/* Interested Tenants */}
        <div className="bg-white border border-outline rounded-xl p-5 shadow-ambient">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users size={15} className="text-text-muted" />
              <h2 className="text-[14px] font-bold text-[#0f172a]">Interested Tenants</h2>
            </div>
            <span className="text-[11px] font-bold text-primary">{interestedTenants.length} leads</span>
          </div>
          <div className="space-y-3">
            {interestedTenants.length > 0 ? interestedTenants.slice(0, 4).map((lead) => (
              <div key={lead.id} className="flex items-center gap-3 py-2 border-b border-outline last:border-0">
                <img src={lead.avatar} alt={lead.name} className="w-9 h-9 rounded-full object-cover shrink-0 bg-slate-200" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#0f172a] truncate">{lead.name}</p>
                  <p className="text-[11px] text-text-muted truncate">{lead.property}</p>
                </div>
                <span className="text-[10px] font-bold text-text-muted shrink-0">{lead.time}</span>
              </div>
            )) : (
              <div className="py-6 text-center border-2 border-dashed border-outline rounded-xl">
                <Users size={24} className="mx-auto text-text-muted opacity-50" />
                <p className="mt-2 text-[12px] text-text-muted">No interested tenants yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Schedules */}
        <div className="bg-white border border-outline rounded-xl p-5 shadow-ambient flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-text-muted" />
              <h2 className="text-[14px] font-bold text-[#0f172a]">Upcoming Visits</h2>
            </div>
            <span className="text-[11px] font-bold text-primary">{upcomingVisits.length} scheduled</span>
          </div>

          <div className="space-y-3">
            {upcomingVisits.length > 0 ? upcomingVisits.slice(0, 4).map((visit) => (
              <div key={visit.id} className="flex items-center gap-3 py-2 border-b border-outline last:border-0">
                <img src={visit.avatar} alt={visit.name} className="w-9 h-9 rounded-full object-cover shrink-0 bg-slate-200" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#0f172a] truncate">{visit.name}</p>
                  <p className="text-[11px] text-text-muted">{visit.date} at {visit.time}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-pill text-[10px] font-bold ${visit.status === 'Confirmed' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                  {visit.status}
                </span>
              </div>
            )) : (
              <div className="flex-1 border-2 border-dashed border-outline rounded-xl flex flex-col items-center justify-center gap-2 py-6">
                <CalendarDays size={28} className="text-text-muted opacity-50" />
                <p className="text-[12px] text-text-muted font-medium">No visits scheduled yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {activityEditorOpen && (
        <ActivityEditorModal
          activity={selectedActivity}
          onClose={() => {
            setActivityEditorOpen(false)
            setSelectedActivity(null)
          }}
          onSave={saveActivity}
          onDelete={deleteActivity}
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
