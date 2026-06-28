import { OWNER_MANAGED_PROPERTIES } from '../store/ownerStore'

/** Primary demo property aligned with tenant listing prop-1 */
export const PRIMARY_OWNER_PROPERTY_ID = 'opus-tower-14b'

export const primaryPortfolioProperty =
  OWNER_MANAGED_PROPERTIES.find((property) => property.id === PRIMARY_OWNER_PROPERTY_ID) ??
  OWNER_MANAGED_PROPERTIES[0]!
