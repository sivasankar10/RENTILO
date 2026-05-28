import { useState } from 'react'
import { Download, Filter, MoreVertical, TrendingUp } from 'lucide-react'
import { cn } from '@shared/utils/cn'

type TransactionStatus = 'Success' | 'Pending' | 'Failed'
type TransactionType = 'Rent' | 'Commission' | 'Subscription'

interface Transaction {
  id: string
  userName: string
  userInitials: string
  avatarColor: string
  type: TransactionType
  amount: string
  status: TransactionStatus
  date: string
  action?: string
}

const transactions: Transaction[] = [
  {
    id: '#TRX-82910',
    userName: 'Amit Kumar',
    userInitials: 'AK',
    avatarColor: 'bg-teal-500',
    type: 'Rent',
    amount: '₹ 45,000',
    status: 'Success',
    date: 'Oct 24, 2023',
  },
  {
    id: '#TRX-82911',
    userName: 'Sneha Patil',
    userInitials: 'SP',
    avatarColor: 'bg-slate-400',
    type: 'Commission',
    amount: '₹ 8,400',
    status: 'Pending',
    date: 'Oct 23, 2023',
    action: 'Issue Refund',
  },
  {
    id: '#TRX-82912',
    userName: 'Rajesh Khanna',
    userInitials: 'RK',
    avatarColor: 'bg-blue-500',
    type: 'Subscription',
    amount: '₹ 2,499',
    status: 'Failed',
    date: 'Oct 22, 2023',
  },
  {
    id: '#TRX-82913',
    userName: 'Maanav D.',
    userInitials: 'MD',
    avatarColor: 'bg-indigo-400',
    type: 'Rent',
    amount: '₹ 32,500',
    status: 'Success',
    date: 'Oct 22, 2023',
  },
]

const statusColors: Record<TransactionStatus, string> = {
  Success: 'bg-status-success-bg text-status-success-text',
  Pending: 'bg-amber-50 text-amber-700',
  Failed: 'bg-status-error-bg text-status-error-text',
}

export function AdminFinancePayments() {
  const [typeFilter, setTypeFilter] = useState('All Transactions')
  const [rangeFilter, setRangeFilter] = useState('Last 30 Days')
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <div className="min-h-screen bg-canvas-alt px-2 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
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
            className="inline-flex items-center gap-2 rounded-button bg-navy px-5 py-2.5 text-body font-semibold text-white shadow-sm transition-all duration-200 hover:bg-slate-800 hover:shadow-md"
          >
            <Download size={16} />
            Export CSV/Excel
          </button>
        </div>

        {/* Transactions Table */}
        <div className="rounded-card border-2 border-primary/30 bg-white shadow-surface overflow-hidden">
          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-4 border-b border-outline px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="text-label font-medium text-text-muted">Type:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
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
              className="ml-auto p-2 rounded-button text-text-muted hover:bg-hover-light hover:text-text-primary transition-colors"
              aria-label="More filters"
            >
              <Filter size={18} />
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline">
                  <th className="px-6 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    Transaction ID
                  </th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    Date
                  </th>
                  <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr
                    key={txn.id}
                    className="border-b border-outline last:border-0 hover:bg-hover-light transition-colors"
                  >
                    <td className="px-6 py-4 text-body font-semibold text-text-primary">
                      {txn.id}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'flex h-9 w-9 items-center justify-center rounded-full text-badge font-bold text-white',
                            txn.avatarColor,
                          )}
                        >
                          {txn.userInitials}
                        </div>
                        <span className="text-body font-medium text-text-primary">
                          {txn.userName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-body text-text-primary">{txn.type}</td>
                    <td className="px-4 py-4 text-body font-semibold text-text-primary">
                      {txn.amount}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={cn(
                          'inline-block rounded-pill px-3 py-1 text-badge font-bold',
                          statusColors[txn.status],
                        )}
                      >
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-label text-text-muted">{txn.date}</td>
                    <td className="px-4 py-4 text-center">
                      {txn.action ? (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 text-label font-semibold text-primary hover:text-primary-700 transition-colors"
                        >
                          ↩ {txn.action}
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="p-1.5 rounded-button text-text-muted hover:bg-hover-light hover:text-text-primary transition-colors"
                          aria-label={`Actions for ${txn.id}`}
                        >
                          <MoreVertical size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-outline px-6 py-4">
            <p className="text-label text-text-muted">
              Showing 1 to 4 of 248 transactions
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="rounded-button border border-outline px-3 py-1.5 text-label font-medium text-text-muted hover:bg-hover-light transition-colors"
              >
                Previous
              </button>
              {[1, 2].map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    'h-8 w-8 rounded-button text-label font-medium transition-colors',
                    currentPage === page
                      ? 'bg-navy text-white'
                      : 'text-text-muted hover:bg-hover-light border border-outline',
                  )}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                className="rounded-button border border-outline px-3 py-1.5 text-label font-medium text-text-muted hover:bg-hover-light transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Total Revenue Card */}
        <div className="flex justify-end">
          <div className="w-full max-w-sm rounded-card bg-navy p-6 text-white shadow-modal">
            <p className="text-label text-slate-400">Total Revenue (MTD)</p>
            <p className="mt-2 text-[36px] font-bold leading-none tracking-tight">
              ₹ 14,82,900
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
