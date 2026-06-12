import alpineExteriorImg from '@/assets/images/alpine_terrace_exterior.png'
import bathImg from '@/assets/images/property_interior_bath.png'
import canaryWharfImg from '@/assets/images/canary_wharf.png'
import greenwichImg from '@/assets/images/greenwich_home.png'
import harborResidencesImg from '@/assets/images/harbor_residences.png'
import locationAerialImg from '@/assets/images/property_location_aerial.png'
import shoreditchImg from '@/assets/images/shoreditch_penthouse.png'
import skylineHeightsImg from '@/assets/images/skyline_heights.png'
import skylinePlazaImg from '@/assets/images/skyline_plaza.png'

export interface BrokerNearbyPlace {
  name: string
  distance: string
  time: string
}

export interface BrokerPropertyTransit {
  busStations: BrokerNearbyPlace[]
  airport: BrokerNearbyPlace[]
  trainStations: BrokerNearbyPlace[]
}

export interface BrokerPropertyNearby {
  transit: BrokerPropertyTransit
  essentials: BrokerNearbyPlace[]
  utility: BrokerNearbyPlace[]
}

export interface BrokerPropertyAmenity {
  icon: string
  label: string
}

export interface BrokerPropertyRule {
  rule: string
  category: string
}

export interface BrokerPropertySpec {
  label: string
  value: string
}

export type BrokerPropertyStatus = 'Active' | 'Pending' | 'Inactive'

export interface BrokerAssignedProperty {
  id: string
  legacyIds?: string[]
  image: string
  gallery: string[]
  type: string
  name: string
  location: string
  fullAddress: string
  value: string
  price: string
  deposit: string
  beds: number
  baths: number
  sqft: string
  ownerName: string
  ownerInitials: string
  ownerBg: string
  status: BrokerPropertyStatus
  leasePercent: number
  leased: boolean
  tenantPreference: string
  furnishing: string
  parking: string
  posted: string
  map: {
    title: string
    coordinates: string
    coverage: string
    commuteNote: string
  }
  overview: string[]
  specs: BrokerPropertySpec[]
  nearby: BrokerPropertyNearby
  amenities: BrokerPropertyAmenity[]
  rules: BrokerPropertyRule[]
}

