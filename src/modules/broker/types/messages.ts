export type UserRole = 'owner' | 'tenant'
export type MessageStatus = 'sent' | 'delivered' | 'read'
export type ViewMode = 'property' | 'inbox'

export interface Message {
  id: string
  senderId: string
  senderName: string
  senderRole: UserRole | 'broker'
  text: string
  timestamp: Date
  status: MessageStatus
  attachments?: string[]
}

export interface Conversation {
  id: string
  userId: string
  userName: string
  userRole: UserRole
  userAvatar: string
  propertyId: string
  propertyName: string
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  isOnline: boolean
  messages: Message[]
}

export interface Property {
  id: string
  name: string
  address: string
  groupId: string
  ownerConversation?: Conversation
  tenantConversations: Conversation[]
}

export interface PropertyGroup {
  id: string
  name: string
  properties: Property[]
  unreadCount: number
  isExpanded: boolean
}
