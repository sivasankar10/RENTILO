export interface BrokerDashboardData {
  totalListings: number
  activeClients: number
  totalCommission: number
  closedDeals: number
}

export interface BrokerClient {
  id: string
  name: string
  email: string
  phone: string
  type: 'tenant' | 'owner'
  status: 'active' | 'inactive'
  assignedListings: number
}

export interface Commission {
  id: string
  propertyTitle: string
  clientName: string
  amount: number
  currency: string
  status: 'pending' | 'paid' | 'cancelled'
  closedAt: string
}
