import { EmptyState } from '@shared/components'
import { Users } from 'lucide-react'

export function BrokerClients() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-heading-1 text-text-primary">Clients</h1>
        <p className="text-body text-text-muted mt-1">Manage your tenant and owner clients.</p>
      </div>
      <EmptyState icon={<Users size={48} strokeWidth={1.5} />} title="No Clients" description="Add clients to start managing their rental needs." actionLabel="Add Client" onAction={() => {}} />
    </div>
  )
}
