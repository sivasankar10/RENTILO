import { create } from 'zustand'

interface EnterpriseState {
  selectedTeamMemberId: string | null
  setSelectedTeamMember: (id: string | null) => void
}

export const useEnterpriseStore = create<EnterpriseState>((set) => ({
  selectedTeamMemberId: null,
  setSelectedTeamMember: (id) => set({ selectedTeamMemberId: id }),
}))
