import { createBrowserRouter } from 'react-router-dom'
import { RoleRedirect } from './RoleRedirect'
import { ProtectedRoute } from './ProtectedRoute'
import { AuthLayout } from '@app/layouts/AuthLayout'
import { TenantLayout } from '@app/layouts/TenantLayout'
import { OwnerLayout } from '@app/layouts/OwnerLayout'
import { BrokerLayout } from '@app/layouts/BrokerLayout'
import { EnterpriseLayout } from '@app/layouts/EnterpriseLayout'
import { AdminLayout } from '@app/layouts/AdminLayout'
import { authRoutes } from '@modules/auth'
import { tenantRoutes } from '@modules/tenant'
import { ownerRoutes } from '@modules/owner'
import { brokerRoutes } from '@modules/broker'
import { enterpriseRoutes } from '@modules/enterprise'
import { adminRoutes } from '@modules/admin'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RoleRedirect />,
  },

  // ── Auth Routes (public) ──
  {
    path: '/auth',
    element: <AuthLayout />,
    children: authRoutes,
  },

  // ── Tenant Routes (protected) ──
  {
    path: '/tenant',
    element: (
      <ProtectedRoute allowedRoles={['tenant']}>
        <TenantLayout />
      </ProtectedRoute>
    ),
    children: tenantRoutes,
  },

  // ── Owner Routes (protected) ──
  {
    path: '/owner',
    element: (
      <ProtectedRoute allowedRoles={['owner']}>
        <OwnerLayout />
      </ProtectedRoute>
    ),
    children: ownerRoutes,
  },

  // ── Broker Routes (protected) ──
  {
    path: '/broker',
    element: (
      <ProtectedRoute allowedRoles={['broker']}>
        <BrokerLayout />
      </ProtectedRoute>
    ),
    children: brokerRoutes,
  },

  // ── Enterprise Routes (protected) ──
  {
    path: '/enterprise',
    element: (
      <ProtectedRoute allowedRoles={['enterprise']}>
        <EnterpriseLayout />
      </ProtectedRoute>
    ),
    children: enterpriseRoutes,
  },

  // ── Admin Routes (protected) ──
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: adminRoutes,
  },

  // ── Catch-all 404 ──
  {
    path: '*',
    element: (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-heading-1 text-text-primary mb-2">404</h1>
          <p className="text-body text-text-muted">Page not found</p>
        </div>
      </div>
    ),
  },
])
