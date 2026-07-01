import { useMemo } from 'react'
import { useAuth } from '@shared/hooks/useAuth'
import { usePrototypeStore } from '@shared/store/prototypeStore'
import type { PrototypeProperty } from '@shared/types/prototype'

export function useOwnerPrototype() {
  const { user } = useAuth()
  const ownerId = user?.id ?? ''
  const allProperties = usePrototypeStore((state) => state.properties)
  const listings = usePrototypeStore((state) => state.listings)
  const createOwnerProperty = usePrototypeStore((state) => state.createOwnerProperty)
  const updateOwnerProperty = usePrototypeStore((state) => state.updateOwnerProperty)

  const properties = useMemo(
    () => allProperties.filter((property) => property.ownerId === ownerId),
    [allProperties, ownerId],
  )

  return {
    ownerId,
    properties,
    listings: listings.filter((listing) => listing.ownerId === ownerId),
    createProperty: (formData: Parameters<typeof createOwnerProperty>[1]) =>
      createOwnerProperty(ownerId, formData),
    updateProperty: (propertyId: string, patch: Partial<PrototypeProperty>) =>
      updateOwnerProperty(propertyId, patch),
  }
}

