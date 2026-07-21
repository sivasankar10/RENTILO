import { SupportCenter } from '@shared/components/SupportCenter'
import { TenantHomeBackBar } from '../components/TenantHomeBackBar'

export function TenantSupport() {
  return (
    <main className="flex-1 w-full px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <TenantHomeBackBar />
        <SupportCenter />
      </div>
    </main>
  )
}
