import { Outlet, useLocation } from 'react-router-dom'
import { TenantHeader } from '@modules/tenant/components/TenantHeader'

export function TenantBrowseLayout() {
  const { pathname } = useLocation()
  const isProfile = pathname.includes('/profile')
  const isListings = pathname.includes('/listings')

  return (
    <div className="min-h-screen flex flex-col bg-brand-background font-body text-brand-on-surface">
      <TenantHeader
        extendedNav={isListings || isProfile}
        showMembershipIcon={isProfile}
        profileActive={isProfile}
      />
      <Outlet />
    </div>
  )
}
