import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Input } from '@shared/ui'
import { ROUTES } from '@shared/constants/routes'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Connect to authApi.forgotPassword
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-status-success-bg rounded-full flex items-center justify-center">
          <span className="text-status-success text-heading-2">✓</span>
        </div>
        <h2 className="text-heading-2 text-text-primary">Check Your Email</h2>
        <p className="text-body text-text-muted">
          We sent a password reset link to <strong>{email}</strong>
        </p>
        <Link
          to={ROUTES.AUTH.LOGIN}
          className="text-primary font-semibold hover:underline text-body inline-block"
        >
          Back to Sign In
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-heading-2 text-text-primary">Reset Password</h2>
        <p className="text-body text-text-muted mt-1">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Button type="submit" className="w-full">
        Send Reset Link
      </Button>

      <p className="text-center text-body text-text-muted">
        Remember your password?{' '}
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
