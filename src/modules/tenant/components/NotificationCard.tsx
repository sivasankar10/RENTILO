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
}

export function NotificationCard({ notification }: NotificationCardProps) {
  return (
    <article
      className={cn(
        'flex items-start gap-4 p-5 rounded-xl bg-brand-container-lowest border border-brand-outline-variant/80',
        'shadow-sm transition-shadow hover:shadow-card'
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
          <time className="shrink-0 font-body text-[11px] font-semibold tracking-wide text-brand-outline uppercase whitespace-nowrap pt-0.5">
            {notification.timestamp}
          </time>
        </div>
        <p className="font-body text-sm text-brand-on-surface-variant leading-relaxed pr-2">
          {notification.description}
        </p>
      </div>
    </article>
  )
}
