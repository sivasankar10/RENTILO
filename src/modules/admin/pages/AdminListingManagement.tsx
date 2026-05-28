import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Home, MoreVertical, Plus, Search, ShieldAlert, CheckCircle2 } from 'lucide-react'
import { cn } from '@shared/utils/cn'

type ListingStatus = 'Active' | 'Paused' | 'Flagged' | 'Removed'
type ListingTab = 'Enterprise' | 'Non-Enterprise'

interface Listing {
  image: string
  id: string
  slug: string
  owner: string
  location: string
  rent: string
  status: ListingStatus
  postedDate: string
  updated: string
}

const enterpriseListings: Listing[] = [
  {
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=120&q=80',
    id: '#ENT-55201',
    slug: 'ent-55201',
    owner: 'Skyline Corp',
    location: 'Whitefield, Bangalore',
    rent: '₹4,50,000',
    status: 'Active',
    postedDate: '12 Oct 2023',
    updated: 'Just now',
  },
  {
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=120&q=80',
    id: '#ENT-55202',
    slug: 'ent-55202',
    owner: 'Prestige Group',
    location: 'Indiranagar, Bangalore',
    rent: '₹3,20,000',
    status: 'Active',
    postedDate: '08 Oct 2023',
    updated: '1 day ago',
  },
  {
    image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=120&q=80',
    id: '#ENT-55203',
    slug: 'ent-55203',
    owner: 'Brigade Enterprises',
    location: 'Bandra West, Mumbai',
    rent: '₹6,80,000',
    status: 'Paused',
    postedDate: '01 Oct 2023',
    updated: '3 days ago',
  },
  {
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=120&q=80',
    id: '#ENT-55204',
    slug: 'ent-55204',
    owner: 'DLF Limited',
    location: 'Cyber City, Gurgaon',
    rent: '₹8,50,000',
    status: 'Active',
    postedDate: '25 Sep 2023',
    updated: '5 hours ago',
  },
  {
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=120&q=80',
    id: '#ENT-55205',
    slug: 'ent-55205',
    owner: 'Godrej Properties',
    location: 'Worli, Mumbai',
    rent: '₹5,20,000',
    status: 'Flagged',
    postedDate: '18 Sep 2023',
    updated: '1 week ago',
  },
]

const nonEnterpriseListings: Listing[] = [
  {
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=120&q=80',
    id: '#LST-88210',
    slug: 'lst-88210',
    owner: 'Arjun Raghavan',
    location: 'Koramangala 4th B',
    rent: '₹85,000',
    status: 'Active',
    postedDate: '12 Oct 2023',
    updated: 'Just now',
  },
  {
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=120&q=80',
    id: '#LST-45902',
    slug: 'lst-45902',
    owner: 'Priya Sharma',
    location: 'EPIP Zone, Whitefi',
    rent: '₹1,20,000',
    status: 'Paused',
    postedDate: '05 Oct 2023',
    updated: '2 days ago',
  },
  {
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=120&q=80',
    id: '#LST-22314',
    slug: 'lst-22314',
    owner: 'Vikram Malhotra',
    location: 'Indiranagar, Doubl',
    rent: '₹45,000',
    status: 'Flagged',
    postedDate: '28 Sep 2023',
    updated: '5 days ago',
  },
  {
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=120&q=80',
    id: '#LST-11005',
    slug: 'lst-11005',
    owner: 'Sanya Reddy',
    location: 'Sarjapur Road, Bar',
    rent: '₹32,000',
    status: 'Removed',
    postedDate: '15 Sep 2023',
    updated: '1 week ago',
  },
  {
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=120&q=80',
    id: '#LST-99203',
    slug: 'lst-99203',
    owner: 'Karan Singh',
    location: 'HSR Layout Sector',
    rent: '₹32,500',
    status: 'Active',
    postedDate: '10 Sep 2023',
    updated: '3 hours ago',
  },
]

const statusColors: Record<ListingStatus, string> = {
  Active: 'bg-status-success-bg text-status-success-text',
  Paused: 'bg-amber-50 text-amber-700',
  Flagged: 'bg-status-error-bg text-status-error-text',
  Removed: 'bg-slate-100 text-slate-600',
}

