export interface PropertyHighlight {
  label: string
  value: string
}

export interface OverviewSpec {
  label: string
  value: string
}

export interface PropertyRule {
  rule: string
  category: string
}

export interface NearbyPlace {
  name: string
  distance: string
  time: string
}

export interface PropertyTransit {
  busStations: NearbyPlace[]
  airport: NearbyPlace[]
  trainStations: NearbyPlace[]
}

export interface PropertyNearby {
  essentials: NearbyPlace[]
  utility: NearbyPlace[]
  transit: PropertyTransit
}

export interface PropertyAmenity {
  icon: string
  label: string
}

export interface Property {
  id: string
  title: string
  price: string
  pricePeriod: string
  deposit: string
  location: string
  beds: number
  baths: number
  sqft: string
  posted: string
  badge: string | null
  noticePeriod?: string
  leaseDuration?: number
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
}