export const BROKER_ASSIGNED_PROPERTIES: BrokerAssignedProperty[] = [
  {
    id: 'skyline-plaza',
    image: skylinePlazaImg,
    gallery: [skylinePlazaImg, skylineHeightsImg, bathImg, locationAerialImg],
    type: 'Commercial',
    name: 'Skyline Plaza',
    location: 'Financial District, NYC',
    fullAddress: '52 Broad Street, Financial District, New York',
    value: '$42,000,000',
    price: '$7,800/mo',
    deposit: '$15,600',
    beds: 3,
    baths: 3,
    sqft: '2,250',
    ownerName: 'Julian Vane',
    ownerInitials: 'JV',
    ownerBg: '#dbeafe',
    status: 'Active',
    leasePercent: 100,
    leased: true,
    tenantPreference: 'Corporate / Family',
    furnishing: 'Fully Furnished',
    parking: 'Basement Valet',
    posted: 'Posted 2 days ago',
    map: {
      title: 'Financial District Map',
      coordinates: '40.7075, -74.0113',
      coverage: 'Prime tower frontage with two subway lines nearby',
      commuteNote: 'Wall Street Station is 4 mins away on foot.',
    },
    overview: [
      'A premium high-rise residence configured for executive tenants who need fast access to downtown offices, transit, and dining.',
      'The unit has open living space, serviced common areas, and strong tenant demand because of its central business district location.',
    ],
    specs: [
      { label: 'Property Type', value: 'Serviced Apartment' },
      { label: 'Possession', value: 'Immediate' },
      { label: 'Floor', value: '18 / 32' },
      { label: 'Facing', value: 'East' },
      { label: 'Security', value: '24/7 Concierge' },
      { label: 'Water Supply', value: 'Corporation' },
    ],
    nearby: {
      transit: {
        busStations: [
          { name: 'Broad St / Wall St', distance: '0.2 mi', time: '3 mins' },
          { name: 'Water St / Pine St', distance: '0.4 mi', time: '6 mins' },
        ],
        airport: [{ name: 'LaGuardia Airport', distance: '10.1 mi', time: '34 mins' }],
        trainStations: [
          { name: 'Wall Street Station', distance: '0.2 mi', time: '4 mins' },
          { name: 'Fulton Center', distance: '0.6 mi', time: '11 mins' },
        ],
      },
      essentials: [
        { name: 'City Acres Market', distance: '0.3 mi', time: '5 mins' },
        { name: 'Downtown Pharmacy', distance: '0.4 mi', time: '6 mins' },
        { name: 'NewYork-Presbyterian Lower Manhattan', distance: '0.7 mi', time: '12 mins' },
      ],
      utility: [
        { name: 'Chase ATM', distance: '0.1 mi', time: '2 mins' },
        { name: 'Laundry Hub', distance: '0.5 mi', time: '8 mins' },
      ],
    },
    amenities: [
      { icon: 'wifi', label: 'High-Speed WiFi' },
      { icon: 'local_parking', label: 'Valet Parking' },
      { icon: 'fitness_center', label: 'Fitness Studio' },
      { icon: 'security', label: 'Smart Access' },
      { icon: 'elevator', label: 'High-Speed Lift' },
      { icon: 'roofing', label: 'Rooftop Lounge' },
    ],
    rules: [
      { rule: 'Visitors must register with concierge after 9:00 PM', category: 'Security' },
      { rule: 'Quiet hours from 10:00 PM to 7:00 AM', category: 'Community' },
      { rule: 'No smoking inside the unit or common areas', category: 'Health' },
      { rule: 'Rent must be paid through RENTILO approved channels', category: 'Payments' },
    ],
  },
  {
    id: 'harbor-residences',
    image: harborResidencesImg,
    gallery: [harborResidencesImg, skylineHeightsImg, bathImg, locationAerialImg],
    type: 'Mixed-Use',
    name: 'Harbor Residences',
    location: 'Seaport Area, NYC',
    fullAddress: '18 Pierfront Avenue, Seaport Area, New York',
    value: '$68,500,000',
    price: '$6,950/mo',
    deposit: '$13,900',
    beds: 2,
    baths: 2.5,
    sqft: '1,850',
    ownerName: 'Sarah Jenkins',
    ownerInitials: 'SJ',
    ownerBg: '#fce7f3',
    status: 'Active',
    leasePercent: 92,
    leased: false,
    tenantPreference: 'Family / Couple',
    furnishing: 'Semi-Furnished',
    parking: 'Covered Car Park',
    posted: 'Posted 5 days ago',
    map: {
      title: 'Seaport Area Map',
      coordinates: '40.7069, -74.0036',
      coverage: 'Waterfront access with retail and ferry connectivity',
      commuteNote: 'Pier 11 ferry terminal is 7 mins away on foot.',
    },
    overview: [
      'A waterfront residence with strong lifestyle appeal, open-view balconies, and immediate access to Seaport retail.',
      'This property is best positioned for tenants who prefer quieter evenings while still being close to downtown workplaces.',
    ],
    specs: [
      { label: 'Property Type', value: 'Apartment' },
      { label: 'Possession', value: 'Within 15 days' },
      { label: 'Floor', value: '11 / 21' },
      { label: 'Facing', value: 'River View' },
      { label: 'Security', value: 'Gated Lobby' },
      { label: 'Water Supply', value: 'Corporation' },
    ],
    nearby: {
      transit: {
        busStations: [
          { name: 'Water St / Peck Slip', distance: '0.2 mi', time: '4 mins' },
          { name: 'Pearl St / Fulton St', distance: '0.5 mi', time: '8 mins' },
        ],
        airport: [{ name: 'Newark Liberty Airport', distance: '14.6 mi', time: '38 mins' }],
        trainStations: [{ name: 'Fulton Center', distance: '0.8 mi', time: '15 mins' }],
      },
      essentials: [
        { name: 'Tin Building Market', distance: '0.2 mi', time: '4 mins' },
        { name: 'Seaport Pharmacy', distance: '0.5 mi', time: '8 mins' },
        { name: 'Downtown Medical Care', distance: '0.8 mi', time: '14 mins' },
      ],
      utility: [
        { name: 'Citibank ATM', distance: '0.4 mi', time: '7 mins' },
        { name: 'Dry Clean Express', distance: '0.6 mi', time: '10 mins' },
      ],
    },
    amenities: [
      { icon: 'pool', label: 'Lap Pool' },
      { icon: 'deck', label: 'Harbor Deck' },
      { icon: 'local_parking', label: 'Covered Parking' },
      { icon: 'pets', label: 'Pet Zone' },
      { icon: 'fitness_center', label: 'Gym' },
      { icon: 'wifi', label: 'Fiber Internet' },
    ],
    rules: [
      { rule: 'Pets allowed only after owner approval', category: 'Pets' },
      { rule: 'Balcony plants must use drip trays', category: 'Property' },
      { rule: 'Move-in bookings require 48 hours notice', category: 'Operations' },
      { rule: 'Common deck access closes at 10:30 PM', category: 'Amenities' },
    ],
  },
  {
    id: 'canary-wharf',
    legacyIds: ['1'],
    image: canaryWharfImg,
    gallery: [canaryWharfImg, skylineHeightsImg, bathImg, locationAerialImg],
    type: 'Apartment',
    name: 'Canary Wharf',
    location: 'London, UK',
    fullAddress: '31 Meridian Walk, Canary Wharf, London',
    value: '$1,280,000',
    price: '$3,200/mo',
    deposit: '$6,400',
    beds: 2,
    baths: 2,
    sqft: '1,120',
    ownerName: 'James Harrington',
    ownerInitials: 'JH',
    ownerBg: '#dbeafe',
    status: 'Active',
    leasePercent: 96,
    leased: true,
    tenantPreference: 'Professionals',
    furnishing: 'Furnished',
    parking: 'One Car Slot',
    posted: 'Posted 1 week ago',
    map: {
      title: 'Canary Wharf Map',
      coordinates: '51.5054, -0.0235',
      coverage: 'Dockside apartment cluster close to business offices',
      commuteNote: 'Canary Wharf Underground is 6 mins away on foot.',
    },
    overview: [
      'Modern apartment in the Canary Wharf business corridor with quick access to offices, river walks, and daily essentials.',
      'High occupancy potential because the property fits professional tenants looking for a compact, managed rental.',
    ],
    specs: [
      { label: 'Property Type', value: 'Apartment' },
      { label: 'Possession', value: 'Immediate' },
      { label: 'Floor', value: '9 / 18' },
      { label: 'Facing', value: 'South-West' },
      { label: 'Security', value: 'Access Card' },
      { label: 'Water Supply', value: 'Central' },
    ],
    nearby: {
      transit: {
        busStations: [
          { name: 'Canada Square Stop', distance: '0.2 mi', time: '3 mins' },
          { name: 'Westferry Circus', distance: '0.5 mi', time: '8 mins' },
        ],
        airport: [{ name: 'London City Airport', distance: '4.1 mi', time: '18 mins' }],
        trainStations: [
          { name: 'Canary Wharf Underground', distance: '0.3 mi', time: '6 mins' },
          { name: 'Heron Quays DLR', distance: '0.4 mi', time: '7 mins' },
        ],
      },
      essentials: [
        { name: 'Waitrose Canary Wharf', distance: '0.3 mi', time: '5 mins' },
        { name: 'Boots Pharmacy', distance: '0.4 mi', time: '7 mins' },
        { name: 'Docklands Medical Centre', distance: '0.9 mi', time: '15 mins' },
      ],
      utility: [
        { name: 'Barclays ATM', distance: '0.2 mi', time: '3 mins' },
        { name: 'Laundry Republic', distance: '0.6 mi', time: '10 mins' },
      ],
    },
    amenities: [
      { icon: 'wifi', label: 'Fiber WiFi' },
      { icon: 'local_parking', label: 'Car Parking' },
      { icon: 'elevator', label: 'Lift Access' },
      { icon: 'security', label: 'CCTV' },
      { icon: 'fitness_center', label: 'Gym Access' },
      { icon: 'balcony', label: 'Balcony' },
    ],
    rules: [
      { rule: 'No short-term subletting allowed', category: 'Lease' },
      { rule: 'Common-area access cards are non-transferable', category: 'Security' },
      { rule: 'Waste disposal only in designated basement bins', category: 'Community' },
      { rule: 'No drilling without written permission', category: 'Property' },
    ],
  },
  {
    id: 'shoreditch-penthouse',
    legacyIds: ['2'],
    image: shoreditchImg,
    gallery: [shoreditchImg, skylineHeightsImg, bathImg, locationAerialImg],
    type: 'Penthouse',
    name: 'Shoreditch Penthouse',
    location: 'London, UK',
    fullAddress: '8 Artist Lane, Shoreditch, London',
    value: '$1,940,000',
    price: '$4,850/mo',
    deposit: '$9,700',
    beds: 3,
    baths: 2.5,
    sqft: '1,540',
    ownerName: 'Elena Rossi',
    ownerInitials: 'ER',
    ownerBg: '#fce7f3',
    status: 'Active',
    leasePercent: 91,
    leased: false,
    tenantPreference: 'Couple / Creatives',
    furnishing: 'Fully Furnished',
    parking: 'Street Permit',
    posted: 'Posted 3 days ago',
    map: {
      title: 'Shoreditch Map',
      coordinates: '51.5245, -0.0762',
      coverage: 'Creative district location near cafes, studios, and rail',
      commuteNote: 'Shoreditch High Street Station is 5 mins away on foot.',
    },
    overview: [
      'Top-floor penthouse with strong appeal for design-led tenants who want walkable access to Shoreditch cafes and studios.',
      'The property combines premium interiors, rooftop views, and a flexible layout suitable for remote work.',
    ],
    specs: [
      { label: 'Property Type', value: 'Penthouse' },
      { label: 'Possession', value: 'Within 7 days' },
      { label: 'Floor', value: '7 / 7' },
      { label: 'Facing', value: 'City View' },
      { label: 'Security', value: 'Video Door' },
      { label: 'Water Supply', value: 'Central' },
    ],
    nearby: {
      transit: {
        busStations: [
          { name: 'Shoreditch High Street Stop', distance: '0.2 mi', time: '4 mins' },
          { name: 'Great Eastern Street', distance: '0.3 mi', time: '5 mins' },
        ],
        airport: [{ name: 'London City Airport', distance: '6.5 mi', time: '29 mins' }],
        trainStations: [
          { name: 'Shoreditch High Street', distance: '0.2 mi', time: '5 mins' },
          { name: 'Old Street', distance: '0.7 mi', time: '14 mins' },
        ],
      },
      essentials: [
        { name: 'Boxpark Market', distance: '0.2 mi', time: '4 mins' },
        { name: 'NHS Walk-in Clinic', distance: '0.6 mi', time: '11 mins' },
        { name: 'Local Greens Grocery', distance: '0.3 mi', time: '6 mins' },
      ],
      utility: [
        { name: 'HSBC ATM', distance: '0.3 mi', time: '5 mins' },
        { name: 'Parcel Locker', distance: '0.4 mi', time: '7 mins' },
      ],
    },
    amenities: [
      { icon: 'deck', label: 'Private Terrace' },
      { icon: 'wifi', label: 'Fiber Internet' },
      { icon: 'kitchen', label: 'Modular Kitchen' },
      { icon: 'thermostat', label: 'Smart Climate' },
      { icon: 'elevator', label: 'Private Lift' },
      { icon: 'chair', label: 'Designer Furnishing' },
    ],
    rules: [
      { rule: 'Terrace gatherings end by 10:00 PM', category: 'Community' },
      { rule: 'No commercial filming without owner approval', category: 'Lease' },
      { rule: 'Furniture inventory must be confirmed at move-in', category: 'Property' },
      { rule: 'Pets considered only after deposit review', category: 'Pets' },
    ],
  },
  {
    id: 'greenwich-modern-home',
    legacyIds: ['3'],
    image: greenwichImg,
    gallery: [greenwichImg, alpineExteriorImg, bathImg, locationAerialImg],
    type: 'Townhouse',
    name: 'Greenwich Modern Home',
    location: 'London, UK',
    fullAddress: '17 Park Row Lane, Greenwich, London',
    value: '$2,420,000',
    price: '$6,200/mo',
    deposit: '$12,400',
    beds: 4,
    baths: 3.5,
    sqft: '2,460',
    ownerName: 'Arthur Sterling',
    ownerInitials: 'AS',
    ownerBg: '#d1fae5',
    status: 'Active',
    leasePercent: 88,
    leased: false,
    tenantPreference: 'Family',
    furnishing: 'Semi-Furnished',
    parking: 'Two Car Garage',
    posted: 'Posted 6 days ago',
    map: {
      title: 'Greenwich Map',
      coordinates: '51.4826, -0.0077',
      coverage: 'Residential pocket close to parks, schools, and rail',
      commuteNote: 'Greenwich Station is 9 mins away by car.',
    },
    overview: [
      'A large family-focused home with garden access, garage parking, and school proximity in a calmer Greenwich neighborhood.',
      'The listing suits tenants who prioritize space, privacy, and long-term lease stability.',
    ],
    specs: [
      { label: 'Property Type', value: 'Townhouse' },
      { label: 'Possession', value: 'Within 30 days' },
      { label: 'Floor', value: 'Ground + 2' },
      { label: 'Facing', value: 'Garden View' },
      { label: 'Security', value: 'Gated Entry' },
      { label: 'Water Supply', value: 'Central' },
    ],
    nearby: {
      transit: {
        busStations: [
          { name: 'Greenwich Park Gate', distance: '0.3 mi', time: '6 mins' },
          { name: 'Maze Hill Stop', distance: '0.6 mi', time: '11 mins' },
        ],
        airport: [{ name: 'London City Airport', distance: '5.2 mi', time: '22 mins' }],
        trainStations: [
          { name: 'Maze Hill Station', distance: '0.8 mi', time: '15 mins' },
          { name: 'Greenwich Station', distance: '1.4 mi', time: '9 mins drive' },
        ],
      },
      essentials: [
        { name: 'Greenwich Market', distance: '1.0 mi', time: '18 mins' },
        { name: 'Family Health Centre', distance: '0.7 mi', time: '13 mins' },
        { name: 'Riverside Grocery', distance: '0.5 mi', time: '9 mins' },
      ],
      utility: [
        { name: 'NatWest ATM', distance: '0.8 mi', time: '14 mins' },
        { name: 'Greenwich Dry Cleaners', distance: '0.9 mi', time: '16 mins' },
      ],
    },
    amenities: [
      { icon: 'yard', label: 'Private Garden' },
      { icon: 'local_parking', label: 'Two-Car Garage' },
      { icon: 'security', label: 'Gated Entry' },
      { icon: 'pets', label: 'Pet Friendly' },
      { icon: 'kitchen', label: 'Family Kitchen' },
      { icon: 'local_laundry_service', label: 'Laundry Room' },
    ],
    rules: [
      { rule: 'Garden maintenance shared as per lease schedule', category: 'Property' },
      { rule: 'No external facade changes without approval', category: 'Property' },
      { rule: 'Minimum 12-month lease term preferred', category: 'Lease' },
      { rule: 'Garage remote replacement charged to tenant if lost', category: 'Security' },
    ],
  },
]

export function getBrokerPropertyById(id: string | undefined): BrokerAssignedProperty | null {
  if (!id) return null
  return (
    BROKER_ASSIGNED_PROPERTIES.find(
      (property) => property.id === id || property.legacyIds?.includes(id)
    ) ?? null
  )
}
