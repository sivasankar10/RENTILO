import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '@shared/constants/routes'
import { cn } from '@shared/utils/cn'
import { MaterialIcon } from './MaterialIcon'

const AVATAR_SRC =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBsjFwGI8TSSdoEXUZWAE-nRGmK8p1eH8KgYLjT3Urn8_obEczpwXsONy_TGRwKE0xPxoIiwJBviAzhbr8_8hIDA4l_kLNXdDbBX6-QfmRcjzG89x6vzPJXOX37ffQJu6xx0_zNwcREd9vf8PK0Du-IaTWhO6oVo0nqBbRArkk5eIc0SIYI174D3jXGPi3s-g82-4iFdrt9-Rhjwsej9Y7K0PTNiC4gdcsm5cL4dCFxk6wfXLf_ncUSgwvGRPdp_YbPZzioXRLYcnuV'

const MENU_ITEMS = [
  { id: 'profile', label: 'Edit Profile', icon: 'person', href: ROUTES.TENANT.PROFILE },
  { id: 'payments', label: 'Payments', icon: 'payments', href: ROUTES.TENANT.PAYMENTS },
  { id: 'maintenance', label: 'Maintenance', icon: 'build', href: ROUTES.TENANT.MAINTENANCE },
  { id: 'documents', label: 'Documents', icon: 'description', href: ROUTES.TENANT.DOCUMENTS },
] as const

interface TenantProfileMenuProps {
  open: boolean
  onClose: () => void
}

function isProfileSectionActive(pathname: string, id: string): boolean {
  if (id === 'profile') return pathname.includes('/profile')
  if (id === 'payments') return pathname.includes('/payments')
  if (id === 'maintenance') return pathname.includes('/maintenance')
  if (id === 'documents') return pathname.includes('/documents')
  return false
}

export function TenantProfileMenu({ open, onClose }: TenantProfileMenuProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 z-50 flex w-[260px] overflow-hidden rounded-xl border border-brand-outline-variant bg-brand-container-lowest shadow-modal"
      role="menu"
      aria-label="Profile menu"
    >
      <nav className="flex w-full flex-col py-2">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-brand-outline-variant mb-1">
          <img
            src={AVATAR_SRC}
            alt=""
            className="w-10 h-10 rounded-full object-cover border-2 border-brand-container-low"
          />
          <span className="font-body text-sm font-semibold text-brand">My Account</span>
        </div>
        {MENU_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="menuitem"
            className={cn(
              'flex items-center gap-3 px-4 py-3 border-0 bg-transparent text-left font-body text-sm font-semibold tracking-wide cursor-pointer transition-colors',
              isProfileSectionActive(pathname, item.id)
                ? 'bg-brand-container-low text-brand'
                : 'text-brand-outline hover:bg-brand-container-low hover:text-brand'
            )}
            onClick={() => {
              navigate(item.href)
              onClose()
            }}
          >
            <MaterialIcon name={item.icon} className="!text-xl shrink-0" />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

export function isProfileSectionPath(pathname: string): boolean {
  return (
    pathname.includes('/profile') ||
    pathname.includes('/payments') ||
    pathname.includes('/maintenance') ||
    pathname.includes('/documents')
  )
}
