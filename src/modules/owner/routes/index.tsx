import type { RouteObject } from 'react-router-dom'
import { OwnerDashboard } from '../pages/OwnerDashboard'
import { OwnerProperties } from '../pages/OwnerProperties'
import { OwnerTenants } from '../pages/OwnerTenants'
import { OwnerAnalytics } from '../pages/OwnerAnalytics'

export const ownerRoutes: RouteObject[] = [
  { index: true, element: <OwnerDashboard /> },
  { path: 'dashboard', element: <OwnerDashboard /> },
  { path: 'properties', element: <OwnerProperties /> },
  { path: 'tenants', element: <OwnerTenants /> },
  { path: 'analytics', element: <OwnerAnalytics /> },
]
