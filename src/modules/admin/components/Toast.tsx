import { useEffect } from 'react'
import { create } from 'zustand'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@shared/utils/cn'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  type: ToastType
  message: string
  description?: string
}

interface ToastStore {
  toasts: Toast[]
  showToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  showToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }))
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    }, 3500)
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))

/** Convenience helpers */
export const toast = {
  success: (message: string, description?: string) =>
    useToastStore.getState().showToast({ type: 'success', message, description }),
  error: (message: string, description?: string) =>
    useToastStore.getState().showToast({ type: 'error', message, description }),
  info: (message: string, description?: string) =>
    useToastStore.getState().showToast({ type: 'info', message, description }),
}

const iconMap = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

const colorMap = {
  success: 'border-status-success bg-white text-status-success',
  error: 'border-status-error bg-white text-status-error',
  info: 'border-primary bg-white text-primary',
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)
  const removeToast = useToastStore((s) => s.removeToast)

  return (
    <div className="fixed top-20 right-4 z-[200] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => {
        const Icon = iconMap[t.type]
        return (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 rounded-card border-l-4 bg-white px-4 py-3 shadow-modal min-w-[320px] max-w-md',
              'animate-in slide-in-from-right',
              colorMap[t.type],
            )}
          >
            <Icon size={20} className="mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-body font-semibold text-text-primary">{t.message}</p>
              {t.description && (
                <p className="mt-0.5 text-label text-text-muted">{t.description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeToast(t.id)}
              className="p-1 rounded-button text-text-muted hover:bg-hover-light transition-colors"
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

/** Hook to auto-mount the toast container into a layout */
export function useToastListener() {
  useEffect(() => {
    // No-op; subscribe placeholder if we want global hooks later
  }, [])
}
