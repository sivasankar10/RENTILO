import { useNavigate } from 'react-router-dom'
import { Download, FileSignature, FileText } from 'lucide-react'
import { EmptyState } from '@shared/components'
import { ROUTES } from '@shared/constants/routes'
import { useOnboardingStore } from '@shared/store/onboardingStore'
import { useTenantId } from '../hooks/useTenantId'

export function TenantDocuments() {
  const navigate = useNavigate()
  const tenantId = useTenantId()
  const records = useOnboardingStore((state) =>
    state.records.filter(
      (record) =>
        record.tenant.id === tenantId &&
        ['agreement_approved', 'payment_completed', 'active'].includes(record.status),
    ),
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-heading-1 text-text-primary">Documents</h1>
        <p className="mt-1 text-body text-text-muted">View and download your lease documents and agreements.</p>
      </div>

      {!records.length ? (
        <EmptyState icon={<FileText size={48} strokeWidth={1.5} />} title="No Documents" description="Approved lease agreements will appear here." />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {records.map((record) => {
            const latest = record.agreementVersions[record.agreementVersions.length - 1]
            return (
              <article key={record.id} className="rounded-card border border-outline bg-white p-6 shadow-surface">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-button bg-primary-50 text-primary"><FileSignature size={21} /></span>
                  <span className="rounded-pill bg-status-success-bg px-2.5 py-1 text-badge font-bold text-status-success">APPROVED</span>
                </div>
                <h2 className="mt-5 text-heading-3 font-bold text-navy">Rental Agreement</h2>
                <p className="mt-1 text-body font-semibold text-text-primary">{record.propertyName} - {record.unit}</p>
                <p className="mt-2 text-label text-text-muted">Version {latest?.version} - Signed {latest?.tenantApprovedAt}</p>
                <div className="mt-5 flex gap-3">
                  <button onClick={() => navigate(ROUTES.TENANT.AGREEMENT(record.id))} className="flex-1 rounded-button bg-navy px-4 py-2.5 text-body font-bold text-white">View</button>
                  <button onClick={() => window.print()} className="inline-flex items-center justify-center gap-2 rounded-button border border-outline px-4 py-2.5 text-body font-bold text-navy"><Download size={16} /> Save PDF</button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}