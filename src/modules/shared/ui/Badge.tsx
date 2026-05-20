import React from 'react'
import { cn } from '@shared/utils/cn'
import type { StatusVariant } from '@shared/types'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: StatusVariant
}

const variantStyles: Record<StatusVariant, string> = {
  success: 'bg-status-success-bg text-status-success-text',
  warning: 'bg-status-warning-bg text-status-warning-text',
  error: 'bg-status-error-bg text-status-error-text',
  info: 'bg-primary-100 text-primary-700',
  default: 'bg-hover-light text-text-muted',
}

export function Badge({
  className,
  variant = 'default',
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5',
        'text-badge font-bold uppercase tracking-wider',
        'rounded-pill',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
