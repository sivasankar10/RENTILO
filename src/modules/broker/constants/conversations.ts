import type { ChatConversation } from '@modules/tenant/types/chat'

const RAJESH_AVATAR =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
const SARAH_AVATAR =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
const AMIT_AVATAR =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
const PRIYA_AVATAR =
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
const NEHA_AVATAR =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'
const VIKRAM_AVATAR =
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'

const PROPERTY_IMAGE =
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&q=80'

/** Mock broker conversations until chat API is ready */
export const BROKER_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'prop-penthouse-owner',
    contactName: 'Rajesh Kumar',
    contactRole: 'owner',
    tenantName: 'Priya Nair',
    avatar: RAJESH_AVATAR,
    lastMessage: 'I can approve the visit slot for Saturday.',
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
        text: 'Can you coordinate with Priya for the 2BHK visit this weekend?',
        time: '10:42 AM',
      },
      {
        id: 'm-2',
        sender: 'broker',
        text: 'Yes Rajesh, she prefers Saturday after 4 PM. Is that available?',
        time: '10:44 AM',
        read: true,
      },
      {
        id: 'm-3',
        sender: 'owner',
        text: 'I can approve the visit slot for Saturday.',
        time: '10:45 AM',
      },
    ],
  },
  {
    id: 'prop-penthouse-tenant',
    contactName: 'Priya Nair',
    contactRole: 'tenant',
    ownerName: 'Rajesh Kumar',
    avatar: PRIYA_AVATAR,
    lastMessage: 'Please confirm if Saturday evening works.',
    timeLabel: '10:38 AM',
    unreadCount: 1,
    online: true,
    propertyTitle: '2BHK in Chennai',
    propertySubtitle: 'Modern Penthouse Suite',
    propertyLocation: 'Adyar, Chennai',
    propertyPrice: 'â‚¹45,000',
    propertyImage: PROPERTY_IMAGE,
    messages: [
      {
        id: 'm-4',
        sender: 'tenant',
        text: 'Hi, I liked the Modern Penthouse Suite. Can we schedule a visit?',
        time: '10:31 AM',
      },
      {
        id: 'm-5',
        sender: 'broker',
        text: 'Sure Priya. I am checking with the owner for Saturday evening.',
        time: '10:35 AM',
        read: true,
      },
      {
        id: 'm-6',
        sender: 'tenant',
        text: 'Please confirm if Saturday evening works.',
        time: '10:38 AM',
      },
    ],
  },
  {
    id: 'prop-lumiere-owner',
    contactName: 'Sarah Miller',
    contactRole: 'owner',
    tenantName: 'Neha Verma',
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
        id: 'm-7',
        sender: 'owner',
        text: 'The lease documents are ready for your review.',
        time: 'Yesterday',
      },
    ],
  },
  {
    id: 'prop-lumiere-tenant',
    contactName: 'Neha Verma',
    contactRole: 'tenant',
    ownerName: 'Sarah Miller',
    avatar: NEHA_AVATAR,
    lastMessage: 'I will upload my documents tonight.',
    timeLabel: 'Yesterday',
    unreadCount: 0,
    online: false,
    propertyTitle: 'Studio in Indiranagar',
    propertySubtitle: 'The Lumiere Lofts',
    propertyLocation: 'Indiranagar, Bengaluru',
    propertyPrice: 'â‚¹28,000',
    propertyImage:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=200&q=80',
    messages: [
      {
        id: 'm-8',
        sender: 'broker',
        text: 'Neha, Sarah has shared the lease draft. Please review the KYC checklist.',
        time: 'Yesterday',
        read: true,
      },
      {
        id: 'm-9',
        sender: 'tenant',
        text: 'I will upload my documents tonight.',
        time: 'Yesterday',
      },
    ],
  },
  {
    id: 'prop-oakwood-owner',
    contactName: 'Amit Shah',
    contactRole: 'owner',
    tenantName: 'Priya Shah',
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
        id: 'm-10',
        sender: 'broker',
        text: 'I can make it on Monday at 4 PM.',
        time: 'Mon',
        read: true,
      },
      {
        id: 'm-11',
        sender: 'owner',
        text: 'Thanks for confirming the viewing time.',
        time: 'Mon',
      },
    ],
  },
  {
    id: 'prop-oakwood-tenant',
    contactName: 'Vikram Reddy',
    contactRole: 'tenant',
    ownerName: 'Amit Shah',
    avatar: VIKRAM_AVATAR,
    lastMessage: 'Can you share the exact villa gate number?',
    timeLabel: 'Mon',
    unreadCount: 0,
    online: false,
    propertyTitle: '3BHK Villa',
    propertySubtitle: 'Oakwood Estate',
    propertyLocation: 'Whitefield, Bengaluru',
    propertyPrice: 'â‚¹65,000',
    propertyImage:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80',
    messages: [
      {
        id: 'm-12',
        sender: 'tenant',
        text: 'Monday at 4 PM works for me.',
        time: 'Mon',
      },
      {
        id: 'm-13',
        sender: 'broker',
        text: 'Great, I have informed Amit and blocked the slot.',
        time: 'Mon',
        read: true,
      },
      {
        id: 'm-14',
        sender: 'tenant',
        text: 'Can you share the exact villa gate number?',
        time: 'Mon',
      },
    ],
  },
]
