import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Input } from '@shared/ui'
import { useRegister } from '../hooks/useRegister'
import { ROLES, type UserRole } from '@shared/constants/roles'
import { ROUTES } from '@shared/constants/routes'
import { cn } from '@shared/utils/cn'

const roleOptions: { value: UserRole; label: string; description: string }[] = [
  { value: ROLES.TENANT, label: 'Tenant', description: 'Looking to rent a property' },
  { value: ROLES.OWNER, label: 'Owner', description: 'Own properties to rent out' },
  { value: ROLES.BROKER, label: 'Broker', description: 'Manage listings for clients' },
  { value: ROLES.ENTERPRISE, label: 'Enterprise', description: 'Manage a portfolio of properties' },
]

export function RegisterForm() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>(ROLES.TENANT)
  const { mutate, isPending, error } = useRegister()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate({ firstName, lastName, email, password, role })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-heading-2 text-text-primary">Create Account</h2>
        <p className="text-body text-text-muted mt-1">
          Join the Rentilo marketplace
        </p>
      </div>

      {/* Role Selection */}
      <div className="space-y-2">
        <label className="text-label font-medium text-text-primary">
          I am a...
        </label>
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
          placeholder="John"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <Input
          label="Last Name"
          placeholder="Doe"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>

      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && (
        <div className="text-label text-status-error bg-status-error-bg px-4 py-2 rounded-input">
          Registration failed. Please try again.
        </div>
      )}

      <Button type="submit" className="w-full" isLoading={isPending}>
        Create Account
      </Button>

      <p className="text-center text-body text-text-muted">
        Already have an account?{' '}
        <Link
          to={ROUTES.AUTH.LOGIN}
          className="text-primary font-semibold hover:underline"
        >
          Sign In
        </Link>
      </p>
    </form>
  )
}
