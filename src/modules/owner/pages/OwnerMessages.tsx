import { useMemo, useState } from 'react'
import {
  MoreVertical,
  Paperclip,
  Phone,
  Search,
  Send,
  Smile,
  Video,
} from 'lucide-react'
import { cn } from '@shared/utils/cn'

const initialConversations = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    preview: "Sounds good. I'll send the lease over.",
    time: '10:45 AM',
    unread: 2,
    avatar:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80',
    property: '2BHK in Chennai',
    propertyImage:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=180&q=80',
    listing: 'Modern Penthouse Suite',
    location: 'Adyar, Chennai',
    price: 'Rs. 45,000',
    messages: [
      {
        id: 1,
        sender: 'tenant',
        text: 'Hello! I have reviewed your request for the early move-in date. The property will be professionally cleaned and ready by the 12th.',
        time: '10:42 AM',
      },
      {
        id: 2,
        sender: 'owner',
        text: "That's perfect, Rajesh. Thank you for accommodating that. I'll make the security deposit payment through the portal right away.",
        time: '10:44 AM',
      },
      {
        id: 3,
        sender: 'tenant',
        text: "Sounds good. I'll send the lease over. You should receive a notification to digitally sign it shortly.",
        time: '10:45 AM',
      },
    ],
  },
  {
    id: 2,
    name: 'Sarah Miller',
    preview: 'The plumber has fixed the leak.',
    time: 'Yesterday',
    unread: 0,
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    property: 'Studio in Velachery',
    propertyImage:
      'https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=180&q=80',
    listing: 'Compact Studio Residence',
    location: 'Velachery, Chennai',
    price: 'Rs. 28,000',
    messages: [
      {
        id: 1,
        sender: 'tenant',
        text: 'The plumber has fixed the leak. I have uploaded the invoice for your approval.',
        time: 'Yesterday',
      },
    ],
  },
  {
    id: 3,
    name: 'Amit Shah',
    preview: 'Is the security deposit received?',
    time: 'Mon',
    unread: 0,
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    property: 'Villa in ECR',
    propertyImage:
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=180&q=80',
    listing: 'Seaside Villa',
    location: 'ECR, Chennai',
    price: 'Rs. 92,000',
    messages: [
      {
        id: 1,
        sender: 'tenant',
        text: 'Is the security deposit received? I can share the transaction reference if needed.',
        time: 'Mon',
      },
    ],
  },
]

