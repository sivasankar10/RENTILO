import type { UserRole } from '@shared/constants/roles'
import type {
  BrokerAssignment,
  ChatThread,
  PrototypeListing,
  PrototypeNotification,
  PrototypeProperty,
  PrototypeStateData,
  PrototypeUser,
} from '@shared/types/prototype'

export const PROTOTYPE_OTP = '123456'

export const PROTOTYPE_USER_IDS = {
  tenant1: 'user-tenant-1',
  tenant2: 'user-tenant-2',
  multiPropertyOwner: 'user-owner-multi',
  owner1: 'user-owner-1',
  owner2: 'user-owner-2',
  broker1: 'user-broker-1',
  broker2: 'user-broker-2',
  admin1: 'user-admin-1',
  tenantOwner: 'user-tenant-owner',
} as const

export const PROTOTYPE_PROPERTY_IDS = {
  multi1: 'property-multi-1',
  multi2: 'property-multi-2',
  owner1: 'property-owner-1',
  owner2: 'property-owner-2',
  tenantOwner1: 'property-tenant-owner-1',
} as const

export const PROTOTYPE_LISTING_IDS = {
  multi1: 'listing-multi-1',
  multi2: 'listing-multi-2',
  owner1: 'listing-owner-1',
  owner2: 'listing-owner-2',
  tenantOwner1: 'listing-tenant-owner-1',
} as const

const seedNow = '2026-06-30T09:00:00.000Z'

const avatars = {
  tenant1: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
  tenant2: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
  owner: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=160&q=80',
  owner1: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80',
  owner2: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80',
  broker1: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&q=80',
  broker2: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
  admin: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=160&q=80',
}

function createUser(input: {
  id: string
  accountName: PrototypeUser['accountName']
  phone: string
  firstName: string
  lastName: string
  roles: UserRole[]
  primaryRole?: UserRole
  avatar?: string
  kycStatus?: PrototypeUser['kycStatus']
}): PrototypeUser {
  return {
    id: input.id,
    accountName: input.accountName,
    phone: input.phone,
    email: `${input.accountName.toLowerCase()}@rentilo.test`,
    firstName: input.firstName,
    lastName: input.lastName,
    roles: input.roles,
    primaryRole: input.primaryRole ?? input.roles[0]!,
    avatar: input.avatar,
    kycStatus: input.kycStatus ?? 'Verified',
    status: 'Active',
    flags: 0,
    lastActive: 'Just now',
    createdAt: seedNow,
    updatedAt: seedNow,
  }
}

const nearby = {
  essentials: [
    { name: 'Fresh Mart Grocery', distance: '0.4 km', time: '5 mins' },
    { name: 'City Pharmacy', distance: '0.5 km', time: '6 mins' },
    { name: 'Apollo Clinic', distance: '1.2 km', time: '14 mins' },
  ],
  utility: [
    { name: 'HDFC ATM', distance: '0.3 km', time: '4 mins' },
    { name: 'Power Substation', distance: '0.8 km', time: '10 mins' },
  ],
  transit: {
    busStations: [
      { name: 'Main Road Bus Stop', distance: '0.6 km', time: '7 mins' },
      { name: 'Metro Feeder Stop', distance: '0.7 km', time: '9 mins' },
    ],
    airport: [{ name: 'City Airport', distance: '18 km', time: '35 mins' }],
    trainStations: [{ name: 'Metro Station', distance: '1.4 km', time: '17 mins' }],
  },
}

