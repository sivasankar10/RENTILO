import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
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

type EarningsPoint = { date: string; value: number }

/** Deterministic mock earnings covering 3 months of daily data (May–Jul 2024). */
function buildEarningsData(): EarningsPoint[] {
  const points: EarningsPoint[] = []
  const start = new Date('2024-05-01T00:00:00')
  const totalDays = 92 // May (31) + Jun (30) + Jul (31)
  for (let i = 0; i < totalDays; i++) {
    const day = new Date(start)
    day.setDate(start.getDate() + i)
    // Deterministic wave so the mock data has a natural-looking shape.
    const base = 30 + Math.round(40 * Math.abs(Math.sin(i * 0.6)))
    const wobble = Math.round(18 * Math.abs(Math.cos(i * 0.25)))
    points.push({ date: day.toISOString().slice(0, 10), value: base + wobble })
  }
  return points
}

const EARNINGS_DATA: EarningsPoint[] = buildEarningsData()
const EARNINGS_MIN_DATE = EARNINGS_DATA[0]!.date
const EARNINGS_MAX_DATE = EARNINGS_DATA[EARNINGS_DATA.length - 1]!.date

type ChartBar = { label: string; value: number }

/** Aggregate filtered daily points into the buckets the chart renders. */
function aggregateEarnings(points: EarningsPoint[], mode: 'daily' | 'monthly'): ChartBar[] {
  if (mode === 'monthly') {
    const buckets = new Map<string, ChartBar>()
    points.forEach((point) => {
      const key = point.date.slice(0, 7)
      const label = new Date(`${point.date}T00:00:00`).toLocaleDateString('en-US', { month: 'short' })
      const existing = buckets.get(key)
      if (existing) existing.value += point.value
      else buckets.set(key, { label, value: point.value })
    })
    return [...buckets.values()]
  }

  return points.map((point) => ({
    label: new Date(`${point.date}T00:00:00`).getDate().toString(),
    value: point.value,
  }))
}

type DealStatus = 'Closed' | 'Processing'
type DealType = 'Enterprise' | 'Non-Enterprise'

type DealRow = {
  id: string
  property: string
  image: string
  type: DealType
  commission: string
  date: string
  status: DealStatus
}

const DEALS: DealRow[] = [
  { id: '1', property: 'Skyline Penthouse 4B', image: skylineImg, type: 'Non-Enterprise', commission: '$4,500.00', date: 'Oct 24', status: 'Closed' },
  { id: '2', property: 'Harbor View Offices', image: harborImg, type: 'Enterprise', commission: '$8,200.00', date: 'Oct 18', status: 'Closed' },
  { id: '3', property: 'Garden Lofts Apt 12', image: greenwichImg, type: 'Non-Enterprise', commission: '$2,100.00', date: 'Oct 12', status: 'Processing' },
  { id: '4', property: 'Shoreditch Loft 7A', image: shoreditchImg, type: 'Non-Enterprise', commission: '$3,750.00', date: 'Oct 09', status: 'Closed' },
  { id: '5', property: 'Canary Trade Center', image: harborImg, type: 'Enterprise', commission: '$11,400.00', date: 'Oct 05', status: 'Processing' },
  { id: '6', property: 'Greenwich Townhouse', image: greenwichImg, type: 'Non-Enterprise', commission: '$5,600.00', date: 'Sep 28', status: 'Closed' },
  { id: '7', property: 'Skyline Retail Unit 2', image: skylineImg, type: 'Enterprise', commission: '$6,900.00', date: 'Sep 22', status: 'Closed' },
  { id: '8', property: 'Riverside Apartment 9C', image: shoreditchImg, type: 'Non-Enterprise', commission: '$2,850.00', date: 'Sep 15', status: 'Processing' },
  { id: '9', property: 'Harbor Logistics Depot', image: harborImg, type: 'Enterprise', commission: '$14,200.00', date: 'Sep 08', status: 'Closed' },
  { id: '10', property: 'Meadow View Cottage', image: greenwichImg, type: 'Non-Enterprise', commission: '$3,300.00', date: 'Sep 02', status: 'Closed' },
  { id: '11', property: 'Downtown Office Suite', image: skylineImg, type: 'Enterprise', commission: '$9,750.00', date: 'Aug 26', status: 'Processing' },
]

