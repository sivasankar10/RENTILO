import type { ChatMessage } from '../../types/chat'
import { MaterialIcon } from '../MaterialIcon'

interface ChatMessageBubbleProps {
  message: ChatMessage
  avatar?: string
}

export function ChatMessageBubble({ message, avatar }: ChatMessageBubbleProps) {
  const isOutgoing = message.sender === 'tenant' || message.sender === 'broker'

  if (isOutgoing) {
    return (
      <div className="flex flex-col items-end mb-4">
        <div className="max-w-[75%] px-4 py-3 rounded-2xl rounded-br-md bg-brand text-white font-body text-sm leading-relaxed">
          {message.text}
        </div>
        <div className="flex items-center gap-1 mt-1 pr-1">
          <span className="font-body text-[11px] text-brand-outline">{message.time}</span>
          {message.read && (
            <MaterialIcon name="done_all" className="!text-sm text-blue-500" />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-end gap-2 mb-4">
      {avatar && (
        <img src={avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0 mb-5" />
      )}
      <div className="flex flex-col items-start max-w-[75%]">
        <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-brand-container-high font-body text-sm text-brand-on-surface leading-relaxed">
          {message.text}
        </div>
        <span className="font-body text-[11px] text-brand-outline mt-1 ml-1">{message.time}</span>
      </div>
    </div>
  )
}
