import { useMemo, useState } from 'react'
import { FileText, MessageSquare, Phone, Users, X } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { useAuth } from '@shared/hooks/useAuth'
import { usePrototypeStore } from '@shared/store/prototypeStore'
import { useEnterpriseContext } from '../hooks/useEnterpriseContext'

export function EnterpriseTenants() {
  const { user } = useAuth()
  const { enterpriseBlocks } = useEnterpriseContext()
  const leases = usePrototypeStore((s) => s.leases)
  const users = usePrototypeStore((s) => s.users)
  const allProperties = usePrototypeStore((s) => s.properties)
  const payments = usePrototypeStore((s) => s.payments)
  const applications = usePrototypeStore((s) => s.applications)

  const ownerId = user?.id ?? ''

  // All enterprise property IDs
  const enterprisePropertyIds = useMemo(() => {
    const ids = new Set<string>()
    enterpriseBlocks.forEach((b) => { ids.add(b.id); b.enterpriseBlock?.units.forEach((u) => { if (u.propertyId) ids.add(u.propertyId) }) })
    allProperties.filter((p) => p.ownerId === ownerId).forEach((p) => ids.add(p.id))
    return ids
  }, [enterpriseBlocks, allProperties, ownerId])

  // Active leases for enterprise properties
  const enterpriseLeases = useMemo(() => {
    return leases.filter((l) => enterprisePropertyIds.has(l.propertyId) && (l.status === 'active' || l.status === 'pending_owner_onboarding'))
      .map((lease) => {
        const tenant = users.find((u) => u.id === lease.tenantId)
        const property = allProperties.find((p) => p.id === lease.propertyId)
        const application = applications.find((a) => a.id === lease.applicationId)
        const broker = application?.brokerId ? users.find((u) => u.id === application.brokerId) : null
        const leasePayments = payments.filter((p) => p.leaseId === lease.id || p.applicationId === lease.applicationId)
        return { lease, tenant, property, application, broker, payments: leasePayments }
      })
  }, [leases, enterprisePropertyIds, users, allProperties, applications, payments])

  const [selectedLeaseId, setSelectedLeaseId] = useState<string | null>(null)
  const selectedLease = enterpriseLeases.find((l) => l.lease.id === selectedLeaseId)

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-[28px] font-extrabold text-[#0f172a] tracking-tight">Tenant Management</h1>
        <p className="mt-2 text-[14px] text-text-muted">All onboarded tenants across your enterprise properties.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-outline bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-700"><Users size={18} /></div><div><p className="text-[10px] font-bold uppercase text-text-muted">Active Tenants</p><p className="text-[24px] font-extrabold text-[#0f172a]">{enterpriseLeases.filter((l) => l.lease.status === 'active').length}</p></div></div></div>
        <div className="rounded-xl border border-outline bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700"><Users size={18} /></div><div><p className="text-[10px] font-bold uppercase text-text-muted">Pending Onboarding</p><p className="text-[24px] font-extrabold text-[#0f172a]">{enterpriseLeases.filter((l) => l.lease.status === 'pending_owner_onboarding').length}</p></div></div></div>
        <div className="rounded-xl border border-outline bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><FileText size={18} /></div><div><p className="text-[10px] font-bold uppercase text-text-muted">Total Leases</p><p className="text-[24px] font-extrabold text-[#0f172a]">{enterpriseLeases.length}</p></div></div></div>
      </div>

      {/* Tenant List */}
      <div className="rounded-xl border border-outline bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-outline"><h2 className="text-[15px] font-bold text-[#0f172a]">Onboarded Tenants</h2></div>
        {enterpriseLeases.length > 0 ? (
          <div className="divide-y divide-outline">
            {enterpriseLeases.map(({ lease, tenant, property, broker }) => (
              <button key={lease.id} type="button" onClick={() => setSelectedLeaseId(lease.id)} className={cn('block w-full px-6 py-5 text-left transition-colors hover:bg-hover-light', selectedLeaseId === lease.id && 'bg-primary-50/50')}>
                <div className="flex items-center gap-4">
                  {tenant?.avatar ? <img src={tenant.avatar} alt="" className="h-12 w-12 rounded-full object-cover" /> : <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-[13px] font-bold">{tenant?.firstName?.[0]}{tenant?.lastName?.[0]}</div>}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] font-bold text-[#0f172a]">{tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Unknown'}</p>
                      <span className={cn('rounded-pill px-2 py-0.5 text-[9px] font-bold', lease.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700')}>{lease.status === 'active' ? 'Active' : 'Pending'}</span>
                    </div>
                    <p className="mt-1 text-[12px] text-text-muted">{property?.title ?? 'Property'}</p>
                    <p className="mt-0.5 text-[11px] text-text-muted">{tenant?.phone} · {tenant?.email}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[14px] font-bold text-[#0f172a]">{property?.price ?? '—'}</p>
                    <p className="text-[10px] text-text-muted">per month</p>
                    {broker && <p className="mt-1 text-[10px] text-primary font-semibold">Broker: {broker.firstName} {broker.lastName}</p>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="px-6 py-16 text-center"><Users size={32} className="mx-auto text-text-muted" /><p className="mt-3 text-[14px] font-bold text-[#0f172a]">No tenants onboarded yet</p><p className="mt-1 text-[12px] text-text-muted">Tenants will appear here after completing the onboarding flow.</p></div>
        )}
      </div>

      {/* Tenant Detail Modal */}
      {selectedLease && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-sm" onClick={() => setSelectedLeaseId(null)} />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl">
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-outline bg-white px-6 py-5">
              <div>
                <h2 className="text-[20px] font-bold text-[#0f172a]">Tenant Details</h2>
                <p className="mt-1 text-[12px] text-text-muted">{selectedLease.property?.title ?? 'Property'}</p>
              </div>
              <button type="button" onClick={() => setSelectedLeaseId(null)} className="rounded-lg p-2 text-text-muted hover:bg-hover-light"><X size={18} /></button>
            </div>
            <div className="px-6 py-5 space-y-6">
              {/* Tenant Info */}
              <div className="flex items-center gap-4">
                {selectedLease.tenant?.avatar ? <img src={selectedLease.tenant.avatar} alt="" className="h-16 w-16 rounded-full object-cover" /> : <div className="h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center text-[18px] font-bold">{selectedLease.tenant?.firstName?.[0]}{selectedLease.tenant?.lastName?.[0]}</div>}
                <div>
                  <h3 className="text-[18px] font-bold text-[#0f172a]">{selectedLease.tenant ? `${selectedLease.tenant.firstName} ${selectedLease.tenant.lastName}` : 'Unknown'}</h3>
                  <p className="text-[13px] text-text-muted">{selectedLease.tenant?.email}</p>
                  <p className="text-[13px] text-text-muted">{selectedLease.tenant?.phone}</p>
                  <div className="mt-2 flex gap-2">
                    <a href={`tel:${selectedLease.tenant?.phone}`} className="inline-flex items-center gap-1.5 rounded-lg bg-[#0f172a] px-3 py-1.5 text-[11px] font-bold text-white"><Phone size={12} /> Call</a>
                    <button className="inline-flex items-center gap-1.5 rounded-lg border border-outline px-3 py-1.5 text-[11px] font-bold text-[#0f172a]"><MessageSquare size={12} /> Chat</button>
                  </div>
                </div>
              </div>

              {/* Lease Info */}
              <div className="rounded-lg border border-outline p-4 space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted">Lease Information</p>
                <div className="grid grid-cols-2 gap-4 text-[13px]">
                  <div><p className="text-text-muted">Lease ID</p><p className="font-bold text-[#0f172a]">{selectedLease.lease.id}</p></div>
                  <div><p className="text-text-muted">Status</p><p className="font-bold text-[#0f172a]">{selectedLease.lease.status === 'active' ? 'Active' : 'Pending Onboarding'}</p></div>
                  <div><p className="text-text-muted">Property</p><p className="font-bold text-[#0f172a]">{selectedLease.property?.title ?? '—'}</p></div>
                  <div><p className="text-text-muted">Rent</p><p className="font-bold text-[#0f172a]">{selectedLease.property?.price ?? '—'}</p></div>
                  {selectedLease.lease.accessKey && <div><p className="text-text-muted">Access Key</p><p className="font-bold text-green-700">{selectedLease.lease.accessKey}</p></div>}
                  {selectedLease.lease.activatedAt && <div><p className="text-text-muted">Activated</p><p className="font-bold text-[#0f172a]">{selectedLease.lease.activatedAt}</p></div>}
                </div>
              </div>

              {/* Broker Info */}
              {selectedLease.broker && (
                <div className="rounded-lg border border-outline p-4 space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted">Associated Broker</p>
                  <div className="flex items-center gap-3">
                    {selectedLease.broker.avatar ? <img src={selectedLease.broker.avatar} alt="" className="h-10 w-10 rounded-full object-cover" /> : <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-[11px] font-bold">{selectedLease.broker.firstName[0]}{selectedLease.broker.lastName[0]}</div>}
                    <div>
                      <p className="text-[14px] font-bold text-[#0f172a]">{selectedLease.broker.firstName} {selectedLease.broker.lastName}</p>
                      <p className="text-[12px] text-text-muted">{selectedLease.broker.phone} · {selectedLease.broker.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Receipts */}
              {selectedLease.payments.length > 0 && (
                <div className="rounded-lg border border-outline p-4 space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted">Payment Receipts</p>
                  <div className="space-y-2">
                    {selectedLease.payments.map((p) => (
                      <div key={p.id} className="flex items-center justify-between rounded-lg bg-canvas-alt p-3">
                        <div>
                          <p className="text-[13px] font-bold text-[#0f172a]">{p.category}</p>
                          <p className="text-[11px] text-text-muted">{p.txnId} · {p.paidAt}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[14px] font-bold text-[#0f172a]">{p.amountDisplay}</p>
                          <span className={cn('rounded-pill px-2 py-0.5 text-[9px] font-bold', p.status === 'Successful' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700')}>{p.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
