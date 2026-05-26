import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { BROKER_CONVERSATIONS } from '../constants/conversations'
import { ConversationSidebar } from '@modules/tenant/components/chat/ConversationSidebar'
import { ChatWindow } from '@modules/tenant/components/chat/ChatWindow'

export function BrokerMessagesPage() {
  const navigate = useNavigate()
  const [activeId, setActiveId] = useState(BROKER_CONVERSATIONS[0]?.id ?? '')

  const activeConversation = useMemo(
    () => BROKER_CONVERSATIONS.find((c) => c.id === activeId) ?? BROKER_CONVERSATIONS[0],
    [activeId],
  )

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
      <ConversationSidebar
        conversations={BROKER_CONVERSATIONS}
        activeId={activeConversation.id}
        onSelect={setActiveId}
      />
      <ChatWindow conversation={activeConversation} />
      </div>
    </div>
  )
}
