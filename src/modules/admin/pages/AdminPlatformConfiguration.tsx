import { useMemo, useState } from 'react'
import { Filter, Shield } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { useAdminStore, type ApprovalRequest } from '../store/adminStore'
import { usePrototypeStore } from '@shared/store/prototypeStore'
import { toast } from '../components/Toast'
type ApprovalStatusFilter = ApprovalRequest['status'] | 'All'
type ApprovalDecision = Exclude<ApprovalRequest['status'], 'Pending'>

const approvalFilters: ApprovalStatusFilter[] = ['All', 'Pending', 'Approved', 'Rejected']

const approvalStatusStyles: Record<ApprovalRequest['status'], string> = {
  Pending: 'bg-amber-50 text-amber-700',
  Approved: 'bg-status-success-bg text-status-success-text',
  Rejected: 'bg-status-error-bg text-status-error-text',
}

function getTierColor(tier: string) {
  if (tier === 'Premium') return 'text-status-error'
  if (tier === 'Free') return 'text-text-muted'
  return 'text-primary'
}

export function AdminPlatformConfiguration() {
  const [apiClientId] = useState('********-4920-x492')
  const [secretToken] = useState('************************')
  const listingApprovals = useAdminStore((state) => state.listingApprovals)
  const promotedApprovals = useAdminStore((state) => state.promotedApprovals)
  const decideListingApproval = useAdminStore((state) => state.decideListingApproval)
  const decidePromotedApproval = useAdminStore((state) => state.decidePromotedApproval)
  const addListing = useAdminStore((state) => state.addListing)
  const brokerRequests = usePrototypeStore((state) => state.adminRequests)
  const prototypeUsers = usePrototypeStore((state) => state.users)
  const prototypeProperties = usePrototypeStore((state) => state.properties)
  const decideBrokerRequest = usePrototypeStore((state) => state.decideAdminRequest)
  const [listingFilter, setListingFilter] = useState<ApprovalStatusFilter>('Pending')
  const [promotedFilter, setPromotedFilter] = useState<ApprovalStatusFilter>('Pending')
  const [showListingFilters, setShowListingFilters] = useState(false)
  const [showPromotedFilters, setShowPromotedFilters] = useState(false)

  const filteredListingApprovals = useMemo(
    () =>
      listingApprovals.filter((request) =>
        listingFilter === 'All' ? true : request.status === listingFilter
      ),
    [listingApprovals, listingFilter],
  )

  const filteredPromotedApprovals = useMemo(
    () =>
      promotedApprovals.filter((request) =>
        promotedFilter === 'All' ? true : request.status === promotedFilter
      ),
    [promotedApprovals, promotedFilter],
  )

  const pendingListingCount = listingApprovals.filter((request) => request.status === 'Pending').length
  const pendingPromotedCount = promotedApprovals.filter((request) => request.status === 'Pending').length

  const handleListingDecision = (request: ApprovalRequest, decision: ApprovalDecision) => {
    decideListingApproval(request.id, decision)

    if (decision === 'Approved') {
      // Build a non-enterprise listing from the approval request data
      const slug = request.id.replace(/[^a-z0-9]/gi, '-').toLowerCase()
      addListing({
        id: request.id,
        slug,
        segment: 'non-enterprise',
        image: request.image,
        owner: request.owner,
        location: request.location,
        rent: '₹0',
        status: 'Active',
        propertyType: request.metaLabel,           // e.g. "1 BHK"
        postedDate: new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        updated: 'Just now',
      })
      toast.success(
        'Listing approved & published',
        `${request.id} is now live in Non-Enterprise listings.`,
      )
    } else {
      toast.success('Listing rejected', `${request.id} has been marked rejected.`)
    }
  }

  const handlePromotedDecision = (request: ApprovalRequest, decision: ApprovalDecision) => {
    decidePromotedApproval(request.id, decision)
    toast.success(
      decision === 'Approved' ? 'Promotion approved' : 'Promotion rejected',
      `${request.id} has been marked ${decision.toLowerCase()}.`,
    )
  }

  return (
    <div className="min-h-screen bg-canvas-alt px-2 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-heading-1 font-bold tracking-tight text-text-primary">
            Platform Configuration
          </h1>
          <p className="mt-1 text-body text-text-muted">
            Manage enterprise-wide parameters, security integrations, and commercial structures
          </p>
        </div>

        {/* KYC Integration Section */}
        <div className="rounded-card border border-outline bg-white shadow-surface overflow-hidden">
          <div className="border-b border-outline px-6 py-4">
            <h2 className="text-body-lg font-semibold text-text-primary">KYC Integration</h2>
          </div>

          <div className="p-6 space-y-5">
            {/* Aadhaar e-KYC Status */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-button bg-teal-600">
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <p className="text-body font-semibold text-text-primary">Aadhaar e-KYC</p>
                <p className="text-label text-status-success">Status: Connected</p>
              </div>
            </div>

            {/* API Client ID */}
            <div>
              <label className="text-label font-medium text-text-muted">API Client ID</label>
              <input
                type="text"
                value={apiClientId}
                readOnly
                className="mt-1.5 h-10 w-full rounded-input border border-outline bg-canvas-alt px-4 text-body text-text-primary focus:outline-none"
              />
            </div>

            {/* Secret Credential Token */}
            <div>
              <label className="text-label font-medium text-text-muted">Secret Credential Token</label>
              <input
                type="password"
                value={secretToken}
                readOnly
                className="mt-1.5 h-10 w-full rounded-input border border-outline bg-canvas-alt px-4 text-body text-text-primary focus:outline-none"
              />
            </div>

            {/* Test Connection Button */}
            <button
              type="button"
              className="w-full rounded-input border border-outline py-3 text-body font-medium text-text-primary hover:bg-hover-light transition-colors"
            >
              Test Connection
            </button>
          </div>
        </div>

        <section className="overflow-hidden rounded-card border border-outline bg-white shadow-surface">
          <div className="border-b border-outline px-6 py-4">
            <h2 className="text-body-lg font-semibold text-text-primary">Broker Listing Requests</h2>
            <p className="mt-1 text-label text-text-muted">
              Access and removal requests submitted from broker listing management.
            </p>
          </div>
          <div className="divide-y divide-outline">
            {brokerRequests.length === 0 ? (
              <p className="px-6 py-8 text-center text-body text-text-muted">No broker requests yet.</p>
            ) : brokerRequests.map((request) => {
              const broker = prototypeUsers.find((user) => user.id === request.requesterId)
              const property = prototypeProperties.find((item) => item.id === request.propertyId)
              return (
                <article key={request.id} className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-body font-bold text-text-primary">
                      {request.type === 'broker_listing_access' ? 'Listing access' : 'Listing removal'} - {property?.title ?? request.listingId}
                    </p>
                    <p className="mt-1 text-label text-text-muted">
                      {broker?.accountName ?? request.requesterId}{request.reason ? ` - ${request.reason}` : ''}
                    </p>
                    <span className={cn('mt-2 inline-block rounded-pill px-3 py-1 text-badge font-bold', approvalStatusStyles[request.status])}>
                      {request.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={request.status !== 'Pending'}
                      onClick={() => decideBrokerRequest(request.id, 'Rejected')}
                      className="rounded-button border border-status-error px-4 py-2 text-label font-bold text-status-error disabled:opacity-40"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      disabled={request.status !== 'Pending'}
                      onClick={() => decideBrokerRequest(request.id, 'Approved')}
                      className="rounded-button bg-primary px-4 py-2 text-label font-bold text-white disabled:opacity-40"
                    >
                      Approve
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
        {/* Listings Approval Section */}
        <div className="rounded-card border border-outline bg-white shadow-surface overflow-hidden">
          <div className="border-b border-outline px-6 py-4">
            <h2 className="text-body-lg font-semibold text-text-primary">Listings Approval</h2>
            <p className="mt-0.5 text-label text-text-muted">
              {pendingListingCount} requests awaiting manual review
            </p>
          </div>

          <div className="px-6 py-3 flex justify-end border-b border-outline">
            <button
              type="button"
              onClick={() => setShowListingFilters((current) => !current)}
              className={cn(
                'inline-flex items-center gap-1.5 text-label font-medium transition-colors',
                showListingFilters || listingFilter !== 'Pending'
                  ? 'text-primary'
                  : 'text-text-muted hover:text-text-primary',
              )}
            >
              <Filter size={14} />
              {listingFilter === 'Pending' ? 'Filter' : listingFilter}
            </button>
          </div>
          {showListingFilters && (
            <div className="flex flex-wrap items-center gap-2 border-b border-outline bg-canvas-alt px-6 py-3">
              {approvalFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setListingFilter(filter)}
                  className={cn(
                    'rounded-button border px-3 py-1.5 text-label font-semibold transition-colors',
                    listingFilter === filter
                      ? 'border-primary bg-primary text-white'
                      : 'border-outline bg-white text-text-muted hover:bg-hover-light',
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline">
                  <th className="px-6 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    Property ID
                  </th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    Owner
                  </th>
                  <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">
                    Type
                  </th>
                  <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredListingApprovals.map((req) => (
                  <tr
                    key={req.id}
                    className="border-b border-outline last:border-0 hover:bg-hover-light transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={req.image}
                          alt={`Property ${req.id}`}
                          className="h-12 w-12 rounded-button object-cover"
                        />
                        <div>
                          <p className="text-body font-semibold text-text-primary">{req.id}</p>
                          <p className="text-label text-text-muted">{req.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-body text-text-primary">{req.owner}</td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-label font-medium text-primary">{req.metaLabel}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={cn(
                          'inline-block rounded-pill px-3 py-1 text-badge font-bold',
                          approvalStatusStyles[req.status],
                        )}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleListingDecision(req, 'Rejected')}
                          disabled={req.status !== 'Pending'}
                          className={cn(
                            'rounded-button border border-status-error px-4 py-1.5 text-badge font-bold transition-colors',
                            req.status === 'Pending'
                              ? 'text-status-error hover:bg-status-error-bg'
                              : 'cursor-not-allowed text-text-muted opacity-50',
                          )}
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => handleListingDecision(req, 'Approved')}
                          disabled={req.status !== 'Pending'}
                          className={cn(
                            'rounded-button px-4 py-1.5 text-badge font-bold transition-colors',
                            req.status === 'Pending'
                              ? 'bg-teal-600 text-white hover:bg-teal-700'
                              : 'cursor-not-allowed bg-slate-200 text-text-muted opacity-70',
                          )}
                        >
                          Approve
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredListingApprovals.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-body text-text-muted">
                      No listing approval requests match this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-outline px-6 py-4 text-center">
            <button
              type="button"
              className="text-body font-semibold text-text-primary hover:text-primary transition-colors"
            >
              View All Pending Requests
            </button>
          </div>
        </div>

        {/* Promoted Listings Approval Section */}
        <div className="rounded-card border border-outline bg-white shadow-surface overflow-hidden">
          <div className="border-b border-outline px-6 py-4">
            <h2 className="text-body-lg font-semibold text-text-primary">Promoted Listings Approval</h2>
            <p className="mt-0.5 text-label text-text-muted">
              {pendingPromotedCount} requests awaiting manual review
            </p>
          </div>

          <div className="px-6 py-3 flex justify-end border-b border-outline">
            <button
              type="button"
              onClick={() => setShowPromotedFilters((current) => !current)}
              className={cn(
                'inline-flex items-center gap-1.5 text-label font-medium transition-colors',
                showPromotedFilters || promotedFilter !== 'Pending'
                  ? 'text-primary'
                  : 'text-text-muted hover:text-text-primary',
              )}
            >
              <Filter size={14} />
              {promotedFilter === 'Pending' ? 'Filter' : promotedFilter}
            </button>
          </div>
          {showPromotedFilters && (
            <div className="flex flex-wrap items-center gap-2 border-b border-outline bg-canvas-alt px-6 py-3">
              {approvalFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setPromotedFilter(filter)}
                  className={cn(
                    'rounded-button border px-3 py-1.5 text-label font-semibold transition-colors',
                    promotedFilter === filter
                      ? 'border-primary bg-primary text-white'
                      : 'border-outline bg-white text-text-muted hover:bg-hover-light',
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline">
                  <th className="px-6 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    Property ID
                  </th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    Owner
                  </th>
                  <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">
                    Tier
                  </th>
                  <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPromotedApprovals.map((req) => (
                  <tr
                    key={`promoted-${req.id}`}
                    className="border-b border-outline last:border-0 hover:bg-hover-light transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={req.image}
                          alt={`Property ${req.id}`}
                          className="h-12 w-12 rounded-button object-cover"
                        />
                        <div>
                          <p className="text-body font-semibold text-text-primary">{req.id}</p>
                          <p className="text-label text-text-muted">{req.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-body text-text-primary">{req.owner}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={cn('text-label font-medium', getTierColor(req.metaLabel))}>
                        {req.metaLabel}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={cn(
                          'inline-block rounded-pill px-3 py-1 text-badge font-bold',
                          approvalStatusStyles[req.status],
                        )}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handlePromotedDecision(req, 'Rejected')}
                          disabled={req.status !== 'Pending'}
                          className={cn(
                            'rounded-button border border-status-error px-4 py-1.5 text-badge font-bold transition-colors',
                            req.status === 'Pending'
                              ? 'text-status-error hover:bg-status-error-bg'
                              : 'cursor-not-allowed text-text-muted opacity-50',
                          )}
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePromotedDecision(req, 'Approved')}
                          disabled={req.status !== 'Pending'}
                          className={cn(
                            'rounded-button px-4 py-1.5 text-badge font-bold transition-colors',
                            req.status === 'Pending'
                              ? 'bg-teal-600 text-white hover:bg-teal-700'
                              : 'cursor-not-allowed bg-slate-200 text-text-muted opacity-70',
                          )}
                        >
                          Approve
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredPromotedApprovals.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-body text-text-muted">
                      No promoted listing approval requests match this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-outline px-6 py-4 text-center">
            <button
              type="button"
              className="text-body font-semibold text-text-primary hover:text-primary transition-colors"
            >
              View All Pending Requests
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
