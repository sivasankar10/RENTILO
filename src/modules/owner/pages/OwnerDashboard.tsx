import { OwnerStatsGrid } from '../components/OwnerStatsGrid'
import { Card } from '@shared/ui'

export function OwnerDashboard() {
  const stats = {
    totalProperties: 12,
    totalTenants: 9,
    monthlyRevenue: 245000,
    occupancyRate: 85,
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-heading-1 text-text-primary">Owner Dashboard</h1>
        <p className="text-body text-text-muted mt-1">
          Manage your properties and track your rental income.
        </p>
      </div>
      <OwnerStatsGrid {...stats} />
      <Card>
        <h3 className="text-heading-3 text-text-primary mb-4">Recent Activity</h3>
        <p className="text-body text-text-muted">No recent activity to display.</p>
      </Card>
    </div>
  )
}
