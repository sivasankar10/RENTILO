import type { UserRole } from '@shared/constants/roles'
import type {
  OverviewSpec,
  PropertyAmenity,
  PropertyHighlight,
  PropertyNearby,
  PropertyRule,
} from '@modules/tenant/types/property'

export type PrototypeAccountName =
  | 'Tenant1'
  | 'Tenant2'
  | 'MultiPropertyOwner'
  | 'Owner1'
  | 'Owner2'
  | 'Broker1'
  | 'Broker2'
  | 'Admin1'
  | 'TenantOwner'
  | (string & {})

export interface PrototypeUser {
  id: string
  accountName: PrototypeAccountName
  phone: string
  email: string
  firstName: string
  lastName: string
  roles: UserRole[]
  primaryRole: UserRole
  avatar?: string
  kycStatus: 'Verified' | 'Pending' | 'Rejected'
  status: 'Active' | 'Temp Banned'
  flags: number
  lastActive: string
  createdAt: string
  updatedAt: string
}

export type PrototypeListingStatus = 'Active' | 'Paused' | 'Flagged' | 'Removed'

export interface PrototypeProperty {
  id: string
  ownerId: string
  title: string
  propertyType: string
  description: string
  address: string
  unit: string
  postalCode: string
  city: string
  neighborhood: string
  price: string
  pricePeriod: string
  deposit: string
  beds: number
  baths: number
  sqft: string
  availableFrom: string
  visitWeekday: string
  visitStartTime: string
  visitEndTime: string
  leaseDuration: number
  noticePeriod: string
  image: string
  gallery: string[]
  highlights: PropertyHighlight[]
  overviewSpecs: OverviewSpec[]
  overview: string[]
  amenities: PropertyAmenity[]
  rules: PropertyRule[]
  nearby: PropertyNearby
  noBrokerServices: boolean
  views: number
  shortlists: number
  contacts: number
  createdAt: string
  updatedAt: string
}

export interface PrototypeListing {
  id: string
  propertyId: string
  ownerId: string
  segment: 'enterprise' | 'non-enterprise'
  status: PrototypeListingStatus
  postedDate: string
  updated: string
  badge: string | null
  brokerEnabled: boolean
  createdAt: string
  updatedAt: string
}

export type BrokerAssignmentStatus = 'Active' | 'Pending' | 'Released'

export interface BrokerAssignment {
  id: string
  propertyId: string
  listingId: string
  ownerId: string
  brokerId: string
  assignedBy: string
  status: BrokerAssignmentStatus
  createdAt: string
  updatedAt: string
}

export interface TenantSavedListing {
  tenantId: string
  listingId: string
  savedAt: string
}

export type ApplicationStatus =
  | 'interest_shown'
  | 'visit_scheduled'
  | 'visit_confirmed'
  | 'awaiting_owner_approval'
  | 'owner_approved'
  | 'agreement_requested'
  | 'agreement_sent'
  | 'changes_requested'
  | 'agreement_approved'
  | 'payment_completed'
  | 'active'
  | 'rejected'

export interface ScheduledVisit {
  date: string
  time: string
}

export interface AgreementTerms {
  startDate: string
  endDate: string
  monthlyRent: string
  securityDeposit: string
  noticePeriod: string
  utilities: string
  maintenanceResponsibility: string
  petPolicy: string
  specialClauses: string
  ownerSignature: string
}

export interface AgreementVersion extends AgreementTerms {
  id: string
  version: number
  sentAt: string
  tenantSignature?: string
  tenantApprovedAt?: string
  changeRequest?: string
}

export interface RentalApplication {
  id: string
  tenantId: string
  ownerId: string
  propertyId: string
  listingId: string
  brokerId?: string
  status: ApplicationStatus
  scheduledVisit?: ScheduledVisit
  agreementVersions: AgreementVersion[]
  createdAt: string
  updatedAt: string
}

export interface LeaseRecord {
  id: string
  applicationId: string
  tenantId: string
  ownerId: string
  propertyId: string
  listingId: string
  status: 'pending_owner_onboarding' | 'active'
  accessKey?: string
  activatedAt?: string
  createdAt: string
  updatedAt: string
}

