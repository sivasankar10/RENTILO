import { create } from 'zustand'

interface BrokerState {
  selectedClientId: string | null
  setSelectedClient: (id: string | null) => void
}

export const useBrokerStore = create<BrokerState>((set) => ({
  selectedClientId: null,
  setSelectedClient: (id) => set({ selectedClientId: id }),
}))
