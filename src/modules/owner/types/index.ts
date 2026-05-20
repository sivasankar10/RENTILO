export interface OwnerDashboardData {
  totalProperties: number
  totalTenants: number
  monthlyRevenue: number
  occupancyRate: number
}

export interface OwnerProperty {
  id: string
  title: string
  status: 'available' | 'rented' | 'maintenance' | 'unlisted'
  tenantName?: string
  monthlyRent: number
  currency: string
  occupiedSince?: string
}
