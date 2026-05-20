import type { RouteObject } from 'react-router-dom'
import { BrokerDashboard } from '../pages/BrokerDashboard'
import { BrokerListings } from '../pages/BrokerListings'
import { BrokerClients } from '../pages/BrokerClients'
import { BrokerCommission } from '../pages/BrokerCommission'

export const brokerRoutes: RouteObject[] = [
  { index: true, element: <BrokerDashboard /> },
  { path: 'dashboard', element: <BrokerDashboard /> },
  { path: 'listings', element: <BrokerListings /> },
  { path: 'clients', element: <BrokerClients /> },
  { path: 'commission', element: <BrokerCommission /> },
]
