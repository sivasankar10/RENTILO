import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Bath, Bed, Calendar, MapPin, MessageSquare, Phone, Ruler, Users } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { ROUTES } from '@shared/constants/routes'
import { usePrototypeStore } from '@shared/store/prototypeStore'

export function AdminBrokerDealDetail() {
  const navigate = useNavigate()
  const { assignmentId } = useParams<{ assignmentId: string }>()

  const assignments = usePrototypeStore((s) => s.brokerAssignments)
  const users = usePrototypeStore((s) => s.users)
  const properties = usePrototypeStore((s) => s.properties)
  const applications = usePrototypeStore((s) => s.applications)

  const assignment = assignments.find((a) => a.id === assignmentId)
  const broker = assignment ? users.find((u) => u.id === assignment.brokerId) : null
  const property = assignment ? properties.find((p) => p.id === assignment.propertyId) : null
  const owner = property ? users.find((u) => u.id === property.ownerId) : null

  // Leads for this property assigned to this broker
  const propertyLeads = useMemo(() =>
    applications.filter((app) =>
      app.propertyId === assignment?.propertyId &&
      !['active', 'rejected', 'payment_completed'].includes(app.status)
    ),
    [applications, assignment?.propertyId],
  )

  // Scheduled visits
  const scheduledVisits = useMemo(() =>
    propertyLeads.filter((app) => app.scheduledVisit && ['visit_scheduled', 'visit_confirmed'].includes(app.status)),
    [propertyLeads],
  )

  if (!assignment || !broker || !property) {
    return (
      <div className="min-h-screen bg-canvas-alt px-6 py-10">
        <div className="mx-auto max-w-3xl rounded-card border border-outline bg-white p-10 text-center shadow-surface">
          <h1 className="text-heading-2 font-bold text-text-primary">Assignment not found</h1>
          <p className="mt-2 text-body text-text-muted">This broker assignment may have been released.</p>
          <button type="button" onClick={() => navigate(ROUTES.ADMIN.BROKER_MANAGEMENT)} className="mt-6 rounded-button bg-navy px-5 py-2.5 text-body font-semibold text-white hover:bg-slate-800">
            Back to Broker Management
          </button>
        </div>
      </div>
    )
  }

  const brokerName = `${broker.firstName} ${broker.lastName}`
  const ownerName = owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown Owner'

  return (
    <div className="min-h-screen bg-canvas-alt px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Back */}
        <button type="button" onClick={() => navigate(ROUTES.ADMIN.BROKER_MANAGEMENT)} className="inline-flex items-center gap-2 text-label font-semibold text-text-muted hover:text-primary transition-colors">
          <ArrowLeft size={16} /> Back to Broker Management
        </button>

        {/* Header */}
        <div className="rounded-card border border-outline bg-white p-6 shadow-surface">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {broker.avatar ? (
                <img src={broker.avatar} alt={brokerName} className="h-14 w-14 rounded-full object-cover border-2 border-primary-100" />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-lg font-bold text-white">{broker.firstName[0]}{broker.lastName[0]}</div>
              )}
              <div>
                <h1 className="text-heading-2 font-bold text-text-primary">{brokerName}</h1>
                <p className="mt-1 text-body text-text-muted">Assigned Broker · {broker.phone}</p>
              </div>
            </div>
            <span className="rounded-pill bg-green-50 px-3 py-1.5 text-badge font-bold text-green-700">Active Assignment</span>
          </div>
        </div>

        {/* Property Card */}
        <div className="rounded-card border border-outline bg-white shadow-surface overflow-hidden">
          <div className="relative h-52">
            <img src={property.image} alt={property.title} className="h-full w-full object-cover" />
          </div>
          <div className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-heading-3 font-bold text-text-primary">{property.title}</h2>
                <p className="mt-1 text-label text-text-muted flex items-center gap-1"><MapPin size={13} />{property.neighborhood}, {property.city}</p>
              </div>
              <p className="text-heading-2 font-bold text-primary">{property.price}<span className="text-label font-normal text-text-muted">{property.pricePeriod}</span></p>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-label text-text-muted">
              <span className="flex items-center gap-1"><Bed size={14} />{property.beds} Beds</span>
              <span className="flex items-center gap-1"><Bath size={14} />{property.baths} Baths</span>
              <span className="flex items-center gap-1"><Ruler size={14} />{property.sqft} sqft</span>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-outline bg-canvas-alt p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Property Owner</p>
                <p className="mt-1 text-body font-bold text-text-primary">{ownerName}</p>
                <p className="mt-0.5 text-label text-text-muted">{owner?.phone ?? '—'}</p>
              </div>
              <div className="rounded-lg border border-outline bg-canvas-alt p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Assignment Info</p>
                <p className="mt-1 text-body font-bold text-text-primary">Since {new Date(assignment.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                <p className="mt-0.5 text-label text-text-muted">Status: {assignment.status}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interested Tenants & Upcoming Visits */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Interested Tenants */}
          <div className="rounded-card border border-outline bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-body font-bold text-text-primary flex items-center gap-2"><Users size={16} /> Interested Tenants</h2>
              <span className="text-label font-bold text-primary">{propertyLeads.length}</span>
            </div>
            {propertyLeads.length > 0 ? (
              <div className="space-y-3">
                {propertyLeads.map((lead) => {
                  const tenant = users.find((u) => u.id === lead.tenantId)
                  const tenantName = tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Unknown'
                  return (
                    <div key={lead.id} className="flex items-center gap-3 rounded-lg border border-outline p-3">
                      {tenant?.avatar ? (
                        <img src={tenant.avatar} alt={tenantName} className="h-9 w-9 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold text-text-primary">{tenantName.split(' ').map((w) => w[0]).join('')}</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-body font-semibold text-text-primary truncate">{tenantName}</p>
                        <p className="text-label text-text-muted">{lead.status.replace(/_/g, ' ')}</p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button type="button" onClick={() => navigate(`${ROUTES.ADMIN.MESSAGES}?user=${encodeURIComponent(lead.tenantId)}`)} className="p-1.5 rounded text-text-muted hover:text-primary hover:bg-primary-50"><MessageSquare size={14} /></button>
                        <button type="button" className="p-1.5 rounded text-text-muted hover:text-primary hover:bg-primary-50"><Phone size={14} /></button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-outline p-6 text-center">
                <Users size={24} className="mx-auto text-text-muted opacity-50" />
                <p className="mt-2 text-label text-text-muted">No interested tenants yet.</p>
              </div>
            )}
          </div>

          {/* Upcoming Visits */}
          <div className="rounded-card border border-outline bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-body font-bold text-text-primary flex items-center gap-2"><Calendar size={16} /> Upcoming Visits</h2>
              <span className="text-label font-bold text-primary">{scheduledVisits.length}</span>
            </div>
            {scheduledVisits.length > 0 ? (
              <div className="space-y-3">
                {scheduledVisits.map((visit) => {
                  const tenant = users.find((u) => u.id === visit.tenantId)
                  const tenantName = tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Unknown'
                  return (
                    <div key={visit.id} className="flex items-center gap-3 rounded-lg border border-outline p-3">
                      {tenant?.avatar ? (
                        <img src={tenant.avatar} alt={tenantName} className="h-9 w-9 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold text-text-primary">{tenantName.split(' ').map((w) => w[0]).join('')}</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-body font-semibold text-text-primary truncate">{tenantName}</p>
                        <p className="text-label text-text-muted">{visit.scheduledVisit!.date} at {visit.scheduledVisit!.time}</p>
                      </div>
                      <span className={cn('rounded-pill px-2.5 py-1 text-[10px] font-bold', visit.status === 'visit_confirmed' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700')}>
                        {visit.status === 'visit_confirmed' ? 'Confirmed' : 'Pending'}
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-outline p-6 text-center">
                <Calendar size={24} className="mx-auto text-text-muted opacity-50" />
                <p className="mt-2 text-label text-text-muted">No visits scheduled yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
