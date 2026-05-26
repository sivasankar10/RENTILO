import type { TenantNotification } from '../types/notification'

/** Mock notifications until API is ready */
export const TENANT_NOTIFICATIONS: TenantNotification[] = [
  {
    id: 'n-1',
    title: 'Owner responded to your request',
    description:
      "Regarding the plumbing maintenance at 402 Redwood Grove. Status updated to 'In Progress'.",
    timestamp: '2 MINS AGO',
    unread: true,
    important: true,
    icon: 'mail',
    iconVariant: 'message',
  },
  {
    id: 'n-2',
    title: 'Rent Payment Confirmed',
    description:
      'Your payment for October has been successfully processed. View your receipt in the billing section.',
    timestamp: 'YESTERDAY',
    unread: false,
    important: true,
    icon: 'payments',
    iconVariant: 'payment',
  },
  {
    id: 'n-3',
    title: 'Building Maintenance Notice',
    description:
      'Routine elevator inspection scheduled for Monday morning between 9 AM and 11 AM.',
    timestamp: '3 DAYS AGO',
    unread: false,
    important: false,
    icon: 'campaign',
    iconVariant: 'announcement',
  },
  {
    id: 'n-4',
    title: 'Lease Renewal Signed',
    description:
      'All parties have signed the lease renewal for Unit 204. You can download the final PDF in your documents.',
    timestamp: 'OCT 12',
    unread: false,
    important: false,
    icon: 'check_circle',
    iconVariant: 'success',
  },
]
