import { EmptyState } from '@shared/components'
import { Wrench } from 'lucide-react'

export function TenantMaintenance() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-heading-1 text-text-primary">Maintenance</h1>
        <p className="text-body text-text-muted mt-1">
          Submit and track your maintenance requests.
        </p>
      </div>

      <EmptyState
        icon={<Wrench size={48} strokeWidth={1.5} />}
        title="No Maintenance Requests"
        description="You haven't submitted any maintenance requests yet."
        actionLabel="New Request"
        onAction={() => {}}
      />
    </div>
  )
}
