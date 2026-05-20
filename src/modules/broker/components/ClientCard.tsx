import { Card } from '@shared/ui'
import { StatusBadge } from '@shared/components'
import { cn } from '@shared/utils/cn'

interface ClientCardProps {
  name: string
  email: string
  type: 'tenant' | 'owner'
  status: string
  assignedListings: number
  onClick?: () => void
  className?: string
}

export function ClientCard({ name, email, type, status, assignedListings, onClick, className }: ClientCardProps) {
  return (
    <Card hover padding="md" className={cn('', className)} onClick={onClick}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary font-bold text-body">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="text-body font-semibold text-text-primary">{name}</h4>
            <p className="text-label text-text-muted">{email}</p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>
      <div className="flex items-center gap-4 text-label text-text-muted">
        <span className="capitalize">{type}</span>
        <span>•</span>
        <span>{assignedListings} listings</span>
      </div>
    </Card>
  )
}
