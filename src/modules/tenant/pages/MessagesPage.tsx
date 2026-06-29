import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ConversationSidebar } from '../components/chat/ConversationSidebar'
import { ChatWindow } from '../components/chat/ChatWindow'
import { useTenantChatStore } from '../store/chatStore'
import { useLeaseChatStore } from '@shared/store/leaseChatStore'
import type { ChatConversation } from '../types/chat'

export function MessagesPage() {
  const [searchParams] = useSearchParams()
  const conversations = useTenantChatStore((state) => state.conversations)
  const leaseThreads = useLeaseChatStore((state) => state.threads)
  const sendMessage = useTenantChatStore((state) => state.sendMessage)
  const markConversationRead = useTenantChatStore((state) => state.markConversationRead)
  const paramConversationId = searchParams.get('conversationId') ?? ''
  const [activeId, setActiveId] = useState(paramConversationId || conversations[0]?.id || '')

  const mergedConversations = useMemo(() => {
    return conversations.map((conversation) => {
      if (!conversation.id.startsWith('lease-')) return conversation
      const onboardingId = conversation.id.replace('lease-', '')
      const thread = leaseThreads.find((item) => item.onboardingId === onboardingId)
      if (!thread?.messages.length) return conversation

      const messages = thread.messages.map((message) => ({
        id: message.id,
        sender: message.sender,
        text: message.text,
        time: message.time,
        read: message.sender === 'tenant',
      }))
      const last = thread.messages.at(-1)

      return {
        ...conversation,
        messages,
        lastMessage: last?.text ?? conversation.lastMessage,
        timeLabel: thread.updatedAt,
      } satisfies ChatConversation
    })
  }, [conversations, leaseThreads])

  const activeConversation = useMemo(
    () => mergedConversations.find((c) => c.id === activeId) ?? mergedConversations[0],
    [activeId, mergedConversations],
  )

  useEffect(() => {
    if (paramConversationId) {
      setActiveId(paramConversationId)
    }
  }, [paramConversationId])

  useEffect(() => {
    if (activeConversation) {
      markConversationRead(activeConversation.id)
    }
  }, [activeConversation?.id, markConversationRead])

  if (!activeConversation) {
    return null
  }

  return (
    <div className="flex flex-1 min-h-0 max-h-[calc(100vh-73px)] bg-brand-background">
      <ConversationSidebar
        conversations={mergedConversations}
        activeId={activeConversation.id}
        onSelect={setActiveId}
      />
      <ChatWindow conversation={activeConversation} onSendMessage={sendMessage} />
    </div>
  )
}
