import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

/**
 * Persisted read/deleted state for the Admin notifications page.
 *
 * The Admin notifications page shows a mix of static demo notifications and
 * shared prototype-store notifications. Shared ones already persist their read
 * state in `usePrototypeStore`, but the static demo ones had no persistent home
 * — so reads were lost on remount and the header bell could not tell whether
 * every notification had been read. This store gives the static notifications a
 * shared, persisted read/deleted state that both the page and the layout read.
 */
interface AdminNotificationsReadState {
  readIds: string[]
  deletedIds: string[]
  markRead: (id: string) => void
  markManyRead: (ids: string[]) => void
  remove: (id: string) => void
  reset: () => void
}

export const useAdminNotificationsReadStore = create<AdminNotificationsReadState>()(
  persist(
    (set) => ({
      readIds: [],
      deletedIds: [],
      markRead: (id) =>
        set((state) =>
          state.readIds.includes(id) ? state : { readIds: [...state.readIds, id] },
        ),
      markManyRead: (ids) =>
        set((state) => ({ readIds: [...new Set([...state.readIds, ...ids])] })),
      remove: (id) =>
        set((state) =>
          state.deletedIds.includes(id) ? state : { deletedIds: [...state.deletedIds, id] },
        ),
      reset: () => set({ readIds: [], deletedIds: [] }),
    }),
    {
      name: 'rentilo-admin-notifications-read',
      storage: createJSONStorage(() => sessionStorage),
      version: 1,
    },
  ),
)
