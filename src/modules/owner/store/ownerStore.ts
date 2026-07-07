import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { SubscriptionPlan, SubscriptionStatus, OwnerFeature } from '../config/features'
import { hasFeature as hasFeatureForPlan, getEnabledFeatures } from '../config/features'
import { upgradeToPremium as upgradeToPremiumService, resetSubscription } from '../services/subscription.service'
import type {
  OwnerProfile,
  OwnerProperty,
  OwnerTenant,
  OwnerBroker,
  OwnerAnalytics,
} from '../types'

// ─────────────────────────────────────────────
// Managed Properties (mock data)
// ─────────────────────────────────────────────
export interface OwnerManagedProperty {
  id: string
  name: string
  unit: string
  address: string
}

export const OWNER_MANAGED_PROPERTIES: OwnerManagedProperty[] = [
  {
    id: 'property-multi-1',
    name: 'MultiOwner Skyline 14B',
    unit: '14B',
    address: 'Indiranagar, Bangalore',
  },
]

// ─────────────────────────────────────────────
// Property Registration Form
// ─────────────────────────────────────────────
export interface OwnerRegisterPropertyFormData {
  propertyName: string
  propertyType: string
  yearBuilt: string
  referenceId: string
  currentStatus: string
  description: string
  streetAddress: string
  unit: string
  postalCode: string
  city: string
  neighborhood: string
  residentialZoning: boolean
  mixedUse: boolean
  amenities: {
    wifi: boolean
    ac: boolean
    heating: boolean
    smartLock: boolean
    washerDryer: boolean
    dishwasher: boolean
  }
  buildingFeatures: {
    gym: boolean
    pool: boolean
    parking: boolean
    security: boolean
  }
  sellingPoints: string
  customTags: string[]
  photos: string[]
  virtualTourUrl: string
  baseRent: string
  priceNegotiable: boolean
  securityDeposit: string
  depositUnit: string
  availableFrom: string
  visitWeekday: string
  visitStartTime: string
  visitEndTime: string
  leaseDuration: number
  noticePeriod: string
  utilities: {
    electricity: boolean
    water: boolean
    internet: boolean
    gas: boolean
  }
  petPolicy: boolean
  petDetails: string
}

type RegisterPropertySessionStatus = 'draft' | 'submitted'
export type OwnerKycStatus = 'Not Started' | 'Pending KYC' | 'Verified'

interface OwnerSessionProperty {
  id: string
  status: RegisterPropertySessionStatus
  savedAt: string
  data: OwnerRegisterPropertyFormData
}

// ─────────────────────────────────────────────
// Owner Store State
// ─────────────────────────────────────────────
interface OwnerState {
  // Subscription state
  subscriptionPlan: SubscriptionPlan
  subscriptionStatus: SubscriptionStatus
  enabledFeatures: OwnerFeature[]
  subscribedAt: string | null
  expiresAt: string | null
  isUpgrading: boolean
  upgradeProgress: 'idle' | 'processing' | 'verifying' | 'success' | 'error'
  
  // Profile
  profile: OwnerProfile | null
  
  // Properties
  properties: OwnerProperty[]
  selectedPropertyId: string | null
  
  // Tenants
  tenants: OwnerTenant[]
  
  // Brokers (premium feature)
  brokers: OwnerBroker[]
  
  // Analytics (premium feature)
  analytics: OwnerAnalytics | null
  
  // Property registration
  registerPropertyDraft: OwnerRegisterPropertyFormData
  sessionRegisterProperties: OwnerSessionProperty[]
  propertyEditDrafts: Record<string, OwnerRegisterPropertyFormData>
  savedPropertyEditIds: string[]
  kycStatus: OwnerKycStatus
  brokerIntegrationEnabled: boolean
  assignedBrokerId: string | null
  brokerReleasedPropertyIds: string[]
  setSelectedProperty: (id: string | null) => void

  // Upgrade dialog UI state
  showUpgradeDialog: boolean
  upgradeFeature: OwnerFeature | null

