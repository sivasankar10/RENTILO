export interface ChatMessage {
  id: string
  sender: 'tenant' | 'owner' | 'broker'
  text: string
  time: string
  read?: boolean
}

export interface ChatConversation {
  id: string
  contactName: string
  /** Shown in broker chat header alongside owner */
  tenantName?: string
  avatar: string
  lastMessage: string
  timeLabel: string
  unreadCount: number
  online: boolean
  propertyTitle: string
  propertySubtitle: string
  propertyLocation: string
  propertyPrice: string
  propertyImage: string
  messages: ChatMessage[]
}
