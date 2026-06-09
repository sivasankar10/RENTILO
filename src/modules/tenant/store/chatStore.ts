import { create } from 'zustand'
import { TENANT_CONVERSATIONS } from '../constants/conversations'
import type { ChatConversation, ChatMessage } from '../types/chat'

interface ChatState {
  conversations: ChatConversation[]
  sendMessage: (conversationId: string, text: string) => void
  markConversationRead: (conversationId: string) => void
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

export const useTenantChatStore = create<ChatState>((set) => ({
  conversations: TENANT_CONVERSATIONS,

  sendMessage: (conversationId, text) => {
    const trimmedText = text.trim()
    if (!trimmedText) return

    const now = formatTime()
    const message: ChatMessage = {
      id: createMessageId(),
      sender: 'tenant',
      text: trimmedText,
      time: now,
      read: true,
    }

    set((state) => ({
      conversations: state.conversations.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              messages: [...conversation.messages, message],
              lastMessage: trimmedText,
              timeLabel: now,
              unreadCount: 0,
            }
          : conversation
      ),
    }))
  },

  markConversationRead: (conversationId) => {
    set((state) => ({
      conversations: state.conversations.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, unreadCount: 0 }
          : conversation
      ),
    }))
  },
}))
