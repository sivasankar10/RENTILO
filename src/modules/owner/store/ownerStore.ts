<<<<<<< HEAD
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { 
  SubscriptionPlan, 
  SubscriptionStatus, 
  OwnerFeature 
} from '../config/features'
import { hasFeature, getEnabledFeatures } from '../config/features'
import { 
  getSubscription, 
  upgradeToPremium as upgradeSubscription,
  downgradeToFree as downgradeSubscription,
  resetSubscription,
  type SubscriptionData 
} from '../services/subscription.service'
import type {
  OwnerProfile,
  OwnerProperty,
  OwnerTenant,
  OwnerBroker,
  OwnerAnalytics,
} from '../types'
=======
﻿import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
>>>>>>> main

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
    id: 'opus-tower-14b',
    name: 'The Opus Tower, 14B',
    unit: 'Unit 14B',
    address: 'Downtown Financial District',
  },
  {
    id: 'modern-penthouse-suite',
    name: 'Modern Penthouse Suite',
    unit: 'Unit 14B',
    address: 'Adyar, Chennai',
  },
  {
    id: 'parkview-residences',
    name: 'Parkview Residences',
    unit: 'Unit 204',
    address: 'Velachery, Chennai',
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
<<<<<<< HEAD
  
  // UI State
  isLoading: boolean
  showUpgradeDialog: boolean
  upgradeFeature: OwnerFeature | null
  
  // Actions - Subscription
  setSubscriptionPlan: (plan: SubscriptionPlan) => void
  setSubscriptionStatus: (status: SubscriptionStatus) => void
  upgradeToPremium: () => Promise<void>
  downgradeToFree: () => void
  resetSubscriptionState: () => void
  initializeSubscription: () => void
  applySubscriptionData: (data: SubscriptionData) => void
  
  // Actions - Feature check
  hasFeature: (feature: OwnerFeature) => boolean
  showUpgradePrompt: (feature: OwnerFeature) => void
  hideUpgradeDialog: () => void
  
  // Actions - Profile
  setProfile: (profile: OwnerProfile) => void
  
  // Actions - Properties
  setProperties: (properties: OwnerProperty[]) => void
=======
  propertyEditDrafts: Record<string, OwnerRegisterPropertyFormData>
  savedPropertyEditIds: string[]
  kycStatus: OwnerKycStatus
  brokerIntegrationEnabled: boolean
  assignedBrokerId: string | null
  brokerReleasedPropertyIds: string[]
>>>>>>> main
  setSelectedProperty: (id: string | null) => void
  
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
<<<<<<< HEAD
  
  // Actions - UI
  setIsLoading: (loading: boolean) => void
  
  // Reset
  reset: () => void
=======
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
>>>>>>> main
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

<<<<<<< HEAD
const initialState = {
  subscriptionPlan: 'FREE' as SubscriptionPlan,
  subscriptionStatus: 'active' as SubscriptionStatus,
  enabledFeatures: [] as OwnerFeature[],
  subscribedAt: null as string | null,
  expiresAt: null as string | null,
  isUpgrading: false,
  upgradeProgress: 'idle' as const,
  profile: null,
  properties: [],
  selectedPropertyId: OWNER_MANAGED_PROPERTIES[0]?.id ?? null,
  tenants: [],
  brokers: [],
  analytics: null,
  registerPropertyDraft: { ...initialRegisterPropertyDraft },
  sessionRegisterProperties: [],
  isLoading: false,
  showUpgradeDialog: false,
  upgradeFeature: null,
}

// ─────────────────────────────────────────────
// Utility Functions
// ─────────────────────────────────────────────
=======
const seededPropertyEditDrafts: Record<string, OwnerRegisterPropertyFormData> = {
  'opus-tower-14b': {
    propertyName: 'The Opus Tower, 14B',
    propertyType: 'Luxury Apartment',
    yearBuilt: '2021',
    referenceId: 'OPUS-14B',
    currentStatus: 'Available for Rent',
    description:
      'Experience unparalleled luxury in this stunning high-rise residence at The Opus Tower. The home includes 2 bedrooms, 2 bathrooms, 1,200 sqft, hardwood flooring, floor-to-ceiling windows, a modular kitchen, and premium resident amenities.',
    streetAddress: 'The Opus Tower, Downtown Financial District',
    unit: 'Unit 14B',
    postalCode: '600001',
    city: 'Chennai',
    neighborhood: 'Downtown Financial District',
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
      'Semi-furnished apartment with sofa, wardrobes, dining setup, modular kitchen, secure parking, pet-friendly policy, and 24/7 gated security.',
    customTags: ['2 Beds', '2 Baths', '1,200 sqft', 'Semi-Furnished', 'Both Parking'],
    photos: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=500&q=80',
    ],
    virtualTourUrl: 'https://rentilo.example/tours/opus-14b',
    baseRent: '4500',
    securityDeposit: '9000',
    depositUnit: 'Fixed',
    availableFrom: '06/24/2026',
    leaseDuration: 12,
    noticePeriod: '30',
    utilities: { electricity: false, water: true, internet: true, gas: false },
    petPolicy: true,
    petDetails: 'Pets allowed with owner approval. Common-area cleaning and damage rules apply.',
  },
}

