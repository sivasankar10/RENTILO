import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { ROUTES } from '@shared/constants/routes'
import { useOwnerStore, type OwnerRegisterPropertyFormData } from '../store/ownerStore'
import {
  BottomInfoCards,
  Step1BasicInfo,
  Step2Location,
  Step3Amenities,
  Step4Media,
  Step5Pricing,
  steps,
  type StepNumber,
} from './OwnerRegisterProperty'

export function OwnerProperties() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<StepNumber>(1)
  const [draftStatus, setDraftStatus] = useState('')
  const [supportStatus, setSupportStatus] = useState('')
  const formData = useOwnerStore((state) => state.registerPropertyDraft)
  const updateRegisterPropertyDraft = useOwnerStore((state) => state.updateRegisterPropertyDraft)
  const saveRegisterPropertyDraft = useOwnerStore((state) => state.saveRegisterPropertyDraft)

  const update = <K extends keyof OwnerRegisterPropertyFormData>(
    key: K,
    val: OwnerRegisterPropertyFormData[K]
  ) => {
    updateRegisterPropertyDraft(key, val)
    setDraftStatus('')
  }

  const goNext = () => setCurrentStep((step) => Math.min(5, step + 1) as StepNumber)
  const goPrev = () => setCurrentStep((step) => Math.max(1, step - 1) as StepNumber)

  const handleSaveDraft = () => {
    saveRegisterPropertyDraft()
    setDraftStatus('Property details saved locally.')
  }

  const handleComplete = () => {
    saveRegisterPropertyDraft()
    setDraftStatus('Property details updated.')
    navigate(ROUTES.OWNER.DASHBOARD)
  }

  return (
    <div className="min-h-screen bg-canvas-alt px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-label text-text-muted">
              <button
                type="button"
                onClick={() => navigate(ROUTES.OWNER.DASHBOARD)}
                className="transition-colors hover:text-primary"
              >
                Overview
              </button>
              {' > '}
              <span className="text-text-primary">Edit Details</span>
            </p>
            <h1 className="mt-2 text-heading-1 font-bold tracking-tight text-text-primary">
              Edit Property Details
            </h1>
            <p className="mt-2 text-body text-text-muted">
              Update listing information, location, amenities, media, and lease details for this session.
            </p>
            {draftStatus && <p className="mt-2 text-label font-semibold text-status-success-text">{draftStatus}</p>}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="rounded-button border border-outline bg-white px-5 py-2.5 text-body font-medium text-text-primary shadow-sm transition-colors hover:bg-hover-light"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleComplete}
              className="rounded-button bg-navy px-5 py-2.5 text-body font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
            >
              Finish Editing
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
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
                          isCompleted
                            ? 'bg-primary text-white'
                            : isActive
                              ? 'bg-navy text-white'
                              : 'bg-slate-100 text-text-muted'
                        )}
                      >
                        {isCompleted ? <Check size={14} /> : step.number}
                      </div>
                      <span
                        className={cn(
                          'pt-0.5 text-body',
                          isActive
                            ? 'font-bold text-text-primary'
                            : isCompleted
                              ? 'font-medium text-text-primary'
                              : 'font-medium text-text-muted'
                        )}
                      >
                        {step.label}
                      </span>
                    </button>
                  )
                })}
              </nav>
            </div>

            <div className="rounded-card bg-primary-100 p-5">
              <h3 className="text-body font-bold text-text-primary">Need Assistance?</h3>
              <p className="mt-2 text-label leading-5 text-text-muted">
                Our onboarding specialists are available 24x7 to help you optimize your listing.
              </p>
              <button
                type="button"
                onClick={() => setSupportStatus('Support request queued.')}
                className="mt-4 inline-flex items-center gap-2 text-label font-bold text-navy transition-colors hover:text-primary"
              >
                Contact Support
              </button>
              {supportStatus && <p className="mt-3 text-label text-primary">{supportStatus}</p>}
            </div>
          </div>

          <div className="space-y-6">
            {currentStep === 1 && <Step1BasicInfo formData={formData} update={update} />}
            {currentStep === 2 && <Step2Location formData={formData} update={update} />}
            {currentStep === 3 && <Step3Amenities formData={formData} update={update} />}
            {currentStep === 4 && <Step4Media formData={formData} update={update} />}
            {currentStep === 5 && (
              <Step5Pricing
                formData={formData}
                update={update}
                onComplete={handleComplete}
                goPrev={goPrev}
              />
            )}

            {currentStep < 5 && (
              <div className="flex items-center justify-between pt-4">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={goPrev}
                    className="inline-flex items-center gap-2 text-body font-medium text-text-muted transition-colors hover:text-text-primary"
                  >
                    <ArrowLeft size={16} />
                    Previous Step
                  </button>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex items-center gap-2 rounded-button bg-navy px-6 py-3 text-body font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
                >
                  {currentStep === 1 && 'Continue to Location'}
                  {currentStep === 2 && 'Continue to Amenities'}
                  {currentStep === 3 && 'Continue to Media & Gallery'}
                  {currentStep === 4 && 'Continue to Pricing & Lease'}
                  <ArrowRight size={16} />
                </button>
              </div>
            )}

            <BottomInfoCards />
          </div>
        </div>
      </div>
    </div>
  )
}

