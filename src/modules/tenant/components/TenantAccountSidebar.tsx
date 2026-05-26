import { TenantSidebarFooter } from './TenantSidebarFooter'

export function TenantAccountSidebar() {
  return (
    <aside className="hidden lg:flex w-[260px] shrink-0 flex-col bg-brand-container-low border-r border-brand-outline-variant px-6 py-8">
      <div className="flex-1" />
      <TenantSidebarFooter className="border-t-0 pt-0" />
    </aside>
  )
}
