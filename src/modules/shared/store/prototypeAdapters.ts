import type { AdminListing, AdminTransaction, AdminUser } from '@modules/admin/store/adminStore'
import type { BrokerAssignedProperty } from '@modules/broker/constants/assignedProperties'
import type { ChatConversation } from '@modules/tenant/types/chat'
import type { OwnerMaintenanceTicket } from '@modules/owner/store/maintenanceStore'
import type { PlatformPayment } from '@shared/store/paymentsStore'
import type { Property as TenantProperty } from '@modules/tenant/types/property'
import type {
  ChatThread,
  MaintenanceTicket,
  PrototypePayment,
  PrototypeUser,
} from '@shared/types/prototype'
import type { PrototypeListingBundle } from './prototypeSelectors'

function initials(user: Pick<PrototypeUser, 'firstName' | 'lastName'>) {
  return `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function amountType(payment: PrototypePayment): AdminTransaction['type'] {
  if (payment.category === 'COMMISSION') return 'Commission'
  if (payment.category === 'PREMIUM') return 'Subscription'
  return 'Rent'
}

function transactionStatus(payment: PrototypePayment): AdminTransaction['status'] {
  if (payment.status === 'Successful') return 'Success'
  return payment.status
}

export function toTenantProperty(bundle: PrototypeListingBundle): TenantProperty {
  const { listing, property } = bundle
  return {
    id: listing.id,
    title: property.title,
    price: property.price,
    pricePeriod: property.pricePeriod,
    deposit: property.deposit,
    location: `${property.neighborhood}, ${property.city}`,
    beds: property.beds,
    baths: property.baths,
    sqft: property.sqft,
    posted: `Posted ${listing.postedDate}`,
    badge: listing.badge ?? (bundle.brokerAssignment ? 'Recommended' : null),
    image: property.image,
    gallery: property.gallery,
    highlights: property.highlights,
    overviewSpecs: property.overviewSpecs,
    overview: property.overview,
    amenities: property.amenities,
    rules: property.rules,
    nearby: property.nearby,
    noBrokerServices: property.noBrokerServices,
    views: property.views,
    shortlists: property.shortlists,
    contacts: property.contacts,
  }
}

export function toAdminListing(bundle: PrototypeListingBundle): AdminListing {
  const { listing, property, owner } = bundle
  return {
    id: `#${listing.id.toUpperCase()}`,
    slug: slugify(listing.id),
    segment: listing.segment,
    image: property.image,
    propertyTitle: property.title,
    propertyType: property.propertyType,
    owner: `${owner.firstName} ${owner.lastName}`,
    location: `${property.neighborhood}, ${property.city}`,
    rent: property.price,
    status: listing.status,
    postedDate: listing.postedDate,
    updated: listing.updated,
    streetAddress: property.address,
    unit: property.unit,
    postalCode: property.postalCode,
    city: property.city,
    neighborhood: property.neighborhood,
    description: property.description,
    bedrooms: String(property.beds),
    bathrooms: String(property.baths),
    furnishing: property.overviewSpecs.find((spec) => spec.label === 'Furnishing Status')?.value,
    parking: property.highlights.find((item) => item.label === 'Parking')?.value,
    tenantPreference: property.highlights.find((item) => item.label === 'Preferred Tenant')?.value,
    builtUpArea: property.sqft,
    amenities: property.amenities.map((amenity) => amenity.label),
    mediaUrls: property.gallery,
    deposit: property.deposit,
    leaseTerm: `${property.leaseDuration} months`,
    availableFrom: property.availableFrom,
  }
}

export function toBrokerAssignedProperty(bundle: PrototypeListingBundle): BrokerAssignedProperty {
  const { listing, property, owner } = bundle
  const ownerName = `${owner.firstName} ${owner.lastName}`
  return {
    id: property.id,
    legacyIds: [listing.id],
    image: property.image,
    gallery: property.gallery,
    type: property.propertyType,
    name: property.title,
    location: `${property.neighborhood}, ${property.city}`,
    fullAddress: property.address,
    value: property.price,
    price: `${property.price}${property.pricePeriod}`,
    deposit: property.deposit,
    beds: property.beds,
    baths: property.baths,
    sqft: property.sqft,
    ownerId: owner.id,
    ownerName,
    ownerInitials: initials(owner),
    ownerBg: '#dbeafe',
    status: listing.status === 'Active' ? 'Active' : listing.status === 'Paused' ? 'Pending' : 'Inactive',
    leasePercent: 88,
    leased: false,
    tenantPreference: property.highlights.find((item) => item.label === 'Preferred Tenant')?.value ?? 'Anyone',
    furnishing: property.overviewSpecs.find((spec) => spec.label === 'Furnishing Status')?.value ?? 'Semi',
    parking: property.highlights.find((item) => item.label === 'Parking')?.value ?? 'Bike',
    posted: `Posted ${listing.postedDate}`,
    map: {
      title: `${property.neighborhood} Map`,
      coordinates: '12.9716, 77.5946',
      coverage: 'Prototype service area with tenant demand signals',
      commuteNote: 'Transit and daily essentials are nearby.',
    },
    overview: property.overview,
    specs: property.overviewSpecs,
    nearby: property.nearby,
    amenities: property.amenities,
    rules: property.rules,
  }
}