function BasicInformationStep({ formData, update }: StepProps) {
  return (
    <article className="rounded-card border border-outline bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-heading-3 font-bold text-text-primary">Basic Information</h2>
        <p className="mt-1 text-label text-text-muted">Keep the public listing identity accurate and easy to scan.</p>
      </div>

      <div className="mt-6 space-y-5">
        <label className="block">
          <span className="text-label font-medium text-text-primary">Property Name / Title</span>
          <input type="text" value={formData.propertyName} onChange={(event) => update('propertyName', event.target.value)} className="mt-2 w-full rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary-100" />
        </label>

        <div className="grid gap-5 md:grid-cols-3">
          <label className="block">
            <span className="text-label font-medium text-text-primary">Property Type</span>
            <select value={formData.propertyType} onChange={(event) => update('propertyType', event.target.value)} className="mt-2 w-full rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary-100">
              <option>Luxury Apartment</option>
              <option>Apartment</option>
              <option>Villa</option>
              <option>Penthouse</option>
              <option>Studio</option>
              <option>Commercial Office</option>
            </select>
          </label>
          <label className="block">
            <span className="text-label font-medium text-text-primary">Year Built</span>
            <input type="text" value={formData.yearBuilt} onChange={(event) => update('yearBuilt', event.target.value)} className="mt-2 w-full rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary-100" />
          </label>
          <label className="block">
            <span className="text-label font-medium text-text-primary">Current Status</span>
            <select value={formData.currentStatus} onChange={(event) => update('currentStatus', event.target.value)} className="mt-2 w-full rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary-100">
              <option>Available for Rent</option>
              <option>Under Renovation</option>
              <option>Occupied</option>
              <option>Draft Review</option>
            </select>
          </label>
        </div>

        <label className="block">
          <span className="text-label font-medium text-text-primary">Internal Reference ID</span>
          <input type="text" value={formData.referenceId} onChange={(event) => update('referenceId', event.target.value)} className="mt-2 w-full rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary-100" />
        </label>

        <label className="block">
          <span className="text-label font-medium text-text-primary">Property Description</span>
          <textarea rows={5} value={formData.description} onChange={(event) => update('description', event.target.value.slice(0, 1000))} className="mt-2 w-full resize-none rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary-100" />
          <span className="mt-2 block text-right text-label text-text-muted">{formData.description.length} / 1000 characters</span>
        </label>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Bedrooms', value: '2 Beds', icon: BedDouble },
            { label: 'Bathrooms', value: '2 Baths', icon: Bath },
            { label: 'Area', value: '1,200 sqft', icon: Home },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="flex items-center gap-3 rounded-button border border-outline bg-canvas-alt p-4">
                <Icon size={18} className="text-navy" />
                <div>
                  <p className="text-filter-label uppercase text-text-muted">{item.label}</p>
                  <p className="text-label font-bold text-text-primary">{item.value}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </article>
  )
}

