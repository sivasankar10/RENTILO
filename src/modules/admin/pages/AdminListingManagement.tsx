import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, ChevronLeft, ChevronRight, Eye, Flag, Home, Pause, Pencil, Play, Plus, Search, ShieldAlert, Trash2 } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { useAdminStore } from '../store/adminStore'
import type { AdminListing, ListingStatus } from '../store/adminStore'
import { ActionMenu } from '../components/ActionMenu'
import { confirm } from '../components/ConfirmDialog'
import { toast } from '../components/Toast'
import { exportToCsv } from '../utils/exportCsv'
import { AdminNewListingModal } from '../components/AdminNewListingModal'
import { useOnboardingStore } from '@shared/store/onboardingStore'
import { usePrototypeStore } from '@shared/store/prototypeStore'

type OccupancyStatus = 'Occupied' | 'Pending' | null

type ListingTab = 'Enterprise' | 'Non-Enterprise'
type SortKey = 'latest' | 'highest-rent' | 'lowest-rent' | 'updated'

const statusColors: Record<ListingStatus, string> = {
  Active: 'bg-status-success-bg text-status-success-text',
  Paused: 'bg-amber-50 text-amber-700',
  Flagged: 'bg-status-error-bg text-status-error-text',
  Removed: 'bg-slate-100 text-slate-600',
}

const occupancyColors: Record<string, string> = {
  Occupied: 'bg-primary-100 text-primary',
  Pending: 'bg-amber-50 text-amber-700',
}

function parseRent(rent: string): number {
  const num = rent.replace(/[^0-9.]/g, '')
  return parseFloat(num) || 0
}

