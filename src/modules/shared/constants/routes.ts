/** Centralized route path constants for all modules */

export const ROUTES = {
  HOME: '/',

  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },

  // Tenant
  TENANT: {
    ROOT: '/tenant',
    DASHBOARD: '/tenant/dashboard',
    LISTINGS: '/tenant/listings',
    PROPERTY: (id: string) => `/tenant/properties/${id}`,
    SAVED: '/tenant/saved',
    PROFILE: '/tenant/profile',
    PROPERTIES: '/tenant/properties',
    PAYMENTS: '/tenant/payments',
    MAINTENANCE: '/tenant/maintenance',
    DOCUMENTS: '/tenant/documents',
    NOTIFICATIONS: '/tenant/notifications',
    MESSAGES: '/tenant/messages',
    SERIOUS_BUYER_BADGE: '/tenant/serious-buyer-badge',
    SERIOUS_BUYER_PAYMENT: '/tenant/serious-buyer-badge/payment',
  },

  // Owner
  OWNER: {
    ROOT: '/owner',
    DASHBOARD: '/owner/dashboard',
    PORTFOLIO: '/owner/portfolio',
    PROPERTY_DETAIL: (id: string) => `/owner/properties/${id}`,
    PROPERTIES: '/owner/properties',
    REGISTER_PROPERTY: '/owner/properties/register',
    MAINTENANCE: '/owner/maintenance',
    LEASES: '/owner/leases',
    TENANTS: '/owner/tenants',
    ANALYTICS: '/owner/analytics',
    PLANS_RULES: '/owner/plans-rules',
    PREMIUM_PAYMENT: '/owner/premium-payment',
    SETTINGS: '/owner/settings',
    NOTIFICATIONS: '/owner/notifications',
    MESSAGES: '/owner/messages',
  },

  // Broker
  BROKER: {
    ROOT: '/broker',
    DASHBOARD: '/broker/dashboard',
    PORTFOLIO: '/broker/portfolio',
    PROPERTY: (id: string) => `/broker/portfolio/${id}`,
    ASSIGNED_PROPERTIES: '/broker/assigned-properties',
    LISTINGS: '/broker/listings',
    CLIENTS: '/broker/clients',
    COMMISSION: '/broker/commission',
    ANALYTICS: '/broker/analytics',
    MESSAGES: '/broker/messages',
    NOTIFICATIONS: '/broker/notifications',
    SETTINGS: '/broker/settings',
    PROFILE: '/broker/profile',
    EDIT_PROFILE: '/broker/profile/edit',
  },

  // Enterprise
  ENTERPRISE: {
    ROOT: '/enterprise',
    DASHBOARD: '/enterprise/dashboard',
    PORTFOLIO: '/enterprise/portfolio',
    TEAMS: '/enterprise/teams',
    REPORTS: '/enterprise/reports',
  },

  // Admin
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    BROKER_MANAGEMENT: '/admin/broker-management',
    LISTING_MANAGEMENT: '/admin/listing-management',
    USER_MANAGEMENT: '/admin/user-management',
    FINANCE_PAYMENTS: '/admin/finance-payments',
    PLATFORM_CONFIGURATION: '/admin/platform-configuration',
    ASSIGNMENT_MANAGEMENT: '/admin/assignment-management',
    MAINTENANCE_TICKETS: '/admin/maintenance-tickets',
    NOTIFICATIONS: '/admin/notifications',
    PROPERTY_OVERVIEW: '/admin/property-overview',
  },
} as const
