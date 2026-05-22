/** Centralized route path constants for all modules */

export const ROUTES = {
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
  },

  // Owner
  OWNER: {
    ROOT: '/owner',
    DASHBOARD: '/owner/dashboard',
    PROPERTIES: '/owner/properties',
    TENANTS: '/owner/tenants',
    ANALYTICS: '/owner/analytics',
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
