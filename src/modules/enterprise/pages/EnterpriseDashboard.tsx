import { useState } from 'react'
import {
  Building2,
  Calendar,
  CreditCard,
  FileText,
  Home,
  MessageSquare,
  Settings,
  TrendingUp,
  Users,
  Wrench,
} from 'lucide-react'

const stats = [
  { label: 'Total Properties', value: '124', trend: '—', icon: Building2 },
  { label: 'Occupancy Rate', value: '94.6%', trend: '↑ 4%', icon: Home },
  { label: 'Monthly Revenue', value: '$1.2M', trend: '', icon: CreditCard },
  { label: 'Revenue Growth', value: '$842k', trend: '', icon: TrendingUp },
  { label: 'Pending Tickets', value: '18', trend: '↑ 1%', icon: Wrench },
  { label: 'Active Tenants', value: '1,452', trend: '', icon: Users },
  { label: 'Open Visits', value: '42', trend: '', icon: Calendar },
  { label: 'Lease Alerts', value: '14', trend: '', icon: FileText },
]

const propertyPerformance = [
  { name: 'Azure Heights Tower', city: 'Chicago', occupancy: '96%', revenue: '$142,000', roi: '2.8%', status: 'TRIAL' },
  { name: 'The State Executive', city: 'Austin', occupancy: '92%', revenue: '$98,200', roi: '5.6%', status: 'TRIAL' },
  { name: 'Pacific Marina Plaza', city: 'Seattle', occupancy: '84%', revenue: '$74,000', roi: '4.1%', status: 'AHRSI' },
  { name: 'Fenward Industrial Pk', city: 'Dallas', occupancy: '170%', revenue: '$210,000', roi: '9.4%', status: 'OTHER' },
]

const pendingTickets = [
  { title: 'WiFi Connection Issues', desc: 'Apt 305 Internet - Connectivity...', priority: 'high' },
  { title: 'Plumbing Leakage', desc: 'Building B - Flat 3, 1st...', priority: 'medium' },
  { title: 'Electricity Outage', desc: 'Block C Tower - Circuit/Industrial...', priority: 'high' },
  { title: 'Cleaning Request', desc: 'Unit 1406 early shift/Maids, Ext...', priority: 'low' },
]

const leaseExpiry = [
  { date: '12', month: 'APR', name: 'Global Logistics HQ', status: 'Critical', color: 'bg-red-50 text-red-700' },
  { date: '04', month: 'MAY', name: 'Vertex Solutions', status: 'Renew', color: 'bg-amber-50 text-amber-700' },
  { date: '28', month: 'JUN', name: 'Smith Residency', status: '', color: '' },
]

const pendingPayments = [
  { name: 'Sarah Michael', amount: '$3,040.00', color: 'text-red-600' },
  { name: 'David Chen', amount: '$3,100.00', color: 'text-red-600' },
  { name: 'Elena Rodriguez', amount: '$1,878.00', color: 'text-red-600' },
  { name: 'Marcus Thorne', amount: '$5,600.00', color: 'text-red-600' },
]

const recentActivity = [
  { icon: '🏠', title: 'Rent Received - Azure Heights', amount: '$12,400', time: 'Today', color: 'text-green-700' },
  { icon: '🔧', title: 'New Ticket - Plumbing Leak Unit 4B', amount: '', time: 'Oct 15, 2024 • 09:11 AM', color: '' },
  { icon: '👤', title: 'New Tenant - Sarah Mitchell (Apt 12)', amount: '', time: 'Oct 15, 2024 • 08:13 AM', color: '' },
]

const staffDetails = [
  { name: 'Sarah Jenkins', role: 'Maintenance Super...' },
  { name: 'Michael Chen', role: 'Enterprise Super...' },
  { name: 'Trina Rodriguez', role: '' },
  { name: 'Evan Wilson', role: 'Security Operations...' },
]

const groupChats = [
  { name: 'Ava Leighton Towers' },
  { name: 'Eva Stella Sarcelles' },
  { name: 'Pacific Intrest Plaze' },
  { name: 'Emerald Heights...' },
]

const quickActions = [
  { label: 'Add Property', icon: Building2 },
  { label: 'Add Tenant', icon: Users },
  { label: 'Create Invoice', icon: FileText },
  { label: 'Work Order', icon: Wrench },
  { label: 'Draft Lease', icon: FileText },
  { label: 'Disburse Funds', icon: CreditCard },
]

