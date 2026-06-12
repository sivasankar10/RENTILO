import { cn } from '@shared/utils/cn'
import type { TenantNotification } from '../types/notification'
import { MaterialIcon } from './MaterialIcon'

const ICON_STYLES = {
  message: 'bg-blue-50 text-blue-600',
  payment: 'bg-amber-50 text-amber-600',
  announcement: 'bg-brand-container-high text-brand-outline',
  success: 'bg-blue-50 text-blue-600',
} as const

interface NotificationCardProps {
  notification: TenantNotification
  onMarkRead: (id: string) => void
  onToggleImportant: (id: string) => void
}

export function NotificationCard({
  notification,
  onMarkRead,
  onToggleImportant,
}: NotificationCardProps) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onMarkRead(notification.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onMarkRead(notification.id)
        }
      }}
      className={cn(
        'flex items-start gap-4 p-5 rounded-xl bg-brand-container-lowest border text-left cursor-pointer',
        'shadow-sm transition-shadow hover:shadow-card focus:outline-none focus:ring-2 focus:ring-brand/20',
        notification.unread ? 'border-brand/30' : 'border-brand-outline-variant/80'
      )}
    >
      <div
        className={cn(
          'flex shrink-0 items-center justify-center w-11 h-11 rounded-lg',
          ICON_STYLES[notification.iconVariant]
        )}
      >
        <MaterialIcon name={notification.icon} className="!text-[22px]" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4 mb-1">
          <h3 className="flex items-center gap-2 font-body text-[15px] font-bold text-brand leading-snug">
            {notification.unread && (
              <span
                className="shrink-0 w-2 h-2 rounded-full bg-blue-500"
                aria-label="Unread"
              />
            )}
            {notification.title}
          </h3>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onToggleImportant(notification.id)
              }}
              aria-pressed={notification.important}
              title={notification.important ? 'Remove from important' : 'Mark as important'}
              className={cn(
                'grid h-8 w-8 place-items-center rounded-full border-0 bg-transparent transition-colors',
                notification.important
                  ? 'text-brand-gold hover:bg-brand-gold/10'
                  : 'text-brand-outline hover:bg-brand-container-high hover:text-brand-gold'
              )}
            >
              <MaterialIcon name="star" className="!text-xl" filled={notification.important} />
            </button>
            <time className="font-body text-[11px] font-semibold tracking-wide text-brand-outline uppercase whitespace-nowrap pt-0.5">
              {notification.timestamp}
            </time>
          </div>
        </div>
        <p className="font-body text-sm text-brand-on-surface-variant leading-relaxed pr-2">
          {notification.description}
        </p>
      </div>
    </article>
  )
}
