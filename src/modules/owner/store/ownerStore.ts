import { create } from 'zustand'

export interface OwnerManagedProperty {
  id: string
  name: string
  unit: string
  address: string
}

export const OWNER_MANAGED_PROPERTIES: OwnerManagedProperty[] = [
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
  securityDeposit: string
  depositUnit: string
  availableFrom: string
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

interface OwnerSessionProperty {
  id: string
  status: RegisterPropertySessionStatus
  savedAt: string
  data: OwnerRegisterPropertyFormData
}

interface OwnerState {
  selectedPropertyId: string | null
  registerPropertyDraft: OwnerRegisterPropertyFormData
  sessionRegisterProperties: OwnerSessionProperty[]
  setSelectedProperty: (id: string | null) => void
  updateRegisterPropertyDraft: <K extends keyof OwnerRegisterPropertyFormData>(
    key: K,
    value: OwnerRegisterPropertyFormData[K]
  ) => void
  saveRegisterPropertyDraft: () => void
  submitRegisterProperty: () => void
  resetRegisterPropertyDraft: () => void
}

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
  securityDeposit: '1.5',
  depositUnit: 'Months',
  availableFrom: '06/01/2024',
  leaseDuration: 12,
  noticePeriod: '30',
  utilities: { electricity: true, water: true, internet: false, gas: false },
  petPolicy: true,
  petDetails: '',
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

const createSessionProperty = (
  data: OwnerRegisterPropertyFormData,
  status: RegisterPropertySessionStatus
): OwnerSessionProperty => ({
  id: `${status}-${Date.now()}`,
  status,
  savedAt: new Date().toISOString(),
  data: cloneRegisterPropertyData(data),
})

export const useOwnerStore = create<OwnerState>((set) => ({
  selectedPropertyId: OWNER_MANAGED_PROPERTIES[0]?.id ?? null,
  registerPropertyDraft: cloneRegisterPropertyData(initialRegisterPropertyDraft),
  sessionRegisterProperties: [],
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
}))
