import { useMemo, useState } from 'react'
import { CheckCircle2, CreditCard, Download, IndianRupee, Search, X } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { useAuth } from '@shared/hooks/useAuth'
import { usePrototypeStore } from '@shared/store/prototypeStore'
import { useEnterpriseContext } from '../hooks/useEnterpriseContext'
import type { PrototypePayment } from '@shared/types/prototype'

type FilterStatus = 'All' | 'Successful' | 'Pending' | 'Failed'

const statusStyles: Record<string, string> = {
  Successful: 'bg-green-50 text-green-700',
  Pending: 'bg-amber-50 text-amber-700',
  Failed: 'bg-red-50 text-red-700',
  Refunded: 'bg-slate-100 text-slate-600',
}

const categoryStyles: Record<string, string> = {
  RENT: 'bg-blue-50 text-blue-700',
  'SECURITY DEPOSIT': 'bg-violet-50 text-violet-700',
  COMMISSION: 'bg-cyan-50 text-cyan-700',
  MAINTENANCE: 'bg-orange-50 text-orange-700',
  OTHER: 'bg-slate-100 text-slate-700',
}

export function EnterpriseFinance() {
  const { user } = useAuth()
  const { enterpriseBlocks } = useEnterpriseContext()
  const payments = usePrototypeStore((s) => s.payments)
  const allProperties = usePrototypeStore((s) => s.properties)
  const users = usePrototypeStore((s) => s.users)
  const ownerId = user?.id ?? ''

  const [statusFilter, setStatusFilter] = useState<FilterStatus>('All')
  const [search, setSearch] = useState('')
  const [selectedReceipt, setSelectedReceipt] = useState<PrototypePayment | null>(null)

  // Get all property IDs owned by this enterprise (block + unit properties)
  const enterprisePropertyIds = useMemo(() => {
    const ids = new Set<string>()
    enterpriseBlocks.forEach((b) => ids.add(b.id))
    // Also include unit properties owned by this enterprise
    allProperties.filter((p) => p.ownerId === ownerId && !p.enterpriseBlock).forEach((p) => ids.add(p.id))
    return ids
  }, [enterpriseBlocks, allProperties, ownerId])

  // Filter payments for enterprise properties
  const enterprisePayments = useMemo(() => {
    return payments.filter((p) => p.ownerId === ownerId || (p.propertyId && enterprisePropertyIds.has(p.propertyId)))
  }, [payments, ownerId, enterprisePropertyIds])

  // Apply filters
  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase()
    return enterprisePayments.filter((p) => {
      if (statusFilter !== 'All' && p.status !== statusFilter) return false
      if (query) {
        const property = allProperties.find((prop) => prop.id === p.propertyId)
        const tenant = users.find((u) => u.id === p.tenantId)
        const searchable = [p.txnId, p.category, p.amountDisplay, p.method, property?.title ?? '', tenant ? `${tenant.firstName} ${tenant.lastName}` : ''].join(' ').toLowerCase()
        if (!searchable.includes(query)) return false
      }
      return true
    })
  }, [enterprisePayments, statusFilter, search, allProperties, users])

  // Summary stats
  const totalReceived = enterprisePayments.filter((p) => p.status === 'Successful').reduce((sum, p) => sum + p.amount, 0)
  const totalPending = enterprisePayments.filter((p) => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0)
  const totalTransactions = enterprisePayments.length

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Enterprise Finance</p>
          <h1 className="mt-1 text-[28px] font-extrabold text-[#0f172a] tracking-tight">Payments & Revenue</h1>
          <p className="mt-2 text-[14px] text-text-muted">All rent, deposits, and commission payments for your enterprise units.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-outline bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-700"><CheckCircle2 size={18} /></div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Total Received</p>
              <p className="text-[24px] font-extrabold text-[#0f172a] leading-none">Rs. {totalReceived.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-outline bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700"><IndianRupee size={18} /></div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Pending</p>
              <p className="text-[24px] font-extrabold text-[#0f172a] leading-none">Rs. {totalPending.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-outline bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><CreditCard size={18} /></div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Total Transactions</p>
              <p className="text-[24px] font-extrabold text-[#0f172a] leading-none">{totalTransactions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by txn ID, tenant, property..." className="h-11 w-full rounded-xl border border-outline bg-white pl-10 pr-4 text-[13px] text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary-100" />
        </div>
        <div className="flex gap-1">
          {(['All', 'Successful', 'Pending', 'Failed'] as FilterStatus[]).map((s) => (
            <button key={s} type="button" onClick={() => setStatusFilter(s)} className={cn('rounded-lg px-4 py-2 text-[12px] font-bold transition-colors', statusFilter === s ? 'bg-[#0f172a] text-white' : 'border border-outline bg-white text-text-muted hover:bg-hover-light')}>{s}</button>
          ))}
        </div>
      </div>

      {/* Payments List */}
      <div className="rounded-xl border border-outline bg-white shadow-sm overflow-hidden">
        {filteredPayments.length > 0 ? (
          filteredPayments.map((payment) => {
            const property = allProperties.find((p) => p.id === payment.propertyId)
            const tenant = users.find((u) => u.id === payment.tenantId)
            const tenantName = tenant ? `${tenant.firstName} ${tenant.lastName}` : payment.counterparty || 'Unknown'
            return (
              <div key={payment.id} className="border-b border-outline px-6 py-5 transition-colors last:border-0 hover:bg-canvas-alt">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="text-[14px] font-bold text-text-primary">From: {tenantName}</span>
                      <span className={cn('inline-flex rounded-pill px-2.5 py-1 text-[10px] font-bold', categoryStyles[payment.category] ?? categoryStyles.OTHER)}>{payment.category}</span>
                    </div>
                    <p className="text-[24px] font-black leading-none text-[#0f172a]">{payment.amountDisplay}</p>
                    <p className="mt-2 text-[12px] font-semibold text-text-muted">{property?.title ?? 'Enterprise Unit'}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-text-muted">
                      <span>TXN: <span className="font-bold text-text-primary">{payment.txnId}</span></span>
                      <span className="text-outline">|</span>
                      <span>VIA: <span className="font-bold text-text-primary">{payment.method}</span></span>
                      <span className="text-outline">|</span>
                      <span>FLOW: <span className="font-bold text-text-primary">{payment.flow.replace(/_/g, ' ')}</span></span>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2 lg:items-end">
                    <span className={cn('inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-[10px] font-bold', statusStyles[payment.status] ?? 'bg-slate-100 text-slate-600')}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />{payment.status}
                    </span>
                    <span className="text-[11px] text-text-muted">{payment.paidAt}</span>
                    {payment.status === 'Successful' && (
                      <button type="button" onClick={() => setSelectedReceipt(payment)} className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0f172a] hover:text-primary">
                        <Download size={13} /> Receipt
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="px-6 py-16 text-center">
            <CreditCard size={36} className="mx-auto text-text-muted" />
            <p className="mt-3 text-[15px] font-bold text-[#0f172a]">No payments found</p>
            <p className="mt-1 text-[13px] text-text-muted">
              {enterprisePayments.length === 0 ? 'Payments will appear here once tenants complete onboarding.' : 'Try adjusting your filters.'}
            </p>
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-sm" onClick={() => setSelectedReceipt(null)} />
          <div className="relative w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-outline px-6 py-5">
              <div>
                <h2 className="text-[18px] font-bold text-[#0f172a]">Payment Receipt</h2>
                <p className="mt-1 text-[12px] text-text-muted">{selectedReceipt.txnId}</p>
              </div>
              <button type="button" onClick={() => setSelectedReceipt(null)} className="rounded-lg p-2 text-text-muted hover:bg-hover-light"><X size={18} /></button>
            </div>
            <div className="px-6 py-5 space-y-5">
              <div className="text-center border-b border-outline pb-5">
                <p className="text-[32px] font-black text-[#0f172a]">{selectedReceipt.amountDisplay}</p>
                <span className={cn('mt-2 inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-[11px] font-bold', statusStyles[selectedReceipt.status] ?? 'bg-slate-100 text-slate-600')}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />{selectedReceipt.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-[13px]">
                <div><p className="text-[10px] font-bold uppercase text-text-muted">Category</p><p className="mt-1 font-bold text-[#0f172a]">{selectedReceipt.category}</p></div>
                <div><p className="text-[10px] font-bold uppercase text-text-muted">Transaction ID</p><p className="mt-1 font-bold text-[#0f172a]">{selectedReceipt.txnId}</p></div>
                <div><p className="text-[10px] font-bold uppercase text-text-muted">Payment Method</p><p className="mt-1 font-bold text-[#0f172a]">{selectedReceipt.method}</p></div>
                <div><p className="text-[10px] font-bold uppercase text-text-muted">Flow</p><p className="mt-1 font-bold text-[#0f172a]">{selectedReceipt.flow.replace(/_/g, ' ')}</p></div>
                <div><p className="text-[10px] font-bold uppercase text-text-muted">Date & Time</p><p className="mt-1 font-bold text-[#0f172a]">{selectedReceipt.paidAt}</p></div>
                <div><p className="text-[10px] font-bold uppercase text-text-muted">Reference</p><p className="mt-1 font-bold text-[#0f172a]">{selectedReceipt.refId}</p></div>
                {selectedReceipt.propertyId && <div className="col-span-2"><p className="text-[10px] font-bold uppercase text-text-muted">Property</p><p className="mt-1 font-bold text-[#0f172a]">{allProperties.find((p) => p.id === selectedReceipt.propertyId)?.title ?? selectedReceipt.propertyId}</p></div>}
                {selectedReceipt.tenantId && <div className="col-span-2"><p className="text-[10px] font-bold uppercase text-text-muted">Tenant</p><p className="mt-1 font-bold text-[#0f172a]">{users.find((u) => u.id === selectedReceipt.tenantId)?.firstName} {users.find((u) => u.id === selectedReceipt.tenantId)?.lastName}</p></div>}
              </div>
              {selectedReceipt.description && (
                <div className="border-t border-outline pt-4"><p className="text-[10px] font-bold uppercase text-text-muted">Description</p><p className="mt-1 text-[13px] text-[#0f172a]">{selectedReceipt.description}</p></div>
              )}
            </div>
            <div className="border-t border-outline px-6 py-4">
              <button type="button" onClick={() => setSelectedReceipt(null)} className="w-full rounded-lg bg-[#0f172a] px-5 py-3 text-[13px] font-bold text-white hover:bg-slate-800">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
