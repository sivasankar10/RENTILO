import api from '@shared/services/api'
import type { ApiResponse, PaginatedResponse, Property } from '@shared/types'
import type { EnterpriseDashboardData, TeamMember, EnterpriseReport } from '../types'

/** Enterprise-specific API calls */
export const enterpriseApi = {
  getDashboard: () =>
    api.get<ApiResponse<EnterpriseDashboardData>>('/enterprise/dashboard'),

  getPortfolio: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Property>>('/enterprise/portfolio', { params }),

  getTeam: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<TeamMember>>('/enterprise/team', { params }),

  addTeamMember: (payload: Partial<TeamMember>) =>
    api.post<ApiResponse<TeamMember>>('/enterprise/team', payload),

  getReports: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<EnterpriseReport>>('/enterprise/reports', { params }),

  generateReport: (type: string) =>
    api.post<ApiResponse<EnterpriseReport>>('/enterprise/reports/generate', { type }),
}
