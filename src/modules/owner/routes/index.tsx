import type { RouteObject } from 'react-router-dom'
import { OwnerDashboard } from '../pages/OwnerDashboard'
import { OwnerPortfolio } from '../pages/OwnerPortfolio'
import { OwnerProperties } from '../pages/OwnerProperties'
import { OwnerTenants } from '../pages/OwnerTenants'
import { OwnerAnalytics } from '../pages/OwnerAnalytics'
import { OwnerPlansRules } from '../pages/OwnerPlansRules'
import { OwnerSettings } from '../pages/OwnerSettings'
import { OwnerNotifications } from '../pages/OwnerNotifications'
import { OwnerMessages } from '../pages/OwnerMessages'

export const ownerRoutes: RouteObject[] = [
  { index: true, element: <OwnerDashboard /> },
  { path: 'dashboard', element: <OwnerDashboard /> },
  { path: 'portfolio', element: <OwnerPortfolio /> },
  { path: 'properties', element: <OwnerProperties /> },
  { path: 'tenants', element: <OwnerTenants /> },
  { path: 'analytics', element: <OwnerAnalytics /> },
  { path: 'plans-rules', element: <OwnerPlansRules /> },
  { path: 'settings', element: <OwnerSettings /> },
  { path: 'notifications', element: <OwnerNotifications /> },
  { path: 'messages', element: <OwnerMessages /> },
]
