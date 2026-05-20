import { useQuery } from '@tanstack/react-query'
import { ownerApi } from '../services/owner.api'

export function useOwnerDashboard() {
  return useQuery({
    queryKey: ['owner', 'dashboard'],
    queryFn: () => ownerApi.getDashboard(),
    select: (response) => response.data.data,
  })
}
