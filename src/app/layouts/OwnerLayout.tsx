import { DashboardLayout } from './DashboardLayout'
import { ROUTES } from '@shared/constants/routes'
import type { NavItem } from '@shared/types'

const ownerNavItems: NavItem[] = [
  { label: 'Dashboard', href: ROUTES.OWNER.DASHBOARD, icon: 'LayoutDashboard' },
  { label: 'My Properties', href: ROUTES.OWNER.PROPERTIES, icon: 'Building2' },
  { label: 'Tenants', href: ROUTES.OWNER.TENANTS, icon: 'Users' },
  { label: 'Analytics', href: ROUTES.OWNER.ANALYTICS, icon: 'BarChart3' },
]

export function OwnerLayout() {
  return <DashboardLayout navItems={ownerNavItems} roleLabel="Property Owner" />
}
