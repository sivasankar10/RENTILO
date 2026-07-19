import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Building2, Check, Edit3, Lock, Plus } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { ROUTES } from '@shared/constants/routes'
import { useOwnerStore, type OwnerRegisterPropertyFormData } from '../store/ownerStore'
import { useOwnerPrototype } from '../hooks/useOwnerPrototype'
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
  const { propertyId } = useParams<{ propertyId: string }>()
  const { properties, updateProperty } = useOwnerPrototype()
  const selectedPropertyId = useOwnerStore((state) => state.selectedPropertyId)
  const subscriptionPlan = useOwnerStore((state) => state.subscriptionPlan)
  const showUpgradePrompt = useOwnerStore((state) => state.showUpgradePrompt)
  const isPremium = subscriptionPlan === 'PREMIUM'
  const targetPropertyId = propertyId ?? selectedPropertyId ?? properties[0]?.id
  const targetProperty = properties.find((property) => property.id === targetPropertyId)
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

  useEffect(() => {
    if (!propertyId || !targetProperty) return
    updateRegisterPropertyDraft('propertyName', targetProperty.title)
    updateRegisterPropertyDraft('propertyType', targetProperty.propertyType)
    updateRegisterPropertyDraft('description', targetProperty.description)
    updateRegisterPropertyDraft('streetAddress', targetProperty.address)
    updateRegisterPropertyDraft('unit', targetProperty.unit)
    updateRegisterPropertyDraft('postalCode', targetProperty.postalCode)
    updateRegisterPropertyDraft('city', targetProperty.city)
    updateRegisterPropertyDraft('neighborhood', targetProperty.neighborhood)
    updateRegisterPropertyDraft('baseRent', targetProperty.price.replace(/\D/g, ''))
    updateRegisterPropertyDraft('securityDeposit', targetProperty.deposit.replace(/\D/g, ''))
    updateRegisterPropertyDraft('availableFrom', targetProperty.availableFrom)
    updateRegisterPropertyDraft('visitWeekday', targetProperty.visitWeekday)
    updateRegisterPropertyDraft('visitStartTime', targetProperty.visitStartTime)
    updateRegisterPropertyDraft('visitEndTime', targetProperty.visitEndTime)
    updateRegisterPropertyDraft('preferredVisitSlots', targetProperty.preferredVisitSlots ?? [{ day: targetProperty.visitWeekday, startTime: targetProperty.visitStartTime, endTime: targetProperty.visitEndTime }])
    updateRegisterPropertyDraft('visitSchedulingEnabled', targetProperty.visitSchedulingEnabled ?? true)
    updateRegisterPropertyDraft('leaseDuration', targetProperty.leaseDuration)
    updateRegisterPropertyDraft('noticePeriod', targetProperty.noticePeriod)
    updateRegisterPropertyDraft('photos', targetProperty.gallery)
  }, [propertyId, targetProperty, updateRegisterPropertyDraft])

  const goNext = () => setCurrentStep((step) => Math.min(5, step + 1) as StepNumber)
  const goPrev = () => setCurrentStep((step) => Math.max(1, step - 1) as StepNumber)

  const saveSharedProperty = () => {
    if (!targetPropertyId) return
    const gallery = formData.photos.length ? formData.photos : undefined
    updateProperty(targetPropertyId, {
      title: formData.propertyName || undefined,
      propertyType: formData.propertyType || undefined,
      description: formData.description || undefined,
      address: formData.streetAddress || undefined,
      unit: formData.unit || undefined,
      postalCode: formData.postalCode || undefined,
      city: formData.city || undefined,
      neighborhood: formData.neighborhood || undefined,
      price: formData.baseRent ? `Rs. ${Number(formData.baseRent.replace(/\D/g, '')).toLocaleString('en-IN')}` : undefined,
      deposit: formData.securityDeposit ? `Rs. ${Number(formData.securityDeposit.replace(/\D/g, '')).toLocaleString('en-IN')}` : undefined,
      availableFrom: formData.availableFrom || undefined,
      visitWeekday: formData.visitWeekday || undefined,
      visitStartTime: formData.visitStartTime || undefined,
      visitEndTime: formData.visitEndTime || undefined,
      preferredVisitSlots: formData.preferredVisitSlots.length > 0 ? formData.preferredVisitSlots : undefined,
      visitSchedulingEnabled: formData.visitSchedulingEnabled,
      leaseDuration: formData.leaseDuration,
      noticePeriod: formData.noticePeriod || undefined,
      image: gallery?.[0],
      gallery,
    })
  }

  const handleSaveDraft = () => {
    saveRegisterPropertyDraft()
    saveSharedProperty()
    setDraftStatus('Property details saved locally.')
  }

  const handleComplete = () => {
    saveRegisterPropertyDraft()
    saveSharedProperty()
    setDraftStatus('Property details updated.')
    navigate(ROUTES.OWNER.DASHBOARD)
  }

  const handleAddProperty = () => {
    if (isPremium) {
      navigate(ROUTES.OWNER.REGISTER_PROPERTY)
    } else {
      showUpgradePrompt('bulk_property_management')
    }
  }

  if (!propertyId) {
    return (
      <div className="min-h-screen bg-canvas-alt px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-filter-label font-bold uppercase tracking-wider text-primary">Owner portfolio</p>
              <h1 className="mt-2 text-heading-1 font-bold text-text-primary">Properties</h1>
              <p className="mt-1 text-body text-text-muted">Published properties are shared with tenant, broker, and admin views.</p>
            </div>
            <button
              type="button"
              onClick={handleAddProperty}
              className={cn(
                'inline-flex items-center gap-2 rounded-button px-5 py-3 text-label font-bold text-white',
                isPremium ? 'bg-primary' : 'bg-slate-400 cursor-not-allowed opacity-70'
              )}
            >
              {isPremium ? <Plus size={17} /> : <Lock size={17} />}
              {isPremium ? 'Add property' : 'Upgrade to Add'}
            </button>
          </div>
          {properties.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {properties.map((property) => (
                <article key={property.id} className="overflow-hidden rounded-card border border-outline bg-white shadow-sm">
                  <img src={property.image} alt="" className="aspect-[16/9] w-full object-cover" />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-heading-3 font-bold text-text-primary">{property.title}</h2>
                        <p className="mt-1 text-label text-text-muted">{property.address}</p>
                      </div>
                      <Building2 size={20} className="shrink-0 text-primary" />
                    </div>
                    <p className="mt-4 text-body font-bold text-primary">
                      {property.price}
                      <span className="font-normal text-text-muted">{property.pricePeriod}</span>
                    </p>
                    <div className="mt-5 flex gap-2">
                      <button type="button" onClick={() => navigate(ROUTES.OWNER.PROPERTY_DETAIL(property.id))} className="flex-1 rounded-button border border-outline px-3 py-2 text-label font-semibold text-text-primary">View</button>
                      <button type="button" onClick={() => navigate(`/owner/properties/${property.id}/edit`)} className="inline-flex items-center justify-center gap-2 rounded-button bg-navy px-4 py-2 text-label font-semibold text-white"><Edit3 size={15} /> Edit</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-card border border-dashed border-outline bg-white p-12 text-center">
              <Building2 className="mx-auto text-text-muted" size={40} />
              <h2 className="mt-4 text-heading-3 font-bold">No owner properties</h2>
              <p className="mt-2 text-body text-text-muted">Publish your first property to start the shared prototype flow.</p>
            </div>
          )}
        </div>
      </div>
    )
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