export type PrototypePaymentCategory =
  | 'RENT'
  | 'SECURITY DEPOSIT'
  | 'UTILITY BILL'
  | 'MAINTENANCE'
  | 'PREMIUM'
  | 'COMMISSION'
  | 'OTHER'

export interface PrototypePayment {
  id: string
  applicationId?: string
  leaseId?: string
  tenantId?: string
  ownerId: string
  brokerId?: string
  propertyId?: string
  listingId?: string
  category: PrototypePaymentCategory
  amount: number
  amountDisplay: string
  txnId: string
  refId: string
  method: string
  status: 'Successful' | 'Pending' | 'Failed' | 'Refunded'
  flow: 'tenant_to_owner' | 'owner_outgoing' | 'platform_to_broker'
  counterparty: string
  description?: string
  paidAt: string
  paidAtIso: string
}

export interface ChatMessage {
  id: string
  senderId: string
  senderRole: 'tenant' | 'owner' | 'broker' | 'admin'
  text: string
  time: string
  readBy: string[]
  createdAt: string
}

export interface ChatThread {
  id: string
  type: 'tenant_owner' | 'owner_broker' | 'broker_tenant' | 'admin'
  participantIds: string[]
  propertyId?: string
  listingId?: string
  applicationId?: string
  messages: ChatMessage[]
  updatedAt: string
}

export type MaintenanceStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed'
export type MaintenancePriority = 'Low' | 'Medium' | 'High' | 'Urgent'
export type MaintenanceCategory =
  | 'Plumbing'
  | 'Electrical'
  | 'Appliance'
  | 'Structural'
  | 'Pest Control'
  | 'HVAC'
  | 'Other'

export interface MaintenanceMessage {
  id: string
  senderId: string
  senderRole: 'tenant' | 'owner' | 'admin'
  text: string
  time: string
  createdAt: string
}

export interface MaintenanceTicket {
  id: string
  ticketNo: string
  tenantId: string
  ownerId: string
  propertyId: string
  leaseId?: string
  category: MaintenanceCategory
  priority: MaintenancePriority
  problem: string
  status: MaintenanceStatus
  preferredSlot: string
  assignedTo: string
  ownerNote: string
  images: string[]
  messages: MaintenanceMessage[]
  submittedAt: string
  lastUpdated: string
  createdAt: string
  updatedAt: string
}

export interface PrototypeNotification {
  id: string
  userId?: string
  role: UserRole | 'all'
  title: string
  description: string
  action?: string
  relatedId?: string
  unread: boolean
  important: boolean
  createdAt: string
}

export type AdminRequestType =
  | 'broker_listing_access'
  | 'broker_listing_removal'
  | 'listing_approval'
  | 'promoted_listing_approval'

export interface AdminRequest {
  id: string
  type: AdminRequestType
  requesterId: string
  propertyId?: string
  listingId?: string
  reason?: string
  status: 'Pending' | 'Approved' | 'Rejected'
  createdAt: string
  updatedAt: string
}

export interface PrototypeStateData {
  users: PrototypeUser[]
  properties: PrototypeProperty[]
  listings: PrototypeListing[]
  brokerAssignments: BrokerAssignment[]
  tenantSavedListings: TenantSavedListing[]
  applications: RentalApplication[]
  leases: LeaseRecord[]
  payments: PrototypePayment[]
  chats: ChatThread[]
  maintenanceTickets: MaintenanceTicket[]
  notifications: PrototypeNotification[]
  adminRequests: AdminRequest[]
}

export interface OwnerPropertyInput {
  propertyName?: string
  propertyType?: string
  description?: string
  streetAddress?: string
  unit?: string
  postalCode?: string
  city?: string
  neighborhood?: string
  baseRent?: string
  securityDeposit?: string
  availableFrom?: string
  visitWeekday?: string
  visitStartTime?: string
  visitEndTime?: string
  leaseDuration?: number
  noticePeriod?: string
  photos?: string[]
  customTags?: string[]
  amenities?: Record<string, boolean>
  buildingFeatures?: Record<string, boolean>
  petPolicy?: boolean
}



