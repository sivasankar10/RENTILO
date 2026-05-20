import { EmptyState } from '@shared/components'
import { Building2 } from 'lucide-react'

export function TenantProperties() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-heading-1 text-text-primary">Properties</h1>
        <p className="text-body text-text-muted mt-1">
          Browse and manage your rented properties.
        </p>
      </div>

      <EmptyState
        icon={<Building2 size={48} strokeWidth={1.5} />}
        title="No Properties Found"
        description="You haven't rented any properties yet. Start exploring available listings."
        actionLabel="Browse Properties"
        onAction={() => {}}
      />
    </div>
  )
}