export function AdminListingManagement() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<ListingTab>('Enterprise')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [sortBy, setSortBy] = useState('Latest Posted')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const sourceListings = activeTab === 'Enterprise' ? enterpriseListings : nonEnterpriseListings

  const filteredListings = sourceListings.filter((listing) => {
    if (statusFilter !== 'All Statuses' && listing.status !== statusFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        listing.id.toLowerCase().includes(q) ||
        listing.owner.toLowerCase().includes(q) ||
        listing.location.toLowerCase().includes(q)
      )
    }
    return true
  })

  const handleRowClick = (listing: Listing) => {
    if (activeTab === 'Enterprise') {
      navigate(`/admin/listing-management/enterprise/${listing.slug}`)
    } else {
      navigate(`/admin/listing-management/non-enterprise/${listing.slug}`)
    }
  }

  return (
    <div className="min-h-screen bg-canvas-alt px-2 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-heading-1 font-bold tracking-tight text-text-primary">
              Listing Management
            </h1>
            <p className="mt-1 text-body text-text-muted">
              Manage all property listings across the platform
            </p>
          </div>
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by ID, Owner or Location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-72 rounded-input border border-outline bg-white pl-9 pr-4 text-body text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* Enterprise / Non-Enterprise Tabs */}
        <div className="flex border-b border-outline">
          {(['Enterprise', 'Non-Enterprise'] as ListingTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => { setActiveTab(tab); setCurrentPage(1) }}
              className={cn(
                'flex-1 py-4 text-center text-heading-3 font-bold transition-colors border-b-2',
                activeTab === tab
                  ? 'border-navy text-text-primary'
                  : 'border-transparent text-text-muted hover:text-text-primary',
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-label font-semibold uppercase text-text-muted">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-input border border-outline bg-white px-3 pr-8 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
            >
              <option>All Statuses</option>
              <option>Active</option>
              <option>Paused</option>
              <option>Flagged</option>
              <option>Removed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-label font-semibold uppercase text-text-muted">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9 rounded-input border border-outline bg-white px-3 pr-8 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
            >
              <option>Latest Posted</option>
              <option>Highest Rent</option>
              <option>Lowest Rent</option>
              <option>Recently Updated</option>
            </select>
          </div>

          <button
            type="button"
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
                  <th className="px-6 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    Image
                  </th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    Listing ID
                  </th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    Owner
                  </th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    Rent
                  </th>
                  <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    Posted Date
                  </th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    Updated
                  </th>
                  <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredListings.map((listing) => (
                  <tr
                    key={listing.id}
                    onClick={() => handleRowClick(listing)}
                    className="border-b border-outline last:border-0 hover:bg-hover-light transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <img
                        src={listing.image}
                        alt={`Property ${listing.id}`}
                        className="h-12 w-16 rounded-button object-cover"
                      />
                    </td>
                    <td className="px-4 py-4 text-label font-medium text-text-muted">
                      {listing.id}
                    </td>
                    <td className="px-4 py-4 text-body font-medium text-text-primary">
                      {listing.owner}
                    </td>
                    <td className="px-4 py-4 text-body text-text-primary">
                      {listing.location}
                    </td>
                    <td className="px-4 py-4 text-body font-semibold text-text-primary">
                      {listing.rent}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={cn(
                          'inline-block rounded-pill px-3 py-1 text-badge font-bold',
                          statusColors[listing.status],
                        )}
                      >
                        {listing.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-label text-text-muted">
                      {listing.postedDate}
                    </td>
                    <td className="px-4 py-4 text-label text-text-muted">
                      {listing.updated}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        type="button"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-button text-text-muted hover:bg-hover-light hover:text-text-primary transition-colors"
                        aria-label={`Actions for ${listing.id}`}
                      >
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-outline px-6 py-4">
            <p className="text-label text-text-muted">
              Showing 1-5 of {activeTab === 'Enterprise' ? '842' : '1,284'} listings
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-button text-text-muted hover:bg-hover-light transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
              {[1, 2, 3].map((page) => (
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
              <span className="px-1 text-label text-text-muted">...</span>
              <button
                type="button"
                className="h-8 rounded-button border border-outline px-2 text-label font-medium text-text-muted hover:bg-hover-light transition-colors"
              >
                {activeTab === 'Enterprise' ? '169' : '257'}
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-button text-text-muted hover:bg-hover-light transition-colors"
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center gap-4 rounded-card border border-outline bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
              <Home size={22} className="text-primary" />
            </div>
            <div>
              <p className="text-heading-2 font-bold text-text-primary">
                {activeTab === 'Enterprise' ? '842' : '1,284'}
              </p>
              <p className="text-label text-text-muted">Total Properties</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-card border border-outline bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-status-success-bg">
              <CheckCircle2 size={22} className="text-status-success" />
            </div>
            <div>
              <p className="text-heading-2 font-bold text-text-primary">
                {activeTab === 'Enterprise' ? '678' : '942'}
              </p>
              <p className="text-label text-text-muted">Active Listings</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-card border border-outline bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-status-error-bg">
              <ShieldAlert size={22} className="text-status-error" />
            </div>
            <div>
              <p className="text-heading-2 font-bold text-text-primary">
                {activeTab === 'Enterprise' ? '5' : '12'}
              </p>
              <p className="text-label text-text-muted">Pending Flags</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
