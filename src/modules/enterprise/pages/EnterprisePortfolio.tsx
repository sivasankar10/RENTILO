import { EmptyState } from '@shared/components'
import { Briefcase } from 'lucide-react'

export function EnterprisePortfolio() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-heading-1 text-text-primary">Portfolio</h1>
        <p className="text-body text-text-muted mt-1">Manage your enterprise property portfolio.</p>
      </div>
      <EmptyState icon={<Briefcase size={48} strokeWidth={1.5} />} title="Empty Portfolio" description="Add properties to your enterprise portfolio to get started." actionLabel="Add Property" onAction={() => {}} />
    </div>
  )
}
