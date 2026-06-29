import type { RouteObject } from 'react-router-dom'
import { OwnerDashboard } from '../pages/OwnerDashboard'
import { OwnerPortfolio } from '../pages/OwnerPortfolio'
import { OwnerProperties } from '../pages/OwnerProperties'
import { OwnerPropertyDetail } from '../pages/OwnerPropertyDetail'
import { OwnerRegisterProperty } from '../pages/OwnerRegisterProperty'
import { OwnerMaintenanceTickets } from '../pages/OwnerMaintenanceTickets'
import { OwnerLeases } from '../pages/OwnerLeases'
import { OwnerTenants } from '../pages/OwnerTenants'
import { OwnerAnalytics } from '../pages/OwnerAnalytics'
import { OwnerPlansRules } from '../pages/OwnerPlansRules'
import { OwnerSettings } from '../pages/OwnerSettings'
import { OwnerNotifications } from '../pages/OwnerNotifications'
import { OwnerMessages } from '../pages/OwnerMessages'
import { OwnerPremiumPaymentPage } from '../pages/OwnerPremiumPaymentPage'
// Premium pages (migrated from premium-owner module)
import { OwnerInquiries } from '../pages/OwnerInquiries'
import { OwnerViewings } from '../pages/OwnerViewings'
import { OwnerBrokerManagement } from '../pages/OwnerBrokerManagement'
import { OwnerPromotions } from '../pages/OwnerPromotions'
import { OwnerFinancials } from '../pages/OwnerFinancials'
import { OwnerProfile } from '../pages/OwnerProfile'

export const ownerRoutes: RouteObject[] = [
  // Base routes (available to all)
  { index: true, element: <OwnerDashboard /> },
  { path: 'dashboard', element: <OwnerDashboard /> },
  { path: 'portfolio', element: <OwnerPortfolio /> },
  { path: 'properties', element: <OwnerProperties /> },
  { path: 'properties/register', element: <OwnerRegisterProperty /> },
  { path: 'properties/:propertyId', element: <OwnerPropertyDetail /> },
  { path: 'maintenance', element: <OwnerMaintenanceTickets /> },
  { path: 'leases', element: <OwnerLeases /> },
  { path: 'tenants', element: <OwnerTenants /> },
  { path: 'plans-rules', element: <OwnerPlansRules /> },
  { path: 'premium-payment', element: <OwnerPremiumPaymentPage /> },
  { path: 'settings', element: <OwnerSettings /> },
  { path: 'profile', element: <OwnerProfile /> },
  { path: 'notifications', element: <OwnerNotifications /> },
  { path: 'messages', element: <OwnerMessages /> },
  
  // Premium routes (feature-gated in components)
  { path: 'analytics', element: <OwnerAnalytics /> },
  { path: 'inquiries', element: <OwnerInquiries /> },
  { path: 'viewings', element: <OwnerViewings /> },
  { path: 'broker-management', element: <OwnerBrokerManagement /> },
  { path: 'promotions', element: <OwnerPromotions /> },
  { path: 'financials', element: <OwnerFinancials /> },
]