>>>>>>> main
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

<<<<<<< HEAD
// ─────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────
export const useOwnerStore = create<OwnerState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Initialize subscription from Local Storage on app load
      initializeSubscription: () => {
        const data = getSubscription()
        set({
          subscriptionPlan: data.subscriptionPlan,
          subscriptionStatus: data.subscriptionStatus,
          enabledFeatures: data.enabledFeatures,
          subscribedAt: data.subscribedAt ?? null,
          expiresAt: data.expiresAt ?? null,
        })
      },
      
      // Apply subscription data from service
      applySubscriptionData: (data: SubscriptionData) => {
        set({
          subscriptionPlan: data.subscriptionPlan,
          subscriptionStatus: data.subscriptionStatus,
          enabledFeatures: data.enabledFeatures,
          subscribedAt: data.subscribedAt ?? null,
          expiresAt: data.expiresAt ?? null,
        })
      },
      
      // Subscription actions
      setSubscriptionPlan: (plan) => set({ 
        subscriptionPlan: plan,
        enabledFeatures: getEnabledFeatures(plan),
      }),
      
      setSubscriptionStatus: (status) => set({ subscriptionStatus: status }),
      
      upgradeToPremium: async () => {
        set({ isUpgrading: true, upgradeProgress: 'idle' })
        
        try {
          const data = await upgradeSubscription((status) => {
            set({ upgradeProgress: status })
          })
          
          set({ 
            subscriptionPlan: data.subscriptionPlan,
            subscriptionStatus: data.subscriptionStatus,
            enabledFeatures: data.enabledFeatures,
            subscribedAt: data.subscribedAt ?? null,
            expiresAt: data.expiresAt ?? null,
            showUpgradeDialog: false,
            upgradeFeature: null,
            isUpgrading: false,
            upgradeProgress: 'success',
          })
        } catch (error) {
          set({ 
            isUpgrading: false, 
            upgradeProgress: 'error' 
          })
          throw error
        }
      },
      
      downgradeToFree: () => {
        const data = downgradeSubscription()
        set({ 
          subscriptionPlan: data.subscriptionPlan,
          subscriptionStatus: data.subscriptionStatus,
          enabledFeatures: data.enabledFeatures,
          subscribedAt: null,
          expiresAt: null,
        })
      },
      
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
        })
      },
      
      // Feature check
      hasFeature: (feature) => {
        const { subscriptionPlan } = get()
        return hasFeature(subscriptionPlan, feature)
      },
      
      showUpgradePrompt: (feature) => set({ 
        showUpgradeDialog: true, 
        upgradeFeature: feature 
      }),
      
      hideUpgradeDialog: () => set({ 
        showUpgradeDialog: false, 
        upgradeFeature: null 
      }),
      
      // Profile actions
      setProfile: (profile) => set({ profile }),
      
      // Property actions
      setProperties: (properties) => set({ properties }),
      setSelectedProperty: (id) => set({ selectedPropertyId: id }),
      
      // Tenant actions
      setTenants: (tenants) => set({ tenants }),
      
      // Broker actions
      setBrokers: (brokers) => set({ brokers }),
      
      // Analytics actions
      setAnalytics: (analytics) => set({ analytics }),
      
      // Property registration actions
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
      
      // UI actions
      setIsLoading: (isLoading) => set({ isLoading }),
      
      // Reset
      reset: () => set(initialState),
    }),
    {
      name: 'owner-store',
      partialize: (state) => ({
        selectedPropertyId: state.selectedPropertyId,
      }),
      // Note: We don't persist subscription here anymore - it's handled by subscription.service.ts
=======
export const useOwnerStore = create<OwnerState>()(
  persist(
    (set, get) => ({
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
>>>>>>> main
    }
  )
)

<<<<<<< HEAD
// Initialize subscription on store creation
if (typeof window !== 'undefined') {
  // Defer initialization to avoid SSR issues
  setTimeout(() => {
    useOwnerStore.getState().initializeSubscription()
  }, 0)
}
=======





>>>>>>> main
