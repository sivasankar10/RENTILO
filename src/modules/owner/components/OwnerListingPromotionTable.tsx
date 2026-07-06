import { useNavigate } from 'react-router-dom'
import { Megaphone, Sparkles } from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { cn } from '@shared/utils/cn'
import {
  formatPromotionDate,
  LISTING_PROMOTION_PRICE_INR,
} from '@shared/constants/listingPromotion'
import {
  isPromotionActive,
  useListingPromotionStore,
} from '@shared/store/listingPromotionStore'
import { usePrototypeStore } from '@shared/store/prototypeStore'
import { useOwnerPrototype } from '../hooks/useOwnerPrototype'

export function OwnerListingPromotionTable() {
  const navigate = useNavigate()
  const { properties, listings } = useOwnerPrototype()
  const promotions = useListingPromotionStore((state) => state.promotions)
  const getPromotionForProperty = useListingPromotionStore((state) => state.getPromotionForProperty)
  const brokerAssignments = usePrototypeStore((state) => state.brokerAssignments)

  return (
    <section
      id="listing-promotions"
      className="scroll-mt-24 overflow-hidden rounded-card border border-outline bg-white shadow-surface"
    >
      <div className="flex flex-col gap-4 border-b border-outline px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-filter-label font-bold uppercase tracking-wider text-primary">
            <Megaphone size={14} />
            Listing Promotions
          </p>
          <h2 className="mt-1 text-heading-3 font-bold text-navy">Promote your properties</h2>
          <p className="mt-1 text-body text-text-muted">
            Rs. {LISTING_PROMOTION_PRICE_INR}/month per listing - Suggested badge on tenant search
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-button bg-primary-50 px-4 py-2 text-label font-semibold text-primary">
          <Sparkles size={15} />
          {promotions.filter((item) => isPromotionActive(item)).length} active promotion
          {promotions.filter((item) => isPromotionActive(item)).length === 1 ? '' : 's'}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-outline bg-canvas-alt text-filter-label font-bold uppercase tracking-wider text-text-muted">
              <th className="px-6 py-3">Property</th>
              <th className="px-6 py-3">Tenant listing</th>
              <th className="px-6 py-3">Promotion status</th>
              <th className="px-6 py-3">Valid until</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => {
              const promotion = getPromotionForProperty(property.id)
              const paidActive = promotion ? isPromotionActive(promotion) : false
              const tenantListingId = listings.find((listing) => listing.propertyId === property.id)?.id
              const hasBrokerAssigned = brokerAssignments.some(
                (a) => a.propertyId === property.id && a.status === 'Active',
              )
              const active = paidActive || hasBrokerAssigned
              const canPromote = Boolean(tenantListingId)

              return (
                <tr key={property.id} className="border-b border-outline last:border-0">
                  <td className="px-6 py-4">
                    <p className="text-body font-bold text-text-primary">{property.title}</p>
                    <p className="mt-0.5 text-label text-text-muted">{property.address}</p>
                  </td>
                  <td className="px-6 py-4 text-label text-text-muted">
                    {tenantListingId ? (
                      <span className="font-mono text-[12px]">{tenantListingId}</span>
                    ) : (
                      'Not linked'
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'inline-flex rounded-pill px-3 py-1 text-badge font-bold',
                        active
                          ? 'bg-status-success-bg text-status-success'
                          : 'bg-slate-100 text-slate-600',
                      )}
                    >
                      {active ? 'Promoted' : 'Not promoted'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-body text-text-primary">
                    {paidActive && promotion
                      ? formatPromotionDate(promotion.promotedUntilIso)
                      : hasBrokerAssigned
                        ? 'While broker active'
                        : '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      disabled={!canPromote}
                      onClick={() => navigate(ROUTES.OWNER.LISTING_PROMOTION_PAYMENT(property.id))}
                      className={cn(
                        'rounded-button px-4 py-2 text-label font-bold transition-colors',
                        canPromote
                          ? active
                            ? 'border border-outline bg-white text-navy hover:bg-canvas-alt'
                            : 'bg-navy text-white hover:bg-slate-800'
                          : 'cursor-not-allowed bg-slate-100 text-slate-400',
                      )}
                    >
                      {!canPromote ? 'Unavailable' : active ? 'Renew' : 'Promote'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
