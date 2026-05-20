import { Navigate } from 'react-router-dom'
import { useAuth } from '@shared/hooks/useAuth'
import type { UserRole } from '@shared/constants/roles'
import { ROUTES } from '@shared/constants/routes'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

/**
 * Route guard component.
 * - Checks authentication state
 * - Validates user role against allowed roles
 * - Redirects to /auth/login if unauthorized
 */
export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, role } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Redirect to their own dashboard if role doesn't match
    return <Navigate to={`/${role}/dashboard`} replace />
  }

  return <>{children}</>
}
