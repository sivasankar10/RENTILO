import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card } from '@shared/ui'
import { cn } from '@shared/utils/cn'

interface AnalyticsCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  trend?: {
    value: number
    label?: string
  }
  className?: string
}

export function AnalyticsCard({
  label,
  value,
  icon,
  trend,
  className,
}: AnalyticsCardProps) {
  const trendColor =
    trend && trend.value > 0
      ? 'text-status-success'
      : trend && trend.value < 0
        ? 'text-status-error'
        : 'text-text-muted'

  const TrendIcon =
    trend && trend.value > 0
      ? TrendingUp
      : trend && trend.value < 0
        ? TrendingDown
        : Minus

  return (
    <Card className={cn('flex items-start justify-between', className)}>
      <div>
        <p className="text-label text-text-muted uppercase tracking-wider mb-2">
          {label}
        </p>
        <p className="text-heading-1 text-text-primary font-bold">{value}</p>
        {trend && (
          <div className={cn('flex items-center gap-1 mt-2', trendColor)}>
            <TrendIcon size={14} />
            <span className="text-label font-semibold">
              {trend.value > 0 ? '+' : ''}
              {trend.value}%
            </span>
            {trend.label && (
              <span className="text-label text-text-muted ml-1">
                {trend.label}
              </span>
            )}
          </div>
        )}
      </div>
      {icon && (
        <div className="p-3 rounded-card bg-primary-100 text-primary">
          {icon}
        </div>
      )}
    </Card>
  )
}
