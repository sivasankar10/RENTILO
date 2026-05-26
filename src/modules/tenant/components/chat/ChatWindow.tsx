import { useState } from 'react'
import type { ChatConversation } from '../../types/chat'
import { MaterialIcon } from '../MaterialIcon'
import { ChatMessageBubble } from './ChatMessageBubble'
import { ChatPropertyCard } from './ChatPropertyCard'

interface ChatWindowProps {
  conversation: ChatConversation
}

export function ChatWindow({ conversation }: ChatWindowProps) {
  const [draft, setDraft] = useState('')

  return (
    <div className="flex flex-1 flex-col min-w-0 bg-brand-container-lowest">
      <header className="flex items-center justify-between px-6 py-4 border-b border-brand-outline-variant shrink-0">
        <div>
          <h1 className="font-display text-lg font-extrabold text-brand">
            {conversation.propertyTitle}
          </h1>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-body text-sm text-brand-on-surface-variant mt-0.5">
            <span className="inline-flex items-center gap-1.5 font-medium">
              Owner: {conversation.contactName}
              <span className="w-2 h-2 rounded-full bg-green-500" aria-hidden />
            </span>
            {conversation.tenantName && (
              <>
                <span className="text-brand-outline" aria-hidden>
                  ·
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  Tenant: {conversation.tenantName}
                  <span className="w-2 h-2 rounded-full bg-green-500" aria-hidden />
                </span>
              </>
            )}
            {!conversation.tenantName && conversation.online && (
              <span className="w-2 h-2 rounded-full bg-green-500" aria-label="Online" />
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 border-0 bg-transparent text-brand cursor-pointer rounded-lg hover:bg-brand-container-low transition-colors"
            aria-label="Voice call"
          >
            <MaterialIcon name="call" />
          </button>
          <button
            type="button"
            className="p-2 border-0 bg-transparent text-brand cursor-pointer rounded-lg hover:bg-brand-container-low transition-colors"
            aria-label="Video call"
          >
            <MaterialIcon name="videocam" />
          </button>
          <button
            type="button"
            className="p-2 border-0 bg-transparent text-brand cursor-pointer rounded-lg hover:bg-brand-container-low transition-colors"
            aria-label="More options"
          >
            <MaterialIcon name="more_vert" />
          </button>
        </div>
      </header>

      <ChatPropertyCard conversation={conversation} />

      <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
        <div className="flex justify-center my-4">
          <span className="px-4 py-1 rounded-full bg-brand-container-high font-body text-[11px] font-semibold tracking-wider text-brand-outline uppercase">
            Today
          </span>
        </div>
        {conversation.messages.map((message) => (
          <ChatMessageBubble
            key={message.id}
            message={message}
            avatar={message.sender === 'owner' ? conversation.avatar : undefined}
          />
        ))}
      </div>

      <div className="shrink-0 px-4 py-4 border-t border-brand-outline-variant bg-brand-container-lowest">
        <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-brand-container-low border border-brand-outline-variant/50">
          <button
            type="button"
            className="p-2 border-0 bg-transparent text-brand-outline cursor-pointer hover:text-brand"
            aria-label="Attach file"
          >
            <MaterialIcon name="add" className="!text-2xl" />
          </button>
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border-0 bg-transparent py-3 font-body text-sm text-brand-on-surface outline-none placeholder:text-brand-outline"
          />
          <button
            type="button"
            className="p-2 border-0 bg-transparent text-brand-outline cursor-pointer hover:text-brand"
            aria-label="Emoji"
          >
            <MaterialIcon name="sentiment_satisfied" />
          </button>
          <button
            type="button"
            className="flex items-center justify-center w-10 h-10 rounded-full border-0 bg-brand text-white cursor-pointer hover:opacity-90 shrink-0"
            aria-label="Send message"
          >
            <MaterialIcon name="send" className="!text-xl" />
          </button>
        </div>
      </div>
    </div>
  )
}
