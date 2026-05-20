import React from 'react'
import { cn } from '@shared/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-label font-medium text-text-primary"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-3 rounded-input',
            'bg-surface text-text-primary text-body',
            'border border-outline',
            'placeholder:text-text-muted',
            'transition-all duration-200 ease-in-out',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-status-error focus:ring-status-error',
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-label text-status-error">{error}</span>
        )}
        {hint && !error && (
          <span className="text-label text-text-muted">{hint}</span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
