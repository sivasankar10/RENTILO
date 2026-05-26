import type { RouteObject } from 'react-router-dom'
import { BrokerDashboard } from '../pages/BrokerDashboard'
import { BrokerPortfolio } from '../pages/BrokerPortfolio'
import { BrokerAssignedProperties } from '../pages/BrokerAssignedProperties'
import { BrokerListings } from '../pages/BrokerListings'
import { BrokerClients } from '../pages/BrokerClients'
import { BrokerCommission } from '../pages/BrokerCommission'
import { BrokerPropertyDetails } from '../pages/BrokerPropertyDetails'
import { BrokerMessagesPage } from '../pages/BrokerMessagesPage'

export const brokerRoutes: RouteObject[] = [
  { index: true, element: <BrokerDashboard /> },
  { path: 'dashboard', element: <BrokerDashboard /> },
  { path: 'portfolio', element: <BrokerPortfolio /> },
  { path: 'portfolio/:propertyId', element: <BrokerPropertyDetails /> },
  { path: 'assigned-properties', element: <BrokerAssignedProperties /> },
  { path: 'listings', element: <BrokerListings /> },
  { path: 'clients', element: <BrokerClients /> },
  { path: 'commission', element: <BrokerCommission /> },
  { path: 'analytics', element: <BrokerCommission /> },
  { path: 'messages', element: <BrokerMessagesPage /> },
]
