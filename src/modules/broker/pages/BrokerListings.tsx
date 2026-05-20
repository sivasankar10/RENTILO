import { EmptyState } from '@shared/components'
import { List } from 'lucide-react'

export function BrokerListings() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-heading-1 text-text-primary">Listings</h1>
        <p className="text-body text-text-muted mt-1">Manage your assigned property listings.</p>
      </div>
      <EmptyState icon={<List size={48} strokeWidth={1.5} />} title="No Listings" description="Your assigned listings will appear here." />
    </div>
  )
}
