import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Bell, Briefcase, CreditCard, Heart, LayoutGrid, LogOut, MessageSquare, Settings, UserCheck, Users, Wrench } from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { useAuth } from '@shared/hooks/useAuth'
import { usePrototypeStore } from '@shared/store/prototypeStore'
import { cn } from '@shared/utils/cn'
import { useMemo } from 'react'
import { useEnterpriseStore } from '@modules/enterprise/store/enterpriseStore'

const sidebarItems = [
  { label: 'Dashboard', href: ROUTES.ENTERPRISE.DASHBOARD, icon: LayoutGrid },
  { label: 'Portfolio', href: ROUTES.ENTERPRISE.PORTFOLIO, icon: Briefcase },
  { label: 'Leases', href: `${ROUTES.ENTERPRISE.ROOT}/leases`, icon: Heart },
  { label: 'Maintenance', href: `${ROUTES.ENTERPRISE.ROOT}/maintenance`, icon: Wrench },
  { label: 'Assignments', href: `${ROUTES.ENTERPRISE.ROOT}/assignments`, icon: UserCheck },
  { label: 'Team', href: ROUTES.ENTERPRISE.TEAMS, icon: Users },
  { label: 'Brokers', href: `${ROUTES.ENTERPRISE.ROOT}/brokers`, icon: UserCheck },
  { label: 'Finance', href: `${ROUTES.ENTERPRISE.ROOT}/finance`, icon: CreditCard },
  { label: 'Tenants', href: `${ROUTES.ENTERPRISE.ROOT}/tenants`, icon: Users },
]

export function EnterpriseLayout() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const allProperties = usePrototypeStore((s) => s.properties)

  // Level 1: Enterprise Properties (top-level, with or without blocks)
  // These are properties posted by the enterprise owner that are NOT unit-level properties
  const enterpriseProperties = useMemo(
    () => allProperties.filter((p) => p.ownerId === user?.id && !p.id.startsWith('property-unit-')),
    [allProperties, user?.id],
  )

  // Level 2: Blocks (properties with enterpriseBlock field)
  const enterpriseBlocks = useMemo(
    () => enterpriseProperties.filter((p) => p.enterpriseBlock),
    [enterpriseProperties],
  )

  // Standalone properties (no blocks yet)
  const standaloneProperties = useMemo(
    () => enterpriseProperties.filter((p) => !p.enterpriseBlock),
    [enterpriseProperties],
  )

  // Group blocks by their parent property name
  const propertyGroups = useMemo(() => {
    const groups: Record<string, typeof enterpriseBlocks> = {}
    enterpriseBlocks.forEach((block) => {
      const parts = block.title.split(' - Block ')
      const propertyName = parts.length > 1 ? parts[0] : block.title.split(' - ')[0] ?? block.title
      if (!groups[propertyName]) groups[propertyName] = []
      groups[propertyName].push(block)
    })
    // Standalone properties are their own group (no blocks yet)
    standaloneProperties.forEach((prop) => {
      if (!groups[prop.title]) groups[prop.title] = []
      // Don't push the property itself — it has no blocks
    })
    return groups
  }, [enterpriseBlocks, standaloneProperties])

  const propertyNames = useMemo(() => {
    const names = new Set<string>()
    enterpriseBlocks.forEach((block) => {
      const parts = block.title.split(' - Block ')
      names.add(parts.length > 1 ? parts[0] : block.title.split(' - ')[0] ?? block.title)
    })
    standaloneProperties.forEach((p) => names.add(p.title))
    return Array.from(names)
  }, [enterpriseBlocks, standaloneProperties])

  const [selectedProperty, setSelectedProperty] = [useEnterpriseStore((s) => s.selectedProperty), useEnterpriseStore((s) => s.setSelectedProperty)]
  const [selectedBlockId, setSelectedBlockId] = [useEnterpriseStore((s) => s.selectedBlockId), useEnterpriseStore((s) => s.setSelectedBlockId)]

  // Current property
  const currentPropertyName = propertyNames.includes(selectedProperty) ? selectedProperty : propertyNames[0] ?? ''
  // Blocks for the current property
  const currentPropertyBlocks = propertyGroups[currentPropertyName] ?? []
  // Current block (or standalone property ID if no blocks)
  const currentBlockId = currentPropertyBlocks.length > 0
    ? (currentPropertyBlocks.some((b) => b.id === selectedBlockId) ? selectedBlockId : currentPropertyBlocks[0]?.id ?? '')
    : (standaloneProperties.find((p) => p.title === currentPropertyName)?.id ?? '')
  // Current block data
  const currentBlock = allProperties.find((p) => p.id === currentBlockId)
  // Unit properties for the current block (Level 3)
  const currentBlockUnits = useMemo(() => {
    if (!currentBlock?.enterpriseBlock) return []
    const unitPropIds = currentBlock.enterpriseBlock.units.map((u) => u.propertyId).filter(Boolean) as string[]
    return allProperties.filter((p) => unitPropIds.includes(p.id))
  }, [currentBlock, allProperties])

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
      <aside className="fixed top-14 left-0 bottom-0 w-[180px] border-r border-outline bg-white flex flex-col z-30 overflow-y-auto">
        {/* Property → Block → Unit Switcher */}
        {propertyNames.length > 0 && (
          <div className="px-3 pt-4 pb-2 border-b border-outline space-y-2.5">
            {/* Property */}
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-text-muted px-1 mb-1">Property</p>
              <select
                value={currentPropertyName}
                onChange={(e) => { setSelectedProperty(e.target.value); setSelectedBlockId('') }}
                className="w-full rounded-lg border border-outline bg-white px-2.5 py-1.5 text-[11px] font-bold text-[#0f172a] outline-none focus:border-primary"
              >
                {propertyNames.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
            {/* Block */}
            {currentPropertyBlocks.length > 0 ? (
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-text-muted px-1 mb-1">Block</p>
                <select
                  value={currentBlockId}
                  onChange={(e) => setSelectedBlockId(e.target.value)}
                  className="w-full rounded-lg border border-outline bg-white px-2.5 py-1.5 text-[11px] font-bold text-[#0f172a] outline-none focus:border-primary"
                >
                  {currentPropertyBlocks.map((block) => (
                    <option key={block.id} value={block.id}>{block.enterpriseBlock?.blockName ? `Block ${block.enterpriseBlock.blockName}` : block.title}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-2">
                <p className="text-[10px] font-semibold text-amber-700">No blocks yet</p>
                <p className="text-[9px] text-amber-600">Add a block to start adding units.</p>
              </div>
            )}
            {/* Unit (info only) */}
            {currentBlockUnits.length > 0 && (
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-text-muted px-1 mb-1">Units</p>
                <p className="px-2.5 py-1.5 text-[11px] font-semibold text-[#0f172a]">{currentBlockUnits.length} unit{currentBlockUnits.length !== 1 ? 's' : ''} added</p>
              </div>
            )}
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
          <button onClick={() => navigate(`${ROUTES.ENTERPRISE.ROOT}/support`)} className="w-full rounded-xl bg-primary px-4 py-2.5 text-[12px] font-bold text-white text-center">
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
          <Outlet context={{ currentBlockId, enterpriseBlocks: [...enterpriseBlocks, ...standaloneProperties] }} />
        </div>
      </main>
    </div>
  )
}
