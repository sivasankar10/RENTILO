import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@shared/utils/cn'

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 'aadhaar' | 'otp'

interface KycVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  onVerified: (aadhaarRaw: string) => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Format raw digits as  XXXX XXXX XXXX */
function formatAadhaar(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 12)
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
}

/** Extract last 4 digits for the masked display */
function lastFour(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  return digits.slice(-4) || '****'
}

// ─── OTP Input ────────────────────────────────────────────────────────────────

function OtpInput({
  value,
  onChange,
}: {
  value: string[]
  onChange: (v: string[]) => void
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([])

  function handleKey(
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) {
    if (e.key === 'Backspace') {
      if (value[index]) {
        const next = [...value]
        next[index] = ''
        onChange(next)
      } else if (index > 0) {
        refs.current[index - 1]?.focus()
      }
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    const char = e.target.value.replace(/\D/g, '').slice(-1)
    const next = [...value]
    next[index] = char
    onChange(next)
    if (char && index < 5) {
      refs.current[index + 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const next = Array(6).fill('')
    pasted.split('').forEach((ch, i) => { next[i] = ch })
    onChange(next)
    const focusIdx = Math.min(pasted.length, 5)
    refs.current[focusIdx]?.focus()
  }

  return (
    <div className="flex gap-3 justify-center">
      {value.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKey(e, i)}
          onPaste={handlePaste}
          aria-label={`OTP digit ${i + 1}`}
          className={cn(
            'w-12 h-12 text-center text-[18px] font-bold rounded-xl border-2 outline-none',
            'font-display text-[#0F172A] bg-[#f8fafc]',
            'transition-all duration-150',
            digit
              ? 'border-[#0F172A] bg-white shadow-sm'
              : 'border-[#e2e8f0] text-[#94a3b8]',
            'focus:border-[#0F172A] focus:bg-white focus:shadow-sm'
          )}
        />
      ))}
    </div>
  )
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export function KycVerificationModal({
  isOpen,
  onClose,
  onVerified,
}: KycVerificationModalProps) {
  const [step, setStep] = useState<Step>('aadhaar')
  const [aadhaarRaw, setAadhaarRaw] = useState('')
  const [consent, setConsent] = useState(false)
  const [aadhaarError, setAadhaarError] = useState('')
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
  const [otpError, setOtpError] = useState('')
  const [resendSeconds, setResendSeconds] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const aadhaarInputRef = useRef<HTMLInputElement>(null)

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Auto-focus aadhaar input on open
      setTimeout(() => aadhaarInputRef.current?.focus(), 50)
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Escape key to close
  const handleEscape = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() },
    [onClose]
  )
  useEffect(() => {
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [handleEscape])

  // Resend countdown
  useEffect(() => {
    if (step !== 'otp') return
    setResendSeconds(30)
    setCanResend(false)
    const interval = setInterval(() => {
      setResendSeconds((s) => {
        if (s <= 1) {
          clearInterval(interval)
          setCanResend(true)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [step])

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('aadhaar')
        setAadhaarRaw('')
        setConsent(false)
        setAadhaarError('')
        setOtp(Array(6).fill(''))
        setOtpError('')
        setVerifying(false)
      }, 300)
    }
  }, [isOpen])

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleAadhaarInput(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 12)
    setAadhaarRaw(raw)
    if (aadhaarError) setAadhaarError('')
  }

  function handleSendOtp() {
    const digits = aadhaarRaw.replace(/\D/g, '')
    if (digits.length !== 12) {
      setAadhaarError('Please enter a valid 12-digit Aadhaar number.')
      return
    }
    if (!consent) {
      setAadhaarError('Please provide consent to proceed.')
      return
    }
    setAadhaarError('')
    setStep('otp')
  }

  async function handleVerify() {
    const code = otp.join('')
    if (code.length < 6) {
      setOtpError('Please enter the complete 6-digit OTP.')
      return
    }
    setOtpError('')
    setVerifying(true)
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200))
    setVerifying(false)
    onVerified(aadhaarRaw)
    onClose()
  }

  function handleResend() {
    if (!canResend) return
    setOtp(Array(6).fill(''))
    setOtpError('')
    setResendSeconds(30)
    setCanResend(false)
    const interval = setInterval(() => {
      setResendSeconds((s) => {
        if (s <= 1) { clearInterval(interval); setCanResend(true); return 0 }
        return s - 1
      })
    }, 1000)
  }

  if (!isOpen) return null

  const aadhaarFormatted = formatAadhaar(aadhaarRaw)
  const otpFilled = otp.every((d) => d !== '')

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Blurred backdrop */}
      <div
        className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="kyc-modal-title"
        className={cn(
          'relative w-full max-w-[400px] bg-white rounded-2xl shadow-[0_24px_48px_-8px_rgba(0,0,0,0.18)]',
          'overflow-hidden',
          'animate-in fade-in zoom-in-95 duration-200'
        )}
      >
        {/* Progress bar */}
        <div className="h-1 bg-[#e2e8f0] w-full">
          <div
            className="h-full bg-[#0F172A] transition-all duration-500 ease-out"
            style={{ width: step === 'aadhaar' ? '50%' : '100%' }}
          />
        </div>

        {/* ── Step 1: Aadhaar ─────────────────────────────────────────────── */}
        {step === 'aadhaar' && (
          <div className="px-8 pt-8 pb-0">
            {/* Icon */}
            <div className="flex justify-center mb-5">
              <div className="w-12 h-12 rounded-xl bg-[#f1f5f9] flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-[24px] text-[#0F172A]"
                  aria-hidden="true"
                >
                  lock
                </span>
              </div>
            </div>

            {/* Heading */}
            <h2
              id="kyc-modal-title"
              className="text-center font-display text-[22px] font-extrabold text-[#0F172A] mb-2"
            >
              Verify Your Identity
            </h2>
            <p className="text-center text-[13px] text-[#64748b] leading-relaxed mb-7 px-2">
              Complete Aadhaar verification to proceed securely
              with your property transactions.
            </p>

            {/* Aadhaar input */}
            <div className="mb-4">
              <label
                htmlFor="aadhaar-input"
                className="block text-[11px] font-bold tracking-widest text-[#64748b] mb-2 uppercase"
              >
                Aadhaar Number
              </label>
              <input
                id="aadhaar-input"
                ref={aadhaarInputRef}
                type="text"
                inputMode="numeric"
                value={aadhaarFormatted}
                onChange={handleAadhaarInput}
                placeholder="XXXX  XXXX  XXXX"
                maxLength={14} // 12 digits + 2 spaces
                autoComplete="off"
                className={cn(
                  'w-full px-4 py-3.5 rounded-xl border-2 outline-none',
                  'font-display text-[16px] font-semibold tracking-[0.18em] text-[#0F172A]',
                  'bg-[#f8fafc] placeholder:text-[#cbd5e1] placeholder:font-normal placeholder:tracking-[0.18em]',
                  'transition-all duration-150',
                  aadhaarError
                    ? 'border-red-400 bg-red-50'
                    : 'border-[#e2e8f0] focus:border-[#0F172A] focus:bg-white focus:shadow-sm'
                )}
              />
              {aadhaarError && (
                <p className="mt-1.5 text-[12px] text-red-500 font-medium">{aadhaarError}</p>
              )}
            </div>

            {/* Consent checkbox */}
            <label className="flex items-start gap-3 cursor-pointer mb-6 group">
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => {
                    setConsent(e.target.checked)
                    if (aadhaarError) setAadhaarError('')
                  }}
                  className="sr-only"
                />
                <div
                  className={cn(
                    'w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-150',
                    consent
                      ? 'bg-[#0F172A] border-[#0F172A]'
                      : 'bg-white border-[#cbd5e1] group-hover:border-[#94a3b8]'
                  )}
                >
                  {consent && (
                    <span
                      className="material-symbols-outlined text-white"
                      style={{ fontSize: '11px', fontVariationSettings: "'wght' 700" }}
                      aria-hidden="true"
                    >
                      check
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[13px] text-[#475569] leading-snug">
                I consent to Aadhaar-based verification as per government guidelines.
              </span>
            </label>

            {/* Send OTP button */}
            <button
              type="button"
              onClick={handleSendOtp}
              className={cn(
                'w-full py-4 rounded-xl font-display text-[15px] font-bold text-white',
                'bg-[#0F172A] hover:bg-[#1e293b] active:bg-[#0F172A]',
                'transition-colors duration-150 border-0 cursor-pointer',
                'flex items-center justify-center gap-2'
              )}
            >
              Send OTP
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                arrow_forward
              </span>
            </button>

            {/* Security footer */}
            <div className="mt-5 py-4 border-t border-[#f1f5f9] text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span
                  className="material-symbols-outlined text-[14px] text-[#94a3b8]"
                  aria-hidden="true"
                >
                  shield
                </span>
                <span className="text-[10px] font-bold tracking-widest text-[#94a3b8] uppercase">
                  End-to-End Encrypted
                </span>
              </div>
              <p className="text-[11px] text-[#94a3b8] leading-relaxed px-4">
                Your data is strictly used for identity verification and is protected by
                industry-standard encryption protocols.
              </p>
            </div>
          </div>
        )}

        {/* ── Step 2: OTP ─────────────────────────────────────────────────── */}
        {step === 'otp' && (
          <div className="px-8 pt-8 pb-0">
            {/* Icon */}
            <div className="flex justify-center mb-5">
              <div className="w-12 h-12 rounded-xl bg-[#eff6ff] flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-[24px] text-[#0F172A]"
                  aria-hidden="true"
                >
                  verified_user
                </span>
              </div>
            </div>

            {/* Heading */}
            <h2
              id="kyc-modal-title"
              className="text-center font-display text-[22px] font-extrabold text-[#0F172A] mb-2"
            >
              Verify OTP
            </h2>
            <p className="text-center text-[13px] text-[#64748b] leading-relaxed mb-7 px-2">
              Enter the 6-digit code sent to your Aadhaar-linked
              mobile number ending in{' '}
              <span className="font-semibold text-[#0F172A]">
                •••• {lastFour(aadhaarRaw)}
              </span>
              .
            </p>

            {/* OTP boxes */}
            <div className="mb-4">
              <OtpInput value={otp} onChange={setOtp} />
              {otpError && (
                <p className="mt-2 text-center text-[12px] text-red-500 font-medium">
                  {otpError}
                </p>
              )}
            </div>

            {/* Resend */}
            <div className="text-center mb-6">
              {!canResend ? (
                <p className="text-[11px] font-bold tracking-widest text-[#94a3b8] uppercase">
                  Resend OTP in {resendSeconds}s
                </p>
              ) : (
                <p className="text-[11px] font-bold tracking-widest text-[#94a3b8] uppercase mb-0.5">
                  Resend OTP in 0s
                </p>
              )}
              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend}
                className={cn(
                  'text-[13px] font-semibold border-0 bg-transparent cursor-pointer transition-colors',
                  canResend
                    ? 'text-[#0F172A] hover:text-[#2563eb]'
                    : 'text-[#cbd5e1] cursor-not-allowed'
                )}
              >
                Resend Code
              </button>
            </div>

            {/* Verify button */}
            <button
              type="button"
              onClick={handleVerify}
              disabled={verifying || !otpFilled}
              className={cn(
                'w-full py-4 rounded-xl font-display text-[15px] font-bold text-white',
                'transition-all duration-150 border-0',
                verifying || !otpFilled
                  ? 'bg-[#94a3b8] cursor-not-allowed'
                  : 'bg-[#0F172A] hover:bg-[#1e293b] cursor-pointer'
              )}
            >
              {verifying ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Verifying…
                </span>
              ) : (
                'Verify & Continue'
              )}
            </button>

            {/* Change Aadhaar link */}
            <div className="text-center mt-3 mb-5">
              <button
                type="button"
                onClick={() => {
                  setStep('aadhaar')
                  setOtp(Array(6).fill(''))
                  setOtpError('')
                }}
                className="text-[13px] font-semibold text-[#0F172A] hover:text-[#2563eb] border-0 bg-transparent cursor-pointer transition-colors"
              >
                Change Aadhaar Number
              </button>
            </div>

            {/* Security footer */}
            <div className="py-4 border-t border-[#f1f5f9] text-center">
              <div className="flex items-center justify-center gap-1.5">
                <span
                  className="material-symbols-outlined text-[14px] text-[#94a3b8]"
                  aria-hidden="true"
                >
                  lock
                </span>
                <span className="text-[10px] font-bold tracking-widest text-[#94a3b8] uppercase">
                  Secure Bank-Level Encryption
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
