import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, Input } from '@shared/ui'
import { useSendOtp } from '../hooks/useSendOtp'
import { useCompleteRegistration } from '../hooks/useCompleteRegistration'
import { ROLES, type UserRole } from '@shared/constants/roles'
import { ROUTES } from '@shared/constants/routes'
import { cn } from '@shared/utils/cn'
import { AUTH_MOCK_HINT } from '../services/auth.mock'

const roleOptions: { value: UserRole; label: string; description: string }[] = [
  { value: ROLES.TENANT, label: 'Tenant', description: 'Looking to rent' },
  { value: ROLES.OWNER, label: 'Owner', description: 'List properties' },
  { value: ROLES.BROKER, label: 'Broker', description: 'Manage for clients' },
  { value: ROLES.ENTERPRISE, label: 'Enterprise', description: 'Portfolio management' },
]

type RegisterLocationState = {
  phone?: string
  otpSessionId?: string
}

export function OtpRegisterForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state as RegisterLocationState) ?? {}

  const [phone, setPhone] = useState(state.phone ?? '')
  const [otpSessionId, setOtpSessionId] = useState(state.otpSessionId ?? '')
  const [step, setStep] = useState<'phone' | 'profile'>(state.phone && state.otpSessionId ? 'profile' : 'phone')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<UserRole>(ROLES.TENANT)

  const sendOtp = useSendOtp()
  const completeRegistration = useCompleteRegistration()

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault()
    sendOtp.mutate(
      { phone },
      {
        onSuccess: (res) => {
          setOtpSessionId(res.data.otpSessionId)
          setStep('profile')
        },
      }
    )
  }

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault()
    if (!otpSessionId) return
    completeRegistration.mutate({
      phone,
      otpSessionId,
      firstName,
      lastName,
      role,
      email: email || undefined,
    })
  }

  const error = sendOtp.error ?? completeRegistration.error

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-heading-2 text-text-primary">Create Account</h2>
        <p className="text-body text-text-muted mt-1">
          {step === 'phone' ? 'Verify your mobile number' : 'Complete your profile'}
        </p>
      </div>

      {step === 'phone' ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <Input
            label="Mobile number"
            type="tel"
            placeholder="9876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          {error && (
            <div className="text-label text-status-error bg-status-error-bg px-4 py-2 rounded-input">
              {(error as Error).message || 'Could not send OTP.'}
            </div>
          )}
          <Button type="submit" className="w-full" isLoading={sendOtp.isPending}>
            Send OTP & Continue
          </Button>
        </form>
      ) : (
        <form onSubmit={handleComplete} className="space-y-4">
          <div className="space-y-2">
            <label className="text-label font-medium text-text-primary">I am a...</label>
            <div className="grid grid-cols-2 gap-2">
              {roleOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRole(option.value)}
                  className={cn(
                    'p-3 rounded-card border text-left transition-all duration-200',
                    role === option.value
                      ? 'border-primary bg-primary-100 text-primary'
                      : 'border-outline hover:bg-hover-light text-text-muted'
                  )}
                >
                  <span className="text-body font-semibold block">{option.label}</span>
                  <span className="text-label">{option.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Input
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <Input
            label="Email (optional)"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && (
            <div className="text-label text-status-error bg-status-error-bg px-4 py-2 rounded-input">
              Registration failed. Please try again.
            </div>
          )}

          <Button type="submit" className="w-full" isLoading={completeRegistration.isPending}>
            Create Account
          </Button>

          <button
            type="button"
            className="w-full text-label text-primary hover:underline border-0 bg-transparent cursor-pointer"
            onClick={() => setStep('phone')}
          >
            Change phone number
          </button>
        </form>
      )}

      <p className="text-label text-text-muted text-center px-2">{AUTH_MOCK_HINT}</p>

      <p className="text-center text-body text-text-muted">
        Already have an account?{' '}
        <Link
          to={ROUTES.AUTH.LOGIN}
          className="text-primary font-semibold hover:underline"
          onClick={() => navigate(ROUTES.AUTH.LOGIN)}
        >
          Sign In
        </Link>
      </p>
    </div>
  )
}
