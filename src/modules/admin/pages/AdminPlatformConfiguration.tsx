import { useState } from 'react'
import { Filter, Shield } from 'lucide-react'

interface ListingRequest {
  id: string
  image: string
  location: string
  owner: string
  type: string
}

interface PromotedRequest {
  id: string
  image: string
  location: string
  owner: string
  tier: string
  tierColor: string
}

const listingRequests: ListingRequest[] = [
  {
    id: 'RF-99210',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=80&q=80',
    location: 'Bandra West, Mumbai',
    owner: 'Vikram Malhotra',
    type: '1 BHK',
  },
  {
    id: 'RF-88219',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=80&q=80',
    location: 'Whitefield, Bangalore',
    owner: 'Anjali Gupta',
    type: '3 BHK',
  },
]

const promotedRequests: PromotedRequest[] = [
  {
    id: 'RF-99210',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=80&q=80',
    location: 'Bandra West, Mumbai',
    owner: 'Vikram Malhotra',
    tier: 'Premium',
    tierColor: 'text-status-error',
  },
  {
    id: 'RF-88219',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=80&q=80',
    location: 'Whitefield, Bangalore',
    owner: 'Anjali Gupta',
    tier: 'Free',
    tierColor: 'text-text-muted',
  },
]

export function AdminPlatformConfiguration() {
  const [apiClientId] = useState('********-4920-x492')
  const [secretToken] = useState('************************')

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

        {/* Listings Approval Section */}
        <div className="rounded-card border border-outline bg-white shadow-surface overflow-hidden">
          <div className="border-b border-outline px-6 py-4">
            <h2 className="text-body-lg font-semibold text-text-primary">Listings Approval</h2>
            <p className="mt-0.5 text-label text-text-muted">3 requests awaiting manual review</p>
          </div>

          <div className="px-6 py-3 flex justify-end border-b border-outline">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-label font-medium text-text-muted hover:text-text-primary transition-colors"
            >
              <Filter size={14} />
              Filter
            </button>
          </div>

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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {listingRequests.map((req) => (
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
                      <span className="text-label font-medium text-primary">{req.type}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          className="rounded-button border border-status-error px-4 py-1.5 text-badge font-bold text-status-error hover:bg-status-error-bg transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          className="rounded-button bg-teal-600 px-4 py-1.5 text-badge font-bold text-white hover:bg-teal-700 transition-colors"
                        >
                          Approve
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
            <p className="mt-0.5 text-label text-text-muted">3 requests awaiting manual review</p>
          </div>

          <div className="px-6 py-3 flex justify-end border-b border-outline">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-label font-medium text-text-muted hover:text-text-primary transition-colors"
            >
              <Filter size={14} />
              Filter
            </button>
          </div>

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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {promotedRequests.map((req) => (
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
                      <span className={`text-label font-medium ${req.tierColor}`}>{req.tier}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          className="rounded-button border border-status-error px-4 py-1.5 text-badge font-bold text-status-error hover:bg-status-error-bg transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          className="rounded-button bg-teal-600 px-4 py-1.5 text-badge font-bold text-white hover:bg-teal-700 transition-colors"
                        >
                          Approve
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
