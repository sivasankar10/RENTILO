import { useAuth } from '@shared/hooks/useAuth'
import { usePrototypeStore } from '@shared/store/prototypeStore'
import { TenantStatsGrid } from '../components/TenantStatsGrid'
import { Card } from '@shared/ui'

export function TenantDashboard() {
  const { user } = useAuth()
  const tenantId = user?.id ?? ''
  const applications = usePrototypeStore((state) => state.applications.filter((item) => item.tenantId === tenantId))
  const leases = usePrototypeStore((state) => state.leases.filter((item) => item.tenantId === tenantId))
  const payments = usePrototypeStore((state) => state.payments.filter((item) => item.tenantId === tenantId))
  const tickets = usePrototypeStore((state) => state.maintenanceTickets.filter((item) => item.tenantId === tenantId))
  const notifications = usePrototypeStore((state) => state.notifications.filter((item) => item.userId === tenantId && item.unread))

  const stats = {
    totalProperties: new Set(leases.map((lease) => lease.propertyId)).size,
    activeLeases: leases.filter((lease) => lease.status === 'active').length,
    pendingPayments: applications.filter((application) => application.status === 'agreement_approved').length,
    maintenanceRequests: tickets.filter((ticket) => !['Resolved', 'Closed'].includes(ticket.status)).length,
  }

  return (
    <div className="space-y-8 text-text-primary">
      <div>
        <h1 className="text-heading-1 text-text-primary">Dashboard</h1>
        <p className="mt-1 text-body text-text-muted">Your current session activity across applications, leases, payments, and maintenance.</p>
      </div>
      <TenantStatsGrid {...stats} />
      <Card>
        <h3 className="mb-4 text-heading-3 text-text-primary">Recent Activity</h3>
        {notifications.length ? (
          <div className="space-y-3">
            {notifications.slice(0, 4).map((notification) => (
              <div key={notification.id} className="border-b border-outline pb-3 last:border-0 last:pb-0">
                <p className="text-body font-semibold text-text-primary">{notification.title}</p>
                <p className="mt-1 text-label text-text-muted">{notification.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-body text-text-muted">No unread activity in this session.</p>
        )}
      </Card>
      {payments.length > 0 && <p className="text-label text-text-muted">{payments.length} payment record{payments.length === 1 ? '' : 's'} stored for this session.</p>}
    </div>
  )
}
