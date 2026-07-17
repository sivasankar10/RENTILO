import { Download, TrendingUp } from 'lucide-react'

const priceComparison = [
  { name: 'The Obsidian Towers', yourRent: '$5,800', marketAvg: '$5,450', variance: '+8.4%', positive: true },
  { name: 'Grand Central Lofts', yourRent: '$3,200', marketAvg: '$3,400', variance: '-5.9%', positive: false },
  { name: 'Parkview Residences', yourRent: '$4,150', marketAvg: '$4,120', variance: '+0.7%', positive: true },
]

export function EnterpriseFinance() {
  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-extrabold text-[#0f172a] tracking-tight">
            Market Watch <span className="ml-2 rounded bg-[#0f172a] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">Enterprise</span>
          </h1>
          <p className="mt-2 text-[14px] text-text-muted">Real-time competitive intelligence for Downtown Metro area.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl border border-outline bg-white px-5 py-3 text-[13px] font-semibold text-[#0f172a] hover:bg-hover-light shadow-sm">
            <Download size={14} /> Export Report
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-[#0f172a] px-5 py-3 text-[13px] font-bold text-white hover:bg-navy/80 shadow-sm">
            <TrendingUp size={14} /> Full Analytics Suite
          </button>
        </div>
      </div>

      {/* Area Trends Chart */}
      <div className="rounded-xl border border-outline bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[18px] font-bold text-[#0f172a]">Area Trends: Downtown Metro</h2>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary-100 px-3 py-1 text-[11px] font-bold text-primary">12 Months</span>
            <button className="p-1.5 rounded-lg text-text-muted hover:bg-hover-light">•••</button>
          </div>
        </div>

        {/* SVG Line Chart */}
        <div className="relative h-52 w-full">
          <svg viewBox="0 0 600 200" className="w-full h-full" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="50" x2="600" y2="50" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="100" x2="600" y2="100" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="150" x2="600" y2="150" stroke="#f1f5f9" strokeWidth="1" />
            {/* Area fill */}
            <path d="M0,180 C50,170 100,160 150,140 C200,120 250,80 300,60 C350,40 400,50 450,70 C500,90 550,100 600,110 L600,200 L0,200 Z" fill="url(#areaGradient)" />
            {/* Line */}
            <path d="M0,180 C50,170 100,160 150,140 C200,120 250,80 300,60 C350,40 400,50 450,70 C500,90 550,100 600,110" fill="none" stroke="#0f172a" strokeWidth="2.5" />
            {/* Highlight dot */}
            <circle cx="450" cy="70" r="5" fill="#0f172a" />
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0f172a" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0.01" />
              </linearGradient>
            </defs>
          </svg>
          {/* Tooltip */}
          <div className="absolute right-[20%] top-[25%] rounded-lg border border-outline bg-white px-3 py-2 shadow-sm">
            <p className="text-[10px] text-text-muted">AVG. RENT OCT 2023</p>
            <p className="text-[20px] font-bold text-[#0f172a]">$4,250 <span className="text-[12px] font-semibold text-green-600">+12%</span></p>
          </div>
          {/* X-axis labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-[10px] text-text-muted">
            <span>JAN</span><span>MAR</span><span>MAY</span><span>JUL</span><span>SEP</span><span>NOV</span>
          </div>
        </div>
      </div>

      {/* Price Comparison + Broker Market Report */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Price Comparison */}
        <div className="rounded-xl border border-outline bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[18px] font-bold text-[#0f172a]">Price Comparison</h2>
            <button className="text-[12px] font-semibold text-primary hover:underline">View all 24 properties ›</button>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                <th className="pb-3">Property Name</th>
                <th className="pb-3 text-right">Your Rent</th>
                <th className="pb-3 text-right">Market Avg.</th>
                <th className="pb-3 text-right">Variance</th>
              </tr>
            </thead>
            <tbody>
              {priceComparison.map((item) => (
                <tr key={item.name} className="border-t border-outline">
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-canvas-alt">
                        <span className="text-[12px]">🏢</span>
                      </div>
                      <span className="text-[13px] font-semibold text-[#0f172a]">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-right text-[18px] font-bold text-[#0f172a]">{item.yourRent}</td>
                  <td className="py-4 text-right text-[13px] text-text-muted">{item.marketAvg}</td>
                  <td className="py-4 text-right">
                    <span className={`rounded px-2 py-0.5 text-[11px] font-bold ${item.positive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {item.variance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Exclusive Broker Market Report */}
        <div className="rounded-xl bg-[#0f172a] p-6 shadow-sm text-white">
          <h2 className="text-[20px] font-extrabold leading-tight">Exclusive Broker Market Report</h2>

          <div className="mt-5 rounded-xl border border-slate-700 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Key Takeaway</p>
            <p className="mt-2 text-[13px] leading-relaxed text-slate-300 italic">
              "The Q4 shift toward hybrid-work-friendly amenities is driving a 15% premium in properties featuring dedicated co-working hubs and fiber-optic backbone."
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-slate-600" />
              <div>
                <p className="text-[12px] font-bold text-white">Marcus Vane</p>
                <p className="text-[10px] text-slate-400">HEAD OF STRATEGY, URBANCORE</p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-700 p-4">
              <span className="text-[14px]">📈</span>
              <p className="mt-1 text-[13px] font-bold text-white">Investment Hotspot</p>
              <p className="mt-0.5 text-[11px] text-slate-400">South Corridor Development.</p>
            </div>
            <div className="rounded-xl border border-slate-700 p-4">
              <span className="text-[14px]">📊</span>
              <p className="mt-1 text-[13px] font-bold text-white">Yield Outlook</p>
              <p className="mt-0.5 text-[11px] text-slate-400">Stable (4.2% - 4.8%)</p>
            </div>
          </div>

          <button className="mt-5 w-full rounded-xl border border-slate-600 py-3 text-center text-[11px] font-bold uppercase tracking-widest text-slate-300 hover:bg-slate-800 transition-colors">
            Download Full PDF Report
          </button>
        </div>
      </div>
    </div>
  )
}
