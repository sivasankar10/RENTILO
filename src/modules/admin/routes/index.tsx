import type { RouteObject } from 'react-router-dom'
import { AdminDashboard } from '../pages/AdminDashboard'
import { AdminBrokerManagement } from '../pages/AdminBrokerManagement'
import { AdminBrokerProfile } from '../pages/AdminBrokerProfile'
import { AdminBrokerDealDetail } from '../pages/AdminBrokerDealDetail'
import { AdminPropertyView } from '../pages/AdminPropertyView'
import { AdminListingManagement } from '../pages/AdminListingManagement'
import { AdminEnterprisePropertyDetail } from '../pages/AdminEnterprisePropertyDetail'
import { AdminNonEnterprisePropertyDetail } from '../pages/AdminNonEnterprisePropertyDetail'
import { AdminUserManagement } from '../pages/AdminUserManagement'
import { AdminUserProfile } from '../pages/AdminUserProfile'
import { AdminFinancePayments } from '../pages/AdminFinancePayments'
import { AdminPaymentReceipt } from '../pages/AdminPaymentReceipt'
import { AdminPlatformConfiguration } from '../pages/AdminPlatformConfiguration'
import { AdminApprovalRequests } from '../pages/AdminApprovalRequests'
import { AdminAssignmentManagement } from '../pages/AdminAssignmentManagement'
import { AdminNotifications } from '../pages/AdminNotifications'
import { AdminMaintenanceTickets } from '../pages/AdminMaintenanceTickets'
import { AdminMessages } from '../pages/AdminMessages'

export const adminRoutes: RouteObject[] = [
  { index: true, element: <AdminDashboard /> },
  { path: 'dashboard', element: <AdminDashboard /> },
  { path: 'broker-management', element: <AdminBrokerManagement /> },
  { path: 'broker-management/:brokerId', element: <AdminBrokerProfile /> },
  { path: 'broker-management/deal/:assignmentId', element: <AdminBrokerDealDetail /> },
  { path: 'property/:propertyId', element: <AdminPropertyView /> },
  { path: 'listing-management', element: <AdminListingManagement /> },
  { path: 'listing-management/enterprise/:propertyId', element: <AdminEnterprisePropertyDetail /> },
  { path: 'listing-management/non-enterprise/:propertyId', element: <AdminNonEnterprisePropertyDetail /> },
  { path: 'user-management', element: <AdminUserManagement /> },
  { path: 'user-management/:userId', element: <AdminUserProfile /> },
  { path: 'finance-payments', element: <AdminFinancePayments /> },
  { path: 'finance-payments/receipt/:transactionId', element: <AdminPaymentReceipt /> },
  { path: 'platform-configuration', element: <AdminPlatformConfiguration /> },
  { path: 'approval-requests', element: <AdminApprovalRequests /> },
  { path: 'assignment-management', element: <AdminAssignmentManagement /> },
  { path: 'maintenance-tickets', element: <AdminMaintenanceTickets /> },
  { path: 'notifications', element: <AdminNotifications /> },
  { path: 'messages', element: <AdminMessages /> },
]
