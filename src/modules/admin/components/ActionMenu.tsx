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
  const [openUp, setOpenUp] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

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

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setOpen((prev) => {
      const next = !prev
      // Decide direction when opening: flip up if there isn't room below.
      if (next && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect()
        const estimatedHeight = items.length * 40 + 8
        const spaceBelow = window.innerHeight - rect.bottom
        setOpenUp(spaceBelow < estimatedHeight && rect.top > estimatedHeight)
      }
      return next
    })
  }

  return (
    <div ref={ref} className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        className="p-1.5 rounded-button text-text-muted hover:bg-hover-light hover:text-text-primary transition-colors"
        aria-label={ariaLabel}
        aria-expanded={open}
      >
        <MoreVertical size={16} />
      </button>

      {open && (
        <div
          className={cn(
            'absolute right-0 z-30 min-w-[180px] rounded-card border border-outline bg-white py-1 shadow-modal',
            openUp ? 'bottom-full mb-1' : 'top-full mt-1',
          )}
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
