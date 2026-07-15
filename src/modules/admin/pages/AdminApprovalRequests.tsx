import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Filter } from 'lucide-react'
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

export function AdminApprovalRequests() {
  const navigate = useNavigate()
  const listingApprovals = useAdminStore((state) => state.listingApprovals)
  const promotedApprovals = useAdminStore((state) => state.promotedApprovals)
  const decideListingApproval = useAdminStore((state) => state.decideListingApproval)
  const decidePromotedApproval = useAdminStore((state) => state.decidePromotedApproval)
  const addListing = useAdminStore((state) => state.addListing)
  const brokerRequests = usePrototypeStore((state) => state.adminRequests)
  const prototypeUsers = usePrototypeStore((state) => state.users)
  const prototypeProperties = usePrototypeStore((state) => state.properties)
  const decideBrokerRequest = usePrototypeStore((state) => state.decideAdminRequest)
  const commissionNegotiations = usePrototypeStore((state) => state.commissionNegotiations)
  const counterOffer = usePrototypeStore((state) => state.counterCommissionOffer)
  const rejectNegotiation = usePrototypeStore((state) => state.rejectCommissionNegotiation)
  const [adminCounterInputs, setAdminCounterInputs] = useState<Record<string, { commission: string; note: string }>>({})
  const [brokerTableOpenFor, setBrokerTableOpenFor] = useState<string | null>(null)
  const sendBrokerOffer = usePrototypeStore((state) => state.sendBrokerOffer)
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
  const pendingBrokerCount = brokerRequests.filter((request) => request.status === 'Pending').length

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
            Approval Requests
          </h1>
          <p className="mt-1 text-body text-text-muted">
            Review broker access requests, listing submissions, and promotion requests awaiting a decision.
          </p>
        </div>

        {/* Summary chips */}
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryChip label="Broker Requests" count={pendingBrokerCount} />
          <SummaryChip label="Listing Approvals" count={pendingListingCount} />
          <SummaryChip label="Promotion Approvals" count={pendingPromotedCount} />
        </div>

        {/* Broker Listing Requests */}
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
                      {request.type === 'broker_listing_access' ? 'Listing access' : 'Listing removal'} -{' '}
                      <button
                        type="button"
                        onClick={() => property && navigate(`/admin/property/${property.id}`)}
                        className="text-primary hover:underline"
                      >
                        {property?.title ?? request.listingId}
                      </button>
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

        {/* Custom Broker Requests (Commission Negotiations) */}
        {commissionNegotiations.length > 0 && (
          <section className="overflow-hidden rounded-card border border-outline bg-white shadow-surface">
            <div className="border-b border-outline px-6 py-4">
              <h2 className="text-body-lg font-semibold text-text-primary">Custom Broker Requests</h2>
              <p className="mt-1 text-label text-text-muted">
                Owner commission negotiation requests for broker assignment.
              </p>
            </div>
            <div className="divide-y divide-outline">
              {commissionNegotiations.map((negotiation) => {
                const owner = prototypeUsers.find((u) => u.id === negotiation.ownerId)
                const property = prototypeProperties.find((p) => p.id === negotiation.propertyId)
                const ownerName = owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown Owner'
                const lastRound = negotiation.rounds[negotiation.rounds.length - 1]
                const adminInput = adminCounterInputs[negotiation.id] ?? { commission: '', note: '' }

                return (
                  <article key={negotiation.id} className="px-6 py-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <p className="text-body font-bold text-text-primary">{ownerName}</p>
                          <span className={cn('rounded-pill px-2.5 py-1 text-badge font-bold',
                            negotiation.status === 'accepted' ? 'bg-green-50 text-green-700'
                              : negotiation.status === 'rejected' ? 'bg-red-50 text-red-700'
                                : 'bg-amber-50 text-amber-700'
                          )}>
                            {negotiation.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <button type="button" onClick={() => property && navigate(`/admin/property/${property.id}`)} className="mt-1 text-label text-primary hover:underline">
                          {property?.title ?? 'Unknown Property'}
                        </button>
                        <div className="mt-3 flex flex-wrap gap-4 text-label text-text-muted">
                          <span>Rent: {property?.price ?? '—'}</span>
                          <span>Deposit: {property?.deposit ?? '—'}</span>
                        </div>

                        {/* Negotiation rounds */}
                        <div className="mt-4 space-y-2">
                          {negotiation.rounds.map((round, i) => (
                            <div key={i} className={`rounded-lg px-3 py-2 ${round.by === 'owner' ? 'bg-canvas-alt' : 'bg-primary-50'}`}>
                              <div className="flex items-center justify-between">
                                <span className="text-label font-bold text-text-primary">{round.by === 'owner' ? ownerName : 'Admin'}</span>
                                <span className="text-body font-bold text-primary">{round.commission}%</span>
                              </div>
                              {round.note && <p className="mt-0.5 text-label text-text-muted">"{round.note}"</p>}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Admin actions */}
                      {negotiation.status !== 'accepted' && negotiation.status !== 'rejected' && (
                        <div className="flex flex-col gap-2 lg:w-64">
                          {(negotiation.status === 'owner_offered' || negotiation.status === 'owner_countered') && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  setBrokerTableOpenFor(negotiation.id)
                                }}
                                className="w-full rounded-button bg-primary px-4 py-2.5 text-label font-bold text-white hover:bg-primary-700"
                              >
                                Accept {lastRound.commission}% & Select Broker
                              </button>
                              <div className="flex gap-2">
                                <input
                                  type="number"
                                  min="1"
                                  max="100"
                                  value={adminInput.commission}
                                  onChange={(e) => setAdminCounterInputs((c) => ({ ...c, [negotiation.id]: { ...adminInput, commission: e.target.value } }))}
                                  placeholder="%"
                                  className="w-16 rounded-button border border-outline px-2 py-2 text-label text-text-primary focus:border-primary focus:outline-none"
                                />
                                <input
                                  value={adminInput.note}
                                  onChange={(e) => setAdminCounterInputs((c) => ({ ...c, [negotiation.id]: { ...adminInput, note: e.target.value } }))}
                                  placeholder="Note..."
                                  className="flex-1 rounded-button border border-outline px-2 py-2 text-label text-text-primary focus:border-primary focus:outline-none"
                                />
                              </div>
                              <button
                                type="button"
                                disabled={!adminInput.commission}
                                onClick={() => {
                                  counterOffer(negotiation.id, 'admin', adminInput.commission, adminInput.note)
                                  setAdminCounterInputs((c) => ({ ...c, [negotiation.id]: { commission: '', note: '' } }))
                                }}
                                className="w-full rounded-button bg-navy px-4 py-2.5 text-label font-bold text-white hover:bg-slate-800 disabled:opacity-50"
                              >
                                Counter Offer
                              </button>
                              <button
                                type="button"
                                onClick={() => rejectNegotiation(negotiation.id)}
                                className="w-full rounded-button border border-status-error px-4 py-2 text-label font-bold text-status-error hover:bg-red-50"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Broker Selection Table */}
                    {(brokerTableOpenFor === negotiation.id || negotiation.status === 'broker_offered' || negotiation.status === 'broker_rejected') && (
                      <div className="mt-4 w-full rounded-lg border border-outline overflow-hidden">
                        <div className="bg-canvas-alt px-4 py-3 border-b border-outline">
                          <p className="text-label font-bold text-text-primary">
                            {negotiation.status === 'broker_offered' ? 'Offer Sent — Awaiting Broker' : 'Select Broker to Assign'}
                          </p>
                        </div>
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-outline text-[10px] font-bold uppercase tracking-wider text-text-muted">
                              <th className="px-4 py-2">Broker</th>
                              <th className="px-4 py-2">Area</th>
                              <th className="px-4 py-2">Min Commission</th>
                              <th className="px-4 py-2">Status</th>
                              <th className="px-4 py-2 text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {prototypeUsers.filter((u) => u.roles.includes('broker') && u.status === 'Active').map((broker, idx) => {
                              const brokerName = `${broker.firstName} ${broker.lastName}`
                              const dummyMinCommission = [20, 25, 28, 30, 22][idx % 5]
                              const existingOffer = negotiation.brokerOffers.find((o) => o.brokerId === broker.id)
                              return (
                                <tr key={broker.id} className="border-b border-outline last:border-0 hover:bg-hover-light">
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      {broker.avatar ? <img src={broker.avatar} alt="" className="h-7 w-7 rounded-full object-cover" /> : <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold">{broker.firstName[0]}{broker.lastName[0]}</div>}
                                      <span className="text-label font-semibold text-text-primary">{brokerName}</span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-label text-text-muted">Bangalore</td>
                                  <td className="px-4 py-3 text-label font-semibold text-text-primary">{dummyMinCommission}%</td>
                                  <td className="px-4 py-3">
                                    {existingOffer ? (
                                      <span className={`rounded-pill px-2 py-0.5 text-[10px] font-bold ${existingOffer.status === 'accepted' ? 'bg-green-50 text-green-700' : existingOffer.status === 'rejected' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                                        {existingOffer.status}
                                      </span>
                                    ) : (
                                      <span className="text-label text-text-muted">—</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    {!existingOffer && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          sendBrokerOffer(negotiation.id, broker.id, lastRound.commission)
                                          toast.success('Offer sent', `Sent ${lastRound.commission}% offer to ${brokerName}`)
                                        }}
                                        className="rounded-button bg-navy px-3 py-1.5 text-[11px] font-bold text-white hover:bg-slate-800"
                                      >
                                        Assign
                                      </button>
                                    )}
                                    {existingOffer?.status === 'rejected' && (
                                      <span className="text-[10px] text-red-600 font-semibold">Rejected</span>
                                    )}
                                    {existingOffer?.status === 'accepted' && (
                                      <span className="text-[10px] font-bold text-green-700">✓ Assigned</span>
                                    )}
                                    {existingOffer?.status === 'pending' && (
                                      <span className="text-[10px] text-amber-600 font-semibold">Pending</span>
                                    )}
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </article>
                )
              })}
            </div>
          </section>
        )}

        {/* Listings Approval */}
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

        {/* Promoted Listings Approval */}
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

function SummaryChip({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center justify-between rounded-card border border-outline bg-white px-5 py-4 shadow-sm">
      <p className="text-label font-semibold text-text-muted">{label}</p>
      <span
        className={cn(
          'rounded-pill px-3 py-1 text-badge font-bold',
          count > 0 ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-text-muted',
        )}
      >
        {count} pending
      </span>
    </div>
  )
}
