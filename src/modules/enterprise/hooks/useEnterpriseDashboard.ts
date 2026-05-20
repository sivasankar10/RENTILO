import { useQuery } from '@tanstack/react-query'
import { enterpriseApi } from '../services/enterprise.api'

export function useEnterpriseDashboard() {
  return useQuery({
    queryKey: ['enterprise', 'dashboard'],
    queryFn: () => enterpriseApi.getDashboard(),
    select: (response) => response.data.data,
  })
}
