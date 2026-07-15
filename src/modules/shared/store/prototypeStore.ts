import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { initialPrototypeState } from '@shared/data/prototypeSeed'
import type {
  AdminRequest,
  AgreementTerms,
  ApplicationStatus,
  BrokerAssignment,
  ChatMessage,
  LeaseRecord,
  MaintenanceTicket,
  OwnerPropertyInput,
  PrototypeListing,
  PrototypeListingStatus,
  PrototypeNotification,
  PrototypePayment,
  PrototypeProperty,
  PrototypeStateData,
  PrototypeUser,
  RentalApplication,
  ScheduledVisit,
} from '@shared/types/prototype'
import type { BrokerCommissionNegotiation, BrokerOffer, NegotiationRound } from '@shared/types/prototype'

type PrototypeState = PrototypeStateData & {
  resetPrototypeSession: () => void
  createOwnerProperty: (ownerId: string, formData: OwnerPropertyInput) => { propertyId: string; listingId: string }
  updateOwnerProperty: (propertyId: string, patch: Partial<PrototypeProperty>) => void
  setListingStatus: (listingId: string, status: PrototypeListingStatus) => void
  assignBroker: (propertyId: string, brokerId: string, assignedBy: string) => string | null
  removeBrokerAssignment: (propertyId: string, brokerId: string) => void
  requestBrokerListingAccess: (brokerId: string, propertyId: string) => string | null
  requestBrokerListingRemoval: (brokerId: string, listingId: string, reason: string) => string | null
  decideAdminRequest: (requestId: string, decision: 'Approved' | 'Rejected') => void
  saveTenantProperty: (tenantId: string, listingId: string) => void
  unsaveTenantProperty: (tenantId: string, listingId: string) => void
  showInterest: (tenantId: string, listingId: string) => string | null
  scheduleVisit: (applicationId: string, visit: ScheduledVisit) => void
  approveTenant: (applicationId: string) => void
  rejectTenant: (applicationId: string) => void
  sendAgreement: (applicationId: string, terms: AgreementTerms) => void
  requestAgreementChanges: (applicationId: string, comment: string) => void
  approveAgreement: (applicationId: string, tenantSignature: string) => void
  completeOnboardingPayment: (applicationId: string, paymentInput: { method: string; refId?: string }) => void
  confirmTenantOnboarding: (applicationId: string) => void
  sendChatMessage: (threadId: string, senderId: string, text: string) => void
  createMaintenanceTicket: (
    tenantId: string,
    leaseId: string,
    payload: Pick<MaintenanceTicket, 'category' | 'priority' | 'problem' | 'preferredSlot'> & {
      images?: string[]
      assignedTo?: string
    },
  ) => string | null
  updateMaintenanceTicket: (ticketId: string, patch: Partial<MaintenanceTicket>) => void
  sendMaintenanceMessage: (ticketId: string, senderId: string, text: string) => void
  addNotification: (notification: Omit<PrototypeNotification, 'id' | 'createdAt' | 'unread'> & { id?: string; createdAt?: string; unread?: boolean }) => void
  markNotificationRead: (notificationId: string) => void
  addPayment: (payment: Omit<PrototypePayment, 'id' | 'paidAt' | 'paidAtIso'> & { id?: string; paidAtIso?: string }) => void
  setPaymentStatus: (paymentId: string, status: PrototypePayment['status']) => void
  toggleUserStatus: (userId: string) => void
  removeUser: (userId: string) => void
  addUser: (user: PrototypeUser) => void
  addBroadcast: (audience: string, title: string, body: string) => void
  // Commission negotiation
  createCommissionNegotiation: (ownerId: string, propertyId: string, commission: string, note: string) => string
  counterCommissionOffer: (negotiationId: string, by: 'owner' | 'admin', commission: string, note: string) => void
  acceptCommissionOffer: (negotiationId: string, brokerId?: string) => void
  rejectCommissionNegotiation: (negotiationId: string) => void
  sendBrokerOffer: (negotiationId: string, brokerId: string, commission: string) => void
  decideBrokerOffer: (negotiationId: string, brokerId: string, decision: 'accepted' | 'rejected') => void
}
function cloneInitialState(): PrototypeStateData {
  return JSON.parse(JSON.stringify(initialPrototypeState)) as PrototypeStateData
}

function nowIso() {
  return new Date().toISOString()
}

function displayDate(iso = nowIso()) {
  return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

function displayTime(iso = nowIso()) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, '')
}

function moneyToNumber(value: string) {
  return Number(digitsOnly(value)) || 0
}

