import type { UserRole } from '@shared/constants/roles'
import { usePrototypeStore } from './prototypeStore'
import type {
  BrokerAssignment,
  ChatThread,
  LeaseRecord,
  MaintenanceTicket,
  PrototypeListing,
  PrototypePayment,
  PrototypeProperty,
  PrototypeStateData,
  PrototypeUser,
  RentalApplication,
} from '@shared/types/prototype'

export interface PrototypeListingBundle {
  listing: PrototypeListing
  property: PrototypeProperty
  owner: PrototypeUser
  brokerAssignment?: BrokerAssignment
}

function state(): PrototypeStateData {
  return usePrototypeStore.getState()
}

function activeListingBundles(data = state()): PrototypeListingBundle[] {
  return data.listings
    .filter((listing) => listing.status === 'Active')
    .map<PrototypeListingBundle | null>((listing) => {
      const property = data.properties.find((item) => item.id === listing.propertyId)
      const owner = data.users.find((item) => item.id === listing.ownerId)
      if (!property || !owner) return null
      return {
        listing,
        property,
        owner,
        brokerAssignment: data.brokerAssignments.find(
          (assignment) => assignment.listingId === listing.id && assignment.status === 'Active',
        ),
      }
    })
    .filter((bundle): bundle is PrototypeListingBundle => Boolean(bundle))
}

export function selectTenantListings(tenantId: string): PrototypeListingBundle[] {
  void tenantId
  return activeListingBundles()
}

export function selectTenantSavedListings(tenantId: string): PrototypeListingBundle[] {
  const data = state()
  const savedIds = new Set(
    data.tenantSavedListings
      .filter((item) => item.tenantId === tenantId)
      .map((item) => item.listingId),
  )
  return activeListingBundles(data).filter((bundle) => savedIds.has(bundle.listing.id))
}

export function selectTenantApplications(tenantId: string): RentalApplication[] {
  return state().applications.filter((application) => application.tenantId === tenantId)
}

export function selectTenantActiveLease(tenantId: string): LeaseRecord | undefined {
  return state().leases.find((lease) => lease.tenantId === tenantId && lease.status === 'active')
}

export function selectOwnerProperties(ownerId: string): PrototypeProperty[] {
  return state().properties.filter((property) => property.ownerId === ownerId)
}

export function selectOwnerListings(ownerId: string): PrototypeListingBundle[] {
  const data = state()
  return data.listings
    .filter((listing) => listing.ownerId === ownerId)
    .map<PrototypeListingBundle | null>((listing) => {
      const property = data.properties.find((item) => item.id === listing.propertyId)
      const owner = data.users.find((item) => item.id === listing.ownerId)
      if (!property || !owner) return null
      return {
        listing,
        property,
        owner,
        brokerAssignment: data.brokerAssignments.find(
          (assignment) => assignment.listingId === listing.id && assignment.status === 'Active',
        ),
      }
    })
    .filter((bundle): bundle is PrototypeListingBundle => Boolean(bundle))
}

export function selectOwnerApplications(
  ownerId: string,
  propertyId?: string,
): RentalApplication[] {
  return state().applications.filter(
    (application) =>
      application.ownerId === ownerId &&
      (!propertyId || application.propertyId === propertyId),
  )
}

export function selectOwnerPayments(ownerId: string): PrototypePayment[] {
  return state().payments.filter((payment) => payment.ownerId === ownerId)
}

export function selectOwnerMaintenance(
  ownerId: string,
  propertyId?: string,
): MaintenanceTicket[] {
  return state().maintenanceTickets.filter(
    (ticket) => ticket.ownerId === ownerId && (!propertyId || ticket.propertyId === propertyId),
  )
}

export function selectBrokerAssignedProperties(brokerId: string): PrototypeListingBundle[] {
  const data = state()
  const assignmentListingIds = new Set(
    data.brokerAssignments
      .filter((assignment) => assignment.brokerId === brokerId && assignment.status === 'Active')
      .map((assignment) => assignment.listingId),
  )
  return activeListingBundles(data).filter((bundle) => assignmentListingIds.has(bundle.listing.id))
}

