import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { useBrokerChatStore } from '../store/chatStore'
import { BrokerPropertyConversationSidebar } from '../components/BrokerPropertyConversationSidebar'
import { ChatWindow } from '@modules/tenant/components/chat/ChatWindow'

export function BrokerMessagesPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const conversations = useBrokerChatStore((state) => state.conversations)
  const sendMessage = useBrokerChatStore((state) => state.sendMessage)
  const markConversationRead = useBrokerChatStore((state) => state.markConversationRead)
  const requestedConversationId = searchParams.get('conversation')
  const initialActiveId =
    conversations.find((conversation) => conversation.id === requestedConversationId)?.id ??
    conversations[0]?.id ??
    ''
  const [activeId, setActiveId] = useState(initialActiveId)

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? conversations[0],
    [activeId, conversations],
  )

  useEffect(() => {
    if (activeConversation) {
      markConversationRead(activeConversation.id)
    }
  }, [activeConversation?.id, markConversationRead])

  useEffect(() => {
    if (
      requestedConversationId &&
      conversations.some((conversation) => conversation.id === requestedConversationId)
    ) {
      setActiveId(requestedConversationId)
    }
  }, [requestedConversationId, conversations])

  const selectConversation = (id: string) => {
    setActiveId(id)
    navigate(`${ROUTES.BROKER.MESSAGES}?conversation=${encodeURIComponent(id)}`, {
      replace: true,
    })
  }

  if (!activeConversation) {
    return null
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] min-h-0 bg-brand-background">
      <div className="shrink-0 flex items-center px-4 py-2.5 border-b border-brand-outline-variant bg-brand-surface">
        <button
          type="button"
          onClick={() => navigate(ROUTES.BROKER.DASHBOARD)}
          className="inline-flex items-center gap-2 border-0 bg-transparent font-body text-sm font-semibold text-brand cursor-pointer hover:opacity-80 transition-opacity"
        >
          <ArrowLeft size={18} strokeWidth={2} />
          Back to Home
        </button>
      </div>

      <div className="flex flex-1 min-h-0">
      <BrokerPropertyConversationSidebar
        conversations={conversations}
        activeId={activeConversation.id}
        onSelect={selectConversation}
      />
      <ChatWindow conversation={activeConversation} onSendMessage={sendMessage} />
      </div>
    </div>
  )
}
