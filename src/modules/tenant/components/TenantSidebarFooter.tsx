import { useNavigate } from 'react-router-dom'
import { useAuth } from '@shared/hooks/useAuth'
import { ROUTES } from '@shared/constants/routes'
import { MaterialIcon } from './MaterialIcon'

interface TenantSidebarFooterProps {
  className?: string
}

export function TenantSidebarFooter({ className = '' }: TenantSidebarFooterProps) {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate(ROUTES.AUTH.LOGIN)
  }

  return (
    <div className={`flex flex-col gap-4 pt-4 border-t border-brand-outline-variant ${className}`}>
      <button
        type="button"
        className="flex items-center justify-center gap-2 w-full py-3.5 px-5 rounded-[10px] border-0 bg-brand text-white font-body text-sm font-semibold cursor-pointer hover:opacity-92 transition-opacity"
      >
        <MaterialIcon name="help" className="!text-xl" />
        Help Center
      </button>
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-2 border-0 bg-transparent px-1 py-2 font-body text-xs font-bold tracking-widest text-brand-outline cursor-pointer hover:text-brand transition-colors"
      >
        <MaterialIcon name="logout" className="!text-lg" />
        LOG OUT
      </button>
    </div>
  )
}
