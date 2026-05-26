export interface ChatMessage {
  id: string
  sender: 'tenant' | 'owner'
  text: string
  time: string
  read?: boolean
}

export interface ChatConversation {
  id: string
  contactName: string
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
