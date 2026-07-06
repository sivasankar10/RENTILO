import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import {
  getTenantListingIdForOwnerProperty,
  LISTING_PROMOTION_DURATION_DAYS,
  LISTING_PROMOTION_PRICE_INR,
} from '@shared/constants/listingPromotion'
import { usePrototypeStore } from './prototypeStore'

export interface ListingPromotion {
  ownerPropertyId: string
  tenantListingId: string
  ownerId: string
  propertyName: string
  promotedAtIso: string
  promotedUntilIso: string
  amountPaid: number
}

interface ListingPromotionState {
  promotions: ListingPromotion[]
  activatePromotion: (input: {
    ownerPropertyId: string
    ownerId: string
    propertyName: string
    amountPaid?: number
  }) => ListingPromotion | null
  getPromotionForProperty: (ownerPropertyId: string) => ListingPromotion | undefined
  isTenantListingPromoted: (tenantListingId: string) => boolean
  getActivePromotedTenantListingIds: () => string[]
}

export function isPromotionActive(promotion: ListingPromotion, now = Date.now()) {
  return new Date(promotion.promotedUntilIso).getTime() > now
}

export const useListingPromotionStore = create<ListingPromotionState>()(
  persist(
    (set, get) => ({
      promotions: [],

      activatePromotion: (input) => {
        // Try static map first, then dynamic lookup from prototype store
        let tenantListingId = getTenantListingIdForOwnerProperty(input.ownerPropertyId)
        if (!tenantListingId) {
          const listings = usePrototypeStore.getState().listings
          const listing = listings.find((l) => l.propertyId === input.ownerPropertyId)
          tenantListingId = listing?.id
        }
        if (!tenantListingId) return null

        const now = new Date()
        const existing = get().promotions.find(
          (promotion) => promotion.ownerPropertyId === input.ownerPropertyId,
        )
        const baseMs = existing && isPromotionActive(existing)
          ? new Date(existing.promotedUntilIso).getTime()
          : now.getTime()
        const promotedUntil = new Date(baseMs)
        promotedUntil.setDate(promotedUntil.getDate() + LISTING_PROMOTION_DURATION_DAYS)

        const promotion: ListingPromotion = {
          ownerPropertyId: input.ownerPropertyId,
          tenantListingId,
          ownerId: input.ownerId,
          propertyName: input.propertyName,
          promotedAtIso: now.toISOString(),
          promotedUntilIso: promotedUntil.toISOString(),
          amountPaid: input.amountPaid ?? LISTING_PROMOTION_PRICE_INR,
        }

        set((state) => ({
          promotions: [
            promotion,
            ...state.promotions.filter((item) => item.ownerPropertyId !== input.ownerPropertyId),
          ],
        }))

        return promotion
      },

      getPromotionForProperty: (ownerPropertyId) =>
        get().promotions.find((promotion) => promotion.ownerPropertyId === ownerPropertyId),

      isTenantListingPromoted: (tenantListingId) =>
        get().promotions.some(
          (promotion) =>
            promotion.tenantListingId === tenantListingId && isPromotionActive(promotion),
        ),

      getActivePromotedTenantListingIds: () =>
        get()
          .promotions.filter((promotion) => isPromotionActive(promotion))
          .map((promotion) => promotion.tenantListingId),
    }),
    {
      name: 'rentilo-listing-promotions-session',
      storage: createJSONStorage(() => sessionStorage),
      version: 1,
    },
  ),
)
