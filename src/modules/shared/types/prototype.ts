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
  preferredVisitSlots: { day: string; startTime: string; endTime: string }[]
  visitSchedulingEnabled: boolean
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
  // Enterprise block structure (only for enterprise properties)
  enterpriseBlock?: {
    blockName: string
    floors: number
    unitsPerFloor: number
    units: { unitId: string; floor: number; unitNumber: string; status: 'Vacant' | 'Occupied' | 'Maintenance'; tenantName?: string; propertyId?: string }[]
  }
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

export type LeaseExitType = 'notice_period' | 'immediate'

/**
 * Exit workflow state machine.
 * Normal notice: inspection_pending -> inspection_scheduled -> refunded
 * Early exit:    penalty_pending -> penalty_payment -> inspection_pending -> inspection_scheduled -> refunded
 */
export type LeaseExitStatus =
  | 'penalty_pending' // early exit: owner must set the penalty amount
  | 'penalty_payment' // early exit: owner set the penalty, tenant must pay it
  | 'inspection_pending' // tenant must schedule the damage-inspection visit
  | 'inspection_scheduled' // inspection booked, owner must inspect and refund the deposit
  | 'refunded' // deposit refunded (minus damages); property released for new tenants

export interface LeaseExitInspection {
  date: string
  time: string
  scheduledAt: string
}

export interface LeaseExitNotice {
  id: string
  /** notice_period = tenant serves the full notice period; immediate = tenant pays a penalty to leave early */
  type: LeaseExitType
  status: LeaseExitStatus
  /** ISO timestamp when the exit notice was initiated */
  requestedAt: string
  /** Display date the tenant will vacate the property */
  moveOutDate: string
  /** ISO date (yyyy-mm-dd) the tenant will vacate the property */
  moveOutDateIso: string
  /** Notice period (in days) that applied to this property at the time of notice */
  noticePeriodDays: number
  /** Display date of the earliest move-out permitted without paying a penalty */
  earliestMoveOutDate: string
  /** ISO date (yyyy-mm-dd) of the earliest move-out permitted without paying a penalty */
  earliestMoveOutDateIso: string
  /**
   * Deadline by which the owner must refund the security deposit.
   * Normal notice: the chosen move-out date (end of notice period).
   * Early exit: the earliest move-out date (before the original notice period would have ended).
   */
  refundDueDate: string
  refundDueDateIso: string
  /** Security deposit held for this lease, used as the refund base */
  securityDepositAmount: number
  securityDepositDisplay: string
  /** Early-exit penalty, decided by the owner (immediate exits only) */
  penaltyAmount?: number
  penaltyAmountDisplay?: string
  penaltyPaymentId?: string
  penaltyPaidAt?: string
  /** Damage-inspection visit scheduled by the tenant */
  inspectionVisit?: LeaseExitInspection
  /** Damage assessment recorded by the owner during/after the inspection */
  damageAmount?: number
  damageAmountDisplay?: string
  damageNotes?: string
  /** Security deposit refund (deposit minus damages) paid by the owner */
  refundAmount?: number
  refundAmountDisplay?: string
  refundPaymentId?: string
  refundedAt?: string
  /** Set once the refund is complete and the property is released for new tenants */
  releasedAt?: string
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
  exitNotice?: LeaseExitNotice
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

export type NegotiationStatus = 'owner_offered' | 'admin_countered' | 'owner_countered' | 'accepted' | 'broker_offered' | 'broker_rejected' | 'rejected'

export interface NegotiationRound {
  by: 'owner' | 'admin'
  commission: string
  note: string
  at: string
}

export interface BrokerOffer {
  brokerId: string
  commission: string
  status: 'pending' | 'accepted' | 'rejected'
  offeredAt: string
  decidedAt?: string
}

export interface BrokerCommissionNegotiation {
  id: string
  ownerId: string
  propertyId: string
  status: NegotiationStatus
  rounds: NegotiationRound[]
  brokerOffers: BrokerOffer[]
  acceptedCommission?: string
  assignedBrokerId?: string
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
  commissionNegotiations: BrokerCommissionNegotiation[]
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
  preferredVisitSlots?: { day: string; startTime: string; endTime: string }[]
  leaseDuration?: number
  noticePeriod?: string
  photos?: string[]
  customTags?: string[]
  amenities?: Record<string, boolean>
  buildingFeatures?: Record<string, boolean>
  petPolicy?: boolean
  // New property specification fields
  bedrooms?: number
  bathrooms?: number
  sqft?: string
  furnishingStatus?: string
  facing?: string
  floor?: string
  totalFloors?: string
  balcony?: string
  ageOfBuilding?: string
  preferredTenant?: string
  possession?: string
  parkingType?: string
  waterSupply?: string
  nonVegAllowed?: boolean
  // Nearby places
  nearby?: {
    essentials: { name: string; distance: string; time: string }[]
    utility: { name: string; distance: string; time: string }[]
    transit: {
      busStations: { name: string; distance: string; time: string }[]
      airport: { name: string; distance: string; time: string }[]
      trainStations: { name: string; distance: string; time: string }[]
    }
  }
  // Property rules
  rules?: { rule: string; category: string }[]
}



