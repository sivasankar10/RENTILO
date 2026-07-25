import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, Building2, Check, Plus, Trash2 } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { ROUTES } from '@shared/constants/routes'
import { useAuth } from '@shared/hooks/useAuth'
import { usePrototypeStore } from '@shared/store/prototypeStore'

type StepNumber = 1 | 2 | 3 | 4 | 5

interface BlockData {
  id: string
  name: string
  floors: number
  totalUnits: number
}

const steps = [
  { number: 1 as StepNumber, label: 'Basic Information' },
  { number: 2 as StepNumber, label: 'Property Location' },
  { number: 3 as StepNumber, label: 'Amenities & Features' },
  { number: 4 as StepNumber, label: 'Media & Gallery' },
  { number: 5 as StepNumber, label: 'Lease Terms' },
]

const propertyTypes = ['Commercial Office', 'Residential Complex', 'Mixed Use', 'Retail Space', 'Industrial Park', 'Co-working Space']
const statusOptions = ['Available for Rent', 'Under Construction', 'Pre-leasing', 'Fully Occupied']

export function EnterpriseRegisterProperty() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { blockId } = useParams<{ blockId?: string }>()
  const createOwnerProperty = usePrototypeStore((s) => s.createOwnerProperty)
  const allProperties = usePrototypeStore((s) => s.properties)

  // Edit mode detection
  const isEditMode = Boolean(blockId)
  const editProperty = blockId ? allProperties.find((p) => p.id === blockId) : null
  const editBlockData = editProperty?.enterpriseBlock

  const [currentStep, setCurrentStep] = useState<StepNumber>(1)
  const [propertyName, setPropertyName] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [yearBuilt, setYearBuilt] = useState('')
  const [referenceId, setReferenceId] = useState('')
  const [currentStatus, setCurrentStatus] = useState('Available for Rent')
  const [description, setDescription] = useState('')
  const [blocks, setBlocks] = useState<BlockData[]>([])
  const [supportStatus, setSupportStatus] = useState('')
  const [leaseDurationValue, setLeaseDurationValue] = useState(12)
  const [customTags, setCustomTags] = useState<string[]>([])
  const [streetAddress, setStreetAddress] = useState('')
  const [city, setCity] = useState('Bangalore')
  const [neighborhood, setNeighborhood] = useState('')

  // Pre-fill in edit mode
  useEffect(() => {
    if (!editProperty) return
    if (editBlockData) {
      // Property with block
      setPropertyName(editProperty.title.replace(` - Block ${editBlockData.blockName}`, '').replace(` - ${editBlockData.blockName}`, ''))
      setPropertyType(editProperty.propertyType)
      setDescription(editProperty.description)
      setStreetAddress(editProperty.address)
      setCity(editProperty.city)
      setNeighborhood(editProperty.neighborhood)
      setBlocks([{
        id: 'edit-block',
        name: `Block ${editBlockData.blockName}`,
        floors: editBlockData.floors,
        totalUnits: editBlockData.unitsPerFloor * editBlockData.floors,
      }])
    } else {
      // Standalone property (no blocks yet)
      setPropertyName(editProperty.title)
      setPropertyType(editProperty.propertyType)
      setDescription(editProperty.description)
      setStreetAddress(editProperty.address)
      setCity(editProperty.city)
      setNeighborhood(editProperty.neighborhood)
      setBlocks([]) // No blocks
    }
  }, [editProperty, editBlockData])

  const addBlock = () => {
    setBlocks((current) => [
      ...current,
      { id: `block-${Date.now()}`, name: `Block ${String.fromCharCode(65 + current.length)}`, floors: 4, totalUnits: 24 },
    ])
  }

  const updateBlock = (id: string, patch: Partial<BlockData>) => {
    setBlocks((current) => current.map((b) => (b.id === id ? { ...b, ...patch } : b)))
  }

  const removeBlock = (id: string) => {
    setBlocks((current) => current.filter((b) => b.id !== id))
  }

  const goNext = () => setCurrentStep((s) => Math.min(5, s + 1) as StepNumber)
  const goPrev = () => setCurrentStep((s) => Math.max(1, s - 1) as StepNumber)

  const handleSaveDraft = () => {
    setSupportStatus('Draft saved.')
  }

  const handleSubmit = () => {
    const ownerId = user?.id ?? ''

    // EDIT MODE: update existing property + create/update blocks
    if (isEditMode && blockId) {
      const timestamp = new Date().toISOString()

      if (blocks.length === 0) {
        // Just update property details (no blocks added)
        usePrototypeStore.setState((state) => ({
          properties: state.properties.map((p) =>
            p.id === blockId ? {
              ...p,
              title: propertyName || p.title,
              propertyType: propertyType || p.propertyType,
              description: description || p.description,
              address: streetAddress || p.address,
              city: city || p.city,
              neighborhood: neighborhood || p.neighborhood,
              updatedAt: timestamp,
            } : p
          ),
        }))
        setSupportStatus('Property updated.')
        setTimeout(() => navigate(ROUTES.ENTERPRISE.PORTFOLIO), 800)
        return
      }

      // First block = update existing property (add enterpriseBlock if it doesn't have one)
      const firstBlock = blocks[0]
      usePrototypeStore.setState((state) => ({
        properties: state.properties.map((p) =>
          p.id === blockId ? {
            ...p,
            title: `${propertyName || 'Enterprise Property'} - ${firstBlock.name}`,
            propertyType: propertyType || 'Commercial Complex',
            description: description || `${firstBlock.name}. ${firstBlock.floors} floors, ${firstBlock.totalUnits} units capacity.`,
            enterpriseBlock: p.enterpriseBlock
              ? { ...p.enterpriseBlock, blockName: firstBlock.name.replace('Block ', ''), floors: firstBlock.floors, unitsPerFloor: Math.ceil(firstBlock.totalUnits / firstBlock.floors) }
              : { blockName: firstBlock.name.replace('Block ', ''), floors: firstBlock.floors, unitsPerFloor: Math.ceil(firstBlock.totalUnits / firstBlock.floors), units: [] },
            updatedAt: timestamp,
          } : p
        ),
      }))

      // Additional blocks (index 1+) = create new
      if (blocks.length > 1) {
        const newBlocks = blocks.slice(1)
        newBlocks.forEach((block) => {
          const newPropertyId = `property-enterprise-${block.name.toLowerCase().replace(/\s/g, '-')}-${Date.now()}`
          const newProperty = {
            id: newPropertyId,
            ownerId,
            title: `${propertyName || 'Enterprise Property'} - ${block.name}`,
            propertyType: propertyType || 'Commercial Complex',
            description: description || `${block.name}. ${block.floors} floors, ${block.totalUnits} units capacity.`,
            address: streetAddress || `${propertyName}, ${block.name}`,
            unit: block.name,
            postalCode: '560001',
            city: city || 'Bangalore',
            neighborhood: neighborhood || 'Central',
            price: 'Rs. 45,000',
            pricePeriod: '/ mo',
            deposit: 'Rs. 90,000',
            beds: 2,
            baths: 2,
            sqft: '1,200',
            availableFrom: '2026-07-15',
            visitWeekday: 'Saturday',
            visitStartTime: '10:00 AM',
            visitEndTime: '1:00 PM',
            preferredVisitSlots: [{ day: 'Saturday', startTime: '10:00 AM', endTime: '1:00 PM' }],
            visitSchedulingEnabled: true,
            leaseDuration: leaseDurationValue,
            noticePeriod: '30',
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
            gallery: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'],
            highlights: [{ label: 'Floors', value: String(block.floors) }, { label: 'Total Units', value: String(block.totalUnits) }],
            overviewSpecs: [{ label: 'Block', value: block.name }, { label: 'Total Units', value: String(block.totalUnits) }, { label: 'Floors', value: String(block.floors) }],
            overview: [`${block.name} — ${block.floors} floors, ${block.totalUnits} units capacity.`],
            amenities: [{ icon: 'security', label: '24/7 Security' }],
            rules: [{ rule: 'Enterprise lease terms', category: 'Lease' }],
            nearby: { essentials: [], utility: [], transit: { busStations: [], airport: [], trainStations: [] } },
            noBrokerServices: false,
            views: 0,
            shortlists: 0,
            contacts: 0,
            enterpriseBlock: { blockName: block.name.replace('Block ', ''), floors: block.floors, unitsPerFloor: Math.ceil(block.totalUnits / block.floors), units: [] },
            createdAt: timestamp,
            updatedAt: timestamp,
          }
          usePrototypeStore.setState((state) => ({ properties: [...state.properties, newProperty] }))
        })
      }

      setSupportStatus(`Property updated. ${blocks.length > 1 ? `${blocks.length - 1} new block(s) created.` : ''}`)
      setTimeout(() => navigate(ROUTES.ENTERPRISE.PORTFOLIO), 800)
      return
    }

    // CREATE MODE
    if (blocks.length === 0) {
      // Create a single property without block structure
      createOwnerProperty(ownerId, {
        propertyName: propertyName || 'Enterprise Property',
        propertyType: propertyType || 'Commercial Complex',
        description,
      })
    } else {
      // Create one property per block — with EMPTY units array
      // Units are added individually via "Add Unit" page
      blocks.forEach((block) => {
        const timestamp = new Date().toISOString()
        const propertyId = `property-enterprise-${block.name.toLowerCase().replace(/\s/g, '-')}-${Date.now()}`
        const property = {
          id: propertyId,
          ownerId,
          title: `${propertyName || 'Enterprise Property'} - ${block.name}`,
          propertyType: propertyType || 'Commercial Complex',
          description: description || `${block.name} of ${propertyName}. ${block.floors} floors, ${block.totalUnits} total units.`,
          address: streetAddress || `${propertyName}, ${block.name}`,
          unit: block.name,
          postalCode: '560001',
          city: city || 'Bangalore',
          neighborhood: neighborhood || 'Central',
          price: 'Rs. 45,000',
          pricePeriod: '/ mo',
          deposit: 'Rs. 90,000',
          beds: 2,
          baths: 2,
          sqft: '1,200',
          availableFrom: '2026-07-15',
          visitWeekday: 'Saturday',
          visitStartTime: '10:00 AM',
          visitEndTime: '1:00 PM',
          preferredVisitSlots: [{ day: 'Saturday', startTime: '10:00 AM', endTime: '1:00 PM' }],
          visitSchedulingEnabled: true,
          leaseDuration: leaseDurationValue,
          noticePeriod: '30',
          image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
          gallery: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'],
          highlights: [
            { label: 'Floors', value: String(block.floors) },
            { label: 'Total Units', value: String(block.totalUnits) },
          ],
          overviewSpecs: [
            { label: 'Block', value: block.name },
            { label: 'Total Units', value: String(block.totalUnits) },
            { label: 'Floors', value: String(block.floors) },
          ],
          overview: [`${block.name} enterprise block — ${block.floors} floors, capacity for ${block.totalUnits} units. Add units individually to list them for tenants.`],
          amenities: [{ icon: 'security', label: '24/7 Security' }],
          rules: [{ rule: 'Enterprise lease terms', category: 'Lease' }],
          nearby: { essentials: [], utility: [], transit: { busStations: [], airport: [], trainStations: [] } },
          noBrokerServices: false,
          views: 0,
          shortlists: 0,
          contacts: 0,
          enterpriseBlock: {
            blockName: block.name.replace('Block ', ''),
            floors: block.floors,
            unitsPerFloor: Math.ceil(block.totalUnits / block.floors),
            units: [], // Empty — units added via Add Unit page
          },
          createdAt: timestamp,
          updatedAt: timestamp,
        }

        // Add property to store — NO listing created for the block itself
        // Individual unit listings are created when units are added
        usePrototypeStore.setState((state) => ({
          properties: [...state.properties, property],
        }))
      })
    }

    setSupportStatus('Property registered. Add units via the Portfolio page to list them for tenants.')
    setTimeout(() => navigate(ROUTES.ENTERPRISE.PORTFOLIO), 1000)
  }

  return (
    <div className="min-h-screen bg-canvas-alt px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Breadcrumb + Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-label text-text-muted">
              Properties › <span className="text-text-primary">Add New Listing</span>
            </p>
            <h1 className="mt-2 text-heading-1 font-bold tracking-tight text-text-primary">
              {isEditMode ? 'Edit Property' : 'Register New Property'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={handleSaveDraft} className="rounded-button border border-outline bg-white px-5 py-2.5 text-body font-medium text-text-primary shadow-sm hover:bg-hover-light transition-colors">
              Save as Draft
            </button>
            <button type="button" onClick={handleSubmit} className="rounded-button bg-navy px-5 py-2.5 text-body font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors">
              {isEditMode ? 'Save Changes' : 'Submit Listing'}
            </button>
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

            <div className="rounded-card bg-primary-100 p-5">
              <h3 className="text-body font-bold text-text-primary">Need Assistance?</h3>
              <p className="mt-2 text-label leading-5 text-text-muted">Our onboarding specialists are available 24x7 to help you optimize your listing.</p>
              <button type="button" onClick={() => setSupportStatus('Support request queued.')} className="mt-4 inline-flex items-center gap-2 text-label font-bold text-navy hover:text-primary">
                Contact Support
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {currentStep === 1 && (
              <div className="rounded-card border border-outline bg-white p-8 shadow-sm space-y-6">
                <div>
                  <h2 className="text-heading-3 font-bold text-text-primary">Basic Information</h2>
                  <p className="mt-1 text-body text-text-muted">Provide the primary details identifying this property.</p>
                </div>

                <div>
                  <label className="text-label font-medium text-text-muted">Property Name / Title</label>
                  <input value={propertyName} onChange={(e) => setPropertyName(e.target.value)} placeholder="e.g., The Grand Palace" className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
                  <p className="mt-1 text-[11px] text-text-muted">A clear, descriptive title to attract potential tenants.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-label font-medium text-text-muted">Property Type</label>
                    <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-3 text-body text-text-primary focus:border-primary focus:outline-none">
                      <option value="">Select Property Type</option>
                      {propertyTypes.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-label font-medium text-text-muted">Year Built</label>
                    <input value={yearBuilt} onChange={(e) => setYearBuilt(e.target.value)} placeholder="YYYY" className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-label font-medium text-text-muted">Internal Reference ID (Optional)</label>
                    <input value={referenceId} onChange={(e) => setReferenceId(e.target.value)} placeholder="e.g., BLDG-A-101" className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-label font-medium text-text-muted">Current Status</label>
                    <select value={currentStatus} onChange={(e) => setCurrentStatus(e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-3 text-body text-text-primary focus:border-primary focus:outline-none">
                      {statusOptions.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-label font-medium text-text-muted">Property Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} placeholder="Describe the property, highlighting key selling points..." className="mt-1.5 w-full resize-none rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary focus:border-primary focus:outline-none" />
                  <p className="mt-1 text-right text-[11px] text-text-muted">{description.length} / 1000 characters</p>
                </div>

                {/* Block Structure */}
                <div className="border-t border-outline pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-body font-bold text-text-primary flex items-center gap-2"><Building2 size={16} /> Block Structure</h3>
                      <p className="mt-1 text-[12px] text-text-muted">Define the blocks, floors, and units for this property.</p>
                    </div>
                    <button type="button" onClick={addBlock} className="inline-flex items-center gap-1.5 rounded-button bg-navy px-4 py-2 text-label font-bold text-white hover:bg-slate-800 transition-colors">
                      <Plus size={14} /> Add Block
                    </button>
                  </div>

                  {blocks.length === 0 && (
                    <div className="rounded-lg border-2 border-dashed border-outline p-8 text-center">
                      <Building2 size={28} className="mx-auto text-text-muted opacity-50" />
                      <p className="mt-3 text-body font-semibold text-text-muted">No blocks added yet</p>
                      <p className="mt-1 text-[12px] text-text-muted">Click "Add Block" to define the building structure.</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {blocks.map((block) => (
                      <div key={block.id} className="rounded-xl border border-outline bg-canvas-alt p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="grid gap-4 flex-1 sm:grid-cols-3">
                            <div>
                              <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Block Name</label>
                              <input value={block.name} onChange={(e) => updateBlock(block.id, { name: e.target.value })} className="mt-1 h-10 w-full rounded-input border border-outline bg-white px-3 text-body font-semibold text-text-primary focus:border-primary focus:outline-none" />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Total Floors</label>
                              <input type="number" min="1" max="100" value={block.floors} onChange={(e) => updateBlock(block.id, { floors: parseInt(e.target.value) || 1 })} className="mt-1 h-10 w-full rounded-input border border-outline bg-white px-3 text-body font-semibold text-text-primary focus:border-primary focus:outline-none" />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Total Units</label>
                              <input type="number" min="1" max="500" value={block.totalUnits} onChange={(e) => updateBlock(block.id, { totalUnits: parseInt(e.target.value) || 1 })} className="mt-1 h-10 w-full rounded-input border border-outline bg-white px-3 text-body font-semibold text-text-primary focus:border-primary focus:outline-none" />
                            </div>
                          </div>
                          <button type="button" onClick={() => removeBlock(block.id)} className="mt-5 p-2 rounded-lg text-text-muted hover:text-red-600 hover:bg-red-50 transition-colors" title="Remove block">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="mt-3 text-[11px] text-text-muted">
                          {block.name}: <span className="font-bold text-text-primary">{block.floors} floors, {block.totalUnits} units capacity</span>
                        </p>
                      </div>
                    ))}
                  </div>

                  {blocks.length > 0 && (
                    <div className="mt-4 rounded-lg bg-primary-50 px-4 py-3">
                      <p className="text-label font-semibold text-primary">
                        Total: {blocks.length} block{blocks.length > 1 ? 's' : ''} · {blocks.reduce((sum, b) => sum + b.floors, 0)} floors · {blocks.reduce((sum, b) => sum + b.totalUnits, 0)} units capacity
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="rounded-card border border-outline bg-white p-8 shadow-sm space-y-6">
                  <div>
                    <h2 className="text-heading-3 font-bold text-text-primary">Location Details</h2>
                    <p className="mt-1 text-body text-text-muted">Precisely mark the location to help potential tenants find their next home.</p>
                  </div>

                  <div>
                    <label className="text-label font-medium text-text-muted">Street Address</label>
                    <input value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} placeholder="e.g., 123 Architecture Blvd" className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
                    <p className="mt-1 text-[11px] text-text-muted">Full legal address as it appears on title deeds.</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-label font-medium text-text-muted">Unit / Suite Number</label>
                      <input placeholder="Apt 4B" className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-label font-medium text-text-muted">Postal Code</label>
                      <input placeholder="10001" className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none" />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-label font-medium text-text-muted">City</label>
                      <select value={city} onChange={(e) => setCity(e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-3 text-body text-text-primary focus:border-primary focus:outline-none">
                        <option>New York City</option>
                        <option>London</option>
                        <option>Bangalore</option>
                        <option>Mumbai</option>
                        <option>Delhi</option>
                        <option>Chennai</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-label font-medium text-text-muted">Neighborhood</label>
                      <input value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} placeholder="Manhattan" className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none" />
                    </div>
                  </div>
                </div>

                {/* Zoning & Accessibility */}
                <div className="rounded-card border border-outline bg-white p-8 shadow-sm space-y-6">
                  <h2 className="text-heading-3 font-bold text-text-primary">Zoning & Accessibility</h2>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex items-start gap-3 rounded-xl border border-outline p-4 cursor-pointer hover:bg-hover-light transition-colors">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-canvas-alt shrink-0">
                        <Building2 size={18} className="text-text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-body font-semibold text-text-primary">Residential Zoning</p>
                        <p className="mt-0.5 text-[11px] text-text-muted">Approved for standard long-term housing.</p>
                      </div>
                      <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 rounded border-outline" />
                    </label>

                    <label className="flex items-start gap-3 rounded-xl border border-outline p-4 cursor-pointer hover:bg-hover-light transition-colors">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-canvas-alt shrink-0">
                        <Building2 size={18} className="text-text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-body font-semibold text-text-primary">Mixed Use</p>
                        <p className="mt-0.5 text-[11px] text-text-muted">Permits commercial ground-floor operations.</p>
                      </div>
                      <input type="checkbox" className="mt-1 h-4 w-4 rounded border-outline" />
                    </label>
                  </div>

                  <div>
                    <p className="text-label font-medium text-text-muted mb-3">Accessibility Features</p>
                    <div className="flex flex-wrap gap-2">
                      {['Wheelchair Access', 'Elevator in Building', 'On-site Parking'].map((feature) => (
                        <span key={feature} className="inline-flex items-center gap-1.5 rounded-full border border-outline bg-white px-3 py-1.5 text-[12px] font-semibold text-text-primary">
                          {feature === 'Wheelchair Access' && '♿'}
                          {feature === 'Elevator in Building' && '🛗'}
                          {feature === 'On-site Parking' && '🅿️'}
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Info Cards */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="flex items-start gap-3 rounded-xl border border-outline bg-white p-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 shrink-0">
                      <span className="text-blue-600 text-[14px]">🛡️</span>
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-text-primary">Verified Listings</p>
                      <p className="mt-0.5 text-[11px] text-text-muted">Verified properties receive 3x more views and inquiries.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-outline bg-white p-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 shrink-0">
                      <span className="text-green-600 text-[14px]">📈</span>
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-text-primary">Pricing Insights</p>
                      <p className="mt-0.5 text-[11px] text-text-muted">We'll suggest optimal rents based on local market data.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-outline bg-white p-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 shrink-0">
                      <span className="text-red-600 text-[14px]">🔒</span>
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-text-primary">Data Privacy</p>
                      <p className="mt-0.5 text-[11px] text-text-muted">Your property documents are encrypted and secure.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                {/* General Amenities */}
                <div className="rounded-card border border-outline bg-white p-8 shadow-sm space-y-6">
                  <h2 className="text-heading-3 font-bold text-text-primary flex items-center gap-2">⚡ General Amenities</h2>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      { label: 'High-speed Wi-Fi', sub: 'Fiber Optic Ready' },
                      { label: 'Air Conditioning', sub: 'Central HVAC', defaultChecked: true },
                      { label: 'Heating', sub: 'Radiant Floor', defaultChecked: true },
                      { label: 'Smart Lock', sub: 'Keyless Entry' },
                      { label: 'Washer/Dryer', sub: 'In-unit Laundry' },
                      { label: 'Dishwasher', sub: 'Modern Stainless' },
                    ].map((amenity) => (
                      <label key={amenity.label} className="flex items-start gap-3 rounded-xl border border-outline p-4 cursor-pointer hover:bg-hover-light transition-colors">
                        <input type="checkbox" defaultChecked={amenity.defaultChecked} className="mt-0.5 h-4 w-4 rounded border-outline" />
                        <div>
                          <p className="text-[13px] font-semibold text-text-primary">{amenity.label}</p>
                          <p className="mt-0.5 text-[11px] text-text-muted">{amenity.sub}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Building Features */}
                <div className="rounded-card border border-outline bg-white p-8 shadow-sm space-y-6">
                  <h2 className="text-heading-3 font-bold text-text-primary flex items-center gap-2">🏢 Building Features</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { label: 'Gym / Fitness Center', icon: '🏋️', defaultOn: false },
                      { label: 'Swimming Pool', icon: '🏊', defaultOn: false },
                      { label: 'Dedicated Parking', icon: '🅿️', defaultOn: true },
                      { label: '24/7 Security', icon: '🛡️', defaultOn: true },
                    ].map((feature) => (
                      <div key={feature.label} className="flex items-center justify-between rounded-xl border border-outline px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-[16px]">{feature.icon}</span>
                          <span className="text-[13px] font-semibold text-text-primary">{feature.label}</span>
                        </div>
                        <label className="relative inline-flex cursor-pointer">
                          <input type="checkbox" defaultChecked={feature.defaultOn} className="sr-only peer" />
                          <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:bg-[#0f172a] transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:translate-x-5" />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Special Features */}
                <div className="rounded-card border border-outline bg-white p-8 shadow-sm space-y-5">
                  <h2 className="text-heading-3 font-bold text-text-primary flex items-center gap-2">⭐ Special Features</h2>
                  <div>
                    <label className="text-label font-medium text-text-muted">Unique Selling Points</label>
                    <textarea rows={4} placeholder="Describe unique features like floor-to-ceiling windows, private balconies, or designer finishes..." className="mt-1.5 w-full resize-none rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary focus:border-primary focus:outline-none" />
                  </div>
                  <button type="button" onClick={() => { const tag = prompt('Enter custom tag:'); if (tag?.trim()) setCustomTags([...customTags, tag.trim()]) }} className="inline-flex items-center gap-1.5 rounded-lg border border-outline px-4 py-2 text-[12px] font-semibold text-text-primary hover:bg-hover-light transition-colors">
                    <Plus size={13} /> Add custom tag
                  </button>
                  {customTags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {customTags.map((tag, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 rounded-pill bg-primary-50 px-3 py-1 text-[11px] font-bold text-primary">
                          {tag}
                          <button type="button" onClick={() => setCustomTags(customTags.filter((_, idx) => idx !== i))} className="text-primary/60 hover:text-primary">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Info Cards */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="flex items-start gap-3 rounded-xl border border-outline bg-white p-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 shrink-0">
                      <span className="text-blue-600 text-[14px]">✓</span>
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-text-primary">Verified Listings</p>
                      <p className="mt-0.5 text-[11px] text-text-muted">Properties undergo a 12-point quality check to ensure trust and reliability for tenants.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-outline bg-white p-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 shrink-0">
                      <span className="text-green-600 text-[14px]">📈</span>
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-text-primary">Pricing Insights</p>
                      <p className="mt-0.5 text-[11px] text-text-muted">Utilize real-time market data to optimize your rental yields and minimize vacancy periods.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-outline bg-white p-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 shrink-0">
                      <span className="text-slate-600 text-[14px]">🔒</span>
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-text-primary">Data Privacy</p>
                      <p className="mt-0.5 text-[11px] text-text-muted">Enterprise-grade encryption secures your property data and tenant information at all times.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                {/* Property Photos Upload */}
                <div className="rounded-card border border-outline bg-white p-8 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-heading-3 font-bold text-text-primary">Property Photos</h2>
                    <span className="text-[11px] font-semibold text-red-600">Minimum 5 photos required</span>
                  </div>
                  <div className="rounded-xl border-2 border-dashed border-outline bg-canvas-alt p-12 text-center cursor-pointer hover:border-primary/50 transition-colors">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white mx-auto shadow-sm">
                      <span className="text-[24px]">📷</span>
                    </div>
                    <p className="mt-4 text-[14px] font-semibold text-text-primary">Drag and drop images here or click to browse</p>
                    <p className="mt-1 text-[12px] text-text-muted">High resolution JPG or PNG files up to 10MB each.</p>
                  </div>
                </div>

                {/* Gallery Management */}
                <div className="rounded-card border border-outline bg-white p-8 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-heading-3 font-bold text-text-primary">Gallery Management</h2>
                    <span className="text-[12px] text-text-muted">4 items uploaded</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div className="relative rounded-xl overflow-hidden aspect-[4/3]">
                      <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80" alt="Property" className="h-full w-full object-cover" />
                      <span className="absolute top-2 left-2 rounded bg-primary px-2 py-0.5 text-[10px] font-bold text-white">Primary Cover</span>
                    </div>
                    <div className="rounded-xl overflow-hidden aspect-[4/3]">
                      <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=300&q=80" alt="Interior" className="h-full w-full object-cover" />
                    </div>
                    <div className="rounded-xl overflow-hidden aspect-[4/3]">
                      <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=300&q=80" alt="Exterior" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline bg-canvas-alt aspect-[4/3] cursor-pointer hover:border-primary/50 transition-colors">
                      <span className="text-[24px]">📸</span>
                      <p className="mt-2 text-[11px] font-semibold text-text-muted">Add More</p>
                    </div>
                  </div>
                </div>

                {/* Virtual Tour / Video */}
                <div className="rounded-card border border-outline bg-white p-8 shadow-sm space-y-4">
                  <h2 className="text-heading-3 font-bold text-text-primary">Virtual Tour / Video</h2>
                  <div>
                    <label className="text-label font-medium text-text-muted">Embed Virtual Tour URL</label>
                    <div className="mt-1.5 flex gap-3">
                      <div className="flex-1 flex items-center gap-2 rounded-input border border-outline bg-white px-4 h-11">
                        <span className="text-text-muted text-[14px]">🌐</span>
                        <input placeholder="https://matterport.com/..." className="flex-1 bg-transparent text-body text-text-primary outline-none placeholder:text-text-muted" />
                      </div>
                      <button type="button" className="inline-flex items-center gap-2 rounded-input border border-outline bg-white px-5 h-11 text-[13px] font-semibold text-text-primary hover:bg-hover-light transition-colors">
                        📹 Upload 360 Video File
                      </button>
                    </div>
                    <p className="mt-1.5 text-[11px] text-text-muted">Paste links from Matterport, 360-degree tours, or YouTube/Vimeo.</p>
                  </div>
                </div>

                {/* Bottom Info Cards */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="flex items-center gap-3 rounded-xl border border-outline bg-white p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 shrink-0">
                      <span className="text-blue-600 text-[16px]">✓</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Verified Listings</p>
                      <p className="text-[14px] font-bold text-text-primary">100% Secure</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-outline bg-white p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 shrink-0">
                      <span className="text-green-600 text-[16px]">📈</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Pricing Insights</p>
                      <p className="text-[14px] font-bold text-text-primary">Live Market Data</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-outline bg-white p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 shrink-0">
                      <span className="text-slate-600 text-[16px]">🔒</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Data Privacy</p>
                      <p className="text-[14px] font-bold text-text-primary">GDPR Compliant</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6">
                {/* Lease Terms only — Pricing is configured per unit in Add Unit */}
                <div className="rounded-card border border-outline bg-white p-8 shadow-sm space-y-6">
                  <h2 className="text-heading-3 font-bold text-text-primary flex items-center gap-2">📋 Lease Terms</h2>
                  <p className="text-[13px] text-text-muted">These terms apply as defaults across all units. Pricing is set individually when adding units.</p>

                  <div>
                    <label className="text-label font-medium text-text-muted">Minimum Lease Duration (Months)</label>
                    <div className="mt-3 flex items-center justify-between text-[12px] text-text-muted">
                      <span>1 Month</span>
                      <span className="text-primary font-bold">{leaseDurationValue} Months</span>
                      <span>24 Months</span>
                    </div>
                    <input type="range" min={1} max={24} value={leaseDurationValue} onChange={(e) => setLeaseDurationValue(parseInt(e.target.value))} className="mt-1 w-full accent-primary" />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-label font-medium text-text-muted">Available From</label>
                      <input type="text" defaultValue="07/15/2026" className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-label font-medium text-text-muted">Notice Period (Days)</label>
                      <div className="mt-1.5 flex items-center gap-2">
                        <input type="text" defaultValue="30" className="h-11 w-20 rounded-input border border-outline bg-white px-3 text-center text-body font-semibold text-text-primary focus:border-primary focus:outline-none" />
                        <span className="text-body text-text-muted">Days</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-label font-medium text-text-muted mb-3">Utilities Included</p>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { label: 'Electricity', defaultChecked: true },
                        { label: 'Water', defaultChecked: true },
                        { label: 'Internet', defaultChecked: false },
                        { label: 'Gas', defaultChecked: false },
                      ].map((util) => (
                        <label key={util.label} className="inline-flex items-center gap-2 rounded-lg border border-outline px-4 py-2.5 cursor-pointer hover:bg-hover-light transition-colors">
                          <input type="checkbox" defaultChecked={util.defaultChecked} className="h-4 w-4 rounded border-outline text-primary" />
                          <span className="text-[13px] font-semibold text-text-primary">{util.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-body font-semibold text-text-primary">Pet Policy</p>
                        <p className="text-[11px] text-text-muted">Allow domestic animals within the premises</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:translate-x-5" />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Info note about pricing */}
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                  <p className="text-[13px] font-semibold text-amber-800">💡 Pricing is set per unit</p>
                  <p className="mt-1 text-[12px] text-amber-700">After registering the property, use "Add Unit" to configure individual unit pricing (rent, deposit). Each unit will be listed separately for tenants.</p>
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
                  Continue to {steps[currentStep]?.label ?? 'Next'} <ArrowRight size={16} />
                </button>
              ) : (
                <button type="button" onClick={handleSubmit} className="inline-flex items-center gap-2 rounded-button bg-primary px-6 py-3 text-body font-semibold text-white hover:bg-primary-700">
                  Submit Listing <Check size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
