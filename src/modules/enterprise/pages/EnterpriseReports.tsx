import { EmptyState } from '@shared/components'
import { FileBarChart } from 'lucide-react'

export function EnterpriseReports() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-heading-1 text-text-primary">Reports</h1>
        <p className="text-body text-text-muted mt-1">Generate and view enterprise reports.</p>
      </div>
      <EmptyState icon={<FileBarChart size={48} strokeWidth={1.5} />} title="No Reports" description="Generate your first report to gain insights into your portfolio performance." actionLabel="Generate Report" onAction={() => {}} />
    </div>
  )
}
