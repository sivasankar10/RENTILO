import { Outlet } from 'react-router-dom'
import { TenantHeader } from '@modules/tenant/components/TenantHeader'

export function TenantBrowseLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-background font-body text-brand-on-surface">
      <TenantHeader />
      <Outlet />
    </div>
  )
}
