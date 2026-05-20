import { Outlet } from 'react-router-dom'

/**
 * Minimal centered layout for authentication pages.
 * No sidebar or navbar — just a centered card on a canvas background.
 */
export function AuthLayout() {
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="text-heading-1 text-primary font-bold tracking-tight">
            Rentilo
          </h1>
          <p className="text-body text-text-muted mt-2">
            Modern Rental Marketplace
          </p>
        </div>

        {/* Auth Form Container */}
        <div className="bg-surface rounded-modal shadow-modal border border-outline p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