function LocationStep({ formData, update, pin, setPin }: StepProps & { pin: { x: number; y: number }; setPin: (pin: { x: number; y: number }) => void }) {
  return (
    <div className="space-y-6">
      <article className="rounded-card border border-outline bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-heading-3 font-bold text-text-primary">Location Details</h2>
          <p className="mt-1 text-label text-text-muted">Precisely mark the location to help tenants find the property.</p>
        </div>

        <div className="mt-6 space-y-5">
          <label className="block">
            <span className="text-label font-medium text-text-primary">Street Address</span>
            <input type="text" value={formData.streetAddress} onChange={(event) => update('streetAddress', event.target.value)} className="mt-2 w-full rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary-100" />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="text-label font-medium text-text-primary">Unit / Suite Number</span>
              <input type="text" value={formData.unit} onChange={(event) => update('unit', event.target.value)} className="mt-2 w-full rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary-100" />
            </label>
            <label className="block">
              <span className="text-label font-medium text-text-primary">Postal Code</span>
              <input type="text" value={formData.postalCode} onChange={(event) => update('postalCode', event.target.value)} className="mt-2 w-full rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary-100" />
            </label>
            <label className="block">
              <span className="text-label font-medium text-text-primary">City</span>
              <select value={formData.city} onChange={(event) => update('city', event.target.value)} className="mt-2 w-full rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary-100">
                <option>Chennai</option>
                <option>Bangalore</option>
                <option>Mumbai</option>
                <option>New York City</option>
              </select>
            </label>
            <label className="block">
              <span className="text-label font-medium text-text-primary">Neighborhood</span>
              <input type="text" value={formData.neighborhood} onChange={(event) => update('neighborhood', event.target.value)} className="mt-2 w-full rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary-100" />
            </label>
          </div>
        </div>
      </article>

      <article className="overflow-hidden rounded-card border border-outline bg-white shadow-sm">
        <div className="flex items-start justify-between gap-4 border-b border-outline px-6 py-5">
          <div>
            <h2 className="text-heading-3 font-bold text-text-primary">Map Pin</h2>
            <p className="mt-1 text-label text-text-muted">Click the map or use GPS to set the property entrance.</p>
          </div>
          <button type="button" onClick={() => setPin({ x: 58, y: 46 })} className="inline-flex items-center gap-2 rounded-button bg-primary-100 px-3 py-2 text-label font-bold text-primary hover:bg-active">
            <Crosshair size={14} />
            Use GPS
          </button>
        </div>
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
          <div className="absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-modal bg-navy text-white shadow-modal" style={{ left: `${pin.x}%`, top: `${pin.y}%` }}>
            <MapPin size={22} />
          </div>
        </button>
      </article>
    </div>
  )
}

function AmenitiesRulesStep({ formData, update }: StepProps) {
  const toggleAmenity = (key: keyof OwnerRegisterPropertyFormData['amenities']) => {
    update('amenities', { ...formData.amenities, [key]: !formData.amenities[key] })
  }

  const toggleFeature = (key: keyof OwnerRegisterPropertyFormData['buildingFeatures']) => {
    update('buildingFeatures', { ...formData.buildingFeatures, [key]: !formData.buildingFeatures[key] })
  }

  const amenityItems = [
    { key: 'wifi' as const, label: 'High-Speed WiFi', icon: Wifi },
    { key: 'ac' as const, label: 'Air Conditioning', icon: Zap },
    { key: 'heating' as const, label: 'Heating', icon: Home },
    { key: 'smartLock' as const, label: 'Smart Lock', icon: LockKeyhole },
    { key: 'washerDryer' as const, label: 'Washer/Dryer', icon: Building2 },
    { key: 'dishwasher' as const, label: 'Dishwasher', icon: Home },
  ]

  const featureItems = [
    { key: 'gym' as const, label: 'Fitness Center', icon: Dumbbell },
    { key: 'pool' as const, label: 'Infinity Pool', icon: Waves },
    { key: 'parking' as const, label: 'Secure Parking', icon: Car },
    { key: 'security' as const, label: '24/7 Security', icon: ShieldCheck },
  ]

  return (
    <div className="space-y-6">
      <article className="rounded-card border border-outline bg-white p-6 shadow-sm">
        <h2 className="text-heading-3 font-bold text-text-primary">Amenities</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {amenityItems.map((item) => {
            const Icon = item.icon
            const selected = formData.amenities[item.key]
            return (
              <button key={item.key} type="button" onClick={() => toggleAmenity(item.key)} className={cn('flex items-center gap-3 rounded-button border p-4 text-left transition-colors', selected ? 'border-navy bg-primary-50' : 'border-outline bg-white hover:bg-hover-light')}>
                <Icon size={18} className="text-navy" />
                <span className="text-body font-semibold text-text-primary">{item.label}</span>
              </button>
            )
          })}
        </div>
      </article>

      <article className="rounded-card border border-outline bg-white p-6 shadow-sm">
        <h2 className="text-heading-3 font-bold text-text-primary">Building Features</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {featureItems.map((item) => {
            const Icon = item.icon
            const selected = formData.buildingFeatures[item.key]
            return (
              <button key={item.key} type="button" onClick={() => toggleFeature(item.key)} className={cn('flex items-center justify-between rounded-button border p-4 transition-colors', selected ? 'border-navy bg-primary-50' : 'border-outline bg-white hover:bg-hover-light')}>
                <span className="flex items-center gap-3 text-body font-semibold text-text-primary"><Icon size={18} className="text-navy" />{item.label}</span>
                <span className={cn('h-3 w-3 rounded-full', selected ? 'bg-primary' : 'bg-slate-300')} />
              </button>
            )
          })}
        </div>
      </article>

      <article className="rounded-card border border-outline bg-white p-6 shadow-sm">
        <h2 className="text-heading-3 font-bold text-text-primary">Rules & Tenant Preferences</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="flex items-start gap-3 rounded-button border border-outline p-4">
            <input type="checkbox" checked={formData.residentialZoning} onChange={(event) => update('residentialZoning', event.target.checked)} className="mt-1 h-4 w-4" />
            <span><span className="block text-body font-semibold text-text-primary">Residential zoning</span><span className="text-label text-text-muted">Approved for standard long-term housing.</span></span>
          </label>
          <label className="flex items-start gap-3 rounded-button border border-outline p-4">
            <input type="checkbox" checked={formData.mixedUse} onChange={(event) => update('mixedUse', event.target.checked)} className="mt-1 h-4 w-4" />
            <span><span className="block text-body font-semibold text-text-primary">Mixed-use access</span><span className="text-label text-text-muted">Allows commercial/common-zone access where applicable.</span></span>
          </label>
        </div>
        <label className="mt-5 block">
          <span className="text-label font-medium text-text-primary">Unique Selling Points</span>
          <textarea rows={4} value={formData.sellingPoints} onChange={(event) => update('sellingPoints', event.target.value)} className="mt-2 w-full resize-none rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary-100" />
        </label>
        <label className="mt-5 flex items-center justify-between rounded-button border border-outline p-4">
          <span className="flex items-center gap-3 text-body font-semibold text-text-primary"><PawPrint size={18} className="text-navy" />Pet policy enabled</span>
          <input type="checkbox" checked={formData.petPolicy} onChange={(event) => update('petPolicy', event.target.checked)} className="h-4 w-4" />
        </label>
        {formData.petPolicy && (
          <textarea rows={3} value={formData.petDetails} onChange={(event) => update('petDetails', event.target.value)} className="mt-3 w-full resize-none rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary-100" />
        )}
      </article>
    </div>
  )
}

