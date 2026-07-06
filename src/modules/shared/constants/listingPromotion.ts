/** Maps owner-managed property ids to tenant listing ids shown in search */
export const OWNER_TO_TENANT_LISTING_ID: Record<string, string> = {
  'property-multi-1': 'listing-multi-1',
}

export const LISTING_PROMOTION_PRICE_INR = 59
export const LISTING_PROMOTION_DURATION_DAYS = 30

/**
 * Resolves the tenant-facing listing ID for an owner property.
 * Checks the static map first.
 */
export function getTenantListingIdForOwnerProperty(ownerPropertyId: string): string | undefined {
  return OWNER_TO_TENANT_LISTING_ID[ownerPropertyId]
}

export function formatPromotionDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
