import type { RouteObject } from 'react-router-dom'
import { AdminDashboard } from '../pages/AdminDashboard'
import { AdminBrokerManagement } from '../pages/AdminBrokerManagement'
import { AdminListingManagement } from '../pages/AdminListingManagement'
import { AdminUserManagement } from '../pages/AdminUserManagement'
import { AdminFinancePayments } from '../pages/AdminFinancePayments'
import { AdminPlatformConfiguration } from '../pages/AdminPlatformConfiguration'

export const adminRoutes: RouteObject[] = [
  { index: true, element: <AdminDashboard /> },
  { path: 'dashboard', element: <AdminDashboard /> },
  { path: 'broker-management', element: <AdminBrokerManagement /> },
  { path: 'listing-management', element: <AdminListingManagement /> },
  { path: 'user-management', element: <AdminUserManagement /> },
  { path: 'finance-payments', element: <AdminFinancePayments /> },
  { path: 'platform-configuration', element: <AdminPlatformConfiguration /> },
  { path: 'assignment-management', element: <AdminDashboard /> },
]
