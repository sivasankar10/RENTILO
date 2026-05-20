import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Input } from '@shared/ui'
import { useLogin } from '../hooks/useLogin'
import { ROUTES } from '@shared/constants/routes'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { mutate, isPending, error } = useLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate({ email, password })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-heading-2 text-text-primary">Welcome Back</h2>
        <p className="text-body text-text-muted mt-1">
          Sign in to your account
        </p>
      </div>

      <Input
        label="Username"
        type="text"
        placeholder="tenant, owner, broker, enterprise"
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
          Invalid email or password. Please try again.
        </div>
      )}

      <Button type="submit" className="w-full" isLoading={isPending}>
        Sign In
      </Button>

      <div className="text-center space-y-2">
        <Link
          to={ROUTES.AUTH.FORGOT_PASSWORD}
          className="text-label text-primary hover:underline"
        >
          Forgot password?
        </Link>
        <p className="text-body text-text-muted">
          Don't have an account?{' '}
          <Link
            to={ROUTES.AUTH.REGISTER}
            className="text-primary font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </form>
  )
}
