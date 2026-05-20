export interface EnterpriseDashboardData {
  portfolioSize: number
  totalTeamMembers: number
  monthlyRevenue: number
  occupancyRate: number
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'analyst'
  avatar?: string
  status: 'active' | 'inactive'
  assignedProperties: number
  joinedAt: string
}

export interface EnterpriseReport {
  id: string
  title: string
  type: 'revenue' | 'occupancy' | 'maintenance' | 'portfolio'
  generatedAt: string
  status: 'ready' | 'generating' | 'failed'
}
