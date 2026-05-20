import { DashboardLayout } from './DashboardLayout'
import { ROUTES } from '@shared/constants/routes'
import type { NavItem } from '@shared/types'

const brokerNavItems: NavItem[] = [
  { label: 'Dashboard', href: ROUTES.BROKER.DASHBOARD, icon: 'LayoutDashboard' },
  { label: 'Listings', href: ROUTES.BROKER.LISTINGS, icon: 'List' },
  { label: 'Clients', href: ROUTES.BROKER.CLIENTS, icon: 'Users' },
  { label: 'Commission', href: ROUTES.BROKER.COMMISSION, icon: 'Banknote' },
]

export function BrokerLayout() {
  return <DashboardLayout navItems={brokerNavItems} roleLabel="Broker" />
}