function MediaStep({ formData, update }: StepProps) {
  const addSamplePhoto = () => {
    update('photos', [
      ...formData.photos,
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=500&q=80',
    ])
  }

  return (
    <div className="space-y-6">
      <article className="rounded-card border border-outline bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-heading-3 font-bold text-text-primary">Property Photos</h2>
            <p className="mt-1 text-label text-text-muted">Manage listing images shown in the property gallery.</p>
          </div>
          <span className="w-fit rounded-pill bg-primary-50 px-3 py-1 text-badge font-bold uppercase text-primary">
            {formData.photos.length} photos
          </span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
          {formData.photos.map((photo, index) => (
            <div key={`${photo}-${index}`} className="relative h-32 overflow-hidden rounded-button bg-slate-100">
              <img src={photo} alt={`Property gallery ${index + 1}`} className="h-full w-full object-cover" />
              {index === 0 && <span className="absolute left-2 top-2 rounded-pill bg-navy px-2 py-0.5 text-[10px] font-bold text-white">Cover</span>}
            </div>
          ))}
          <button type="button" onClick={addSamplePhoto} className="flex h-32 flex-col items-center justify-center rounded-button border-2 border-dashed border-outline bg-canvas-alt text-text-muted hover:border-primary hover:text-primary">
            <Image size={24} />
            <span className="mt-2 text-label font-semibold">Add Sample</span>
          </button>
        </div>
      </article>

      <article className="rounded-card border border-outline bg-white p-6 shadow-sm">
        <h2 className="text-heading-3 font-bold text-text-primary">Virtual Tour / Video</h2>
        <div className="mt-4 flex flex-col gap-3 md:flex-row">
          <label className="relative flex-1">
            <Video size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input type="text" value={formData.virtualTourUrl} onChange={(event) => update('virtualTourUrl', event.target.value)} className="h-12 w-full rounded-input border border-outline bg-white pl-10 pr-4 text-body text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary-100" />
          </label>
          <button type="button" className="inline-flex items-center justify-center gap-2 rounded-button border border-outline bg-white px-4 py-3 text-body font-semibold text-text-primary hover:bg-hover-light">
            <Upload size={16} />
            Upload 360 Video
          </button>
        </div>
      </article>

      <article className="rounded-card border border-outline bg-white p-6 shadow-sm">
        <h2 className="text-heading-3 font-bold text-text-primary">Media Notes</h2>
        <p className="mt-2 text-label text-text-muted">Use clear cover images, room-wise gallery order, and short video links for higher tenant conversion.</p>
        <div className="mt-5 flex items-center gap-3 rounded-button bg-primary-50 p-4 text-primary">
          <Camera size={20} />
          <span className="text-body font-bold">Cover image is ready for tenant listing cards.</span>
        </div>
      </article>
    </div>
  )
}

