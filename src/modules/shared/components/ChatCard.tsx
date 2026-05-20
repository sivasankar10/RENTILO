import { cn } from '@shared/utils/cn'
import { Card } from '@shared/ui'

interface ChatCardProps {
  name: string
  avatar?: string
  lastMessage: string
  timestamp: string
  unreadCount?: number
  isOnline?: boolean
  onClick?: () => void
  className?: string
}

export function ChatCard({
  name,
  avatar,
  lastMessage,
  timestamp,
  unreadCount = 0,
  isOnline = false,
  onClick,
  className,
}: ChatCardProps) {
  return (
    <Card
      hover
      padding="sm"
      className={cn('flex items-center gap-4', className)}
      onClick={onClick}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-canvas overflow-hidden">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-text-muted font-semibold text-body-lg">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-status-success border-2 border-surface" />
        )}
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-semibold text-body text-text-primary truncate">
            {name}
          </h4>
          <span className="text-label text-text-muted flex-shrink-0 ml-2">
            {timestamp}
          </span>
        </div>
        <p className="text-label text-text-muted truncate">{lastMessage}</p>
      </div>

      {/* Unread Badge */}
      {unreadCount > 0 && (
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
          <span className="text-badge text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>
        </div>
      )}
    </Card>
  )
}
