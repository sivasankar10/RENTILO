import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ConversationSidebar } from '../components/chat/ConversationSidebar'
import { ChatWindow } from '../components/chat/ChatWindow'
import { useTenantChatStore } from '../store/chatStore'
import { useLeaseChatStore } from '@shared/store/leaseChatStore'
import { useTenantId } from '../hooks/useTenantId'
import { TenantHomeBackBar } from '../components/TenantHomeBackBar'
import type { ChatConversation } from '../types/chat'

export function MessagesPage() {
  const [searchParams] = useSearchParams()
  const tenantId = useTenantId()
  const conversations = useTenantChatStore((state) => state.conversations)
  const leaseThreads = useLeaseChatStore((state) => state.threads)
  const sendMessage = useTenantChatStore((state) => state.sendMessage)
  const sendLeaseMessage = useLeaseChatStore((state) => state.sendMessage)
  const markConversationRead = useTenantChatStore((state) => state.markConversationRead)
  const paramConversationId = searchParams.get('conversationId') ?? ''

  const mergedConversations = useMemo(() => {
    const shared = leaseThreads
      .filter((thread) => thread.tenantId === tenantId)
      .map<ChatConversation>((thread) => {
        const last = thread.messages.at(-1)
        return {
          id: `lease-${thread.onboardingId}`,
          contactName: thread.ownerName,
          contactRole: 'owner',
          avatar: '',
          lastMessage: last?.text ?? 'Lease conversation started',
          timeLabel: last?.time ?? 'Now',
          unreadCount: 0,
          online: true,
          propertyTitle: `${thread.propertyName} · ${thread.unit}`,
          propertySubtitle: thread.propertyName,
          propertyLocation: thread.address,
          propertyPrice: thread.monthlyRent,
          propertyImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=240&q=80',
          messages: thread.messages.map((message) => ({
            id: message.id,
            sender: message.sender,
            text: message.text,
            time: message.time,
            read: message.sender === 'tenant',
          })),
        }
      })
    const sharedIds = new Set(shared.map((conversation) => conversation.id))
    return [...shared, ...conversations.filter((conversation) => !sharedIds.has(conversation.id))]
  }, [conversations, leaseThreads, tenantId])

  const [activeId, setActiveId] = useState(paramConversationId || mergedConversations[0]?.id || '')
  const activeConversation = useMemo(
    () => mergedConversations.find((conversation) => conversation.id === activeId) ?? mergedConversations[0],
    [activeId, mergedConversations],
  )

  useEffect(() => {
    if (paramConversationId) setActiveId(paramConversationId)
  }, [paramConversationId])

  const activeConversationId = activeConversation?.id

  useEffect(() => {
    if (activeConversationId) markConversationRead(activeConversationId)
  }, [activeConversationId, markConversationRead])

  if (!activeConversation) return null

  const handleSendMessage = (conversationId: string, text: string) => {
    if (conversationId.startsWith('lease-')) {
      sendLeaseMessage(conversationId.replace('lease-', ''), 'tenant', text)
      return
    }
    sendMessage(conversationId, text)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-brand-background">
      <div className="px-6 pt-4">
        <TenantHomeBackBar />
      </div>
      <div className="flex max-h-[calc(100vh-73px)] min-h-0 flex-1">
        <ConversationSidebar conversations={mergedConversations} activeId={activeConversation.id} onSelect={setActiveId} />
        <ChatWindow conversation={activeConversation} onSendMessage={handleSendMessage} />
      </div>
    </div>
  )
}
