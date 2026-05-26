import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Input } from '@shared/ui'
import { useSendOtp } from '../hooks/useSendOtp'
import { useVerifyOtp } from '../hooks/useVerifyOtp'
import { ROUTES } from '@shared/constants/routes'
import { AUTH_MOCK_HINT } from '../services/auth.mock'

export function OtpLoginForm() {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSessionId, setOtpSessionId] = useState<string | null>(null)
  const [step, setStep] = useState<'phone' | 'otp'>('phone')

  const sendOtp = useSendOtp()
  const verifyOtp = useVerifyOtp()

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault()
    sendOtp.mutate(
      { phone },
      {
        onSuccess: (res) => {
          setOtpSessionId(res.data.otpSessionId)
          setStep('otp')
        },
      }
    )
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!otpSessionId) return
    verifyOtp.mutate({ phone, otp, otpSessionId })
  }

  const error = sendOtp.error ?? verifyOtp.error

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-heading-2 text-text-primary">Welcome Back</h2>
        <p className="text-body text-text-muted mt-1">Sign in with your mobile number</p>
      </div>

      {step === 'phone' ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <Input
            label="Mobile number"
            type="tel"
            placeholder="9000000001"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          {error && (
            <div className="text-label text-status-error bg-status-error-bg px-4 py-2 rounded-input">
              {(error as Error).message || 'Could not send OTP. Try again.'}
            </div>
          )}
          <Button type="submit" className="w-full" isLoading={sendOtp.isPending}>
            Send OTP
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <p className="text-body text-text-muted text-center">
            OTP sent to <span className="font-semibold text-text-primary">{phone}</span>
          </p>
          <Input
            label="Enter OTP"
            type="text"
            inputMode="numeric"
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
          />
          {error && (
            <div className="text-label text-status-error bg-status-error-bg px-4 py-2 rounded-input">
              {(error as Error).message || 'Invalid OTP. Please try again.'}
            </div>
          )}
          <Button type="submit" className="w-full" isLoading={verifyOtp.isPending}>
            Verify & Sign In
          </Button>
          <button
            type="button"
            className="w-full text-label text-primary font-medium hover:underline border-0 bg-transparent cursor-pointer"
            onClick={() => {
              setStep('phone')
              setOtp('')
            }}
          >
            Change phone number
          </button>
        </form>
      )}

      <p className="text-label text-text-muted text-center px-2">{AUTH_MOCK_HINT}</p>

      <p className="text-center text-body text-text-muted">
        New to Rentilo?{' '}
        <Link to={ROUTES.AUTH.REGISTER} className="text-primary font-semibold hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  )
}