export function OwnerMessages() {
  const [conversations, setConversations] = useState(initialConversations)
  const [activeId, setActiveId] = useState(initialConversations[0].id)
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState('')
  const [status, setStatus] = useState('')

  const activeConversation =
    conversations.find((conversation) => conversation.id === activeId) ?? conversations[0]

  const filteredConversations = useMemo(
    () =>
      conversations.filter((conversation) =>
        `${conversation.name} ${conversation.preview} ${conversation.property}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [conversations, query]
  )

  const sendMessage = () => {
    const trimmed = draft.trim()
    if (!trimmed) {
      setStatus('Type a message before sending.')
      return
    }

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === activeId
          ? {
              ...conversation,
              preview: trimmed,
              time: 'Now',
              unread: 0,
              messages: [
                ...conversation.messages,
                {
                  id: Date.now(),
                  sender: 'owner',
                  text: trimmed,
                  time: 'Now',
                },
              ],
            }
          : conversation
      )
    )
    setDraft('')
    setStatus('Message sent.')
  }

  const selectConversation = (id: number) => {
    setActiveId(id)
    setStatus('')
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === id ? { ...conversation, unread: 0 } : conversation
      )
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-canvas-alt">
      <div className="grid min-h-[calc(100vh-64px)] lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="border-r border-outline bg-white">
          <div className="p-5">
            <label className="relative block">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search conversations..."
                className="w-full rounded-button border border-outline bg-canvas-alt py-3 pl-11 pr-4 text-body text-text-primary outline-none transition-all duration-200 placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary-100"
              />
            </label>
          </div>

          <div className="space-y-2 px-3">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() => selectConversation(conversation.id)}
                className={cn(
                  'flex w-full items-start gap-3 rounded-card p-3 text-left transition-colors duration-200',
                  conversation.id === activeId ? 'bg-primary-50' : 'hover:bg-hover-light'
                )}
              >
                <div className="relative">
                  <img
                    src={conversation.avatar}
                    alt={conversation.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-status-success" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-body font-bold text-text-primary">{conversation.name}</p>
                    <span className="text-filter-label uppercase text-text-muted">{conversation.time}</span>
                  </div>
                  <p className="mt-1 truncate text-label text-text-primary">{conversation.preview}</p>
                </div>
                {conversation.unread > 0 && (
                  <span className="mt-6 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-navy px-1.5 text-badge text-white">
                    {conversation.unread}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-auto p-5">
            <button
              type="button"
              onClick={() => setStatus('Help Center opened.')}
              className="mt-8 w-full rounded-button bg-navy px-4 py-3 text-body font-semibold text-white transition-colors duration-200 hover:bg-slate-800"
            >
              Help Center
            </button>
          </div>
        </aside>

        <section className="flex min-h-[calc(100vh-64px)] flex-col">
          <header className="flex items-center justify-between border-b border-outline bg-white px-8 py-4">
            <div>
              <h1 className="text-heading-3 font-bold text-navy">{activeConversation.property}</h1>
              <p className="mt-1 text-label text-text-muted">
                <span className="inline-block h-2 w-2 rounded-full bg-status-success align-middle" /> Owner:{' '}
                {activeConversation.name}
              </p>
            </div>
            <div className="flex items-center gap-3 text-navy">
              <button
                type="button"
                onClick={() => setStatus(`Calling ${activeConversation.name}...`)}
                className="rounded-button p-2 transition-colors duration-200 hover:bg-hover-light"
                aria-label="Start call"
              >
                <Phone size={20} />
              </button>
              <button
                type="button"
                onClick={() => setStatus(`Video call requested with ${activeConversation.name}.`)}
                className="rounded-button p-2 transition-colors duration-200 hover:bg-hover-light"
                aria-label="Start video"
              >
                <Video size={20} />
              </button>
              <button
                type="button"
                onClick={() => setStatus('Conversation options opened.')}
                className="rounded-button p-2 transition-colors duration-200 hover:bg-hover-light"
                aria-label="Conversation menu"
              >
                <MoreVertical size={20} />
              </button>
            </div>
          </header>

          <div className="px-8 py-5">
            <article className="flex items-center justify-between rounded-modal bg-white p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <img
                  src={activeConversation.propertyImage}
                  alt={activeConversation.listing}
                  className="h-16 w-20 rounded-card object-cover"
                />
                <div>
                  <h2 className="text-body font-bold text-text-primary">{activeConversation.listing}</h2>
                  <p className="mt-1 text-label text-text-muted">{activeConversation.location}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-body-lg font-bold text-navy">{activeConversation.price}</p>
                <p className="text-filter-label uppercase text-text-muted">Per month</p>
              </div>
            </article>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto px-8 pb-8">
            <div className="text-center">
              <span className="rounded-pill bg-slate-200 px-4 py-1.5 text-badge uppercase text-text-muted">
                Today
              </span>
            </div>

            {activeConversation.messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex items-end gap-3',
                  message.sender === 'owner' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.sender === 'tenant' && (
                  <img
                    src={activeConversation.avatar}
                    alt={activeConversation.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                )}
                <div
                  className={cn(
                    'max-w-2xl rounded-card px-5 py-4 text-body leading-6 shadow-sm',
                    message.sender === 'owner'
                      ? 'bg-navy text-white'
                      : 'bg-slate-200 text-text-primary'
                  )}
                >
                  <p>{message.text}</p>
                  <p
                    className={cn(
                      'mt-2 text-right text-filter-label uppercase',
                      message.sender === 'owner' ? 'text-slate-300' : 'text-text-muted'
                    )}
                  >
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {status && <p className="px-8 pb-2 text-label font-semibold text-primary">{status}</p>}

          <footer className="border-t border-outline bg-white px-8 py-5">
            <div className="flex items-center gap-3 rounded-modal bg-slate-100 p-3">
              <button
                type="button"
                onClick={() => setStatus('Attachment picker opened.')}
                className="rounded-full p-2 text-text-muted transition-colors duration-200 hover:bg-white hover:text-navy"
                aria-label="Attach file"
              >
                <Paperclip size={18} />
              </button>
              <input
                value={draft}
                onChange={(event) => {
                  setDraft(event.target.value)
                  setStatus('')
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') sendMessage()
                }}
                placeholder="Type a message..."
                className="min-w-0 flex-1 bg-transparent px-2 py-2 text-body text-text-primary outline-none placeholder:text-text-muted"
              />
              <button
                type="button"
                onClick={() => setDraft((current) => `${current} :)`)}
                className="rounded-full p-2 text-text-muted transition-colors duration-200 hover:bg-white hover:text-navy"
                aria-label="Add emoji"
              >
                <Smile size={18} />
              </button>
              <button
                type="button"
                onClick={sendMessage}
                className="rounded-button bg-navy p-3 text-white transition-colors duration-200 hover:bg-slate-800"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
          </footer>
        </section>
      </div>
    </div>
  )
}
