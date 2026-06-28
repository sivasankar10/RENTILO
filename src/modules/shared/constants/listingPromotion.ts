/** Maps owner-managed property ids to tenant listing ids shown in search */
export const OWNER_TO_TENANT_LISTING_ID: Record<string, string> = {
  'opus-tower-14b': 'prop-1',
  'modern-penthouse-suite': 'prop-2',
  'parkview-residences': 'prop-3',
}

export const LISTING_PROMOTION_PRICE_INR = 59
export const LISTING_PROMOTION_DURATION_DAYS = 30

export function getTenantListingIdForOwnerProperty(ownerPropertyId: string) {
  return OWNER_TO_TENANT_LISTING_ID[ownerPropertyId]
}

export function formatPromotionDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