const DEAL_TYPES = ['All Types', 'Enterprise', 'Non-Enterprise'] as const
type DealTypeFilter = (typeof DEAL_TYPES)[number]

const DEALS_PER_PAGE = 5

type SortKey = 'property' | 'type' | 'commission' | 'date' | 'status'
type SortDirection = 'asc' | 'desc'

/** Parse "$4,500.00" → 4500 for numeric sorting. */
function commissionValue(commission: string): number {
  return Number(commission.replace(/[^\d.]/g, '')) || 0
}

/** Parse "Oct 24" (all 2024) → timestamp for chronological sorting. */
function dealDateValue(date: string): number {
  const parsed = new Date(`${date} 2024`).getTime()
  return Number.isNaN(parsed) ? 0 : parsed
}

function compareDeals(a: DealRow, b: DealRow, key: SortKey): number {
  switch (key) {
    case 'commission':
      return commissionValue(a.commission) - commissionValue(b.commission)
    case 'date':
      return dealDateValue(a.date) - dealDateValue(b.date)
    default:
      return String(a[key]).localeCompare(String(b[key]))
  }
}

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

function SortableHeader({
  label,
  sortKey,
  activeKey,
  direction,
  onSort,
}: {
  label: string
  sortKey: SortKey
  activeKey: SortKey
  direction: SortDirection
  onSort: (key: SortKey) => void
}) {
  const isActive = sortKey === activeKey
  return (
    <th className="text-left px-6 py-3">
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        aria-sort={isActive ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'}
        className={[
          'inline-flex items-center gap-1.5 text-label font-semibold uppercase tracking-wider transition-colors',
          isActive ? 'text-[#0f172a]' : 'text-text-muted hover:text-text-primary',
        ].join(' ')}
      >
        {label}
        {isActive ? (
          direction === 'asc' ? (
            <ArrowUp size={13} className="text-primary" />
          ) : (
            <ArrowDown size={13} className="text-primary" />
          )
        ) : (
          <ChevronsUpDown size={13} className="opacity-50" />
        )}
      </button>
    </th>
  )
}

function EarningsGrowthChart({ bars }: { bars: ChartBar[] }) {
  if (!bars.length) {
    return (
      <div className="flex items-center justify-center h-[220px] text-label font-semibold text-text-muted">
        No earnings in the selected date range.
      </div>
    )
  }

  const max = Math.max(...bars.map((bar) => bar.value))
  // Keep daily labels readable when the range spans many days.
  const labelEvery = Math.ceil(bars.length / 16)

  return (
    <div className="flex items-end justify-between gap-1.5 h-[220px] pt-4">
      {bars.map((bar, index) => {
        const heightPct = (bar.value / max) * 100
        const showLabel = index % labelEvery === 0

        return (
          <div key={`${bar.label}-${index}`} className="flex flex-1 flex-col items-center gap-2 h-full">
            <div className="relative flex-1 w-full flex items-end justify-center" title={`${bar.label}: ${bar.value}`}>
              <div
                className="w-full max-w-[48px] rounded-t-md bg-gradient-to-t from-primary/30 to-primary/10 border border-primary/20"
                style={{ height: `${heightPct}%`, minHeight: '24px' }}
              />
              <div
                className="absolute bottom-0 w-full max-w-[48px] rounded-t-sm bg-primary/40"
                style={{ height: `${heightPct * 0.65}%`, minHeight: '16px' }}
              />
            </div>
            <span className="text-[11px] font-semibold text-text-muted h-[14px]">
              {showLabel ? bar.label : ''}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export function BrokerAnalytics() {
  const [chartMode, setChartMode] = useState<'daily' | 'monthly'>('monthly')
  const [fromDate, setFromDate] = useState(EARNINGS_MIN_DATE)
  const [toDate, setToDate] = useState(EARNINGS_MAX_DATE)

  const filteredPoints = useMemo(
    () => EARNINGS_DATA.filter((point) => point.date >= fromDate && point.date <= toDate),
    [fromDate, toDate],
  )

  const chartBars = useMemo(
    () => aggregateEarnings(filteredPoints, chartMode),
    [filteredPoints, chartMode],
  )

  const rangeTotal = useMemo(
    () => filteredPoints.reduce((sum, point) => sum + point.value, 0),
    [filteredPoints],
  )

  // ── Deal History: type filter + pagination ──
  const [typeFilter, setTypeFilter] = useState<DealTypeFilter>('All Types')
  const [typeMenuOpen, setTypeMenuOpen] = useState(false)
  const [dealPage, setDealPage] = useState(1)
  const typeMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!typeMenuOpen) return
    function handleClickOutside(event: MouseEvent) {
      if (typeMenuRef.current && !typeMenuRef.current.contains(event.target as Node)) {
        setTypeMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [typeMenuOpen])

  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const filteredDeals = useMemo(() => {
    const base =
      typeFilter === 'All Types' ? DEALS : DEALS.filter((deal) => deal.type === typeFilter)
    const sorted = [...base].sort((a, b) => compareDeals(a, b, sortKey))
    return sortDirection === 'asc' ? sorted : sorted.reverse()
  }, [typeFilter, sortKey, sortDirection])

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDirection((dir) => (dir === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
    setDealPage(1)
  }

  const totalDealPages = Math.max(1, Math.ceil(filteredDeals.length / DEALS_PER_PAGE))
  const currentDealPage = Math.min(dealPage, totalDealPages)
  const pagedDeals = filteredDeals.slice(
    (currentDealPage - 1) * DEALS_PER_PAGE,
    currentDealPage * DEALS_PER_PAGE,
  )

  function selectTypeFilter(type: DealTypeFilter) {
    setTypeFilter(type)
    setTypeMenuOpen(false)
    setDealPage(1) // reset to first page whenever the filter changes
  }

  function handleExportReport() {
    const escape = (val: unknown): string => {
      const str = val == null ? '' : String(val)
      return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
    }

    const lines: string[] = []
    lines.push(escape('Broker Earnings Report'))
    lines.push(`${escape('Date Range')},${escape(`${fromDate} to ${toDate}`)}`)
    lines.push(`${escape('Generated')},${escape(new Date().toLocaleString('en-IN'))}`)
    lines.push('')

    // Summary metrics
    lines.push('Metric,Value')
    lines.push(`${escape('Total Earnings')},${escape('$24,000.00')}`)
    lines.push(`${escape('Pending Commission')},${escape('$1,200.00')}`)
    lines.push(`${escape('Completed Deals')},${escape('15')}`)
    lines.push(`${escape('Range Earnings (units)')},${escape(rangeTotal)}`)
    lines.push('')

    // Earnings in selected range
    lines.push('Date,Earnings')
    filteredPoints.forEach((point) => {
      lines.push(`${escape(point.date)},${escape(point.value)}`)
    })
    lines.push('')

    // Deal history
    lines.push('Property Name,Type,Commission,Date,Status')
    DEALS.forEach((deal) => {
      lines.push(
        [deal.property, deal.type, deal.commission, deal.date, deal.status].map(escape).join(','),
      )
    })

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `broker-earnings-report-${new Date().toISOString().slice(0, 10)}.csv`
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

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
            onClick={handleExportReport}
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
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white">
            <Gem size={18} />
          </div>
          <p className="text-label text-slate-400 font-semibold mt-4">Completed Deals</p>
          <p className="text-[36px] font-bold text-white tracking-tight mt-1 leading-none">15</p>
          <p className="text-label text-slate-400 mt-2">3 deals closing this week</p>
        </div>
      </div>

      {/* ── Earnings chart ── */}
      <div>
        <div className="bg-white border border-outline rounded-xl p-5 shadow-ambient">
          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
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

          {/* From / To date filter */}
          <div className="flex items-end gap-3 flex-wrap mb-2">
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">From</span>
              <input
                type="date"
                value={fromDate}
                min={EARNINGS_MIN_DATE}
                max={toDate}
                onChange={(event) => setFromDate(event.target.value)}
                className="rounded-lg border border-outline bg-white px-3 py-1.5 text-label font-semibold text-text-primary focus:border-primary focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">To</span>
              <input
                type="date"
                value={toDate}
                min={fromDate}
                max={EARNINGS_MAX_DATE}
                onChange={(event) => setToDate(event.target.value)}
                className="rounded-lg border border-outline bg-white px-3 py-1.5 text-label font-semibold text-text-primary focus:border-primary focus:outline-none"
              />
            </label>
            <button
              type="button"
              onClick={() => {
                setFromDate(EARNINGS_MIN_DATE)
                setToDate(EARNINGS_MAX_DATE)
              }}
              className="rounded-lg border border-outline bg-white px-3 py-1.5 text-label font-semibold text-text-muted hover:bg-hover-light transition-colors"
            >
              Reset
            </button>
          </div>

          <EarningsGrowthChart bars={chartBars} />
        </div>
      </div>

      {/* ── Deal history ── */}
      <div className="bg-white border border-outline rounded-xl shadow-ambient overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline">
          <h2 className="text-[16px] font-bold text-[#0f172a]">Deal History</h2>
          <div className="relative" ref={typeMenuRef}>
            <button
              type="button"
              onClick={() => setTypeMenuOpen((open) => !open)}
              aria-haspopup="listbox"
              aria-expanded={typeMenuOpen}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-outline bg-white text-label font-semibold text-text-muted hover:bg-hover-light transition-colors"
            >
              {typeFilter}
              <ChevronDown
                size={14}
                className={typeMenuOpen ? 'rotate-180 transition-transform' : 'transition-transform'}
              />
            </button>
            {typeMenuOpen && (
              <div
                role="listbox"
                className="absolute right-0 z-20 mt-2 w-44 rounded-lg border border-outline bg-white p-1 shadow-card"
              >
                {DEAL_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    role="option"
                    aria-selected={type === typeFilter}
                    onClick={() => selectTypeFilter(type)}
                    className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-label font-semibold text-text-primary hover:bg-hover-light transition-colors"
                  >
                    {type}
                    {type === typeFilter && <Check size={14} className="text-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-outline">
                <SortableHeader label="Property Name" sortKey="property" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                <SortableHeader label="Type" sortKey="type" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                <SortableHeader label="Commission" sortKey="commission" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                <SortableHeader label="Date" sortKey="date" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                <SortableHeader label="Status" sortKey="status" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
              </tr>
            </thead>
            <tbody>
              {pagedDeals.map((deal) => (
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
              {pagedDeals.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-[13px] font-semibold text-text-muted">
                    No deals found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-outline flex-wrap">
          <p className="text-label font-semibold text-text-muted">
            Showing{' '}
            <span className="text-text-primary">
              {filteredDeals.length === 0 ? 0 : (currentDealPage - 1) * DEALS_PER_PAGE + 1}
              {'–'}
              {Math.min(currentDealPage * DEALS_PER_PAGE, filteredDeals.length)}
            </span>{' '}
            of <span className="text-text-primary">{filteredDeals.length}</span> deals
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setDealPage((page) => Math.max(1, page - 1))}
              disabled={currentDealPage === 1}
              aria-label="Previous page"
              className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-outline bg-white text-text-muted hover:bg-hover-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalDealPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setDealPage(page)}
                aria-current={page === currentDealPage ? 'page' : undefined}
                className={[
                  'inline-flex items-center justify-center h-8 min-w-8 px-2 rounded-lg text-label font-bold transition-colors',
                  page === currentDealPage
                    ? 'bg-[#0f172a] text-white'
                    : 'border border-outline bg-white text-text-muted hover:bg-hover-light',
                ].join(' ')}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setDealPage((page) => Math.min(totalDealPages, page + 1))}
              disabled={currentDealPage === totalDealPages}
              aria-label="Next page"
              className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-outline bg-white text-text-muted hover:bg-hover-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
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
    </div>
  )
}