function createProperty(input: {
  id: string
  ownerId: string
  title: string
  propertyType: string
  address: string
  unit: string
  city: string
  neighborhood: string
  price: string
  deposit: string
  beds: number
  baths: number
  sqft: string
  image: string
  tenantPreference: string
  furnishing: string
  parking: string
  badge?: string | null
}): PrototypeProperty {
  const highlights = [
    { label: 'No. of Bedroom', value: `${input.beds} Bedroom` },
    { label: 'Property Type', value: input.propertyType },
    { label: 'Preferred Tenant', value: input.tenantPreference },
    { label: 'Possession', value: 'Immediately' },
    { label: 'Parking', value: input.parking },
    { label: 'Age of Building', value: '3-5 Years' },
    { label: 'Balcony', value: 'Yes' },
    { label: 'Posted On', value: 'Jun 30, 2026' },
  ]

  return {
    id: input.id,
    ownerId: input.ownerId,
    title: input.title,
    propertyType: input.propertyType,
    description: `${input.title} is a session-prototype listing with verified owner details, visit scheduling, agreement flow, and cross-role visibility.`,
    address: input.address,
    unit: input.unit,
    postalCode: '560001',
    city: input.city,
    neighborhood: input.neighborhood,
    price: input.price,
    pricePeriod: '/ mo',
    deposit: input.deposit,
    beds: input.beds,
    baths: input.baths,
    sqft: input.sqft,
    availableFrom: '2026-07-15',
    visitWeekday: 'Saturday',
    visitStartTime: '10:00 AM',
    visitEndTime: '1:00 PM',
    leaseDuration: 12,
    noticePeriod: '30',
    image: input.image,
    gallery: [
      input.image,
      'https://images.unsplash.com/photo-1556912173-46c336c7fd55?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80',
    ],
    highlights,
    overviewSpecs: [
      { label: 'Furnishing Status', value: input.furnishing },
      { label: 'Facing', value: 'East' },
      { label: 'Water Supply', value: 'Corporation' },
      { label: 'Floor', value: '4/12' },
      { label: 'Bathroom', value: String(input.baths) },
      { label: 'Pet Allowed', value: 'Yes' },
      { label: 'Non-Veg Allowed', value: 'Yes' },
      { label: 'Gated Security', value: 'Yes' },
    ],
    overview: [
      `${input.title} is designed for fast prototype demos across tenant, owner, broker, and admin roles.`,
      'The listing includes realistic media, amenities, rules, nearby places, and enough metadata for filters and details pages.',
      'All actions are stored in the current browser session and can be reset without touching a backend.',
    ],
    amenities: [
      { icon: 'wifi', label: 'High-Speed WiFi' },
      { icon: 'local_parking', label: input.parking },
      { icon: 'security', label: 'Gated Security' },
      { icon: 'fitness_center', label: 'Fitness Center' },
    ],
    rules: [
      { rule: 'No smoking inside the unit or common areas', category: 'Health & Safety' },
      { rule: 'Monthly rent due by the 5th of each month', category: 'Payments' },
      { rule: 'Visitors must register after 9:00 PM', category: 'Security' },
      { rule: 'Subletting requires owner approval', category: 'Lease' },
    ],
    nearby,
    noBrokerServices: true,
    views: 124,
    shortlists: 18,
    contacts: 5,
    createdAt: seedNow,
    updatedAt: seedNow,
  }
}

function createListing(
  id: string,
  propertyId: string,
  ownerId: string,
  badge: string | null = null,
): PrototypeListing {
  return {
    id,
    propertyId,
    ownerId,
    segment: 'non-enterprise',
    status: 'Active',
    postedDate: '30 Jun 2026',
    updated: 'Just now',
    badge,
    brokerEnabled: true,
    createdAt: seedNow,
    updatedAt: seedNow,
  }
}