export function EnterpriseDashboard() {
  const [dateRange] = useState('Jun 01, 2024 - Dec 31, 2024')

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted">Portfolio</p>
          <p className="text-[13px] text-text-muted mt-0.5">Properties (124)</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[12px] text-text-muted flex items-center gap-1.5">
            <Calendar size={13} />
            {dateRange}
          </span>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-outline bg-white px-3 py-2 text-[12px] font-semibold text-text-muted hover:bg-hover-light">
            <Settings size={13} /> Filters
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-[#0f172a] px-4 py-2 text-[12px] font-bold text-white hover:bg-navy/80">
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="rounded-xl border border-outline bg-white p-4 shadow-sm">
              <div className="flex items-center gap-1.5 text-text-muted mb-2">
                <Icon size={13} />
                <span className="text-[10px] font-bold uppercase tracking-wider truncate">{stat.label}</span>
              </div>
              <p className="text-[20px] font-bold text-[#0f172a] leading-none">{stat.value}</p>
              {stat.trend && <p className="mt-1 text-[10px] text-text-muted">{stat.trend}</p>}
            </div>
          )
        })}
      </div>

      {/* Revenue Analytics + Portfolio Status */}
      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="rounded-xl border border-outline bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-bold text-[#0f172a]">Revenue Analytics</h2>
            <div className="flex items-center gap-3 text-[11px] text-text-muted">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#0f172a]"></span> Gross Revenue</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-300"></span> Net Income</span>
            </div>
          </div>
          <div className="flex items-end gap-1 h-40">
            {[60, 45, 70, 80, 55, 90, 75, 85, 65, 78, 82, 88].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                <div className="w-full bg-[#0f172a] rounded-t" style={{ height: `${h}%` }} />
                <span className="text-[8px] text-text-muted">{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-outline bg-white p-6 shadow-sm flex flex-col items-center justify-center">
          <h2 className="text-[15px] font-bold text-[#0f172a] self-start mb-4">Portfolio Status</h2>
          <div className="relative w-32 h-32">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e2e8f0" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="#0f172a" strokeWidth="3" strokeDasharray="92 100" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[22px] font-bold text-[#0f172a]">94.2%</span>
              <span className="text-[9px] text-text-muted">Total Occupied</span>
            </div>
          </div>
          <div className="flex gap-4 mt-4 text-[10px] text-text-muted">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#0f172a]"></span> Occupied (88%)</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-300"></span> Vacant (28)</span>
          </div>
        </div>
      </div>

      {/* Property Performance + Pending Tickets */}
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="rounded-xl border border-outline bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-outline">
            <h2 className="text-[15px] font-bold text-[#0f172a]">Property Performance</h2>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-wider text-text-muted border-b border-outline">
                <th className="px-5 py-2">Property Name</th>
                <th className="px-3 py-2">City</th>
                <th className="px-3 py-2">Occupancy</th>
                <th className="px-3 py-2">Revenue</th>
                <th className="px-3 py-2">ROI%</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {propertyPerformance.map((p) => (
                <tr key={p.name} className="border-b border-outline last:border-0 hover:bg-hover-light text-[12px]">
                  <td className="px-5 py-3 font-semibold text-[#0f172a]">{p.name}</td>
                  <td className="px-3 py-3 text-text-muted">{p.city}</td>
                  <td className="px-3 py-3">{p.occupancy}</td>
                  <td className="px-3 py-3 font-semibold">{p.revenue}</td>
                  <td className="px-3 py-3">{p.roi}</td>
                  <td className="px-3 py-3"><span className="rounded-pill bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-outline bg-white p-5 shadow-sm">
          <h2 className="text-[15px] font-bold text-[#0f172a] mb-4">Pending Tickets</h2>
          <div className="space-y-4">
            {pendingTickets.map((ticket) => (
              <div key={ticket.title} className="flex items-start gap-3">
                <div className={`h-2 w-2 mt-1.5 rounded-full shrink-0 ${ticket.priority === 'high' ? 'bg-red-500' : ticket.priority === 'medium' ? 'bg-amber-500' : 'bg-slate-400'}`} />
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-[#0f172a] truncate">{ticket.title}</p>
                  <p className="text-[11px] text-text-muted truncate">{ticket.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tenant Demographics + Lease Expiry */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-outline bg-white p-6 shadow-sm">
          <h2 className="text-[15px] font-bold text-[#0f172a] mb-1">Tenant Demographics</h2>
          <p className="text-[11px] text-text-muted mb-4">Enterprise Portfolio Segments</p>
          <div className="flex items-center gap-6">
            <div className="space-y-3 flex-1">
              <DemoBar label="Domestic" percent={61} color="bg-[#0f172a]" />
              <DemoBar label="Families" percent={25} color="bg-blue-400" />
              <DemoBar label="Working Professionals" percent={23} color="bg-slate-300" />
            </div>
            <div className="text-center">
              <p className="text-[28px] font-bold text-[#0f172a]">8.4k</p>
              <p className="text-[10px] text-text-muted">Total Tenants</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-outline bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-bold text-[#0f172a]">Lease Expiry Timeline</h2>
            <button className="text-[11px] font-semibold text-primary hover:underline">View Calendar</button>
          </div>
          <div className="space-y-3">
            {leaseExpiry.map((item) => (
              <div key={item.name} className="flex items-center gap-4">
                <div className="w-12 text-center">
                  <p className="text-[10px] font-bold text-text-muted">{item.month}</p>
                  <p className="text-[20px] font-bold text-[#0f172a]">{item.date}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#0f172a] truncate">{item.name}</p>
                </div>
                {item.status && <span className={`rounded-pill px-2 py-0.5 text-[10px] font-bold ${item.color}`}>{item.status}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Payments + Recent Activity */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-outline bg-white p-6 shadow-sm">
          <h2 className="text-[15px] font-bold text-[#0f172a] mb-4">Pending Payments</h2>
          <div className="space-y-3">
            {pendingPayments.map((p) => (
              <div key={p.name} className="flex items-center justify-between py-2 border-b border-outline last:border-0">
                <div>
                  <p className="text-[13px] font-semibold text-[#0f172a]">{p.name}</p>
                  <p className="text-[10px] text-text-muted">LEASE: ABCDEF • APT #6</p>
                </div>
                <span className={`text-[13px] font-bold ${p.color}`}>{p.amount}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-outline bg-white p-6 shadow-sm">
          <h2 className="text-[15px] font-bold text-[#0f172a] mb-4">Recent Activity Ledger</h2>
          <div className="space-y-4">
            {recentActivity.map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="text-[16px] shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-[#0f172a] truncate">{item.title}</p>
                  <p className="text-[10px] text-text-muted">{item.time}</p>
                </div>
                {item.amount && <span className={`text-[12px] font-bold ${item.color}`}>{item.amount}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Maintenance + Staff + Group Chats */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-outline bg-white p-5 shadow-sm">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-red-600 flex items-center gap-1.5 mb-3">
            <Wrench size={13} /> Maintenance Costs
          </h3>
          <div className="h-24 flex items-end gap-1">
            {[30, 50, 40, 60, 35, 55, 45, 65, 50, 70, 40, 60].map((h, i) => (
              <div key={i} className="flex-1 bg-[#0f172a] rounded-t" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-outline bg-white p-5 shadow-sm">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-primary flex items-center gap-1.5 mb-3">
            <Users size={13} /> Staff Details
          </h3>
          <div className="space-y-2.5">
            {staffDetails.map((s) => (
              <div key={s.name} className="flex items-center justify-between">
                <p className="text-[12px] font-semibold text-[#0f172a]">{s.name}</p>
                <p className="text-[10px] text-text-muted truncate max-w-[120px]">{s.role}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-outline bg-white p-5 shadow-sm">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-1.5 mb-3">
            <MessageSquare size={13} /> Group Chats
          </h3>
          <div className="space-y-2.5">
            {groupChats.map((c) => (
              <div key={c.name} className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-slate-200" />
                <p className="text-[12px] font-semibold text-[#0f172a] truncate">{c.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operational Quick Actions */}
      <div>
        <h2 className="text-[15px] font-bold text-[#0f172a] mb-4">Operational Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <button key={action.label} className="flex flex-col items-center gap-2 rounded-xl border border-outline bg-white p-5 shadow-sm hover:bg-hover-light hover:shadow-md transition-all">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-canvas-alt">
                  <Icon size={18} className="text-[#0f172a]" />
                </div>
                <span className="text-[11px] font-semibold text-[#0f172a] text-center">{action.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Footer nav */}
      <div className="flex items-center gap-6 pt-4 border-t border-outline text-[11px] text-text-muted">
        <span className="flex items-center gap-1"><Settings size={12} /> Settings</span>
        <span className="flex items-center gap-1"><MessageSquare size={12} /> Support</span>
      </div>
    </div>
  )
}

function DemoBar({ label, percent, color }: { label: string; percent: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-semibold text-[#0f172a]">{label}</span>
        <span className="text-[11px] text-text-muted">{percent}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
