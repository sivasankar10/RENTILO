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
  },

  // Owner
  OWNER: {
    ROOT: '/owner',
    DASHBOARD: '/owner/dashboard',
    PORTFOLIO: '/owner/portfolio',
    PROPERTIES: '/owner/properties',
    TENANTS: '/owner/tenants',
    ANALYTICS: '/owner/analytics',
    PLANS_RULES: '/owner/plans-rules',
    SETTINGS: '/owner/settings',
    NOTIFICATIONS: '/owner/notifications',
    MESSAGES: '/owner/messages',
  },

  // Broker
  BROKER: {
    ROOT: '/broker',
    DASHBOARD: '/broker/dashboard',
    LISTINGS: '/broker/listings',
    CLIENTS: '/broker/clients',
    COMMISSION: '/broker/commission',
  },

  // Enterprise
  ENTERPRISE: {
    ROOT: '/enterprise',
    DASHBOARD: '/enterprise/dashboard',
    PORTFOLIO: '/enterprise/portfolio',
    TEAMS: '/enterprise/teams',
    REPORTS: '/enterprise/reports',
  },
} as const
