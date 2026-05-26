import { Navigate } from 'react-router-dom'
import { useAuth } from '@shared/hooks/useAuth'
import { ROUTES } from '@shared/constants/routes'
import { getRoleHome } from '@shared/constants/roleHome'
import { LandingPage } from '@modules/marketing'

/**
 * Root `/` route handler.
 * Guests see the public landing page; authenticated users go to active role home.
 */
export function RoleRedirect() {
  const { isAuthenticated, activeRole, user } = useAuth()

  if (!isAuthenticated) {
    return <LandingPage />
  }

  const homeRole = activeRole ?? user?.roles[0]
  const home = homeRole ? getRoleHome(homeRole) : ROUTES.AUTH.LOGIN
  return <Navigate to={home} replace />
}
