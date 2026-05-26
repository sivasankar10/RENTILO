import { EmptyState } from '@shared/components'
import { FileText } from 'lucide-react'

export function TenantDocuments() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-heading-1 text-text-primary">Documents</h1>
        <p className="text-body text-text-muted mt-1">
          View and download your lease documents and agreements.
        </p>
      </div>

      <EmptyState
        icon={<FileText size={48} strokeWidth={1.5} />}
        title="No Documents"
        description="Your lease and related documents will appear here."
      />
    </div>
  )
}
