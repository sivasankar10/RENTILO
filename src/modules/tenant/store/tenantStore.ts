import { create } from 'zustand'

interface TenantState {
  selectedPropertyId: string | null
  setSelectedProperty: (id: string | null) => void
}

export const useTenantStore = create<TenantState>((set) => ({
  selectedPropertyId: null,
  setSelectedProperty: (id) => set({ selectedPropertyId: id }),
}))
