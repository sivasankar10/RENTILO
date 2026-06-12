import { Download, TrendingUp } from 'lucide-react'
import { cn } from '@shared/utils/cn'

const topBrokers = [
  { initials: 'RK', name: 'Rajesh Kumar', deals: 141, rate: 96.2, color: 'bg-orange-500' },
  { initials: 'AS', name: 'Ananya Singh', deals: 118, rate: 95.4, color: 'bg-blue-500' },
  { initials: 'VP', name: 'Vikram Patel', deals: 110, rate: 92.1, color: 'bg-purple-500' },
]

const failedDeals = [
  { id: 'RT-9021', reason: 'KYC Rejected', broker: 'Shair Mehar P' },
  { id: 'RT-8842', reason: 'Price aboveMkt stvn', broker: 'PriyP DPk' },
  { id: 'RT-8711', reason: 'Order Cancelled', broker: 'VikrPa PPatel' },
]

const regionalData = [
  { city: 'MUMBAI', value: '₹4.2Cr', change: '+12% vs LW', positive: true },
  { city: 'BANGALORE', value: '₹3.8Cr', change: '+8% vs LW', positive: true },
  { city: 'DELHI NCR', value: '₹2.9Cr', change: '-3% vs LW', positive: false },
  { city: 'HYDERABAD', value: '₹1.5Cr', change: '+24% vs LW', positive: true },
]

