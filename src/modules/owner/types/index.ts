import type { SubscriptionPlan, SubscriptionStatus, OwnerFeature } from '../config/features'

// Re-export feature types
export type { SubscriptionPlan, SubscriptionStatus, OwnerFeature }

// Owner Dashboard Data
export interface OwnerDashboardData {
  totalProperties: number
  totalTenants: number
  monthlyRevenue: number
  occupancyRate: number
}

// Owner Property
export interface OwnerProperty {
  id: string
  title: string
  name?: string
  address?: string
  status: 'available' | 'rented' | 'maintenance' | 'unlisted' | 'active' | 'vacant' | 'leased'
  tenantName?: string
  monthlyRent: number
  currency?: string
  occupiedSince?: string
  type?: 'residential' | 'commercial' | 'mixed-use'
  image?: string
  gallery?: string[]
  beds?: number
  baths?: number
  sqft?: number
  occupancyRate?: number
  assignedBrokerId?: string
  assignedBrokerName?: string
}

// Owner Profile
export interface OwnerProfile {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  subscriptionPlan: SubscriptionPlan
  subscriptionStatus: SubscriptionStatus
  memberSince: Date
  totalProperties: number
  totalRevenue: number
  verificationStatus: 'verified' | 'pending' | 'unverified'
  // Premium tier for display purposes (derived from subscription)
  tier?: 'gold' | 'platinum' | 'diamond'
}

// Owner Tenant
export interface OwnerTenant {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  propertyId: string
  propertyName: string
  leaseStart: Date
  leaseEnd: Date
  rentAmount: number
  paymentStatus: 'paid' | 'pending' | 'overdue'
  rating?: number
}

// Owner Lease
export interface OwnerLease {
  id: string
  propertyId: string
  propertyName: string
  tenantId: string
  tenantName: string
  startDate: Date
  endDate: Date
  monthlyRent: number
  securityDeposit: number
  status: 'active' | 'expiring' | 'expired' | 'renewed'
  documents: string[]
}

// Owner Maintenance Request
export interface OwnerMaintenanceRequest {
  id: string
  propertyId: string
  propertyName: string
  tenantId: string
  tenantName: string
  title: string
  description: string
  category: 'plumbing' | 'electrical' | 'hvac' | 'structural' | 'appliance' | 'other'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in-progress' | 'completed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
  estimatedCost?: number
  actualCost?: number
  vendorId?: string
  vendorName?: string
}

// Owner Broker (for premium feature)
export interface OwnerBroker {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  rating: number
  totalDeals: number
  activeListings: number
  commission: number
  status: 'active' | 'inactive'
  assignedProperties: string[]
}

// Owner Financial Record (for premium feature)
export interface OwnerFinancialRecord {
  id: string
  type: 'income' | 'expense'
  category: string
  amount: number
  propertyId: string
  propertyName: string
  description: string
  date: Date
  status: 'pending' | 'completed' | 'failed'
}

// Owner Report (for premium feature)
export interface OwnerReport {
  id: string
  title: string
  type: 'financial' | 'occupancy' | 'maintenance' | 'tenant' | 'market'
  generatedAt: Date
  period: string
  downloadUrl: string
}

// Owner Notification
export interface OwnerNotification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  category: 'payment' | 'lease' | 'maintenance' | 'tenant' | 'broker' | 'system'
  isRead: boolean
  createdAt: Date
  actionUrl?: string
}

// Owner Message
export interface OwnerMessage {
  id: string
  senderId: string
  senderName: string
  senderRole: 'tenant' | 'broker' | 'admin'
  senderAvatar: string
  text: string
  timestamp: Date
  isRead: boolean
  attachments?: string[]
}

export interface OwnerConversation {
  id: string
  participantId: string
  participantName: string
  participantRole: 'tenant' | 'broker' | 'admin'
  participantAvatar: string
  propertyId?: string
  propertyName?: string
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  isOnline: boolean
  messages: OwnerMessage[]
}

// Analytics Data (for premium feature)
export interface OwnerAnalytics {
  totalRevenue: number
  revenueGrowth: number
  occupancyRate: number
  occupancyGrowth: number
  totalProperties: number
  activeTenants: number
  pendingPayments: number
  maintenanceRequests: number
  monthlyTrend: { month: string; revenue: number; expenses: number }[]
  propertyPerformance: { propertyId: string; name: string; revenue: number; occupancy: number }[]
}

// Inquiry (for premium feature)
export interface OwnerInquiry {
  id: string
  applicantName: string
  applicantEmail: string
  applicantPhone: string
  applicantAvatar?: string
  propertyId: string
  propertyName: string
  score: number
  status: 'new' | 'contacted' | 'scheduled' | 'rejected'
  createdAt: Date
  message?: string
}

// Viewing (for premium feature)
export interface OwnerViewing {
  id: string
  propertyId: string
  propertyName: string
  prospectName: string
  prospectEmail: string
  prospectPhone: string
  scheduledAt: Date
  status: 'scheduled' | 'completed' | 'pending' | 'cancelled'
  notes?: string
}
