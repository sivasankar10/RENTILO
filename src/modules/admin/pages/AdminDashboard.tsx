import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  Award,
  Download,
  MessageSquare,
  Phone,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { ROUTES } from '@shared/constants/routes'
import { toast } from '../components/Toast'
import { exportToCsv } from '../utils/exportCsv'
import { usePrototypeStore } from '@shared/store/prototypeStore'

// ─── Data ─────────────────────────────────────────────────────────────────────

const topBrokers = [
  { rank: 1,  initials: 'RK', name: 'Rajesh Kumar',   deals: 141, rate: 96.2, revenue: '₹24.8L', city: 'Mumbai',    color: 'bg-orange-500', phone: '+91 98400 12345', brokerId: 'br-1' },
  { rank: 2,  initials: 'AS', name: 'Ananya Singh',   deals: 118, rate: 95.4, revenue: '₹20.1L', city: 'Bangalore', color: 'bg-blue-500',   phone: '+91 91234 56789', brokerId: 'br-2' },
  { rank: 3,  initials: 'VP', name: 'Vikram Patel',   deals: 110, rate: 92.1, revenue: '₹18.4L', city: 'Delhi NCR', color: 'bg-purple-500', phone: '+91 99001 34567', brokerId: 'br-3' },
  { rank: 4,  initials: 'NR', name: 'Neha Reddy',     deals: 97,  rate: 90.3, revenue: '₹16.2L', city: 'Hyderabad', color: 'bg-teal-500',   phone: '+91 97654 32109', brokerId: 'br-4' },
  { rank: 5,  initials: 'SM', name: 'Suresh Menon',   deals: 89,  rate: 88.7, revenue: '₹14.9L', city: 'Chennai',   color: 'bg-indigo-500', phone: '+91 90876 54321', brokerId: 'br-5' },
  { rank: 6,  initials: 'PD', name: 'Priya Deepak',   deals: 82,  rate: 87.5, revenue: '₹13.6L', city: 'Pune',      color: 'bg-pink-500',   phone: '+91 98765 43210', brokerId: 'br-6' },
  { rank: 7,  initials: 'AK', name: 'Arjun Kapoor',   deals: 74,  rate: 85.9, revenue: '₹12.1L', city: 'Mumbai',    color: 'bg-amber-500',  phone: '+91 91122 33445', brokerId: 'br-7' },
  { rank: 8,  initials: 'DS', name: 'Divya Sharma',   deals: 68,  rate: 84.2, revenue: '₹11.3L', city: 'Bangalore', color: 'bg-cyan-600',   phone: '+91 99887 76655', brokerId: 'br-8' },
]

const failedDeals = [
  { id: 'RT-9021', reason: 'KYC Rejected',      broker: 'Shair Mehar Prasad', date: '24 Oct 2025', value: '₹8.4L',  city: 'Mumbai'    },
  { id: 'RT-8842', reason: 'Price Above Market', broker: 'Priya Deepak',       date: '22 Oct 2025', value: '₹12.1L', city: 'Delhi NCR' },
  { id: 'RT-8711', reason: 'Order Cancelled',    broker: 'Vikram Patel',        date: '20 Oct 2025', value: '₹5.6L',  city: 'Bangalore' },
  { id: 'RT-8605', reason: 'Document Mismatch',  broker: 'Arjun Kapoor',        date: '18 Oct 2025', value: '₹9.2L',  city: 'Hyderabad' },
  { id: 'RT-8544', reason: 'Buyer Backed Out',   broker: 'Neha Reddy',          date: '16 Oct 2025', value: '₹7.8L',  city: 'Chennai'   },
  { id: 'RT-8490', reason: 'Legal Hold',         broker: 'Suresh Menon',        date: '14 Oct 2025', value: '₹15.3L', city: 'Pune'      },
  { id: 'RT-8412', reason: 'Payment Timeout',    broker: 'Divya Sharma',        date: '12 Oct 2025', value: '₹6.0L',  city: 'Mumbai'    },
]

const regionalData = [
  { city: 'MUMBAI',    value: '₹4.2Cr', change: '+12% vs LW', positive: true  },
  { city: 'BANGALORE', value: '₹3.8Cr', change: '+8% vs LW',  positive: true  },
  { city: 'DELHI NCR', value: '₹2.9Cr', change: '-3% vs LW',  positive: false },
  { city: 'HYDERABAD', value: '₹1.5Cr', change: '+24% vs LW', positive: true  },
]

