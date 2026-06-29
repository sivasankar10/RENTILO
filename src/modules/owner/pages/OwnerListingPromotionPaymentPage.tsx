import { useMemo } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { CheckoutPaymentPage } from '@modules/tenant/pages/SeriousBuyerPaymentPage'
import { ROUTES } from '@shared/constants/routes'
import {
  getTenantListingIdForOwnerProperty,
  LISTING_PROMOTION_PRICE_INR,
} from '@shared/constants/listingPromotion'
import { DEMO_OWNER } from '@shared/store/onboardingStore'
import { useListingPromotionStore } from '@shared/store/listingPromotionStore'
import { usePaymentsStore } from '@shared/store/paymentsStore'
import { OWNER_MANAGED_PROPERTIES } from '../store/ownerStore'

const promotionBenefits = [
  'Suggested badge on tenant search',
  'Higher placement in recommended sort',
  '30-day promotion per payment',
  'Renew anytime from your portfolio',
]

export function OwnerListingPromotionPaymentPage() {
  const { propertyId } = useParams<{ propertyId: string }>()
  const property = useMemo(
    () => OWNER_MANAGED_PROPERTIES.find((item) => item.id === propertyId),
    [propertyId],
  )
  const activatePromotion = useListingPromotionStore((state) => state.activatePromotion)
  const existingPromotion = useListingPromotionStore((state) =>
    propertyId ? state.getPromotionForProperty(propertyId) : undefined,
  )

  if (!propertyId || !property || !getTenantListingIdForOwnerProperty(propertyId)) {
    return <Navigate to={ROUTES.OWNER.PORTFOLIO} replace />
  }

  const amountLabel = `₹${LISTING_PROMOTION_PRICE_INR}`
  const isRenewal = Boolean(existingPromotion)

  return (
    <CheckoutPaymentPage
      backLabel="Back to portfolio"
      backRoute={`${ROUTES.OWNER.PORTFOLIO}#listing-promotions`}
      eyebrow="Listing Promotion"
      title={isRenewal ? 'Renew Listing Promotion' : 'Promote Listing'}
      description={`Complete payment to ${isRenewal ? 'extend' : 'activate'} the Suggested badge for ${property.name}.`}
      amount={amountLabel}
      submitLabel={`Pay ${amountLabel}`}
      successTitle={isRenewal ? 'Promotion renewed' : 'Listing promoted successfully'}
      successDescription={`${property.name} will appear with a Suggested badge to tenants for the next 30 days.`}
      successActionLabel="Back to promotion table"
      successActionRoute={`${ROUTES.OWNER.PORTFOLIO}#listing-promotions`}
      productTitle={property.name}
      productSubtitle={`${property.unit} · 30-day boost`}
      productIcon="campaign"
      benefits={promotionBenefits}
      lineItems={[
        { label: 'Listing promotion', value: amountLabel },
        { label: 'Platform fee', value: '₹0' },
      ]}
      total={amountLabel}
      onPaymentComplete={({ method }) => {
        activatePromotion({
          ownerPropertyId: property.id,
          ownerId: DEMO_OWNER.id,
          propertyName: property.name,
          amountPaid: LISTING_PROMOTION_PRICE_INR,
        })
        usePaymentsStore.getState().addOwnerOutgoingPayment({
          amount: LISTING_PROMOTION_PRICE_INR,
          amountDisplay: amountLabel,
          method,
          category: 'OTHER',
          description: `Listing promotion — ${property.name} (30 days)`,
        })
      }}
    />
  )
}
