import { EmptyState } from '@shared/components'
import { Building2 } from 'lucide-react'

export function OwnerProperties() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-heading-1 text-text-primary">My Properties</h1>
        <p className="text-body text-text-muted mt-1">Manage your property listings.</p>
      </div>
      <EmptyState
        icon={<Building2 size={48} strokeWidth={1.5} />}
        title="No Properties Yet"
        description="Add your first property to start receiving rental applications."
        actionLabel="Add Property"
        onAction={() => {}}
      />
    </div>
  )
}
