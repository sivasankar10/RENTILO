import { useState, useMemo, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  ChevronDown,
  ChevronRight,
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Flag,
  X,
} from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { getAllConversations } from '../constants/mockMessages'
import { useBrokerPrototype } from '../hooks/useBrokerPrototype'
import type { PropertyGroup, Conversation, ViewMode, Message, UserRole } from '../types/messages'

type LeadConversationNavigationState = {
  id: string
  leadName: string
  leadAvatar: string
  propertyId: string
  propertyName: string
  lastMessage: string
  note: string
}

type BrokerMessagesLocationState = {
  ownerName?: string
  propertyId?: string
  leadConversation?: LeadConversationNavigationState
}

export function BrokerMessagesPage() {
  const location = useLocation()
  const { chats, users, properties, sendMessage: sendSharedMessage } = useBrokerPrototype()
  const sharedGroups = useMemo<PropertyGroup[]>(() => {
    const groupsByProperty = new Map<string, PropertyGroup>()
    chats.forEach((thread) => {
      const propertyId = thread.propertyId ?? 'general'
      const property = properties.find((item) => item.id === propertyId)
      const participant = users.find(
        (user) =>
          thread.participantIds.includes(user.id) &&
          user.roles.includes(thread.type === 'owner_broker' ? 'owner' : 'tenant'),
      )
      if (!participant) return
      const messages: Message[] = thread.messages.map((message) => ({
        id: message.id,
        senderId: message.senderId,
        senderName: message.senderId === participant.id ? `${participant.firstName} ${participant.lastName}` : 'You',
        senderRole: message.senderRole === 'broker' ? 'broker' : message.senderRole === 'owner' ? 'owner' : 'tenant',
        text: message.text,
        timestamp: new Date(message.createdAt),
        status: 'read' as const,
      }))
      const conversation: Conversation = {
        id: thread.id,
        userId: participant.id,
        userName: `${participant.firstName} ${participant.lastName}`,
        userRole: participant.roles.includes('owner') ? 'owner' : 'tenant',
        userAvatar: participant.avatar ?? '',
        propertyId,
        propertyName: property?.title ?? 'Session conversation',
        lastMessage: messages.at(-1)?.text ?? 'Conversation started',
        lastMessageTime: new Date(thread.updatedAt),
        unreadCount: 0,
        isOnline: true,
        messages,
      }
      const group = groupsByProperty.get(propertyId) ?? {
        id: `group-${propertyId}`,
        name: property?.title ?? 'Session conversations',
        unreadCount: 0,
        isExpanded: true,
        properties: [],
      }
      let groupedProperty = group.properties.find((item) => item.id === propertyId)
      if (!groupedProperty) {
        groupedProperty = {
          id: propertyId,
          name: property?.title ?? 'Session property',
          address: property?.address ?? '',
          groupId: group.id,
          tenantConversations: [],
        }
        group.properties.push(groupedProperty)
      }
      if (conversation.userRole === 'owner') groupedProperty.ownerConversation = conversation
      else groupedProperty.tenantConversations.push(conversation)
      groupsByProperty.set(propertyId, group)
    })
    return Array.from(groupsByProperty.values())
  }, [chats, properties, users])
  const [viewMode, setViewMode] = useState<ViewMode>('property')
  const [groups, setGroups] = useState<PropertyGroup[]>(sharedGroups)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messageText, setMessageText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const moreMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setGroups(sharedGroups)
    setSelectedConversation((current) => {
      const conversations = getAllConversations(sharedGroups)
      return conversations.find((item) => item.id === current?.id) ?? conversations[0] ?? null
    })
  }, [sharedGroups])
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedConversation?.messages])

  // Handle navigation from "Contact Owner" button
  useEffect(() => {
    const state = location.state as BrokerMessagesLocationState | null
    if (state?.ownerName && state?.propertyId) {
      // Find and select the owner conversation for this property
      const allConvs = getAllConversations(groups)
      const ownerConv = allConvs.find(
        (conv) =>
          conv.userRole === 'owner' &&
          conv.propertyId === state.propertyId &&
          conv.userName === state.ownerName
      )
      
      if (ownerConv) {
        setSelectedConversation(ownerConv)
        // Expand the relevant group
        const propertyGroup = groups.find((g) =>
          g.properties.some((p) => p.id === state.propertyId)
        )
        if (propertyGroup && !propertyGroup.isExpanded) {
          setGroups((prev) =>
            prev.map((g) =>
              g.id === propertyGroup.id ? { ...g, isExpanded: true } : g
            )
          )
        }
      }
    }
  }, [location.state, groups])

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false)
      }
    }

    if (showMoreMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMoreMenu])

  const toggleGroup = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, isExpanded: !g.isExpanded } : g))
    )
  }

  const allConversations = useMemo(() => getAllConversations(groups), [groups])
  const requestedConversationId = useMemo(
    () => new URLSearchParams(location.search).get('conversation'),
    [location.search],
  )

  useEffect(() => {
    const state = location.state as BrokerMessagesLocationState | null
    const leadConversation = state?.leadConversation

    if (!leadConversation) {
      return
    }

    const existingConversation = getAllConversations(groups).find(
      (conversation) => conversation.id === leadConversation.id
    )

    if (existingConversation) {
      setSelectedConversation(existingConversation)
      setViewMode('property')
      return
    }

    const newConversation: Conversation = {
      id: leadConversation.id,
      userId: `tenant-${leadConversation.id}`,
      userName: leadConversation.leadName,
      userRole: 'tenant',
      userAvatar: leadConversation.leadAvatar,
      propertyId: leadConversation.propertyId,
      propertyName: leadConversation.propertyName,
      lastMessage: leadConversation.lastMessage || leadConversation.note,
      lastMessageTime: new Date(),
      unreadCount: 0,
      isOnline: true,
      messages: [
        {
          id: `${leadConversation.id}-intro`,
          senderId: `tenant-${leadConversation.id}`,
          senderName: leadConversation.leadName,
          senderRole: 'tenant',
          text: leadConversation.note || `Interested in ${leadConversation.propertyName}`,
          timestamp: new Date(),
          status: 'sent',
        },
      ],
    }

    setGroups((currentGroups) => {
      if (getAllConversations(currentGroups).some((conversation) => conversation.id === newConversation.id)) {
        return currentGroups
      }

      let propertyMatched = false
      const groupsWithLead = currentGroups.map((group) => {
        let groupHasMatch = false
        const updatedProperties = group.properties.map((property) => {
          if (property.id === leadConversation.propertyId || property.name === leadConversation.propertyName) {
            propertyMatched = true
            groupHasMatch = true
            return {
              ...property,
              tenantConversations: [newConversation, ...property.tenantConversations],
            }
          }
          return property
        })

        return {
          ...group,
          isExpanded: groupHasMatch ? true : group.isExpanded,
          properties: updatedProperties,
        }
      })

      if (propertyMatched) {
        return groupsWithLead
      }

      const generatedGroupId = 'generated-lead-conversations'
      const generatedProperty = {
        id: leadConversation.propertyId,
        name: leadConversation.propertyName,
        address: 'Lead generated from broker property view',
        groupId: generatedGroupId,
        ownerConversation: undefined,
        tenantConversations: [newConversation],
      }

      const generatedGroupIndex = groupsWithLead.findIndex((group) => group.id === generatedGroupId)
      if (generatedGroupIndex >= 0) {
        return groupsWithLead.map((group, index) =>
          index === generatedGroupIndex
            ? {
                ...group,
                unreadCount: group.unreadCount,
                isExpanded: true,
                properties: [generatedProperty, ...group.properties],
              }
            : group
        )
      }

      return [
        {
          id: generatedGroupId,
          name: 'Lead Conversations',
          unreadCount: 0,
          isExpanded: true,
          properties: [generatedProperty],
        },
        ...groupsWithLead,
      ]
    })

    setSelectedConversation(newConversation)
    setViewMode('property')
  }, [groups, location.key, location.state])

  useEffect(() => {
    if (!requestedConversationId) {
      return
    }

    const conversation = allConversations.find(
      (item) => item.id === requestedConversationId
    )

    if (conversation) {
      setSelectedConversation(conversation)
      setViewMode('property')
    }
  }, [allConversations, requestedConversationId])

  const filteredConversations = useMemo(() => {
    if (!searchQuery) return allConversations
    const query = searchQuery.toLowerCase()
    return allConversations.filter(
      (conv) =>
        conv.userName.toLowerCase().includes(query) ||
        conv.propertyName.toLowerCase().includes(query) ||
        conv.lastMessage.toLowerCase().includes(query)
    )
  }, [allConversations, searchQuery])

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return
    if (chats.some((thread) => thread.id === selectedConversation.id)) {
      sendSharedMessage(selectedConversation.id, messageText.trim())
      setMessageText('')
      return
    }

    const newMessage: Message = {
      id: `m-${Date.now()}`,
      senderId: 'broker-1',
      senderName: 'You',
      senderRole: 'broker',
      text: messageText.trim(),
      timestamp: new Date(),
      status: 'sent',
    }

    // Update the specific conversation with new message
    setGroups((prevGroups) => {
      return prevGroups.map((group) => ({
        ...group,
        properties: group.properties.map((property) => {
          // Update owner conversation
          if (property.ownerConversation?.id === selectedConversation.id) {
            const updatedConversation = {
              ...property.ownerConversation,
              messages: [...property.ownerConversation.messages, newMessage],
              lastMessage: messageText.trim(),
              lastMessageTime: new Date(),
            }
            // Update selected conversation immediately
            setSelectedConversation(updatedConversation)
            return {
              ...property,
              ownerConversation: updatedConversation,
            }
          }

          // Update tenant conversation
          const tenantIndex = property.tenantConversations.findIndex(
            (conv) => conv.id === selectedConversation.id
          )
          if (tenantIndex !== -1) {
            const updatedTenantConversations = [...property.tenantConversations]
            const updatedConversation = {
              ...updatedTenantConversations[tenantIndex],
              messages: [...updatedTenantConversations[tenantIndex].messages, newMessage],
              lastMessage: messageText.trim(),
              lastMessageTime: new Date(),
            }
            updatedTenantConversations[tenantIndex] = updatedConversation
            // Update selected conversation immediately
            setSelectedConversation(updatedConversation)
            return {
              ...property,
              tenantConversations: updatedTenantConversations,
            }
          }

          return property
        }),
      }))
    })

    setMessageText('')
  }

  const handleReportUser = () => {
    setShowMoreMenu(false)
    setShowReportModal(true)
  }

  const handleSubmitReport = (reason: string) => {
    // Here you would typically send this to your API
    console.log('Reporting user:', selectedConversation?.userName, 'Reason:', reason)
    alert(`Report submitted for ${selectedConversation?.userName}`)
    setShowReportModal(false)
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    } else if (days === 1) {
      return 'Yesterday'
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-canvas">
      {/* LEFT SIDEBAR - Property Groups */}
      <div className="w-80 border-r border-outline bg-white flex flex-col">
        {/* Header with View Toggle */}
        <div className="p-4 border-b border-outline space-y-4">
          <h2 className="text-heading-3 font-bold text-text-primary">Messages</h2>
          
          {/* View Mode Toggle */}
          <div className="inline-flex w-full rounded-button bg-canvas-alt p-1">
            <button
              type="button"
              onClick={() => setViewMode('property')}
              className={cn(
                'flex-1 rounded-button px-4 py-2 text-label font-semibold transition-all',
                viewMode === 'property'
                  ? 'bg-navy text-white shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              )}
            >
              Property View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('inbox')}
              className={cn(
                'flex-1 rounded-button px-4 py-2 text-label font-semibold transition-all',
                viewMode === 'inbox'
                  ? 'bg-navy text-white shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              )}
            >
              Inbox View
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-input border border-outline bg-white text-body text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {/* Groups / Inbox List */}
        <div className="flex-1 overflow-y-auto">
          {viewMode === 'property' ? (
            // Property View
            <div className="p-2">
              {groups.map((group) => (
                <div key={group.id} className="mb-2">
                  {/* Group Header */}
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-button hover:bg-hover-light transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      {group.isExpanded ? (
                        <ChevronDown size={16} className="text-text-muted" />
                      ) : (
                        <ChevronRight size={16} className="text-text-muted" />
                      )}
                      <span className="text-body font-semibold text-text-primary">
                        {group.name}
                      </span>
                      {group.unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-pill bg-primary text-white text-[10px] font-bold">
                          {group.unreadCount}
                        </span>
                      )}
                    </div>
                    <span className="text-label text-text-muted">
                      {group.properties.length}
                    </span>
                  </button>

                  {/* Properties in Group */}
                  {group.isExpanded && (
                    <div className="ml-3 mt-2 space-y-3">
                      {group.properties.map((property) => (
                        <div key={property.id} className="space-y-2">
                          <div className="px-3 py-2 bg-canvas-alt rounded-button">
                            <p className="text-body font-bold text-navy tracking-tight">
                              {property.name}
                            </p>
                            <p className="text-[11px] text-text-muted mt-0.5">
                              {property.address}
                            </p>
                          </div>
                          
                          {/* Owner Conversation */}
                          {property.ownerConversation && (
                            <ConversationCard
                              conversation={property.ownerConversation}
                              isSelected={selectedConversation?.id === property.ownerConversation.id}
                              onClick={() => setSelectedConversation(property.ownerConversation!)}
                              formatTime={formatTime}
                            />
                          )}

                          {/* Tenant Conversations */}
                          {property.tenantConversations.map((conv) => (
                            <ConversationCard
                              key={conv.id}
                              conversation={conv}
                              isSelected={selectedConversation?.id === conv.id}
                              onClick={() => setSelectedConversation(conv)}
                              formatTime={formatTime}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Inbox View
            <div className="p-2">
              {filteredConversations.map((conv) => (
                <ConversationCard
                  key={conv.id}
                  conversation={conv}
                  isSelected={selectedConversation?.id === conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  formatTime={formatTime}
                  showPropertyName
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL - Chat Window */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="h-18 border-b border-outline px-6 py-4 flex items-center justify-between bg-white shadow-sm">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={selectedConversation.userAvatar}
                  alt={selectedConversation.userName}
                  className="w-12 h-12 rounded-full ring-2 ring-outline"
                />
                {selectedConversation.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-status-success-text rounded-full border-2 border-white" />
                )}
              </div>
              <div>
                <h3 className="text-body-lg font-bold text-text-primary">
                  {selectedConversation.userName}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={cn(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-pill text-[11px] font-semibold uppercase',
                    selectedConversation.userRole === 'owner'
                      ? 'bg-primary-100 text-primary'
                      : 'bg-purple-50 text-purple-600'
                  )}>
                    {selectedConversation.userRole === 'owner' ? '👤 Owner' : '🏠 Tenant'}
                  </span>
                  <span className="text-label text-text-muted">•</span>
                  <span className="text-label font-semibold text-navy">
                    {selectedConversation.propertyName}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-2.5 rounded-button text-text-muted hover:bg-hover-light hover:text-primary transition-colors"
                title="Voice call"
              >
                <Phone size={20} />
              </button>
              <button
                type="button"
                className="p-2.5 rounded-button text-text-muted hover:bg-hover-light hover:text-primary transition-colors"
                title="Video call"
              >
                <Video size={20} />
              </button>
              <div className="relative" ref={moreMenuRef}>
                <button
                  type="button"
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="p-2.5 rounded-button text-text-muted hover:bg-hover-light hover:text-text-primary transition-colors"
                  title="More options"
                >
                  <MoreVertical size={20} />
                </button>

                {/* Dropdown Menu */}
                {showMoreMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-card border border-outline bg-white shadow-lg z-50">
                    <button
                      type="button"
                      onClick={handleReportUser}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-body text-status-error hover:bg-status-error-bg transition-colors rounded-t-card"
                    >
                      <Flag size={18} />
                      <span className="font-medium">Report User</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-slate-50 to-canvas-alt space-y-4">
            {selectedConversation.messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-canvas flex items-center justify-center mb-4">
                    <Send size={32} className="text-text-muted" />
                  </div>
                  <p className="text-body text-text-muted">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              </div>
            ) : (
              <>
                {selectedConversation.messages.map((message) => {
                  const isFromBroker = message.senderRole === 'broker'
                  return (
                    <div
                      key={message.id}
                      className={cn(
                        'flex gap-3 items-end',
                        isFromBroker ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {!isFromBroker && (
                        <img
                          src={selectedConversation.userAvatar}
                          alt={message.senderName}
                          className="w-8 h-8 rounded-full shrink-0"
                        />
                      )}
                      <div
                        className={cn(
                          'max-w-md rounded-2xl px-4 py-2.5 shadow-sm',
                          isFromBroker
                            ? 'bg-primary text-white rounded-br-sm'
                            : 'bg-white text-text-primary border border-outline rounded-bl-sm'
                        )}
                      >
                        <p className="text-body leading-relaxed">{message.text}</p>
                        <p
                          className={cn(
                            'text-[11px] mt-1 font-medium',
                            isFromBroker ? 'text-white/70' : 'text-text-muted'
                          )}
                        >
                          {message.timestamp.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  )
                })}
                {/* Auto-scroll anchor */}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Message Input */}
          <div className="h-20 border-t border-outline px-6 flex items-center gap-3 bg-white">
            <button
              type="button"
              className="p-2.5 rounded-button text-text-muted hover:bg-primary-50 hover:text-primary transition-colors"
              title="Attach file"
            >
              <Paperclip size={20} />
            </button>
            <button
              type="button"
              className="p-2.5 rounded-button text-text-muted hover:bg-primary-50 hover:text-primary transition-colors"
              title="Add emoji"
            >
              <Smile size={20} />
            </button>
            <input
              type="text"
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              className="flex-1 h-11 px-4 rounded-input border border-outline bg-white text-body text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
            <button
              type="button"
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              className="p-3 rounded-button bg-primary text-white hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
              title="Send message"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      ) : (
        // Empty State
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 via-canvas-alt to-blue-50">
          <div className="text-center px-6">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-primary-100 flex items-center justify-center mb-6 shadow-sm">
              <Search size={40} className="text-primary" />
            </div>
            <h3 className="text-heading-2 font-bold text-text-primary mb-2">
              Select a conversation
            </h3>
            <p className="text-body text-text-muted max-w-sm mx-auto leading-relaxed">
              Choose a property owner or tenant conversation from the list to start messaging
            </p>
            <div className="mt-6 flex items-center justify-center gap-4 text-label text-text-muted">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>Unread</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-status-success-text" />
                <span>Online</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report User Modal */}
      {showReportModal && selectedConversation && (
        <ReportUserModal
          userName={selectedConversation.userName}
          userRole={selectedConversation.userRole}
          onClose={() => setShowReportModal(false)}
          onSubmit={handleSubmitReport}
        />
      )}
    </div>
  )
}

// Conversation Card Component
interface ConversationCardProps {
  conversation: Conversation
  isSelected: boolean
  onClick: () => void
  formatTime: (date: Date) => string
  showPropertyName?: boolean
}

function ConversationCard({
  conversation,
  isSelected,
  onClick,
  formatTime,
  showPropertyName = false,
}: ConversationCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-start gap-3 px-3 py-3 rounded-button text-left transition-all',
        isSelected
          ? 'bg-primary-100 border border-primary shadow-sm'
          : 'hover:bg-hover-light border border-transparent hover:shadow-sm',
        conversation.unreadCount > 0 && !isSelected && 'bg-blue-50/50 border-blue-100'
      )}
    >
      <div className="relative shrink-0">
        <img
          src={conversation.userAvatar}
          alt={conversation.userName}
          className={cn(
            'w-10 h-10 rounded-full',
            isSelected ? 'ring-2 ring-primary' : 'ring-1 ring-outline'
          )}
        />
        {conversation.isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-status-success-text rounded-full border-2 border-white" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex-1 min-w-0">
            <p className={cn(
              'text-body font-semibold text-text-primary truncate',
              conversation.unreadCount > 0 && 'font-bold'
            )}>
              {conversation.userName}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={cn(
                'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide',
                conversation.userRole === 'owner'
                  ? 'bg-primary-100 text-primary'
                  : 'bg-purple-50 text-purple-600'
              )}>
                {conversation.userRole === 'owner' ? '👤' : '🏠'}
                <span>{conversation.userRole}</span>
              </span>
              {showPropertyName && (
                <>
                  <span className="text-text-muted">•</span>
                  <span className="text-[11px] font-semibold text-navy truncate">
                    {conversation.propertyName}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[11px] font-medium text-text-muted whitespace-nowrap">
              {formatTime(conversation.lastMessageTime)}
            </span>
            {conversation.unreadCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-white text-[10px] font-bold shadow-sm">
                {conversation.unreadCount}
              </span>
            )}
          </div>
        </div>
        <p
          className={cn(
            'text-label text-text-muted truncate leading-relaxed',
            conversation.unreadCount > 0 && 'font-medium text-text-primary'
          )}
        >
          {conversation.lastMessage}
        </p>
      </div>
    </button>
  )
}

// Report User Modal Component
interface ReportUserModalProps {
  userName: string
  userRole: UserRole
  onClose: () => void
  onSubmit: (reason: string) => void
}

function ReportUserModal({ userName, userRole, onClose, onSubmit }: ReportUserModalProps) {
  const [selectedReason, setSelectedReason] = useState('')
  const [additionalDetails, setAdditionalDetails] = useState('')

  const reportReasons = [
    'Inappropriate behavior',
    'Harassment or threats',
    'Spam or scam',
    'Fraudulent activity',
    'Violates terms of service',
    'Other',
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReason) return

    const fullReason = additionalDetails
      ? `${selectedReason}: ${additionalDetails}`
      : selectedReason
    onSubmit(fullReason)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-white rounded-card shadow-modal">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline">
          <div>
            <h3 className="text-heading-3 font-bold text-text-primary">Report User</h3>
            <p className="text-label text-text-muted mt-1">
              Report {userName} ({userRole})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-button text-text-muted hover:bg-hover-light hover:text-text-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-body font-semibold text-text-primary mb-3 block">
              Select a reason *
            </label>
            <div className="space-y-2">
              {reportReasons.map((reason) => (
                <label
                  key={reason}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-button border cursor-pointer transition-all',
                    selectedReason === reason
                      ? 'border-primary bg-primary-100'
                      : 'border-outline hover:bg-hover-light'
                  )}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span className="text-body text-text-primary">{reason}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-body font-semibold text-text-primary mb-2 block">
              Additional details (optional)
            </label>
            <textarea
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              placeholder="Provide more context about this report..."
              rows={4}
              className="w-full px-4 py-3 rounded-input border border-outline bg-white text-body text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-button border border-outline bg-white text-body font-semibold text-text-primary hover:bg-hover-light transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedReason}
              className="flex-1 px-4 py-2.5 rounded-button bg-status-error text-white text-body font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
