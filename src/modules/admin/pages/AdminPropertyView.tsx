import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Bath, Bed, MapPin, Ruler, Users } from 'lucide-react'
import { usePrototypeStore } from '@shared/store/prototypeStore'
import { useOnboardingStore } from '@shared/store/onboardingStore'

export function AdminPropertyView() {
  const navigate = useNavigate()
  const { propertyId } = useParams<{ propertyId: string }>()
  const properties = usePrototypeStore((s) => s.properties)
  const users = usePrototypeStore((s) => s.users)
  const brokerAssignments = usePrototypeStore((s) => s.brokerAssignments)
  const applications = usePrototypeStore((s) => s.applications)
  const onboardingRecords = useOnboardingStore((s) => s.records)

  const property = properties.find((p) => p.id === propertyId)

  if (!property) {
    return (
      <div className="min-h-screen bg-canvas-alt px-6 py-10">
        <div className="mx-auto max-w-3xl rounded-card border border-outline bg-white p-10 text-center shadow-surface">
          <h1 className="text-heading-2 font-bold text-text-primary">Property not found</h1>
          <button type="button" onClick={() => navigate(-1)} className="mt-6 rounded-button bg-navy px-5 py-2.5 text-body font-semibold text-white hover:bg-slate-800">Go Back</button>
        </div>
      </div>
    )
  }

  const owner = users.find((u) => u.id === property.ownerId)
  const ownerName = owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown'
  const activeAssignment = brokerAssignments.find((a) => a.propertyId === property.id && a.status === 'Active')
  const broker = activeAssignment ? users.find((u) => u.id === activeAssignment.brokerId) : null
  const propertyLeads = applications.filter((app) => app.propertyId === property.id && !['active', 'rejected', 'payment_completed'].includes(app.status))
  const activeOnboarding = onboardingRecords.find((r) => r.ownerPropertyId === property.id && ['active', 'payment_completed'].includes(r.status))

  return (
    <div className="min-h-screen bg-canvas-alt px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-label font-semibold text-text-muted hover:text-primary transition-colors">
          <ArrowLeft size={16} /> Back
        </button>

        {/* Property Card */}
        <div className="rounded-card border border-outline bg-white shadow-surface overflow-hidden">
          <div className="relative h-56">
            <img src={property.image} alt={property.title} className="h-full w-full object-cover" />
            <span className={`absolute left-5 top-5 rounded-pill px-3 py-1 text-badge font-bold uppercase ${activeOnboarding?.status === 'active' ? 'bg-primary-50 text-primary' : activeOnboarding ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
              {activeOnboarding?.status === 'active' ? 'Occupied' : activeOnboarding ? 'Pending' : 'Vacant'}
            </span>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-heading-2 font-bold text-text-primary">{property.title}</h1>
                <p className="mt-1 text-body text-text-muted flex items-center gap-1"><MapPin size={14} />{property.neighborhood}, {property.city}</p>
              </div>
              <p className="text-heading-2 font-bold text-primary">{property.price}<span className="text-label font-normal text-text-muted">{property.pricePeriod}</span></p>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-label text-text-muted">
              <span className="flex items-center gap-1"><Bed size={14} />{property.beds} Beds</span>
              <span className="flex items-center gap-1"><Bath size={14} />{property.baths} Baths</span>
              <span className="flex items-center gap-1"><Ruler size={14} />{property.sqft} sqft</span>
            </div>
            <p className="mt-4 text-body text-text-muted leading-relaxed">{property.description}</p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-card border border-outline bg-white p-5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Owner</p>
            <p className="mt-2 text-body font-bold text-text-primary">{ownerName}</p>
            <p className="mt-0.5 text-label text-text-muted">{owner?.email ?? '—'}</p>
            <p className="mt-0.5 text-label text-text-muted">{owner?.phone ?? '—'}</p>
          </div>
          <div className="rounded-card border border-outline bg-white p-5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Assigned Broker</p>
            {broker ? (
              <>
                <p className="mt-2 text-body font-bold text-text-primary">{broker.firstName} {broker.lastName}</p>
                <p className="mt-0.5 text-label text-text-muted">{broker.phone}</p>
              </>
            ) : (
              <p className="mt-2 text-body text-text-muted">No broker assigned</p>
            )}
          </div>
          <div className="rounded-card border border-outline bg-white p-5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Interested Tenants</p>
            <p className="mt-2 text-heading-3 font-bold text-text-primary">{propertyLeads.length}</p>
            <p className="mt-0.5 text-label text-text-muted">active leads for this property</p>
          </div>
        </div>

        {/* Tenant Info */}
        {activeOnboarding && (
          <div className="rounded-card border border-primary-100 bg-primary-50/50 p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
              {activeOnboarding.status === 'active' ? 'Current Tenant' : 'Tenant — Payment Received'}
            </p>
            <div className="mt-3 flex items-center gap-3">
              {activeOnboarding.tenant.avatar && <img src={activeOnboarding.tenant.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />}
              <div>
                <p className="text-body font-bold text-navy">{activeOnboarding.tenant.name}</p>
                <p className="text-label text-text-muted">{activeOnboarding.tenant.email} · {activeOnboarding.tenant.phone}</p>
              </div>
            </div>
          </div>
        )}

        {/* Leads list */}
        {propertyLeads.length > 0 && (
          <div className="rounded-card border border-outline bg-white p-6 shadow-sm">
            <h2 className="text-body font-bold text-text-primary flex items-center gap-2"><Users size={16} /> Interested Tenants</h2>
            <div className="mt-4 space-y-3">
              {propertyLeads.map((lead) => {
                const tenant = users.find((u) => u.id === lead.tenantId)
                const tenantName = tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Unknown'
                return (
                  <div key={lead.id} className="flex items-center gap-3 rounded-lg border border-outline p-3">
                    {tenant?.avatar ? (
                      <img src={tenant.avatar} alt={tenantName} className="h-9 w-9 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold">{tenantName.split(' ').map((w) => w[0]).join('')}</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-body font-semibold text-text-primary truncate">{tenantName}</p>
                      <p className="text-label text-text-muted">{lead.status.replace(/_/g, ' ')}{lead.scheduledVisit ? ` · Visit: ${lead.scheduledVisit.date}` : ''}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
