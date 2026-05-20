import { Building2, CreditCard, Wrench, Home } from 'lucide-react'
import { AnalyticsCard } from '@shared/components'

interface TenantStatsGridProps {
  totalProperties: number
  activeLeases: number
  pendingPayments: number
  maintenanceRequests: number
}

export function TenantStatsGrid({
  totalProperties,
  activeLeases,
  pendingPayments,
  maintenanceRequests,
}: TenantStatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <AnalyticsCard
        label="Properties"
        value={totalProperties}
        icon={<Building2 size={24} />}
      />
      <AnalyticsCard
        label="Active Leases"
        value={activeLeases}
        icon={<Home size={24} />}
        trend={{ value: 0, label: 'No change' }}
      />
      <AnalyticsCard
        label="Pending Payments"
        value={pendingPayments}
        icon={<CreditCard size={24} />}
      />
      <AnalyticsCard
        label="Maintenance"
        value={maintenanceRequests}
        icon={<Wrench size={24} />}
      />
    </div>
  )
}
