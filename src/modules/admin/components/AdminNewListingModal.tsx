import { useMemo, useState } from 'react'
import {
  Accessibility,
  ArrowLeft,
  ArrowRight,
  Building2,
  Camera,
  Car,
  Check,
  CheckCircle2,
  Dumbbell,
  Image,
  Lock,
  Plus,
  ShieldCheck,
  Star,
  TrendingUp,
  Upload,
  Video,
  Waves,
  X,
  Zap,
} from 'lucide-react'
import { cn } from '@shared/utils/cn'
import type { OwnerRegisterPropertyFormData } from '@modules/owner/store/ownerStore'
import type { AdminListing } from '../store/adminStore'

// ── Types ──────────────────────────────────────────────
type StepNumber = 1 | 2 | 3 | 4 | 5

interface StepDef {
  number: StepNumber
  label: string
}

type StepProps = {
  formData: OwnerRegisterPropertyFormData
  update: <K extends keyof OwnerRegisterPropertyFormData>(
    key: K,
    val: OwnerRegisterPropertyFormData[K]
  ) => void
}

// ── Constants ──────────────────────────────────────────
const steps: StepDef[] = [
  { number: 1, label: 'Basic Information' },
  { number: 2, label: 'Property Location' },
  { number: 3, label: 'Amenities & Features' },
  { number: 4, label: 'Media & Gallery' },
  { number: 5, label: 'Pricing & Lease' },
]

const initialFormData: OwnerRegisterPropertyFormData = {
  propertyName: '',
  propertyType: '',
  yearBuilt: '',
  referenceId: '',
  currentStatus: 'Available for Rent',
  description: '',
  streetAddress: '',
  unit: '',
  postalCode: '',
  city: '',
  neighborhood: '',
  residentialZoning: true,
  mixedUse: false,
  amenities: { wifi: false, ac: false, heating: false, smartLock: false, washerDryer: false, dishwasher: false },
  buildingFeatures: { gym: false, pool: false, parking: false, security: false },
  sellingPoints: '',
  customTags: [],
  photos: [],
  virtualTourUrl: '',
  baseRent: '',
  priceNegotiable: true,
  securityDeposit: '',
  depositUnit: 'Months',
  availableFrom: '',
  visitWeekday: 'Saturday',
  visitStartTime: '10:00 AM',
  visitEndTime: '1:00 PM',
  preferredVisitSlots: [{ day: 'Saturday', startTime: '10:00 AM', endTime: '1:00 PM' }],
  visitSchedulingEnabled: true,
  leaseDuration: 12,
  noticePeriod: '30',
  utilities: { electricity: false, water: false, internet: false, gas: false },
  petPolicy: false,
  petDetails: '',
}

// ── Main Modal ─────────────────────────────────────────
interface AdminNewListingModalProps {
  segment: 'enterprise' | 'non-enterprise'
  onClose: () => void
  onSubmit: (listing: AdminListing) => void
}

