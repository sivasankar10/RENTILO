import { useEffect, useRef, useState } from 'react'
import { MoreVertical } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@shared/utils/cn'

export interface ActionMenuItem {
  label: string
  icon?: LucideIcon
  onClick: () => void
  variant?: 'default' | 'danger'
  disabled?: boolean
}

interface ActionMenuProps {
  items: ActionMenuItem[]
  ariaLabel?: string
}

export function ActionMenu({ items, ariaLabel = 'Open actions menu' }: ActionMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        className="p-1.5 rounded-button text-text-muted hover:bg-hover-light hover:text-text-primary transition-colors"
        aria-label={ariaLabel}
        aria-expanded={open}
      >
        <MoreVertical size={16} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-30 mt-1 min-w-[180px] rounded-card border border-outline bg-white py-1 shadow-modal"
          role="menu"
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((item, idx) => {
            const Icon = item.icon
            return (
              <button
                key={`${item.label}-${idx}`}
                type="button"
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick()
                    setOpen(false)
                  }
                }}
                disabled={item.disabled}
                className={cn(
                  'flex w-full items-center gap-2 px-3 py-2 text-left text-body transition-colors',
                  item.disabled && 'cursor-not-allowed opacity-50',
                  !item.disabled &&
                    (item.variant === 'danger'
                      ? 'text-status-error hover:bg-status-error-bg'
                      : 'text-text-primary hover:bg-hover-light'),
                )}
                role="menuitem"
              >
                {Icon && <Icon size={14} className="shrink-0" />}
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
