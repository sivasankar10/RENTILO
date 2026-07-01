import axios from 'axios'
import { env } from '@/config/env'

/**
 * Central Axios instance with token interceptors.
 * All module-level API services should use this instance.
 */
const api = axios.create({
  baseURL: env.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// ── Request Interceptor: Attach Bearer token ──
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('rentilo_token') ?? localStorage.getItem('rentilo_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response Interceptor: Handle 401 ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('rentilo_token')
      sessionStorage.removeItem('rentilo_user')
      localStorage.removeItem('rentilo_token')
      localStorage.removeItem('rentilo_user')
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

export default api
