import { useState } from 'react'
import {
  Accessibility,
  ArrowLeft,
  ArrowRight,
  Check,
  Crosshair,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { cn } from '@shared/utils/cn'

const stepLabels = [
  'Basic Information',
  'Property Location',
  'Amenities, Features & Rules',
  'Media & Gallery',
  'Pricing & Lease',
]

const features = ['Wheelchair Access', 'Elevator in Building', 'On-site Parking']

const trustCards = [
  {
    icon: ShieldCheck,
    title: 'Verified Listings',
    description: 'Verified properties receive 2x more views and inquiries.',
    tone: 'blue',
  },
  {
    icon: Sparkles,
    title: 'Pricing Insights',
    description: 'We suggest optimal rent based on local market data.',
    tone: 'amber',
  },
  {
    icon: LockKeyhole,
    title: 'Data Privacy',
    description: 'Your property documents are encrypted and secure.',
    tone: 'red',
  },
]

export function OwnerProperties() {
  const [currentStep, setCurrentStep] = useState(1)
  const [draftStatus, setDraftStatus] = useState('')
  const [supportStatus, setSupportStatus] = useState('')
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(features)
  const [pin, setPin] = useState({ x: 50, y: 50 })
  const [form, setForm] = useState({
    streetAddress: 'e.g., 123 Architecture Blvd',
    unit: 'Apt 4B',
    postalCode: '10001',
    city: 'New York City',
    neighborhood: 'Manhattan',
  })

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setDraftStatus('')
  }

  const toggleFeature = (feature: string) => {
    setSelectedFeatures((current) =>
      current.includes(feature)
        ? current.filter((item) => item !== feature)
        : [...current, feature]
    )
  }

  return (
    <div className="min-h-screen bg-canvas-alt px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-label text-text-muted">
              <span>Properties</span>
              <span>/</span>
              <span className="text-text-primary">Add New Listing</span>
            </div>
            <h1 className="mt-2 text-heading-2 font-bold tracking-tight text-text-primary">
              Register New Property
            </h1>
            {draftStatus && <p className="mt-2 text-label text-status-success-text">{draftStatus}</p>}
          </div>

          <button
            type="button"
            onClick={() => setDraftStatus('Draft saved locally.')}
            className="w-fit rounded-button border border-outline-variant bg-white px-4 py-2 text-label font-semibold text-text-primary transition-all duration-200 hover:bg-hover-light hover:shadow-sm"
          >
            Save as Draft
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <div className="rounded-card border border-outline bg-white p-5 shadow-sm">
              <ol className="space-y-5">
                {stepLabels.map((label, index) => {
                  const stepNumber = index + 1
                  const isDone = stepNumber < currentStep
                  const isActive = stepNumber === currentStep
                  return (
                    <li key={label}>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(stepNumber)}
                        className="flex w-full gap-3 text-left"
                      >
                        <div
                          className={cn(
                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-label font-bold',
                            isDone && 'bg-navy text-white',
                            isActive && 'border border-navy bg-white text-navy',
                            !isDone && !isActive && 'bg-slate-100 text-text-muted'
                          )}
                        >
                          {isDone ? <Check size={14} /> : stepNumber}
                        </div>
                        <p
                          className={cn(
                            'text-label font-bold leading-4',
                            isActive || isDone ? 'text-text-primary' : 'text-text-muted'
                          )}
                        >
                          {label}
                        </p>
                      </button>
                    </li>
                  )
                })}
              </ol>
            </div>

            <div className="rounded-card bg-primary-100 p-5 text-text-primary">
              <p className="text-label font-bold">Need Assistance?</p>
              <p className="mt-3 text-label leading-5 text-text-primary">
                Our onboarding specialists are available 24/7 to help you optimize your listing.
              </p>
              <button
                type="button"
                onClick={() => setSupportStatus('Support request queued.')}
                className="mt-4 inline-flex items-center gap-2 text-label font-bold text-navy"
              >
                <ArrowRight size={14} />
                Contact Support
              </button>
              {supportStatus && <p className="mt-3 text-label text-primary">{supportStatus}</p>}
            </div>
          </aside>

          <section className="space-y-6">
            <article className="overflow-hidden rounded-card border border-outline bg-white shadow-sm">
              <div className="border-b border-outline bg-white px-6 py-5">
                <h2 className="text-heading-3 font-bold text-text-primary">Location Details</h2>
                <p className="mt-1 text-label text-text-muted">
                  Precisely mark the location to help potential tenants find their next home.
                </p>
              </div>

              <div className="space-y-5 p-6">
                <label className="block">
                  <span className="text-label font-medium text-text-primary">Street Address</span>
                  <input
                    type="text"
                    value={form.streetAddress}
                    onChange={(event) => updateField('streetAddress', event.target.value)}
                    className="mt-2 w-full rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary-100"
                  />
                  <span className="mt-2 block text-label text-text-muted">
                    Full legal address as it appears on title deeds.
                  </span>
                </label>

                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="text-label font-medium text-text-primary">Unit / Suite Number</span>
                    <input
                      type="text"
                      value={form.unit}
                      onChange={(event) => updateField('unit', event.target.value)}
                      className="mt-2 w-full rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary-100"
                    />
                  </label>

                  <label className="block">
                    <span className="text-label font-medium text-text-primary">Postal Code</span>
                    <input
                      type="text"
                      value={form.postalCode}
                      onChange={(event) => updateField('postalCode', event.target.value)}
                      className="mt-2 w-full rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary-100"
                    />
                  </label>

                  <label className="block">
                    <span className="text-label font-medium text-text-primary">City</span>
                    <select
                      value={form.city}
                      onChange={(event) => updateField('city', event.target.value)}
                      className="mt-2 w-full rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary-100"
                    >
                      <option>New York City</option>
                      <option>Chicago</option>
                      <option>San Francisco</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-label font-medium text-text-primary">Neighborhood</span>
                    <input
                      type="text"
                      value={form.neighborhood}
                      onChange={(event) => updateField('neighborhood', event.target.value)}
                      className="mt-2 w-full rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary-100"
                    />
                  </label>
                </div>
              </div>
            </article>

            <article className="overflow-hidden rounded-card border border-outline bg-white shadow-sm">
              <div className="flex items-start justify-between gap-4 border-b border-outline px-6 py-5">
                <div>
                  <h2 className="text-heading-3 font-bold text-text-primary">Map Pin</h2>
                  <p className="mt-1 text-label text-text-muted">
                    Click the map or use GPS to set the property entrance.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPin({ x: 58, y: 46 })}
                  className="inline-flex items-center gap-2 rounded-button bg-primary-100 px-3 py-2 text-label font-bold text-primary transition-colors duration-200 hover:bg-active"
                >
                  <Crosshair size={14} />
                  Use GPS
                </button>
              </div>

              <div className="p-0">
                <button
                  type="button"
                  onClick={(event) => {
                    const rect = event.currentTarget.getBoundingClientRect()
                    setPin({
                      x: ((event.clientX - rect.left) / rect.width) * 100,
                      y: ((event.clientY - rect.top) / rect.height) * 100,
                    })
                  }}
                  className="relative block h-80 w-full overflow-hidden bg-slate-700 text-left"
                >
                  <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:32px_32px]" />
                  <div className="absolute inset-0 [background-image:radial-gradient(circle_at_42%_28%,rgba(255,255,255,0.25),transparent_10%),radial-gradient(circle_at_74%_60%,rgba(255,255,255,0.22),transparent_8%),linear-gradient(135deg,transparent_40%,rgba(255,255,255,0.28)_41%,rgba(255,255,255,0.28)_43%,transparent_44%)]" />
                  <div
                    className="absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-modal bg-navy text-white shadow-modal transition-all duration-200"
                    style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                  >
                    <MapPin size={22} />
                  </div>
                </button>

                <div className="min-h-56 px-6 py-6">
                  <p className="text-label font-medium text-text-primary">Accessibility Features</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {features.map((feature) => {
                      const selected = selectedFeatures.includes(feature)
                      return (
                        <button
                          type="button"
                          key={feature}
                          onClick={() => toggleFeature(feature)}
                          className={cn(
                            'inline-flex items-center gap-1 rounded-pill px-3 py-1.5 text-badge transition-colors duration-200',
                            selected
                              ? 'bg-primary-100 text-primary'
                              : 'bg-slate-100 text-text-primary hover:bg-hover-light'
                          )}
                        >
                          {feature === 'Wheelchair Access' ? (
                            <Accessibility size={12} />
                          ) : (
                            <MapPin size={12} />
                          )}
                          {feature}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </article>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep((step) => Math.max(1, step - 1))}
                className="inline-flex items-center gap-2 rounded-button px-4 py-3 text-body font-semibold text-text-primary transition-colors duration-200 hover:bg-hover-light"
              >
                <ArrowLeft size={16} />
                Previous Step
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep((step) => Math.min(stepLabels.length, step + 1))}
                className="inline-flex items-center justify-center gap-3 rounded-button bg-navy px-8 py-3 text-body font-semibold text-white shadow-sm transition-all duration-200 hover:bg-slate-800 hover:shadow-md"
              >
                Continue
                <ArrowRight size={16} />
              </button>
            </div>
          </section>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {trustCards.map((card) => {
            const Icon = card.icon
            return (
              <article
                key={card.title}
                className="flex items-start gap-4 rounded-card border border-outline bg-white p-5 shadow-sm"
              >
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-button',
                    card.tone === 'blue' && 'bg-primary-100 text-primary',
                    card.tone === 'amber' && 'bg-status-warning-bg text-status-warning-text',
                    card.tone === 'red' && 'bg-status-error-bg text-status-error-text'
                  )}
                >
                  <Icon size={18} />
                </div>
                <div>
                  <h3 className="text-body font-bold text-text-primary">{card.title}</h3>
                  <p className="mt-1 text-label leading-5 text-text-muted">{card.description}</p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}
