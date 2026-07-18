import { useState } from 'react'
import { ChevronLeft, ChevronRight, Filter, Download } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { usePrototypeStore } from '@shared/store/prototypeStore'
import { useEnterpriseContext } from '../hooks/useEnterpriseContext'

type BrokerFilter = 'All Brokers' | 'Active' | 'On Leave'

const allBrokers = [
  { id: 1, name: 'Alexander Thorne', role: 'Senior Associate', location: 'Manhattan', avatar: 'AT', assigned: 28, status: 'ONLINE', lastContact: 'Last Contact: 2 hours ago', lastDetail: 'Completed walk-through at for Penthouse 48.' },
  { id: 2, name: 'Elena Rodriguez', role: 'Broker', location: 'Brooklyn North', avatar: 'ER', assigned: 14, status: 'OFFLINE', lastContact: 'Last Contact: Yesterday, 5:45 PM', lastDetail: 'Weekly status report submitted via portal.' },
  { id: 3, name: 'Marcus Vance', role: 'Junior Partner', location: 'Queens District', avatar: 'MV', assigned: 42, status: 'ONLINE', lastContact: 'Last Contact: Just now', lastDetail: 'Signed 3 new lease agreements for Q1.' },
]

const assignmentMapping = [
  { id: 1, name: 'Alexander Thorne', role: 'Senior Associate', location: 'Manhattan', avatar: 'AT', block: 'A', floor: '1', flats: '101,102' },
  { id: 2, name: 'Elena Rodriguez', role: 'Broker', location: 'Brooklyn North', avatar: 'ER', block: 'B', floor: '5', flats: '501,505' },
  { id: 3, name: 'Marcus Vance', role: 'Junior Partner', location: 'Queens District', avatar: 'MV', block: 'C', floor: '7', flats: '707,711,713' },
]

