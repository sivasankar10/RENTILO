import { useEffect, useState } from 'react'
import { cn } from '@shared/utils/cn'

export type ToastVariant = 'success' | 'info' | 'warning' | 'error'

interface ToastProps {
  message: string
  description?: string
  variant?: ToastVariant
  duration?: number
  onClose: () => void
}

const variantConfig: Record<
  ToastVariant,
  { icon: string; bar: string; iconColor: string }
> = {
  success: {
    icon: 'check_circle',
    bar: 'bg-green-500',
    iconColor: 'text-green-500',
  },
  info: {
    icon: 'info',
    bar: 'bg-blue-500',
    iconColor: 'text-blue-500',
  },
  warning: {
    icon: 'warning',
    bar: 'bg-amber-500',
    iconColor: 'text-amber-500',
  },
  error: {
    icon: 'error',
    bar: 'bg-red-500',
    iconColor: 'text-red-500',
  },
}

export function Toast({
  message,
  description,
  variant = 'success',
  duration = 4000,
  onClose,
}: ToastProps) {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const config = variantConfig[variant]

  // Slide in on mount
  useEffect(() => {
    const enterTimer = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(enterTimer)
  }, [])

  // Auto-dismiss
  useEffect(() => {
    const dismissTimer = setTimeout(() => {
      setLeaving(true)
      setTimeout(onClose, 300)
    }, duration)
    return () => clearTimeout(dismissTimer)
  }, [duration, onClose])

  function handleClose() {
    setLeaving(true)
    setTimeout(onClose, 300)
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'relative flex items-start gap-3.5 w-[360px] max-w-[calc(100vw-32px)]',
        'bg-white rounded-xl shadow-[0_8px_24px_-4px_rgba(0,0,0,0.12),0_4px_8px_-2px_rgba(0,0,0,0.08)]',
        'border border-[#e2e8f0] overflow-hidden',
        'transition-all duration-300 ease-out',
        visible && !leaving
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-3'
      )}
    >
      {/* Left accent bar */}
      <div className={cn('absolute left-0 top-0 bottom-0 w-1 rounded-l-xl', config.bar)} />

      <div className="flex items-start gap-3 pl-5 pr-4 py-4 w-full">
        {/* Icon */}
        <span
          className={cn('material-symbols-outlined select-none mt-0.5 text-[22px]', config.iconColor)}
          aria-hidden="true"
        >
          {config.icon}
        </span>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-[#0F172A] leading-snug">{message}</p>
          {description && (
            <p className="text-[13px] text-[#64748b] mt-0.5 leading-snug">{description}</p>
          )}
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Dismiss notification"
          className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-md text-[#94a3b8] hover:text-[#0F172A] hover:bg-[#f1f5f9] transition-colors border-0 bg-transparent cursor-pointer mt-0.5"
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
            close
          </span>
        </button>
      </div>
    </div>
  )
}

/** Portal-style container — place once at the top of a page or in a layout */
export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <div
      aria-label="Notifications"
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 items-end pointer-events-none"
    >
      <div className="pointer-events-auto flex flex-col gap-3 items-end">{children}</div>
    </div>
  )
}
