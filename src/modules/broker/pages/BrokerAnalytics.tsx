import { useState } from 'react'
import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Download,
  Gem,
  ClipboardList,
  Wallet,
  TrendingUp,
} from 'lucide-react'
import skylineImg from '@/assets/images/skyline_heights.png'
import harborImg from '@/assets/images/harbor_residences.png'
import greenwichImg from '@/assets/images/greenwich_home.png'
import shoreditchImg from '@/assets/images/shoreditch_penthouse.png'
import sarahJenkinsImg from '@/assets/images/sarah_jenkins.png'
import brokerProfileImg from '@/assets/images/broker_profile.png'
import julianVaneImg from '@/assets/images/julian_vane_owner.png'

const CHART_MONTHS = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'] as const
const CHART_VALUES = [42, 55, 48, 72, 65, 88, 95]

type DealStatus = 'Closed' | 'Processing'

type DealRow = {
  id: string
  property: string
  image: string
  type: string
  commission: string
  date: string
  status: DealStatus
}

const DEALS: DealRow[] = [
  {
    id: '1',
    property: 'Skyline Penthouse 4B',
    image: skylineImg,
    type: 'Residential',
    commission: '$4,500.00',
    date: 'Oct 24',
    status: 'Closed',
  },
  {
    id: '2',
    property: 'Harbor View Offices',
    image: harborImg,
    type: 'Commercial',
    commission: '$8,200.00',
    date: 'Oct 18',
    status: 'Closed',
  },
  {
    id: '3',
    property: 'Garden Lofts Apt 12',
    image: greenwichImg,
    type: 'Residential',
    commission: '$2,100.00',
    date: 'Oct 12',
    status: 'Processing',
  },
]

function DealStatusPill({ status }: { status: DealStatus }) {
  const styles =
    status === 'Closed'
      ? { bg: '#dbeafe', text: '#2563eb' }
      : { bg: '#ffedd5', text: '#ea580c' }

  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold"
      style={{ background: styles.bg, color: styles.text }}
    >
      {status}
    </span>
  )
}

function EarningsGrowthChart() {
  const max = Math.max(...CHART_VALUES)

  return (
    <div className="flex items-end justify-between gap-3 h-[220px] pt-4">
      {CHART_MONTHS.map((month, index) => {
        const value = CHART_VALUES[index]
        const heightPct = (value / max) * 100

        return (
          <div key={month} className="flex flex-1 flex-col items-center gap-2 h-full">
            <div className="relative flex-1 w-full flex items-end justify-center">
              <div
                className="w-full max-w-[48px] rounded-t-md bg-gradient-to-t from-primary/30 to-primary/10 border border-primary/20"
                style={{ height: `${heightPct}%`, minHeight: '24px' }}
              />
              <div
                className="absolute bottom-0 w-full max-w-[48px] rounded-t-sm bg-primary/40"
                style={{ height: `${heightPct * 0.65}%`, minHeight: '16px' }}
              />
            </div>
            <span className="text-[11px] font-semibold text-text-muted">{month}</span>
          </div>
        )
      })}
    </div>
  )
}

