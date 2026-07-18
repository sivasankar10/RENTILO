import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, ChevronLeft, ChevronRight, MoreVertical, Plus } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { ROUTES } from '@shared/constants/routes'
import { useEnterpriseContext } from '../hooks/useEnterpriseContext'

const PAGE_SIZE = 6

const statusStyles: Record<string, string> = {
  Occupied: 'bg-green-50 text-green-700',
  Vacant: 'bg-amber-50 text-amber-700',
  Maintenance: 'bg-slate-100 text-slate-600',
}

export function EnterprisePortfolio() {
  const navigate = useNavigate()
  const { currentBlockId, enterpriseBlocks } = useEnterpriseContext()
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('All Statuses')

  const currentBlock = enterpriseBlocks.find((b) => b.id === currentBlockId)
  const blockData = currentBlock?.enterpriseBlock
  const units = blockData?.units ?? []

  const filtered = useMemo(() => {
    if (statusFilter === 'All Statuses') return units
    return units.filter((u) => u.status === statusFilter)
  }, [units, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const occupiedCount = units.filter((u) => u.status === 'Occupied').length
  const vacantCount = units.filter((u) => u.status === 'Vacant').length
  const occupancyRate = units.length ? Math.round((occupiedCount / units.length) * 100) : 0

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-1.5">
            <Building2 size={13} /> Enterprise Assets
          </p>
          <h1 className="mt-1 text-[28px] font-extrabold text-[#0f172a] tracking-tight">
            {currentBlock?.title ?? 'Property Portfolio'}
          </h1>
          <p className="mt-2 max-w-2xl text-[14px] text-text-muted leading-relaxed">
            {blockData ? `Block ${blockData.blockName} — ${blockData.floors} floors, ${blockData.unitsPerFloor} units per floor. Manage occupancy and assignments.` : 'Select a block to view units.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`${ROUTES.ENTERPRISE.PORTFOLIO}/add-unit`)} className="inline-flex items-center gap-2 rounded-xl border border-outline bg-white px-5 py-3 text-[13px] font-bold text-[#0f172a] hover:bg-hover-light transition-colors shadow-sm">
            <Plus size={16} /> Add Unit
          </button>
          <button onClick={() => navigate(`${ROUTES.ENTERPRISE.PORTFOLIO}/register`)} className="inline-flex items-center gap-2 rounded-xl bg-[#0f172a] px-5 py-3 text-[13px] font-bold text-white hover:bg-navy/80 transition-colors shadow-sm">
            <Plus size={16} /> Add Property
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Units" value={String(units.length)} />
        <StatCard label="Occupancy Rate" value={`${occupancyRate}%`} bar={occupancyRate} />
        <StatCard label="Occupied" value={String(occupiedCount)} sub={`${vacantCount} vacant`} />
        <StatCard label="Block" value={blockData?.blockName ?? '—'} sub={`${blockData?.floors ?? 0} floors`} />
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-[13px] text-text-muted">
          Status:
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }} className="rounded-lg border border-outline bg-white px-3 py-1.5 text-[13px] font-semibold text-[#0f172a] outline-none">
            <option>All Statuses</option>
            <option>Occupied</option>
            <option>Vacant</option>
            <option>Maintenance</option>
          </select>
        </label>
      </div>

      {/* Units Table */}
      <div className="rounded-xl border border-outline bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-outline">
              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">Unit</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">Floor</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">Status</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">Tenant</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-muted text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((unit) => (
              <tr key={unit.unitId} className="border-b border-outline last:border-0 hover:bg-hover-light transition-colors">
                <td className="px-6 py-4 text-[13px] font-bold text-[#0f172a]">{unit.unitNumber}</td>
                <td className="px-4 py-4 text-[13px] text-text-muted">Floor {unit.floor}</td>
                <td className="px-4 py-4">
                  <span className={cn('rounded-pill px-2.5 py-1 text-[10px] font-bold', statusStyles[unit.status])}>
                    {unit.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-[13px] text-text-primary">{unit.tenantName ?? '—'}</td>
                <td className="px-4 py-4 text-center">
                  <button className="p-1.5 rounded-lg text-text-muted hover:bg-hover-light"><MoreVertical size={16} /></button>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-[13px] text-text-muted">No units match the current filter.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-[12px] text-text-muted">Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} units</p>
        <div className="flex items-center gap-1">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-8 w-8 rounded-lg border border-outline flex items-center justify-center text-text-muted hover:bg-hover-light disabled:opacity-40"><ChevronLeft size={14} /></button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={cn('h-8 w-8 rounded-lg text-[12px] font-bold', p === currentPage ? 'bg-[#0f172a] text-white' : 'border border-outline text-text-muted hover:bg-hover-light')}>{p}</button>
          ))}
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="h-8 w-8 rounded-lg border border-outline flex items-center justify-center text-text-muted hover:bg-hover-light disabled:opacity-40"><ChevronRight size={14} /></button>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, bar }: { label: string; value: string; sub?: string; bar?: number }) {
  return (
    <div className="rounded-xl border border-outline bg-white p-5 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{label}</p>
      <p className="mt-2 text-[28px] font-extrabold text-[#0f172a] leading-none">{value}</p>
      {sub && <p className="mt-2 text-[11px] text-text-muted">{sub}</p>}
      {bar !== undefined && (
        <div className="mt-3 h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full rounded-full bg-[#0f172a]" style={{ width: `${bar}%` }} />
        </div>
      )}
    </div>
  )
}
