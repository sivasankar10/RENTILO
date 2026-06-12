import type { PropertyGroup, Conversation, Message } from '../types/messages'

// Mock messages
const createMessages = (conversationId: string): Message[] => {
  const baseMessages: Record<string, Message[]> = {
    'conv-1': [
      {
        id: 'm-1',
        senderId: 'owner-1',
        senderName: 'Julian Vane',
        senderRole: 'owner',
        text: 'Hello, I wanted to discuss the current market pricing for Skyline Heights.',
        timestamp: new Date('2024-01-15T10:30:00'),
        status: 'read',
      },
      {
        id: 'm-2',
        senderId: 'broker-1',
        senderName: 'You',
        senderRole: 'broker',
        text: 'Good morning! Based on recent comparable properties, I suggest we price it at $4,500/month.',
        timestamp: new Date('2024-01-15T10:35:00'),
        status: 'read',
      },
      {
        id: 'm-3',
        senderId: 'owner-1',
        senderName: 'Julian Vane',
        senderRole: 'owner',
        text: 'That sounds reasonable. Please proceed with listing it.',
        timestamp: new Date('2024-01-15T10:40:00'),
        status: 'delivered',
      },
    ],
    'conv-2': [
      {
        id: 'm-4',
        senderId: 'tenant-1',
        senderName: 'Sarah Martinez',
        senderRole: 'tenant',
        text: 'Hi! Is this property still available for viewing this weekend?',
        timestamp: new Date('2024-01-15T14:20:00'),
        status: 'sent',
      },
      {
        id: 'm-5',
        senderId: 'tenant-1',
        senderName: 'Sarah Martinez',
        senderRole: 'tenant',
        text: 'I am very interested and can sign the lease immediately if it meets my requirements.',
        timestamp: new Date('2024-01-15T14:22:00'),
        status: 'sent',
      },
    ],
    'conv-3': [
      {
        id: 'm-6',
        senderId: 'owner-2',
        senderName: 'Emily Chen',
        senderRole: 'owner',
        text: 'The tenant mentioned some issues with the heating system.',
        timestamp: new Date('2024-01-14T09:15:00'),
        status: 'read',
      },
      {
        id: 'm-7',
        senderId: 'broker-1',
        senderName: 'You',
        senderRole: 'broker',
        text: 'I will coordinate with the maintenance team immediately.',
        timestamp: new Date('2024-01-14T09:20:00'),
        status: 'read',
      },
    ],
    'conv-4': [
      {
        id: 'm-8',
        senderId: 'tenant-2',
        senderName: 'Michael Brown',
        senderRole: 'tenant',
        text: 'Thank you for the quick response on the maintenance request!',
        timestamp: new Date('2024-01-14T16:45:00'),
        status: 'read',
      },
    ],
    'conv-5': [
      {
        id: 'm-9',
        senderId: 'owner-3',
        senderName: 'David Park',
        senderRole: 'owner',
        text: 'Can we schedule a property inspection next week?',
        timestamp: new Date('2024-01-13T11:00:00'),
        status: 'read',
      },
      {
        id: 'm-10',
        senderId: 'broker-1',
        senderName: 'You',
        senderRole: 'broker',
        text: 'Absolutely! How about Tuesday at 2 PM?',
        timestamp: new Date('2024-01-13T11:15:00'),
        status: 'read',
      },
      {
        id: 'm-11',
        senderId: 'owner-3',
        senderName: 'David Park',
        senderRole: 'owner',
        text: 'Perfect! See you then.',
        timestamp: new Date('2024-01-13T11:20:00'),
        status: 'read',
      },
    ],
  }
  return baseMessages[conversationId] || []
}

