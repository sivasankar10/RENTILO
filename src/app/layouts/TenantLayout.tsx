import { DashboardLayout } from './DashboardLayout'
import { ROUTES } from '@shared/constants/routes'
import type { NavItem } from '@shared/types'

const tenantNavItems: NavItem[] = [
  { label: 'Dashboard', href: ROUTES.TENANT.DASHBOARD, icon: 'LayoutDashboard' },
  { label: 'Properties', href: ROUTES.TENANT.PROPERTIES, icon: 'Building2' },
  { label: 'Payments', href: ROUTES.TENANT.PAYMENTS, icon: 'CreditCard' },
  { label: 'Maintenance', href: ROUTES.TENANT.MAINTENANCE, icon: 'Wrench' },
]

export function TenantLayout() {
  return <DashboardLayout navItems={tenantNavItems} roleLabel="Tenant" />
}
