import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Navigation,
  Pencil,
  Share2,
  ShieldCheck,
  TrendingUp,
  Lock,
  Accessibility,
  Building2,
  Car,
} from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { ROUTES } from '@shared/constants/routes'

type Step = {
  number: number
  label: string
  active: boolean
  completed: boolean
}

const steps: Step[] = [
  { number: 1, label: 'Basic Information', active: false, completed: true },
  { number: 2, label: 'Property Location', active: true, completed: false },
  { number: 3, label: 'Amenities & Features', active: false, completed: false },
  { number: 4, label: 'Media & Gallery', active: false, completed: false },
  { number: 5, label: 'Pricing & Lease', active: false, completed: false },
]

const accessibilityFeatures = [
  { icon: Accessibility, label: 'Wheelchair Access' },
  { icon: Building2, label: 'Elevator in Building' },
  { icon: Car, label: 'On-site Parking' },
]

export function AdminNonEnterprisePropertyDetail() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-canvas-alt px-2 py-6 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <h1 className="text-heading-2 font-bold tracking-tight text-text-primary">
            View - Non enterprise Overview
          </h1>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-button border border-outline bg-white px-4 py-2.5 text-body font-medium text-text-primary shadow-sm hover:bg-hover-light transition-colors"
            >
              <Pencil size={14} />
              Edit Details
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-button bg-navy px-4 py-2.5 text-body font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
            >
              <Share2 size={14} />
              Share Report
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Left Sidebar - Steps */}
          <div className="space-y-6">
            {/* Step Navigation */}
            <div className="rounded-card border border-outline bg-white p-5 shadow-sm">
              <nav className="space-y-4">
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className="flex items-start gap-3"
                  >
                    <div
                      className={cn(
                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-badge font-bold',
                        step.completed
                          ? 'bg-primary text-white'
                          : step.active
                            ? 'bg-navy text-white'
                            : 'bg-slate-100 text-text-muted',
                      )}
                    >
                      {step.completed ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        step.number
                      )}
                    </div>
                    <span
                      className={cn(
                        'text-body pt-0.5',
                        step.active
                          ? 'font-bold text-text-primary'
                          : step.completed
                            ? 'font-medium text-text-primary'
                            : 'font-medium text-text-muted',
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </nav>
            </div>

            {/* Need Assistance Card */}
            <div className="rounded-card bg-primary-100 p-5">
              <h3 className="text-body font-bold text-text-primary">Need Assistance?</h3>
              <p className="mt-2 text-label leading-5 text-text-muted">
                Our onboarding specialists are available 24x7 to help you optimize your listing.
              </p>
              <button
                type="button"
                className="mt-4 inline-flex items-center gap-2 text-label font-bold text-navy hover:text-primary transition-colors"
              >
                📞 Contact Support
              </button>
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-6">
            {/* Location Details */}
            <div className="rounded-card border border-outline bg-white p-6 shadow-surface">
              <h2 className="text-heading-3 font-bold text-text-primary">Location Details</h2>
              <p className="mt-1 text-label text-text-muted">
                Precisely mark the location to help potential tenants find their next home.
              </p>

              <div className="mt-6 space-y-4">
                {/* Street Address */}
                <div>
                  <label className="text-label font-medium text-text-muted">Street Address</label>
                  <input
                    type="text"
                    defaultValue="123 Architecture Blvd"
                    className="mt-1.5 h-10 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                  />
                  <p className="mt-1 text-label text-text-muted">
                    Full legal address as it appears on title deeds.
                  </p>
                </div>

                {/* Unit / Postal Code Row */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-label font-medium text-text-muted">Unit / Suite Number</label>
                    <input
                      type="text"
                      defaultValue="Apt 4B"
                      className="mt-1.5 h-10 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="text-label font-medium text-text-muted">Postal Code</label>
                    <input
                      type="text"
                      defaultValue="10001"
                      className="mt-1.5 h-10 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                    />
                  </div>
                </div>

                {/* City / Neighborhood Row */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-label font-medium text-text-muted">City</label>
                    <input
                      type="text"
                      defaultValue="New York"
                      className="mt-1.5 h-10 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="text-label font-medium text-text-muted">Neighborhood</label>
                    <input
                      type="text"
                      defaultValue="Manhattan"
                      className="mt-1.5 h-10 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Map Pin */}
            <div className="rounded-card border border-outline bg-white p-6 shadow-surface">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-heading-3 font-bold text-text-primary">Map Pin</h2>
                  <p className="mt-0.5 text-label text-text-muted">
                    Drag the pin to the exact entrance of the property.
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-button border border-outline bg-white px-3 py-2 text-label font-medium text-text-primary hover:bg-hover-light transition-colors"
                >
                  <Navigation size={14} />
                  Use GPS
                </button>
              </div>

              {/* Map placeholder */}
              <div className="mt-4 relative h-56 rounded-button bg-slate-200 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=60')] bg-cover bg-center opacity-60" />
                <div className="absolute inset-0 bg-navy/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy/80 text-white shadow-lg">
                    <MapPin size={22} />
                  </div>
                </div>
              </div>
            </div>

            {/* Zoning & Accessibility */}
            <div className="rounded-card border border-outline bg-white p-6 shadow-surface">
              <h2 className="text-heading-3 font-bold text-text-primary">Zoning & Accessibility</h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {/* Residential Zoning */}
                <div className="flex items-start gap-3 rounded-button border border-outline p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-button bg-canvas-alt">
                    <Building2 size={18} className="text-text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-body font-semibold text-text-primary">Residential Zoning</p>
                    <p className="text-label text-text-muted">Approved for standard long-term housing.</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="mt-1 h-4 w-4 rounded border-outline text-navy focus:ring-primary"
                  />
                </div>

                {/* Mixed Use */}
                <div className="flex items-start gap-3 rounded-button border border-outline p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-button bg-canvas-alt">
                    <Building2 size={18} className="text-text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-body font-semibold text-text-primary">Mixed Use</p>
                    <p className="text-label text-text-muted">Permits commercial ground-floor operations.</p>
                  </div>
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-outline text-navy focus:ring-primary"
                  />
                </div>
              </div>

              {/* Accessibility Features */}
              <div className="mt-6">
                <p className="text-body font-medium text-text-primary">Accessibility Features</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {accessibilityFeatures.map((feature) => {
                    const Icon = feature.icon
                    return (
                      <span
                        key={feature.label}
                        className="inline-flex items-center gap-2 rounded-pill border border-outline bg-white px-3 py-1.5 text-label font-medium text-text-primary"
                      >
                        <Icon size={14} className="text-text-muted" />
                        {feature.label}
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate(ROUTES.ADMIN.LISTING_MANAGEMENT)}
                className="inline-flex items-center gap-2 text-body font-medium text-text-muted hover:text-text-primary transition-colors"
              >
                <ArrowLeft size={16} />
                Previous Step
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-button bg-navy px-6 py-3 text-body font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
              >
                Continue to Amenities
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Info Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-start gap-3 rounded-card border border-outline bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100">
              <ShieldCheck size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-body font-bold text-text-primary">Verified Listings</p>
              <p className="text-label text-text-muted">
                Verified properties receive 5x more views and inquiries.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-card border border-outline bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-status-error-bg">
              <TrendingUp size={18} className="text-status-error" />
            </div>
            <div>
              <p className="text-body font-bold text-text-primary">Pricing Insights</p>
              <p className="text-label text-text-muted">
                We'll suggest optimal rents based on local market data.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-card border border-outline bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-status-error-bg">
              <Lock size={18} className="text-status-error" />
            </div>
            <div>
              <p className="text-body font-bold text-text-primary">Data Privacy</p>
              <p className="text-label text-text-muted">
                Your property documents are encrypted and secure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
