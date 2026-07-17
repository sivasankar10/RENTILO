import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, ChevronLeft, ChevronRight, MoreVertical, Plus, TrendingUp, Users } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { ROUTES } from '@shared/constants/routes'

interface PortfolioProperty {
  id: string
  image: string
  name: string
  location: string
  rent: string
  status: 'Occupied' | 'Vacant' | 'Maintenance'
  broker: string | null
  brokerInitials: string
}

const allProperties: PortfolioProperty[] = [
  { id: 'ep-1', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=80&q=80', name: 'The Obsidian Tower', location: 'New York, NY', rent: '$42,500', status: 'Occupied', broker: 'James Sterling', brokerInitials: 'JD' },
  { id: 'ep-2', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=80&q=80', name: 'Glass Point Complex', location: 'London, UK', rent: '$28,900', status: 'Vacant', broker: null, brokerInitials: '' },
  { id: 'ep-3', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=80&q=80', name: 'The Brutalist Suites', location: 'Berlin, DE', rent: '$15,400', status: 'Occupied', broker: 'Elena Meyer', brokerInitials: 'EM' },
  { id: 'ep-4', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=80&q=80', name: 'Zenith HQ', location: 'Tokyo, JP', rent: '$62,000', status: 'Occupied', broker: 'Hiroki Kato', brokerInitials: 'HK' },
  { id: 'ep-5', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=80&q=80', name: 'Marina Bay Complex', location: 'Singapore, SG', rent: '$38,200', status: 'Occupied', broker: 'Wei Lin', brokerInitials: 'WL' },
  { id: 'ep-6', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=80&q=80', name: 'Skyline Residences', location: 'Dubai, UAE', rent: '$55,000', status: 'Vacant', broker: null, brokerInitials: '' },
  { id: 'ep-7', image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=80&q=80', name: 'Nova Park Tower', location: 'Sydney, AU', rent: '$31,800', status: 'Maintenance', broker: 'Tom Harris', brokerInitials: 'TH' },
  { id: 'ep-8', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=80&q=80', name: 'Atlas Commercial', location: 'Toronto, CA', rent: '$22,400', status: 'Occupied', broker: 'Sarah Chen', brokerInitials: 'SC' },
]

const PAGE_SIZE = 4

const statusStyles: Record<string, string> = {
  Occupied: 'bg-green-50 text-green-700',
  Vacant: 'bg-amber-50 text-amber-700',
  Maintenance: 'bg-slate-100 text-slate-600',
}

export function EnterprisePortfolio() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [locationFilter, setLocationFilter] = useState('All Locations')

  const filtered = useMemo(() => {
    return allProperties.filter((p) => {
      if (statusFilter !== 'All Statuses' && p.status !== statusFilter) return false
      if (locationFilter !== 'All Locations' && !p.location.includes(locationFilter)) return false
      return true
    })
  }, [statusFilter, locationFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const toggleSelect = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selectedIds.size === paginated.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(paginated.map((p) => p.id)))
    }
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-1.5">
            <Building2 size={13} /> Enterprise Assets
          </p>
          <h1 className="mt-1 text-[28px] font-extrabold text-[#0f172a] tracking-tight">Property Portfolio</h1>
          <p className="mt-2 max-w-2xl text-[14px] text-text-muted leading-relaxed">
            Manage your high-value architectural assets with precision. Access real-time occupancy
            metrics and broker performance across your enterprise regions.
          </p>
        </div>
        <button onClick={() => navigate(`${ROUTES.ENTERPRISE.PORTFOLIO}/register`)} className="inline-flex items-center gap-2 rounded-xl bg-[#0f172a] px-5 py-3 text-[13px] font-bold text-white hover:bg-navy/80 transition-colors shadow-sm">
          <Plus size={16} /> Add Property
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Assets" value="1,284" sub="↗ +12% vs last month" subColor="text-green-600" icon={<TrendingUp size={14} className="text-green-600" />} />
        <StatCard label="Current Occupancy" value="94.2%" bar={94.2} />
        <StatCard label="Active Brokers" value="42" sub="Across 8 regions" />
        <StatCard label="Portfolio Valuation" value="$4.2B" sub="Asset estimate" />
      </div>

      {/* Filters + Bulk Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-outline bg-white px-5 py-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-[13px] text-text-muted">
            Status:
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }} className="rounded-lg border border-outline bg-white px-3 py-1.5 text-[13px] font-semibold text-[#0f172a] outline-none">
              <option>All Statuses</option>
              <option>Occupied</option>
              <option>Vacant</option>
              <option>Maintenance</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-[13px] text-text-muted">
            Location:
            <select value={locationFilter} onChange={(e) => { setLocationFilter(e.target.value); setPage(1) }} className="rounded-lg border border-outline bg-white px-3 py-1.5 text-[13px] font-semibold text-[#0f172a] outline-none">
              <option>All Locations</option>
              <option>New York</option>
              <option>London</option>
              <option>Berlin</option>
              <option>Tokyo</option>
              <option>Singapore</option>
              <option>Dubai</option>
              <option>Sydney</option>
              <option>Toronto</option>
            </select>
          </label>
        </div>

        {selectedIds.size > 0 && (
          <div className="flex items-center gap-4">
            <span className="text-[12px] text-text-muted">Bulk Actions ({selectedIds.size} Selected)</span>
            <button className="text-[12px] font-semibold text-[#0f172a] hover:text-primary flex items-center gap-1"><Users size={13} /> Assign Broker</button>
            <button className="text-[12px] font-semibold text-[#0f172a] hover:text-primary flex items-center gap-1">✏️ Edit Rent</button>
            <button className="text-[12px] font-semibold text-[#0f172a] hover:text-primary flex items-center gap-1">✓ Mark Occupied</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-outline bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-outline">
              <th className="px-5 py-3 w-10">
                <input type="checkbox" checked={selectedIds.size === paginated.length && paginated.length > 0} onChange={toggleAll} className="h-4 w-4 rounded border-outline" />
              </th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">Property Name</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">Location</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">Rent</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">Status</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">Assigned Broker</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-muted text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((property) => (
              <tr key={property.id} className="border-b border-outline last:border-0 hover:bg-hover-light transition-colors">
                <td className="px-5 py-4">
                  <input type="checkbox" checked={selectedIds.has(property.id)} onChange={() => toggleSelect(property.id)} className="h-4 w-4 rounded border-outline" />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <img src={property.image} alt="" className="h-10 w-12 rounded-lg object-cover" />
                    <span className="text-[13px] font-bold text-[#0f172a]">{property.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-[13px] text-text-muted">{property.location}</td>
                <td className="px-4 py-4 text-[14px] font-semibold text-[#0f172a]">{property.rent}<span className="text-[11px] font-normal text-text-muted">/mo</span></td>
                <td className="px-4 py-4">
                  <span className={cn('rounded-pill px-2.5 py-1 text-[10px] font-bold', statusStyles[property.status])}>
                    {property.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  {property.broker ? (
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-[#0f172a]">{property.brokerInitials}</div>
                      <span className="text-[12px] font-semibold text-[#0f172a]">{property.broker}</span>
                    </div>
                  ) : (
                    <span className="text-[12px] text-text-muted">Unassigned</span>
                  )}
                </td>
                <td className="px-4 py-4 text-center">
                  <button className="p-1.5 rounded-lg text-text-muted hover:bg-hover-light hover:text-[#0f172a]">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-[12px] text-text-muted">
          Showing {(currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} properties
        </p>
        <div className="flex items-center gap-1">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-8 w-8 rounded-lg border border-outline flex items-center justify-center text-text-muted hover:bg-hover-light disabled:opacity-40">
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={cn('h-8 w-8 rounded-lg text-[12px] font-bold', p === currentPage ? 'bg-[#0f172a] text-white' : 'border border-outline text-text-muted hover:bg-hover-light')}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="h-8 w-8 rounded-lg border border-outline flex items-center justify-center text-text-muted hover:bg-hover-light disabled:opacity-40">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, subColor, bar, icon }: { label: string; value: string; sub?: string; subColor?: string; bar?: number; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-outline bg-white p-5 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{label}</p>
      <p className="mt-2 text-[28px] font-extrabold text-[#0f172a] leading-none">{value}</p>
      {sub && (
        <p className={cn('mt-2 text-[11px] flex items-center gap-1', subColor ?? 'text-text-muted')}>
          {icon} {sub}
        </p>
      )}
      {bar !== undefined && (
        <div className="mt-3 h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full rounded-full bg-[#0f172a]" style={{ width: `${bar}%` }} />
        </div>
      )}
    </div>
  )
}