export function AdminListingManagement() {
  const navigate = useNavigate()
  const listings = useAdminStore((s) => s.listings)
  const setListingStatus = useAdminStore((s) => s.setListingStatus)
  const removeListing = useAdminStore((s) => s.removeListing)
  const addListing = useAdminStore((s) => s.addListing)
  const onboardingRecords = useOnboardingStore((s) => s.records)
  const prototypeProperties = usePrototypeStore((s) => s.properties)

  // Helper: check if a listing's property has an onboarded tenant
  const getOccupancyStatus = (listing: AdminListing): OccupancyStatus => {
    if (listing.segment === 'enterprise') return null
    // Try to match by property title
    const matchedProperty = prototypeProperties.find(
      (p) => listing.propertyTitle?.toLowerCase().includes(p.title.toLowerCase()) ||
        p.title.toLowerCase().includes((listing.propertyTitle ?? '').toLowerCase())
    )
    if (!matchedProperty) return null
    const record = onboardingRecords.find(
      (r) => r.ownerPropertyId === matchedProperty.id && ['active', 'payment_completed'].includes(r.status)
    )
    if (!record) return null
    return record.status === 'active' ? 'Occupied' : 'Pending'
  }

  const [activeTab, setActiveTab] = useState<ListingTab>('Enterprise')
  const [statusFilter, setStatusFilter] = useState<ListingStatus | 'All Statuses'>('All Statuses')
  const [sortBy, setSortBy] = useState<SortKey>('latest')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [newListingModalOpen, setNewListingModalOpen] = useState(false)

  const segment = activeTab === 'Enterprise' ? 'enterprise' : 'non-enterprise'

  const filteredListings = useMemo(() => {
    let data = listings.filter((l) => l.segment === segment)
    if (statusFilter !== 'All Statuses') data = data.filter((l) => l.status === statusFilter)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      data = data.filter((l) =>
        l.id.toLowerCase().includes(q) ||
        l.owner.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q),
      )
    }
    if (sortBy === 'highest-rent') data = [...data].sort((a, b) => parseRent(b.rent) - parseRent(a.rent))
    if (sortBy === 'lowest-rent') data = [...data].sort((a, b) => parseRent(a.rent) - parseRent(b.rent))
    return data
  }, [listings, segment, statusFilter, searchQuery, sortBy])

  const stats = useMemo(() => {
    const segmentListings = listings.filter((l) => l.segment === segment)
    return {
      total: segmentListings.length,
      active: segmentListings.filter((l) => l.status === 'Active').length,
      flagged: segmentListings.filter((l) => l.status === 'Flagged').length,
    }
  }, [listings, segment])

  const handleRowClick = (listing: AdminListing) => {
    if (listing.segment === 'enterprise') {
      navigate(`/admin/listing-management/enterprise/${listing.slug}`)
    } else {
      navigate(`/admin/listing-management/non-enterprise/${listing.slug}`)
    }
  }

  const handleEditListing = (listing: AdminListing) => {
    if (listing.segment === 'enterprise') {
      navigate(`/admin/listing-management/enterprise/${listing.slug}`)
      toast.info('Opening enterprise listing', 'Enterprise editor will be handled separately.')
      return
    }

    navigate(`/admin/listing-management/non-enterprise/${listing.slug}?mode=edit&step=1`)
  }

  const handlePauseResume = (listing: AdminListing) => {
    const next: ListingStatus = listing.status === 'Active' ? 'Paused' : 'Active'
    setListingStatus(listing.id, next)
    toast.success(
      next === 'Paused' ? 'Listing paused' : 'Listing reactivated',
      `${listing.id} is now ${next.toLowerCase()}.`,
    )
  }

  const handleFlag = (listing: AdminListing) => {
    confirm({
      title: 'Flag this listing?',
      description: `${listing.id} will be marked for compliance review.`,
      confirmLabel: 'Flag listing',
      variant: 'danger',
      onConfirm: () => {
        setListingStatus(listing.id, 'Flagged')
        toast.success('Listing flagged', 'Compliance team has been notified.')
      },
    })
  }

  const handleRemove = (listing: AdminListing) => {
    confirm({
      title: 'Remove listing?',
      description: `${listing.id} will be archived. The owner can resubmit later.`,
      confirmLabel: 'Remove',
      variant: 'danger',
      onConfirm: () => {
        removeListing(listing.id)
        toast.success('Listing removed')
      },
    })
  }

  const handleNewListing = () => {
    setNewListingModalOpen(true)
  }

  const handleExport = () => {
    if (!filteredListings.length) {
      toast.error('Nothing to export', 'Adjust filters and try again.')
      return
    }
    exportToCsv(`listings-${segment}.csv`, filteredListings, [
      { key: 'id', label: 'Listing ID' },
      { key: 'owner', label: 'Owner' },
      { key: 'location', label: 'Location' },
      { key: 'rent', label: 'Rent' },
      { key: 'status', label: 'Status' },
      { key: 'postedDate', label: 'Posted Date' },
      { key: 'updated', label: 'Updated' },
    ])
    toast.success('Export started', `${filteredListings.length} listings downloaded.`)
  }

  return (
    <div className="min-h-screen bg-canvas-alt px-2 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-heading-1 font-bold tracking-tight text-text-primary">
              Listing Management
            </h1>
            <p className="mt-1 text-body text-text-muted">
              Manage all property listings across the platform
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-2 rounded-button border border-outline bg-white px-4 py-2.5 text-body font-medium text-text-primary shadow-sm hover:bg-hover-light transition-colors"
            >
              Export CSV
            </button>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              <input
                type="text"
                placeholder="Search by ID, Owner or Location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-72 rounded-input border border-outline bg-white pl-9 pr-4 text-body text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </div>
        </div>

        <div className="flex border-b border-outline">
          {(['Enterprise', 'Non-Enterprise'] as ListingTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => { setActiveTab(tab); setCurrentPage(1) }}
              className={cn(
                'flex-1 py-4 text-center text-heading-3 font-bold transition-colors border-b-2',
                activeTab === tab ? 'border-navy text-text-primary' : 'border-transparent text-text-muted hover:text-text-primary',
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-label font-semibold uppercase text-text-muted">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="h-9 rounded-input border border-outline bg-white px-3 pr-8 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
              <option value="Flagged">Flagged</option>
              <option value="Removed">Removed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-label font-semibold uppercase text-text-muted">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="h-9 rounded-input border border-outline bg-white px-3 pr-8 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
            >
              <option value="latest">Latest Posted</option>
              <option value="highest-rent">Highest Rent</option>
              <option value="lowest-rent">Lowest Rent</option>
              <option value="updated">Recently Updated</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleNewListing}
            className="ml-auto inline-flex items-center gap-2 rounded-button bg-navy px-5 py-2.5 text-body font-semibold text-white shadow-sm transition-all duration-200 hover:bg-slate-800 hover:shadow-md"
          >
            <Plus size={16} />
            New Listing
          </button>
        </div>

        {/* Listings Table */}
        <div className="rounded-card border border-outline bg-white shadow-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline bg-canvas-alt">
                  <th className="px-6 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">Image</th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">Listing ID</th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">Owner</th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">Location</th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">Rent</th>
                  <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">Status</th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">Posted Date</th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">Updated</th>
                  <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredListings.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-body text-text-muted">
                      No listings match the current filters.
                    </td>
                  </tr>
                ) : (
                  filteredListings.map((listing) => (
                    <tr
                      key={listing.id}
                      onClick={() => handleRowClick(listing)}
                      className="border-b border-outline last:border-0 hover:bg-hover-light transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <img src={listing.image} alt={`Property ${listing.id}`} className="h-12 w-16 rounded-button object-cover" />
                      </td>
                      <td className="px-4 py-4 text-label font-medium text-text-muted">{listing.id}</td>
                      <td className="px-4 py-4 text-body font-medium text-text-primary">{listing.owner}</td>
                      <td className="px-4 py-4 text-body text-text-primary">{listing.location}</td>
                      <td className="px-4 py-4 text-body font-semibold text-text-primary">{listing.rent}</td>
                      <td className="px-4 py-4 text-center">
                        {(() => {
                          const occupancy = getOccupancyStatus(listing)
                          if (occupancy) {
                            return (
                              <span className={cn('inline-block rounded-pill px-3 py-1 text-badge font-bold', occupancyColors[occupancy])}>
                                {occupancy}
                              </span>
                            )
                          }
                          return (
                            <span className={cn('inline-block rounded-pill px-3 py-1 text-badge font-bold', statusColors[listing.status])}>
                              {listing.status}
                            </span>
                          )
                        })()}
                      </td>
                      <td className="px-4 py-4 text-label text-text-muted">{listing.postedDate}</td>
                      <td className="px-4 py-4 text-label text-text-muted">{listing.updated}</td>
                      <td className="px-4 py-4 text-center">
                        <ActionMenu
                          ariaLabel={`Actions for ${listing.id}`}
                          items={[
                            { label: 'View details', icon: Eye, onClick: () => handleRowClick(listing) },
                            { label: 'Edit listing', icon: Pencil, onClick: () => handleEditListing(listing) },
                            {
                              label: listing.status === 'Active' ? 'Pause listing' : 'Resume listing',
                              icon: listing.status === 'Active' ? Pause : Play,
                              onClick: () => handlePauseResume(listing),
                              disabled: listing.status === 'Removed',
                            },
                            { label: 'Flag for review', icon: Flag, variant: 'danger', onClick: () => handleFlag(listing), disabled: listing.status === 'Flagged' },
                            { label: 'Remove listing', icon: Trash2, variant: 'danger', onClick: () => handleRemove(listing) },
                          ]}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-outline px-6 py-4">
            <p className="text-label text-text-muted">
              Showing {filteredListings.length} of {stats.total} listings
            </p>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className="flex h-8 w-8 items-center justify-center rounded-button text-text-muted hover:bg-hover-light transition-colors" aria-label="Previous page">
                <ChevronLeft size={16} />
              </button>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={cn('h-8 w-8 rounded-button text-label font-medium transition-colors', currentPage === page ? 'bg-navy text-white' : 'text-text-muted hover:bg-hover-light border border-outline')}
                >
                  {page}
                </button>
              ))}
              <button type="button" onClick={() => setCurrentPage((p) => Math.min(3, p + 1))} className="flex h-8 w-8 items-center justify-center rounded-button text-text-muted hover:bg-hover-light transition-colors" aria-label="Next page">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <SummaryCard tone="primary" Icon={Home} value={stats.total} label="Total Properties" />
          <SummaryCard tone="success" Icon={CheckCircle2} value={stats.active} label="Active Listings" />
          <SummaryCard tone="error" Icon={ShieldAlert} value={stats.flagged} label="Pending Flags" />
        </div>
      </div>

      {newListingModalOpen && (
        <AdminNewListingModal
          segment={segment}
          onClose={() => setNewListingModalOpen(false)}
          onSubmit={(listing) => {
            addListing(listing)
            setNewListingModalOpen(false)
            toast.success('Listing created', `${listing.id} has been added as Paused.`)
          }}
        />
      )}
    </div>
  )
}

function SummaryCard({
  tone,
  Icon,
  value,
  label,
}: {
  tone: 'primary' | 'success' | 'error'
  Icon: typeof Home
  value: number
  label: string
}) {
  return (
    <div className="flex items-center gap-4 rounded-card border border-outline bg-white p-5 shadow-sm">
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-full',
          tone === 'primary' && 'bg-primary-100',
          tone === 'success' && 'bg-status-success-bg',
          tone === 'error' && 'bg-status-error-bg',
        )}
      >
        <Icon
          size={22}
          className={cn(
            tone === 'primary' && 'text-primary',
            tone === 'success' && 'text-status-success',
            tone === 'error' && 'text-status-error',
          )}
        />
      </div>
      <div>
        <p className="text-heading-2 font-bold text-text-primary">{value.toLocaleString()}</p>
        <p className="text-label text-text-muted">{label}</p>
      </div>
    </div>
  )
}