export const prototypeUsers: PrototypeUser[] = [
  createUser({
    id: PROTOTYPE_USER_IDS.tenant1,
    accountName: 'Tenant1',
    phone: '9000001001',
    firstName: 'Tenant',
    lastName: 'One',
    roles: ['tenant'],
    avatar: avatars.tenant1,
    kycStatus: 'Pending',
  }),
  createUser({
    id: PROTOTYPE_USER_IDS.tenant2,
    accountName: 'Tenant2',
    phone: '9000001002',
    firstName: 'Tenant',
    lastName: 'Two',
    roles: ['tenant'],
    avatar: avatars.tenant2,
  }),
  createUser({
    id: PROTOTYPE_USER_IDS.multiPropertyOwner,
    accountName: 'MultiPropertyOwner',
    phone: '9000002001',
    firstName: 'MultiProperty',
    lastName: 'Owner',
    roles: ['owner'],
    primaryRole: 'owner',
    avatar: avatars.owner,
  }),
  createUser({
    id: PROTOTYPE_USER_IDS.owner1,
    accountName: 'Owner1',
    phone: '9000002002',
    firstName: 'Owner',
    lastName: 'One',
    roles: ['owner'],
    avatar: avatars.owner1,
  }),
  createUser({
    id: PROTOTYPE_USER_IDS.owner2,
    accountName: 'Owner2',
    phone: '9000002003',
    firstName: 'Owner',
    lastName: 'Two',
    roles: ['owner'],
    avatar: avatars.owner2,
  }),
  createUser({
    id: PROTOTYPE_USER_IDS.broker1,
    accountName: 'Broker1',
    phone: '9000003001',
    firstName: 'Broker',
    lastName: 'One',
    roles: ['broker'],
    avatar: avatars.broker1,
  }),
  createUser({
    id: PROTOTYPE_USER_IDS.broker2,
    accountName: 'Broker2',
    phone: '9000003002',
    firstName: 'Broker',
    lastName: 'Two',
    roles: ['broker'],
    avatar: avatars.broker2,
  }),
  createUser({
    id: PROTOTYPE_USER_IDS.admin1,
    accountName: 'Admin1',
    phone: '9000009001',
    firstName: 'Admin',
    lastName: 'One',
    roles: ['admin'],
    avatar: avatars.admin,
  }),
  createUser({
    id: PROTOTYPE_USER_IDS.tenantOwner,
    accountName: 'TenantOwner',
    phone: '9000004001',
    firstName: 'Tenant',
    lastName: 'Owner',
    roles: ['tenant', 'owner'],
    primaryRole: 'tenant',
    avatar: avatars.tenant1,
  }),
]

export const prototypeProperties: PrototypeProperty[] = [
  createProperty({
    id: PROTOTYPE_PROPERTY_IDS.multi1,
    ownerId: PROTOTYPE_USER_IDS.multiPropertyOwner,
    title: 'MultiOwner Skyline 14B',
    propertyType: 'Apartment',
    address: '14B Skyline Plaza, Indiranagar',
    unit: '14B',
    city: 'Bangalore',
    neighborhood: 'Indiranagar',
    price: 'Rs. 85,000',
    deposit: 'Rs. 1,70,000',
    beds: 2,
    baths: 2,
    sqft: '1,240',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    tenantPreference: 'Family / Couple',
    furnishing: 'Semi-Furnished',
    parking: 'Bike and Car',
    badge: 'Recommended',
  }),
  createProperty({
    id: PROTOTYPE_PROPERTY_IDS.multi2,
    ownerId: PROTOTYPE_USER_IDS.multiPropertyOwner,
    title: 'MultiOwner Garden Villa',
    propertyType: 'Villa',
    address: '22 Garden Avenue, Whitefield',
    unit: 'Villa 22',
    city: 'Bangalore',
    neighborhood: 'Whitefield',
    price: 'Rs. 1,20,000',
    deposit: 'Rs. 2,40,000',
    beds: 4,
    baths: 3,
    sqft: '2,900',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    tenantPreference: 'Family',
    furnishing: 'Fully Furnished',
    parking: 'Two Car Slots',
  }),
  createProperty({
    id: PROTOTYPE_PROPERTY_IDS.owner1,
    ownerId: PROTOTYPE_USER_IDS.owner1,
    title: 'Owner1 Lakeview Studio',
    propertyType: 'Studio',
    address: '5 Lakeview Road, HSR Layout',
    unit: 'Studio 5',
    city: 'Bangalore',
    neighborhood: 'HSR Layout',
    price: 'Rs. 32,000',
    deposit: 'Rs. 64,000',
    beds: 1,
    baths: 1,
    sqft: '620',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    tenantPreference: 'Bachelors / Singles',
    furnishing: 'Furnished',
    parking: 'Bike',
  }),
  createProperty({
    id: PROTOTYPE_PROPERTY_IDS.owner2,
    ownerId: PROTOTYPE_USER_IDS.owner2,
    title: 'Owner2 Parkside Home',
    propertyType: 'Apartment',
    address: '8 Parkside Lane, Koramangala',
    unit: '8C',
    city: 'Bangalore',
    neighborhood: 'Koramangala',
    price: 'Rs. 58,000',
    deposit: 'Rs. 1,16,000',
    beds: 3,
    baths: 2,
    sqft: '1,520',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
    tenantPreference: 'Family',
    furnishing: 'Semi-Furnished',
    parking: 'Car',
  }),
  createProperty({
    id: PROTOTYPE_PROPERTY_IDS.tenantOwner1,
    ownerId: PROTOTYPE_USER_IDS.tenantOwner,
    title: 'TenantOwner Compact Loft',
    propertyType: 'Loft',
    address: '3 Loft Street, JP Nagar',
    unit: '3A',
    city: 'Bangalore',
    neighborhood: 'JP Nagar',
    price: 'Rs. 42,000',
    deposit: 'Rs. 84,000',
    beds: 1,
    baths: 1,
    sqft: '780',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
    tenantPreference: 'Couples / Singles',
    furnishing: 'Unfurnished',
    parking: 'Bike',
  }),
]

