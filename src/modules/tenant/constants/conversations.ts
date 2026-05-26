import type { ChatConversation } from '../types/chat'

const RAJESH_AVATAR =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
const SARAH_AVATAR =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
const AMIT_AVATAR =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'

const PROPERTY_IMAGE =
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&q=80'

/** Mock conversations until chat API is ready */
export const TENANT_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv-1',
    contactName: 'Rajesh Kumar',
    avatar: RAJESH_AVATAR,
    lastMessage: 'Yes, it is. I have shared the floor plan below.',
    timeLabel: '10:45 AM',
    unreadCount: 2,
    online: true,
    propertyTitle: '2BHK in Chennai',
    propertySubtitle: 'Modern Penthouse Suite',
    propertyLocation: 'Adyar, Chennai',
    propertyPrice: '₹45,000',
    propertyImage: PROPERTY_IMAGE,
    messages: [
      {
        id: 'm-1',
        sender: 'owner',
        text: 'Hello! I saw your inquiry about the 2BHK in Chennai. Would you like to schedule a visit this weekend?',
        time: '10:42 AM',
      },
      {
        id: 'm-2',
        sender: 'tenant',
        text: "Hi Rajesh, yes I'm very interested. Is it still available for immediate move-in?",
        time: '10:44 AM',
        read: true,
      },
      {
        id: 'm-3',
        sender: 'owner',
        text: 'Yes, it is. I have shared the floor plan below. Let me know if you have any questions about the amenities.',
        time: '10:45 AM',
      },
    ],
  },
  {
    id: 'conv-2',
    contactName: 'Sarah Miller',
    avatar: SARAH_AVATAR,
    lastMessage: 'The lease documents are ready for your review.',
    timeLabel: 'Yesterday',
    unreadCount: 0,
    online: false,
    propertyTitle: 'Studio in Indiranagar',
    propertySubtitle: 'The Lumiere Lofts',
    propertyLocation: 'Indiranagar, Bengaluru',
    propertyPrice: '₹28,000',
    propertyImage:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=200&q=80',
    messages: [
      {
        id: 'm-4',
        sender: 'owner',
        text: 'The lease documents are ready for your review.',
        time: 'Yesterday',
      },
    ],
  },
  {
    id: 'conv-3',
    contactName: 'Amit Shah',
    avatar: AMIT_AVATAR,
    lastMessage: 'Thanks for confirming the viewing time.',
    timeLabel: 'Mon',
    unreadCount: 0,
    online: false,
    propertyTitle: '3BHK Villa',
    propertySubtitle: 'Oakwood Estate',
    propertyLocation: 'Whitefield, Bengaluru',
    propertyPrice: '₹65,000',
    propertyImage:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80',
    messages: [
      {
        id: 'm-5',
        sender: 'tenant',
        text: 'I can make it on Monday at 4 PM.',
        time: 'Mon',
        read: true,
      },
      {
        id: 'm-6',
        sender: 'owner',
        text: 'Thanks for confirming the viewing time.',
        time: 'Mon',
      },
    ],
  },
]
