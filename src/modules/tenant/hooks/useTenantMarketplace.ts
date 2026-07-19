import { useMemo } from 'react'
import { useAuth } from '@shared/hooks/useAuth'
import { usePrototypeStore } from '@shared/store/prototypeStore'
import { toTenantProperty } from '@shared/store/prototypeAdapters'
import type { PrototypeListingBundle } from '@shared/store/prototypeSelectors'
import type { Property } from '../types/property'

export function useTenantMarketplace() {
  const { user } = useAuth()
  const tenantId = user?.id ?? ''
  const listings = usePrototypeStore((state) => state.listings)
  const properties = usePrototypeStore((state) => state.properties)
  const users = usePrototypeStore((state) => state.users)
  const assignments = usePrototypeStore((state) => state.brokerAssignments)
  const saved = usePrototypeStore((state) => state.tenantSavedListings)
  const saveTenantProperty = usePrototypeStore((state) => state.saveTenantProperty)
  const unsaveTenantProperty = usePrototypeStore((state) => state.unsaveTenantProperty)

  const bundles = useMemo(() => listings
    .filter((listing) => listing.status === 'Active')
    .map<PrototypeListingBundle | null>((listing) => {
      const property = properties.find((item) => item.id === listing.propertyId)
      const owner = users.find((item) => item.id === listing.ownerId)
      if (!property || !owner) return null
      // Skip block-level enterprise properties — only show individual units
      if (property.enterpriseBlock) return null
      return {
        listing,
        property,
        owner,
        brokerAssignment: assignments.find(
          (item) => item.listingId === listing.id && item.status === 'Active',
        ),
      }
    })
    .filter((bundle): bundle is PrototypeListingBundle => Boolean(bundle)), [assignments, listings, properties, users])

  const tenantListings = useMemo(() => bundles.map(toTenantProperty), [bundles])
  const savedIds = useMemo(() => new Set(
    saved.filter((item) => item.tenantId === tenantId).map((item) => item.listingId),
  ), [saved, tenantId])
  const savedListings = useMemo(
    () => tenantListings.filter((property) => savedIds.has(property.id)),
    [savedIds, tenantListings],
  )

  return {
    tenantId,
    listings: tenantListings,
    savedListings,
    savedIds,
    getProperty: (listingId: string | undefined): Property | null =>
      tenantListings.find((property) => property.id === listingId) ?? null,
    save: (listingId: string) => saveTenantProperty(tenantId, listingId),
    unsave: (listingId: string) => unsaveTenantProperty(tenantId, listingId),
    toggleSaved: (listingId: string) => {
      if (savedIds.has(listingId)) unsaveTenantProperty(tenantId, listingId)
      else saveTenantProperty(tenantId, listingId)
    },
    isSaved: (listingId: string) => savedIds.has(listingId),
  }
}