export const prototypeListings: PrototypeListing[] = [
  createListing(PROTOTYPE_LISTING_IDS.multi1, PROTOTYPE_PROPERTY_IDS.multi1, PROTOTYPE_USER_IDS.multiPropertyOwner, 'Recommended'),
  createListing(PROTOTYPE_LISTING_IDS.multi2, PROTOTYPE_PROPERTY_IDS.multi2, PROTOTYPE_USER_IDS.multiPropertyOwner),
  createListing(PROTOTYPE_LISTING_IDS.owner1, PROTOTYPE_PROPERTY_IDS.owner1, PROTOTYPE_USER_IDS.owner1),
  createListing(PROTOTYPE_LISTING_IDS.owner2, PROTOTYPE_PROPERTY_IDS.owner2, PROTOTYPE_USER_IDS.owner2),
  createListing(PROTOTYPE_LISTING_IDS.tenantOwner1, PROTOTYPE_PROPERTY_IDS.tenantOwner1, PROTOTYPE_USER_IDS.tenantOwner),
]

export const prototypeBrokerAssignments: BrokerAssignment[] = [
  {
    id: 'assignment-broker1-multi1',
    propertyId: PROTOTYPE_PROPERTY_IDS.multi1,
    listingId: PROTOTYPE_LISTING_IDS.multi1,
    ownerId: PROTOTYPE_USER_IDS.multiPropertyOwner,
    brokerId: PROTOTYPE_USER_IDS.broker1,
    assignedBy: PROTOTYPE_USER_IDS.admin1,
    status: 'Active',
    createdAt: seedNow,
    updatedAt: seedNow,
  },
]

export const prototypeChats: ChatThread[] = [
  {
    id: 'chat-owner-broker-multi1',
    type: 'owner_broker',
    participantIds: [PROTOTYPE_USER_IDS.multiPropertyOwner, PROTOTYPE_USER_IDS.broker1],
    propertyId: PROTOTYPE_PROPERTY_IDS.multi1,
    listingId: PROTOTYPE_LISTING_IDS.multi1,
    messages: [
      {
        id: 'chat-message-owner-broker-1',
        senderId: PROTOTYPE_USER_IDS.broker1,
        senderRole: 'broker',
        text: 'Broker1 is ready to start tenant matching for MultiOwner Skyline 14B.',
        time: '10:15 AM',
        readBy: [PROTOTYPE_USER_IDS.broker1],
        createdAt: seedNow,
      },
    ],
    updatedAt: seedNow,
  },
]

export const prototypeNotifications: PrototypeNotification[] = [
  {
    id: 'notification-broker-assignment-1',
    userId: PROTOTYPE_USER_IDS.broker1,
    role: 'broker',
    title: 'New property assigned',
    description: 'MultiOwner Skyline 14B is ready for tenant matching.',
    action: 'view_assignment',
    relatedId: PROTOTYPE_PROPERTY_IDS.multi1,
    unread: true,
    important: false,
    createdAt: seedNow,
  },
]

export const initialPrototypeState: PrototypeStateData = {
  users: prototypeUsers,
  properties: prototypeProperties,
  listings: prototypeListings,
  brokerAssignments: prototypeBrokerAssignments,
  tenantSavedListings: [],
  applications: [],
  leases: [],
  payments: [],
  chats: prototypeChats,
  maintenanceTickets: [],
  notifications: prototypeNotifications,
  adminRequests: [],
}




