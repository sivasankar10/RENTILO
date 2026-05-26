import { create } from 'zustand'

interface SavedPropertiesState {
  savedPropertyIds: string[]
  toggleSaved: (id: string) => void
  saveProperty: (id: string) => void
  isSaved: (id: string) => boolean
}

export const useSavedPropertiesStore = create<SavedPropertiesState>((set, get) => ({
  savedPropertyIds: [],

  toggleSaved: (id) =>
    set((state) => ({
      savedPropertyIds: state.savedPropertyIds.includes(id)
        ? state.savedPropertyIds.filter((item) => item !== id)
        : [...state.savedPropertyIds, id],
    })),

  saveProperty: (id) =>
    set((state) => ({
      savedPropertyIds: state.savedPropertyIds.includes(id)
        ? state.savedPropertyIds
        : [...state.savedPropertyIds, id],
    })),

  isSaved: (id) => get().savedPropertyIds.includes(id),
}))
