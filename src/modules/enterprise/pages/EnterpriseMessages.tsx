import { useState, useMemo } from 'react'
import { MapPin, MoreVertical, Phone, Plus, Search, Send, Smile, Video } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { useAuth } from '@shared/hooks/useAuth'
import { usePrototypeStore } from '@shared/store/prototypeStore'

export function EnterpriseMessages() {
  const { user } = useAuth()
  const userId = user?.id ?? ''
  const chats = usePrototypeStore((s) => s.chats)
  const users = usePrototypeStore((s) => s.users)
  const properties = usePrototypeStore((s) => s.properties)
  const sendMessage = usePrototypeStore((s) => s.sendChatMessage)

  // Get chats where this enterprise user is a participant
  const userChats = useMemo(() =>
    chats.filter((c) => c.participantIds.includes(userId)),
    [chats, userId],
  )

  const [selectedChatId, setSelectedChatId] = useState(userChats[0]?.id ?? '')
  const [draft, setDraft] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const selectedChat = userChats.find((c) => c.id === selectedChatId)
  const otherUserId = selectedChat?.participantIds.find((id) => id !== userId) ?? ''
  const otherUser = users.find((u) => u.id === otherUserId)
  const chatProperty = selectedChat?.propertyId ? properties.find((p) => p.id === selectedChat.propertyId) : null

  const filteredChats = userChats.filter((c) => {
    if (!searchQuery) return true
    const other = users.find((u) => c.participantIds.includes(u.id) && u.id !== userId)
    return other?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || other?.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const handleSend = () => {
    if (!draft.trim() || !selectedChatId) return
    sendMessage(selectedChatId, userId, draft.trim())
    setDraft('')
  }

  // If no chats exist, show a placeholder
  if (userChats.length === 0) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <div className="text-center">
          <p className="text-[16px] font-bold text-text-primary">No conversations yet</p>
          <p className="mt-1 text-[13px] text-text-muted">Messages will appear here when you interact with brokers or tenants.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden rounded-xl border border-outline bg-white shadow-sm -mx-6 -my-6">
      {/* Sidebar */}
      <div className="w-[280px] shrink-0 border-r border-outline flex flex-col">
        <div className="p-4 border-b border-outline">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-canvas-alt border-0 text-[13px] text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => {
            const other = users.find((u) => chat.participantIds.includes(u.id) && u.id !== userId)
            const lastMsg = chat.messages[chat.messages.length - 1]
            return (
              <button
                key={chat.id}
                type="button"
                onClick={() => setSelectedChatId(chat.id)}
                className={cn(
                  'w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors border-l-3',
                  selectedChatId === chat.id ? 'bg-hover-light border-primary' : 'border-transparent hover:bg-canvas-alt'
                )}
              >
                {other?.avatar ? (
                  <img src={other.avatar} alt="" className="h-10 w-10 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-[11px] font-bold shrink-0">{other?.firstName[0]}{other?.lastName[0]}</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-[#0f172a] truncate">{other ? `${other.firstName} ${other.lastName}` : 'Unknown'}</p>
                  <p className="mt-0.5 text-[12px] text-text-muted truncate">{lastMsg?.text ?? 'No messages'}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        <div className="shrink-0 border-b border-outline px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-bold text-[#0f172a]">{chatProperty?.title ?? 'Conversation'}</h2>
              <p className="text-[12px] text-text-muted flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                {otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : 'User'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg text-text-muted hover:bg-hover-light"><Phone size={16} /></button>
              <button className="p-2 rounded-lg text-text-muted hover:bg-hover-light"><Video size={16} /></button>
              <button className="p-2 rounded-lg text-text-muted hover:bg-hover-light"><MoreVertical size={16} /></button>
            </div>
          </div>
          {chatProperty && (
            <div className="mt-3 flex items-center gap-3 rounded-lg border border-outline bg-canvas-alt p-3">
              <img src={chatProperty.image} alt="" className="h-11 w-14 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#0f172a]">{chatProperty.title}</p>
                <p className="text-[11px] text-text-muted flex items-center gap-1"><MapPin size={10} /> {chatProperty.neighborhood}, {chatProperty.city}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[14px] font-bold text-[#0f172a]">{chatProperty.price}</p>
                <p className="text-[10px] text-text-muted">PER MONTH</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {selectedChat?.messages.map((msg) => {
            const isMe = msg.senderId === userId
            const sender = users.find((u) => u.id === msg.senderId)
            return (
              <div key={msg.id} className={cn('flex', isMe ? 'justify-end' : 'justify-start')}>
                <div className={cn('flex items-end gap-2 max-w-[75%]', isMe && 'flex-row-reverse')}>
                  {!isMe && (
                    sender?.avatar
                      ? <img src={sender.avatar} alt="" className="h-8 w-8 rounded-full object-cover shrink-0" />
                      : <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold shrink-0">{sender?.firstName[0]}{sender?.lastName[0]}</div>
                  )}
                  <div>
                    <div className={cn('rounded-2xl px-4 py-3 text-[13px] leading-relaxed', isMe ? 'bg-[#0f172a] text-white rounded-br-sm' : 'bg-slate-100 text-[#0f172a] rounded-bl-sm')}>
                      {msg.text}
                    </div>
                    <p className={cn('mt-1 text-[10px] text-text-muted', isMe && 'text-right')}>{msg.time}</p>
                  </div>
                </div>
              </div>
            )
          })}
          {(!selectedChat?.messages || selectedChat.messages.length === 0) && (
            <p className="text-center text-[13px] text-text-muted py-10">No messages in this conversation yet.</p>
          )}
        </div>

        <div className="shrink-0 border-t border-outline px-6 py-4">
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full text-text-muted hover:bg-hover-light"><Plus size={18} /></button>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend() }}
              placeholder="Type a message..."
              className="flex-1 h-11 rounded-full border border-outline bg-canvas-alt px-5 text-[13px] text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button className="p-2 rounded-full text-text-muted hover:bg-hover-light"><Smile size={18} /></button>
            <button onClick={handleSend} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0f172a] text-white hover:bg-navy/80 transition-colors">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
