import type { ChatConversation } from '../../types/chat'
import { MaterialIcon } from '../MaterialIcon'

interface ChatPropertyCardProps {
  conversation: ChatConversation
}

export function ChatPropertyCard({ conversation }: ChatPropertyCardProps) {
  return (
    <div className="mx-4 mt-4 mb-2 p-4 rounded-xl bg-brand-container-lowest border border-brand-outline-variant shadow-sm flex items-center gap-4">
      <img
        src={conversation.propertyImage}
        alt=""
        className="w-16 h-16 rounded-lg object-cover shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm font-bold text-brand truncate">
          {conversation.propertySubtitle}
        </p>
        <p className="flex items-center gap-1 font-body text-xs text-brand-outline mt-0.5">
          <MaterialIcon name="location_on" className="!text-sm" />
          {conversation.propertyLocation}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="font-display text-lg font-extrabold text-brand">
          {conversation.propertyPrice}
        </p>
        <p className="font-body text-[10px] font-bold tracking-wider text-brand-outline uppercase">
          Per Month
        </p>
      </div>
    </div>
  )
}