  // Actions - Subscription
  hasFeature: (feature: OwnerFeature) => boolean
  upgradeToPremium: () => Promise<void>
  setSubscriptionPlan: (plan: SubscriptionPlan) => void
  resetSubscriptionState: () => void
  showUpgradePrompt: (feature: OwnerFeature) => void
  hideUpgradeDialog: () => void

  // Actions - Tenants
  setTenants: (tenants: OwnerTenant[]) => void
  
  // Actions - Brokers
  setBrokers: (brokers: OwnerBroker[]) => void
  
  // Actions - Analytics
  setAnalytics: (analytics: OwnerAnalytics) => void
  
  // Actions - Property registration
  updateRegisterPropertyDraft: <K extends keyof OwnerRegisterPropertyFormData>(
    key: K,
    value: OwnerRegisterPropertyFormData[K]
  ) => void
  saveRegisterPropertyDraft: () => void
  submitRegisterProperty: () => void
  resetRegisterPropertyDraft: () => void
  getPropertyEditDraft: (propertyId: string) => OwnerRegisterPropertyFormData
  updatePropertyEditDraft: <K extends keyof OwnerRegisterPropertyFormData>(
    propertyId: string,
    key: K,
    value: OwnerRegisterPropertyFormData[K]
  ) => void
  savePropertyEditDraft: (propertyId: string) => void
  setKycStatus: (status: OwnerKycStatus) => void
  enableBrokerIntegration: () => void
  assignBrokerToProperty: (brokerId: string) => void
  removeBrokerFromProperty: () => void
  releaseBrokerForProperty: (propertyId: string) => void
  isBrokerReleasedForProperty: (propertyId: string) => boolean
}

// ─────────────────────────────────────────────
// Initial State
// ─────────────────────────────────────────────
const initialRegisterPropertyDraft: OwnerRegisterPropertyFormData = {
  propertyName: '',
  propertyType: '',
  yearBuilt: '',
  referenceId: '',
  currentStatus: 'Available for Rent',
  description: '',
  streetAddress: '',
  unit: '',
  postalCode: '',
  city: '',
  neighborhood: '',
  residentialZoning: true,
  mixedUse: false,
  amenities: {
    wifi: false,
    ac: true,
    heating: true,
    smartLock: false,
    washerDryer: false,
    dishwasher: false,
  },
  buildingFeatures: {
    gym: false,
    pool: false,
    parking: true,
    security: true,
  },
  sellingPoints: '',
  customTags: [],
  photos: [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=80',
  ],
  virtualTourUrl: '',
  baseRent: '2400',
  priceNegotiable: true,
  securityDeposit: '1.5',
  depositUnit: 'Months',
  availableFrom: '06/01/2024',
  visitWeekday: 'Saturday',
  visitStartTime: '10:00 AM',
  visitEndTime: '1:00 PM',
  leaseDuration: 12,
  noticePeriod: '30',
  utilities: { electricity: true, water: true, internet: false, gas: false },
  petPolicy: true,
  petDetails: '',
}

