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
    PAYMENT_RECEIPT: (id: string) => `/tenant/payments/${encodeURIComponent(id)}`,
    MAINTENANCE: '/tenant/maintenance',
    MAINTENANCE_DETAIL: (id: string) => `/tenant/maintenance/${encodeURIComponent(id)}`,
    DOCUMENTS: '/tenant/documents',
    AGREEMENT: (id: string) => `/tenant/agreements/${id}`,
    ONBOARDING_PAYMENT: (id: string) => `/tenant/onboarding/${id}/payment`,
    MY_LEASE: '/tenant/my-lease',
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
    PROPERTY_EDIT: (id: string) => `/owner/properties/${id}/edit`,
    PROPERTIES: '/owner/properties',
    REGISTER_PROPERTY: '/owner/properties/register',
    MAINTENANCE: '/owner/maintenance',
    LEASES: '/owner/leases',
    LEASE_DOCUMENTS: (onboardingId: string) => `/owner/leases/${encodeURIComponent(onboardingId)}/documents`,
    TENANTS: '/owner/tenants',
    ANALYTICS: '/owner/analytics',
    PLANS_RULES: '/owner/plans-rules',
    PREMIUM_PAYMENT: '/owner/premium-payment',
    LISTING_PROMOTION_PAYMENT: (propertyId: string) =>
      `/owner/portfolio/promote/${encodeURIComponent(propertyId)}/payment`,
    PAYMENTS: '/owner/payments',
    PAYMENT_RECEIPT: (id: string) => `/owner/payments/${encodeURIComponent(id)}`,
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
    PAYMENT_RECEIPT: (id: string) => `/admin/finance-payments/receipt/${encodeURIComponent(id.replace(/^#/, ''))}`,
    PLATFORM_CONFIGURATION: '/admin/platform-configuration',
    ASSIGNMENT_MANAGEMENT: '/admin/assignment-management',
    MAINTENANCE_TICKETS: '/admin/maintenance-tickets',
    NOTIFICATIONS: '/admin/notifications',
    MESSAGES: '/admin/messages',
  },
} as const



