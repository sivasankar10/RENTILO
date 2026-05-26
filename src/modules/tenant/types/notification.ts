export type NotificationFilter = 'all' | 'unread' | 'important'

export type NotificationIconVariant = 'message' | 'payment' | 'announcement' | 'success'

export interface TenantNotification {
  id: string
  title: string
  description: string
  timestamp: string
  unread: boolean
  important: boolean
  icon: string
  iconVariant: NotificationIconVariant
}
