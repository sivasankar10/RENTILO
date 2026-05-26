import type { UserRole } from '../constants/roles'

/** Base API response wrapper */
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

/** Paginated API response */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/** Authenticated user */
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  /** All roles this account may use (RBAC membership) */
  roles: UserRole[]
  /** Default role when logging in or when activeRole is unset */
  primaryRole?: UserRole
  avatar?: string
  phone?: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

/** Property listing */
export interface Property {
  id: string
  title: string
  description: string
  address: string
  city: string
  state: string
  zipCode: string
  price: number
  currency: string
  type: 'apartment' | 'house' | 'commercial' | 'villa' | 'studio'
  status: 'available' | 'rented' | 'maintenance' | 'unlisted'
  bedrooms: number
  bathrooms: number
  area: number
  areaUnit: 'sqft' | 'sqm'
  images: string[]
  amenities: string[]
  ownerId: string
  createdAt: string
  updatedAt: string
}

/** Navigation item for sidebar/navbar */
export interface NavItem {
  label: string
  href: string
  icon: string
  badge?: string | number
}

/** Status variant for badges */
export type StatusVariant = 'success' | 'warning' | 'error' | 'info' | 'default'
