import { useQuery } from '@tanstack/react-query'
import { brokerApi } from '../services/broker.api'

export function useBrokerDashboard() {
  return useQuery({
    queryKey: ['broker', 'dashboard'],
    queryFn: () => brokerApi.getDashboard(),
    select: (response) => response.data.data,
  })
}
