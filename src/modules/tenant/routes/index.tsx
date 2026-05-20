import type { RouteObject } from 'react-router-dom'
import { TenantDashboard } from '../pages/TenantDashboard'
import { TenantProperties } from '../pages/TenantProperties'
import { TenantPayments } from '../pages/TenantPayments'
import { TenantMaintenance } from '../pages/TenantMaintenance'

export const tenantRoutes: RouteObject[] = [
  { index: true, element: <TenantDashboard /> },
  { path: 'dashboard', element: <TenantDashboard /> },
  { path: 'properties', element: <TenantProperties /> },
  { path: 'payments', element: <TenantPayments /> },
  { path: 'maintenance', element: <TenantMaintenance /> },
]