export function selectBrokerListings(brokerId: string): PrototypeListingBundle[] {
  return selectBrokerAssignedProperties(brokerId)
}

export function selectBrokerLeads(brokerId: string): RentalApplication[] {
  return state().applications.filter((application) => application.brokerId === brokerId)
}

export function selectAdminListings(): PrototypeListingBundle[] {
  const data = state()
  return data.listings
    .map<PrototypeListingBundle | null>((listing) => {
      const property = data.properties.find((item) => item.id === listing.propertyId)
      const owner = data.users.find((item) => item.id === listing.ownerId)
      if (!property || !owner) return null
      return {
        listing,
        property,
        owner,
        brokerAssignment: data.brokerAssignments.find(
          (assignment) => assignment.listingId === listing.id && assignment.status === 'Active',
        ),
      }
    })
    .filter((bundle): bundle is PrototypeListingBundle => Boolean(bundle))
}

export function selectAdminUsers(): PrototypeUser[] {
  return state().users
}

export function selectAdminPayments(): PrototypePayment[] {
  return state().payments
}

export function selectAdminMaintenanceTickets(): MaintenanceTicket[] {
  return state().maintenanceTickets
}

export function selectRoleNotifications(userId: string, role: UserRole) {
  return state().notifications.filter(
    (notification) =>
      notification.role === 'all' ||
      notification.userId === userId ||
      notification.role === role,
  )
}

export function selectChatThreadsForUser(userId: string): ChatThread[] {
  return state().chats.filter((thread) => thread.participantIds.includes(userId))
}

export function selectPrototypeUserByPhone(phone: string): PrototypeUser | undefined {
  const normalized = phone.replace(/\D/g, '').slice(-10)
  return state().users.find((user) => user.phone === normalized)
}

export function selectPrototypeUserById(userId: string): PrototypeUser | undefined {
  return state().users.find((user) => user.id === userId)
}


// ─── Owner ↔ Broker Assignment Selectors ─────────────────────────────────────

export interface BrokerAssignmentBundle {
  assignment: BrokerAssignment
  broker: PrototypeUser
  property: PrototypeProperty
  listing: PrototypeListing
}

function assignmentBundle(
  data: PrototypeStateData,
  assignment: BrokerAssignment,
): BrokerAssignmentBundle | null {
  const broker = data.users.find((u) => u.id === assignment.brokerId)
  const property = data.properties.find((p) => p.id === assignment.propertyId)
  const listing = data.listings.find((l) => l.id === assignment.listingId)
  if (!broker || !property || !listing) return null
  return { assignment, broker, property, listing }
}

/** All pending requests across all owner's properties */
export function selectOwnerBrokerRequests(ownerId: string): BrokerAssignmentBundle[] {
  const data = state()
  return data.brokerAssignments
    .filter((a) => a.ownerId === ownerId && a.status === 'Pending')
    .map((a) => assignmentBundle(data, a))
    .filter((b): b is BrokerAssignmentBundle => Boolean(b))
}

/** All active broker assignments for an owner */
export function selectOwnerActiveBrokers(ownerId: string): BrokerAssignmentBundle[] {
  const data = state()
  return data.brokerAssignments
    .filter((a) => a.ownerId === ownerId && a.status === 'Active')
    .map((a) => assignmentBundle(data, a))
    .filter((b): b is BrokerAssignmentBundle => Boolean(b))
}

/** All assignments for a broker (any status) — for broker status display */
export function selectBrokerAssignmentsForBroker(brokerId: string): BrokerAssignmentBundle[] {
  const data = state()
  return data.brokerAssignments
    .filter((a) => a.brokerId === brokerId)
    .map((a) => assignmentBundle(data, a))
    .filter((b): b is BrokerAssignmentBundle => Boolean(b))
}

/** Commission payments for a broker */
export function selectBrokerCommissions(brokerId: string): PrototypePayment[] {
  return state().payments.filter(
    (p) => p.brokerId === brokerId && p.category === 'COMMISSION',
  )
}
