import { EnterpriseStatsGrid } from '../components/EnterpriseStatsGrid'
import { Card } from '@shared/ui'

export function EnterpriseDashboard() {
  const stats = { portfolioSize: 56, totalTeamMembers: 12, monthlyRevenue: 1850000, occupancyRate: 92 }
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-heading-1 text-text-primary">Enterprise Dashboard</h1>
        <p className="text-body text-text-muted mt-1">Overview of your property portfolio and team performance.</p>
      </div>
      <EnterpriseStatsGrid {...stats} />
      <Card>
        <h3 className="text-heading-3 text-text-primary mb-4">Recent Activity</h3>
        <p className="text-body text-text-muted">No recent activity to display.</p>
      </Card>
    </div>
  )
}
