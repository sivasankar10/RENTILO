import { useNavigate } from 'react-router-dom'
import { Building2, KeyRound } from 'lucide-react'
import { EmptyState } from '@shared/components'
import { ROUTES } from '@shared/constants/routes'
import { useAuth } from '@shared/hooks/useAuth'
import { usePrototypeStore } from '@shared/store/prototypeStore'

export function TenantProperties() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const tenantId = user?.id ?? ''
  const leases = usePrototypeStore((state) => state.leases.filter((lease) => lease.tenantId === tenantId))
  const properties = usePrototypeStore((state) => state.properties)

  if (!leases.length) {
    return (
      <div className="space-y-8">
        <div><h1 className="text-heading-1 text-text-primary">Properties</h1><p className="mt-1 text-body text-text-muted">Browse and manage your rented properties.</p></div>
        <EmptyState icon={<Building2 size={48} strokeWidth={1.5} />} title="No Properties Found" description="Active and pending lease properties appear here." actionLabel="Browse Properties" onAction={() => navigate(ROUTES.TENANT.LISTINGS)} />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div><h1 className="text-heading-1 text-text-primary">Properties</h1><p className="mt-1 text-body text-text-muted">Properties connected to your session leases.</p></div>
      <div className="grid gap-5 md:grid-cols-2">
        {leases.map((lease) => {
          const property = properties.find((item) => item.id === lease.propertyId)
          if (!property) return null
          return (
            <article key={lease.id} className="overflow-hidden rounded-card border border-outline bg-white shadow-surface">
              <img src={property.image} alt="" className="aspect-[16/8] w-full object-cover" />
              <div className="p-6"><div className="flex items-start justify-between gap-4"><div><h2 className="text-heading-3 font-bold text-navy">{property.title}</h2><p className="mt-1 text-label text-text-muted">{property.address}</p></div><span className="rounded-pill bg-status-success-bg px-3 py-1 text-badge font-bold uppercase text-status-success">{lease.status}</span></div><p className="mt-4 flex items-center gap-2 text-label font-semibold text-text-primary"><KeyRound size={16} /> {lease.accessKey ?? 'Access issued after owner confirmation'}</p><button type="button" onClick={() => navigate(ROUTES.TENANT.MY_LEASE)} className="mt-5 rounded-button bg-navy px-4 py-2.5 text-label font-bold text-white">View lease</button></div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