function formatRs(amount: number) {
  return `Rs. ${amount.toLocaleString('en-IN')}`
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function updateApplicationStatus(
  applications: RentalApplication[],
  applicationId: string,
  status: ApplicationStatus,
  patch: Partial<RentalApplication> = {},
) {
  const timestamp = nowIso()
  return applications.map((application) =>
    application.id === applicationId
      ? { ...application, ...patch, status, updatedAt: timestamp }
      : application,
  )
}

function createListingFromProperty(property: PrototypeProperty): PrototypeListing {
  const timestamp = nowIso()
  const suffix = property.id.replace(/^property-/, '')
  return {
    id: `listing-${suffix}`,
    propertyId: property.id,
    ownerId: property.ownerId,
    segment: 'non-enterprise',
    status: 'Active',
    postedDate: displayDate(timestamp),
    updated: 'Just now',
    badge: null,
    brokerEnabled: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

function createPropertyFromForm(ownerId: string, formData: OwnerPropertyInput): PrototypeProperty {
  const timestamp = nowIso()
  const propertyName = formData.propertyName?.trim() || 'Session Prototype Property'
  const propertyType = formData.propertyType?.trim() || 'Apartment'
  const baseRent = formData.baseRent?.trim() || '45000'
  const deposit = formData.securityDeposit?.trim() || '90000'
  const priceDisplay = baseRent.startsWith('Rs.') ? baseRent : formatRs(moneyToNumber(baseRent))
  const depositDisplay = deposit.startsWith('Rs.') ? deposit : formatRs(moneyToNumber(deposit))
  const city = formData.city?.trim() || 'Bangalore'
  const neighborhood = formData.neighborhood?.trim() || 'Central'
  const address = formData.streetAddress?.trim() || `${propertyName}, ${neighborhood}`
  const photos = formData.photos && formData.photos.length > 0
    ? formData.photos
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80']
  const id = createId('property-owner')

  return {
    id,
    ownerId,
    title: propertyName,
    propertyType,
    description: formData.description?.trim() || `${propertyName} was created in the current frontend-only session.`,
    address,
    unit: formData.unit?.trim() || 'Unit 1',
    postalCode: formData.postalCode?.trim() || '560001',
    city,
    neighborhood,
    price: priceDisplay,
    pricePeriod: '/ mo',
    deposit: depositDisplay,
    beds: 2,
    baths: 2,
    sqft: '1,200',
    availableFrom: formData.availableFrom?.trim() || timestamp.slice(0, 10),
    visitWeekday: formData.visitWeekday?.trim() || 'Saturday',
    visitStartTime: formData.visitStartTime?.trim() || '10:00 AM',
    visitEndTime: formData.visitEndTime?.trim() || '1:00 PM',
    leaseDuration: formData.leaseDuration ?? 12,
    noticePeriod: formData.noticePeriod?.trim() || '30',
    image: photos[0]!,
    gallery: photos,
    highlights: [
      { label: 'No. of Bedroom', value: '2 Bedroom' },
      { label: 'Property Type', value: propertyType },
      { label: 'Preferred Tenant', value: 'Anyone' },
      { label: 'Possession', value: 'Immediately' },
      { label: 'Parking', value: formData.buildingFeatures?.parking ? 'Bike and Car' : 'Bike' },
      { label: 'Age of Building', value: '3-5 Years' },
      { label: 'Balcony', value: 'Yes' },
      { label: 'Posted On', value: displayDate(timestamp) },
    ],
    overviewSpecs: [
      { label: 'Furnishing Status', value: 'Semi' },
      { label: 'Facing', value: 'East' },
      { label: 'Water Supply', value: 'Corporation' },
      { label: 'Floor', value: '1/4' },
      { label: 'Bathroom', value: '2' },
      { label: 'Pet Allowed', value: formData.petPolicy ? 'Yes' : 'No' },
      { label: 'Non-Veg Allowed', value: 'Yes' },
      { label: 'Gated Security', value: formData.buildingFeatures?.security ? 'Yes' : 'No' },
    ],
    overview: [
      formData.description?.trim() || `${propertyName} is ready for tenant discovery in this prototype session.`,
      'This listing was generated from the owner property registration workflow.',
    ],
    amenities: [
      { icon: 'wifi', label: formData.amenities?.wifi ? 'High-Speed WiFi' : 'Internet Ready' },
      { icon: 'local_parking', label: formData.buildingFeatures?.parking ? 'Secure Parking' : 'Street Parking' },
      { icon: 'security', label: formData.buildingFeatures?.security ? 'Gated Security' : 'Owner Managed' },
    ],
    rules: [
      { rule: 'Monthly rent due by the 5th of each month', category: 'Payments' },
      { rule: 'Subletting requires owner approval', category: 'Lease' },
    ],
    nearby: {
      essentials: [{ name: 'Daily Needs Store', distance: '0.4 km', time: '5 mins' }],
      utility: [{ name: 'ATM', distance: '0.3 km', time: '4 mins' }],
      transit: { busStations: [{ name: 'Bus Stop', distance: '0.5 km', time: '6 mins' }], airport: [], trainStations: [] },
    },
    noBrokerServices: false,
    views: 0,
    shortlists: 0,
    contacts: 0,
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

export const usePrototypeStore = create<PrototypeState>()(
  persist(
    (set, get) => ({
      ...cloneInitialState(),

      resetPrototypeSession: () => set(cloneInitialState()),

      createOwnerProperty: (ownerId, formData) => {
        const property = createPropertyFromForm(ownerId, formData)
        const listing = createListingFromProperty(property)
        set((state) => ({
          properties: [property, ...state.properties],
          listings: [listing, ...state.listings],
        }))
        return { propertyId: property.id, listingId: listing.id }
      },

      updateOwnerProperty: (propertyId, patch) => {
        const definedPatch = Object.fromEntries(
          Object.entries(patch).filter(([, value]) => value !== undefined),
        ) as Partial<PrototypeProperty>
        set((state) => ({
          properties: state.properties.map((property) =>
            property.id === propertyId ? { ...property, ...definedPatch, updatedAt: nowIso() } : property,
          ),
          listings: state.listings.map((listing) =>
            listing.propertyId === propertyId ? { ...listing, updated: 'Just now', updatedAt: nowIso() } : listing,
          ),
        }))
      },

      setListingStatus: (listingId, status) =>
        set((state) => {
          const listing = state.listings.find((item) => item.id === listingId)
          const timestamp = nowIso()
          if (!listing) return state
          const assignment = state.brokerAssignments.find(
            (item) => item.listingId === listingId && item.status === 'Active',
          )
          const notifications: PrototypeNotification[] = [
            {
              id: createId('notification-listing-owner'),
              userId: listing.ownerId,
              role: 'owner',
              title: `Listing ${status.toLowerCase()}`,
              description: `${listing.id} is now ${status.toLowerCase()} after an admin review.`,
              action: 'view_listing',
              relatedId: listingId,
              unread: true,
              important: status === 'Flagged' || status === 'Removed',
              createdAt: timestamp,
            },
          ]
          if (assignment) {
            notifications.push({
              id: createId('notification-listing-broker'),
              userId: assignment.brokerId,
              role: 'broker',
              title: `Assigned listing ${status.toLowerCase()}`,
              description: `${listing.id} is now ${status.toLowerCase()}.`,
              action: 'view_assignment',
              relatedId: listing.propertyId,
              unread: true,
              important: status === 'Flagged' || status === 'Removed',
              createdAt: timestamp,
            })
          }
          return {
            listings: state.listings.map((item) =>
              item.id === listingId ? { ...item, status, updated: 'Just now', updatedAt: timestamp } : item,
            ),
            notifications: [...notifications, ...state.notifications],
          }
        }),

      assignBroker: (propertyId, brokerId, assignedBy) => {
        const listing = get().listings.find((item) => item.propertyId === propertyId)
        if (!listing) return null
        const existing = get().brokerAssignments.find(
          (assignment) =>
            assignment.propertyId === propertyId &&
            assignment.brokerId === brokerId &&
            assignment.status !== 'Released',
        )
        if (existing) return existing.id

        const timestamp = nowIso()
        const assignment: BrokerAssignment = {
          id: createId('assignment'),
          propertyId,
          listingId: listing.id,
          ownerId: listing.ownerId,
          brokerId,
          assignedBy,
          status: 'Active',
          createdAt: timestamp,
          updatedAt: timestamp,
        }
        set((state) => ({
          brokerAssignments: [
            assignment,
            ...state.brokerAssignments.map((item) =>
              item.propertyId === propertyId && item.status === 'Active'
                ? { ...item, status: 'Released' as const, updatedAt: timestamp }
                : item,
            ),
          ],
          listings: state.listings.map((item) =>
            item.id === listing.id ? { ...item, brokerEnabled: true, updated: 'Just now', updatedAt: timestamp } : item,
          ),
          chats: state.chats.some(
            (thread) =>
              thread.type === 'owner_broker' &&
              thread.propertyId === propertyId &&
              thread.participantIds.includes(brokerId),
          )
            ? state.chats
            : [
                {
                  id: createId('chat-owner-broker'),
                  type: 'owner_broker',
                  participantIds: [listing.ownerId, brokerId],
                  propertyId,
                  listingId: listing.id,
                  messages: [],
                  updatedAt: timestamp,
                },
                ...state.chats,
              ],
          notifications: [
            {
              id: createId('notification-broker-assignment'),
              userId: brokerId,
              role: 'broker',
              title: 'New property assigned',
              description: `${listing.id} is ready for tenant matching.`,
              action: 'view_assignment',
              relatedId: propertyId,
              unread: true,
              important: true,
              createdAt: timestamp,
            },
            {
              id: createId('notification-owner-assignment'),
              userId: listing.ownerId,
              role: 'owner',
              title: 'Broker assigned',
              description: 'An admin assigned a broker to your property.',
              action: 'view_listing',
              relatedId: propertyId,
              unread: true,
              important: false,
              createdAt: timestamp,
            },
            ...state.notifications,
          ],
        }))
        return assignment.id
      },

      removeBrokerAssignment: (propertyId, brokerId) =>
        set((state) => ({
          brokerAssignments: state.brokerAssignments.map((assignment) =>
            assignment.propertyId === propertyId && assignment.brokerId === brokerId
              ? { ...assignment, status: 'Released', updatedAt: nowIso() }
              : assignment,
          ),
        })),

      requestBrokerListingAccess: (brokerId, propertyId) => {
        const listing = get().listings.find((item) => item.propertyId === propertyId)
        if (!listing) return null
        const existing = get().adminRequests.find(
          (request) =>
            request.type === 'broker_listing_access' &&
            request.requesterId === brokerId &&
            request.propertyId === propertyId &&
            request.status === 'Pending',
        )
        if (existing) return existing.id
        const timestamp = nowIso()
        const request: AdminRequest = {
          id: createId('request-access'),
          type: 'broker_listing_access',
          requesterId: brokerId,
          propertyId,
          listingId: listing.id,
          status: 'Pending',
          createdAt: timestamp,
          updatedAt: timestamp,
        }
        set((state) => ({
          adminRequests: [request, ...state.adminRequests],
          notifications: [
            {
              id: createId('notification-admin-request'),
              role: 'admin',
              title: 'Broker listing access requested',
              description: `${brokerId} requested access to ${listing.id}.`,
              action: 'review_broker_request',
              relatedId: request.id,
              unread: true,
              important: false,
              createdAt: timestamp,
            },
            ...state.notifications,
          ],
        }))
        return request.id
      },

      requestBrokerListingRemoval: (brokerId, listingId, reason) => {
        const listing = get().listings.find((item) => item.id === listingId)
        if (!listing) return null
        const existing = get().adminRequests.find(
          (request) =>
            request.type === 'broker_listing_removal' &&
            request.requesterId === brokerId &&
            request.listingId === listingId &&
            request.status === 'Pending',
        )
        if (existing) return existing.id
        const timestamp = nowIso()
        const request: AdminRequest = {
          id: createId('request-removal'),
          type: 'broker_listing_removal',
          requesterId: brokerId,
          propertyId: listing.propertyId,
          listingId,
          reason: reason.trim(),
          status: 'Pending',
          createdAt: timestamp,
          updatedAt: timestamp,
        }
        set((state) => ({
          adminRequests: [request, ...state.adminRequests],
          notifications: [
            {
              id: createId('notification-admin-removal'),
              role: 'admin',
              title: 'Broker listing removal requested',
              description: `${brokerId} requested removal of ${listing.id}.`,
              action: 'review_broker_request',
              relatedId: request.id,
              unread: true,
              important: true,
              createdAt: timestamp,
            },
            ...state.notifications,
          ],
        }))
        return request.id
      },

      decideAdminRequest: (requestId, decision) => {
        const request = get().adminRequests.find((item) => item.id === requestId)
        if (!request) return
        if (decision === 'Approved' && request.type === 'broker_listing_access' && request.propertyId) {
          get().assignBroker(request.propertyId, request.requesterId, 'user-admin-1')
        }
        if (decision === 'Approved' && request.type === 'broker_listing_removal' && request.listingId) {
          get().setListingStatus(request.listingId, 'Removed')
        }
        const timestamp = nowIso()
        set((state) => ({
          adminRequests: state.adminRequests.map((item) =>
            item.id === requestId ? { ...item, status: decision, updatedAt: timestamp } : item,
          ),
          notifications: [
            {
              id: createId('notification-broker-decision'),
              userId: request.requesterId,
              role: 'broker',
              title: `Broker request ${decision.toLowerCase()}`,
              description: `Your ${request.type === 'broker_listing_access' ? 'listing access' : 'listing removal'} request was ${decision.toLowerCase()}.`,
              action: 'view_request',
              relatedId: request.id,
              unread: true,
              important: decision === 'Rejected',
              createdAt: timestamp,
            },
            ...state.notifications,
          ],
        }))
      },
      saveTenantProperty: (tenantId, listingId) =>
        set((state) => {
          const alreadySaved = state.tenantSavedListings.some(
            (item) => item.tenantId === tenantId && item.listingId === listingId,
          )
          if (alreadySaved) return state
          return {
            tenantSavedListings: [
              { tenantId, listingId, savedAt: nowIso() },
              ...state.tenantSavedListings,
            ],
          }
        }),

      unsaveTenantProperty: (tenantId, listingId) =>
        set((state) => ({
          tenantSavedListings: state.tenantSavedListings.filter(
            (item) => item.tenantId !== tenantId || item.listingId !== listingId,
          ),
        })),

      showInterest: (tenantId, listingId) => {
        const listing = get().listings.find((item) => item.id === listingId)
        if (!listing) return null
        const existing = get().applications.find(
          (application) =>
            application.tenantId === tenantId &&
            application.listingId === listingId &&
            application.status !== 'rejected',
        )
        if (existing) return existing.id

        const assignment = get().brokerAssignments.find(
          (item) => item.listingId === listingId && item.status === 'Active',
        )
        const timestamp = nowIso()
        const application: RentalApplication = {
          id: createId('application'),
          tenantId,
          ownerId: listing.ownerId,
          propertyId: listing.propertyId,
          listingId,
          brokerId: assignment?.brokerId,
          status: 'interest_shown',
          agreementVersions: [],
          createdAt: timestamp,
          updatedAt: timestamp,
        }
        set((state) => ({
          applications: [application, ...state.applications],
          chats: assignment && !state.chats.some(
            (thread) =>
              thread.type === 'broker_tenant' &&
              thread.applicationId === application.id,
          )
            ? [
                {
                  id: createId('chat-broker-tenant'),
                  type: 'broker_tenant',
                  participantIds: [assignment.brokerId, tenantId],
                  propertyId: listing.propertyId,
                  listingId,
                  applicationId: application.id,
                  messages: [],
                  updatedAt: timestamp,
                },
                ...state.chats,
              ]
            : state.chats,
          notifications: assignment
            ? [
                {
                  id: createId('notification-broker-lead'),
                  userId: assignment.brokerId,
                  role: 'broker',
                  title: 'New tenant lead',
                  description: `A tenant showed interest in ${listing.id}.`,
                  action: 'view_lead',
                  relatedId: application.id,
                  unread: true,
                  important: true,
                  createdAt: timestamp,
                },
                ...state.notifications,
              ]
            : state.notifications,
        }))
        return application.id
      },

      scheduleVisit: (applicationId, visit) => {
        const application = get().applications.find((item) => item.id === applicationId)
        const timestamp = nowIso()
        set((state) => ({
          applications: updateApplicationStatus(state.applications, applicationId, 'visit_scheduled', {
            scheduledVisit: visit,
          }),
          notifications: application?.brokerId
            ? [
                {
                  id: createId('notification-broker-visit'),
                  userId: application.brokerId,
                  role: 'broker',
                  title: 'Lead scheduled a visit',
                  description: `Visit scheduled for ${visit.date} at ${visit.time}.`,
                  action: 'view_lead',
                  relatedId: application.id,
                  unread: true,
                  important: false,
                  createdAt: timestamp,
                },
                ...state.notifications,
              ]
            : state.notifications,
        }))
      },

      approveTenant: (applicationId) =>
        set((state) => ({
          applications: updateApplicationStatus(state.applications, applicationId, 'owner_approved'),
        })),

      rejectTenant: (applicationId) =>
        set((state) => ({
          applications: updateApplicationStatus(state.applications, applicationId, 'rejected'),
        })),

      sendAgreement: (applicationId, terms) =>
        set((state) => {
          const application = state.applications.find((item) => item.id === applicationId)
          if (!application) return state
          return {
            applications: updateApplicationStatus(state.applications, applicationId, 'agreement_sent', {
              agreementVersions: [
                ...application.agreementVersions,
                {
                  ...terms,
                  id: createId('agreement'),
                  version: application.agreementVersions.length + 1,
                  sentAt: displayDate(),
                },
              ],
            }),
          }
        }),

      requestAgreementChanges: (applicationId, comment) =>
        set((state) => {
          const application = state.applications.find((item) => item.id === applicationId)
          if (!application || application.agreementVersions.length === 0) return state
          const latest = application.agreementVersions[application.agreementVersions.length - 1]!
          return {
            applications: updateApplicationStatus(state.applications, applicationId, 'changes_requested', {
              agreementVersions: application.agreementVersions.map((version) =>
                version.id === latest.id ? { ...version, changeRequest: comment } : version,
              ),
            }),
          }
        }),

      approveAgreement: (applicationId, tenantSignature) =>
        set((state) => {
          const application = state.applications.find((item) => item.id === applicationId)
          if (!application || application.agreementVersions.length === 0) return state
          const latest = application.agreementVersions[application.agreementVersions.length - 1]!
          return {
            applications: updateApplicationStatus(state.applications, applicationId, 'agreement_approved', {
              agreementVersions: application.agreementVersions.map((version) =>
                version.id === latest.id
                  ? { ...version, tenantSignature, tenantApprovedAt: displayDate() }
                  : version,
              ),
            }),
          }
        }),

      completeOnboardingPayment: (applicationId, paymentInput) =>
        set((state) => {
          const application = state.applications.find((item) => item.id === applicationId)
          const property = application
            ? state.properties.find((item) => item.id === application.propertyId)
            : undefined
          if (!application || !property) return state
          const timestamp = nowIso()
          const leaseId = createId('lease')
          const rent = moneyToNumber(property.price)
          const deposit = moneyToNumber(property.deposit)
          const basePayment = {
            applicationId,
            leaseId,
            tenantId: application.tenantId,
            ownerId: application.ownerId,
            propertyId: application.propertyId,
            listingId: application.listingId,
            method: paymentInput.method,
            status: 'Successful' as const,
            flow: 'tenant_to_owner' as const,
            paidAt: displayDate(timestamp),
            paidAtIso: timestamp,
          }
          const payments: PrototypePayment[] = [
            {
              ...basePayment,
              id: createId('payment-rent'),
              category: 'RENT',
              amount: rent,
              amountDisplay: property.price,
              txnId: `RTL-${Date.now()}-RENT`,
              refId: paymentInput.refId || 'ONBOARDING-RENT',
              counterparty: application.ownerId,
              description: `First month rent - ${property.title}`,
            },
            {
              ...basePayment,
              id: createId('payment-deposit'),
              category: 'SECURITY DEPOSIT',
              amount: deposit,
              amountDisplay: property.deposit,
              txnId: `RTL-${Date.now()}-DEP`,
              refId: paymentInput.refId || 'ONBOARDING-DEP',
              counterparty: application.ownerId,
              description: `Security deposit - ${property.title}`,
            },
          ]
          if (application.brokerId) {
            const commission = Math.max(1000, Math.round(rent * 0.02))
            payments.push({
              id: createId('payment-commission'),
              applicationId,
              leaseId,
              ownerId: application.ownerId,
              brokerId: application.brokerId,
              propertyId: application.propertyId,
              listingId: application.listingId,
              category: 'COMMISSION',
              amount: commission,
              amountDisplay: formatRs(commission),
              txnId: `RTL-${Date.now()}-COM`,
              refId: `BROKER-${application.brokerId}`,
              method: 'Platform settlement',
              status: 'Pending',
              flow: 'platform_to_broker',
              counterparty: application.brokerId,
              description: `Broker commission - ${property.title}`,
              paidAt: displayDate(timestamp),
              paidAtIso: timestamp,
            })
          }
          const lease: LeaseRecord = {
            id: leaseId,
            applicationId,
            tenantId: application.tenantId,
            ownerId: application.ownerId,
            propertyId: application.propertyId,
            listingId: application.listingId,
            status: 'pending_owner_onboarding',
            createdAt: timestamp,
            updatedAt: timestamp,
          }
          return {
            applications: updateApplicationStatus(state.applications, applicationId, 'payment_completed'),
            leases: [lease, ...state.leases],
            payments: [...payments, ...state.payments],
            notifications: application.brokerId
              ? [
                  {
                    id: createId('notification-broker-commission'),
                    userId: application.brokerId,
                    role: 'broker',
                    title: 'Commission pending',
                    description: `Commission for ${property.title} will be released after owner onboarding.`,
                    action: 'view_commission',
                    relatedId: applicationId,
                    unread: true,
                    important: false,
                    createdAt: timestamp,
                  },
                  ...state.notifications,
                ]
              : state.notifications,
          }
        }),

      confirmTenantOnboarding: (applicationId) =>
        set((state) => {
          const timestamp = nowIso()
          const application = state.applications.find((item) => item.id === applicationId)
          return {
            applications: updateApplicationStatus(state.applications, applicationId, 'active'),
            payments: state.payments.map((payment) =>
              payment.applicationId === applicationId && payment.category === 'COMMISSION'
                ? { ...payment, status: 'Successful', paidAt: displayDate(timestamp), paidAtIso: timestamp }
                : payment,
            ),
            notifications: application?.brokerId
              ? [
                  {
                    id: createId('notification-broker-commission-paid'),
                    userId: application.brokerId,
                    role: 'broker',
                    title: 'Commission released',
                    description: 'Your broker-assisted lease commission is now successful.',
                    action: 'view_commission',
                    relatedId: applicationId,
                    unread: true,
                    important: true,
                    createdAt: timestamp,
                  },
                  ...state.notifications,
                ]
              : state.notifications,
            leases: state.leases.map((lease) =>
              lease.applicationId === applicationId
                ? {
                    ...lease,
                    status: 'active',
                    activatedAt: displayDate(timestamp),
                    accessKey: `KEY-${lease.propertyId.toUpperCase().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`,
                    updatedAt: timestamp,
                  }
                : lease,
            ),
          }
        }),

      sendChatMessage: (threadId, senderId, text) => {
        const trimmed = text.trim()
        if (!trimmed) return
        const sender = get().users.find((user) => user.id === senderId)
        const timestamp = nowIso()
        const message: ChatMessage = {
          id: createId('chat-message'),
          senderId,
          senderRole: sender?.primaryRole === 'admin' ? 'admin' : sender?.primaryRole === 'broker' ? 'broker' : sender?.primaryRole === 'owner' ? 'owner' : 'tenant',
          text: trimmed,
          time: displayTime(timestamp),
          readBy: [senderId],
          createdAt: timestamp,
        }
        set((state) => ({
          chats: state.chats.map((thread) =>
            thread.id === threadId
              ? { ...thread, messages: [...thread.messages, message], updatedAt: timestamp }
              : thread,
          ),
        }))
      },

      createMaintenanceTicket: (tenantId, leaseId, payload) => {
        const lease = get().leases.find((item) => item.id === leaseId)
        if (!lease) return null
        const timestamp = nowIso()
        const ticket: MaintenanceTicket = {
          id: createId('ticket'),
          ticketNo: `MNT-${Date.now().toString().slice(-5)}`,
          tenantId,
          ownerId: lease.ownerId,
          propertyId: lease.propertyId,
          leaseId,
          category: payload.category,
          priority: payload.priority,
          problem: payload.problem,
          status: 'Open',
          preferredSlot: payload.preferredSlot,
          assignedTo: payload.assignedTo ?? 'Owner team',
          ownerNote: '',
          images: payload.images ?? [],
          messages: [],
          submittedAt: displayDate(timestamp),
          lastUpdated: 'Just now',
          createdAt: timestamp,
          updatedAt: timestamp,
        }
        set((state) => ({ maintenanceTickets: [ticket, ...state.maintenanceTickets] }))
        return ticket.id
      },

      updateMaintenanceTicket: (ticketId, patch) => {
        const definedPatch = Object.fromEntries(
          Object.entries(patch).filter(([, value]) => value !== undefined),
        ) as Partial<MaintenanceTicket>
        set((state) => ({
          maintenanceTickets: state.maintenanceTickets.map((ticket) =>
            ticket.id === ticketId
              ? { ...ticket, ...definedPatch, lastUpdated: 'Just now', updatedAt: nowIso() }
              : ticket,
          ),
        }))
      },

      sendMaintenanceMessage: (ticketId, senderId, text) => {
        const trimmed = text.trim()
        if (!trimmed) return
        const sender = get().users.find((user) => user.id === senderId)
        const timestamp = nowIso()
        set((state) => ({
          maintenanceTickets: state.maintenanceTickets.map((ticket) =>
            ticket.id === ticketId
              ? {
                  ...ticket,
                  lastUpdated: 'Just now',
                  updatedAt: timestamp,
                  messages: [
                    ...ticket.messages,
                    {
                      id: createId('ticket-message'),
                      senderId,
                      senderRole: sender?.primaryRole === 'admin' ? 'admin' : sender?.primaryRole === 'owner' ? 'owner' : 'tenant',
                      text: trimmed,
                      time: displayTime(timestamp),
                      createdAt: timestamp,
                    },
                  ],
                }
              : ticket,
          ),
        }))
      },

      addNotification: (notification) => {
        const timestamp = notification.createdAt ?? nowIso()
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: notification.id ?? createId('notification'),
              createdAt: timestamp,
              unread: notification.unread ?? true,
            },
            ...state.notifications,
          ],
        }))
      },

      markNotificationRead: (notificationId) =>
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === notificationId ? { ...notification, unread: false } : notification,
          ),
        })),

      addPayment: (payment) => {
        const timestamp = payment.paidAtIso ?? nowIso()
        set((state) => ({
          payments: [
            {
              ...payment,
              id: payment.id ?? createId('payment'),
              paidAt: displayDate(timestamp),
              paidAtIso: timestamp,
            },
            ...state.payments,
          ],
        }))
      },

      setPaymentStatus: (paymentId, status) =>
        set((state) => ({
          payments: state.payments.map((payment) =>
            payment.id === paymentId ? { ...payment, status } : payment,
          ),
        })),

      toggleUserStatus: (userId) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === userId
              ? {
                  ...user,
                  status: user.status === 'Active' ? 'Temp Banned' : 'Active',
                  updatedAt: nowIso(),
                }
              : user,
          ),
        })),

      removeUser: (userId) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === userId
              ? { ...user, status: 'Temp Banned', flags: user.flags + 1, updatedAt: nowIso() }
              : user,
          ),
          brokerAssignments: state.brokerAssignments.map((assignment) =>
            assignment.brokerId === userId
              ? { ...assignment, status: 'Released', updatedAt: nowIso() }
              : assignment,
          ),
        })),

      addUser: (user) =>
        set((state) => ({ users: [...state.users, user] })),

      addBroadcast: (audience, title, body) => {
        const timestamp = nowIso()
        const notification: PrototypeNotification = {
          id: createId('broadcast'),
          role: audience === 'all' ? 'all' : (audience.toLowerCase() as PrototypeNotification['role']),
          title,
          description: body,
          action: 'broadcast',
          unread: true,
          important: false,
          createdAt: timestamp,
        }
        set((state) => ({ notifications: [notification, ...state.notifications] }))
      },

      // ── Commission Negotiation ──
      createCommissionNegotiation: (ownerId, propertyId, commission, note) => {
        // Prevent duplicates — only one active negotiation per property per owner
        const existing = get().commissionNegotiations.find(
          (n) => n.ownerId === ownerId && n.propertyId === propertyId && n.status !== 'rejected',
        )
        if (existing) return existing.id

        const timestamp = nowIso()
        const id = createId('negotiation')
        const round: NegotiationRound = { by: 'owner', commission, note, at: timestamp }
        const negotiation: BrokerCommissionNegotiation = {
          id,
          ownerId,
          propertyId,
          status: 'owner_offered',
          rounds: [round],
          brokerOffers: [],
          createdAt: timestamp,
          updatedAt: timestamp,
        }
        set((state) => ({ commissionNegotiations: [negotiation, ...state.commissionNegotiations] }))
        return id
      },

      counterCommissionOffer: (negotiationId, by, commission, note) => {
        const timestamp = nowIso()
        const round: NegotiationRound = { by, commission, note, at: timestamp }
        set((state) => ({
          commissionNegotiations: state.commissionNegotiations.map((n) =>
            n.id === negotiationId
              ? { ...n, status: by === 'admin' ? 'admin_countered' : 'owner_countered', rounds: [...n.rounds, round], updatedAt: timestamp }
              : n,
          ),
        }))
      },

      acceptCommissionOffer: (negotiationId, brokerId) => {
        const timestamp = nowIso()
        set((state) => {
          const negotiation = state.commissionNegotiations.find((n) => n.id === negotiationId)
          const lastRound = negotiation?.rounds[negotiation.rounds.length - 1]
          return {
            commissionNegotiations: state.commissionNegotiations.map((n) =>
              n.id === negotiationId
                ? { ...n, status: 'accepted', acceptedCommission: lastRound?.commission, assignedBrokerId: brokerId, updatedAt: timestamp }
                : n,
            ),
          }
        })
      },

      rejectCommissionNegotiation: (negotiationId) => {
        const timestamp = nowIso()
        set((state) => ({
          commissionNegotiations: state.commissionNegotiations.map((n) =>
            n.id === negotiationId ? { ...n, status: 'rejected', updatedAt: timestamp } : n,
          ),
        }))
      },

      sendBrokerOffer: (negotiationId, brokerId, commission) => {
        const timestamp = nowIso()
        const offer: BrokerOffer = { brokerId, commission, status: 'pending', offeredAt: timestamp }
        set((state) => ({
          commissionNegotiations: state.commissionNegotiations.map((n) =>
            n.id === negotiationId
              ? { ...n, status: 'broker_offered', brokerOffers: [...n.brokerOffers, offer], updatedAt: timestamp }
              : n,
          ),
        }))
      },

      decideBrokerOffer: (negotiationId, brokerId, decision) => {
        const timestamp = nowIso()
        set((state) => {
          const negotiation = state.commissionNegotiations.find((n) => n.id === negotiationId)
          if (!negotiation) return state
          const updatedOffers = negotiation.brokerOffers.map((o) =>
            o.brokerId === brokerId ? { ...o, status: decision, decidedAt: timestamp } : o,
          )
          const accepted = decision === 'accepted'
          const lastRound = negotiation.rounds[negotiation.rounds.length - 1]
          return {
            commissionNegotiations: state.commissionNegotiations.map((n) =>
              n.id === negotiationId
                ? {
                    ...n,
                    brokerOffers: updatedOffers,
                    status: accepted ? 'accepted' : 'broker_rejected',
                    assignedBrokerId: accepted ? brokerId : n.assignedBrokerId,
                    acceptedCommission: accepted ? lastRound?.commission : n.acceptedCommission,
                    updatedAt: timestamp,
                  }
                : n,
            ),
            // If accepted, also create the actual broker assignment
            ...(accepted ? {
              brokerAssignments: [
                {
                  id: createId('assignment'),
                  propertyId: negotiation.propertyId,
                  listingId: state.listings.find((l) => l.propertyId === negotiation.propertyId)?.id ?? '',
                  ownerId: negotiation.ownerId,
                  brokerId,
                  assignedBy: 'user-admin-1',
                  status: 'Active' as const,
                  createdAt: timestamp,
                  updatedAt: timestamp,
                },
                ...state.brokerAssignments,
              ],
            } : {}),
          }
        })
      },
    }),
    {
      name: 'rentilo-prototype-session',
      storage: createJSONStorage(() => sessionStorage),
      version: 1,
    },
  ),
)

export type { PrototypeState }



