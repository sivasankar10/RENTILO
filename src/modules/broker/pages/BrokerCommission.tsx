import { EmptyState } from '@shared/components'
import { Banknote } from 'lucide-react'

export function BrokerCommission() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-heading-1 text-text-primary">Commission</h1>
        <p className="text-body text-text-muted mt-1">Track your earnings and commission payouts.</p>
      </div>
      <EmptyState icon={<Banknote size={48} strokeWidth={1.5} />} title="No Commission Records" description="Commission records will appear here as you close deals." />
    </div>
  )
}
