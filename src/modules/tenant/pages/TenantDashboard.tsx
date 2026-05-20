import { TenantStatsGrid } from '../components/TenantStatsGrid'
import { Card } from '@shared/ui'

export function TenantDashboard() {
  // TODO: Replace with useTenantDashboard() hook once API is ready
  const stats = {
    totalProperties: 3,
    activeLeases: 2,
    pendingPayments: 1,
    maintenanceRequests: 4,
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-heading-1 text-text-primary">Dashboard</h1>
        <p className="text-body text-text-muted mt-1">
          Welcome back! Here's an overview of your rental activity.
        </p>
      </div>

      <TenantStatsGrid {...stats} />

      {/* Recent Activity */}
      <Card>
        <h3 className="text-heading-3 text-text-primary mb-4">Recent Activity</h3>
        <p className="text-body text-text-muted">
          No recent activity to display.
        </p>
      </Card>
    </div>
  )
}
