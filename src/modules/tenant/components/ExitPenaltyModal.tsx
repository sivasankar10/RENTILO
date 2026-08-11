import { useState, useEffect, useCallback } from 'react'
import { cn } from '@shared/utils/cn'

interface ExitPenaltyModalProps {
  propertyTitle: string
  penaltyDisplay: string
  isOpen: boolean
  onClose: () => void
  onPay: (method: string, refId: string) => void
}

const PAYMENT_METHODS = ['UPI', 'Credit Card', 'Debit Card', 'Bank Transfer']

export function ExitPenaltyModal({ propertyTitle, penaltyDisplay, isOpen, onClose, onPay }: ExitPenaltyModalProps) {
  const [method, setMethod] = useState('UPI')
  const [reference, setReference] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setMethod('UPI')
      setReference('')
      setError('')
      setSubmitting(false)
    }
  }, [isOpen])

  const handleEscape = useCallback((e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }, [onClose])
  useEffect(() => {
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [handleEscape])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  async function handlePay() {
    if (!reference.trim()) { setError('Enter a payment reference to continue.'); return }
    setError('')
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 900))
    setSubmitting(false)
    onPay(method, reference.trim())
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-md" onClick={onClose} aria-hidden="true" />

      <div
        role="dialog" aria-modal="true" aria-label="Pay early-exit penalty"
        className="relative w-full max-w-[480px] bg-white rounded-2xl shadow-[0_24px_48px_-8px_rgba(0,0,0,0.18)] overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-[#f1f5f9] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eff6ff] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[20px] text-[#0F172A]" aria-hidden="true">payments</span>
            </div>
            <div>
              <h2 className="font-display text-[19px] font-extrabold text-[#0F172A] leading-tight">Pay Early-Exit Penalty</h2>
              <p className="text-[12px] text-[#64748b] mt-0.5 truncate max-w-[260px]">{propertyTitle}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#94a3b8] hover:text-[#0F172A] hover:bg-[#f1f5f9] border-0 bg-transparent cursor-pointer transition-colors flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">close</span>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-7 py-6 flex flex-col gap-5">
          <div className="flex items-center justify-between px-4 py-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
            <div>
              <p className="text-[11px] font-bold tracking-widest text-[#64748b] uppercase">Penalty set by owner</p>
              <p className="text-[12px] text-[#94a3b8] mt-0.5">To skip the notice period</p>
            </div>
            <p className="font-display text-[20px] font-extrabold text-[#0F172A]">{penaltyDisplay}</p>
          </div>

          <div>
            <p className="text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-3">Payment Method</p>
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_METHODS.map((item) => (
                <button key={item} type="button" onClick={() => setMethod(item)}
                  className={cn(
                    'py-2.5 rounded-xl text-[12px] font-semibold border-2 transition-all duration-150 cursor-pointer',
                    method === item ? 'border-[#0F172A] bg-[#0F172A] text-white' : 'border-[#e2e8f0] bg-[#f8fafc] text-[#475569] hover:border-[#94a3b8]',
                  )}>
                  {item}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="text-[11px] font-bold tracking-widest text-[#64748b] uppercase">Payment Reference</span>
            <input value={reference} onChange={(e) => { setReference(e.target.value); setError('') }}
              placeholder={method === 'UPI' ? 'name@upi' : 'Enter dummy account/card reference'}
              className="mt-2 h-12 w-full rounded-xl border border-[#e2e8f0] px-4 text-[14px] text-[#0F172A] outline-none focus:border-[#0F172A]" />
          </label>

          {error && <p className="text-[13px] text-red-500 font-medium">{error}</p>}
        </div>

        <div className="px-7 pb-7 pt-4 border-t border-[#f1f5f9] flex gap-3 flex-shrink-0">
          <button type="button" onClick={onClose}
            className="flex-1 py-3.5 rounded-xl font-display text-[15px] font-bold text-[#475569] border-2 border-[#e2e8f0] bg-white hover:bg-[#f8fafc] transition-colors cursor-pointer">
            Cancel
          </button>
          <button type="button" onClick={handlePay} disabled={submitting}
            className={cn(
              'flex-1 py-3.5 rounded-xl font-display text-[15px] font-bold text-white border-0 transition-all duration-150',
              submitting ? 'bg-[#94a3b8] cursor-not-allowed' : 'bg-[#0F172A] hover:bg-[#1e293b] cursor-pointer',
            )}>
            {submitting ? 'Processing…' : `Pay ${penaltyDisplay}`}
          </button>
        </div>
      </div>
    </div>
  )
}
