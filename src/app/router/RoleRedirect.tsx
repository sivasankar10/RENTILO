import { Navigate } from 'react-router-dom'
import { useAuth } from '@shared/hooks/useAuth'
import { ROUTES } from '@shared/constants/routes'

/**
 * Root `/` route handler.
 * Redirects authenticated users to their role-specific dashboard.
 * Redirects unauthenticated users to the login page.
 */
export function RoleRedirect() {
  const { isAuthenticated, role } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />
  }

  switch (role) {
    case 'tenant':
      return <Navigate to={ROUTES.TENANT.LISTINGS} replace />
    case 'owner':
      return <Navigate to={ROUTES.OWNER.DASHBOARD} replace />
    case 'broker':
      return <Navigate to={ROUTES.BROKER.DASHBOARD} replace />
    case 'enterprise':
      return <Navigate to={ROUTES.ENTERPRISE.DASHBOARD} replace />
    default:
      return <Navigate to={ROUTES.AUTH.LOGIN} replace />
  }
}
