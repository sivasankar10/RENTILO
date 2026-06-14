import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '@shared/constants/routes'
import { cn } from '@shared/utils/cn'
import { useSavedPropertiesStore } from '../store/savedPropertiesStore'
import { RoleModeSwitcher } from '@shared/components/RoleModeSwitcher'
import { MaterialIcon } from './MaterialIcon'
import { isProfileSectionPath, TenantProfileMenu } from './TenantProfileMenu'

const AVATAR_SRC =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBsjFwGI8TSSdoEXUZWAE-nRGmK8p1eH8KgYLjT3Urn8_obEczpwXsONy_TGRwKE0xPxoIiwJBviAzhbr8_8hIDA4l_kLNXdDbBX6-QfmRcjzG89x6vzPJXOX37ffQJu6xx0_zNwcREd9vf8PK0Du-IaTWhO6oVo0nqBbRArkk5eIc0SIYI174D3jXGPi3s-g82-4iFdrt9-Rhjwsej9Y7K0PTNiC4gdcsm5cL4dCFxk6wfXLf_ncUSgwvGRPdp_YbPZzioXRLYcnuV'

export function TenantHeader() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const savedPropertyIds = useSavedPropertiesStore((s) => s.savedPropertyIds)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  const profileActive = isProfileSectionPath(pathname)
  const notificationsActive = pathname.includes('/notifications')
  const messagesActive = pathname.includes('/messages')
  const badgeActive = pathname.includes('/serious-buyer-badge')

  return (
    <header className="sticky top-0 z-50 bg-brand-surface">
      <div className="flex justify-between items-center w-full max-w-tenant mx-auto px-8 py-4">
        <button
          type="button"
          className="border-0 bg-transparent p-0 font-display text-2xl font-black tracking-tight text-brand cursor-pointer hover:opacity-80"
          onClick={() => navigate(ROUTES.TENANT.DASHBOARD)}
          aria-label="Go to tenant dashboard"
        >
          RENTILO
        </button>

        <div className="flex items-center gap-4 md:gap-6">
          <RoleModeSwitcher className="hidden sm:inline-flex" />
          <button
            type="button"
            className={cn(
              'flex items-center justify-center w-9 h-9 rounded-lg border-0 cursor-pointer transition-opacity hover:opacity-85',
              badgeActive ? 'bg-brand-gold text-white' : 'bg-brand-gold/20 text-brand-gold'
            )}
            aria-label="Serious Buyer Badge"
            aria-current={badgeActive ? 'page' : undefined}
            onClick={() => navigate(ROUTES.TENANT.SERIOUS_BUYER_BADGE)}
          >
            <MaterialIcon name="shield" filled className="!text-[22px]" />
          </button>
          <button
            type="button"
            className="flex items-center justify-center p-1 border-0 bg-transparent text-brand cursor-pointer hover:opacity-70 active:scale-95 transition-all"
            aria-label="Notifications"
            aria-current={notificationsActive ? 'page' : undefined}
            onClick={() => navigate(ROUTES.TENANT.NOTIFICATIONS)}
          >
            <MaterialIcon name="notifications" filled={notificationsActive} />
          </button>
          <button
            type="button"
            className="flex items-center justify-center p-1 border-0 bg-transparent text-brand cursor-pointer hover:opacity-70 active:scale-95 transition-all"
            aria-label="Messages"
            aria-current={messagesActive ? 'page' : undefined}
            onClick={() => navigate(ROUTES.TENANT.MESSAGES)}
          >
            <MaterialIcon name="chat" filled={messagesActive} />
          </button>
          <button
            type="button"
            className="relative flex items-center justify-center p-1 border-0 bg-transparent text-brand cursor-pointer hover:opacity-70 active:scale-95 transition-all"
            aria-label="Saved properties"
            onClick={() => navigate(ROUTES.TENANT.SAVED)}
          >
            <MaterialIcon name="favorite" filled={savedPropertyIds.length > 0} />
            {savedPropertyIds.length > 0 && (
              <span className="absolute top-0 right-0 min-w-4 h-4 px-1 rounded-lg bg-brand-favorite text-white text-[10px] font-bold leading-4 text-center">
                {savedPropertyIds.length}
              </span>
            )}
          </button>

          <div className="relative">
            <button
              type="button"
              className="p-0 border-0 bg-transparent cursor-pointer rounded-full leading-none"
              onClick={() => setProfileMenuOpen((prev) => !prev)}
              aria-label="Account menu"
              aria-expanded={profileMenuOpen}
              aria-haspopup="menu"
            >
              <img
                className={cn(
                  'w-10 h-10 rounded-full object-cover border-2 border-brand-container-low transition-shadow',
                  (profileActive || profileMenuOpen) &&
                    'border-brand shadow-[0_0_0_2px] shadow-brand-verified'
                )}
                src={AVATAR_SRC}
                alt="Tenant profile"
              />
            </button>
            <TenantProfileMenu open={profileMenuOpen} onClose={() => setProfileMenuOpen(false)} />
          </div>
        </div>
      </div>
      <div className="w-full h-px bg-brand-container-low" />
    </header>
  )
}
