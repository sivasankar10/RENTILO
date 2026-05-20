import { useQuery } from '@tanstack/react-query'
import { tenantApi } from '../services/tenant.api'

export function useTenantDashboard() {
  return useQuery({
    queryKey: ['tenant', 'dashboard'],
    queryFn: () => tenantApi.getDashboard(),
    select: (response) => response.data.data,
  })
}
