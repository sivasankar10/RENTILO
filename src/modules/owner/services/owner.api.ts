import api from '@shared/services/api'
import type { ApiResponse, PaginatedResponse, Property } from '@shared/types'
import type { OwnerDashboardData } from '../types'

/** Owner-specific API calls */
export const ownerApi = {
  getDashboard: () =>
    api.get<ApiResponse<OwnerDashboardData>>('/owner/dashboard'),

  getProperties: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Property>>('/owner/properties', { params }),

  createProperty: (payload: Partial<Property>) =>
    api.post<ApiResponse<Property>>('/owner/properties', payload),

  updateProperty: (id: string, payload: Partial<Property>) =>
    api.put<ApiResponse<Property>>(`/owner/properties/${id}`, payload),

  deleteProperty: (id: string) =>
    api.delete(`/owner/properties/${id}`),

  getTenants: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<{ id: string; name: string; property: string; since: string }>>('/owner/tenants', { params }),

  getAnalytics: (params?: { period?: string }) =>
    api.get<ApiResponse<Record<string, unknown>>>('/owner/analytics', { params }),
}
