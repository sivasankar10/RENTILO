import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  BriefcaseBusiness,
  Home,
  MoreVertical,
  Paperclip,
  Phone,
  Search,
  Send,
  Smile,
  Video,
} from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { ROUTES } from '@shared/constants/routes'
import { useLeaseChatStore } from '@shared/store/leaseChatStore'
import { useOwnerChatStore } from '../store/chatStore'

export function OwnerMessages() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const conversations = useOwnerChatStore((state) => state.conversations)
  const leaseThreads = useLeaseChatStore((state) => state.threads)
  const storeSendMessage = useOwnerChatStore((state) => state.sendMessage)
  const markConversationRead = useOwnerChatStore((state) => state.markConversationRead)
  const requestedConversationId = Number(
    searchParams.get('conversationId') ?? searchParams.get('conversation') ?? NaN,
  )
  const initialConversationId = conversations.some(
    (conversation) => conversation.id === requestedConversationId
  )
    ? requestedConversationId
    : conversations[0]?.id ?? 0
  const [activeId, setActiveId] = useState(initialConversationId)
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState('')
  const [status, setStatus] = useState('')

  const activeConversation =
    conversations.find((conversation) => conversation.id === activeId) ?? conversations[0]

  const leaseThread = useMemo(
    () =>
      activeConversation?.onboardingId
        ? leaseThreads.find((thread) => thread.onboardingId === activeConversation.onboardingId)
        : undefined,
    [activeConversation?.onboardingId, leaseThreads],
  )

  const displayMessages = leaseThread?.messages.length
    ? leaseThread.messages.map((message, index) => ({
        id: index + 1,
        sender: message.sender === 'owner' ? ('owner' as const) : ('tenant' as const),
        text: message.text,
        time: message.time,
      }))
    : activeConversation?.messages ?? []

  useEffect(() => {
    if (activeConversation) {
      markConversationRead(activeConversation.id)
    }
  }, [activeConversation?.id, markConversationRead])

  useEffect(() => {
    if (
      Number.isFinite(requestedConversationId) &&
      conversations.some((conversation) => conversation.id === requestedConversationId)
    ) {
      setActiveId(requestedConversationId)
    }
  }, [conversations, requestedConversationId])

  const groupedConversations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const filtered = conversations.filter((conversation) =>
      `${conversation.name} ${conversation.role} ${conversation.preview} ${conversation.property} ${conversation.contactType}`
        .toLowerCase()
        .includes(normalizedQuery)
    )

    return {
      brokers: filtered.filter((conversation) => conversation.contactType === 'broker'),
      tenants: filtered.filter((conversation) => conversation.contactType === 'tenant'),
    }
  }, [conversations, query])

  const conversationSections = [
    {
      key: 'brokers',
      title: 'Brokers',
      icon: BriefcaseBusiness,
      conversations: groupedConversations.brokers,
    },
    {
      key: 'tenants',
      title: 'Tenants',
      icon: Home,
      conversations: groupedConversations.tenants,
    },
  ]

  const activeContactLabel = activeConversation?.contactType === 'broker' ? 'Broker' : 'Tenant'
  const activeIsBroker = activeConversation?.contactType === 'broker'

  const sendMessage = () => {
    const trimmed = draft.trim()
    if (!trimmed) {
      setStatus('Type a message before sending.')
      return
    }

    storeSendMessage(activeId, trimmed)
    setDraft('')
    setStatus('Message sent.')
  }

  const selectConversation = (id: number) => {
    setActiveId(id)
    setStatus('')
    markConversationRead(id)
  }

  const openBrokerProfile = (conversationId: number) => {
    navigate(ROUTES.OWNER.BROKER_PROFILE(conversationId))
  }

  if (!activeConversation) {
    return null
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

          <div className="space-y-5 px-3 pb-5">
            {conversationSections.map((section) => {
              const SectionIcon = section.icon

              return (
                <section key={section.key}>
                  <div className="mb-2 flex items-center justify-between px-2">
                    <div className="flex items-center gap-2 text-filter-label font-bold uppercase tracking-normal text-text-muted">
                      <SectionIcon size={15} />
                      {section.title}
                    </div>
                    <span className="rounded-pill bg-canvas-alt px-2 py-1 text-badge font-bold text-text-muted">
                      {section.conversations.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {section.conversations.map((conversation) => (
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
                          {conversation.contactType === 'broker' ? (
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation()
                                openBrokerProfile(conversation.id)
                              }}
                              className="block rounded-full focus:outline-none focus:ring-2 focus:ring-primary-100"
                              aria-label={`View ${conversation.name} profile`}
                            >
                              <img
                                src={conversation.avatar}
                                alt={conversation.name}
                                className="h-12 w-12 rounded-full object-cover"
                              />
                            </button>
                          ) : (
                            <img
                              src={conversation.avatar}
                              alt={conversation.name}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          )}
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-status-success" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-body font-bold text-text-primary">{conversation.name}</p>
                            <span className="text-filter-label uppercase text-text-muted">
                              {conversation.time}
                            </span>
                          </div>
                          <p className="mt-0.5 truncate text-filter-label uppercase text-primary">
                            {conversation.role}
                          </p>
                          <p className="mt-1 truncate text-label font-semibold text-text-primary">
                            {conversation.property}
                          </p>
                          <p className="mt-1 truncate text-label text-text-muted">
                            {conversation.preview}
                          </p>
                        </div>
                        {conversation.unread > 0 && (
                          <span className="mt-6 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-navy px-1.5 text-badge text-white">
                            {conversation.unread}
                          </span>
                        )}
                      </button>
                    ))}

                    {section.conversations.length === 0 && (
                      <p className="rounded-card bg-canvas-alt px-3 py-4 text-center text-label text-text-muted">
                        No {section.title.toLowerCase()} found.
                      </p>
                    )}
                  </div>
                </section>
              )
            })}
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
              {activeIsBroker ? (
                <button
                  type="button"
                  onClick={() => openBrokerProfile(activeConversation.id)}
                  className="mt-1 inline-flex items-center gap-2 text-label text-text-muted transition-colors hover:text-primary"
                  aria-label={`View ${activeConversation.name} profile`}
                >
                  <span className="inline-block h-2 w-2 rounded-full bg-status-success align-middle" />
                  {activeContactLabel}: <span className="font-semibold">{activeConversation.name}</span>
                </button>
              ) : (
                <p className="mt-1 text-label text-text-muted">
                  <span className="inline-block h-2 w-2 rounded-full bg-status-success align-middle" />{' '}
                  {activeContactLabel}: {activeConversation.name}
                </p>
              )}
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

            {displayMessages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex items-end gap-3',
                  message.sender === 'owner' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.sender !== 'owner' && (
                  activeIsBroker ? (
                    <button
                      type="button"
                      onClick={() => openBrokerProfile(activeConversation.id)}
                      className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary-100"
                      aria-label={`View ${activeConversation.name} profile`}
                    >
                      <img
                        src={activeConversation.avatar}
                        alt={activeConversation.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    </button>
                  ) : (
                    <img
                      src={activeConversation.avatar}
                      alt={activeConversation.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  )
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
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    sendMessage()
                  }
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
                disabled={!draft.trim()}
                className="rounded-button bg-navy p-3 text-white transition-colors duration-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-45"
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