export function AdminNewListingModal({ segment, onClose, onSubmit }: AdminNewListingModalProps) {
  const [currentStep, setCurrentStep] = useState<StepNumber>(1)
  const [formData, setFormData] = useState<OwnerRegisterPropertyFormData>({ ...initialFormData })

  const update = <K extends keyof OwnerRegisterPropertyFormData>(
    key: K,
    val: OwnerRegisterPropertyFormData[K]
  ) => setFormData((prev) => ({ ...prev, [key]: val }))

  const goNext = () => setCurrentStep((s) => Math.min(5, s + 1) as StepNumber)
  const goPrev = () => setCurrentStep((s) => Math.max(1, s - 1) as StepNumber)

  const handleSubmit = () => {
    const id = `#${segment === 'enterprise' ? 'ENT' : 'LST'}-${Math.floor(10000 + Math.random() * 90000)}`
    const slug = id.replace('#', '').toLowerCase()
    const listing: AdminListing = {
      id,
      slug,
      segment,
      image: formData.photos[0] ?? 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=120&q=80',
      propertyTitle: formData.propertyName || 'Untitled Listing',
      propertyType: formData.propertyType || undefined,
      owner: 'Admin',
      location:
        [formData.neighborhood, formData.city].filter(Boolean).join(', ') ||
        formData.streetAddress ||
        'Location TBC',
      rent: formData.baseRent ? `₹${Number(formData.baseRent).toLocaleString()}` : '₹0',
      status: 'Paused',
      streetAddress: formData.streetAddress || undefined,
      unit: formData.unit || undefined,
      postalCode: formData.postalCode || undefined,
      city: formData.city || undefined,
      neighborhood: formData.neighborhood || undefined,
      residentialZoning: formData.residentialZoning,
      mixedUse: formData.mixedUse,
      description: formData.description || undefined,
      virtualTourUrl: formData.virtualTourUrl || undefined,
      availableFrom: formData.availableFrom || undefined,
      leaseTerm: formData.leaseDuration ? `${formData.leaseDuration} months` : undefined,
      deposit: formData.securityDeposit || undefined,
      postedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      updated: 'Just now',
    }
    onSubmit(listing)
  }

  const stepLabels: Record<number, string> = {
    1: 'Continue to Location',
    2: 'Continue to Amenities',
    3: 'Continue to Media & Gallery',
    4: 'Continue to Pricing & Lease',
  }

  return (
    /* Full-viewport overlay */
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/60 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Modal container: fixed max size, flex column, no overflow on container itself */}
      <div className="relative flex flex-col w-full max-w-6xl bg-white rounded-2xl shadow-modal"
        style={{ maxHeight: 'calc(100vh - 2rem)' }}
      >

        {/* ── Fixed Header ── */}
        <div className="flex items-center justify-between border-b border-outline px-6 py-4 shrink-0">
          <div>
            <p className="text-label font-semibold uppercase tracking-wider text-primary">
              {segment === 'enterprise' ? 'Enterprise' : 'Non-Enterprise'} Listing
            </p>
            <h2 className="mt-0.5 text-heading-2 font-bold text-text-primary">Add New Listing</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-button text-text-muted hover:bg-hover-light hover:text-text-primary transition-colors"
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* Step sidebar — fixed width, scrolls independently */}
          <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-outline bg-canvas-alt overflow-y-auto p-6 gap-6">
            <nav className="space-y-2">
              {steps.map((step) => {
                const isCompleted = step.number < currentStep
                const isActive = step.number === currentStep
                return (
                  <button
                    type="button"
                    key={step.number}
                    onClick={() => setCurrentStep(step.number)}
                    className="flex w-full items-start gap-3 text-left rounded-button px-2 py-2 hover:bg-hover-light transition-colors"
                  >
                    <div className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-badge font-bold mt-0.5',
                      isCompleted ? 'bg-primary text-white' :
                      isActive ? 'bg-navy text-white' :
                      'bg-slate-100 text-text-muted',
                    )}>
                      {isCompleted ? <Check size={14} /> : step.number}
                    </div>
                    <span className={cn(
                      'text-body',
                      isActive ? 'font-bold text-text-primary' :
                      isCompleted ? 'font-medium text-text-primary' :
                      'font-medium text-text-muted',
                    )}>
                      {step.label}
                    </span>
                  </button>
                )
              })}
            </nav>

            <div className="rounded-card bg-primary-100 p-4">
              <h3 className="text-body font-bold text-text-primary">Admin Note</h3>
              <p className="mt-2 text-label leading-5 text-text-muted">
                Listing will be created as <strong>Paused</strong> and can be reviewed before going live.
              </p>
            </div>
          </aside>

          {/* Main content area — scrolls */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {currentStep === 1 && <Step1BasicInfo formData={formData} update={update} />}
              {currentStep === 2 && <Step2Location formData={formData} update={update} />}
              {currentStep === 3 && <Step3Amenities formData={formData} update={update} />}
              {currentStep === 4 && <Step4Media formData={formData} update={update} />}
              {currentStep === 5 && (
                <Step5Pricing formData={formData} update={update} />
              )}
            </div>
          </div>
        </div>

        {/* ── Fixed Footer Navigation ── */}
        <div className="flex items-center justify-between border-t border-outline bg-white px-6 py-4 shrink-0 rounded-b-2xl">
          {/* Previous — always reserve space so layout doesn't shift */}
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={goPrev}
              className="inline-flex items-center gap-2 rounded-button border border-outline bg-white px-5 py-2.5 text-body font-medium text-text-primary hover:bg-hover-light transition-colors"
            >
              <ArrowLeft size={16} />
              Previous Step
            </button>
          ) : (
            <span />
          )}

          {/* Next / Submit */}
          {currentStep < 5 ? (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center gap-2 rounded-button bg-navy px-6 py-2.5 text-body font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
            >
              {stepLabels[currentStep]}
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 rounded-button bg-navy px-6 py-2.5 text-body font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
            >
              Complete Registration
              <CheckCircle2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Step 1: Basic Information ──────────────────────────
function Step1BasicInfo({ formData, update }: StepProps) {
  return (
    <div className="rounded-card border border-outline bg-white p-6 shadow-sm space-y-5">
      <div>
        <h2 className="text-heading-3 font-bold text-text-primary">Basic Information</h2>
        <p className="mt-1 text-label text-text-muted">Provide the primary details identifying this property.</p>
      </div>

      <div>
        <label className="text-body font-medium text-text-primary">Property Name / Title</label>
        <input
          type="text"
          placeholder="e.g., The Grand Palace"
          value={formData.propertyName}
          onChange={(e) => update('propertyName', e.target.value)}
          className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
        <p className="mt-1 text-label text-text-muted">A clear, descriptive title to attract potential tenants.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-body font-medium text-text-primary">Property Type</label>
          <select value={formData.propertyType} onChange={(e) => update('propertyType', e.target.value)}
            className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30">
            <option value="">Select Property Type</option>
            <option>Apartment</option>
            <option>Villa</option>
            <option>Penthouse</option>
            <option>Commercial Office</option>
            <option>Studio</option>
          </select>
        </div>
        <div>
          <label className="text-body font-medium text-text-primary">Year Built</label>
          <input type="text" placeholder="YYYY" value={formData.yearBuilt} onChange={(e) => update('yearBuilt', e.target.value)}
            className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-body font-medium text-text-primary">Internal Reference ID (Optional)</label>
          <input type="text" placeholder="e.g., BLDG-A-101" value={formData.referenceId} onChange={(e) => update('referenceId', e.target.value)}
            className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
        </div>
        <div>
          <label className="text-body font-medium text-text-primary">Current Status</label>
          <select value={formData.currentStatus} onChange={(e) => update('currentStatus', e.target.value)}
            className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30">
            <option>Available for Rent</option>
            <option>Under Renovation</option>
            <option>Occupied</option>
          </select>
        </div>
      </div>

      <div>
        <h3 className="text-body font-bold text-text-primary">Property Description</h3>
        <textarea placeholder="Describe the property, highlighting key selling points..."
          value={formData.description} onChange={(e) => update('description', e.target.value.slice(0, 1000))}
          rows={4}
          className="mt-2 w-full rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none" />
        <p className="mt-1 text-right text-label text-text-muted">{formData.description.length} / 1000 characters</p>
      </div>
    </div>
  )
}

// ── Step 2: Property Location ──────────────────────────
function Step2Location({ formData, update }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-card border border-outline bg-white p-6 shadow-sm space-y-5">
        <div>
          <h2 className="text-heading-3 font-bold text-text-primary">Location Details</h2>
          <p className="mt-1 text-label text-text-muted">Precisely mark the location to help potential tenants find their next home.</p>
        </div>
        <div>
          <label className="text-body font-medium text-text-primary">Street Address</label>
          <input type="text" placeholder="e.g., 123 Architecture Blvd" value={formData.streetAddress}
            onChange={(e) => update('streetAddress', e.target.value)}
            className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
          <p className="mt-1 text-label text-text-muted">Full legal address as it appears on title deeds.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-body font-medium text-text-primary">Unit / Suite Number</label>
            <input type="text" placeholder="Apt 4B" value={formData.unit} onChange={(e) => update('unit', e.target.value)}
              className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
          </div>
          <div>
            <label className="text-body font-medium text-text-primary">Postal Code</label>
            <input type="text" placeholder="10001" value={formData.postalCode} onChange={(e) => update('postalCode', e.target.value)}
              className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-body font-medium text-text-primary">City</label>
            <select value={formData.city} onChange={(e) => update('city', e.target.value)}
              className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30">
              <option value="">Select City</option>
              <option>New York City</option>
              <option>Mumbai</option>
              <option>Bangalore</option>
              <option>London</option>
            </select>
          </div>
          <div>
            <label className="text-body font-medium text-text-primary">Neighborhood</label>
            <input type="text" placeholder="Manhattan" value={formData.neighborhood} onChange={(e) => update('neighborhood', e.target.value)}
              className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
          </div>
        </div>
      </div>

      <div className="rounded-card border border-outline bg-white p-6 shadow-sm space-y-5">
        <h2 className="text-heading-3 font-bold text-text-primary">Zoning & Accessibility</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex items-start gap-3 rounded-button border border-outline p-4 cursor-pointer hover:bg-hover-light transition-colors">
            <Building2 size={18} className="mt-0.5 text-text-primary shrink-0" />
            <div className="flex-1">
              <p className="text-body font-semibold text-text-primary">Residential Zoning</p>
              <p className="text-label text-text-muted">Approved for standard long-term housing.</p>
            </div>
            <input type="checkbox" checked={formData.residentialZoning} onChange={(e) => update('residentialZoning', e.target.checked)} className="mt-1 h-4 w-4 rounded border-outline text-navy" />
          </label>
          <label className="flex items-start gap-3 rounded-button border border-outline p-4 cursor-pointer hover:bg-hover-light transition-colors">
            <Building2 size={18} className="mt-0.5 text-text-primary shrink-0" />
            <div className="flex-1">
              <p className="text-body font-semibold text-text-primary">Mixed Use</p>
              <p className="text-label text-text-muted">Permits commercial ground-floor operations.</p>
            </div>
            <input type="checkbox" checked={formData.mixedUse} onChange={(e) => update('mixedUse', e.target.checked)} className="mt-1 h-4 w-4 rounded border-outline text-navy" />
          </label>
        </div>
        <div>
          <p className="text-body font-medium text-text-primary">Accessibility Features</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[{ icon: Accessibility, label: 'Wheelchair Access' }, { icon: Building2, label: 'Elevator in Building' }, { icon: Car, label: 'On-site Parking' }].map((f) => (
              <span key={f.label} className="inline-flex items-center gap-2 rounded-pill border border-outline bg-white px-3 py-1.5 text-label font-medium text-text-primary">
                <f.icon size={14} className="text-text-muted" />{f.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Step 3: Amenities & Features ──────────────────────
function Step3Amenities({ formData, update }: StepProps) {
  const amenities = formData.amenities
  const features = formData.buildingFeatures
  const toggleAmenity = (key: keyof typeof amenities) => update('amenities', { ...amenities, [key]: !amenities[key] })
  const toggleFeature = (key: keyof typeof features) => update('buildingFeatures', { ...features, [key]: !features[key] })

  const amenityItems = [
    { key: 'wifi' as const, label: 'High-speed Wi-Fi', desc: 'Fiber Optic Ready' },
    { key: 'ac' as const, label: 'Air Conditioning', desc: 'Central HVAC' },
    { key: 'heating' as const, label: 'Heating', desc: 'Radiant Floor' },
    { key: 'smartLock' as const, label: 'Smart Lock', desc: 'Keyless Entry' },
    { key: 'washerDryer' as const, label: 'Washer/Dryer', desc: 'In-unit Laundry' },
    { key: 'dishwasher' as const, label: 'Dishwasher', desc: 'Modern Stainless' },
  ]
  const featureItems = [
    { key: 'gym' as const, label: 'Gym / Fitness Center', icon: Dumbbell },
    { key: 'pool' as const, label: 'Swimming Pool', icon: Waves },
    { key: 'parking' as const, label: 'Dedicated Parking', icon: Car },
    { key: 'security' as const, label: '24/7 Security', icon: ShieldCheck },
  ]

  return (
    <div className="space-y-6">
      <div className="rounded-card border border-outline bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-heading-3 font-bold text-text-primary">
          <Zap size={20} className="text-primary" /> General Amenities
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {amenityItems.map((a) => (
            <label key={a.key} className={cn('flex items-start gap-3 rounded-button border p-4 cursor-pointer transition-colors', amenities[a.key] ? 'border-navy bg-slate-50' : 'border-outline hover:bg-hover-light')}>
              <input type="checkbox" checked={amenities[a.key]} onChange={() => toggleAmenity(a.key)} className="mt-0.5 h-4 w-4 shrink-0 rounded border-outline text-navy" />
              <div>
                <p className="text-body font-semibold text-text-primary">{a.label}</p>
                <p className="text-label text-text-muted">{a.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-card border border-outline bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-heading-3 font-bold text-text-primary">
          <Building2 size={20} className="text-primary" /> Building Features
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {featureItems.map((f) => {
            const Icon = f.icon
            return (
              <div key={f.key} className="flex items-center justify-between rounded-button border border-outline p-4">
                <div className="flex items-center gap-3">
                  <Icon size={18} className="text-text-muted" />
                  <span className="text-body font-medium text-text-primary">{f.label}</span>
                </div>
                <button type="button" onClick={() => toggleFeature(f.key)}
                  className={cn('relative h-6 w-11 rounded-pill transition-colors shrink-0', features[f.key] ? 'bg-navy' : 'bg-slate-200')}
                  role="switch" aria-checked={features[f.key]}>
                  <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform', features[f.key] ? 'translate-x-5' : 'translate-x-0.5')} />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-card border border-outline bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-heading-3 font-bold text-text-primary">
          <Star size={20} className="text-primary" /> Special Features
        </h2>
        <div className="mt-4">
          <label className="text-body font-medium text-text-primary">Unique Selling Points</label>
          <textarea placeholder="Describe unique features like floor-to-ceiling windows, private balconies..."
            value={formData.sellingPoints} onChange={(e) => update('sellingPoints', e.target.value)}
            rows={3}
            className="mt-1.5 w-full rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none" />
        </div>
        <button type="button" className="mt-3 inline-flex items-center gap-1 rounded-button border border-outline px-3 py-2 text-label font-medium text-text-primary hover:bg-hover-light transition-colors">
          <Plus size={14} /> Add custom tag
        </button>
      </div>
    </div>
  )
}

// ── Step 4: Media & Gallery ────────────────────────────
function Step4Media({ formData, update }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-card border border-outline bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-heading-3 font-bold text-text-primary">Property Photos</h2>
          <span className="rounded-pill bg-status-error-bg px-3 py-1 text-badge font-bold text-status-error-text">
            Minimum 5 photos required
          </span>
        </div>
        <div className="mt-5 flex flex-col items-center justify-center rounded-card border-2 border-dashed border-outline bg-canvas-alt py-12 text-center cursor-pointer hover:border-primary transition-colors">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
            <Camera size={24} className="text-text-muted" />
          </div>
          <p className="mt-4 text-body font-semibold text-text-primary">Drag and drop images here or click to browse</p>
          <p className="mt-1 text-label text-text-muted">High resolution JPG or PNG files up to 10MB each.</p>
        </div>
      </div>

      <div className="rounded-card border border-outline bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-heading-3 font-bold text-text-primary">Gallery Management</h2>
          <p className="text-label text-text-muted">{formData.photos.length} items uploaded</p>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {formData.photos.map((photo, idx) => (
            <div key={idx} className="relative h-32 overflow-hidden rounded-card">
              <img src={photo} alt={`Gallery ${idx + 1}`} className="h-full w-full object-cover" />
              {idx === 0 && (
                <span className="absolute left-2 top-2 rounded-pill bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                  Primary Cover
                </span>
              )}
            </div>
          ))}
          <button type="button" className="flex h-32 flex-col items-center justify-center rounded-card border-2 border-dashed border-outline bg-canvas-alt text-text-muted hover:border-primary hover:text-primary transition-colors">
            <Image size={24} />
            <span className="mt-2 text-label font-medium">Add More</span>
          </button>
        </div>
      </div>

      <div className="rounded-card border border-outline bg-white p-6 shadow-sm">
        <h2 className="text-heading-3 font-bold text-text-primary">Virtual Tour / Video</h2>
        <label className="mt-3 block text-label font-medium text-text-muted">Embed Virtual Tour URL</label>
        <div className="mt-1.5 flex items-center gap-3">
          <div className="relative flex-1">
            <Video size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <input type="text" placeholder="https://matterport.com/..." value={formData.virtualTourUrl}
              onChange={(e) => update('virtualTourUrl', e.target.value)}
              className="h-11 w-full rounded-input border border-outline bg-white pl-10 pr-4 text-body text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
          </div>
          <button type="button" className="inline-flex shrink-0 items-center gap-2 rounded-button border border-outline bg-white px-4 py-2.5 text-body font-medium text-text-primary hover:bg-hover-light transition-colors">
            <Upload size={16} /> Upload 360 Video
          </button>
        </div>
        <p className="mt-1 text-label text-text-muted">Paste links from Matterport, 360 degree tours, or YouTube/Vimeo.</p>
      </div>
    </div>
  )
}

// ── Step 5: Pricing & Lease ────────────────────────────
function Step5Pricing({ formData, update }: StepProps) {
  const utilities = formData.utilities
  const toggleUtility = (key: keyof typeof utilities) =>
    update('utilities', { ...utilities, [key]: !utilities[key] })

  const annualRevenue = useMemo(() => parseFloat(formData.baseRent || '0') * 12, [formData.baseRent])
  const initialIntake = useMemo(() => {
    const rent = parseFloat(formData.baseRent || '0')
    const deposit = parseFloat(formData.securityDeposit || '0')
    return rent + rent * deposit
  }, [formData.baseRent, formData.securityDeposit])

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          {/* Rental Details */}
          <div className="rounded-card border border-outline bg-white p-6 shadow-sm space-y-5">
            <h2 className="flex items-center gap-2 text-heading-3 font-bold text-text-primary">
              💰 Rental Details
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="text-label font-medium text-text-muted">Base Rent (Monthly)</label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-body text-text-muted">$</span>
                  <input type="text" value={formData.baseRent} onChange={(e) => update('baseRent', e.target.value)}
                    className="h-11 w-full rounded-input border border-outline bg-white pl-8 pr-4 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
                </div>
              </div>
              <div>
                <label className="text-label font-medium text-text-muted">Security Deposit</label>
                <input type="text" value={formData.securityDeposit} onChange={(e) => update('securityDeposit', e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-label font-medium text-text-muted invisible">Unit</label>
                <select value={formData.depositUnit} onChange={(e) => update('depositUnit', e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-3 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30">
                  <option>Months</option>
                  <option>Fixed</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-label font-medium text-text-muted">Minimum Lease Duration (Months)</label>
              <div className="mt-2 flex items-center gap-4">
                <span className="text-label text-text-muted">1</span>
                <input type="range" min={1} max={24} value={formData.leaseDuration}
                  onChange={(e) => update('leaseDuration', parseInt(e.target.value))}
                  className="flex-1 accent-primary" />
                <span className="text-label text-text-muted">24</span>
              </div>
              <p className="mt-1 text-center text-label font-bold text-primary">{formData.leaseDuration} Months</p>
            </div>
          </div>

          {/* Lease Terms */}
          <div className="rounded-card border border-outline bg-white p-6 shadow-sm space-y-5">
            <h2 className="flex items-center gap-2 text-heading-3 font-bold text-text-primary">📋 Lease Terms</h2>
            <div>
              <label className="text-body font-medium text-text-primary">Utilities Included</label>
              <div className="mt-3 flex flex-wrap gap-3">
                {(['electricity', 'water', 'internet', 'gas'] as const).map((u) => (
                  <label key={u} className={cn('inline-flex items-center gap-2 rounded-button border px-4 py-2.5 cursor-pointer text-body font-medium transition-colors', utilities[u] ? 'border-navy bg-primary-100 text-text-primary' : 'border-outline text-text-muted hover:bg-hover-light')}>
                    <input type="checkbox" checked={utilities[u]} onChange={() => toggleUtility(u)} className="h-4 w-4 rounded border-outline text-navy" />
                    {u.charAt(0).toUpperCase() + u.slice(1)}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body font-medium text-text-primary">Pet Policy</p>
                <p className="text-label text-text-muted">Allow domestic animals within the premises</p>
              </div>
              <button type="button" onClick={() => update('petPolicy', !formData.petPolicy)}
                className={cn('relative h-6 w-11 shrink-0 rounded-pill transition-colors', formData.petPolicy ? 'bg-navy' : 'bg-slate-200')}
                role="switch" aria-checked={formData.petPolicy}>
                <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform', formData.petPolicy ? 'translate-x-5' : 'translate-x-0.5')} />
              </button>
            </div>
            {formData.petPolicy && (
              <textarea placeholder="Describe pet weight limits, breeds, or additional fees..."
                value={formData.petDetails} onChange={(e) => update('petDetails', e.target.value)}
                rows={3}
                className="w-full rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none" />
            )}
          </div>
        </div>

        {/* Right column: Availability + Summary */}
        <div className="space-y-6">
          <div className="rounded-card border border-outline bg-white p-6 shadow-sm space-y-5">
            <h2 className="flex items-center gap-2 text-heading-3 font-bold text-text-primary">📅 Availability</h2>
            <div>
              <label className="text-label font-medium text-text-muted">Available From</label>
              <input type="text" placeholder="MM/DD/YYYY" value={formData.availableFrom}
                onChange={(e) => update('availableFrom', e.target.value)}
                className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-label font-medium text-text-muted">Notice Period (Days)</label>
              <div className="mt-1.5 flex items-center gap-2">
                <input type="text" value={formData.noticePeriod} onChange={(e) => update('noticePeriod', e.target.value)}
                  className="h-11 w-20 rounded-input border border-outline bg-white px-3 text-body text-text-primary text-center focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
                <span className="text-body text-text-muted">Days</span>
              </div>
            </div>
          </div>

          <div className="rounded-card bg-canvas-alt border border-outline p-6 shadow-sm">
            <h3 className="text-body-lg font-bold text-text-primary">Listing Summary</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-body text-text-muted">Annual Revenue</span>
                <span className="text-body font-bold text-text-primary">
                  ${annualRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body text-text-muted">Initial Intake</span>
                <span className="text-body font-bold text-text-primary">
                  ${initialIntake.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <p className="mt-3 text-label text-text-muted">
              Includes First Month + {formData.securityDeposit || '0'}x Security Deposit.
            </p>
          </div>

          {/* Info cards stacked on right */}
          {[
            { icon: ShieldCheck, title: 'Verified Listings', desc: 'Verified properties get 5x more views.', color: 'bg-primary-100 text-primary' },
            { icon: TrendingUp, title: 'Pricing Insights', desc: 'Optimal rents based on market data.', color: 'bg-teal-50 text-teal-600' },
            { icon: Lock, title: 'Data Privacy', desc: 'Documents are encrypted and secure.', color: 'bg-slate-100 text-slate-600' },
          ].map((card) => {
            const Icon = card.icon
            return (
              <div key={card.title} className="flex items-start gap-3 rounded-card border border-outline bg-white p-4 shadow-sm">
                <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full', card.color)}>
                  <Icon size={16} />
                </div>
                <div>
                  <p className="text-body font-bold text-text-primary">{card.title}</p>
                  <p className="text-label text-text-muted">{card.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
