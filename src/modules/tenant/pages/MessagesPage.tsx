import { useMemo, useState } from 'react'
import { TENANT_CONVERSATIONS } from '../constants/conversations'
import { ConversationSidebar } from '../components/chat/ConversationSidebar'
import { ChatWindow } from '../components/chat/ChatWindow'

export function MessagesPage() {
  const [activeId, setActiveId] = useState(TENANT_CONVERSATIONS[0]?.id ?? '')

  const activeConversation = useMemo(
    () => TENANT_CONVERSATIONS.find((c) => c.id === activeId) ?? TENANT_CONVERSATIONS[0],
    [activeId]
  )

  if (!activeConversation) {
    return null
  }

  return (
    <div className="flex flex-1 min-h-0 max-h-[calc(100vh-73px)] bg-brand-background">
      <ConversationSidebar
        conversations={TENANT_CONVERSATIONS}
        activeId={activeConversation.id}
        onSelect={setActiveId}
      />
      <ChatWindow conversation={activeConversation} />
    </div>
  )
}
