import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  FileText,
  Megaphone,
  ShieldAlert,
  UserPlus,
  Wrench,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'

export type Tone = 'blue' | 'amber' | 'slate' | 'red' | 'green'

export interface AdminNotification {
  id: string
  icon: LucideIcon
  title: string
  description: string
  time: string
  tone: Tone
  unread: boolean
  important: boolean
  actionLabel?: string
  actionRoute?: string
}

/** Static demo notifications shown to admins alongside shared prototype notifications. */
export const initialNotifications: AdminNotification[] = [
  {
    id: 'n-1',
    icon: UserPlus,
    title: 'New broker registration',
    description:
      "Aditi Sharma submitted KYC documents for review. Verify identity to activate the account.",
    time: '2 mins ago',
    tone: 'blue',
    unread: true,
    important: true,
    actionLabel: 'Review broker',
    actionRoute: ROUTES.ADMIN.BROKER_MANAGEMENT,
  },
  {
    id: 'n-2',
    icon: ShieldAlert,
    title: '2 listings flagged for compliance',
    description:
      'Automated screening flagged listings #LST-22314 and #LST-99203 for missing documentation.',
    time: '12 mins ago',
    tone: 'red',
    unread: true,
    important: true,
    actionLabel: 'View listings',
    actionRoute: ROUTES.ADMIN.LISTING_MANAGEMENT,
  },
  {
    id: 'n-3',
    icon: AlertTriangle,
    title: 'Standard queue volume alert',
    description:
      '452 unassigned listings exceed the auto-routing threshold. Consider bulk assignment.',
    time: '1 hour ago',
    tone: 'amber',
    unread: true,
    important: false,
    actionLabel: 'Open queue',
    actionRoute: ROUTES.ADMIN.ASSIGNMENT_MANAGEMENT,
  },
  {
    id: 'n-4',
    icon: CreditCard,
    title: 'Payment refund processed',
    description:
      'Transaction #TRX-82911 was refunded successfully. The user has been notified by email.',
    time: '3 hours ago',
    tone: 'green',
    unread: false,
    important: false,
    actionLabel: 'View transaction',
    actionRoute: ROUTES.ADMIN.FINANCE_PAYMENTS,
  },
  {
    id: 'n-5',
    icon: FileText,
    title: 'Listing approval pending',
    description:
      'Property RF-99210 in Bandra West is awaiting manual review from the platform team.',
    time: 'Yesterday',
    tone: 'blue',
    unread: false,
    important: true,
    actionLabel: 'Review approval',
    actionRoute: ROUTES.ADMIN.PLATFORM_CONFIGURATION,
  },
  {
    id: 'n-6',
    icon: Megaphone,
    title: 'Broadcast delivered',
    description:
      'System maintenance announcement reached 1,240 users across all platform roles.',
    time: '2 days ago',
    tone: 'slate',
    unread: false,
    important: false,
  },
  {
    id: 'n-7',
    icon: Wrench,
    title: 'Scheduled maintenance window',
    description:
      'Database migration scheduled for Sunday 2 AM - 4 AM IST. Expect brief read-only mode.',
    time: '3 days ago',
    tone: 'slate',
    unread: false,
    important: false,
  },
  {
    id: 'n-8',
    icon: CheckCircle2,
    title: 'Monthly KYC report finalized',
    description:
      'October KYC verification report is ready. 94% of new users completed verification on time.',
    time: 'Oct 12',
    tone: 'green',
    unread: false,
    important: false,
    actionLabel: 'Download report',
  },
]

/** IDs of static notifications that start out unread — used to drive the header bell. */
export const STATIC_ADMIN_UNREAD_IDS = initialNotifications
  .filter((notification) => notification.unread)
  .map((notification) => notification.id)
