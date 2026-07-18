import type { RouteObject } from 'react-router-dom'
import { EnterpriseDashboard } from '../pages/EnterpriseDashboard'
import { EnterprisePortfolio } from '../pages/EnterprisePortfolio'
import { EnterpriseRegisterProperty } from '../pages/EnterpriseRegisterProperty'
import { EnterpriseAddUnit } from '../pages/EnterpriseAddUnit'
import { EnterprisePropertyDetail } from '../pages/EnterprisePropertyDetail'
import { EnterpriseBrokers } from '../pages/EnterpriseBrokers'
import { EnterpriseTenants } from '../pages/EnterpriseTenants'
import { EnterpriseFinance } from '../pages/EnterpriseFinance'
import { EnterpriseMessages } from '../pages/EnterpriseMessages'
import { EnterpriseNotifications } from '../pages/EnterpriseNotifications'
import { EnterpriseTeams } from '../pages/EnterpriseTeams'
import { EnterpriseReports } from '../pages/EnterpriseReports'

export const enterpriseRoutes: RouteObject[] = [
  { index: true, element: <EnterpriseDashboard /> },
  { path: 'dashboard', element: <EnterpriseDashboard /> },
  { path: 'portfolio', element: <EnterprisePortfolio /> },
  { path: 'portfolio/register', element: <EnterpriseRegisterProperty /> },
  { path: 'portfolio/add-unit', element: <EnterpriseAddUnit /> },
  { path: 'portfolio/:propertyId', element: <EnterprisePropertyDetail /> },
  { path: 'brokers', element: <EnterpriseBrokers /> },
  { path: 'tenants', element: <EnterpriseTenants /> },
  { path: 'finance', element: <EnterpriseFinance /> },
  { path: 'messages', element: <EnterpriseMessages /> },
  { path: 'notifications', element: <EnterpriseNotifications /> },
  { path: 'teams', element: <EnterpriseTeams /> },
  { path: 'reports', element: <EnterpriseReports /> },
]
