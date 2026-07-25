import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Calendar, CreditCard, FileText, Home, Plus, TrendingUp, Users, Wrench, X } from 'lucide-react'
import { useAuth } from '@shared/hooks/useAuth'
import { usePrototypeStore } from '@shared/store/prototypeStore'
import { useOwnerMaintenanceStore } from '@modules/owner/store/maintenanceStore'
import { ROUTES } from '@shared/constants/routes'
import { useEnterpriseContext } from '../hooks/useEnterpriseContext'
import { useEnterpriseStore } from '../store/enterpriseStore'

export function EnterpriseDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { enterpriseBlocks } = useEnterpriseContext()
  const allProperties = usePrototypeStore((s) => s.properties)
  const leases = usePrototypeStore((s) => s.leases)
  const payments = usePrototypeStore((s) => s.payments)
  const applications = usePrototypeStore((s) => s.applications)
  const tickets = useOwnerMaintenanceStore((s) => s.tickets)
  const brokerAssignments = usePrototypeStore((s) => s.brokerAssignments)
  const ownerId = user?.id ?? ''

  // All enterprise property IDs
  const enterprisePropertyIds = useMemo(() => {
    const ids = new Set<string>()
    enterpriseBlocks.forEach((b) => { ids.add(b.id); b.enterpriseBlock?.units.forEach((u) => { if (u.propertyId) ids.add(u.propertyId) }) })
    allProperties.filter((p) => p.ownerId === ownerId).forEach((p) => ids.add(p.id))
    return ids
  }, [enterpriseBlocks, allProperties, ownerId])

  // Stats
  const totalProperties = enterpriseBlocks.length
  const totalUnits = enterpriseBlocks.reduce((sum, b) => sum + (b.enterpriseBlock?.units.length ?? 0), 0)
  const activeLeases = leases.filter((l) => enterprisePropertyIds.has(l.propertyId) && l.status === 'active')
  const pendingLeases = leases.filter((l) => enterprisePropertyIds.has(l.propertyId) && l.status === 'pending_owner_onboarding')
  const occupancyRate = totalUnits > 0 ? Math.round((activeLeases.length / totalUnits) * 100) : 0
  const totalRevenue = payments.filter((p) => (p.ownerId === ownerId || (p.propertyId && enterprisePropertyIds.has(p.propertyId))) && p.status === 'Successful').reduce((sum, p) => sum + p.amount, 0)
  const pendingPayments = payments.filter((p) => (p.ownerId === ownerId || (p.propertyId && enterprisePropertyIds.has(p.propertyId))) && p.status === 'Pending')
  const openTickets = tickets.filter((t) => enterprisePropertyIds.has(t.propertyId) && (t.status === 'Open' || t.status === 'In Progress'))
  const totalApplications = applications.filter((a) => enterprisePropertyIds.has(a.propertyId) && !['rejected', 'active'].includes(a.status))
  const scheduledVisits = applications.filter((a) => enterprisePropertyIds.has(a.propertyId) && a.scheduledVisit && ['visit_scheduled', 'visit_confirmed'].includes(a.status))
  const activeBrokers = brokerAssignments.filter((a) => enterprisePropertyIds.has(a.propertyId) && a.status === 'Active')

  const stats = [
    { label: 'Properties', value: String(totalProperties), icon: Building2 },
    { label: 'Total Units', value: String(totalUnits), icon: Home },
    { label: 'Occupancy', value: `${occupancyRate}%`, icon: TrendingUp },
    { label: 'Revenue', value: `Rs. ${totalRevenue.toLocaleString('en-IN')}`, icon: CreditCard },
    { label: 'Open Tickets', value: String(openTickets.length), icon: Wrench },
    { label: 'Active Tenants', value: String(activeLeases.length), icon: Users },
    { label: 'Visits', value: String(scheduledVisits.length), icon: Calendar },
    { label: 'Applications', value: String(totalApplications.length), icon: FileText },
  ]

  // Recent payments
  const recentPayments = payments.filter((p) => p.ownerId === ownerId || (p.propertyId && enterprisePropertyIds.has(p.propertyId))).slice(0, 5)

  // Quick actions
  const [showUnitDialog, setShowUnitDialog] = useState(false)
  const [dialogProperty, setDialogProperty] = useState('')
  const [dialogBlock, setDialogBlock] = useState('')

  // Property groups for dialog
  const propertyGroupsForDialog = useMemo(() => {
    const groups: Record<string, typeof enterpriseBlocks> = {}
    enterpriseBlocks.filter((b) => b.enterpriseBlock).forEach((block) => {
      const parts = block.title.split(' - Block ')
      const propName = parts.length > 1 ? parts[0] : block.title.split(' - ')[0] ?? block.title
      if (!groups[propName]) groups[propName] = []
      groups[propName].push(block)
    })
    return groups
  }, [enterpriseBlocks])
  const dialogPropertyNames = Object.keys(propertyGroupsForDialog)
  const dialogBlocks = propertyGroupsForDialog[dialogProperty] ?? []

  const handleAddUnitAction = () => {
    if (enterpriseBlocks.filter((b) => b.enterpriseBlock).length === 0) {
      // No blocks at all — navigate to register property
      navigate(`${ROUTES.ENTERPRISE.PORTFOLIO}/register`)
      return
    }
    setShowUnitDialog(true)
    setDialogProperty(dialogPropertyNames[0] ?? '')
    setDialogBlock('')
  }

  const setStoreProperty = useEnterpriseStore((s) => s.setSelectedProperty)
  const setStoreBlock = useEnterpriseStore((s) => s.setSelectedBlockId)

  const handleDialogConfirm = () => {
    const selectedBlock = dialogBlocks.find((b) => b.id === dialogBlock) ?? dialogBlocks[0]
    if (!selectedBlock) return
    // Update the shared store so sidebar switches to this property/block
    setStoreProperty(dialogProperty)
    setStoreBlock(selectedBlock.id)
    setShowUnitDialog(false)
    navigate(`${ROUTES.ENTERPRISE.PORTFOLIO}/add-unit`)
  }

  const quickActions = [
    { label: 'Add Property', icon: Building2, action: () => navigate(`${ROUTES.ENTERPRISE.PORTFOLIO}/register`) },
    { label: 'Add Unit', icon: Plus, action: handleAddUnitAction },
    { label: 'View Leases', icon: FileText, action: () => navigate(`${ROUTES.ENTERPRISE.ROOT}/leases`) },
    { label: 'Maintenance', icon: Wrench, action: () => navigate(`${ROUTES.ENTERPRISE.ROOT}/maintenance`) },
    { label: 'Assign Broker', icon: Users, action: () => navigate(`${ROUTES.ENTERPRISE.ROOT}/assignments`) },
    { label: 'Finance', icon: CreditCard, action: () => navigate(`${ROUTES.ENTERPRISE.ROOT}/finance`) },
  ]

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold text-[#0f172a] tracking-tight">Enterprise Dashboard</h1>
          <p className="mt-1 text-[14px] text-text-muted">Overview of your enterprise portfolio performance.</p>
        </div>
        <button onClick={() => navigate(`${ROUTES.ENTERPRISE.PORTFOLIO}/register`)} className="inline-flex items-center gap-2 rounded-xl bg-[#0f172a] px-5 py-3 text-[13px] font-bold text-white hover:bg-slate-800">
          <Plus size={16} /> Add Property
        </button>
      </div>

      {/* Stats Grid */}
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
            </div>
          )
        })}
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left */}
        <div className="space-y-6">
          {/* Portfolio Status */}
          <div className="rounded-xl border border-outline bg-white p-6 shadow-sm">
            <h2 className="text-[15px] font-bold text-[#0f172a] mb-4">Portfolio Status</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-xl bg-green-50 p-4"><p className="text-[24px] font-extrabold text-green-700">{activeLeases.length}</p><p className="text-[11px] font-bold text-green-600">Active Leases</p></div>
              <div className="rounded-xl bg-amber-50 p-4"><p className="text-[24px] font-extrabold text-amber-700">{pendingLeases.length}</p><p className="text-[11px] font-bold text-amber-600">Pending</p></div>
              <div className="rounded-xl bg-blue-50 p-4"><p className="text-[24px] font-extrabold text-blue-700">{activeBrokers.length}</p><p className="text-[11px] font-bold text-blue-600">Brokers Assigned</p></div>
            </div>
            {totalUnits > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-[12px] text-text-muted mb-1"><span>Occupancy Rate</span><span className="font-bold text-[#0f172a]">{occupancyRate}%</span></div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full bg-[#0f172a]" style={{ width: `${occupancyRate}%` }} /></div>
              </div>
            )}
          </div>

          {/* Recent Payments */}
          <div className="rounded-xl border border-outline bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline">
              <h2 className="text-[15px] font-bold text-[#0f172a]">Recent Payments</h2>
              <button onClick={() => navigate(`${ROUTES.ENTERPRISE.ROOT}/finance`)} className="text-[12px] font-semibold text-primary hover:underline">View All</button>
            </div>
            {recentPayments.length > 0 ? (
              <div className="divide-y divide-outline">
                {recentPayments.map((p) => {
                  const prop = allProperties.find((pr) => pr.id === p.propertyId)
                  return (
                    <div key={p.id} className="flex items-center justify-between px-6 py-3">
                      <div>
                        <p className="text-[13px] font-semibold text-[#0f172a]">{p.category} - {prop?.title ?? 'Unit'}</p>
                        <p className="text-[11px] text-text-muted">{p.paidAt}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[14px] font-bold text-[#0f172a]">{p.amountDisplay}</p>
                        <span className={`text-[10px] font-bold ${p.status === 'Successful' ? 'text-green-700' : 'text-amber-700'}`}>{p.status}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="px-6 py-8 text-center text-[13px] text-text-muted">No payments yet.</div>
            )}
          </div>

          {/* Open Tickets */}
          {openTickets.length > 0 && (
            <div className="rounded-xl border border-outline bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[15px] font-bold text-[#0f172a]">Open Tickets</h2>
                <button onClick={() => navigate(`${ROUTES.ENTERPRISE.ROOT}/maintenance`)} className="text-[12px] font-semibold text-primary hover:underline">View All</button>
              </div>
              <div className="space-y-3">
                {openTickets.slice(0, 4).map((t) => (
                  <div key={t.id} className="flex items-start gap-3">
                    <div className={`h-2.5 w-2.5 mt-1.5 rounded-full shrink-0 ${t.priority === 'High' || t.priority === 'Urgent' ? 'bg-red-500' : t.priority === 'Medium' ? 'bg-amber-500' : 'bg-slate-400'}`} />
                    <div className="min-w-0"><p className="text-[13px] font-semibold text-[#0f172a] truncate">{t.category} - {t.unit}</p><p className="text-[11px] text-text-muted truncate">{t.problem}</p></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Pending Payments */}
          {pendingPayments.length > 0 && (
            <div className="rounded-xl border border-outline bg-white p-5 shadow-sm">
              <h3 className="text-[13px] font-bold text-[#0f172a] mb-3">Pending Payments</h3>
              <div className="space-y-2">
                {pendingPayments.slice(0, 4).map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-outline last:border-0">
                    <p className="text-[12px] font-semibold text-[#0f172a] truncate">{p.category}</p>
                    <span className="text-[12px] font-bold text-amber-700">{p.amountDisplay}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scheduled Visits */}
          {scheduledVisits.length > 0 && (
            <div className="rounded-xl border border-outline bg-white p-5 shadow-sm">
              <h3 className="text-[13px] font-bold text-[#0f172a] mb-3">Upcoming Visits ({scheduledVisits.length})</h3>
              <div className="space-y-2">
                {scheduledVisits.slice(0, 4).map((a) => {
                  const tenant = allProperties.find((p) => p.id === a.propertyId)
                  return (
                    <div key={a.id} className="rounded-lg bg-canvas-alt p-3">
                      <p className="text-[12px] font-bold text-[#0f172a]">{tenant?.title ?? 'Unit'}</p>
                      <p className="text-[10px] text-text-muted">{a.scheduledVisit?.date} at {a.scheduledVisit?.time}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Properties List */}
          <div className="rounded-xl border border-outline bg-white p-5 shadow-sm">
            <h3 className="text-[13px] font-bold text-[#0f172a] mb-3">Your Properties ({totalProperties})</h3>
            <div className="space-y-2">
              {enterpriseBlocks.slice(0, 5).map((b) => (
                <div key={b.id} className="flex items-center justify-between py-2 border-b border-outline last:border-0">
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-[#0f172a] truncate">{b.title}</p>
                    <p className="text-[10px] text-text-muted">{b.enterpriseBlock?.units.length ?? 0} units</p>
                  </div>
                  <span className="text-[11px] font-bold text-primary">{b.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-[15px] font-bold text-[#0f172a] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <button key={action.label} type="button" onClick={action.action} className="flex flex-col items-center gap-2 rounded-xl border border-outline bg-white p-5 shadow-sm hover:bg-hover-light hover:shadow-md transition-all">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-canvas-alt"><Icon size={18} className="text-[#0f172a]" /></div>
                <span className="text-[11px] font-semibold text-[#0f172a] text-center">{action.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Maintenance + Recent Activity + Chats */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Maintenance Summary */}
        <div className="rounded-xl border border-outline bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-bold text-[#0f172a] flex items-center gap-1.5"><Wrench size={13} /> Maintenance</h3>
            <button onClick={() => navigate(`${ROUTES.ENTERPRISE.ROOT}/maintenance`)} className="text-[11px] font-semibold text-primary hover:underline">View</button>
          </div>
          <div className="space-y-2">
            {openTickets.length > 0 ? openTickets.slice(0, 3).map((t) => (
              <div key={t.id} className="flex items-center gap-2 py-1.5 border-b border-outline last:border-0">
                <div className={`h-2 w-2 rounded-full shrink-0 ${t.priority === 'High' || t.priority === 'Urgent' ? 'bg-red-500' : 'bg-amber-500'}`} />
                <p className="text-[12px] text-[#0f172a] truncate flex-1">{t.category} - {t.unit}</p>
              </div>
            )) : <p className="text-[12px] text-text-muted italic">No open tickets.</p>}
          </div>
        </div>

        {/* Recent Activity - grouped by property/unit */}
        <div className="rounded-xl border border-outline bg-white p-5 shadow-sm">
          <h3 className="text-[13px] font-bold text-[#0f172a] mb-3">Recent Activity</h3>
          <div className="space-y-3 max-h-[280px] overflow-y-auto">
            {(() => {
              // Build activity feed from real data
              const activities: { id: string; icon: string; title: string; property: string; time: string; type: string }[] = []
              // Broker assigned
              activeBrokers.forEach((a) => {
                const broker = usePrototypeStore.getState().users.find((u) => u.id === a.brokerId)
                const prop = allProperties.find((p) => p.id === a.propertyId)
                activities.push({ id: `broker-${a.id}`, icon: '🤝', title: `Broker ${broker?.firstName ?? ''} ${broker?.lastName ?? ''} assigned`, property: prop?.title ?? 'Unit', time: a.createdAt, type: 'broker' })
              })
              // Leads (interest shown)
              applications.filter((a) => enterprisePropertyIds.has(a.propertyId) && a.status !== 'rejected').forEach((a) => {
                const tenant = usePrototypeStore.getState().users.find((u) => u.id === a.tenantId)
                const prop = allProperties.find((p) => p.id === a.propertyId)
                if (a.status === 'interest_shown') activities.push({ id: `lead-${a.id}`, icon: '👋', title: `New lead: ${tenant?.firstName ?? ''} ${tenant?.lastName ?? ''}`, property: prop?.title ?? 'Unit', time: a.createdAt, type: 'lead' })
                if (a.status === 'active') activities.push({ id: `onboard-${a.id}`, icon: '✅', title: `Tenant onboarded: ${tenant?.firstName ?? ''} ${tenant?.lastName ?? ''}`, property: prop?.title ?? 'Unit', time: a.updatedAt, type: 'onboard' })
              })
              // Payments received
              recentPayments.filter((p) => p.status === 'Successful').forEach((p) => {
                const prop = allProperties.find((pr) => pr.id === p.propertyId)
                activities.push({ id: `pay-${p.id}`, icon: '💰', title: `${p.category} received: ${p.amountDisplay}`, property: prop?.title ?? 'Unit', time: p.paidAtIso, type: 'payment' })
              })
              // Sort by time (newest first)
              activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
              if (activities.length === 0) return <p className="text-[12px] text-text-muted italic">No recent activity.</p>
              return activities.slice(0, 8).map((act) => (
                <div key={act.id} className="flex items-start gap-2.5 py-1.5 border-b border-outline last:border-0">
                  <span className="text-[14px] shrink-0 mt-0.5">{act.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-semibold text-[#0f172a] truncate">{act.title}</p>
                    <p className="text-[10px] text-text-muted truncate">{act.property}</p>
                  </div>
                  <span className="text-[9px] text-text-muted shrink-0 whitespace-nowrap">{new Date(act.time).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                </div>
              ))
            })()}
          </div>
        </div>

        {/* Active Brokers / Chats */}
        <div className="rounded-xl border border-outline bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-bold text-[#0f172a]">Active Brokers</h3>
            <button onClick={() => navigate(`${ROUTES.ENTERPRISE.ROOT}/brokers`)} className="text-[11px] font-semibold text-primary hover:underline">View</button>
          </div>
          <div className="space-y-2">
            {activeBrokers.length > 0 ? activeBrokers.slice(0, 4).map((a) => {
              const broker = allProperties.length > 0 ? usePrototypeStore.getState().users.find((u) => u.id === a.brokerId) : null
              const prop = allProperties.find((p) => p.id === a.propertyId)
              return (
                <div key={a.id} className="flex items-center gap-2 py-1.5 border-b border-outline last:border-0">
                  <div className="h-6 w-6 rounded-full bg-slate-200 shrink-0 flex items-center justify-center text-[9px] font-bold">{broker?.firstName?.[0]}{broker?.lastName?.[0]}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-[#0f172a] truncate">{broker ? `${broker.firstName} ${broker.lastName}` : 'Broker'}</p>
                    <p className="text-[9px] text-text-muted truncate">{prop?.title ?? 'Unit'}</p>
                  </div>
                </div>
              )
            }) : <p className="text-[12px] text-text-muted italic">No brokers assigned yet.</p>}
          </div>
        </div>
      </div>

      {/* Add Unit Dialog */}
      {showUnitDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-sm" onClick={() => setShowUnitDialog(false)} />
          <div className="relative w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-outline px-6 py-5">
              <div>
                <h2 className="text-[18px] font-bold text-[#0f172a]">Add Unit</h2>
                <p className="mt-1 text-[12px] text-text-muted">Select the property and block to add a unit to.</p>
              </div>
              <button type="button" onClick={() => setShowUnitDialog(false)} className="rounded-lg p-2 text-text-muted hover:bg-hover-light"><X size={18} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="text-[12px] font-bold text-text-primary">Property</label>
                <select value={dialogProperty} onChange={(e) => { setDialogProperty(e.target.value); setDialogBlock('') }} className="mt-1.5 h-11 w-full rounded-lg border border-outline bg-white px-3 text-[14px] font-semibold text-[#0f172a] outline-none focus:border-primary">
                  {dialogPropertyNames.map((name) => <option key={name} value={name}>{name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[12px] font-bold text-text-primary">Block</label>
                <select value={dialogBlock} onChange={(e) => setDialogBlock(e.target.value)} className="mt-1.5 h-11 w-full rounded-lg border border-outline bg-white px-3 text-[14px] font-semibold text-[#0f172a] outline-none focus:border-primary">
                  {dialogBlocks.map((b) => <option key={b.id} value={b.id}>{b.enterpriseBlock?.blockName ? `Block ${b.enterpriseBlock.blockName}` : b.title}</option>)}
                </select>
                {dialogBlocks.length === 0 && <p className="mt-1 text-[11px] text-amber-700">This property has no blocks. Add a block first.</p>}
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-outline px-6 py-4">
              <button type="button" onClick={() => setShowUnitDialog(false)} className="rounded-lg border border-outline px-5 py-2.5 text-[13px] font-bold text-[#0f172a]">Cancel</button>
              <button type="button" onClick={handleDialogConfirm} disabled={dialogBlocks.length === 0} className="rounded-lg bg-[#0f172a] px-5 py-2.5 text-[13px] font-bold text-white hover:bg-slate-800 disabled:opacity-50">Continue to Add Unit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
