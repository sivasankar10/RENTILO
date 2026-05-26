import { useMemo, useState } from 'react'
import type { ChatConversation } from '../../types/chat'
import { MaterialIcon } from '../MaterialIcon'
import { TenantSidebarFooter } from '../TenantSidebarFooter'
import { ConversationListItem } from './ConversationListItem'

interface ConversationSidebarProps {
  conversations: ChatConversation[]
  activeId: string
  onSelect: (id: string) => void
}

export function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
}: ConversationSidebarProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return conversations
    return conversations.filter(
      (c) =>
        c.contactName.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q)
    )
  }, [conversations, query])

  return (
    <aside className="flex w-full lg:w-80 shrink-0 flex-col bg-brand-container-low border-r border-brand-outline-variant min-h-0">
      <div className="p-4 shrink-0">
        <div className="relative">
          <MaterialIcon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 !text-xl text-brand-outline pointer-events-none"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-outline-variant/50 bg-brand-container-high font-body text-sm text-brand-on-surface outline-none focus:border-brand placeholder:text-brand-outline"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-1 min-h-0">
        {filtered.map((conversation) => (
          <ConversationListItem
            key={conversation.id}
            conversation={conversation}
            active={conversation.id === activeId}
            onClick={() => onSelect(conversation.id)}
          />
        ))}
      </div>

      <div className="p-4 shrink-0">
        <TenantSidebarFooter />
      </div>
    </aside>
  )
}
