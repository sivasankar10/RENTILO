import { EmptyState } from '@shared/components'
import { BarChart3 } from 'lucide-react'

export function OwnerAnalytics() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-heading-1 text-text-primary">Analytics</h1>
        <p className="text-body text-text-muted mt-1">Revenue and occupancy analytics.</p>
      </div>
      <EmptyState
        icon={<BarChart3 size={48} strokeWidth={1.5} />}
        title="Analytics Coming Soon"
        description="Detailed revenue, occupancy, and performance analytics will be available here."
      />
    </div>
  )
}