export function AdminDashboard() {
  return (
    <div className="min-h-screen bg-canvas-alt px-2 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-heading-1 font-bold tracking-tight text-text-primary">
              Dashboard
            </h1>
            <p className="mt-1 text-body text-text-muted">
              Real-time platform performance and operational metrics.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-button bg-navy px-5 py-2.5 text-body font-semibold text-white shadow-sm transition-all duration-200 hover:bg-slate-800 hover:shadow-md"
          >
            <Download size={16} />
            Export Data
          </button>
        </div>

        {/* Hero Stats */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Deal Closures */}
          <div className="rounded-card border border-outline bg-white p-6 shadow-surface">
            <p className="text-filter-label uppercase tracking-wider text-text-muted">
              Deal Closures
            </p>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <p className="text-[42px] font-bold leading-none tracking-tight text-text-primary">
                  1,482
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-label text-status-success">
                  <TrendingUp size={14} />
                  +12.5% from last month
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

          {/* Total Revenue */}
          <div className="rounded-card border border-outline bg-white p-6 shadow-surface">
            <p className="text-filter-label uppercase tracking-wider text-text-muted">
              Total Revenue
            </p>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <p className="text-[42px] font-bold leading-none tracking-tight text-text-primary">
                  ₹ 4.8M
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-label text-status-success">
                  <TrendingUp size={14} />
                  +8.2% vs target
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

        {/* Secondary Stats Row */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <div className="rounded-card border border-outline bg-white p-4 shadow-sm">
            <p className="text-label text-text-muted">Active Listings</p>
            <div className="mt-2 flex items-end justify-between">
              <p className="text-heading-2 font-bold text-text-primary">12,305</p>
              <span className="rounded-pill bg-status-success-bg px-2 py-0.5 text-badge text-status-success-text">
                +4%
              </span>
            </div>
          </div>
          <div className="rounded-card border border-outline bg-white p-4 shadow-sm">
            <p className="text-label text-text-muted">Broker Performance</p>
            <div className="mt-2 flex items-end justify-between">
              <p className="text-heading-2 font-bold text-text-primary">88.4%</p>
              <span className="text-label text-status-warning">★</span>
            </div>
          </div>
          <div className="rounded-card border border-outline bg-white p-4 shadow-sm">
            <p className="text-label text-text-muted">KYC Rate</p>
            <div className="mt-2 flex items-end justify-between">
              <p className="text-heading-2 font-bold text-text-primary">94%</p>
              <span className="rounded-pill bg-slate-100 px-2 py-0.5 text-badge text-text-muted">
                Stable
              </span>
            </div>
          </div>
          <div className="rounded-card border border-outline bg-white p-4 shadow-sm">
            <p className="text-label text-text-muted">Tenant Signals</p>
            <div className="mt-2 flex items-end justify-between">
              <p className="text-heading-2 font-bold text-text-primary">4.2k</p>
              <span className="rounded-pill bg-status-success-bg px-2 py-0.5 text-badge text-status-success-text">
                Active
              </span>
            </div>
          </div>
          <div className="rounded-card border border-outline bg-white p-4 shadow-sm">
            <p className="text-label text-text-muted">Failed Deals</p>
            <div className="mt-2 flex items-end justify-between">
              <p className="text-heading-2 font-bold text-status-error">42</p>
              <span className="rounded-pill bg-status-error-bg px-2 py-0.5 text-badge text-status-error-text">
                -2%
              </span>
            </div>
          </div>
        </div>

        {/* Revenue & Closure Trends Chart */}
        <div className="rounded-card border border-outline bg-white p-6 shadow-surface">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-3 font-bold text-text-primary">
              Revenue & Closure Trends
            </h2>
            <div className="flex items-center gap-4 text-label text-text-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-text-primary" />
                Revenue
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-teal-500" />
                Closures
              </span>
            </div>
          </div>

          {/* SVG Chart */}
          <div className="mt-6">
            <svg
              viewBox="0 0 700 200"
              className="h-48 w-full"
              preserveAspectRatio="none"
              aria-label="Revenue and closure trends chart showing growth from January to November"
            >
              {/* Grid lines */}
              <line x1="0" y1="50" x2="700" y2="50" stroke="#e2e8f0" strokeWidth="0.5" />
              <line x1="0" y1="100" x2="700" y2="100" stroke="#e2e8f0" strokeWidth="0.5" />
              <line x1="0" y1="150" x2="700" y2="150" stroke="#e2e8f0" strokeWidth="0.5" />

              {/* Revenue line (dark) */}
              <polyline
                fill="none"
                stroke="#0F172A"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="20,160 90,145 160,140 230,130 300,120 370,100 440,85 510,60 580,50 650,45"
              />

              {/* Closures line (teal dashed) */}
              <polyline
                fill="none"
                stroke="#14b8a6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="6,4"
                points="20,170 90,155 160,150 230,145 300,135 370,125 440,110 510,90 580,75 650,65"
              />

              {/* X-axis labels */}
              <text x="20" y="195" className="fill-slate-400 text-[11px]">Jan</text>
              <text x="160" y="195" className="fill-slate-400 text-[11px]">Mar</text>
              <text x="300" y="195" className="fill-slate-400 text-[11px]">May</text>
              <text x="440" y="195" className="fill-slate-400 text-[11px]">Jul</text>
              <text x="580" y="195" className="fill-slate-400 text-[11px]">Sep</text>
              <text x="650" y="195" className="fill-slate-400 text-[11px]">Nov</text>
            </svg>
          </div>
        </div>

        {/* Bottom Tables Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Broker Performance */}
          <div className="rounded-card border border-outline bg-white p-6 shadow-surface">
            <div className="flex items-center justify-between">
              <h2 className="text-heading-3 font-bold text-text-primary">
                Top Broker Performance
              </h2>
              <button
                type="button"
                className="text-label font-semibold text-primary hover:text-primary-700 transition-colors"
              >
                View All
              </button>
            </div>

            <div className="mt-4">
              <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-outline pb-3 text-label font-semibold text-text-muted">
                <span>Name</span>
                <span className="w-24 text-center">Deals Closed</span>
                <span className="w-24 text-center">Success Rate</span>
              </div>

              {topBrokers.map((broker) => (
                <div
                  key={broker.name}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-outline py-4 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-full text-badge font-bold text-white',
                        broker.color,
                      )}
                    >
                      {broker.initials}
                    </div>
                    <span className="text-body font-medium text-text-primary">{broker.name}</span>
                  </div>
                  <span className="w-24 text-center text-body text-text-primary">
                    {broker.deals}
                  </span>
                  <div className="w-24 flex justify-center">
                    <span className="rounded-pill bg-status-success-bg px-3 py-1 text-badge font-bold text-status-success-text">
                      {broker.rate}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Failed Deals */}
          <div className="rounded-card border border-outline bg-white p-6 shadow-surface">
            <div className="flex items-center justify-between">
              <h2 className="text-heading-3 font-bold text-text-primary">
                Recent Failed Deals
              </h2>
              <button
                type="button"
                className="text-label font-semibold text-status-error hover:text-red-700 transition-colors"
              >
                Full Report
              </button>
            </div>

            <div className="mt-4">
              <div className="grid grid-cols-3 gap-4 border-b border-outline pb-3 text-label font-semibold text-text-muted">
                <span>Listing ID</span>
                <span>Reason</span>
                <span>Broker</span>
              </div>

              {failedDeals.map((deal) => (
                <div
                  key={deal.id}
                  className="grid grid-cols-3 items-center gap-4 border-b border-outline py-4 last:border-0"
                >
                  <span className="text-body font-medium text-text-primary">{deal.id}</span>
                  <span className="text-label font-medium text-status-error">{deal.reason}</span>
                  <span className="text-body text-text-primary">{deal.broker}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Regional Performance */}
        <div className="rounded-card border border-outline bg-white p-6 shadow-surface">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-3 font-bold text-text-primary">
              Regional Performance
            </h2>
            <button
              type="button"
              className="text-label font-semibold text-text-muted hover:text-text-primary transition-colors"
            >
              View Full Report
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {regionalData.map((region) => (
              <div
                key={region.city}
                className="rounded-button border border-outline bg-canvas-alt p-4"
              >
                <p className="text-filter-label uppercase tracking-wider text-text-muted">
                  {region.city}
                </p>
                <p className="mt-2 text-heading-2 font-bold tracking-tight text-text-primary">
                  {region.value}
                </p>
                <p
                  className={cn(
                    'mt-1 text-label font-medium',
                    region.positive ? 'text-status-success' : 'text-status-error',
                  )}
                >
                  {region.change}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


