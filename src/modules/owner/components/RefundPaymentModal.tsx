import { useState, useEffect, useCallback } from 'react'
import { cn } from '@shared/utils/cn'

interface RefundPaymentModalProps {
  propertyTitle: string
  tenantName: string
  depositDisplay: string
  damageDisplay: string
  refundAmount: number
  refundDisplay: string
  isOpen: boolean
  onClose: () => void
  onConfirm: (method: string, refId: string) => void
}

const PAYMENT_METHODS = ['UPI', 'Net Banking', 'Credit Card', 'Debit Card'] as const

function formatCardNumber(value: string) {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}
function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

export function RefundPaymentModal({
  propertyTitle,
  tenantName,
  depositDisplay,
  damageDisplay,
  refundAmount,
  refundDisplay,
  isOpen,
  onClose,
  onConfirm,
}: RefundPaymentModalProps) {
  const [method, setMethod] = useState<(typeof PAYMENT_METHODS)[number]>('UPI')
  const [refId, setRefId] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setMethod('UPI')
      setRefId('')
      setCardNumber('')
      setCardExpiry('')
      setCardCvv('')
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

  const isCard = method === 'Credit Card' || method === 'Debit Card'
  const nonCardField = method === 'UPI' ? 'UPI ID' : 'Account Reference'

  function validate(): string | null {
    if (isCard) {
      const digits = cardNumber.replace(/\s/g, '')
      if (digits.length < 12) return 'Enter a valid card number.'
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) return 'Enter a valid expiry (MM/YY).'
      const month = Number(cardExpiry.slice(0, 2))
      if (month < 1 || month > 12) return 'Enter a valid expiry month.'
      if (!/^\d{3,4}$/.test(cardCvv)) return 'Enter a valid CVV.'
      return null
    }
    if (!refId.trim()) return `${nonCardField} is required.`
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validationError = validate()
    if (validationError) { setError(validationError); return }
    setError('')
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1200))
    setSubmitting(false)
    const reference = isCard
      ? `${method} ending ${cardNumber.replace(/\s/g, '').slice(-4)}`
      : refId.trim()
    onConfirm(method, reference)
  }

  const fieldBase = 'w-full px-4 py-3 rounded-xl border-2 outline-none font-body text-[14px] text-[#0F172A] bg-[#f8fafc] transition-all duration-150 placeholder:text-[#cbd5e1]'
  const fieldState = error ? 'border-red-400 bg-red-50' : 'border-[#e2e8f0] focus:border-[#0F172A] focus:bg-white'

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-md" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-[460px] max-h-[92vh] overflow-y-auto bg-white rounded-2xl shadow-[0_24px_48px_-8px_rgba(0,0,0,0.18)] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-[#f1f5f9]">
          <div>
            <h2 className="font-display text-[20px] font-extrabold text-[#0F172A]">Refund Security Deposit</h2>
            <p className="text-[13px] text-[#64748b] mt-0.5 truncate max-w-[320px]">{propertyTitle}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#94a3b8] hover:text-[#0F172A] hover:bg-[#f1f5f9] border-0 bg-transparent cursor-pointer transition-colors">
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-7 py-6 flex flex-col gap-4">
          {/* Refund breakdown */}
          <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3.5 text-[13px]">
            <div className="flex items-center justify-between py-1">
              <span className="text-[#64748b]">Security deposit</span>
              <span className="font-semibold text-[#0F172A]">{depositDisplay}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-[#64748b]">Less: damages</span>
              <span className="font-semibold text-[#0F172A]">- {damageDisplay}</span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-[#e2e8f0] pt-2">
              <span className="font-bold text-[#0F172A]">Refund to tenant</span>
              <span className="font-display text-[18px] font-extrabold text-[#0F172A]">{refundDisplay}</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-1.5">Pay To</label>
            <input type="text" value={tenantName} readOnly
              className="w-full px-4 py-3 rounded-xl border-2 border-[#e2e8f0] outline-none font-body text-[14px] text-[#0F172A] bg-[#f1f5f9] cursor-not-allowed" />
          </div>

          <div>
            <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-1.5">Amount (₹)</label>
            <input type="text" value={refundAmount.toLocaleString('en-IN')} readOnly
              className="w-full px-4 py-3 rounded-xl border-2 border-[#e2e8f0] outline-none font-body text-[14px] text-[#0F172A] bg-[#f1f5f9] cursor-not-allowed" />
          </div>

          <div>
            <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-1.5">Refund Via</label>
            <select value={method} onChange={(e) => { setMethod(e.target.value as (typeof PAYMENT_METHODS)[number]); setError('') }}
              className="w-full px-4 py-3 rounded-xl border-2 border-[#e2e8f0] outline-none font-body text-[14px] text-[#0F172A] bg-[#f8fafc] focus:border-[#0F172A] cursor-pointer">
              {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {isCard ? (
            <>
              <div>
                <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-1.5">Card Number</label>
                <input type="text" inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456"
                  value={cardNumber} onChange={(e) => { setCardNumber(formatCardNumber(e.target.value)); setError('') }}
                  className={cn(fieldBase, fieldState)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-1.5">Expiry</label>
                  <input type="text" inputMode="numeric" autoComplete="cc-exp" placeholder="MM/YY"
                    value={cardExpiry} onChange={(e) => { setCardExpiry(formatExpiry(e.target.value)); setError('') }}
                    className={cn(fieldBase, fieldState)} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-1.5">CVV</label>
                  <input type="password" inputMode="numeric" autoComplete="cc-csc" placeholder="123" maxLength={4}
                    value={cardCvv} onChange={(e) => { setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4)); setError('') }}
                    className={cn(fieldBase, fieldState)} />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-1.5">{nonCardField}</label>
              <input type="text" placeholder={method === 'UPI' ? 'e.g. tenant@upi' : 'Enter dummy reference'} value={refId} onChange={(e) => { setRefId(e.target.value); setError('') }}
                className={cn(fieldBase, fieldState)} />
            </div>
          )}

          {error && <p className="text-[12px] text-red-500">{error}</p>}

          <button type="submit" disabled={submitting}
            className={cn('w-full py-3.5 rounded-xl font-display text-[15px] font-bold text-white border-0 transition-all duration-150 mt-1',
              submitting ? 'bg-[#94a3b8] cursor-not-allowed' : 'bg-[#0F172A] hover:bg-[#1e293b] cursor-pointer')}>
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Processing Refund…
              </span>
            ) : `Refund ${refundDisplay} & Release`}
          </button>
        </form>
      </div>
    </div>
  )
}
