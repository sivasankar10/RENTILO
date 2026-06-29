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

