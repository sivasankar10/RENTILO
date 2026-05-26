import { useMemo, useState } from 'react'
import { BROKER_CONVERSATIONS } from '../constants/conversations'
import { ConversationSidebar } from '@modules/tenant/components/chat/ConversationSidebar'
import { ChatWindow } from '@modules/tenant/components/chat/ChatWindow'

export function BrokerMessagesPage() {
  const [activeId, setActiveId] = useState(BROKER_CONVERSATIONS[0]?.id ?? '')

  const activeConversation = useMemo(
    () => BROKER_CONVERSATIONS.find((c) => c.id === activeId) ?? BROKER_CONVERSATIONS[0],
    [activeId],
  )

  if (!activeConversation) {
    return null
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] min-h-0 bg-brand-background">
      <ConversationSidebar
        conversations={BROKER_CONVERSATIONS}
        activeId={activeConversation.id}
        onSelect={setActiveId}
      />
      <ChatWindow conversation={activeConversation} />
    </div>
  )
}
