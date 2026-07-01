import { FileText, KeyRound, MessageCircle, Phone, Users } from 'lucide-react'
import { DEMO_OWNER, useOnboardingStore } from '@shared/store/onboardingStore'
import { useAuth } from '@shared/hooks/useAuth'

export function OwnerTenants() {
  const { user } = useAuth()
  const ownerId = user?.id ?? DEMO_OWNER.id
  const tenants = useOnboardingStore((state) =>
    state.records.filter((record) => record.owner.id === ownerId && record.status === 'active'),
  )

  return (
    <div className="space-y-7 p-6 lg:p-8">
      <header>
        <p className="text-filter-label font-bold uppercase tracking-wider text-primary">Occupied portfolio</p>
        <h1 className="mt-2 text-heading-1 font-extrabold text-navy">My Tenants</h1>
        <p className="mt-2 text-body text-text-muted">Active tenants are mapped here after payment and owner confirmation.</p>
      </header>

      <div className="grid gap-5 xl:grid-cols-2">
        {tenants.map((record) => (
          <article key={record.id} className="rounded-card border border-outline bg-white p-6 shadow-surface">
            <div className="flex items-start gap-4">
              <img src={record.tenant.avatar} alt="" className="h-14 w-14 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-heading-3 font-bold text-navy">{record.tenant.name}</h2>
                  <span className="rounded-pill bg-status-success-bg px-2.5 py-1 text-badge font-bold uppercase text-status-success">Active</span>
                </div>
                <p className="mt-1 text-label font-semibold text-text-primary">{record.propertyName} · {record.unit}</p>
                <p className="mt-1 text-label text-text-muted">{record.tenant.email}</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 border-y border-outline py-5 text-label">
              <Info label="Lease" value={record.lease?.id ?? '-'} icon={<FileText size={16} />} />
              <Info label="Monthly rent" value={record.monthlyRent} icon={<Users size={16} />} />
              <Info label="Access key" value={record.lease?.accessKey ?? '-'} icon={<KeyRound size={16} />} />
              <Info label="Agreement" value={`Version ${record.agreementVersions.at(-1)?.version ?? 1}`} icon={<FileText size={16} />} />
            </div>
            <div className="mt-5 flex gap-2">
              <a href={`tel:${record.tenant.phone}`} className="flex items-center gap-2 rounded-button border border-outline px-4 py-2.5 text-label font-bold text-navy"><Phone size={16} /> Call</a>
              <button type="button" className="flex items-center gap-2 rounded-button bg-navy px-4 py-2.5 text-label font-bold text-white"><MessageCircle size={16} /> Chat</button>
            </div>
          </article>
        ))}
        {tenants.length === 0 && (
          <div className="col-span-full rounded-card border border-dashed border-outline bg-white p-12 text-center">
            <Users size={42} className="mx-auto text-text-muted" />
            <h2 className="mt-4 text-heading-3 font-bold text-navy">No onboarded tenants</h2>
            <p className="mt-2 text-body text-text-muted">Complete an application from the Leases page to populate this view.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function Info({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return <div><p className="flex items-center gap-1.5 font-semibold text-text-muted">{icon}{label}</p><p className="mt-1 font-bold text-text-primary">{value}</p></div>
}
