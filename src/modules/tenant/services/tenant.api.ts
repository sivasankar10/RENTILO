import api from '@shared/services/api'
import type { ApiResponse, PaginatedResponse, Property } from '@shared/types'
import type { TenantDashboardData, MaintenanceRequest, TenantPayment } from '../types'

/** Tenant-specific API calls */
export const tenantApi = {
  getDashboard: () =>
    api.get<ApiResponse<TenantDashboardData>>('/tenant/dashboard'),

  getProperties: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Property>>('/tenant/properties', { params }),

  getPayments: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<TenantPayment>>('/tenant/payments', { params }),

  getMaintenanceRequests: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<MaintenanceRequest>>('/tenant/maintenance', { params }),

  createMaintenanceRequest: (payload: Omit<MaintenanceRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) =>
    api.post<ApiResponse<MaintenanceRequest>>('/tenant/maintenance', payload),
}