export function BrokerAnalytics() {
  const [chartMode, setChartMode] = useState<'daily' | 'monthly'>('monthly')

  return (
    <div className="space-y-8 pb-10">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="max-w-2xl">
          <h1 className="text-[28px] font-bold tracking-tight text-[#0f172a]">
            Earnings Overview
          </h1>
          <p className="text-[14px] text-text-muted mt-2 leading-relaxed">
            Analyze your brokerage performance, track pending commissions, and monitor growth
            metrics across your property portfolio.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-outline bg-white text-label font-semibold text-text-muted hover:bg-hover-light transition-colors shadow-ambient"
          >
            <CalendarDays size={14} />
            Oct 2023 – Oct 2024
            <ChevronDown size={14} />
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0f172a] text-white text-label font-bold hover:bg-navy/90 transition-colors shadow-ambient"
          >
            <Download size={14} />
            Export Report
          </button>
        </div>
      </div>

      {/* ── KPI row ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-outline rounded-xl p-5 shadow-ambient">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary">
              <Wallet size={18} />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary-100 px-2 py-0.5 rounded-full">
              <TrendingUp size={12} />
              +12%
            </span>
          </div>
          <p className="text-label text-text-muted font-semibold mt-4">Total Earnings</p>
          <p className="text-[28px] font-bold text-[#0f172a] tracking-tight mt-1">$24,000.00</p>
          <div className="mt-4 h-1.5 rounded-full bg-canvas overflow-hidden">
            <div className="h-full w-[72%] rounded-full bg-primary/80" />
          </div>
        </div>

        <div className="bg-white border border-outline rounded-xl p-5 shadow-ambient">
          <div className="w-10 h-10 rounded-lg bg-canvas flex items-center justify-center text-text-muted">
            <ClipboardList size={18} />
          </div>
          <p className="text-label text-text-muted font-semibold mt-4">Pending Commission</p>
          <p className="text-[28px] font-bold text-[#0f172a] tracking-tight mt-1">$1,200.00</p>
          <p className="text-label text-text-muted mt-2">Estimated payout by Nov 15</p>
        </div>

        <div className="relative bg-[#0f172a] rounded-xl p-5 shadow-card overflow-hidden">
          <button
            type="button"
            className="absolute top-4 right-4 p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="View completed deals"
          >
            <ChevronRight size={18} />
          </button>
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white">
            <Gem size={18} />
          </div>
          <p className="text-label text-slate-400 font-semibold mt-4">Completed Deals</p>
          <p className="text-[36px] font-bold text-white tracking-tight mt-1 leading-none">15</p>
          <p className="text-label text-slate-400 mt-2">3 deals closing this week</p>
        </div>
      </div>

      {/* ── Chart + highlight ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        <div className="bg-white border border-outline rounded-xl p-5 shadow-ambient">
          <div className="flex items-center justify-between gap-4 mb-2">
            <h2 className="text-[16px] font-bold text-[#0f172a]">Earnings Growth</h2>
            <div className="inline-flex rounded-lg border border-outline p-0.5 bg-canvas">
              <button
                type="button"
                onClick={() => setChartMode('daily')}
                className={[
                  'px-3 py-1 rounded-md text-label font-semibold transition-colors',
                  chartMode === 'daily'
                    ? 'bg-[#0f172a] text-white'
                    : 'text-text-muted hover:text-text-primary',
                ].join(' ')}
              >
                Daily
              </button>
              <button
                type="button"
                onClick={() => setChartMode('monthly')}
                className={[
                  'px-3 py-1 rounded-md text-label font-semibold transition-colors',
                  chartMode === 'monthly'
                    ? 'bg-[#0f172a] text-white'
                    : 'text-text-muted hover:text-text-primary',
                ].join(' ')}
              >
                Monthly
              </button>
            </div>
          </div>
          <EarningsGrowthChart />
        </div>

        <div className="bg-white border border-outline rounded-xl overflow-hidden shadow-ambient flex flex-col">
          <div className="h-[120px] bg-gradient-to-br from-slate-200 to-slate-300">
            <img
              src={shoreditchImg}
              alt=""
              className="w-full h-full object-cover opacity-90"
            />
          </div>
          <div className="p-5 flex flex-col flex-1">
            <h2 className="text-[15px] font-bold text-[#0f172a]">Portfolio Highlight</h2>
            <p className="text-label text-text-muted mt-2 leading-relaxed flex-1">
              The &apos;Skyline Penthouse&apos; series contributed to 40% of this month&apos;s
              growth.
            </p>
            <button
              type="button"
              className="mt-4 text-left text-label font-bold text-[#0f172a] hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              View Portfolio <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Deal history ── */}
      <div className="bg-white border border-outline rounded-xl shadow-ambient overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline">
          <h2 className="text-[16px] font-bold text-[#0f172a]">Deal History</h2>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-outline bg-white text-label font-semibold text-text-muted hover:bg-hover-light transition-colors"
          >
            All Types
            <ChevronDown size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-outline">
                <th className="text-left px-6 py-3 text-label font-semibold uppercase tracking-wider text-text-muted">
                  Property Name
                </th>
                <th className="text-left px-6 py-3 text-label font-semibold uppercase tracking-wider text-text-muted">
                  Type
                </th>
                <th className="text-left px-6 py-3 text-label font-semibold uppercase tracking-wider text-text-muted">
                  Commission
                </th>
                <th className="text-left px-6 py-3 text-label font-semibold uppercase tracking-wider text-text-muted">
                  Date
                </th>
                <th className="text-left px-6 py-3 text-label font-semibold uppercase tracking-wider text-text-muted">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {DEALS.map((deal) => (
                <tr key={deal.id} className="border-b border-outline last:border-b-0">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={deal.image}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover bg-slate-200"
                      />
                      <span className="text-[13px] font-semibold text-[#0f172a]">
                        {deal.property}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-text-muted">{deal.type}</td>
                  <td className="px-6 py-4 text-[13px] font-semibold text-[#0f172a]">
                    {deal.commission}
                  </td>
                  <td className="px-6 py-4 text-[13px] text-text-muted">{deal.date}</td>
                  <td className="px-6 py-4">
                    <DealStatusPill status={deal.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="py-4 text-center border-t border-outline">
          <button
            type="button"
            className="text-label font-semibold text-text-muted hover:text-primary transition-colors"
          >
            View All Transactions
          </button>
        </div>
      </div>

      {/* ── Bottom cards ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="relative bg-white border border-outline rounded-xl p-6 shadow-ambient overflow-hidden">
          <svg
            className="absolute right-4 bottom-4 w-32 h-20 text-primary/10"
            viewBox="0 0 120 60"
            fill="none"
            aria-hidden
          >
            <path
              d="M0 50 L20 40 L40 45 L60 25 L80 30 L100 15 L120 10"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          <h2 className="text-[16px] font-bold text-[#0f172a]">Earnings Forecast</h2>
          <p className="text-[14px] text-text-muted mt-3 leading-relaxed max-w-md relative z-10">
            Based on your current pipeline, your projected earnings for Q4 are estimated to reach{' '}
            <span className="font-bold text-[#0f172a]">$32,000.00</span>.
          </p>
          <div className="flex items-center gap-3 mt-6 relative z-10">
            <div className="flex -space-x-2">
              {[sarahJenkinsImg, brokerProfileImg, julianVaneImg].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover border-2 border-white"
                />
              ))}
            </div>
            <span className="text-label text-text-muted font-medium">
              Collaborate with your team
            </span>
          </div>
        </div>

        <div className="relative bg-[#0f172a] rounded-xl p-6 shadow-card overflow-hidden">
          <h2 className="text-[16px] font-bold text-white">
            Commission Calculator{' '}
            <span className="text-slate-400 font-medium">(optional)</span>
          </h2>
          <p className="text-[14px] text-slate-400 mt-3 leading-relaxed max-w-sm">
            Estimate your net earnings for upcoming commercial leases with our advanced tax and fee
            modeling tool.
          </p>
          <button
            type="button"
            className="mt-6 px-5 py-2.5 rounded-lg bg-white text-[#0f172a] text-label font-bold border-2 border-dashed border-primary hover:bg-primary-100 transition-colors"
          >
            Launch Calculator
          </button>
        </div>
      </div>

      <p className="text-center text-[11px] text-text-muted pt-4">
        PropManage Enterprise v4.2.0 · © 2024 Broker Portal Analytics · Private &amp; Confidential
      </p>
    </div>
  )
}
