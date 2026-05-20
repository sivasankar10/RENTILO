import type { RouteObject } from 'react-router-dom'
import { EnterpriseDashboard } from '../pages/EnterpriseDashboard'
import { EnterprisePortfolio } from '../pages/EnterprisePortfolio'
import { EnterpriseTeams } from '../pages/EnterpriseTeams'
import { EnterpriseReports } from '../pages/EnterpriseReports'

export const enterpriseRoutes: RouteObject[] = [
  { index: true, element: <EnterpriseDashboard /> },
  { path: 'dashboard', element: <EnterpriseDashboard /> },
  { path: 'portfolio', element: <EnterprisePortfolio /> },
  { path: 'teams', element: <EnterpriseTeams /> },
  { path: 'reports', element: <EnterpriseReports /> },
]
