import { EmptyState } from '@shared/components'
import { CreditCard } from 'lucide-react'

export function TenantPayments() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-heading-1 text-text-primary">Payments</h1>
        <p className="text-body text-text-muted mt-1">
          View your payment history and upcoming dues.
        </p>
      </div>

      <EmptyState
        icon={<CreditCard size={48} strokeWidth={1.5} />}
        title="No Payments"
        description="Your payment history will appear here once you start making payments."
      />
    </div>
  )
}
