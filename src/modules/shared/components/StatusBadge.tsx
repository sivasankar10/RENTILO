import { Badge } from '@shared/ui'
import type { StatusVariant } from '@shared/types'

interface StatusBadgeProps {
  status: string
  className?: string
}

/** Maps common status strings to design-language status variants */
const statusMap: Record<string, StatusVariant> = {
  active: 'success',
  verified: 'success',
  available: 'success',
  completed: 'success',
  paid: 'success',
  approved: 'success',
  scheduled: 'warning',
  pending: 'warning',
  maintenance: 'warning',
  'in-progress': 'warning',
  review: 'warning',
  urgent: 'error',
  overdue: 'error',
  rejected: 'error',
  cancelled: 'error',
  'not-done': 'error',
  unlisted: 'default',
  inactive: 'default',
  draft: 'default',
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant = statusMap[status.toLowerCase()] || 'default'

  return (
    <Badge variant={variant} className={className}>
      {status}
    </Badge>
  )
}
