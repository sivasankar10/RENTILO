import { BrokerStatsGrid } from '../components/BrokerStatsGrid'
import { Card } from '@shared/ui'

export function BrokerDashboard() {
  const stats = { totalListings: 24, activeClients: 18, totalCommission: 180000, closedDeals: 7 }
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-heading-1 text-text-primary">Broker Dashboard</h1>
        <p className="text-body text-text-muted mt-1">Track your listings, clients, and commissions.</p>
      </div>
      <BrokerStatsGrid {...stats} />
      <Card>
        <h3 className="text-heading-3 text-text-primary mb-4">Recent Activity</h3>
        <p className="text-body text-text-muted">No recent activity to display.</p>
      </Card>
    </div>
  )
}
