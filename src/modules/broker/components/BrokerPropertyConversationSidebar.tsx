import { useMemo, useState } from 'react'
import { cn } from '@shared/utils/cn'
import { MaterialIcon } from '@shared/components/MaterialIcon'
import type { ChatConversation } from '@modules/tenant/types/chat'

interface BrokerPropertyConversationSidebarProps {
  conversations: ChatConversation[]
  activeId: string
  onSelect: (id: string) => void
}

interface PropertyConversationGroup {
  key: string
  propertyTitle: string
  propertySubtitle: string
  propertyLocation: string
  propertyImage: string
  conversations: ChatConversation[]
  unreadCount: number
}

function getConversationLabel(conversation: ChatConversation) {
  const roleLabel = conversation.contactRole === 'tenant' ? 'Tenant' : 'Owner'
  return `${roleLabel}: ${conversation.contactName}`
}

export function BrokerPropertyConversationSidebar({
  conversations,
  activeId,
  onSelect,
}: BrokerPropertyConversationSidebarProps) {
  const [query, setQuery] = useState('')

  const groupedProperties = useMemo<PropertyConversationGroup[]>(() => {
    const groups = new Map<string, PropertyConversationGroup>()

    conversations.forEach((conversation) => {
      const key = `${conversation.propertyTitle}-${conversation.propertySubtitle}`
      const existing = groups.get(key)

      if (existing) {
        existing.conversations.push(conversation)
        existing.unreadCount += conversation.unreadCount
        return
      }

      groups.set(key, {
        key,
        propertyTitle: conversation.propertyTitle,
        propertySubtitle: conversation.propertySubtitle,
        propertyLocation: conversation.propertyLocation,
        propertyImage: conversation.propertyImage,
        conversations: [conversation],
        unreadCount: conversation.unreadCount,
      })
    })

    return Array.from(groups.values()).map((group) => ({
      ...group,
      conversations: group.conversations.sort((a, b) => {
        const roleOrder = { owner: 0, tenant: 1, broker: 2 }
        return (roleOrder[a.contactRole ?? 'owner'] ?? 0) - (roleOrder[b.contactRole ?? 'owner'] ?? 0)
      }),
    }))
  }, [conversations])

  const filteredGroups = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return groupedProperties

    return groupedProperties.filter((group) => {
      const searchable = [
        group.propertyTitle,
        group.propertySubtitle,
        group.propertyLocation,
        ...group.conversations.map((conversation) => conversation.contactName),
      ]
        .join(' ')
        .toLowerCase()

      return searchable.includes(normalizedQuery)
    })
  }, [groupedProperties, query])

  return (
    <aside className="flex w-full shrink-0 flex-col border-r border-brand-outline-variant bg-brand-container-low lg:w-[360px] min-h-0">
      <div className="shrink-0 border-b border-brand-outline-variant p-4">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-outline">
          Property Chats
        </p>
        <div className="relative">
          <MaterialIcon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 !text-xl text-brand-outline pointer-events-none"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search properties..."
            className="w-full rounded-xl border border-brand-outline-variant/50 bg-brand-container-high py-2.5 pl-10 pr-4 font-body text-sm text-brand-on-surface outline-none placeholder:text-brand-outline focus:border-brand"
          />
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-3 min-h-0">
        {filteredGroups.map((group) => {
          const activeConversation = group.conversations.find((conversation) => conversation.id === activeId)
          const selectedValue = activeConversation?.id ?? ''

          return (
            <article
              key={group.key}
              className={cn(
                'rounded-2xl border bg-brand-container-lowest p-3 shadow-sm transition-colors',
                activeConversation
                  ? 'border-brand bg-blue-50/80'
                  : 'border-brand-outline-variant hover:bg-brand-container-high/60',
              )}
            >
              <div className="flex gap-3">
                <img
                  src={group.propertyImage}
                  alt={group.propertySubtitle}
                  className="h-16 w-16 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate font-display text-[15px] font-extrabold text-brand">
                        {group.propertySubtitle}
                      </h3>
                      <p className="truncate text-[12px] font-semibold text-brand-on-surface-variant">
                        {group.propertyTitle}
                      </p>
                    </div>
                    {group.unreadCount > 0 && (
                      <span className="flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-brand px-2 text-[11px] font-bold text-white">
                        {group.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-brand-outline">
                    <MaterialIcon name="location_on" className="!text-base" />
                    <span className="truncate">{group.propertyLocation}</span>
                  </p>
                </div>
              </div>

              <div className="mt-3">
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-brand-outline">
                  Open Chat With
                </label>
                <select
                  value={selectedValue}
                  onChange={(event) => {
                    if (event.target.value) onSelect(event.target.value)
                  }}
                  className="h-10 w-full rounded-xl border border-brand-outline-variant/60 bg-white px-3 text-[13px] font-bold text-brand outline-none focus:border-brand"
                >
                  <option value="">Choose tenant or owner</option>
                  {group.conversations.map((conversation) => (
                    <option key={conversation.id} value={conversation.id}>
                      {getConversationLabel(conversation)}
                    </option>
                  ))}
                </select>
              </div>

              {activeConversation && (
                <button
                  type="button"
                  onClick={() => onSelect(activeConversation.id)}
                  className="mt-3 flex w-full items-center justify-between rounded-xl bg-white px-3 py-2 text-left text-[12px] font-semibold text-brand shadow-sm"
                >
                  <span className="truncate">
                    {getConversationLabel(activeConversation)}
                  </span>
                  <MaterialIcon name="chat" className="!text-lg text-brand" />
                </button>
              )}
            </article>
          )
        })}

        {!filteredGroups.length && (
          <div className="rounded-xl border border-dashed border-brand-outline-variant bg-brand-container-lowest p-5 text-center">
            <p className="text-[13px] font-bold text-brand">No properties found</p>
            <p className="mt-1 text-[12px] text-brand-outline">
              Try another property name, owner, or tenant.
            </p>
          </div>
        )}
      </div>
    </aside>
  )
}
