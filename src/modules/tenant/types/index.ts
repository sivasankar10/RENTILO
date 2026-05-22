export type {
  Property,
  PropertyHighlight,
  OverviewSpec,
  PropertyRule,
  NearbyPlace,
  PropertyNearby,
  PropertyTransit,
  PropertyAmenity,
} from './property'

export interface TenantDashboardData {
  totalProperties: number
  activeLeases: number
  pendingPayments: number
  maintenanceRequests: number
}

export interface MaintenanceRequest {
  id: string
  propertyId: string
  propertyTitle: string
  category: 'plumbing' | 'electrical' | 'structural' | 'appliance' | 'other'
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface TenantPayment {
  id: string
  propertyId: string
  propertyTitle: string
  amount: number
  currency: string
  status: 'paid' | 'pending' | 'overdue'
  dueDate: string
  paidAt?: string
}
