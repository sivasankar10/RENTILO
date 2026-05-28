import { create } from 'zustand'
import { AlertTriangle, X } from 'lucide-react'
import { cn } from '@shared/utils/cn'

type ConfirmVariant = 'default' | 'danger'

interface ConfirmOptions {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: ConfirmVariant
  onConfirm: () => void
}

interface ConfirmStore {
  open: boolean
  options: ConfirmOptions | null
  show: (options: ConfirmOptions) => void
  close: () => void
}

const useConfirmStore = create<ConfirmStore>((set) => ({
  open: false,
  options: null,
  show: (options) => set({ open: true, options }),
  close: () => set({ open: false, options: null }),
}))

export function confirm(options: ConfirmOptions) {
  useConfirmStore.getState().show(options)
}

export function ConfirmDialog() {
  const { open, options, close } = useConfirmStore()

  if (!open || !options) return null

  const variant = options.variant ?? 'default'

  const handleConfirm = () => {
    options.onConfirm()
    close()
  }

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-navy/50 backdrop-blur-sm"
        onClick={close}
        aria-hidden
      />
      <div className="relative w-full max-w-md rounded-modal bg-white p-6 shadow-modal">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-full',
              variant === 'danger' ? 'bg-status-error-bg' : 'bg-primary-100',
            )}
          >
            <AlertTriangle
              size={22}
              className={variant === 'danger' ? 'text-status-error' : 'text-primary'}
            />
          </div>
          <div className="flex-1">
            <h3 className="text-heading-3 font-bold text-text-primary">{options.title}</h3>
            {options.description && (
              <p className="mt-1 text-body text-text-muted">{options.description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={close}
            className="p-1 rounded-button text-text-muted hover:bg-hover-light transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={close}
            className="rounded-button border border-outline px-4 py-2.5 text-body font-medium text-text-primary hover:bg-hover-light transition-colors"
          >
            {options.cancelLabel ?? 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={cn(
              'rounded-button px-4 py-2.5 text-body font-semibold text-white shadow-sm transition-colors',
              variant === 'danger'
                ? 'bg-status-error hover:bg-red-600'
                : 'bg-navy hover:bg-slate-800',
            )}
          >
            {options.confirmLabel ?? 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}
