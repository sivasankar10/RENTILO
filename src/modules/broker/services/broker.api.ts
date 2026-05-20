import api from '@shared/services/api'
import type { ApiResponse, PaginatedResponse, Property } from '@shared/types'
import type { BrokerDashboardData, BrokerClient, Commission } from '../types'

/** Broker-specific API calls */
export const brokerApi = {
  getDashboard: () =>
    api.get<ApiResponse<BrokerDashboardData>>('/broker/dashboard'),

  getListings: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Property>>('/broker/listings', { params }),

  getClients: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<BrokerClient>>('/broker/clients', { params }),

  getCommissions: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Commission>>('/broker/commissions', { params }),
}
