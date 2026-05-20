import { EmptyState } from '@shared/components'
import { Users } from 'lucide-react'

export function OwnerTenants() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-heading-1 text-text-primary">Tenants</h1>
        <p className="text-body text-text-muted mt-1">View and manage your current tenants.</p>
      </div>
      <EmptyState
        icon={<Users size={48} strokeWidth={1.5} />}
        title="No Tenants"
        description="Your tenant list will populate when tenants are assigned to your properties."
      />
    </div>
  )
}
