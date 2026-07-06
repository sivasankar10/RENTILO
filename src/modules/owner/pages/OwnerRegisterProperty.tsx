import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Accessibility,
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarClock,
  Camera,
  Car,
  Check,
  CheckCircle2,
  ClipboardList,
  DollarSign,
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
  Zap,
} from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { ROUTES } from '@shared/constants/routes'
import { useOwnerStore, type OwnerRegisterPropertyFormData } from '../store/ownerStore'
import { useOwnerPrototype } from '../hooks/useOwnerPrototype'

export type StepNumber = 1 | 2 | 3 | 4 | 5

interface StepDef {
  number: StepNumber
  label: string
}

export const steps: StepDef[] = [
  { number: 1, label: 'Basic Information' },
  { number: 2, label: 'Property Location' },
  { number: 3, label: 'Amenities & Features' },
  { number: 4, label: 'Media & Gallery' },
  { number: 5, label: 'Pricing & Lease' },
]

export function OwnerRegisterProperty() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<StepNumber>(1)
  const formData = useOwnerStore((state) => state.registerPropertyDraft)
  const updateRegisterPropertyDraft = useOwnerStore((state) => state.updateRegisterPropertyDraft)
  const saveRegisterPropertyDraft = useOwnerStore((state) => state.saveRegisterPropertyDraft)
  const submitRegisterProperty = useOwnerStore((state) => state.submitRegisterProperty)
  const resetRegisterPropertyDraft = useOwnerStore((state) => state.resetRegisterPropertyDraft)
  const subscriptionPlan = useOwnerStore((state) => state.subscriptionPlan)
  const { createProperty } = useOwnerPrototype()
  const isPremium = subscriptionPlan === 'PREMIUM'

  const update = <K extends keyof OwnerRegisterPropertyFormData>(
    key: K,
    val: OwnerRegisterPropertyFormData[K]
  ) => {
    updateRegisterPropertyDraft(key, val)
  }

  const goNext = () => setCurrentStep((s) => Math.min(5, s + 1) as StepNumber)
  const goPrev = () => setCurrentStep((s) => Math.max(1, s - 1) as StepNumber)

  const handleSaveDraft = () => {
    saveRegisterPropertyDraft()
  }

  const handleSubmit = () => {
    const result = createProperty(formData)
    submitRegisterProperty()
    resetRegisterPropertyDraft()
    // Select the newly created property in the sidebar dropdown
    if (result?.propertyId) {
      useOwnerStore.getState().setSelectedProperty(result.propertyId)
    }
    navigate(ROUTES.OWNER.PROPERTIES)
  }

  // Block FREE users from registering new properties
  if (!isPremium) {
    return (
      <div className="min-h-screen bg-canvas-alt px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-3xl text-center py-20">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <Lock size={28} />
          </div>
          <h1 className="mt-6 text-heading-1 font-bold text-text-primary">Premium Feature</h1>
          <p className="mt-4 text-body text-text-muted">
            Posting new properties is available only for Premium subscribers. Free plan owners can manage their single default listing.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => navigate(ROUTES.OWNER.PREMIUM_PAYMENT)}
              className="rounded-button bg-primary px-6 py-3 text-body font-semibold text-white shadow-sm hover:bg-primary-700 transition-colors"
            >
              Upgrade to Premium
            </button>
            <button
              type="button"
              onClick={() => navigate(ROUTES.OWNER.DASHBOARD)}
              className="rounded-button border border-outline bg-white px-6 py-3 text-body font-semibold text-text-primary shadow-sm hover:bg-hover-light transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas-alt px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Breadcrumb + Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-label text-text-muted">
              <button type="button" onClick={() => navigate(ROUTES.OWNER.PROPERTIES)} className="hover:text-primary transition-colors">
                Properties
              </button>
              {' > '}
              <span className="text-text-primary">Add New Listing</span>
            </p>
            <h1 className="mt-2 text-heading-1 font-bold tracking-tight text-text-primary">
              Register New Property
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="rounded-button border border-outline bg-white px-5 py-2.5 text-body font-medium text-text-primary shadow-sm hover:bg-hover-light transition-colors"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-button bg-navy px-5 py-2.5 text-body font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
            >
              Submit Listing
            </button>
          </div>
        </div>

        {/* Main layout: Step sidebar + Content */}
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Step Sidebar */}
          <div className="space-y-6">
            <div className="rounded-card border border-outline bg-white p-5 shadow-sm">
              <nav className="space-y-4">
                {steps.map((step) => {
                  const isCompleted = step.number < currentStep
                  const isActive = step.number === currentStep
                  return (
                    <button
                      type="button"
                      key={step.number}
                      onClick={() => setCurrentStep(step.number)}
                      className="flex w-full items-start gap-3 text-left"
                    >
                      <div
                        className={cn(
                          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-badge font-bold',
                          isCompleted ? 'bg-primary text-white' : isActive ? 'bg-navy text-white' : 'bg-slate-100 text-text-muted',
                        )}
                      >
                        {isCompleted ? <Check size={14} /> : step.number}
                      </div>
                      <span
                        className={cn(
                          'text-body pt-0.5',
                          isActive ? 'font-bold text-text-primary' : isCompleted ? 'font-medium text-text-primary' : 'font-medium text-text-muted',
                        )}
                      >
                        {step.label}
                      </span>
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Need Assistance */}
            <div className="rounded-card bg-primary-100 p-5">
              <h3 className="text-body font-bold text-text-primary">Need Assistance?</h3>
              <p className="mt-2 text-label leading-5 text-text-muted">
                Our onboarding specialists are available 24x7 to help you optimize your listing.
              </p>
              <button type="button" className="mt-4 inline-flex items-center gap-2 text-label font-bold text-navy hover:text-primary transition-colors">
                ðŸ“ž Contact Support
              </button>
            </div>
          </div>

          {/* Step Content */}
          <div className="space-y-6">
            {currentStep === 1 && <Step1BasicInfo formData={formData} update={update} />}
            {currentStep === 2 && <Step2Location formData={formData} update={update} />}
            {currentStep === 3 && <Step3Amenities formData={formData} update={update} />}
            {currentStep === 4 && <Step4Media formData={formData} update={update} />}
            {currentStep === 5 && <Step5Pricing formData={formData} update={update} onComplete={handleSubmit} goPrev={goPrev} />}

            {/* Navigation */}
            {currentStep < 5 && (
              <div className="flex items-center justify-between pt-4">
                {currentStep > 1 ? (
                  <button type="button" onClick={goPrev} className="inline-flex items-center gap-2 text-body font-medium text-text-muted hover:text-text-primary transition-colors">
                    <ArrowLeft size={16} />
                    Previous Step
                  </button>
                ) : <span />}
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex items-center gap-2 rounded-button bg-navy px-6 py-3 text-body font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
                >
                  {currentStep === 1 && 'Continue to Location'}
                  {currentStep === 2 && 'Continue to Amenities'}
                  {currentStep === 3 && 'Continue to Media & Gallery'}
                  {currentStep === 4 && 'Continue to Pricing & Lease'}
                  <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* Bottom info cards */}
            <BottomInfoCards />
          </div>
        </div>
      </div>
    </div>
  )
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€ STEP 1: Basic Information â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export function Step1BasicInfo({ formData, update }: StepProps) {
  return (
    <div className="rounded-card border border-outline bg-white p-6 shadow-surface space-y-5">
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
          <select
            value={formData.propertyType}
            onChange={(e) => update('propertyType', e.target.value)}
            className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
          >
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
          <input
            type="text"
            placeholder="YYYY"
            value={formData.yearBuilt}
            onChange={(e) => update('yearBuilt', e.target.value)}
            className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-body font-medium text-text-primary">Internal Reference ID (Optional)</label>
          <input
            type="text"
            placeholder="e.g., BLDG-A-101"
            value={formData.referenceId}
            onChange={(e) => update('referenceId', e.target.value)}
            className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>
        <div>
          <label className="text-body font-medium text-text-primary">Current Status</label>
          <select
            value={formData.currentStatus}
            onChange={(e) => update('currentStatus', e.target.value)}
            className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
          >
            <option>Available for Rent</option>
            <option>Under Renovation</option>
            <option>Occupied</option>
          </select>
        </div>
      </div>

      <div>
        <h3 className="text-heading-3 font-bold text-text-primary">Property Description</h3>
        <textarea
          placeholder="Describe the property, highlighting key selling points..."
          value={formData.description}
          onChange={(e) => update('description', e.target.value.slice(0, 1000))}
          rows={4}
          className="mt-2 w-full rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
        />
        <p className="mt-1 text-right text-label text-text-muted">{formData.description.length} / 1000 characters</p>
      </div>
    </div>
  )
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€ STEP 2: Property Location â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export function Step2Location({ formData, update }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-card border border-outline bg-white p-6 shadow-surface space-y-5">
        <div>
          <h2 className="text-heading-3 font-bold text-text-primary">Location Details</h2>
          <p className="mt-1 text-label text-text-muted">Precisely mark the location to help potential tenants find their next home.</p>
        </div>

        <div>
          <label className="text-body font-medium text-text-primary">Street Address</label>
          <input type="text" placeholder="e.g., 123 Architecture Blvd" value={formData.streetAddress} onChange={(e) => update('streetAddress', e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
          <p className="mt-1 text-label text-text-muted">Full legal address as it appears on title deeds.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-body font-medium text-text-primary">Unit / Suite Number</label>
            <input type="text" placeholder="Apt 4B" value={formData.unit} onChange={(e) => update('unit', e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
          </div>
          <div>
            <label className="text-body font-medium text-text-primary">Postal Code</label>
            <input type="text" placeholder="10001" value={formData.postalCode} onChange={(e) => update('postalCode', e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-body font-medium text-text-primary">City</label>
            <select value={formData.city} onChange={(e) => update('city', e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30">
              <option value="">Select City</option>
              <option>New York City</option>
              <option>Mumbai</option>
              <option>Bangalore</option>
              <option>London</option>
            </select>
          </div>
          <div>
            <label className="text-body font-medium text-text-primary">Neighborhood</label>
            <input type="text" placeholder="Manhattan" value={formData.neighborhood} onChange={(e) => update('neighborhood', e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
          </div>
        </div>
      </div>

      {/* Zoning */}
      <div className="rounded-card border border-outline bg-white p-6 shadow-surface space-y-5">
        <h2 className="text-heading-3 font-bold text-text-primary">Zoning & Accessibility</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex items-start gap-3 rounded-button border border-outline p-4 cursor-pointer">
            <Building2 size={18} className="mt-0.5 text-text-primary" />
            <div className="flex-1"><p className="text-body font-semibold text-text-primary">Residential Zoning</p><p className="text-label text-text-muted">Approved for standard long-term housing.</p></div>
            <input type="checkbox" checked={formData.residentialZoning} onChange={(e) => update('residentialZoning', e.target.checked)} className="mt-1 h-4 w-4 rounded border-outline text-navy" />
          </label>
          <label className="flex items-start gap-3 rounded-button border border-outline p-4 cursor-pointer">
            <Building2 size={18} className="mt-0.5 text-text-primary" />
            <div className="flex-1"><p className="text-body font-semibold text-text-primary">Mixed Use</p><p className="text-label text-text-muted">Permits commercial ground-floor operations.</p></div>
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

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€ STEP 3: Amenities & Features â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export function Step3Amenities({ formData, update }: StepProps) {
  const amenities = formData.amenities
  const features = formData.buildingFeatures

  const toggleAmenity = (key: keyof typeof amenities) => {
    update('amenities', { ...amenities, [key]: !amenities[key] })
  }
  const toggleFeature = (key: keyof typeof features) => {
    update('buildingFeatures', { ...features, [key]: !features[key] })
  }

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
      {/* General Amenities */}
      <div className="rounded-card border border-outline bg-white p-6 shadow-surface">
        <h2 className="flex items-center gap-2 text-heading-3 font-bold text-text-primary">
          <Zap size={20} />General Amenities
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {amenityItems.map((a) => (
            <label key={a.key} className={cn('flex items-start gap-3 rounded-button border p-4 cursor-pointer transition-colors', amenities[a.key] ? 'border-navy bg-slate-50' : 'border-outline')}>
              <input type="checkbox" checked={amenities[a.key]} onChange={() => toggleAmenity(a.key)} className="mt-0.5 h-4 w-4 rounded border-outline text-navy" />
              <div><p className="text-body font-semibold text-text-primary">{a.label}</p><p className="text-label text-text-muted">{a.desc}</p></div>
            </label>
          ))}
        </div>
      </div>

      {/* Building Features */}
      <div className="rounded-card border border-outline bg-white p-6 shadow-surface">
        <h2 className="flex items-center gap-2 text-heading-3 font-bold text-text-primary">
          <Building2 size={20} />Building Features
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
                <button type="button" onClick={() => toggleFeature(f.key)} className={cn('relative h-6 w-11 rounded-pill transition-colors', features[f.key] ? 'bg-navy' : 'bg-slate-200')}>
                  <span className={cn('absolute left-0 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform', features[f.key] ? 'translate-x-5' : 'translate-x-0.5')} />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Special Features */}
      <div className="rounded-card border border-outline bg-white p-6 shadow-surface">
        <h2 className="flex items-center gap-2 text-heading-3 font-bold text-text-primary">
          <Star size={20} />Special Features
        </h2>
        <div className="mt-4">
          <label className="text-body font-medium text-text-primary">Unique Selling Points</label>
          <textarea
            placeholder="Describe unique features like floor-to-ceiling windows, private balconies, or designer finishes..."
            value={formData.sellingPoints}
            onChange={(e) => update('sellingPoints', e.target.value)}
            rows={3}
            className="mt-1.5 w-full rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
          />
        </div>
        <button type="button" className="mt-3 inline-flex items-center gap-1 rounded-button border border-outline px-3 py-2 text-label font-medium text-text-primary hover:bg-hover-light transition-colors">
          <Plus size={14} />Add custom tag
        </button>
      </div>
    </div>
  )
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€ STEP 4: Media & Gallery â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export function Step4Media({ formData, update }: StepProps) {
  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="rounded-card border border-outline bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-body font-bold text-text-primary">Property Wizard</h3>
          <p className="text-label text-text-muted">Overall Progress: 80%</p>
        </div>
        <div className="mt-3 flex items-center gap-2">
          {steps.map((s) => (
            <span key={s.number} className={cn('flex-1 h-2 rounded-pill', s.number <= 4 ? 'bg-navy' : 'bg-slate-200')} />
          ))}
        </div>
      </div>

      {/* Photo Upload */}
      <div className="rounded-card border border-outline bg-white p-6 shadow-surface">
        <div className="flex items-center justify-between">
          <h2 className="text-heading-3 font-bold text-text-primary">Property Photos</h2>
          <span className="rounded-pill bg-status-error-bg px-3 py-1 text-badge font-bold text-status-error-text">Minimum 5 photos required</span>
        </div>
        <div className="mt-5 flex flex-col items-center justify-center rounded-card border-2 border-dashed border-outline bg-canvas-alt py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
            <Camera size={24} className="text-text-muted" />
          </div>
          <p className="mt-4 text-body font-semibold text-text-primary">Drag and drop images here or click to browse</p>
          <p className="mt-1 text-label text-text-muted">High resolution JPG or PNG files up to 10MB each.</p>
        </div>
      </div>

      {/* Gallery */}
      <div className="rounded-card border border-outline bg-white p-6 shadow-surface">
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

      {/* Virtual Tour */}
      <div className="rounded-card border border-outline bg-white p-6 shadow-surface">
        <h2 className="text-heading-3 font-bold text-text-primary">Virtual Tour / Video</h2>
        <label className="mt-3 text-label font-medium text-text-muted">Embed Virtual Tour URL</label>
        <div className="mt-1.5 flex items-center gap-3">
          <div className="relative flex-1">
            <Video size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input type="text" placeholder="https://matterport.com/..." value={formData.virtualTourUrl} onChange={(e) => update('virtualTourUrl', e.target.value)} className="h-11 w-full rounded-input border border-outline bg-white pl-10 pr-4 text-body text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
          </div>
          <button type="button" className="inline-flex items-center gap-2 rounded-button border border-outline bg-white px-4 py-2.5 text-body font-medium text-text-primary hover:bg-hover-light transition-colors">
            <Upload size={16} />Upload 360 Video File
          </button>
        </div>
        <p className="mt-1 text-label text-text-muted">Paste links from Matterport, 360 degree tours, or YouTube/Vimeo.</p>
      </div>
    </div>
  )
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€ STEP 5: Pricing & Lease â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export function Step5Pricing({ formData, update, onComplete, goPrev }: StepProps & { onComplete: () => void; goPrev: () => void }) {
  const utilities = formData.utilities
  const toggleUtility = (key: keyof typeof utilities) => {
    update('utilities', { ...utilities, [key]: !utilities[key] })
  }

  const annualRevenue = useMemo(() => parseFloat(formData.baseRent || '0') * 12, [formData.baseRent])
  const initialIntake = useMemo(() => {
    const rent = parseFloat(formData.baseRent || '0')
    const deposit = parseFloat(formData.securityDeposit || '0')
    return rent + rent * deposit
  }, [formData.baseRent, formData.securityDeposit])

  return (
    <div className="space-y-6">
      {/* Horizontal stepper */}
      <div className="rounded-card border border-outline bg-white p-5 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-5">
          {steps.map((s) => (
            <div
              key={s.number}
              className={cn(
                'flex min-h-10 items-center gap-2 rounded-button px-3 py-2',
                s.number === 5 ? 'bg-primary-100' : 'bg-canvas-alt'
              )}
            >
              <div className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold', s.number < 5 ? 'bg-primary text-white' : 'bg-navy text-white')}>
                {s.number < 5 ? <Check size={12} /> : s.number}
              </div>
              <span className={cn('truncate text-label font-medium', s.number === 5 ? 'text-text-primary font-bold' : 'text-text-muted')}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          {/* Rental Details */}
          <div className="space-y-5 rounded-card border border-outline bg-white p-6 shadow-surface">
            <h2 className="flex items-center gap-2 text-heading-3 font-bold text-text-primary">
              <DollarSign size={20} className="text-primary" />
              Rental Details
            </h2>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_160px] lg:items-end">
              <div>
                <label className="text-label font-medium text-text-muted">Base Rent (Monthly)</label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-body text-text-muted">$</span>
                  <input type="text" value={formData.baseRent} onChange={(e) => update('baseRent', e.target.value)} className="h-11 w-full rounded-input border border-outline bg-white pl-8 pr-4 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
                </div>
              </div>
              <div>
                <label className="text-label font-medium text-text-muted">Security Deposit</label>
                <input type="text" value={formData.securityDeposit} onChange={(e) => update('securityDeposit', e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-label font-medium text-text-muted">Deposit Unit</label>
                <select value={formData.depositUnit} onChange={(e) => update('depositUnit', e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-3 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30">
                  <option>Months</option>
                  <option>Fixed</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-label font-medium text-text-muted">Minimum Lease Duration (Months)</label>
              <div className="mt-2 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4">
                <span className="whitespace-nowrap text-label text-text-muted">1 Month</span>
                <input type="range" min={1} max={24} value={formData.leaseDuration} onChange={(e) => update('leaseDuration', parseInt(e.target.value))} className="flex-1 accent-primary" />
                <span className="whitespace-nowrap text-label text-text-muted">24 Months</span>
              </div>
              <p className="mt-1 text-center text-label font-bold text-primary">{formData.leaseDuration} Months</p>
            </div>
            <div className="flex flex-col gap-4 rounded-button border border-outline bg-canvas-alt p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-body font-medium text-text-primary">Price Negotiable</p>
                <p className="text-label text-text-muted">Show tenants whether rent can be discussed.</p>
              </div>
              <button type="button" onClick={() => update('priceNegotiable', !formData.priceNegotiable)} className={cn('relative h-6 w-11 rounded-pill transition-colors', formData.priceNegotiable ? 'bg-navy' : 'bg-slate-200')}>
                <span className={cn('absolute left-0 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform', formData.priceNegotiable ? 'translate-x-5' : 'translate-x-0.5')} />
              </button>
            </div>
          </div>

          {/* Lease Terms */}
          <div className="space-y-5 rounded-card border border-outline bg-white p-6 shadow-surface">
            <h2 className="flex items-center gap-2 text-heading-3 font-bold text-text-primary">
              <ClipboardList size={20} className="text-primary" />
              Lease Terms
            </h2>
            <div>
              <label className="text-body font-medium text-text-primary">Utilities Included</label>
              <div className="mt-3 flex flex-wrap gap-3">
                {(['electricity', 'water', 'internet', 'gas'] as const).map((u) => (
                  <label key={u} className={cn('inline-flex items-center gap-2 rounded-button border px-4 py-2.5 cursor-pointer text-body font-medium transition-colors', utilities[u] ? 'border-navy bg-primary-100 text-text-primary' : 'border-outline text-text-muted')}>
                    <input type="checkbox" checked={utilities[u]} onChange={() => toggleUtility(u)} className="h-4 w-4 rounded border-outline text-navy" />
                    {u.charAt(0).toUpperCase() + u.slice(1)}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-button border border-outline bg-canvas-alt p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-body font-medium text-text-primary">Pet Policy</p>
                <p className="text-label text-text-muted">Allow domestic animals within the premises</p>
              </div>
              <button type="button" onClick={() => update('petPolicy', !formData.petPolicy)} className={cn('relative h-6 w-11 rounded-pill transition-colors', formData.petPolicy ? 'bg-navy' : 'bg-slate-200')}>
                <span className={cn('absolute left-0 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform', formData.petPolicy ? 'translate-x-5' : 'translate-x-0.5')} />
              </button>
            </div>
            {formData.petPolicy && (
              <textarea placeholder="Describe pet weight limits, breeds, or additional fees..." value={formData.petDetails} onChange={(e) => update('petDetails', e.target.value)} rows={3} className="w-full rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none" />
            )}
          </div>
        </div>

        {/* Availability + Listing Summary */}
        <div className="space-y-6">
          <div className="space-y-5 rounded-card border border-outline bg-white p-6 shadow-surface">
            <h2 className="flex items-center gap-2 text-heading-3 font-bold text-text-primary">
              <CalendarClock size={20} className="text-primary" />
              Availability
            </h2>
            <div>
              <label className="text-label font-medium text-text-muted">Available From</label>
              <input type="text" value={formData.availableFrom} onChange={(e) => update('availableFrom', e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-label font-medium text-text-muted">Visit Weekday</label>
              <select value={formData.visitWeekday} onChange={(e) => update('visitWeekday', e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-3 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <option key={day}>{day}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-label font-medium text-text-muted">Visit Starts</label>
                <input type="text" value={formData.visitStartTime} onChange={(e) => update('visitStartTime', e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-label font-medium text-text-muted">Visit Ends</label>
                <input type="text" value={formData.visitEndTime} onChange={(e) => update('visitEndTime', e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
              </div>
            </div>
            <div>
              <label className="text-label font-medium text-text-muted">Notice Period (Days)</label>
              <div className="mt-1.5 grid grid-cols-[96px_auto] items-center gap-2">
                <input type="text" value={formData.noticePeriod} onChange={(e) => update('noticePeriod', e.target.value)} className="h-11 w-full rounded-input border border-outline bg-white px-3 text-center text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
                <span className="text-body text-text-muted">Days</span>
              </div>
            </div>
          </div>

          <div className="rounded-card border border-outline bg-canvas-alt p-6 shadow-sm">
            <h3 className="text-body-lg font-bold text-text-primary">Listing Summary</h3>
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
                <span className="text-body text-text-muted">Annual Revenue</span>
                <span className="whitespace-nowrap text-body font-bold text-text-primary">${annualRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
                <span className="text-body text-text-muted">Initial Intake</span>
                <span className="whitespace-nowrap text-body font-bold text-text-primary">${initialIntake.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
            <p className="mt-3 text-label text-text-muted">
              Includes First Month + {formData.securityDeposit}x Security Deposit. Subject to local tax regulations.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <button type="button" onClick={goPrev} className="inline-flex items-center gap-2 text-body font-medium text-text-muted hover:text-text-primary transition-colors">
          <ArrowLeft size={16} />Previous Step
        </button>
        <button type="button" onClick={onComplete} className="inline-flex items-center justify-center gap-2 rounded-button bg-navy px-6 py-3 text-body font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors">
          Complete Registration
          <CheckCircle2 size={16} />
        </button>
      </div>
    </div>
  )
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€ Bottom Info Cards â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export function BottomInfoCards() {
  const cards = [
    { icon: ShieldCheck, title: 'Verified Listings', desc: 'Verified properties receive 5x more views and inquiries.', color: 'bg-primary-100 text-primary' },
    { icon: TrendingUp, title: 'Pricing Insights', desc: "We'll suggest optimal rents based on local market data.", color: 'bg-status-error-bg text-status-error' },
    { icon: Lock, title: 'Data Privacy', desc: 'Your property documents are encrypted and secure.', color: 'bg-status-error-bg text-status-error' },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3 mt-6">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div key={card.title} className="flex items-start gap-3 rounded-card border border-outline bg-white p-5 shadow-sm">
            <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', card.color)}>
              <Icon size={18} />
            </div>
            <div>
              <p className="text-body font-bold text-text-primary">{card.title}</p>
              <p className="text-label text-text-muted">{card.desc}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export type StepProps = {
  formData: OwnerRegisterPropertyFormData
  update: <K extends keyof OwnerRegisterPropertyFormData>(
    key: K,
    val: OwnerRegisterPropertyFormData[K]
  ) => void
}