const seededPropertyEditDrafts: Record<string, OwnerRegisterPropertyFormData> = {
  'property-multi-1': {
    propertyName: 'MultiOwner Skyline 14B',
    propertyType: 'Apartment',
    yearBuilt: '2021',
    referenceId: 'SKYLINE-14B',
    currentStatus: 'Available for Rent',
    description:
      'MultiOwner Skyline 14B is a session-prototype listing with verified owner details, visit scheduling, agreement flow, and cross-role visibility. 2 bedrooms, 2 bathrooms, 1,240 sqft with semi-furnished interiors.',
    streetAddress: '14B Skyline Plaza, Indiranagar',
    unit: '14B',
    postalCode: '560001',
    city: 'Bangalore',
    neighborhood: 'Indiranagar',
    residentialZoning: true,
    mixedUse: false,
    amenities: {
      wifi: true,
      ac: true,
      heating: true,
      smartLock: true,
      washerDryer: true,
      dishwasher: true,
    },
    buildingFeatures: {
      gym: true,
      pool: true,
      parking: true,
      security: true,
    },
    sellingPoints:
      'Semi-furnished apartment with gated security, fitness center, bike and car parking, and pet-friendly policy.',
    customTags: ['2 Beds', '2 Baths', '1,240 sqft', 'Semi-Furnished', 'Bike and Car'],
    photos: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556912173-46c336c7fd55?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80',
    ],
    virtualTourUrl: '',
    baseRent: '85000',
    priceNegotiable: true,
    securityDeposit: '170000',
    depositUnit: 'Fixed',
    availableFrom: '07/15/2026',
    visitWeekday: 'Saturday',
    visitStartTime: '10:00 AM',
    visitEndTime: '1:00 PM',
    leaseDuration: 12,
    noticePeriod: '30',
    utilities: { electricity: false, water: true, internet: true, gas: false },
    petPolicy: true,
    petDetails: 'Pets allowed with owner approval. Common-area cleaning and damage rules apply.',
  },
}

const cloneRegisterPropertyData = (
  data: OwnerRegisterPropertyFormData
): OwnerRegisterPropertyFormData => ({
  ...data,
  amenities: { ...data.amenities },
  buildingFeatures: { ...data.buildingFeatures },
  customTags: [...data.customTags],
  photos: [...data.photos],
  utilities: { ...data.utilities },
})

const getSeededEditDraft = (propertyId: string): OwnerRegisterPropertyFormData =>
  cloneRegisterPropertyData(seededPropertyEditDrafts[propertyId] ?? initialRegisterPropertyDraft)

const createSessionProperty = (
  data: OwnerRegisterPropertyFormData,
  status: RegisterPropertySessionStatus
): OwnerSessionProperty => ({
  id: `${status}-${Date.now()}`,
  status,
  savedAt: new Date().toISOString(),
  data: cloneRegisterPropertyData(data),
})

