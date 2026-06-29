import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, Eye, Filter, RefreshCw, RotateCcw, TrendingUp } from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { cn } from '@shared/utils/cn'
import { useAdminStore } from '../store/adminStore'
import type { AdminTransaction, TransactionStatus, TransactionType } from '../store/adminStore'
import { ActionMenu } from '../components/ActionMenu'
import { confirm } from '../components/ConfirmDialog'
import { toast } from '../components/Toast'
import { exportToCsv } from '../utils/exportCsv'

const statusColors: Record<TransactionStatus, string> = {
  Success: 'bg-status-success-bg text-status-success-text',
  Pending: 'bg-amber-50 text-amber-700',
  Failed: 'bg-status-error-bg text-status-error-text',
  Refunded: 'bg-slate-100 text-slate-600',
}

export function AdminFinancePayments() {
  const navigate = useNavigate()
  const transactions = useAdminStore((s) => s.transactions)
  const refundTransaction = useAdminStore((s) => s.refundTransaction)
  const retryTransaction = useAdminStore((s) => s.retryTransaction)

  const [typeFilter, setTypeFilter] = useState<TransactionType | 'All Transactions'>('All Transactions')
  const [rangeFilter, setRangeFilter] = useState('Last 30 Days')
  const [showFilters, setShowFilters] = useState(false)
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'All Statuses'>('All Statuses')
  const [currentPage, setCurrentPage] = useState(1)

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (typeFilter !== 'All Transactions' && t.type !== typeFilter) return false
      if (statusFilter !== 'All Statuses' && t.status !== statusFilter) return false
      return true
    })
  }, [transactions, typeFilter, statusFilter])

  const totalRevenue = useMemo(() => {
    const sum = transactions
      .filter((t) => t.status === 'Success')
      .reduce((acc, t) => acc + parseFloat(t.amount.replace(/[^0-9.]/g, '')), 0)
    return sum
  }, [transactions])

  const handleRefund = (txn: AdminTransaction) => {
    confirm({
      title: 'Issue refund?',
      description: `${txn.amount} will be refunded to ${txn.user}. They will receive an email confirmation.`,
      confirmLabel: 'Issue refund',
      variant: 'danger',
      onConfirm: () => {
        refundTransaction(txn.id)
        toast.success('Refund issued', `${txn.id} has been refunded.`)
      },
    })
  }

  const handleRetry = (txn: AdminTransaction) => {
    confirm({
      title: 'Retry payment?',
      description: `Retry processing ${txn.amount} for ${txn.user}.`,
      confirmLabel: 'Retry',
      onConfirm: () => {
        retryTransaction(txn.id)
        toast.success('Payment retried', `${txn.id} processed successfully.`)
      },
    })
  }

  const handleViewReceipt = (txn: AdminTransaction) => {
    navigate(ROUTES.ADMIN.PAYMENT_RECEIPT(txn.id))
  }

  const handleExport = () => {
    if (!filtered.length) {
      toast.error('Nothing to export', 'Adjust filters and try again.')
      return
    }
    exportToCsv('transactions.csv', filtered, [
      { key: 'id', label: 'Transaction ID' },
      { key: 'user', label: 'User' },
      { key: 'type', label: 'Type' },
      { key: 'amount', label: 'Amount' },
      { key: 'status', label: 'Status' },
      { key: 'date', label: 'Date' },
    ])
    toast.success('Export started', `${filtered.length} transactions downloaded.`)
  }

  return (
    <div className="min-h-screen bg-canvas-alt px-2 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-heading-1 font-bold tracking-tight text-text-primary">
              Finance & Payments
            </h1>
            <p className="mt-1 text-body text-text-muted">
              Monitor all capital flows, commissions, and subscription billing.
            </p>
          </div>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-button bg-navy px-5 py-2.5 text-body font-semibold text-white shadow-sm transition-all duration-200 hover:bg-slate-800 hover:shadow-md"
          >
            <Download size={16} />
            Export CSV/Excel
          </button>
        </div>

        <div className="rounded-card border-2 border-primary/30 bg-white shadow-surface overflow-hidden">
          <div className="flex flex-wrap items-center gap-4 border-b border-outline px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="text-label font-medium text-text-muted">Type:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
                className="h-9 rounded-input border border-outline bg-white px-3 pr-8 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
              >
                <option>All Transactions</option>
                <option>Rent</option>
                <option>Commission</option>
                <option>Subscription</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-label font-medium text-text-muted">Range:</span>
              <select
                value={rangeFilter}
                onChange={(e) => setRangeFilter(e.target.value)}
                className="h-9 rounded-input border border-outline bg-white px-3 pr-8 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
              >
                <option>Last 30 Days</option>
                <option>Last 7 Days</option>
                <option>Last 90 Days</option>
                <option>This Year</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              className={cn(
                'ml-auto p-2 rounded-button transition-colors',
                showFilters ? 'bg-primary-100 text-primary' : 'text-text-muted hover:bg-hover-light hover:text-text-primary',
              )}
              aria-label="Toggle status filter"
            >
              <Filter size={18} />
            </button>
          </div>

          {showFilters && (
            <div className="border-b border-outline bg-canvas-alt px-6 py-3">
              <div className="flex items-center gap-3">
                <span className="text-label font-medium text-text-muted">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                  className="h-9 rounded-input border border-outline bg-white px-3 pr-8 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                >
                  <option>All Statuses</option>
                  <option>Success</option>
                  <option>Pending</option>
                  <option>Failed</option>
                  <option>Refunded</option>
                </select>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline">
                  <th className="px-6 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">Transaction ID</th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">User</th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">Type</th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">Amount</th>
                  <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">Status</th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">Date</th>
                  <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-body text-text-muted">
                      No transactions match the current filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((txn) => (
                    <tr key={txn.id} className="border-b border-outline last:border-0 hover:bg-hover-light transition-colors">
                      <td className="px-6 py-4 text-body font-semibold text-text-primary">{txn.id}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn('flex h-9 w-9 items-center justify-center rounded-full text-badge font-bold text-white', txn.avatarColor)}>
                            {txn.userInitials}
                          </div>
                          <span className="text-body font-medium text-text-primary">{txn.user}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-body text-text-primary">{txn.type}</td>
                      <td className="px-4 py-4 text-body font-semibold text-text-primary">{txn.amount}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={cn('inline-block rounded-pill px-3 py-1 text-badge font-bold', statusColors[txn.status])}>
                          {txn.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-label text-text-muted">{txn.date}</td>
                      <td className="px-4 py-4 text-center">
                        {txn.status === 'Pending' ? (
                          <button
                            type="button"
                            onClick={() => handleRefund(txn)}
                            className="inline-flex items-center gap-1 text-label font-semibold text-status-error hover:text-red-700 transition-colors"
                          >
                            <RotateCcw size={12} />
                            Issue Refund
                          </button>
                        ) : (
                          <ActionMenu
                            ariaLabel={`Actions for ${txn.id}`}
                            items={[
                              { label: 'View receipt', icon: Eye, onClick: () => handleViewReceipt(txn) },
                              { label: 'Issue refund', icon: RotateCcw, variant: 'danger', onClick: () => handleRefund(txn), disabled: txn.status === 'Refunded' },
                              { label: 'Retry payment', icon: RefreshCw, onClick: () => handleRetry(txn), disabled: txn.status !== 'Failed' },
                            ]}
                          />
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-outline px-6 py-4">
            <p className="text-label text-text-muted">
              Showing {filtered.length} of {transactions.length} transactions
            </p>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className="rounded-button border border-outline px-3 py-1.5 text-label font-medium text-text-muted hover:bg-hover-light transition-colors">
                Previous
              </button>
              {[1, 2].map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={cn('h-8 w-8 rounded-button text-label font-medium transition-colors', currentPage === page ? 'bg-navy text-white' : 'text-text-muted hover:bg-hover-light border border-outline')}
                >
                  {page}
                </button>
              ))}
              <button type="button" onClick={() => setCurrentPage((p) => Math.min(2, p + 1))} className="rounded-button border border-outline px-3 py-1.5 text-label font-medium text-text-muted hover:bg-hover-light transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="w-full max-w-sm rounded-card bg-navy p-6 text-white shadow-modal">
            <p className="text-label text-slate-400">Total Revenue (MTD)</p>
            <p className="mt-2 text-[36px] font-bold leading-none tracking-tight">
              ₹ {totalRevenue.toLocaleString('en-IN')}
            </p>
            <p className="mt-3 flex items-center gap-1.5 text-label text-status-success">
              <TrendingUp size={14} />
              +18.2% from last month
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
