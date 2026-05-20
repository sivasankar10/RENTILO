import { List, Users, Banknote, TrendingUp } from 'lucide-react'
import { AnalyticsCard } from '@shared/components'

interface BrokerStatsGridProps {
  totalListings: number
  activeClients: number
  totalCommission: number
  closedDeals: number
}

export function BrokerStatsGrid({ totalListings, activeClients, totalCommission, closedDeals }: BrokerStatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <AnalyticsCard label="Total Listings" value={totalListings} icon={<List size={24} />} />
      <AnalyticsCard label="Active Clients" value={activeClients} icon={<Users size={24} />} trend={{ value: 5, label: 'this month' }} />
      <AnalyticsCard label="Total Commission" value={`₹${totalCommission.toLocaleString()}`} icon={<Banknote size={24} />} trend={{ value: 15, label: 'vs last month' }} />
      <AnalyticsCard label="Closed Deals" value={closedDeals} icon={<TrendingUp size={24} />} />
    </div>
  )
}
