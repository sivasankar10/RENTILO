import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Bell, Briefcase, CreditCard, Heart, LayoutGrid, LogOut, MessageSquare, Settings, UserCheck, Users } from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { useAuth } from '@shared/hooks/useAuth'
import { usePrototypeStore } from '@shared/store/prototypeStore'
import { cn } from '@shared/utils/cn'
import { useState, useMemo } from 'react'

const sidebarItems = [
  { label: 'Dashboard', href: ROUTES.ENTERPRISE.DASHBOARD, icon: LayoutGrid },
  { label: 'Portfolio', href: ROUTES.ENTERPRISE.PORTFOLIO, icon: Briefcase },
  { label: 'Team', href: ROUTES.ENTERPRISE.TEAMS, icon: Users },
  { label: 'Brokers', href: `${ROUTES.ENTERPRISE.ROOT}/brokers`, icon: UserCheck },
  { label: 'Finance', href: `${ROUTES.ENTERPRISE.ROOT}/finance`, icon: CreditCard },
  { label: 'Tenants', href: `${ROUTES.ENTERPRISE.ROOT}/tenants`, icon: Users },
]

export function EnterpriseLayout() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const allProperties = usePrototypeStore((s) => s.properties)

  // Enterprise blocks (properties owned by this enterprise user)
  const enterpriseBlocks = useMemo(
    () => allProperties.filter((p) => p.ownerId === user?.id && p.enterpriseBlock),
    [allProperties, user?.id],
  )
  const [selectedBlockId, setSelectedBlockId] = useState('')
  const currentBlockId = enterpriseBlocks.some((b) => b.id === selectedBlockId)
    ? selectedBlockId
    : enterpriseBlocks[0]?.id ?? ''

  const handleLogout = () => {
    logout()
    navigate(ROUTES.AUTH.LOGIN)
  }

  return (
    <div className="min-h-screen bg-canvas-alt font-manrope">
      {/* Top Navbar */}
      <header className="fixed inset-x-0 top-0 z-40 h-14 border-b border-outline bg-white flex items-center px-6">
        <span className="font-display text-xl font-black tracking-tight text-[#0f172a]">RENTILO</span>
        <div className="ml-auto flex items-center gap-3">
          <NavLink to={`${ROUTES.ENTERPRISE.ROOT}/notifications`} className="p-2 rounded-lg text-text-muted hover:bg-hover-light"><Bell size={18} /></NavLink>
          <button className="p-2 rounded-lg text-text-muted hover:bg-hover-light"><Heart size={18} /></button>
          <NavLink to={`${ROUTES.ENTERPRISE.ROOT}/messages`} className="p-2 rounded-lg text-text-muted hover:bg-hover-light"><MessageSquare size={18} /></NavLink>
          <div className="h-9 w-9 rounded-full bg-navy overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-[11px] font-bold text-white">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="fixed top-14 left-0 bottom-0 w-[180px] border-r border-outline bg-white flex flex-col z-30">
        {/* Block Switcher */}
        {enterpriseBlocks.length > 0 && (
          <div className="px-3 pt-4 pb-2 border-b border-outline">
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1 mb-2">Active Block</p>
            <select
              value={currentBlockId}
              onChange={(e) => setSelectedBlockId(e.target.value)}
              className="w-full rounded-lg border border-outline bg-white px-3 py-2 text-[12px] font-bold text-[#0f172a] outline-none focus:border-primary"
            >
              {enterpriseBlocks.map((block) => (
                <option key={block.id} value={block.id}>{block.enterpriseBlock?.blockName ? `Block ${block.enterpriseBlock.blockName}` : block.title}</option>
              ))}
            </select>
          </div>
        )}

        <nav className="flex-1 px-3 py-4 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) => cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition-colors border-l-3',
                  isActive
                    ? 'border-primary text-primary bg-primary-50/50'
                    : 'border-transparent text-text-muted hover:bg-hover-light hover:text-text-primary'
                )}
              >
                <Icon size={17} />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 pb-4 space-y-2">
          <NavLink to={`${ROUTES.ENTERPRISE.ROOT}/notifications`} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold text-text-muted hover:bg-hover-light">
            <Settings size={17} /> Settings
          </NavLink>
          <button className="w-full rounded-xl bg-primary px-4 py-2.5 text-[12px] font-bold text-white text-center">
            ⓘ Help Center
          </button>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[13px] font-semibold text-text-muted hover:bg-hover-light">
            <LogOut size={17} /> LOG OUT
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pt-14 pl-[180px]">
        <div className="p-6">
          <Outlet context={{ currentBlockId, enterpriseBlocks }} />
        </div>
      </main>
    </div>
  )
}
