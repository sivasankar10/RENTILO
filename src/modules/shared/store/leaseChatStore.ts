import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface LeaseChatMessage {
  id: string
  sender: 'owner' | 'tenant'
  text: string
  time: string
}

export interface LeaseChatThread {
  onboardingId: string
  ownerId: string
  tenantId: string
  tenantName: string
  tenantAvatar: string
  ownerName: string
  propertyName: string
  unit: string
  address: string
  monthlyRent: string
  messages: LeaseChatMessage[]
  updatedAt: string
}

interface LeaseChatState {
  threads: LeaseChatThread[]
  ensureThread: (payload: Omit<LeaseChatThread, 'messages' | 'updatedAt'>) => LeaseChatThread
  sendMessage: (onboardingId: string, sender: 'owner' | 'tenant', text: string) => void
  getThread: (onboardingId: string) => LeaseChatThread | undefined
}

function createMessageId() {
  return `lease-msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function formatTime(date = new Date()) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export const useLeaseChatStore = create<LeaseChatState>()(
  persist(
    (set, get) => ({
      threads: [],

      ensureThread: (payload) => {
        const existing = get().threads.find((thread) => thread.onboardingId === payload.onboardingId)
        if (existing) return existing

        const thread: LeaseChatThread = {
          ...payload,
          messages: [],
          updatedAt: formatTime(),
        }
        set((state) => ({ threads: [thread, ...state.threads] }))
        return thread
      },

      getThread: (onboardingId) => get().threads.find((thread) => thread.onboardingId === onboardingId),

      sendMessage: (onboardingId, sender, text) => {
        const trimmed = text.trim()
        if (!trimmed) return
        const now = formatTime()
        const message: LeaseChatMessage = {
          id: createMessageId(),
          sender,
          text: trimmed,
          time: now,
        }

        set((state) => ({
          threads: state.threads.map((thread) =>
            thread.onboardingId === onboardingId
              ? { ...thread, messages: [...thread.messages, message], updatedAt: now }
              : thread,
          ),
        }))
      },
    }),
    {
      name: 'rentilo-lease-chat-session',
      storage: createJSONStorage(() => sessionStorage),
      version: 1,
    },
  ),
)
