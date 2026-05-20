import { Card } from '@shared/ui'
import { StatusBadge } from '@shared/components'
import { cn } from '@shared/utils/cn'

interface TeamMemberCardProps {
  name: string
  email: string
  role: string
  status: string
  assignedProperties: number
  avatar?: string
  onClick?: () => void
  className?: string
}

export function TeamMemberCard({ name, email, role, status, assignedProperties, avatar, onClick, className }: TeamMemberCardProps) {
  return (
    <Card hover padding="md" className={cn('', className)} onClick={onClick}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary-100 overflow-hidden flex items-center justify-center text-primary font-bold text-body-lg">
          {avatar ? <img src={avatar} alt={name} className="w-full h-full object-cover" /> : name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-body font-semibold text-text-primary truncate">{name}</h4>
            <StatusBadge status={status} />
          </div>
          <p className="text-label text-text-muted truncate">{email}</p>
          <div className="flex items-center gap-3 mt-1 text-label text-text-muted">
            <span className="capitalize">{role}</span>
            <span>•</span>
            <span>{assignedProperties} properties</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
