import { Briefcase, Users, DollarSign, BarChart3 } from 'lucide-react'
import { AnalyticsCard } from '@shared/components'

interface EnterpriseStatsGridProps {
  portfolioSize: number
  totalTeamMembers: number
  monthlyRevenue: number
  occupancyRate: number
}

export function EnterpriseStatsGrid({ portfolioSize, totalTeamMembers, monthlyRevenue, occupancyRate }: EnterpriseStatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <AnalyticsCard label="Portfolio Size" value={portfolioSize} icon={<Briefcase size={24} />} />
      <AnalyticsCard label="Team Members" value={totalTeamMembers} icon={<Users size={24} />} />
      <AnalyticsCard label="Monthly Revenue" value={`₹${monthlyRevenue.toLocaleString()}`} icon={<DollarSign size={24} />} trend={{ value: 18, label: 'vs last month' }} />
      <AnalyticsCard label="Occupancy Rate" value={`${occupancyRate}%`} icon={<BarChart3 size={24} />} trend={{ value: 3, label: 'vs last month' }} />
    </div>
  )
}
