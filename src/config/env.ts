/** Environment configuration accessor */

export const env = {
  /** Base URL for all API requests */
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',

  /** Application name */
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Rentilo',

  /** Current environment */
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const
