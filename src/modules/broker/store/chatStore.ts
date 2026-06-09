import { create } from 'zustand'
import { BROKER_CONVERSATIONS } from '../constants/conversations'
import type { ChatConversation, ChatMessage } from '@modules/tenant/types/chat'

interface BrokerChatState {
  conversations: ChatConversation[]
  sendMessage: (conversationId: string, text: string) => void
  markConversationRead: (conversationId: string) => void
}

function createMessageId() {
  return `broker-msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function formatTime(date = new Date()) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

export const useBrokerChatStore = create<BrokerChatState>((set) => ({
  conversations: BROKER_CONVERSATIONS,

  sendMessage: (conversationId, text) => {
    const trimmedText = text.trim()
    if (!trimmedText) return

    const now = formatTime()
    const message: ChatMessage = {
      id: createMessageId(),
      sender: 'broker',
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
