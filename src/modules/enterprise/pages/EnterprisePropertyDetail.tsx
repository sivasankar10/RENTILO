import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Clock3, MapPin, MessageSquare, Phone, Wrench } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { ROUTES } from '@shared/constants/routes'
import { usePrototypeStore } from '@shared/store/prototypeStore'
import { useOwnerMaintenanceStore } from '@modules/owner/store/maintenanceStore'
import { useLeaseChatStore } from '@shared/store/leaseChatStore'
import { useAuth } from '@shared/hooks/useAuth'
import { useEnterpriseContext } from '../hooks/useEnterpriseContext'

export function EnterprisePropertyDetail() {
  const navigate = useNavigate()
  const { propertyId } = useParams<{ propertyId: string }>()
  const { enterpriseBlocks } = useEnterpriseContext()
  const allProperties = usePrototypeStore((s) => s.properties)
  const prototypeApplications = usePrototypeStore((s) => s.applications)
  const prototypeUsers = usePrototypeStore((s) => s.users)
  const tenantSavedListings = usePrototypeStore((s) => s.tenantSavedListings)
  const listings = usePrototypeStore((s) => s.listings)
  const maintenanceTickets = useOwnerMaintenanceStore((s) => s.tickets)
  const ensureLeaseThread = useLeaseChatStore((s) => s.ensureThread)
  const { user } = useAuth()
  const ownerId = user?.id ?? ''

  const currentBlock = enterpriseBlocks.find((b) => b.id === propertyId)
  const blockData = currentBlock?.enterpriseBlock
  const units = blockData?.units ?? []

  // Find individual unit properties (created via Add Unit)
  const unitProperties = useMemo(
    () => allProperties.filter((p) => p.id.startsWith(`property-unit-${propertyId}`)),
    [allProperties, propertyId],
  )

  const [selectedUnitId, setSelectedUnitId] = useState(units[0]?.unitId ?? '')
  const selectedUnit = units.find((u) => u.unitId === selectedUnitId)

  // Find the individual property for the selected unit (match by stored propertyId)
  const selectedUnitProperty = useMemo(() => {
    if (!selectedUnit) return null
    // First try matching by propertyId stored on the unit (precise)
    if (selectedUnit.propertyId) {
      return allProperties.find((p) => p.id === selectedUnit.propertyId) ?? null
    }
    // Fallback: match by unit number in the unit properties list
    return unitProperties.find((p) => p.unit === selectedUnit.unitNumber) ?? null
  }, [selectedUnit, unitProperties, allProperties])

  // The property to display details for (unit property if available, else block)
  const displayProperty = selectedUnitProperty ?? currentBlock

  // Interested leads for the selected unit property
  const interestedLeads = useMemo(() => {
    const pid = selectedUnitProperty?.id ?? propertyId
    return prototypeApplications
      .filter((app) => app.propertyId === pid && !['active', 'rejected', 'payment_completed'].includes(app.status))
      .map((app) => {
        const tenant = prototypeUsers.find((u) => u.id === app.tenantId)
        return { id: app.id, name: tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Unknown', phone: tenant?.phone ?? '', avatar: tenant?.avatar ?? '', status: app.status }
      })
  }, [prototypeApplications, prototypeUsers, selectedUnitProperty?.id, propertyId])

  // Scheduled visits
  const scheduledVisits = useMemo(() => {
    const pid = selectedUnitProperty?.id ?? propertyId
    return prototypeApplications
      .filter((app) => app.propertyId === pid && app.scheduledVisit && ['visit_scheduled', 'visit_confirmed'].includes(app.status))
      .map((app) => {
        const tenant = prototypeUsers.find((u) => u.id === app.tenantId)
        return { id: app.id, tenantName: tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Unknown', phone: tenant?.phone ?? '', avatar: tenant?.avatar ?? '', date: app.scheduledVisit!.date, time: app.scheduledVisit!.time }
      })
  }, [prototypeApplications, prototypeUsers, selectedUnitProperty?.id, propertyId])

  const propertyTickets = maintenanceTickets.filter((t) => t.propertyId === (selectedUnitProperty?.id ?? propertyId))

  // Check for active lease on this unit
  const leases = usePrototypeStore((s) => s.leases)
  const activeLease = useMemo(() => {
    const pid = selectedUnitProperty?.id
    if (!pid) return null
    return leases.find((l) => l.propertyId === pid && l.status === 'active') ?? null
  }, [leases, selectedUnitProperty?.id])

  const pendingLease = useMemo(() => {
    const pid = selectedUnitProperty?.id
    if (!pid) return null
    return leases.find((l) => l.propertyId === pid && l.status === 'pending_owner_onboarding') ?? null
  }, [leases, selectedUnitProperty?.id])

  const currentTenant = useMemo(() => {
    const lease = activeLease ?? pendingLease
    if (!lease) return null
    const tenant = prototypeUsers.find((u) => u.id === lease.tenantId)
    if (!tenant) return null
    return { id: tenant.id, name: `${tenant.firstName} ${tenant.lastName}`, phone: tenant.phone, email: tenant.email, avatar: tenant.avatar ?? '', leaseStatus: lease.status, accessKey: lease.accessKey }
  }, [activeLease, pendingLease, prototypeUsers])

  const handleChatWithTenant = (tenantId: string, tenantName: string, tenantAvatar: string) => {
    if (!selectedUnitProperty) return
    // Ensure a chat thread exists for this lease/application
    const applicationId = prototypeApplications.find(
      (app) => app.propertyId === selectedUnitProperty.id && app.tenantId === tenantId && app.status === 'active'
    )?.id ?? `chat-${tenantId}-${selectedUnitProperty.id}`

    ensureLeaseThread({
      onboardingId: applicationId,
      ownerId,
      tenantId,
      tenantName,
      tenantAvatar,
      ownerName: user ? `${user.firstName} ${user.lastName}` : 'Enterprise Owner',
      propertyName: selectedUnitProperty.title,
      unit: selectedUnitProperty.unit,
      address: selectedUnitProperty.address,
      monthlyRent: selectedUnitProperty.price,
    })
    navigate(`${ROUTES.ENTERPRISE.ROOT}/messages`)
  }

  if (!currentBlock) {
    return (<div className="py-20 text-center"><h2 className="text-[20px] font-bold text-[#0f172a]">Property not found</h2><button type="button" onClick={() => navigate(ROUTES.ENTERPRISE.PORTFOLIO)} className="mt-4 text-primary font-semibold hover:underline">Back to Portfolio</button></div>)
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <button type="button" onClick={() => navigate(ROUTES.ENTERPRISE.PORTFOLIO)} className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-widest text-primary hover:underline"><ArrowLeft size={14} /> Portfolio</button>
          <h1 className="mt-2 text-[26px] font-extrabold text-[#0f172a] tracking-tight">{currentBlock.title}</h1>
          <p className="mt-1 flex items-center gap-2 text-[13px] text-text-muted"><MapPin size={13} /> {currentBlock.address}</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => navigate(`${ROUTES.ENTERPRISE.PORTFOLIO}/edit-block/${propertyId}`)} className="rounded-xl border border-outline bg-white px-4 py-2.5 text-[12px] font-bold text-[#0f172a] hover:bg-hover-light">Edit Block</button>
          {selectedUnitProperty && <button type="button" onClick={() => navigate(`${ROUTES.ENTERPRISE.PORTFOLIO}/edit-unit/${selectedUnitProperty.id}`)} className="rounded-xl bg-[#0f172a] px-4 py-2.5 text-[12px] font-bold text-white hover:bg-slate-800">Edit Unit</button>}
        </div>
      </div>

      {/* Unit Selector */}
      {units.length > 0 && (
        <div className="rounded-xl border border-outline bg-white p-5 shadow-sm">
          <h2 className="text-[15px] font-bold text-[#0f172a] mb-4">Units ({units.length})</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
            {units.map((unit) => {
              // Check if this unit has an active lease
              const unitPropId = unit.propertyId
              const hasLease = unitPropId ? leases.some((l) => l.propertyId === unitPropId && (l.status === 'active' || l.status === 'pending_owner_onboarding')) : false
              const status = hasLease ? 'Occupied' : unit.status
              return (
                <button key={unit.unitId} type="button" onClick={() => setSelectedUnitId(unit.unitId)} className={cn('rounded-lg border p-3 text-center transition-all', selectedUnitId === unit.unitId ? 'border-primary ring-2 ring-primary/20 bg-primary-50' : 'border-outline hover:bg-hover-light')}>
                  <p className="text-[14px] font-bold text-[#0f172a]">{unit.unitNumber}</p>
                  <span className={cn('mt-1 inline-block rounded-pill px-2 py-0.5 text-[9px] font-bold', status === 'Vacant' ? 'bg-amber-50 text-amber-700' : status === 'Occupied' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600')}>{status}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Main Content - Property View + Sidebar */}
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        {/* Left - Property Detail (same as tenant view) */}
        <div className="space-y-6">
          {/* Gallery */}
          {displayProperty && (
            <div className="rounded-xl border border-outline bg-white p-4 shadow-sm">
              <img src={displayProperty.image} alt={displayProperty.title} className="h-[360px] w-full rounded-xl object-cover" />
              {displayProperty.gallery.length > 1 && (
                <div className="mt-3 grid grid-cols-4 gap-3">
                  {displayProperty.gallery.slice(1, 5).map((img, i) => (
                    <img key={i} src={img} alt={`Gallery ${i + 2}`} className="h-24 w-full rounded-lg object-cover" />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Highlights */}
          {displayProperty && displayProperty.highlights.length > 0 && (
            <div className="rounded-xl border border-outline bg-white p-6 shadow-sm">
              <h2 className="text-[15px] font-bold text-[#0f172a] mb-4">Property Highlights</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {displayProperty.highlights.map((h) => (
                  <div key={h.label}><p className="text-[10px] font-bold uppercase text-text-muted">{h.label}</p><p className="mt-1 text-[14px] font-bold text-[#0f172a]">{h.value}</p></div>
                ))}
              </div>
            </div>
          )}

          {/* Overview */}
          {displayProperty && (
            <div className="rounded-xl border border-outline bg-white p-6 shadow-sm">
              <h2 className="text-[15px] font-bold text-[#0f172a] mb-4">Overview</h2>
              {displayProperty.overview.map((p, i) => (<p key={i} className="text-[14px] text-text-muted leading-relaxed mb-3 last:mb-0">{p}</p>))}
              {displayProperty.overviewSpecs.length > 0 && (
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-outline pt-5">
                  {displayProperty.overviewSpecs.map((s) => (<div key={s.label}><p className="text-[10px] font-bold uppercase text-text-muted">{s.label}</p><p className="mt-1 text-[13px] font-semibold text-[#0f172a]">{s.value}</p></div>))}
                </div>
              )}
            </div>
          )}

          {/* What's Nearby */}
          {displayProperty && (displayProperty.nearby.essentials.length > 0 || displayProperty.nearby.transit.busStations.length > 0 || displayProperty.nearby.utility.length > 0) && (
            <div className="rounded-xl border border-outline bg-white p-6 shadow-sm">
              <h2 className="text-[15px] font-bold text-[#0f172a] mb-4">What's Nearby</h2>
              <div className="grid gap-6 sm:grid-cols-3">
                {displayProperty.nearby.transit.busStations.length > 0 && (<div><p className="text-[11px] font-bold uppercase text-text-muted mb-3">Transit</p>{[...displayProperty.nearby.transit.busStations, ...displayProperty.nearby.transit.trainStations, ...displayProperty.nearby.transit.airport].map((p, i) => (<div key={i} className="flex justify-between py-2 border-b border-outline last:border-0"><span className="text-[13px] text-[#0f172a]">{p.name}</span><span className="text-[11px] text-text-muted">{p.distance}</span></div>))}</div>)}
                {displayProperty.nearby.essentials.length > 0 && (<div><p className="text-[11px] font-bold uppercase text-text-muted mb-3">Essentials</p>{displayProperty.nearby.essentials.map((p, i) => (<div key={i} className="flex justify-between py-2 border-b border-outline last:border-0"><span className="text-[13px] text-[#0f172a]">{p.name}</span><span className="text-[11px] text-text-muted">{p.distance}</span></div>))}</div>)}
                {displayProperty.nearby.utility.length > 0 && (<div><p className="text-[11px] font-bold uppercase text-text-muted mb-3">Utility</p>{displayProperty.nearby.utility.map((p, i) => (<div key={i} className="flex justify-between py-2 border-b border-outline last:border-0"><span className="text-[13px] text-[#0f172a]">{p.name}</span><span className="text-[11px] text-text-muted">{p.distance}</span></div>))}</div>)}
              </div>
            </div>
          )}

          {/* Amenities */}
          {displayProperty && displayProperty.amenities.length > 0 && (
            <div className="rounded-xl border border-outline bg-white p-6 shadow-sm">
              <h2 className="text-[15px] font-bold text-[#0f172a] mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {displayProperty.amenities.map((a) => (<div key={a.label} className="flex items-center gap-3 rounded-lg bg-canvas-alt p-3"><span className="text-[16px]">{a.icon === 'wifi' ? '📶' : a.icon === 'security' ? '🛡️' : a.icon === 'fitness_center' ? '🏋️' : a.icon === 'pool' ? '🏊' : a.icon === 'local_parking' ? '🅿️' : a.icon === 'ac_unit' ? '❄️' : a.icon === 'thermostat' ? '🌡️' : a.icon === 'lock' ? '🔒' : a.icon === 'local_laundry_service' ? '🧺' : a.icon === 'kitchen' ? '🍽️' : '✨'}</span><span className="text-[13px] font-semibold text-[#0f172a]">{a.label}</span></div>))}
              </div>
            </div>
          )}

          {/* Property Rules */}
          {displayProperty && displayProperty.rules.length > 0 && (
            <div className="rounded-xl border border-outline bg-white p-6 shadow-sm">
              <h2 className="text-[15px] font-bold text-[#0f172a] mb-4">Property Rules</h2>
              <div className="rounded-lg border border-outline overflow-hidden">
                <table className="w-full text-left">
                  <thead><tr className="bg-canvas-alt"><th className="px-4 py-3 text-[10px] font-bold uppercase text-text-muted">Rule</th><th className="px-4 py-3 text-[10px] font-bold uppercase text-text-muted">Category</th></tr></thead>
                  <tbody>{displayProperty.rules.map((r, i) => (<tr key={i} className="border-t border-outline"><td className="px-4 py-3 text-[13px] text-[#0f172a]">{r.rule}</td><td className="px-4 py-3"><span className="rounded-pill bg-primary-50 px-2.5 py-1 text-[10px] font-bold text-primary">{r.category}</span></td></tr>))}</tbody>
                </table>
              </div>
            </div>
          )}

          {/* Maintenance Tickets */}
          {currentTenant && propertyTickets.length > 0 && (
            <div className="rounded-xl border border-outline bg-white p-5 shadow-sm">
              <h3 className="text-[15px] font-bold text-[#0f172a] flex items-center gap-2 mb-4"><Wrench size={16} /> Maintenance Tickets</h3>
              <div className="space-y-3">
                {propertyTickets.map((ticket) => (<div key={ticket.id} className="flex items-start gap-3 rounded-lg border border-outline p-3"><div className={cn('h-2.5 w-2.5 mt-1.5 rounded-full shrink-0', ticket.priority === 'Urgent' || ticket.priority === 'High' ? 'bg-red-500' : ticket.priority === 'Medium' ? 'bg-amber-500' : 'bg-slate-400')} /><div className="min-w-0 flex-1"><p className="text-[13px] font-semibold text-[#0f172a]">{ticket.category}</p><p className="text-[11px] text-text-muted truncate">{ticket.problem}</p><span className={cn('mt-1 inline-block rounded-pill px-2 py-0.5 text-[9px] font-bold', ticket.status === 'Open' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700')}>{ticket.status}</span></div></div>))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar — conditional: tenant info OR schedules/leads */}
        <aside className="space-y-5">
          {/* Price Card */}
          <div className="rounded-xl border border-outline bg-white p-5 shadow-sm">
            <p className="text-[22px] font-extrabold text-[#0f172a]">{displayProperty?.price ?? currentBlock.price}<span className="ml-1 text-[13px] font-semibold text-text-muted">{displayProperty?.pricePeriod ?? '/ mo'}</span></p>
            <p className="text-[11px] text-text-muted">Deposit: {displayProperty?.deposit ?? currentBlock.deposit}</p>
            <div className="mt-4 grid grid-cols-3 gap-3 border-t border-outline pt-4 text-center">
              <div><p className="text-[16px] font-bold text-[#0f172a]">{(() => { const pid = selectedUnitProperty?.id; if (!pid) return displayProperty?.views ?? 0; const listing = listings.find((l) => l.propertyId === pid); return listing ? (displayProperty?.views ?? 0) + prototypeApplications.filter((a) => a.propertyId === pid).length : displayProperty?.views ?? 0 })()}</p><p className="text-[9px] text-text-muted">Views</p></div>
              <div><p className="text-[16px] font-bold text-[#0f172a]">{(() => { const pid = selectedUnitProperty?.id; if (!pid) return displayProperty?.shortlists ?? 0; const listing = listings.find((l) => l.propertyId === pid); return listing ? tenantSavedListings.filter((s) => s.listingId === listing.id).length : displayProperty?.shortlists ?? 0 })()}</p><p className="text-[9px] text-text-muted">Shortlists</p></div>
              <div><p className="text-[16px] font-bold text-[#0f172a]">{(() => { const pid = selectedUnitProperty?.id ?? propertyId; return prototypeApplications.filter((a) => a.propertyId === pid && a.status !== 'rejected').length })()}</p><p className="text-[9px] text-text-muted">Leads</p></div>
            </div>
          </div>

          {/* If tenant is onboarded: show tenant info in sidebar */}
          {currentTenant ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-5 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-green-600">
                {currentTenant.leaseStatus === 'active' ? 'Current Tenant' : 'Pending Onboarding'}
              </p>
              <div className="mt-3 flex items-center gap-4">
                {currentTenant.avatar ? <img src={currentTenant.avatar} alt="" className="h-12 w-12 rounded-full object-cover" /> : <div className="h-12 w-12 rounded-full bg-green-200 flex items-center justify-center text-[14px] font-bold text-green-800">{currentTenant.name[0]}</div>}
                <div>
                  <h4 className="text-[16px] font-bold text-[#0f172a]">{currentTenant.name}</h4>
                  <p className="text-[12px] text-text-muted">{currentTenant.phone}</p>
                  <p className="text-[12px] text-text-muted">{currentTenant.email}</p>
                  {currentTenant.accessKey && <p className="mt-1 text-[12px] font-semibold text-green-700">Access Key: {currentTenant.accessKey}</p>}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button type="button" onClick={() => handleChatWithTenant(currentTenant.id, currentTenant.name, currentTenant.avatar)} className="inline-flex items-center gap-2 rounded-lg bg-[#0f172a] px-4 py-2.5 text-[12px] font-bold text-white"><MessageSquare size={14} /> Chat</button>
                <a href={`tel:${currentTenant.phone}`} className="inline-flex items-center gap-2 rounded-lg border border-outline bg-white px-4 py-2.5 text-[12px] font-bold text-[#0f172a]"><Phone size={14} /> Call</a>
              </div>
            </div>
          ) : (
            <>
              {/* Scheduled Visits */}
              <div className="rounded-xl border border-outline bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[12px] font-bold uppercase tracking-widest text-text-muted">Scheduled Visits</p>
                  <span className="rounded-pill bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-[#0f172a]">{scheduledVisits.length}</span>
                </div>
                {scheduledVisits.length > 0 ? (
                  <div className="space-y-3">{scheduledVisits.slice(0, 5).map((v) => (<div key={v.id} className="rounded-lg border border-outline p-3"><div className="flex items-center gap-3">{v.avatar ? <img src={v.avatar} alt="" className="h-9 w-9 rounded-full object-cover" /> : <div className="h-9 w-9 rounded-full bg-slate-200" />}<div className="min-w-0 flex-1"><p className="text-[12px] font-bold text-[#0f172a] truncate">{v.tenantName}</p><p className="text-[10px] text-text-muted flex items-center gap-1"><Clock3 size={10} /> {v.date} at {v.time}</p></div></div></div>))}</div>
                ) : (<p className="text-[12px] text-text-muted italic">No visits scheduled.</p>)}
              </div>

              {/* Interested Tenants */}
              <div className="rounded-xl border border-outline bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[12px] font-bold uppercase tracking-widest text-text-muted">Interested Tenants</p>
                  <span className="rounded-pill bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-[#0f172a]">{interestedLeads.length}</span>
                </div>
                {interestedLeads.length > 0 ? (
                  <div className="space-y-3">{interestedLeads.slice(0, 5).map((l) => (<div key={l.id} className="rounded-lg border border-outline p-3"><div className="flex items-center gap-3">{l.avatar ? <img src={l.avatar} alt="" className="h-9 w-9 rounded-full object-cover" /> : <div className="h-9 w-9 rounded-full bg-slate-200" />}<div className="min-w-0 flex-1"><p className="text-[12px] font-bold text-[#0f172a] truncate">{l.name}</p><p className="text-[10px] text-text-muted">{l.phone}</p></div><button type="button" onClick={() => handleChatWithTenant(l.id, l.name, l.avatar)} className="rounded-lg bg-[#0f172a] px-3 py-1.5 text-[10px] font-bold text-white">Chat</button></div></div>))}</div>
                ) : (<p className="text-[12px] text-text-muted italic">No interested tenants yet.</p>)}
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  )
}
