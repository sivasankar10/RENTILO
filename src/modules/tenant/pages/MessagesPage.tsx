import { useEffect, useMemo, useState } from 'react'
import { ConversationSidebar } from '../components/chat/ConversationSidebar'
import { ChatWindow } from '../components/chat/ChatWindow'
import { useTenantChatStore } from '../store/chatStore'

export function MessagesPage() {
  const conversations = useTenantChatStore((state) => state.conversations)
  const sendMessage = useTenantChatStore((state) => state.sendMessage)
  const markConversationRead = useTenantChatStore((state) => state.markConversationRead)
  const [activeId, setActiveId] = useState(conversations[0]?.id ?? '')

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? conversations[0],
    [activeId, conversations]
  )

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
        conversations={conversations}
        activeId={activeConversation.id}
        onSelect={setActiveId}
      />
      <ChatWindow conversation={activeConversation} onSendMessage={sendMessage} />
    </div>
  )
}
