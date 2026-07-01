import { Navigate, useParams } from 'react-router-dom'
import { CheckoutPaymentPage } from '@modules/tenant/pages/SeriousBuyerPaymentPage'
import { ROUTES } from '@shared/constants/routes'
import {
  LISTING_PROMOTION_PRICE_INR,
} from '@shared/constants/listingPromotion'
import { useAuth } from '@shared/hooks/useAuth'
import { useListingPromotionStore } from '@shared/store/listingPromotionStore'
import { usePaymentsStore } from '@shared/store/paymentsStore'
import { useOwnerPrototype } from '../hooks/useOwnerPrototype'

const promotionBenefits = [
  'Suggested badge on tenant search',
  'Higher placement in recommended sort',
  '30-day promotion per payment',
  'Renew anytime from your portfolio',
]

export function OwnerListingPromotionPaymentPage() {
  const { propertyId } = useParams<{ propertyId: string }>()
  const { user } = useAuth()
  const { properties, listings } = useOwnerPrototype()
  const property = properties.find((item) => item.id === propertyId)
  const listing = listings.find((item) => item.propertyId === propertyId)
  const activatePromotion = useListingPromotionStore((state) => state.activatePromotion)
  const existingPromotion = useListingPromotionStore((state) =>
    propertyId ? state.getPromotionForProperty(propertyId) : undefined,
  )

  if (!propertyId || !property || !listing) {
    return <Navigate to={ROUTES.OWNER.PORTFOLIO} replace />
  }

  const amountLabel = `Rs. ${LISTING_PROMOTION_PRICE_INR}`
  const isRenewal = Boolean(existingPromotion)

  return (
    <CheckoutPaymentPage
      backLabel="Back to portfolio"
      backRoute={`${ROUTES.OWNER.PORTFOLIO}#listing-promotions`}
      eyebrow="Listing Promotion"
      title={isRenewal ? 'Renew Listing Promotion' : 'Promote Listing'}
      description={`Complete payment to ${isRenewal ? 'extend' : 'activate'} the Suggested badge for ${property.title}.`}
      amount={amountLabel}
      submitLabel={`Pay ${amountLabel}`}
      successTitle={isRenewal ? 'Promotion renewed' : 'Listing promoted successfully'}
      successDescription={`${property.title} will appear with a Suggested badge to tenants for the next 30 days.`}
      successActionLabel="Back to promotion table"
      successActionRoute={`${ROUTES.OWNER.PORTFOLIO}#listing-promotions`}
      productTitle={property.title}
      productSubtitle={`${property.unit} - 30-day boost`}
      productIcon="campaign"
      benefits={promotionBenefits}
      lineItems={[
        { label: 'Listing promotion', value: amountLabel },
        { label: 'Platform fee', value: 'Rs. 0' },
      ]}
      total={amountLabel}
      onPaymentComplete={({ method }) => {
        activatePromotion({
          ownerPropertyId: property.id,
          ownerId: user?.id ?? property.ownerId,
          propertyName: property.title,
          amountPaid: LISTING_PROMOTION_PRICE_INR,
        })
        usePaymentsStore.getState().addOwnerOutgoingPayment({
          amount: LISTING_PROMOTION_PRICE_INR,
          amountDisplay: amountLabel,
          method,
          category: 'OTHER',
          ownerId: user?.id ?? property.ownerId,
          description: `Listing promotion â€” ${property.title} (30 days)`,
        })
      }}
    />
  )
}