export function EnterpriseBrokers() {
  const { currentBlockId, enterpriseBlocks } = useEnterpriseContext()
  const currentBlock = enterpriseBlocks.find((b) => b.id === currentBlockId)
  const blockData = currentBlock?.enterpriseBlock
  const brokerAssignments = usePrototypeStore((s) => s.brokerAssignments)
  const users = usePrototypeStore((s) => s.users)

  // Brokers assigned to the current block
  const blockAssignments = brokerAssignments.filter((a) => a.propertyId === currentBlockId && a.status === 'Active')

  // Brokers assigned to the current block (for future dynamic use)
  const blockBrokersForTable = blockAssignments.map((a) => {
    const broker = users.find((u) => u.id === a.brokerId)
    return {
      id: a.id,
      name: broker ? `${broker.firstName} ${broker.lastName}` : 'Unknown',
      role: 'Assigned Broker',
      location: currentBlock?.neighborhood ?? 'Unknown',
      avatar: broker ? `${broker.firstName[0]}${broker.lastName[0]}` : '??',
      assigned: 1,
      status: 'ONLINE' as const,
      lastContact: 'Active assignment',
      lastDetail: `Assigned to Block ${blockData?.blockName ?? ''}`,
    }
  })

  // Use dynamic data if available, otherwise show static demo
  const brokersToShow = blockBrokersForTable.length > 0 ? blockBrokersForTable : allBrokers
  const [brokerFilter, setBrokerFilter] = useState<BrokerFilter>('All Brokers')
  const [mappingFilter, setMappingFilter] = useState<BrokerFilter>('All Brokers')
  const [brokerPage, setBrokerPage] = useState(1)
  const [mappingPage, setMappingPage] = useState(1)

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-extrabold text-[#0f172a] tracking-tight">Broker Management</h1>
          <p className="mt-1 text-[14px] text-text-muted">Manage and assign professional brokers across your enterprise portfolio.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-outline bg-white px-4 py-2.5 text-[13px] font-semibold text-[#0f172a] hover:bg-hover-light"><Filter size={14} /> Filter</button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-outline bg-white px-4 py-2.5 text-[13px] font-semibold text-[#0f172a] hover:bg-hover-light"><Download size={14} /> Export List</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-outline bg-white p-6 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Total Brokers</p>
          <p className="mt-2 text-[36px] font-extrabold text-[#0f172a] leading-none">124 <span className="text-[12px] font-semibold text-green-600">↗12%</span></p>
          <p className="mt-2 text-[12px] text-text-muted">Active in 12 major regions.</p>
        </div>
        <div className="rounded-xl border border-outline bg-white p-6 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Active Properties</p>
          <p className="mt-2 text-[36px] font-extrabold text-[#0f172a] leading-none">842 <span className="text-[12px] font-normal text-text-muted">/ 200 capacity</span></p>
          <div className="mt-3 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-[#0f172a] rounded-full" style={{ width: '84%' }} />
          </div>
        </div>
        <div className="rounded-xl bg-[#0f172a] p-6 shadow-sm text-white">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Efficiency Rate</p>
          <p className="mt-2 text-[42px] font-extrabold leading-none">98.4%</p>
          <div className="mt-3 flex items-center gap-1">
            {[80, 90, 100, 70].map((h, i) => (
              <div key={i} className="w-2 rounded-sm bg-white/30" style={{ height: `${h * 0.25}px` }} />
            ))}
            <span className="ml-2 text-[18px]">✓</span>
          </div>
        </div>
      </div>

      {/* All Associated Brokers Table */}
      <div className="rounded-xl border border-outline bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline">
          <h2 className="text-[16px] font-bold text-[#0f172a]">All Associated Brokers</h2>
          <div className="flex gap-1">
            {(['All Brokers', 'Active', 'On Leave'] as BrokerFilter[]).map((f) => (
              <button key={f} onClick={() => setBrokerFilter(f)} className={cn('px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors', brokerFilter === f ? 'bg-[#0f172a] text-white' : 'text-text-muted hover:bg-hover-light')}>{f}</button>
            ))}
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-bold uppercase tracking-wider text-text-muted border-b border-outline">
              <th className="px-6 py-3">Broker Profile</th>
              <th className="px-4 py-3">Assigned Properties</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Assignme</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {brokersToShow.map((broker) => (
              <tr key={broker.id} className="border-b border-outline last:border-0 hover:bg-hover-light">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold">{broker.avatar}</div>
                    <div>
                      <p className="text-[13px] font-bold text-[#0f172a]">{broker.name}</p>
                      <p className="text-[11px] text-text-muted">{broker.role} · {broker.location}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[16px] font-bold text-[#0f172a]">{broker.assigned}</span>
                    <div className="flex gap-0.5">
                      <span className="h-4 w-4 rounded bg-slate-200" />
                      <span className="h-4 w-4 rounded bg-slate-200" />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={cn('inline-flex items-center gap-1.5 text-[11px] font-bold', broker.status === 'ONLINE' ? 'text-green-700' : 'text-slate-500')}>
                    <span className={cn('h-2 w-2 rounded-full', broker.status === 'ONLINE' ? 'bg-green-500' : 'bg-slate-400')} />
                    {broker.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[11px] font-semibold text-[#0f172a]">{broker.lastContact}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">{broker.lastDetail}</p>
                </td>
                <td className="px-4 py-4 text-right">
                  <button className="rounded-lg border border-outline px-4 py-1.5 text-[11px] font-bold text-[#0f172a] hover:bg-hover-light">Reassign</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-6 py-3 border-t border-outline">
          <p className="text-[11px] text-text-muted">Showing 1-10 of 124 brokers</p>
          <div className="flex gap-1">
            <button onClick={() => setBrokerPage(Math.max(1, brokerPage - 1))} className="h-7 w-7 rounded border border-outline flex items-center justify-center text-text-muted hover:bg-hover-light"><ChevronLeft size={13} /></button>
            {[1, 2, 3].map((p) => (
              <button key={p} onClick={() => setBrokerPage(p)} className={cn('h-7 w-7 rounded text-[11px] font-bold', p === brokerPage ? 'bg-[#0f172a] text-white' : 'border border-outline text-text-muted hover:bg-hover-light')}>{p}</button>
            ))}
            <button onClick={() => setBrokerPage(Math.min(3, brokerPage + 1))} className="h-7 w-7 rounded border border-outline flex items-center justify-center text-text-muted hover:bg-hover-light"><ChevronRight size={13} /></button>
          </div>
        </div>
      </div>

      {/* Broker Assignment Mapping */}
      <div className="rounded-xl border border-outline bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline">
          <h2 className="text-[16px] font-bold text-[#0f172a]">Broker Assignment Mapping</h2>
          <div className="flex gap-1">
            {(['All Brokers', 'Active', 'On Leave'] as BrokerFilter[]).map((f) => (
              <button key={f} onClick={() => setMappingFilter(f)} className={cn('px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors', mappingFilter === f ? 'bg-[#0f172a] text-white' : 'text-text-muted hover:bg-hover-light')}>{f}</button>
            ))}
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-bold uppercase tracking-wider text-text-muted border-b border-outline">
              <th className="px-6 py-3">Broker Profile</th>
              <th className="px-4 py-3">Block</th>
              <th className="px-4 py-3">Floor</th>
              <th className="px-4 py-3">Flat Number</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignmentMapping.map((broker) => (
              <tr key={broker.id} className="border-b border-outline last:border-0 hover:bg-hover-light">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold">{broker.avatar}</div>
                    <div>
                      <p className="text-[13px] font-bold text-[#0f172a]">{broker.name}</p>
                      <p className="text-[11px] text-text-muted">{broker.role} · {broker.location}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-[15px] font-bold text-[#0f172a]">{broker.block}</td>
                <td className="px-4 py-4 text-[15px] font-bold text-[#0f172a]">{broker.floor}</td>
                <td className="px-4 py-4 text-[15px] font-bold text-[#0f172a]">{broker.flats}</td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="rounded-lg border border-outline px-4 py-1.5 text-[11px] font-bold text-[#0f172a] hover:bg-hover-light">Edit</button>
                    <button className="rounded-lg bg-[#0f172a] px-4 py-1.5 text-[11px] font-bold text-white hover:bg-navy/80">Remove</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-6 py-3 border-t border-outline">
          <p className="text-[11px] text-text-muted">Showing 1-10 of 124 brokers</p>
          <div className="flex gap-1">
            <button onClick={() => setMappingPage(Math.max(1, mappingPage - 1))} className="h-7 w-7 rounded border border-outline flex items-center justify-center text-text-muted hover:bg-hover-light"><ChevronLeft size={13} /></button>
            {[1, 2, 3].map((p) => (
              <button key={p} onClick={() => setMappingPage(p)} className={cn('h-7 w-7 rounded text-[11px] font-bold', p === mappingPage ? 'bg-[#0f172a] text-white' : 'border border-outline text-text-muted hover:bg-hover-light')}>{p}</button>
            ))}
            <button onClick={() => setMappingPage(Math.min(3, mappingPage + 1))} className="h-7 w-7 rounded border border-outline flex items-center justify-center text-text-muted hover:bg-hover-light"><ChevronRight size={13} /></button>
          </div>
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-outline bg-white p-6 shadow-sm">
          <h3 className="text-[15px] font-bold text-[#0f172a]">Automated Assignment</h3>
          <p className="mt-2 text-[13px] text-text-muted leading-relaxed">
            Our intelligent routing system can automatically assign properties to the best-performing broker in a specific region based on their current workload and historical closing rates.
          </p>
          <button className="mt-4 text-[13px] font-bold text-[#0f172a] hover:text-primary inline-flex items-center gap-1">
            Configure Auto-Assignment →
          </button>
        </div>
        <div className="rounded-xl bg-[#0f172a] p-6 shadow-sm text-white">
          <h3 className="text-[15px] font-bold">Quarterly Review Notice</h3>
          <p className="mt-2 text-[13px] text-slate-300 leading-relaxed">
            The enterprise review period for broker performance metrics ends on the 30th. Ensure all interaction logs are finalized for bonus calculations and tier reassignment.
          </p>
          <button className="mt-4 rounded-lg bg-white px-4 py-2 text-[12px] font-bold text-[#0f172a] hover:bg-slate-100 transition-colors">
            View Performance Audit
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-[11px] text-text-muted pt-4">© 2024 RENTILO ENTERPRISE MANAGEMENT · SECURE INFRASTRUCTURE</p>
    </div>
  )
}
