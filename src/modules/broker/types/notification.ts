export type NotificationFilter = 'all' | 'unread' | 'important'

export type NotificationIconVariant = 'message' | 'payment' | 'announcement' | 'success' | 'assignment' | 'client'

export interface BrokerNotification {
  id: string
  title: string
  description: string
  timestamp: string
  unread: boolean
  important: boolean
  icon: string
  iconVariant: NotificationIconVariant
}
