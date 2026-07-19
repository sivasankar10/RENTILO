import { useState } from 'react'
import { Banknote } from 'lucide-react'
import { EmptyState } from '@shared/components'
import { usePrototypeStore } from '@shared/store/prototypeStore'
import { useBrokerPrototype } from '../hooks/useBrokerPrototype'

export function BrokerCommission() {
  const { brokerId, commissions, properties } = useBrokerPrototype()
  const negotiations = usePrototypeStore((s) => s.commissionNegotiations)
  const allProperties = usePrototypeStore((s) => s.properties)
  const users = usePrototypeStore((s) => s.users)
  const decideBrokerOffer = usePrototypeStore((s) => s.decideBrokerOffer)
  const counterCommissionOffer = usePrototypeStore((s) => s.counterCommissionOffer)
  const sendBrokerOffer = usePrototypeStore((s) => s.sendBrokerOffer)

  const [counterFor, setCounterFor] = useState<{ negId: string; brokerId: string } | null>(null)
  const [counterCommission, setCounterCommission] = useState('3')
  const [counterNote, setCounterNote] = useState('')

  const total = commissions
    .filter((payment) => payment.status === 'Successful')
    .reduce((sum, payment) => sum + payment.amount, 0)

  // Incoming offers for this broker
  const incomingOffers = negotiations.filter((n) =>
    n.brokerOffers.some((o) => o.brokerId === brokerId && o.status === 'pending')
  )

  const handleAccept = (negId: string) => decideBrokerOffer(negId, brokerId, 'accepted')
  const handleReject = (negId: string) => decideBrokerOffer(negId, brokerId, 'rejected')
  const handleCounterClick = (negId: string) => {
    setCounterFor({ negId, brokerId })
    setCounterCommission('3')
    setCounterNote('')
  }
  const handleSendCounter = () => {
    if (!counterFor) return
    // Counter: reject current offer, then owner's negotiation gets a counter round
    counterCommissionOffer(counterFor.negId, 'admin', `${counterCommission}%`, counterNote || 'Broker counter-offer')
    // Re-send as a new broker offer with updated commission
    sendBrokerOffer(counterFor.negId, brokerId, `${counterCommission}%`)
    setCounterFor(null)
  }

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

      {/* Incoming Offers */}
      {incomingOffers.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-heading-3 font-bold text-text-primary">Incoming Assignment Offers</h2>
          {incomingOffers.map((neg) => {
            const offer = neg.brokerOffers.find((o) => o.brokerId === brokerId && o.status === 'pending')
            if (!offer) return null
            const property = allProperties.find((p) => p.id === neg.propertyId)
            const owner = users.find((u) => u.id === neg.ownerId)
            const lastRound = neg.rounds[neg.rounds.length - 1]
            return (
              <div key={neg.id} className="rounded-card border border-outline bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-body font-bold text-text-primary">{property?.title ?? 'Property'}</p>
                    <p className="mt-1 text-label text-text-muted">From: {owner ? `${owner.firstName} ${owner.lastName}` : 'Owner'}</p>
                    <p className="mt-2 text-heading-3 font-extrabold text-primary">{offer.commission} commission</p>
                    {lastRound?.note && <p className="mt-2 text-label text-text-muted italic">"{lastRound.note}"</p>}
                    <p className="mt-2 text-label text-text-muted">Offered: {new Date(offer.offeredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => handleAccept(neg.id)} className="rounded-button bg-green-600 px-4 py-2.5 text-label font-bold text-white hover:bg-green-700">Accept</button>
                    <button type="button" onClick={() => handleCounterClick(neg.id)} className="rounded-button border border-primary bg-white px-4 py-2.5 text-label font-bold text-primary hover:bg-primary-50">Counter Offer</button>
                    <button type="button" onClick={() => handleReject(neg.id)} className="rounded-button border border-red-200 px-4 py-2.5 text-label font-bold text-red-600 hover:bg-red-50">Reject</button>
                  </div>
                </div>
              </div>
            )
          })}
        </section>
      )}

      {/* Counter Offer Modal */}
      {counterFor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={() => setCounterFor(null)} />
          <div className="relative w-full max-w-md rounded-card bg-white shadow-xl">
            <div className="border-b border-outline px-6 py-5">
              <h2 className="text-heading-3 font-bold text-text-primary">Counter Offer</h2>
              <p className="mt-1 text-label text-text-muted">Propose your commission percentage to the property owner.</p>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="text-label font-bold text-text-primary">Your Commission (%)</label>
                <input type="number" min="0.5" max="10" step="0.5" value={counterCommission} onChange={(e) => setCounterCommission(e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-heading-3 font-bold text-text-primary outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-label font-bold text-text-primary">Note (optional)</label>
                <textarea value={counterNote} onChange={(e) => setCounterNote(e.target.value)} rows={3} placeholder="Explain your counter-offer..." className="mt-1.5 w-full rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary outline-none resize-none focus:border-primary" />
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-outline px-6 py-4">
              <button type="button" onClick={() => setCounterFor(null)} className="rounded-button border border-outline px-5 py-3 text-body font-bold">Cancel</button>
              <button type="button" onClick={handleSendCounter} className="rounded-button bg-primary px-5 py-3 text-body font-bold text-white">Send Counter Offer</button>
            </div>
          </div>
        </div>
      )}

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