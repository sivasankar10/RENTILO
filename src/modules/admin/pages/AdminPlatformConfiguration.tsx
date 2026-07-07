import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Shield } from 'lucide-react'
import { useAdminStore } from '../store/adminStore'
import { usePrototypeStore } from '@shared/store/prototypeStore'
import { ROUTES } from '@shared/constants/routes'

export function AdminPlatformConfiguration() {
  const navigate = useNavigate()
  const [apiClientId] = useState('********-4920-x492')
  const [secretToken] = useState('************************')
  const listingApprovals = useAdminStore((state) => state.listingApprovals)
  const promotedApprovals = useAdminStore((state) => state.promotedApprovals)
  const brokerRequests = usePrototypeStore((state) => state.adminRequests)

  const pendingListingCount = listingApprovals.filter((request) => request.status === 'Pending').length
  const pendingPromotedCount = promotedApprovals.filter((request) => request.status === 'Pending').length
  const pendingBrokerCount = brokerRequests.filter((request) => request.status === 'Pending').length
  const totalPending = pendingListingCount + pendingPromotedCount + pendingBrokerCount

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

        {/* Approval Requests pointer card */}
        <button
          type="button"
          onClick={() => navigate(ROUTES.ADMIN.APPROVAL_REQUESTS)}
          className="flex w-full items-center justify-between gap-4 rounded-card border border-outline bg-white p-6 text-left shadow-surface transition-colors hover:bg-hover-light"
        >
          <div>
            <h2 className="text-body-lg font-semibold text-text-primary">Approval Requests</h2>
            <p className="mt-1 text-label text-text-muted">
              Broker listing requests, listing approvals, and promoted listing approvals moved to
              their own page.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {totalPending > 0 && (
              <span className="rounded-pill bg-amber-50 px-3 py-1 text-badge font-bold text-amber-700">
                {totalPending} pending
              </span>
            )}
            <ArrowRight size={18} className="text-text-muted" />
          </div>
        </button>

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
      </div>
    </div>
  )
}
