import type { RouteObject } from 'react-router-dom'
import { AdminDashboard } from '../pages/AdminDashboard'
import { AdminBrokerManagement } from '../pages/AdminBrokerManagement'
import { AdminListingManagement } from '../pages/AdminListingManagement'
import { AdminEnterprisePropertyDetail } from '../pages/AdminEnterprisePropertyDetail'
import { AdminNonEnterprisePropertyDetail } from '../pages/AdminNonEnterprisePropertyDetail'
import { AdminUserManagement } from '../pages/AdminUserManagement'
import { AdminFinancePayments } from '../pages/AdminFinancePayments'
import { AdminPaymentReceipt } from '../pages/AdminPaymentReceipt'
import { AdminPlatformConfiguration } from '../pages/AdminPlatformConfiguration'
import { AdminAssignmentManagement } from '../pages/AdminAssignmentManagement'
import { AdminNotifications } from '../pages/AdminNotifications'
import { AdminMaintenanceTickets } from '../pages/AdminMaintenanceTickets'
import { AdminMessages } from '../pages/AdminMessages'

export const adminRoutes: RouteObject[] = [
  { index: true, element: <AdminDashboard /> },
  { path: 'dashboard', element: <AdminDashboard /> },
  { path: 'broker-management', element: <AdminBrokerManagement /> },
  { path: 'listing-management', element: <AdminListingManagement /> },
  { path: 'listing-management/enterprise/:propertyId', element: <AdminEnterprisePropertyDetail /> },
  { path: 'listing-management/non-enterprise/:propertyId', element: <AdminNonEnterprisePropertyDetail /> },
  { path: 'user-management', element: <AdminUserManagement /> },
  { path: 'finance-payments', element: <AdminFinancePayments /> },
  { path: 'finance-payments/receipt/:transactionId', element: <AdminPaymentReceipt /> },
  { path: 'platform-configuration', element: <AdminPlatformConfiguration /> },
  { path: 'assignment-management', element: <AdminAssignmentManagement /> },
  { path: 'maintenance-tickets', element: <AdminMaintenanceTickets /> },
  { path: 'notifications', element: <AdminNotifications /> },
  { path: 'messages', element: <AdminMessages /> },
]