// Mock conversations
export const MOCK_PROPERTY_GROUPS: PropertyGroup[] = [
  {
    id: 'group-1',
    name: 'Downtown Portfolio',
    unreadCount: 2,
    isExpanded: true,
    properties: [
      {
        id: 'prop-1',
        name: 'Skyline Heights - Unit 402',
        address: '1248 Park Avenue, New York',
        groupId: 'group-1',
        ownerConversation: {
          id: 'conv-1',
          userId: 'owner-1',
          userName: 'Julian Vane',
          userRole: 'owner',
          userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julian',
          propertyId: 'prop-1',
          propertyName: 'Skyline Heights - Unit 402',
          lastMessage: 'That sounds reasonable. Please proceed with listing it.',
          lastMessageTime: new Date('2024-01-15T10:40:00'),
          unreadCount: 1,
          isOnline: true,
          messages: createMessages('conv-1'),
        },
        tenantConversations: [
          {
            id: 'conv-2',
            userId: 'tenant-1',
            userName: 'Sarah Martinez',
            userRole: 'tenant',
            userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
            propertyId: 'prop-1',
            propertyName: 'Skyline Heights - Unit 402',
            lastMessage: 'I am very interested and can sign the lease immediately if it meets my requirements.',
            lastMessageTime: new Date('2024-01-15T14:22:00'),
            unreadCount: 2,
            isOnline: true,
            messages: createMessages('conv-2'),
          },
        ],
      },
      {
        id: 'prop-2',
        name: 'Harbor Residences',
        address: '890 Waterfront Drive, New York',
        groupId: 'group-1',
        ownerConversation: {
          id: 'conv-3',
          userId: 'owner-2',
          userName: 'Emily Chen',
          userRole: 'owner',
          userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
          propertyId: 'prop-2',
          propertyName: 'Harbor Residences',
          lastMessage: 'The tenant mentioned some issues with the heating system.',
          lastMessageTime: new Date('2024-01-14T09:15:00'),
          unreadCount: 0,
          isOnline: false,
          messages: createMessages('conv-3'),
        },
        tenantConversations: [
          {
            id: 'conv-4',
            userId: 'tenant-2',
            userName: 'Michael Brown',
            userRole: 'tenant',
            userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
            propertyId: 'prop-2',
            propertyName: 'Harbor Residences',
            lastMessage: 'Thank you for the quick response on the maintenance request!',
            lastMessageTime: new Date('2024-01-14T16:45:00'),
            unreadCount: 0,
            isOnline: true,
            messages: createMessages('conv-4'),
          },
        ],
      },
    ],
  },
  {
    id: 'group-2',
    name: 'Suburban Properties',
    unreadCount: 0,
    isExpanded: false,
    properties: [
      {
        id: 'prop-3',
        name: 'Greenwich Penthouse',
        address: '456 Greenwich St, Connecticut',
        groupId: 'group-2',
        ownerConversation: {
          id: 'conv-5',
          userId: 'owner-3',
          userName: 'David Park',
          userRole: 'owner',
          userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
          propertyId: 'prop-3',
          propertyName: 'Greenwich Penthouse',
          lastMessage: 'Perfect! See you then.',
          lastMessageTime: new Date('2024-01-13T11:20:00'),
          unreadCount: 0,
          isOnline: false,
          messages: createMessages('conv-5'),
        },
        tenantConversations: [],
      },
    ],
  },
  {
    id: 'group-3',
    name: 'Luxury Apartments',
    unreadCount: 0,
    isExpanded: false,
    properties: [
      {
        id: 'prop-4',
        name: 'Alpine Terrace',
        address: '789 Mountain View, Colorado',
        groupId: 'group-3',
        ownerConversation: {
          id: 'conv-6',
          userId: 'owner-4',
          userName: 'Lisa Anderson',
          userRole: 'owner',
          userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
          propertyId: 'prop-4',
          propertyName: 'Alpine Terrace',
          lastMessage: 'Let me know if you need any additional documents.',
          lastMessageTime: new Date('2024-01-12T15:30:00'),
          unreadCount: 0,
          isOnline: false,
          messages: [],
        },
        tenantConversations: [],
      },
    ],
  },
]

// Helper to get all conversations in a flat list
export const getAllConversations = (groups: PropertyGroup[]): Conversation[] => {
  const conversations: Conversation[] = []
  groups.forEach((group) => {
    group.properties.forEach((property) => {
      if (property.ownerConversation) {
        conversations.push(property.ownerConversation)
      }
      conversations.push(...property.tenantConversations)
    })
  })
  return conversations.sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime())
}
