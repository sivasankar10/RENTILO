import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { useLeaseChatStore } from '@shared/store/leaseChatStore'

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
  tenantId?: string
  onboardingId?: string
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
  ensureTenantConversation: (payload: {
    tenantId: string
    onboardingId: string
    name: string
    propertyName: string
    unit: string
    address: string
    monthlyRent: string
    avatar: string
  }) => number
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
    listing: 'MultiOwner Skyline 14B',
    location: 'Indiranagar, Bangalore',
    price: 'Rs. 85,000',
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
    property: 'MultiOwner Skyline 14B',
    propertyImage:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=180&q=80',
    listing: 'MultiOwner Skyline 14B',
    location: 'Indiranagar, Bangalore',
    price: 'Rs. 85,000',
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
    id: 6,
    contactType: 'broker',
    role: 'Senior Portfolio Manager',
    name: 'Alexander Pierce',
    preview: 'I am ready to begin tenant matching for Skyline Heights.',
    time: 'Now',
    unread: 0,
    avatar:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80',
    property: 'MultiOwner Skyline 14B',
    propertyImage:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=180&q=80',
    listing: 'MultiOwner Skyline 14B',
    location: 'Indiranagar, Bangalore',
    price: 'Rs. 85,000',
    messages: [
      {
        id: 1,
        sender: 'broker',
        text: 'Thanks for assigning me to Skyline Heights. I am ready to begin tenant matching and share qualified leads.',
        time: 'Now',
      },
    ],
  },
  {
    id: 7,
    contactType: 'broker',
    role: 'Premium Homes Advisor',
    name: 'Priya Menon',
    preview: 'I can start verification calls for Skyline Heights today.',
    time: 'Now',
    unread: 0,
    avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    property: 'MultiOwner Skyline 14B',
    propertyImage:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=180&q=80',
    listing: 'MultiOwner Skyline 14B',
    location: 'Indiranagar, Bangalore',
    price: 'Rs. 85,000',
    messages: [
      {
        id: 1,
        sender: 'broker',
        text: 'I can start verification calls for Skyline Heights today and send the first shortlist once leads respond.',
        time: 'Now',
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
    property: 'MultiOwner Skyline 14B',
    propertyImage:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=180&q=80',
    listing: 'MultiOwner Skyline 14B',
    location: 'Indiranagar, Bangalore',
    price: 'Rs. 85,000',
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

export const useOwnerChatStore = create<OwnerChatState>()(
  persist(
    (set, get) => ({
  conversations: initialConversations,

  sendMessage: (conversationId, text) => {
    const trimmedText = text.trim()
    if (!trimmedText) return

    const conversation = get().conversations.find((item) => item.id === conversationId)
    if (conversation?.onboardingId) {
      useLeaseChatStore.getState().sendMessage(conversation.onboardingId, 'owner', trimmedText)
    }

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

  ensureTenantConversation: (payload) => {
    const existing = get().conversations.find(
      (conversation) =>
        conversation.contactType === 'tenant' && conversation.tenantId === payload.tenantId,
    )
    if (existing) return existing.id

    const nextId = Math.max(0, ...get().conversations.map((conversation) => conversation.id)) + 1
    const conversation: OwnerChatConversation = {
      id: nextId,
      contactType: 'tenant',
      tenantId: payload.tenantId,
      onboardingId: payload.onboardingId,
      role: 'Current Tenant',
      name: payload.name,
      preview: 'Lease conversation started',
      time: formatTime(),
      unread: 0,
      avatar: payload.avatar,
      property: `${payload.propertyName} - ${payload.unit}`,
      propertyImage:
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=180&q=80',
      listing: payload.propertyName,
      location: payload.address,
      price: payload.monthlyRent,
      messages: [],
    }

    set((state) => ({ conversations: [conversation, ...state.conversations] }))
    return nextId
  },
    }),
    {
      name: 'rentilo-owner-chat-session',
      storage: createJSONStorage(() => sessionStorage),
      version: 1,
    },
  ),
)
