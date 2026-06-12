import type { BrokerNotification } from '../types/notification'

/** Mock notifications for broker until API is ready */
export const BROKER_NOTIFICATIONS: BrokerNotification[] = [
  {
    id: 'n-1',
    title: 'New Property Assignment',
    description:
      'You have been assigned to Skyline Heights - Unit 402. Review property details and contact the owner to begin marketing.',
    timestamp: '15 MINS AGO',
    unread: true,
    important: true,
    icon: 'assignment',
    iconVariant: 'assignment',
  },
  {
    id: 'n-2',
    title: 'Client Viewing Request',
    description:
      'Sarah Martinez has requested a viewing for Harbor Residences on Friday, Nov 15 at 3:00 PM.',
    timestamp: '1 HOUR AGO',
    unread: true,
    important: true,
    icon: 'event',
    iconVariant: 'client',
  },
  {
    id: 'n-3',
    title: 'Commission Payment Received',
    description:
      'Your commission of $3,200 for Parkview Residences lease has been successfully processed. View details in your earnings.',
    timestamp: 'YESTERDAY',
    unread: false,
    important: true,
    icon: 'payments',
    iconVariant: 'payment',
  },
  {
    id: 'n-4',
    title: 'Owner Message',
    description:
      'Julian Vane sent you a message regarding Alpine Terrace pricing strategy. Respond to maintain your high rating.',
    timestamp: 'YESTERDAY',
    unread: false,
    important: false,
    icon: 'mail',
    iconVariant: 'message',
  },
  {
    id: 'n-5',
    title: 'Lease Agreement Signed',
    description:
      'Congratulations! The lease for Greenwich Penthouse has been signed by all parties. Commission will be processed within 48 hours.',
    timestamp: '2 DAYS AGO',
    unread: false,
    important: false,
    icon: 'check_circle',
    iconVariant: 'success',
  },
  {
    id: 'n-6',
    title: 'Performance Rating Updated',
    description:
      'Your average rating has increased to 4.9/5.0 after receiving excellent feedback from recent clients.',
    timestamp: '3 DAYS AGO',
    unread: false,
    important: false,
    icon: 'star',
    iconVariant: 'success',
  },
  {
    id: 'n-7',
    title: 'Property Listing Update Required',
    description:
      'The owner of Canary Wharf Loft has updated pricing. Please review and update the listing details accordingly.',
    timestamp: 'OCT 28',
    unread: false,
    important: false,
    icon: 'campaign',
    iconVariant: 'announcement',
  },
  {
    id: 'n-8',
    title: 'New Lead Inquiry',
    description:
      'A new qualified lead has shown interest in Shoreditch Penthouse. Contact details available in your dashboard.',
    timestamp: 'OCT 26',
    unread: false,
    important: false,
    icon: 'person_add',
    iconVariant: 'client',
  },
]
