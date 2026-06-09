import { create } from 'zustand'

export interface OwnerChatMessage {
  id: number
  sender: 'tenant' | 'broker' | 'owner'
  text: string
  time: string
}

export type OwnerChatContactType = 'broker' | 'tenant'

export interface OwnerChatConversation {
  id: number
  contactType: OwnerChatContactType
  name: string
  role: string
  preview: string
  time: string
  unread: number
  avatar: string
  property: string
  propertyImage: string
  listing: string
  location: string
  price: string
  messages: OwnerChatMessage[]
}

interface OwnerChatState {
  conversations: OwnerChatConversation[]
  sendMessage: (conversationId: number, text: string) => void
  markConversationRead: (conversationId: number) => void
}

const initialConversations: OwnerChatConversation[] = [
  {
    id: 1,
    contactType: 'broker',
    role: 'Assigned Broker',
    name: 'Jordan Lee',
    preview: 'I found 5 qualified tenant leads for Skyline Heights.',
    time: '10:50 AM',
    unread: 1,
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    property: 'Skyline Heights - Unit 402',
    propertyImage:
      'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=180&q=80',
    listing: 'Modern Penthouse Suite',
    location: 'Park Avenue, New York',
    price: '$4,500',
    messages: [
      {
        id: 1,
        sender: 'broker',
        text: 'I found 5 qualified tenant leads for Skyline Heights. Two of them are ready for a viewing this week.',
        time: '10:48 AM',
      },
      {
        id: 2,
        sender: 'owner',
        text: 'Great. Please prioritize tenants who can move in immediately.',
        time: '10:49 AM',
      },
      {
        id: 3,
        sender: 'broker',
        text: 'Done. I will share the shortlist after the verification calls.',
        time: '10:50 AM',
      },
    ],
  },
  {
    id: 2,
    contactType: 'broker',
    role: 'Premium Broker',
    name: 'Maya Deshpande',
    preview: 'The family tenant lead requested Saturday viewing.',
    time: '9:30 AM',
    unread: 0,
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    property: 'Parkview Residences - 8A',
    propertyImage:
      'https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=180&q=80',
    listing: 'Parkview Residences',
    location: 'Velachery, Chennai',
    price: 'Rs. 38,000',
    messages: [
      {
        id: 1,
        sender: 'broker',
        text: 'The family tenant lead requested Saturday viewing. Should I keep the 11 AM slot open?',
        time: '9:30 AM',
      },
    ],
  },
  {
    id: 3,
    contactType: 'tenant',
    role: 'Tenant Lead',
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
    id: 4,
    contactType: 'tenant',
    role: 'Current Tenant',
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
    id: 5,
    contactType: 'tenant',
    role: 'Prospective Tenant',
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

function formatTime(date = new Date()) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

export const useOwnerChatStore = create<OwnerChatState>((set) => ({
  conversations: initialConversations,

  sendMessage: (conversationId, text) => {
    const trimmedText = text.trim()
    if (!trimmedText) return

    const now = formatTime()
    const message: OwnerChatMessage = {
      id: Date.now(),
      sender: 'owner',
      text: trimmedText,
      time: now,
    }

    set((state) => ({
      conversations: state.conversations.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              preview: trimmedText,
              time: now,
              unread: 0,
              messages: [...conversation.messages, message],
            }
          : conversation
      ),
    }))
  },

  markConversationRead: (conversationId) => {
    set((state) => ({
      conversations: state.conversations.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, unread: 0 }
          : conversation
      ),
    }))
  },
}))
