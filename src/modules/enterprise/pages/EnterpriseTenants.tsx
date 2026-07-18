import { useState } from 'react'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Download, Filter, Plus, UserPlus } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { useEnterpriseContext } from '../hooks/useEnterpriseContext'

interface TenantEntry {
  id: number
  name: string
  email: string
  phone: string
  block: string
  floor: string
  flat: string
}

export function EnterpriseTenants() {
  const { currentBlockId, enterpriseBlocks } = useEnterpriseContext()
  const currentBlock = enterpriseBlocks.find((b) => b.id === currentBlockId)
  const blockData = currentBlock?.enterpriseBlock

  // Derive tenants from occupied units in the current block
  const blockTenants: TenantEntry[] = (blockData?.units ?? [])
    .filter((u) => u.status === 'Occupied' && u.tenantName)
    .map((u, i) => ({
      id: i + 1,
      name: u.tenantName!,
      email: `${u.tenantName!.toLowerCase().replace(/\s/g, '.')}@tenant.com`,
      phone: `+91 9000${String(i + 1).padStart(6, '0')}`,
      block: blockData?.blockName ?? '',
      floor: String(u.floor),
      flat: u.unitNumber,
    }))

  const [tenants, setTenants] = useState<TenantEntry[]>(blockTenants)
  const [showAddForm, setShowAddForm] = useState(false)
  const [page, setPage] = useState(1)
  const [toast, setToast] = useState('')

  // Add tenant form state
  const [blockName, setBlockName] = useState('')
  const [floorNumber, setFloorNumber] = useState('')
  const [flatNumber, setFlatNumber] = useState('')
  const [tenantName, setTenantName] = useState('')
  const [tenantEmail, setTenantEmail] = useState('')
  const [tenantPhone, setTenantPhone] = useState('')
  const [leaseStart, setLeaseStart] = useState('')
  const [leaseDuration, setLeaseDuration] = useState('12 Months')

  const handleAddTenant = () => {
    if (!tenantName.trim() || !blockName) return
    const newTenant: TenantEntry = {
      id: Date.now(),
      name: tenantName.trim(),
      email: tenantEmail.trim(),
      phone: tenantPhone.trim(),
      block: blockName,
      floor: floorNumber,
      flat: flatNumber,
    }
    setTenants((current) => [newTenant, ...current])
    setToast(`${tenantName} has been assigned to Unit ${flatNumber}.`)
    setShowAddForm(false)
    resetForm()
    setTimeout(() => setToast(''), 4000)
  }

  const resetForm = () => {
    setBlockName('')
    setFloorNumber('')
    setFlatNumber('')
    setTenantName('')
    setTenantEmail('')
    setTenantPhone('')
    setLeaseStart('')
    setLeaseDuration('12 Months')
  }

  const removeTenant = (id: number) => {
    setTenants((current) => current.filter((t) => t.id !== id))
  }

  if (showAddForm) {
    return (
      <div className="space-y-8 pb-10">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setShowAddForm(false)} className="p-2 rounded-lg text-text-muted hover:bg-hover-light">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-[22px] font-extrabold text-[#0f172a]">Add New Tenant</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Form */}
          <div className="space-y-8">
            {/* 1. Property Assignment */}
            <div>
              <h2 className="text-[16px] font-bold text-[#0f172a] flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[12px] font-bold text-white">1</span>
                Property Assignment
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Block Name</label>
                  <select value={blockName} onChange={(e) => setBlockName(e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-3 text-body text-text-primary focus:border-primary focus:outline-none">
                    <option value="">Select Block</option>
                    <option>A</option>
                    <option>B</option>
                    <option>C</option>
                    <option>D</option>
                  </select>
                  {!blockName && <p className="mt-1 text-[11px] text-red-600">Required field</p>}
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Floor Number</label>
                  <input value={floorNumber} onChange={(e) => setFloorNumber(e.target.value)} placeholder="e.g. 12" className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Flat / Unit Number</label>
                  <input value={flatNumber} onChange={(e) => setFlatNumber(e.target.value)} placeholder="e.g. 1204" className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none" />
                </div>
              </div>
            </div>

            {/* 2. Tenant Information */}
            <div>
              <h2 className="text-[16px] font-bold text-[#0f172a] flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[12px] font-bold text-white">2</span>
                Tenant Information
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Full Legal Name</label>
                  <input value={tenantName} onChange={(e) => setTenantName(e.target.value)} placeholder="Enter tenant name" className="mt-1.5 h-11 w-full rounded-input border-b border-outline bg-transparent px-0 text-body text-text-primary focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Email Address</label>
                  <input type="email" value={tenantEmail} onChange={(e) => setTenantEmail(e.target.value)} placeholder="tenant@example.com" className="mt-1.5 h-11 w-full rounded-input border-b border-outline bg-transparent px-0 text-body text-text-primary focus:border-primary focus:outline-none" />
                  <p className="mt-1 text-[10px] text-text-muted">Validation: Enter a valid email format</p>
                </div>
              </div>
              <div className="mt-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Phone Number</label>
                <input value={tenantPhone} onChange={(e) => setTenantPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="mt-1.5 h-11 w-full max-w-sm rounded-input border-b border-outline bg-transparent px-0 text-body text-text-primary focus:border-primary focus:outline-none" />
              </div>
            </div>

            {/* 3. Lease Details */}
            <div>
              <h2 className="text-[16px] font-bold text-[#0f172a] flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[12px] font-bold text-white">3</span>
                Lease Details
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Lease Start Date</label>
                  <input type="text" value={leaseStart} onChange={(e) => setLeaseStart(e.target.value)} placeholder="mm/dd/yyyy" className="mt-1.5 h-11 w-full rounded-input border-b border-outline bg-transparent px-0 text-body text-text-primary focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Duration (Months)</label>
                  <select value={leaseDuration} onChange={(e) => setLeaseDuration(e.target.value)} className="mt-1.5 h-11 w-full rounded-input border-b border-outline bg-transparent px-0 text-body text-text-primary focus:border-primary focus:outline-none">
                    <option>6 Months</option>
                    <option>12 Months</option>
                    <option>24 Months</option>
                    <option>36 Months</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button type="button" onClick={handleAddTenant} disabled={!tenantName.trim() || !blockName} className="inline-flex items-center gap-2 rounded-xl bg-[#0f172a] px-8 py-4 text-[14px] font-bold text-white hover:bg-navy/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Confirm & Add Tenant <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Configuration Review Sidebar */}
          <div className="rounded-xl border border-outline bg-white p-6 shadow-sm h-fit space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Configuration Review</p>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Assigned Unit</p>
              <p className="mt-1 text-[16px] font-bold text-[#0f172a]">Block {blockName || '—'}, Floor {floorNumber || '—'}, Unit {flatNumber || '—'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Tenant Name</p>
              <p className="mt-1 text-[16px] font-bold text-[#0f172a]">{tenantName || '—'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Lease Period</p>
              <p className="mt-1 text-[13px] text-[#0f172a]">{leaseStart || 'Not set'} — {leaseDuration}</p>
            </div>
            <div className="rounded-lg border-l-4 border-primary bg-primary-50 px-4 py-3">
              <p className="text-[12px] italic text-text-muted leading-relaxed">"The system will automatically generate the welcome kit and first month's pro-rated invoice upon confirmation."</p>
            </div>
            <div className="rounded-xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=320&q=80" alt="Unit preview" className="w-full h-40 object-cover" />
              <div className="bg-[#0f172a] px-3 py-2">
                <p className="text-[10px] font-bold text-white uppercase tracking-wider">Unit Preview: North Wing {blockName || 'A'}-{flatNumber || '1204'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#0f172a] tracking-tight">Tenant Management</h1>
          <p className="mt-1 text-[14px] text-text-muted">Manage and assign tenant across your enterprise portfolio.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-outline bg-white px-4 py-2.5 text-[13px] font-semibold text-[#0f172a] hover:bg-hover-light"><Filter size={14} /> Filter</button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-outline bg-white px-4 py-2.5 text-[13px] font-semibold text-[#0f172a] hover:bg-hover-light"><Download size={14} /> Export List</button>
          <button onClick={() => setShowAddForm(true)} className="inline-flex items-center gap-2 rounded-lg bg-[#0f172a] px-4 py-2.5 text-[13px] font-bold text-white hover:bg-navy/80">
            <Plus size={14} /> Add Tenant
          </button>
        </div>
      </div>

      {/* Tenant Mapping Table */}
      <div className="rounded-xl border border-outline bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-outline">
          <h2 className="text-[15px] font-bold text-[#0f172a]">Tenant Mapping</h2>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-bold uppercase tracking-wider text-text-muted border-b border-outline">
              <th className="px-6 py-3">Tenant Profile</th>
              <th className="px-4 py-3">Block</th>
              <th className="px-4 py-3">Floor</th>
              <th className="px-4 py-3">Flat Number</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant) => (
              <tr key={tenant.id} className="border-b border-outline last:border-0 hover:bg-hover-light">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold text-[#0f172a]">
                      <UserPlus size={16} className="text-text-muted" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#0f172a]">{tenant.name}</p>
                      <p className="text-[11px] text-text-muted">{tenant.email}</p>
                      <p className="text-[11px] text-text-muted">{tenant.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-[16px] font-bold text-[#0f172a]">{tenant.block}</td>
                <td className="px-4 py-4 text-[16px] font-bold text-[#0f172a]">{tenant.floor}</td>
                <td className="px-4 py-4 text-[16px] font-bold text-[#0f172a]">{tenant.flat}</td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="rounded-lg border border-outline px-4 py-1.5 text-[11px] font-bold text-[#0f172a] hover:bg-hover-light">Edit</button>
                    <button onClick={() => removeTenant(tenant.id)} className="rounded-lg bg-[#0f172a] px-4 py-1.5 text-[11px] font-bold text-white hover:bg-navy/80">Remove</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-6 py-3 border-t border-outline">
          <p className="text-[11px] text-text-muted">Showing 1-{tenants.length} of {tenants.length} tenants</p>
          <div className="flex gap-1">
            <button className="h-7 w-7 rounded border border-outline flex items-center justify-center text-text-muted hover:bg-hover-light"><ChevronLeft size={13} /></button>
            {[1, 2, 3].map((p) => (
              <button key={p} onClick={() => setPage(p)} className={cn('h-7 w-7 rounded text-[11px] font-bold', p === page ? 'bg-[#0f172a] text-white' : 'border border-outline text-text-muted hover:bg-hover-light')}>{p}</button>
            ))}
            <button className="h-7 w-7 rounded border border-outline flex items-center justify-center text-text-muted hover:bg-hover-light"><ChevronRight size={13} /></button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-[11px] text-text-muted pt-4">© 2024 RENTILO ENTERPRISE MANAGEMENT · SECURE INFRASTRUCTURE</p>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl bg-[#0f172a] px-5 py-3.5 text-white shadow-lg">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-[12px]">✓</span>
          <div>
            <p className="text-[13px] font-bold">Tenant Added Successfully</p>
            <p className="text-[11px] text-slate-300">{toast}</p>
          </div>
          <button onClick={() => setToast('')} className="ml-4 text-[11px] font-bold text-slate-400 hover:text-white">DISMISS</button>
        </div>
      )}
    </div>
  )
}
