import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '@shared/constants/routes'
import { cn } from '@shared/utils/cn'
import { useSavedPropertiesStore } from '../store/savedPropertiesStore'
import { topbarNavLink } from '../utils/tenantStyles'
import { MaterialIcon } from './MaterialIcon'

const AVATAR_SRC =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBsjFwGI8TSSdoEXUZWAE-nRGmK8p1eH8KgYLjT3Urn8_obEczpwXsONy_TGRwKE0xPxoIiwJBviAzhbr8_8hIDA4l_kLNXdDbBX6-QfmRcjzG89x6vzPJXOX37ffQJu6xx0_zNwcREd9vf8PK0Du-IaTWhO6oVo0nqBbRArkk5eIc0SIYI174D3jXGPi3s-g82-4iFdrt9-Rhjwsej9Y7K0PTNiC4gdcsm5cL4dCFxk6wfXLf_ncUSgwvGRPdp_YbPZzioXRLYcnuV'

function resolveActiveNav(pathname: string): string {
  if (pathname.includes('/saved')) return 'saved'
  if (pathname.includes('/profile')) return 'profile'
  if (/\/properties\/[^/]+$/.test(pathname)) return 'properties'
  if (pathname.includes('/listings')) return 'properties'
  if (
    pathname.includes('/dashboard') ||
    pathname.includes('/payments') ||
    pathname.includes('/maintenance') ||
    pathname.endsWith('/properties')
  ) {
    return 'myTenancy'
  }
  return 'properties'
}

interface TenantHeaderProps {
  extendedNav?: boolean
  showMembershipIcon?: boolean
  profileActive?: boolean
}

export function TenantHeader({
  extendedNav = true,
  showMembershipIcon = false,
  profileActive = false,
}: TenantHeaderProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const savedPropertyIds = useSavedPropertiesStore((s) => s.savedPropertyIds)
  const activeNav = useMemo(() => resolveActiveNav(pathname), [pathname])

  const go = (path: string) => () => navigate(path)

  return (
    <header className="sticky top-0 z-50 bg-brand-surface">
      <div className="flex justify-between items-center w-full max-w-tenant mx-auto px-8 py-4">
        <div className="flex items-center gap-12">
          <div
            className="font-display text-2xl font-black text-brand tracking-tight cursor-pointer"
            onClick={go(ROUTES.TENANT.LISTINGS)}
            role="presentation"
          >
            RENTILO
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <button
              type="button"
              className={topbarNavLink(activeNav === 'properties')}
              onClick={go(ROUTES.TENANT.LISTINGS)}
            >
              Properties
            </button>
            <button
              type="button"
              className={topbarNavLink(activeNav === 'saved')}
              onClick={go(ROUTES.TENANT.SAVED)}
            >
              Saved
            </button>
            <button
              type="button"
              className={topbarNavLink(activeNav === 'myTenancy')}
              onClick={go(ROUTES.TENANT.DASHBOARD)}
            >
              My Tenancy
            </button>
            {extendedNav && (
              <>
                <button
                  type="button"
                  className={topbarNavLink(pathname.includes('/payments'))}
                  onClick={go(ROUTES.TENANT.PAYMENTS)}
                >
                  Payments
                </button>
                <button
                  type="button"
                  className={topbarNavLink(pathname.includes('/maintenance'))}
                  onClick={go(ROUTES.TENANT.MAINTENANCE)}
                >
                  Maintenance
                </button>
              </>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-6">
          {showMembershipIcon && (
            <button
              type="button"
              className="flex items-center justify-center p-1 border-0 bg-transparent text-brand-membership cursor-pointer hover:opacity-70"
              aria-label="Membership"
            >
              <MaterialIcon name="workspace_premium" filled />
            </button>
          )}
          <button
            type="button"
            className="flex items-center justify-center p-1 border-0 bg-transparent text-brand cursor-pointer hover:opacity-70 active:scale-95 transition-all"
            aria-label="Notifications"
          >
            <MaterialIcon name="notifications" />
          </button>
          <button
            type="button"
            className="flex items-center justify-center p-1 border-0 bg-transparent text-brand cursor-pointer hover:opacity-70 active:scale-95 transition-all"
            aria-label="Messages"
          >
            <MaterialIcon name="chat" />
          </button>
          <button
            type="button"
            className={cn(
              'relative flex items-center justify-center p-1 border-0 bg-transparent cursor-pointer hover:opacity-70 active:scale-95 transition-all',
              activeNav === 'saved' && 'text-brand-favorite'
            )}
            aria-label="Saved properties"
            onClick={go(ROUTES.TENANT.SAVED)}
          >
            <MaterialIcon name="favorite" filled={savedPropertyIds.length > 0} />
            {savedPropertyIds.length > 0 && (
              <span className="absolute top-0 right-0 min-w-4 h-4 px-1 rounded-lg bg-brand-favorite text-white text-[10px] font-bold leading-4 text-center">
                {savedPropertyIds.length}
              </span>
            )}
          </button>
          <button
            type="button"
            className="p-0 border-0 bg-transparent cursor-pointer rounded-full leading-none"
            onClick={go(ROUTES.TENANT.PROFILE)}
            aria-label="Edit profile"
          >
            <img
              className={cn(
                'w-10 h-10 rounded-full object-cover border-2 border-brand-container-low transition-shadow',
                profileActive && 'border-brand shadow-[0_0_0_2px] shadow-brand-verified'
              )}
              src={AVATAR_SRC}
              alt="Tenant profile"
            />
          </button>
        </div>
      </div>
      <div className="w-full h-px bg-brand-container-low" />
    </header>
  )
}
