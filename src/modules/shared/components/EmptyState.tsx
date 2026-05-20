import React from 'react'
import { Inbox } from 'lucide-react'
import { Button } from '@shared/ui'
import { cn } from '@shared/utils/cn'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-8 text-center',
        className
      )}
    >
      <div className="mb-4 text-text-muted">
        {icon || <Inbox size={48} strokeWidth={1.5} />}
      </div>
      <h3 className="text-heading-3 text-text-primary mb-2">{title}</h3>
      {description && (
        <p className="text-body text-text-muted max-w-md mb-6">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