// ─── Export helper ─────────────────────────────────────────────────────────────

type DashboardExportRow = { section: string; metric: string; value: string; detail: string }

function buildAdminDashboardExportRows(): DashboardExportRow[] {
  return [
    { section: 'Summary', metric: 'Deal Closures',      value: '1,482',  detail: '+12.5% from last month' },
    { section: 'Summary', metric: 'Total Revenue',      value: '₹ 4.8M', detail: '+8.2% vs target'       },
    { section: 'Summary', metric: 'Active Listings',    value: '12,305', detail: '+4%'                   },
    { section: 'Summary', metric: 'Broker Performance', value: '88.4%',  detail: ''                      },
    { section: 'Summary', metric: 'KYC Rate',           value: '94%',    detail: 'Stable'                },
    { section: 'Summary', metric: 'Tenant Signals',     value: '4.2k',   detail: 'Active'                },
    { section: 'Summary', metric: 'Failed Deals',       value: '42',     detail: '-2%'                   },
    ...topBrokers.map((b) => ({
      section: 'Top Broker Performance',
      metric:  b.name,
      value:   `${b.deals} deals closed`,
      detail:  `${b.rate}% success rate`,
    })),
    ...failedDeals.map((d) => ({
      section: 'Recent Failed Deals',
      metric:  d.id,
      value:   d.reason,
      detail:  d.broker,
    })),
    ...regionalData.map((r) => ({
      section: 'Regional Performance',
      metric:  r.city,
      value:   r.value,
      detail:  r.change,
    })),
  ]
}

// ─── Broker row with hover actions ────────────────────────────────────────────

type Broker = typeof topBrokers[number]