export function toAdminUser(user: PrototypeUser): AdminUser {
  const role: AdminUser['role'] = user.roles.includes('admin')
    ? 'ADMIN'
    : user.roles.includes('owner') && user.roles.includes('tenant')
      ? 'OWNER / TENANT'
      : user.roles.includes('owner')
        ? 'OWNER'
        : user.roles.includes('broker')
          ? 'BROKER'
          : 'TENANT'
  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    avatar: initials(user),
    role,
    kyc: user.kycStatus,
    status: user.status,
    flags: user.flags,
    lastActive: user.lastActive,
  }
}

export function toPlatformPayment(payment: PrototypePayment, users: PrototypeUser[]): PlatformPayment {
  const tenant = payment.tenantId ? users.find((user) => user.id === payment.tenantId) : undefined
  const owner = users.find((user) => user.id === payment.ownerId)
  return {
    id: payment.id,
    onboardingId: payment.applicationId,
    leaseId: payment.leaseId,
    tenantId: payment.tenantId,
    tenantName: tenant ? `${tenant.firstName} ${tenant.lastName}` : undefined,
    ownerId: payment.ownerId,
    ownerName: owner ? `${owner.firstName} ${owner.lastName}` : payment.ownerId,
    propertyId: payment.propertyId,
    propertyName: payment.propertyId,
    category: payment.category === 'COMMISSION' ? 'OTHER' : payment.category,
    amount: payment.amount,
    amountDisplay: payment.amountDisplay,
    txnId: payment.txnId,
    refId: payment.refId,
    method: payment.method,
    status: payment.status === 'Refunded' ? 'Failed' : payment.status,
    flow: payment.flow === 'owner_outgoing' ? 'owner_outgoing' : 'tenant_to_owner',
    counterparty: payment.counterparty,
    paidAt: payment.paidAt,
    paidAtIso: payment.paidAtIso,
    description: payment.description,
  }
}

export function toAdminTransaction(payment: PrototypePayment, users: PrototypeUser[]): AdminTransaction {
  const user = payment.tenantId
    ? users.find((item) => item.id === payment.tenantId)
    : users.find((item) => item.id === payment.ownerId)
  const name = user ? `${user.firstName} ${user.lastName}` : 'Session User'
  return {
    id: `#${payment.txnId}`,
    user: name,
    userInitials: user ? initials(user) : 'SU',
    avatarColor: 'bg-blue-500',
    type: amountType(payment),
    amount: payment.amountDisplay,
    status: transactionStatus(payment),
    date: payment.paidAt,
  }
}

export function toOwnerMaintenanceTicket(
  ticket: MaintenanceTicket,
  users: PrototypeUser[],
  propertyTitle: string,
): OwnerMaintenanceTicket {
  const tenant = users.find((user) => user.id === ticket.tenantId)
  return {
    id: ticket.id,
    ticketNo: ticket.ticketNo,
    propertyId: ticket.propertyId,
    tenantId: ticket.tenantId,
    leaseId: ticket.leaseId,
    tenantName: tenant ? `${tenant.firstName} ${tenant.lastName}` : ticket.tenantId,
    tenantPhone: tenant?.phone ?? '',
    tenantAvatar: tenant?.avatar ?? '',
    unit: propertyTitle,
    category: ticket.category,
    priority: ticket.priority,
    problem: ticket.problem,
    status: ticket.status,
    submittedAt: ticket.submittedAt,
    preferredSlot: ticket.preferredSlot,
    assignedTo: ticket.assignedTo,
    lastUpdated: ticket.lastUpdated,
    ownerNote: ticket.ownerNote,
    images: ticket.images,
    messages: ticket.messages.map((message) => ({
      id: message.id,
      sender: message.senderRole === 'tenant' ? 'tenant' : 'owner',
      text: message.text,
      time: message.time,
    })),
  }
}

export function toChatConversation(
  thread: ChatThread,
  currentUserId: string,
  users: PrototypeUser[],
  propertyTitle = 'Prototype Property',
  propertyImage = '',
): ChatConversation {
  const contactId = thread.participantIds.find((id) => id !== currentUserId) ?? currentUserId
  const contact = users.find((user) => user.id === contactId)
  const latest = thread.messages[thread.messages.length - 1]
  return {
    id: thread.id,
    contactName: contact ? `${contact.firstName} ${contact.lastName}` : 'Session Contact',
    contactRole: contact?.primaryRole === 'tenant' || contact?.primaryRole === 'owner' || contact?.primaryRole === 'broker' ? contact.primaryRole : undefined,
    avatar: contact?.avatar ?? '',
    lastMessage: latest?.text ?? 'Conversation started',
    timeLabel: latest?.time ?? 'Now',
    unreadCount: 0,
    online: true,
    propertyTitle,
    propertySubtitle: propertyTitle,
    propertyLocation: 'Session listing',
    propertyPrice: '',
    propertyImage,
    messages: thread.messages.map((message) => ({
      id: message.id,
      sender:
        message.senderRole === 'admin'
          ? 'owner'
          : message.senderRole,
      text: message.text,
      time: message.time,
      read: message.readBy.includes(currentUserId),
    })),
  }
}

