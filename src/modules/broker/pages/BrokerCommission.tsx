import { Banknote } from 'lucide-react'
import { EmptyState } from '@shared/components'
import { useBrokerPrototype } from '../hooks/useBrokerPrototype'

export function BrokerCommission() {
  const { commissions, properties } = useBrokerPrototype()
  const total = commissions
    .filter((payment) => payment.status === 'Successful')
    .reduce((sum, payment) => sum + payment.amount, 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-heading-1 text-text-primary">Commission</h1>
        <p className="mt-1 text-body text-text-muted">
          Track broker-assisted lease earnings and platform payouts.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <Stat label="Total earned" value={`Rs. ${total.toLocaleString('en-IN')}`} />
        <Stat label="Pending" value={String(commissions.filter((item) => item.status === 'Pending').length)} />
        <Stat label="Completed deals" value={String(commissions.filter((item) => item.status === 'Successful').length)} />
      </section>

      {commissions.length === 0 ? (
        <EmptyState
          icon={<Banknote size={48} strokeWidth={1.5} />}
          title="No Commission Records"
          description="Commission records will appear when broker-assisted onboarding payments complete."
        />
      ) : (
        <div className="overflow-hidden rounded-card border border-outline bg-white">
          {commissions.map((payment) => {
            const property = properties.find((item) => item.id === payment.propertyId)
            return (
              <article
                key={payment.id}
                className="flex flex-col gap-3 border-b border-outline p-5 last:border-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-body font-bold text-text-primary">
                    {property?.title ?? payment.description ?? 'Broker commission'}
                  </p>
                  <p className="mt-1 text-label text-text-muted">
                    {payment.txnId} - {payment.paidAt}
                  </p>
                </div>
                <div className="sm:text-right">
                  <p className="text-body font-bold text-text-primary">{payment.amountDisplay}</p>
                  <p className="mt-1 text-label font-semibold text-primary">{payment.status}</p>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-outline bg-white p-5">
      <p className="text-label font-semibold uppercase text-text-muted">{label}</p>
      <p className="mt-2 text-heading-2 font-bold text-text-primary">{value}</p>
    </div>
  )
}