import { CheckoutPaymentPage } from '@modules/tenant/pages/SeriousBuyerPaymentPage'
import { ROUTES } from '@shared/constants/routes'

const ownerPremiumBenefits = [
  'Unlimited property listings',
  'Advanced financial analytics',
  'AI-driven tenant matching',
  'Priority broker assignment',
]

export function OwnerPremiumPaymentPage() {
  return (
    <CheckoutPaymentPage
      backLabel="Back to plans"
      backRoute={ROUTES.OWNER.PLANS_RULES}
      eyebrow="Owner Premium Plan"
      title="Complete Premium Payment"
      description="This is a dummy checkout page for now. Choose a payment method and submit to preview the premium activation flow."
      amount="$149"
      submitLabel="Pay $149"
      successTitle="Premium plan payment successful"
      successDescription="Your Owner Premium plan activation has been completed in this dummy flow."
      successActionLabel="Go to Portfolio"
      successActionRoute={ROUTES.OWNER.PORTFOLIO}
      productTitle="Owner Premium"
      productSubtitle="Monthly plan"
      productIcon="workspace_premium"
      benefits={ownerPremiumBenefits}
      lineItems={[
        { label: 'Premium plan', value: '$149' },
        { label: 'Taxes', value: '$0' },
      ]}
      total="$149"
    />
  )
}
