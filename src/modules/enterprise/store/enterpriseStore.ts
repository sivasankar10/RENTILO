import { create } from 'zustand'

interface EnterpriseState {
  selectedTeamMemberId: string | null
  setSelectedTeamMember: (id: string | null) => void
  // Shared sidebar selection state
  selectedProperty: string
  selectedBlockId: string
  setSelectedProperty: (name: string) => void
  setSelectedBlockId: (id: string) => void
}

export const useEnterpriseStore = create<EnterpriseState>((set) => ({
  selectedTeamMemberId: null,
  setSelectedTeamMember: (id) => set({ selectedTeamMemberId: id }),
  selectedProperty: '',
  selectedBlockId: '',
  setSelectedProperty: (name) => set({ selectedProperty: name, selectedBlockId: '' }),
  setSelectedBlockId: (id) => set({ selectedBlockId: id }),
}))
