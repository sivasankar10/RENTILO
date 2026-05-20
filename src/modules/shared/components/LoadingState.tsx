import { cn } from '@shared/utils/cn'

interface LoadingStateProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'h-6 w-6 border-2',
  md: 'h-10 w-10 border-3',
  lg: 'h-16 w-16 border-4',
}

export function LoadingState({
  message = 'Loading...',
  size = 'md',
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 gap-4',
        className
      )}
    >
      <div
        className={cn(
          'rounded-full border-outline border-t-primary animate-spin',
          sizeMap[size]
        )}
      />
      <span className="text-body text-text-muted">{message}</span>
    </div>
  )
}