export const useOwnerStore = create<OwnerState>()(
  persist(
    (set, get) => ({
      // Subscription defaults (FREE plan, no features enabled)
      subscriptionPlan: 'FREE',
      subscriptionStatus: 'active',
      enabledFeatures: getEnabledFeatures('FREE'),
      subscribedAt: null,
      expiresAt: null,
      isUpgrading: false,
      upgradeProgress: 'idle',
      showUpgradeDialog: false,
      upgradeFeature: null,

      // Profile / properties / tenants / brokers / analytics — unused placeholders for now
      profile: null,
      properties: [],
      tenants: [],
      brokers: [],
      analytics: null,

      selectedPropertyId: OWNER_MANAGED_PROPERTIES[0]?.id ?? null,
      registerPropertyDraft: cloneRegisterPropertyData(initialRegisterPropertyDraft),
      sessionRegisterProperties: [],
      propertyEditDrafts: {},
      savedPropertyEditIds: [],
      kycStatus: 'Not Started',
      brokerIntegrationEnabled: false,
      assignedBrokerId: null,
      brokerReleasedPropertyIds: [],
      setSelectedProperty: (id) => set({ selectedPropertyId: id }),

      // ── Subscription actions ──────────────────────────────
      hasFeature: (feature) => hasFeatureForPlan(get().subscriptionPlan, feature),
      upgradeToPremium: async () => {
        set({ isUpgrading: true, upgradeProgress: 'processing' })
        try {
          const data = await upgradeToPremiumService((status) => set({ upgradeProgress: status }))
          set({
            subscriptionPlan: data.subscriptionPlan,
            subscriptionStatus: data.subscriptionStatus,
            enabledFeatures: data.enabledFeatures,
            subscribedAt: data.subscribedAt ?? null,
            expiresAt: data.expiresAt ?? null,
            isUpgrading: false,
            upgradeProgress: 'success',
            showUpgradeDialog: false,
            upgradeFeature: null,
          })
        } catch (error) {
          set({ isUpgrading: false, upgradeProgress: 'error' })
          throw error
        }
      },
      setSubscriptionPlan: (plan) =>
        set({
          subscriptionPlan: plan,
          enabledFeatures: getEnabledFeatures(plan),
          subscriptionStatus: 'active',
          subscribedAt: plan === 'PREMIUM' ? new Date().toISOString() : null,
        }),
      resetSubscriptionState: () => {
        const data = resetSubscription()
        set({
          subscriptionPlan: data.subscriptionPlan,
          subscriptionStatus: data.subscriptionStatus,
          enabledFeatures: data.enabledFeatures,
          subscribedAt: null,
          expiresAt: null,
          isUpgrading: false,
          upgradeProgress: 'idle',
          showUpgradeDialog: false,
          upgradeFeature: null,
        })
      },
      showUpgradePrompt: (feature) => set({ showUpgradeDialog: true, upgradeFeature: feature }),
      hideUpgradeDialog: () => set({ showUpgradeDialog: false, upgradeFeature: null }),

      // ── Tenants / Brokers / Analytics setters ─────────────
      setTenants: (tenants) => set({ tenants }),
      setBrokers: (brokers) => set({ brokers }),
      setAnalytics: (analytics) => set({ analytics }),
      updateRegisterPropertyDraft: (key, value) =>
        set((state) => ({
          registerPropertyDraft: {
            ...state.registerPropertyDraft,
            [key]: value,
          },
        })),
      saveRegisterPropertyDraft: () =>
        set((state) => ({
          sessionRegisterProperties: [
            createSessionProperty(state.registerPropertyDraft, 'draft'),
            ...state.sessionRegisterProperties,
          ],
        })),
      submitRegisterProperty: () =>
        set((state) => ({
          sessionRegisterProperties: [
            createSessionProperty(state.registerPropertyDraft, 'submitted'),
            ...state.sessionRegisterProperties,
          ],
        })),
      resetRegisterPropertyDraft: () =>
        set({ registerPropertyDraft: cloneRegisterPropertyData(initialRegisterPropertyDraft) }),
      getPropertyEditDraft: (propertyId) => {
        const draft = get().propertyEditDrafts[propertyId]
        return cloneRegisterPropertyData(draft ?? getSeededEditDraft(propertyId))
      },
      updatePropertyEditDraft: (propertyId, key, value) =>
        set((state) => {
          const currentDraft = state.propertyEditDrafts[propertyId] ?? getSeededEditDraft(propertyId)
          return {
            propertyEditDrafts: {
              ...state.propertyEditDrafts,
              [propertyId]: cloneRegisterPropertyData({
                ...currentDraft,
                [key]: value,
              }),
            },
          }
        }),
      savePropertyEditDraft: (propertyId) =>
        set((state) => {
          const currentDraft = state.propertyEditDrafts[propertyId] ?? getSeededEditDraft(propertyId)
          return {
            propertyEditDrafts: {
              ...state.propertyEditDrafts,
              [propertyId]: cloneRegisterPropertyData(currentDraft),
            },
            savedPropertyEditIds: Array.from(new Set([propertyId, ...state.savedPropertyEditIds])),
          }
        }),
      setKycStatus: (status) => set({ kycStatus: status }),
      enableBrokerIntegration: () => set({ brokerIntegrationEnabled: true }),
      assignBrokerToProperty: (brokerId) => set({ assignedBrokerId: brokerId, brokerIntegrationEnabled: true }),
      removeBrokerFromProperty: () => set({ assignedBrokerId: null }),
      releaseBrokerForProperty: (propertyId) =>
        set((state) => ({
          brokerReleasedPropertyIds: state.brokerReleasedPropertyIds.includes(propertyId)
            ? state.brokerReleasedPropertyIds
            : [...state.brokerReleasedPropertyIds, propertyId],
          assignedBrokerId: null,
        })),
      isBrokerReleasedForProperty: (propertyId) =>
        get().brokerReleasedPropertyIds.includes(propertyId),
    }),
    {
      name: 'rentilo-owner-session',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)






