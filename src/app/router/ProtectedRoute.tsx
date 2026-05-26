import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@shared/hooks/useAuth'
import type { UserRole } from '@shared/constants/roles'
import { ROUTES } from '@shared/constants/routes'
import { getRoleFromPath, getRoleHome } from '@shared/constants/roleHome'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

/**
 * Route guard: authentication + membership in roles[] + activeRole matches URL tree.
 */
export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, activeRole } = useAuth()
  const { pathname } = useLocation()

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />
  }

  const routeRole = getRoleFromPath(pathname)

  if (allowedRoles && routeRole && !allowedRoles.includes(routeRole)) {
    return <Navigate to={getRoleHome(activeRole ?? user.roles[0])} replace />
  }

  if (routeRole && !user.roles.includes(routeRole)) {
    return <Navigate to={getRoleHome(activeRole ?? user.roles[0])} replace />
  }

  if (routeRole && activeRole && routeRole !== activeRole) {
    return <Navigate to={getRoleHome(activeRole)} replace />
  }

  return <>{children}</>
}
