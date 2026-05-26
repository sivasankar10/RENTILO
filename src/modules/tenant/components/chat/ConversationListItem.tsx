import { cn } from '@shared/utils/cn'
import type { ChatConversation } from '../../types/chat'

interface ConversationListItemProps {
  conversation: ChatConversation
  active: boolean
  onClick: () => void
}

export function ConversationListItem({
  conversation,
  active,
  onClick,
}: ConversationListItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-start gap-3 p-3 rounded-xl border-0 text-left cursor-pointer transition-colors',
        active ? 'bg-blue-50/80' : 'bg-transparent hover:bg-brand-container-high/60'
      )}
    >
      <div className="relative shrink-0">
        <img
          src={conversation.avatar}
          alt=""
          className="w-12 h-12 rounded-full object-cover"
        />
        {conversation.online && (
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-brand-container-low" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className="font-body text-sm font-bold text-brand truncate">
            {conversation.contactName}
          </span>
          <span className="shrink-0 font-body text-[11px] text-brand-outline">
            {conversation.timeLabel}
          </span>
        </div>
        <p className="font-body text-xs text-brand-on-surface-variant truncate pr-6">
          {conversation.lastMessage}
        </p>
      </div>
      {conversation.unreadCount > 0 && (
        <span className="shrink-0 min-w-[22px] h-[22px] px-1.5 rounded-full bg-brand text-white text-[11px] font-bold flex items-center justify-center mt-1">
          {conversation.unreadCount}
        </span>
      )}
    </button>
  )
}
