import { create } from 'zustand'

interface OwnerState {
  selectedPropertyId: string | null
  setSelectedProperty: (id: string | null) => void
}

export const useOwnerStore = create<OwnerState>((set) => ({
  selectedPropertyId: null,
  setSelectedProperty: (id) => set({ selectedPropertyId: id }),
}))
