import { EmptyState } from '@shared/components'
import { Users } from 'lucide-react'

export function EnterpriseTeams() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-heading-1 text-text-primary">Teams</h1>
        <p className="text-body text-text-muted mt-1">Manage your enterprise team members and roles.</p>
      </div>
      <EmptyState icon={<Users size={48} strokeWidth={1.5} />} title="No Team Members" description="Invite team members to collaborate on property management." actionLabel="Invite Member" onAction={() => {}} />
    </div>
  )
}
