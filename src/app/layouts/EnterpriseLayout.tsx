import { DashboardLayout } from './DashboardLayout'
import { ROUTES } from '@shared/constants/routes'
import type { NavItem } from '@shared/types'

const enterpriseNavItems: NavItem[] = [
  { label: 'Dashboard', href: ROUTES.ENTERPRISE.DASHBOARD, icon: 'LayoutDashboard' },
  { label: 'Portfolio', href: ROUTES.ENTERPRISE.PORTFOLIO, icon: 'Briefcase' },
  { label: 'Teams', href: ROUTES.ENTERPRISE.TEAMS, icon: 'Users' },
  { label: 'Reports', href: ROUTES.ENTERPRISE.REPORTS, icon: 'FileBarChart' },
]

export function EnterpriseLayout() {
  return <DashboardLayout navItems={enterpriseNavItems} roleLabel="Enterprise" />
}