function PricingLeaseStep({ formData, update, onSave }: StepProps & { onSave: () => void }) {
  const annualRevenue = useMemo(() => Number(formData.baseRent || 0) * 12, [formData.baseRent])
  const toggleUtility = (key: keyof OwnerRegisterPropertyFormData['utilities']) => {
    update('utilities', { ...formData.utilities, [key]: !formData.utilities[key] })
  }

  return (
    <div className="space-y-6">
      <article className="rounded-card border border-outline bg-white p-6 shadow-sm">
        <h2 className="text-heading-3 font-bold text-text-primary">Pricing & Deposit</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <label className="block">
            <span className="text-label font-medium text-text-primary">Monthly Rent</span>
            <input type="text" value={formData.baseRent} onChange={(event) => update('baseRent', event.target.value)} className="mt-2 w-full rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary-100" />
          </label>
          <label className="block">
            <span className="text-label font-medium text-text-primary">Security Deposit</span>
            <input type="text" value={formData.securityDeposit} onChange={(event) => update('securityDeposit', event.target.value)} className="mt-2 w-full rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary-100" />
          </label>
          <label className="block">
            <span className="text-label font-medium text-text-primary">Deposit Unit</span>
            <select value={formData.depositUnit} onChange={(event) => update('depositUnit', event.target.value)} className="mt-2 w-full rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary-100">
              <option>Fixed</option>
              <option>Months</option>
            </select>
          </label>
        </div>
      </article>

      <article className="rounded-card border border-outline bg-white p-6 shadow-sm">
        <h2 className="text-heading-3 font-bold text-text-primary">Lease Terms</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <label className="block">
            <span className="text-label font-medium text-text-primary">Available From</span>
            <input type="text" value={formData.availableFrom} onChange={(event) => update('availableFrom', event.target.value)} className="mt-2 w-full rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary-100" />
          </label>
          <label className="block">
            <span className="text-label font-medium text-text-primary">Lease Duration</span>
            <input type="range" min={1} max={24} value={formData.leaseDuration} onChange={(event) => update('leaseDuration', Number(event.target.value))} className="mt-5 w-full accent-primary" />
            <span className="mt-2 block text-center text-label font-bold text-primary">{formData.leaseDuration} months</span>
          </label>
          <label className="block">
            <span className="text-label font-medium text-text-primary">Notice Period</span>
            <input type="text" value={formData.noticePeriod} onChange={(event) => update('noticePeriod', event.target.value)} className="mt-2 w-full rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary-100" />
          </label>
        </div>

        <div className="mt-6">
          <p className="text-label font-medium text-text-primary">Utilities Included</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {(['electricity', 'water', 'internet', 'gas'] as const).map((utility) => (
              <button key={utility} type="button" onClick={() => toggleUtility(utility)} className={cn('rounded-button border px-4 py-2 text-label font-bold capitalize', formData.utilities[utility] ? 'border-navy bg-primary-50 text-navy' : 'border-outline bg-white text-text-muted hover:bg-hover-light')}>
                {utility}
              </button>
            ))}
          </div>
        </div>
      </article>

      <article className="rounded-card border border-outline bg-white p-6 shadow-sm">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-button bg-canvas-alt p-4">
            <p className="text-filter-label uppercase text-text-muted">Monthly rent</p>
            <p className="mt-1 text-heading-3 font-bold text-primary">${Number(formData.baseRent || 0).toLocaleString()}</p>
          </div>
          <div className="rounded-button bg-canvas-alt p-4">
            <p className="text-filter-label uppercase text-text-muted">Annual revenue</p>
            <p className="mt-1 text-heading-3 font-bold text-text-primary">${annualRevenue.toLocaleString()}</p>
          </div>
          <div className="rounded-button bg-canvas-alt p-4">
            <p className="text-filter-label uppercase text-text-muted">Deposit</p>
            <p className="mt-1 text-heading-3 font-bold text-text-primary">${Number(formData.securityDeposit || 0).toLocaleString()}</p>
          </div>
        </div>
        <button type="button" onClick={onSave} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-button bg-navy px-6 py-3 text-body font-semibold text-white hover:bg-slate-800">
          <CheckCircle2 size={16} />
          Save Property Changes
        </button>
      </article>
    </div>
  )
}
