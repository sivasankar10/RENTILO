import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Building2, Check } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { ROUTES } from '@shared/constants/routes'
import { usePrototypeStore } from '@shared/store/prototypeStore'
import { useEnterpriseContext } from '../hooks/useEnterpriseContext'

type StepNumber = 1 | 2 | 3 | 4 | 5

const steps = [
  { number: 1 as StepNumber, label: 'Unit Configuration' },
  { number: 2 as StepNumber, label: 'Property Location' },
  { number: 3 as StepNumber, label: 'Amenities & Features' },
  { number: 4 as StepNumber, label: 'Media & Gallery' },
  { number: 5 as StepNumber, label: 'Pricing & Lease' },
]

export function EnterpriseAddUnit() {
  const navigate = useNavigate()
  const { currentBlockId, enterpriseBlocks } = useEnterpriseContext()
  const currentBlock = enterpriseBlocks.find((b) => b.id === currentBlockId)
  const blockData = currentBlock?.enterpriseBlock

  const [currentStep, setCurrentStep] = useState<StepNumber>(1)
  const [unitNumber, setUnitNumber] = useState('')
  const [floor, setFloor] = useState('1')
  const [bedrooms, setBedrooms] = useState('2')
  const [hall, setHall] = useState('1')
  const [kitchen, setKitchen] = useState('1')
  const [washrooms, setWashrooms] = useState('2')
  const [sqft, setSqft] = useState('1200')
  const [unitType, setUnitType] = useState('Apartment')
  const [supportStatus, setSupportStatus] = useState('')

  const goNext = () => setCurrentStep((s) => Math.min(5, s + 1) as StepNumber)
  const goPrev = () => setCurrentStep((s) => Math.max(1, s - 1) as StepNumber)

  const handleSubmit = () => {
    if (!unitNumber.trim() || !currentBlockId) return

    // Add the unit to the current block's units array in the prototype store
    const newUnit = {
      unitId: `unit-${currentBlockId}-${floor}-${unitNumber}-${Date.now()}`,
      floor: parseInt(floor) || 1,
      unitNumber: unitNumber.trim(),
      status: 'Vacant' as const,
    }

    usePrototypeStore.setState((state) => ({
      properties: state.properties.map((p) =>
        p.id === currentBlockId && p.enterpriseBlock
          ? {
              ...p,
              enterpriseBlock: {
                ...p.enterpriseBlock,
                units: [...p.enterpriseBlock.units, newUnit],
              },
              updatedAt: new Date().toISOString(),
            }
          : p
      ),
    }))

    setSupportStatus(`Unit ${unitNumber} added to Floor ${floor} of Block ${blockData?.blockName ?? ''}.`)
    setTimeout(() => navigate(ROUTES.ENTERPRISE.PORTFOLIO), 1000)
  }

  return (
    <div className="min-h-screen bg-canvas-alt px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-label text-text-muted">
              Portfolio › Block {blockData?.blockName ?? ''} › <span className="text-text-primary">Add Unit</span>
            </p>
            <h1 className="mt-2 text-heading-1 font-bold tracking-tight text-text-primary">
              Add New Unit
            </h1>
            <p className="mt-1 text-body text-text-muted">Configure a new unit for Block {blockData?.blockName ?? ''}</p>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => navigate(ROUTES.ENTERPRISE.PORTFOLIO)} className="rounded-button border border-outline bg-white px-5 py-2.5 text-body font-medium text-text-primary shadow-sm hover:bg-hover-light">Cancel</button>
            <button type="button" onClick={handleSubmit} className="rounded-button bg-navy px-5 py-2.5 text-body font-semibold text-white shadow-sm hover:bg-slate-800">Add Unit</button>
          </div>
        </div>

        {supportStatus && <p className="text-label font-semibold text-status-success-text">{supportStatus}</p>}

        {/* Layout */}
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-card border border-outline bg-white p-5 shadow-sm">
              <nav className="space-y-4">
                {steps.map((step) => {
                  const isCompleted = step.number < currentStep
                  const isActive = step.number === currentStep
                  return (
                    <button type="button" key={step.number} onClick={() => setCurrentStep(step.number)} className="flex w-full items-start gap-3 text-left">
                      <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-badge font-bold', isCompleted ? 'bg-primary text-white' : isActive ? 'bg-navy text-white' : 'bg-slate-100 text-text-muted')}>
                        {isCompleted ? <Check size={14} /> : step.number}
                      </div>
                      <span className={cn('pt-0.5 text-body', isActive ? 'font-bold text-text-primary' : 'font-medium text-text-muted')}>{step.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Block Info */}
            <div className="rounded-card bg-primary-100 p-5">
              <h3 className="text-body font-bold text-text-primary flex items-center gap-2"><Building2 size={15} /> Current Block</h3>
              <p className="mt-2 text-label text-text-muted">Block {blockData?.blockName ?? '—'}</p>
              <p className="text-label text-text-muted">{blockData?.floors ?? 0} floors · {blockData?.units.length ?? 0} existing units</p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {currentStep === 1 && (
              <div className="rounded-card border border-outline bg-white p-8 shadow-sm space-y-6">
                <div>
                  <h2 className="text-heading-3 font-bold text-text-primary">Unit Configuration</h2>
                  <p className="mt-1 text-body text-text-muted">Define the unit details for Block {blockData?.blockName ?? ''}.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-label font-medium text-text-muted">Unit Number</label>
                    <input value={unitNumber} onChange={(e) => setUnitNumber(e.target.value)} placeholder="e.g., 101, A-201" className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body font-semibold text-text-primary focus:border-primary focus:outline-none" />
                    <p className="mt-1 text-[11px] text-text-muted">Unique identifier for this unit within the block.</p>
                  </div>
                  <div>
                    <label className="text-label font-medium text-text-muted">Floor</label>
                    <select value={floor} onChange={(e) => setFloor(e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-3 text-body text-text-primary focus:border-primary focus:outline-none">
                      {Array.from({ length: blockData?.floors ?? 10 }, (_, i) => i + 1).map((f) => (
                        <option key={f} value={f}>Floor {f}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-label font-medium text-text-muted">Unit Type</label>
                  <select value={unitType} onChange={(e) => setUnitType(e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-3 text-body text-text-primary focus:border-primary focus:outline-none">
                    <option>Apartment</option>
                    <option>Studio</option>
                    <option>Penthouse</option>
                    <option>Commercial Office</option>
                    <option>Retail Space</option>
                  </select>
                </div>

                {/* Room Configuration */}
                <div className="border-t border-outline pt-6">
                  <h3 className="text-body font-bold text-text-primary mb-4">Room Configuration</h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Bedrooms</label>
                      <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-3 text-body font-semibold text-text-primary focus:border-primary focus:outline-none">
                        {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Hall / Living</label>
                      <select value={hall} onChange={(e) => setHall(e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-3 text-body font-semibold text-text-primary focus:border-primary focus:outline-none">
                        {[0,1,2].map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Kitchen</label>
                      <select value={kitchen} onChange={(e) => setKitchen(e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-3 text-body font-semibold text-text-primary focus:border-primary focus:outline-none">
                        {[0,1,2].map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Washrooms</label>
                      <select value={washrooms} onChange={(e) => setWashrooms(e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-3 text-body font-semibold text-text-primary focus:border-primary focus:outline-none">
                        {[1,2,3,4].map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Built-up Area */}
                <div>
                  <label className="text-label font-medium text-text-muted">Built-up Area (sqft)</label>
                  <input value={sqft} onChange={(e) => setSqft(e.target.value)} placeholder="1200" className="mt-1.5 h-11 w-full max-w-xs rounded-input border border-outline bg-white px-4 text-body font-semibold text-text-primary focus:border-primary focus:outline-none" />
                </div>

                {/* Summary */}
                <div className="rounded-lg bg-canvas-alt p-4 border border-outline">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted">Unit Summary</p>
                  <p className="mt-2 text-body font-bold text-text-primary">
                    {bedrooms} BHK · {hall} Hall · {kitchen} Kitchen · {washrooms} Washroom{parseInt(washrooms) > 1 ? 's' : ''} · {sqft} sqft
                  </p>
                  <p className="mt-1 text-label text-text-muted">Block {blockData?.blockName ?? '—'}, Floor {floor}, Unit {unitNumber || '—'}</p>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="rounded-card border border-outline bg-white p-8 shadow-sm space-y-6">
                <h2 className="text-heading-3 font-bold text-text-primary">Location Details</h2>
                <p className="text-body text-text-muted">Location inherited from the parent block. Override if this unit has a different address.</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-label font-medium text-text-muted">City</label>
                    <input defaultValue={currentBlock?.city ?? ''} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-label font-medium text-text-muted">Neighborhood</label>
                    <input defaultValue={currentBlock?.neighborhood ?? ''} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none" />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="rounded-card border border-outline bg-white p-8 shadow-sm space-y-6">
                <h2 className="text-heading-3 font-bold text-text-primary">Amenities & Features</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {['High-speed Wi-Fi', 'Air Conditioning', 'Heating', 'Smart Lock', 'Washer/Dryer', 'Dishwasher', 'Balcony', 'Modular Kitchen'].map((a) => (
                    <label key={a} className="flex items-center gap-3 rounded-xl border border-outline p-3 cursor-pointer hover:bg-hover-light">
                      <input type="checkbox" defaultChecked={['Air Conditioning', 'Modular Kitchen'].includes(a)} className="h-4 w-4 rounded" />
                      <span className="text-[13px] font-semibold text-text-primary">{a}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="rounded-card border border-outline bg-white p-8 shadow-sm space-y-6">
                <h2 className="text-heading-3 font-bold text-text-primary">Media & Gallery</h2>
                <div className="rounded-xl border-2 border-dashed border-outline bg-canvas-alt p-10 text-center">
                  <p className="text-[14px] font-semibold text-text-primary">Drag and drop unit photos here</p>
                  <p className="mt-1 text-[12px] text-text-muted">JPG or PNG, up to 10MB each</p>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="rounded-card border border-outline bg-white p-8 shadow-sm space-y-6">
                <h2 className="text-heading-3 font-bold text-text-primary">Pricing & Lease</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-label font-medium text-text-muted">Monthly Rent</label>
                    <input defaultValue="45000" className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body font-semibold text-text-primary focus:border-primary focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-label font-medium text-text-muted">Security Deposit</label>
                    <input defaultValue="90000" className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body font-semibold text-text-primary focus:border-primary focus:outline-none" />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              {currentStep > 1 ? (
                <button type="button" onClick={goPrev} className="text-body font-medium text-text-muted hover:text-text-primary">← Previous Step</button>
              ) : <span />}
              {currentStep < 5 ? (
                <button type="button" onClick={goNext} className="inline-flex items-center gap-2 rounded-button bg-navy px-6 py-3 text-body font-semibold text-white hover:bg-slate-800">
                  Continue <ArrowRight size={16} />
                </button>
              ) : (
                <button type="button" onClick={handleSubmit} disabled={!unitNumber.trim()} className="inline-flex items-center gap-2 rounded-button bg-primary px-6 py-3 text-body font-semibold text-white hover:bg-primary-700 disabled:opacity-50">
                  Add Unit <Check size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
