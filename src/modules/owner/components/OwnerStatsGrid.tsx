import { Building2, Users, DollarSign, BarChart3 } from 'lucide-react'
import { AnalyticsCard } from '@shared/components'

interface OwnerStatsGridProps {
  totalProperties: number
  totalTenants: number
  monthlyRevenue: number
  occupancyRate: number
}

export function OwnerStatsGrid({
  totalProperties,
  totalTenants,
  monthlyRevenue,
  occupancyRate,
}: OwnerStatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <AnalyticsCard
        label="Total Properties"
        value={totalProperties}
        icon={<Building2 size={24} />}
      />
      <AnalyticsCard
        label="Total Tenants"
        value={totalTenants}
        icon={<Users size={24} />}
        trend={{ value: 12, label: 'vs last month' }}
      />
      <AnalyticsCard
        label="Monthly Revenue"
        value={`₹${monthlyRevenue.toLocaleString()}`}
        icon={<DollarSign size={24} />}
        trend={{ value: 8, label: 'vs last month' }}
      />
      <AnalyticsCard
        label="Occupancy Rate"
        value={`${occupancyRate}%`}
        icon={<BarChart3 size={24} />}
      />
    </div>
  )
}
