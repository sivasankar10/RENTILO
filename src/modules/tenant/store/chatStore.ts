import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { TENANT_CONVERSATIONS } from '../constants/conversations'
import type { ChatConversation, ChatMessage } from '../types/chat'
import { useLeaseChatStore } from '@shared/store/leaseChatStore'

interface ChatState {
  conversations: ChatConversation[]
  sendMessage: (conversationId: string, text: string) => void
  markConversationRead: (conversationId: string) => void
  ensureOwnerConversation: (payload: {
    onboardingId: string
    ownerId: string
    ownerName: string
    tenantId: string
    tenantName: string
    tenantAvatar: string
    propertyName: string
    unit: string
    address: string
    monthlyRent: string
    ownerAvatar?: string
  }) => string
}

function createMessageId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function formatTime(date = new Date()) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

export const useTenantChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: TENANT_CONVERSATIONS,

      sendMessage: (conversationId, text) => {
        const trimmedText = text.trim()
        if (!trimmedText) return

        const conversation = get().conversations.find((item) => item.id === conversationId)
        if (conversation?.id.startsWith('lease-')) {
          const onboardingId = conversation.id.replace('lease-', '')
          useLeaseChatStore.getState().sendMessage(onboardingId, 'tenant', trimmedText)
        }

        const now = formatTime()
        const message: ChatMessage = {
          id: createMessageId(),
          sender: 'tenant',
          text: trimmedText,
          time: now,
          read: true,
        }

        set((state) => ({
          conversations: state.conversations.map((item) =>
            item.id === conversationId
              ? {
                  ...item,
                  messages: [...item.messages, message],
                  lastMessage: trimmedText,
                  timeLabel: now,
                  unreadCount: 0,
                }
              : item,
          ),
        }))
      },

      markConversationRead: (conversationId) => {
        set((state) => ({
          conversations: state.conversations.map((conversation) =>
            conversation.id === conversationId
              ? { ...conversation, unreadCount: 0 }
              : conversation,
          ),
        }))
      },

      ensureOwnerConversation: (payload) => {
        const conversationId = `lease-${payload.onboardingId}`
        const existing = get().conversations.find((conversation) => conversation.id === conversationId)
        if (!existing) {
          const conversation: ChatConversation = {
            id: conversationId,
            contactName: payload.ownerName,
            contactRole: 'owner',
            avatar:
              payload.ownerAvatar ??
              'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80',
            lastMessage: 'Lease conversation started',
            timeLabel: formatTime(),
            unreadCount: 0,
            online: true,
            propertyTitle: `${payload.propertyName} · ${payload.unit}`,
            propertySubtitle: payload.propertyName,
            propertyLocation: payload.address,
            propertyPrice: payload.monthlyRent,
            propertyImage:
              'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&q=80',
            messages: [],
          }
          set((state) => ({ conversations: [conversation, ...state.conversations] }))
        }

        useLeaseChatStore.getState().ensureThread({
          onboardingId: payload.onboardingId,
          ownerId: payload.ownerId,
          tenantId: payload.tenantId,
          tenantName: payload.tenantName,
          tenantAvatar: payload.tenantAvatar,
          ownerName: payload.ownerName,
          propertyName: payload.propertyName,
          unit: payload.unit,
          address: payload.address,
          monthlyRent: payload.monthlyRent,
        })

        return conversationId
      },
    }),
    {
      name: 'rentilo-tenant-chat-session',
      storage: createJSONStorage(() => sessionStorage),
      version: 1,
    },
  ),
)
