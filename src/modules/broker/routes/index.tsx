import { Navigate, type RouteObject } from 'react-router-dom'
import { ROUTES } from '@shared/constants/routes'
import { BrokerDashboard } from '../pages/BrokerDashboard'
import { BrokerPortfolio } from '../pages/BrokerPortfolio'
import { BrokerAssignedProperties } from '../pages/BrokerAssignedProperties'
import { BrokerListings } from '../pages/BrokerListings'
import { BrokerClients } from '../pages/BrokerClients'
import { BrokerCommission } from '../pages/BrokerCommission'
import { BrokerAnalytics } from '../pages/BrokerAnalytics'
import { BrokerPropertyDetails } from '../pages/BrokerPropertyDetails'
import { BrokerMessagesPage } from '../pages/BrokerMessagesPage'
import { BrokerProfile } from '../pages/BrokerProfile'
import { BrokerEditProfile } from '../pages/BrokerEditProfile'
import { BrokerNotifications } from '../pages/BrokerNotifications'

export const brokerRoutes: RouteObject[] = [
  { index: true, element: <BrokerDashboard /> },
  { path: 'dashboard', element: <BrokerDashboard /> },
  { path: 'portfolio', element: <BrokerPortfolio /> },
  { path: 'portfolio/:propertyId', element: <BrokerPropertyDetails /> },
  { path: 'assigned-properties', element: <BrokerAssignedProperties /> },
  { path: 'listings', element: <BrokerListings /> },
  { path: 'clients', element: <BrokerClients /> },
  { path: 'commission', element: <BrokerCommission /> },
  { path: 'analytics', element: <BrokerAnalytics /> },
  { path: 'messages', element: <BrokerMessagesPage /> },
  { path: 'profile', element: <BrokerProfile /> },
  { path: 'profile/edit', element: <BrokerEditProfile /> },
  { path: 'notifications', element: <BrokerNotifications /> },
  { path: 'settings', element: <Navigate to={ROUTES.BROKER.PROFILE} replace /> },
]