function BrokerRow({
  broker,
  showRank = false,
  onChat,
}: {
  broker: Broker
  showRank?: boolean
  onChat: (b: Broker) => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={cn(
        'grid items-center gap-4 border-b border-outline py-3.5 last:border-0 transition-colors',
        showRank
          ? 'grid-cols-[32px_1fr_80px_80px_80px]'
          : 'grid-cols-[1fr_auto_auto]',
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Rank medal */}
      {showRank && (
        <div className="flex items-center justify-center">
          {broker.rank <= 3 ? (
            <Award
              size={18}
              className={cn(
                broker.rank === 1 ? 'text-amber-400' :
                broker.rank === 2 ? 'text-slate-400' :
                'text-orange-400'
              )}
            />
          ) : (
            <span className="text-label font-bold text-text-muted">{broker.rank}</span>
          )}
        </div>
      )}

      {/* Avatar + name + hover actions */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-badge font-bold text-white',
            broker.color,
          )}
        >
          {broker.initials}
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <span className="min-w-0 truncate text-body font-medium text-text-primary" title={broker.name}>
            {broker.name}
          </span>
          {/* Slide-in action buttons */}
          <div
            className={cn(
              'flex items-center gap-1.5 transition-all duration-150',
              hovered
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-2 pointer-events-none',
            )}
          >
            <button
              type="button"
              onClick={() => onChat(broker)}
              title={`Chat with ${broker.name}`}
              aria-label={`Open chat with ${broker.name}`}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-primary hover:bg-primary hover:text-white transition-colors"
            >
              <MessageSquare size={13} strokeWidth={2} />
            </button>
            <a
              href={`tel:${broker.phone.replace(/\s/g, '')}`}
              title={broker.phone}
              aria-label={`Call ${broker.name} at ${broker.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white transition-colors"
            >
              <Phone size={13} strokeWidth={2} />
            </a>
            <span className="text-[11px] font-medium text-text-muted whitespace-nowrap hidden sm:block">
              {broker.phone}
            </span>
          </div>
        </div>
      </div>

      {/* Deals closed */}
      <span className={cn('text-center text-body text-text-primary', showRank ? '' : 'w-24')}>
        {broker.deals}
      </span>

      {/* Success rate */}
      <div className={cn('flex justify-center', showRank ? '' : 'w-24')}>
        <span className="rounded-pill bg-status-success-bg px-3 py-1 text-badge font-bold text-status-success-text">
          {broker.rate}%
        </span>
      </div>

      {/* Revenue — only in expanded modal */}
      {showRank && (
        <span className="text-center text-body font-semibold text-text-primary">
          {broker.revenue}
        </span>
      )}
    </div>
  )
}

// ─── Top Brokers Modal ─────────────────────────────────────────────────────────

function TopBrokersModal({
  brokers,
  onClose,
  onChat,
}: {
  brokers: Broker[]
  onClose: () => void
  onChat: (b: Broker) => void
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-modal flex flex-col"
        style={{ maxHeight: 'calc(100vh - 2rem)' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-outline px-6 py-5 shrink-0">
          <div>
            <p className="text-label font-bold uppercase tracking-wider text-primary">
              Broker Rankings
            </p>
            <h2 className="mt-0.5 text-heading-2 font-bold text-text-primary">
              Top Broker Performance
            </h2>
            <p className="mt-1 text-label text-text-muted">
              Ranked by deals closed this month · Hover a name to contact
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-button text-text-muted hover:bg-hover-light hover:text-text-primary transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Top 3 hero cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {brokers.slice(0, 3).map((broker) => (
              <div
                key={broker.brokerId}
                className={cn(
                  'rounded-card border p-4 text-center',
                  broker.rank === 1 ? 'border-amber-200 bg-amber-50' :
                  broker.rank === 2 ? 'border-slate-200 bg-slate-50' :
                  'border-orange-200 bg-orange-50',
                )}
              >
                <Award
                  size={22}
                  className={cn(
                    'mx-auto mb-2',
                    broker.rank === 1 ? 'text-amber-500' :
                    broker.rank === 2 ? 'text-slate-400' :
                    'text-orange-400'
                  )}
                />
                <div className={cn(
                  'mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full text-badge font-bold text-white',
                  broker.color,
                )}>
                  {broker.initials}
                </div>
                <p className="text-body font-bold text-text-primary text-[13px]">{broker.name}</p>
                <p className="text-label text-text-muted">{broker.city}</p>
                <p className="mt-2 text-[18px] font-extrabold text-text-primary leading-none">{broker.deals}</p>
                <p className="text-[11px] text-text-muted">deals</p>
              </div>
            ))}
          </div>

          {/* Full table */}
          <div className="rounded-card border border-outline overflow-hidden">
            <div className="grid grid-cols-[32px_1fr_80px_80px_80px] gap-4 border-b border-outline bg-canvas-alt px-4 py-2.5 text-label font-bold uppercase tracking-wider text-text-muted">
              <span>#</span>
              <span>Broker</span>
              <span className="text-center">Deals</span>
              <span className="text-center">Success</span>
              <span className="text-center">Revenue</span>
            </div>
            <div className="px-4">
              {brokers.map((broker) => (
                <BrokerRow
                  key={broker.brokerId}
                  broker={broker}
                  showRank
                  onChat={onChat}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-outline px-6 py-4 shrink-0 flex items-center justify-between">
          <p className="text-label text-text-muted">{brokers.length} brokers · Updated just now</p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-button border border-outline bg-white px-4 py-2 text-body font-semibold text-text-primary hover:bg-hover-light transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Failed Deals Modal ────────────────────────────────────────────────────────

const failedReasonColors: Record<string, string> = {
  'KYC Rejected':      'bg-red-50 text-red-700',
  'Price Above Market':'bg-amber-50 text-amber-700',
  'Order Cancelled':   'bg-slate-100 text-slate-600',
  'Document Mismatch': 'bg-orange-50 text-orange-700',
  'Buyer Backed Out':  'bg-purple-50 text-purple-700',
  'Legal Hold':        'bg-rose-50 text-rose-700',
  'Payment Timeout':   'bg-yellow-50 text-yellow-700',
}

function FailedDealsModal({ onClose }: { onClose: () => void }) {
  const totalValue = '₹64.4L'
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-modal flex flex-col"
        style={{ maxHeight: 'calc(100vh - 2rem)' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-outline px-6 py-5 shrink-0">
          <div>
            <p className="text-label font-bold uppercase tracking-wider text-status-error">
              Compliance Report
            </p>
            <h2 className="mt-0.5 text-heading-2 font-bold text-text-primary">
              Recent Failed Deals
            </h2>
            <p className="mt-1 text-label text-text-muted">
              {failedDeals.length} deals failed this period · Total value at risk: {totalValue}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-button text-text-muted hover:bg-hover-light hover:text-text-primary transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

          {/* Summary pills */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(
              failedDeals.reduce<Record<string, number>>((acc, d) => {
                acc[d.reason] = (acc[d.reason] ?? 0) + 1
                return acc
              }, {})
            ).map(([reason, count]) => (
              <span
                key={reason}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-bold',
                  failedReasonColors[reason] ?? 'bg-slate-100 text-slate-600',
                )}
              >
                <AlertCircle size={12} />
                {reason} ({count})
              </span>
            ))}
          </div>

          {/* Deal cards */}
          <div className="space-y-3">
            {failedDeals.map((deal, idx) => (
              <div
                key={deal.id}
                className="flex items-start gap-4 rounded-card border border-outline bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Index */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-status-error-bg text-badge font-bold text-status-error-text">
                  {idx + 1}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-body font-bold text-text-primary">{deal.id}</span>
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-0.5 text-[11px] font-bold',
                        failedReasonColors[deal.reason] ?? 'bg-slate-100 text-slate-600',
                      )}
                    >
                      {deal.reason}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-label text-text-muted">
                    <span>Broker: <span className="font-semibold text-text-primary">{deal.broker}</span></span>
                    <span>City: <span className="font-semibold text-text-primary">{deal.city}</span></span>
                    <span>Date: <span className="font-semibold text-text-primary">{deal.date}</span></span>
                  </div>
                </div>

                {/* Value */}
                <div className="shrink-0 text-right">
                  <p className="text-body font-bold text-status-error">{deal.value}</p>
                  <p className="text-label text-text-muted">at risk</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-outline bg-status-error-bg px-6 py-4 shrink-0 rounded-b-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown size={16} className="text-status-error" />
            <p className="text-label font-semibold text-status-error-text">
              Total value at risk this period: <span className="font-extrabold">{totalValue}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-button border border-outline bg-white px-4 py-2 text-body font-semibold text-text-primary hover:bg-hover-light transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────

export function AdminDashboard() {
  const navigate = useNavigate()
  const [showBrokerModal, setShowBrokerModal]       = useState(false)
  const [showFailedModal, setShowFailedModal]       = useState(false)
  const users = usePrototypeStore((state) => state.users)
  const listings = usePrototypeStore((state) => state.listings)
  const assignments = usePrototypeStore((state) => state.brokerAssignments)
  const applications = usePrototypeStore((state) => state.applications)
  const payments = usePrototypeStore((state) => state.payments)
  const closures = applications.filter((application) => application.status === 'active').length
  const activeListings = listings.filter((listing) => listing.status === 'Active').length
  const totalRevenue = payments
    .filter((payment) => payment.status === 'Successful')
    .reduce((sum, payment) => sum + payment.amount, 0)
  const failedPayments = payments.filter((payment) => payment.status === 'Failed').length
  const brokerUsers = users.filter((user) => user.roles.includes('broker'))
  const brokerSuccessRate = applications.filter((application) => application.brokerId).length
    ? Math.round((applications.filter((application) => application.brokerId && application.status === 'active').length / applications.filter((application) => application.brokerId).length) * 100)
    : 0
  const sessionTopBrokers: Broker[] = brokerUsers.map((broker, index) => {
    const brokerApplications = applications.filter((application) => application.brokerId === broker.id)
    const deals = brokerApplications.filter((application) => application.status === 'active').length
    const revenue = payments
      .filter((payment) => payment.brokerId === broker.id && payment.status === 'Successful')
      .reduce((sum, payment) => sum + payment.amount, 0)
    return {
      rank: index + 1,
      initials: `${broker.firstName[0] ?? ''}${broker.lastName[0] ?? ''}`,
      name: broker.accountName,
      deals,
      rate: brokerApplications.length ? Math.round((deals / brokerApplications.length) * 100) : 0,
      revenue: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(revenue),
      city: `${assignments.filter((assignment) => assignment.brokerId === broker.id && assignment.status === 'Active').length} active listings`,
      color: index % 2 === 0 ? 'bg-orange-500' : 'bg-blue-500',
      phone: broker.phone,
      brokerId: broker.id,
    }
  }).sort((a, b) => b.deals - a.deals || b.rate - a.rate).map((broker, index) => ({ ...broker, rank: index + 1 }))
  const formattedRevenue = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalRevenue)
  const dashboardExportRows: DashboardExportRow[] = [
    { section: 'Summary', metric: 'Deal Closures', value: String(closures), detail: 'Session data' },
    { section: 'Summary', metric: 'Total Revenue', value: formattedRevenue, detail: 'Successful session payments' },
    { section: 'Summary', metric: 'Active Listings', value: String(activeListings), detail: 'Session data' },
    { section: 'Summary', metric: 'Broker Performance', value: `${brokerSuccessRate}%`, detail: 'Session data' },
    ...buildAdminDashboardExportRows().filter((row) => row.section !== 'Summary'),
  ]

  const handleExportData = () => {
    exportToCsv('rentilo-admin-dashboard.csv', dashboardExportRows, [
      { key: 'section', label: 'Section' },
      { key: 'metric',  label: 'Metric'  },
      { key: 'value',   label: 'Value'   },
      { key: 'detail',  label: 'Detail'  },
    ])
    toast.success('Export started', 'Dashboard data downloaded as CSV.')
  }

  const handleBrokerChat = (broker: Broker) => {
    navigate(`${ROUTES.ADMIN.MESSAGES}?user=${encodeURIComponent(broker.brokerId)}`)
  }

  return (
    <div className="min-h-screen bg-canvas-alt px-2 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-heading-1 font-bold tracking-tight text-text-primary">Dashboard</h1>
            <p className="mt-1 text-body text-text-muted">
              Real-time platform performance and operational metrics.
            </p>
          </div>
          <button
            type="button"
            onClick={handleExportData}
            className="inline-flex items-center gap-2 rounded-button bg-navy px-5 py-2.5 text-body font-semibold text-white shadow-sm transition-all duration-200 hover:bg-slate-800 hover:shadow-md"
          >
            <Download size={16} />
            Export Data
          </button>
        </div>

        {/* Hero Stats */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-card border border-outline bg-white p-6 shadow-surface">
            <p className="text-filter-label uppercase tracking-wider text-text-muted">Deal Closures</p>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <p className="text-[42px] font-bold leading-none tracking-tight text-text-primary">{closures}</p>
                <p className="mt-2 flex items-center gap-1.5 text-label text-status-success">
                  <TrendingUp size={14} />+12.5% from last month
                </p>
              </div>
              <div className="flex items-end gap-1">
                <div className="h-8 w-2.5 rounded-sm bg-teal-600" />
                <div className="h-12 w-2.5 rounded-sm bg-teal-600" />
                <div className="h-10 w-2.5 rounded-sm bg-teal-600" />
                <div className="h-6 w-2.5 rounded-sm bg-teal-200" />
              </div>
            </div>
          </div>

          <div className="rounded-card border border-outline bg-white p-6 shadow-surface">
            <p className="text-filter-label uppercase tracking-wider text-text-muted">Total Revenue</p>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <p className="text-[42px] font-bold leading-none tracking-tight text-text-primary">{formattedRevenue}</p>
                <p className="mt-2 flex items-center gap-1.5 text-label text-status-success">
                  <TrendingUp size={14} />+8.2% vs target
                </p>
              </div>
              <div className="flex items-end gap-1">
                <div className="h-6 w-2.5 rounded-sm bg-teal-600" />
                <div className="h-10 w-2.5 rounded-sm bg-teal-600" />
                <div className="h-14 w-2.5 rounded-sm bg-teal-600" />
                <div className="h-8 w-2.5 rounded-sm bg-teal-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {[
            { label: 'Active Listings', value: String(activeListings), badge: 'Live', badgeCls: 'bg-status-success-bg text-status-success-text' },
            { label: 'Broker Performance', value: `${brokerSuccessRate}%`, badge: 'Live', badgeCls: 'text-status-warning text-label' },
            { label: 'KYC Rate',           value: '94%',    badge: 'Stable', badgeCls: 'bg-slate-100 text-text-muted'                   },
            { label: 'Tenant Signals', value: String(applications.length), badge: 'Active', badgeCls: 'bg-status-success-bg text-status-success-text' },
            { label: 'Failed Deals', value: String(failedPayments), badge: 'Payments', badgeCls: 'bg-status-error-bg text-status-error-text', valueCls: 'text-status-error' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-card border border-outline bg-white p-4 shadow-sm">
              <p className="text-label text-text-muted">{stat.label}</p>
              <div className="mt-2 flex items-end justify-between">
                <p className={cn('text-heading-2 font-bold text-text-primary', (stat as { valueCls?: string }).valueCls)}>
                  {stat.value}
                </p>
                <span className={cn('rounded-pill px-2 py-0.5 text-badge', stat.badgeCls)}>{stat.badge}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue & Closure Trends Chart */}
        <div className="rounded-card border border-outline bg-white p-6 shadow-surface">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-3 font-bold text-text-primary">Revenue & Closure Trends</h2>
            <div className="flex items-center gap-4 text-label text-text-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-text-primary" />Revenue
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-teal-500" />Closures
              </span>
            </div>
          </div>
          <div className="mt-6">
            <svg viewBox="0 0 700 200" className="h-48 w-full" preserveAspectRatio="none"
              aria-label="Revenue and closure trends chart">
              <line x1="0" y1="50"  x2="700" y2="50"  stroke="#e2e8f0" strokeWidth="0.5" />
              <line x1="0" y1="100" x2="700" y2="100" stroke="#e2e8f0" strokeWidth="0.5" />
              <line x1="0" y1="150" x2="700" y2="150" stroke="#e2e8f0" strokeWidth="0.5" />
              <polyline fill="none" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                points="20,160 90,145 160,140 230,130 300,120 370,100 440,85 510,60 580,50 650,45" />
              <polyline fill="none" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray="6,4"
                points="20,170 90,155 160,150 230,145 300,135 370,125 440,110 510,90 580,75 650,65" />
              <text x="20"  y="195" fontSize="11" fill="#94a3b8">Jan</text>
              <text x="160" y="195" fontSize="11" fill="#94a3b8">Mar</text>
              <text x="300" y="195" fontSize="11" fill="#94a3b8">May</text>
              <text x="440" y="195" fontSize="11" fill="#94a3b8">Jul</text>
              <text x="580" y="195" fontSize="11" fill="#94a3b8">Sep</text>
              <text x="650" y="195" fontSize="11" fill="#94a3b8">Nov</text>
            </svg>
          </div>
        </div>

        {/* Bottom Tables Row */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Top Broker Performance */}
          <div className="rounded-card border border-outline bg-white p-6 shadow-surface">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-heading-3 font-bold text-text-primary">Top Broker Performance</h2>
              <button
                type="button"
                onClick={() => setShowBrokerModal(true)}
                className="text-label font-semibold text-primary hover:text-primary-700 transition-colors"
              >
                View All →
              </button>
            </div>

            <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-outline pb-3 text-label font-bold uppercase tracking-wider text-text-muted">
              <span>Name</span>
              <span className="w-24 text-center">Deals</span>
              <span className="w-24 text-center">Success</span>
            </div>

            {/* Preview — first 3 */}
            {sessionTopBrokers.slice(0, 3).map((broker) => (
              <BrokerRow
                key={broker.brokerId}
                broker={broker}
                onChat={handleBrokerChat}
              />
            ))}
          </div>

          {/* Recent Failed Deals */}
          <div className="rounded-card border border-outline bg-white p-6 shadow-surface">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-heading-3 font-bold text-text-primary">Recent Failed Deals</h2>
              <button
                type="button"
                onClick={() => setShowFailedModal(true)}
                className="text-label font-semibold text-status-error hover:text-red-700 transition-colors"
              >
                Full Report →
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 border-b border-outline pb-3 text-label font-bold uppercase tracking-wider text-text-muted">
              <span>Listing ID</span>
              <span>Reason</span>
              <span>Broker</span>
            </div>

            {/* Preview — first 3 */}
            {failedDeals.slice(0, 3).map((deal) => (
              <div
                key={deal.id}
                className="grid grid-cols-3 items-center gap-4 border-b border-outline py-3.5 last:border-0"
              >
                <span className="text-body font-medium text-text-primary">{deal.id}</span>
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[11px] font-bold truncate',
                    failedReasonColors[deal.reason] ?? 'bg-slate-100 text-slate-600',
                  )}
                >
                  {deal.reason}
                </span>
                <span className="text-body text-text-primary truncate">{deal.broker}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Performance */}
        <div className="rounded-card border border-outline bg-white p-6 shadow-surface">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-3 font-bold text-text-primary">Regional Performance</h2>
            <button type="button" className="text-label font-semibold text-text-muted hover:text-text-primary transition-colors">
              View Full Report
            </button>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {regionalData.map((region) => (
              <div key={region.city} className="rounded-button border border-outline bg-canvas-alt p-4">
                <p className="text-filter-label uppercase tracking-wider text-text-muted">{region.city}</p>
                <p className="mt-2 text-heading-2 font-bold tracking-tight text-text-primary">{region.value}</p>
                <p className={cn('mt-1 text-label font-medium', region.positive ? 'text-status-success' : 'text-status-error')}>
                  {region.change}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Modals */}
      {showBrokerModal && (
        <TopBrokersModal
          brokers={sessionTopBrokers}
          onClose={() => setShowBrokerModal(false)}
          onChat={(b) => { handleBrokerChat(b); setShowBrokerModal(false) }}
        />
      )}
      {showFailedModal && (
        <FailedDealsModal onClose={() => setShowFailedModal(false)} />
      )}
    </div>
  )
}
