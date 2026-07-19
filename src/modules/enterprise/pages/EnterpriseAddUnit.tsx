import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Building2, Car, Check, Dumbbell, Plus, ShieldCheck, Star, Trash2, Waves, Zap } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { ROUTES } from '@shared/constants/routes'
import { usePrototypeStore } from '@shared/store/prototypeStore'
import { useEnterpriseContext } from '../hooks/useEnterpriseContext'

type StepNumber = 1 | 2 | 3 | 4 | 5

const steps = [
  { number: 1 as StepNumber, label: 'Unit Configuration' },
  { number: 2 as StepNumber, label: 'Location & Nearby' },
  { number: 3 as StepNumber, label: 'Amenities & Rules' },
  { number: 4 as StepNumber, label: 'Media & Gallery' },
  { number: 5 as StepNumber, label: 'Pricing & Lease' },
]

export function EnterpriseAddUnit() {
  const navigate = useNavigate()
  const { unitPropertyId } = useParams<{ unitPropertyId?: string }>()
  const { currentBlockId, enterpriseBlocks } = useEnterpriseContext()
  const allProperties = usePrototypeStore((s) => s.properties)
  const updateOwnerProperty = usePrototypeStore((s) => s.updateOwnerProperty)
  const currentBlock = enterpriseBlocks.find((b) => b.id === currentBlockId)
  const blockData = currentBlock?.enterpriseBlock

  // Edit mode: if unitPropertyId is present, load existing data
  const isEditMode = Boolean(unitPropertyId)
  const editProperty = unitPropertyId ? allProperties.find((p) => p.id === unitPropertyId) : null

  const [currentStep, setCurrentStep] = useState<StepNumber>(1)
  // Step 1 - Unit Config & Specs
  const [unitNumber, setUnitNumber] = useState('')
  const [floor, setFloor] = useState('1')
  const [bedrooms, setBedrooms] = useState('2')
  const [hall, setHall] = useState('1')
  const [kitchen, setKitchen] = useState('1')
  const [washrooms, setWashrooms] = useState('2')
  const [sqft, setSqft] = useState('1200')
  const [unitType, setUnitType] = useState('Apartment')
  const [description, setDescription] = useState('')
  const [furnishingStatus, setFurnishingStatus] = useState('')
  const [facing, setFacing] = useState('')
  const [waterSupply, setWaterSupply] = useState('')
  const [balcony, setBalcony] = useState('Yes')
  const [ageOfBuilding, setAgeOfBuilding] = useState('')
  const [preferredTenant, setPreferredTenant] = useState('')
  const [possession, setPossession] = useState('Immediately')
  const [parkingType, setParkingType] = useState('')
  const [nonVegAllowed, setNonVegAllowed] = useState(true)
  // Step 2 - Location & Nearby
  const [nearby, setNearby] = useState<{ essentials: { name: string; distance: string; time: string }[]; utility: { name: string; distance: string; time: string }[]; transit: { busStations: { name: string; distance: string; time: string }[]; airport: { name: string; distance: string; time: string }[]; trainStations: { name: string; distance: string; time: string }[] } }>({ essentials: [], utility: [], transit: { busStations: [], airport: [], trainStations: [] } })
  // Step 3 - Amenities & Rules
  const [amenities, setAmenities] = useState({ wifi: false, ac: true, heating: false, smartLock: false, washerDryer: false, dishwasher: false })
  const [buildingFeatures, setBuildingFeatures] = useState({ gym: false, pool: false, parking: true, security: true })
  const [sellingPoints, setSellingPoints] = useState('')
  const [rules, setRules] = useState<{ rule: string; category: string }[]>([])
  // Step 4 - Media
  const [virtualTourUrl, setVirtualTourUrl] = useState('')
  // Step 5 - Pricing & Lease
  const [monthlyRent, setMonthlyRent] = useState('45000')
  const [securityDeposit, setSecurityDeposit] = useState('90000')
  const [leaseDuration, setLeaseDuration] = useState(12)
  const [availableFrom, setAvailableFrom] = useState('2026-07-15')
  const [noticePeriod, setNoticePeriod] = useState('30')
  const [utilities, setUtilities] = useState({ electricity: true, water: true, internet: false, gas: false })
  const [petPolicy, setPetPolicy] = useState(true)
  const [visitSlots, setVisitSlots] = useState([{ day: 'Saturday', startTime: '10:00 AM', endTime: '1:00 PM' }])
  const [supportStatus, setSupportStatus] = useState('')

  const goNext = () => setCurrentStep((s) => Math.min(5, s + 1) as StepNumber)
  const goPrev = () => setCurrentStep((s) => Math.max(1, s - 1) as StepNumber)

  // Pre-fill form in edit mode
  useEffect(() => {
    if (!editProperty) return
    setUnitNumber(editProperty.unit)
    setUnitType(editProperty.propertyType)
    setDescription(editProperty.description)
    setSqft(editProperty.sqft)
    setBedrooms(String(editProperty.beds))
    setWashrooms(String(editProperty.baths))
    setMonthlyRent(editProperty.price.replace(/[^\d]/g, ''))
    setSecurityDeposit(editProperty.deposit.replace(/[^\d]/g, ''))
    setAvailableFrom(editProperty.availableFrom)
    setNoticePeriod(editProperty.noticePeriod)
    setLeaseDuration(editProperty.leaseDuration)
    if (editProperty.preferredVisitSlots?.length) setVisitSlots(editProperty.preferredVisitSlots)
    const specs = editProperty.overviewSpecs
    setFurnishingStatus(specs.find((s) => s.label === 'Furnishing Status')?.value ?? '')
    setFacing(specs.find((s) => s.label === 'Facing')?.value ?? '')
    setWaterSupply(specs.find((s) => s.label === 'Water Supply')?.value ?? '')
    setNonVegAllowed(specs.find((s) => s.label === 'Non-Veg Allowed')?.value !== 'No')
    setPetPolicy(specs.find((s) => s.label === 'Pet Allowed')?.value !== 'No')
    const hl = editProperty.highlights
    setBalcony(hl.find((h) => h.label === 'Balcony')?.value ?? 'Yes')
    setAgeOfBuilding(hl.find((h) => h.label === 'Age of Building')?.value ?? '')
    setPreferredTenant(hl.find((h) => h.label === 'Preferred Tenant')?.value ?? '')
    setPossession(hl.find((h) => h.label === 'Possession')?.value ?? 'Immediately')
    setParkingType(hl.find((h) => h.label === 'Parking')?.value ?? '')
    const floorSpec = specs.find((s) => s.label === 'Floor')?.value ?? '1/4'
    setFloor(floorSpec.split('/')[0] ?? '1')
    if (editProperty.nearby) setNearby(editProperty.nearby)
    if (editProperty.rules?.length) setRules(editProperty.rules)
    const aLabels = editProperty.amenities.map((a) => a.label.toLowerCase())
    setAmenities({ wifi: aLabels.some((l) => l.includes('wifi')), ac: aLabels.some((l) => l.includes('air')), heating: aLabels.some((l) => l.includes('heat')), smartLock: aLabels.some((l) => l.includes('lock')), washerDryer: aLabels.some((l) => l.includes('wash')), dishwasher: aLabels.some((l) => l.includes('dish')) })
    setBuildingFeatures({ gym: aLabels.some((l) => l.includes('fitness')), pool: aLabels.some((l) => l.includes('pool')), parking: aLabels.some((l) => l.includes('parking')), security: aLabels.some((l) => l.includes('security')) })
    if (editProperty.overview.length > 1) setSellingPoints(editProperty.overview.slice(1).join('\n'))
  }, [editProperty])

  const handleSubmit = () => {
    if (!unitNumber.trim()) return

    // EDIT MODE: update existing property
    if (isEditMode && unitPropertyId) {
      const floorDisplay = `${floor}/${blockData?.floors ?? '?'}`
      updateOwnerProperty(unitPropertyId, {
        title: currentBlock ? `${currentBlock.title} - Unit ${unitNumber.trim()}` : `Unit ${unitNumber.trim()}`,
        description: description || `Unit ${unitNumber.trim()}. ${bedrooms} BHK, ${sqft} sqft.`,
        propertyType: unitType, sqft, beds: parseInt(bedrooms), baths: parseInt(washrooms),
        price: `Rs. ${Number(monthlyRent || 45000).toLocaleString('en-IN')}`,
        deposit: `Rs. ${Number(securityDeposit || 90000).toLocaleString('en-IN')}`,
        unit: unitNumber.trim(), availableFrom, noticePeriod, leaseDuration,
        visitWeekday: visitSlots[0]?.day ?? 'Saturday', visitStartTime: visitSlots[0]?.startTime ?? '10:00 AM', visitEndTime: visitSlots[0]?.endTime ?? '1:00 PM',
        preferredVisitSlots: visitSlots, visitSchedulingEnabled: true,
        highlights: [
          { label: 'No. of Bedroom', value: `${bedrooms} Bedroom` }, { label: 'Property Type', value: unitType },
          { label: 'Preferred Tenant', value: preferredTenant || 'Any' }, { label: 'Possession', value: possession },
          { label: 'Parking', value: parkingType || 'None' }, { label: 'Age of Building', value: ageOfBuilding || '3-5 Years' },
          { label: 'Balcony', value: balcony }, { label: 'Posted On', value: editProperty?.highlights.find((h) => h.label === 'Posted On')?.value ?? '' },
        ],
        overviewSpecs: [
          { label: 'Furnishing Status', value: furnishingStatus || 'Semi-Furnished' }, { label: 'Facing', value: facing || 'East' },
          { label: 'Water Supply', value: waterSupply || 'Corporation' }, { label: 'Floor', value: floorDisplay },
          { label: 'Bathroom', value: washrooms }, { label: 'Pet Allowed', value: petPolicy ? 'Yes' : 'No' },
          { label: 'Non-Veg Allowed', value: nonVegAllowed ? 'Yes' : 'No' }, { label: 'Gated Security', value: buildingFeatures.security ? 'Yes' : 'No' },
        ],
        overview: [description || `Unit ${unitNumber.trim()} — ${bedrooms} BHK, ${sqft} sqft.`, ...(sellingPoints ? [sellingPoints] : []), `${bedrooms} Bedrooms, ${hall} Hall, ${kitchen} Kitchen, ${washrooms} Washrooms.`],
        amenities: [
          ...(amenities.wifi ? [{ icon: 'wifi', label: 'High-Speed WiFi' }] : []),
          ...(amenities.ac ? [{ icon: 'ac_unit', label: 'Air Conditioning' }] : []),
          ...(parkingType && parkingType !== 'None' ? [{ icon: 'local_parking', label: parkingType }] : []),
          ...(buildingFeatures.security ? [{ icon: 'security', label: 'Gated Security' }] : []),
          ...(buildingFeatures.gym ? [{ icon: 'fitness_center', label: 'Fitness Center' }] : []),
          ...(buildingFeatures.pool ? [{ icon: 'pool', label: 'Swimming Pool' }] : []),
        ],
        rules: rules.length > 0 ? rules : undefined,
        nearby: nearby.essentials.length > 0 || nearby.transit.busStations.length > 0 ? nearby : undefined,
      })
      setSupportStatus('Unit updated successfully!')
      setTimeout(() => navigate(ROUTES.ENTERPRISE.PORTFOLIO), 800)
      return
    }

    // CREATE MODE: original logic
    if (!currentBlockId) return
    const ownerId = currentBlock?.ownerId ?? ''
    const timestamp = new Date().toISOString()
    const newUnitPropertyId = `property-unit-${currentBlockId}-${unitNumber.trim()}-${Date.now()}`
    const unitListingId = `listing-unit-${newUnitPropertyId}`
    const blockTitle = currentBlock?.title ?? 'Enterprise Property'
    const unitTitle = `${blockTitle} - Unit ${unitNumber.trim()}`
    const floorDisplay = `${floor}/${blockData?.floors ?? '?'}`
    const newUnit = { unitId: `unit-${currentBlockId}-${floor}-${unitNumber}-${Date.now()}`, floor: parseInt(floor) || 1, unitNumber: unitNumber.trim(), status: 'Vacant' as const, propertyId: newUnitPropertyId }

    const unitProperty = {
      id: newUnitPropertyId, ownerId, title: unitTitle, propertyType: unitType,
      description: description || `Unit ${unitNumber.trim()} in ${blockTitle}. Floor ${floor}. ${bedrooms} BHK, ${sqft} sqft.`,
      address: currentBlock?.address ?? blockTitle, unit: unitNumber.trim(),
      postalCode: currentBlock?.postalCode ?? '560001', city: currentBlock?.city ?? 'Bangalore', neighborhood: currentBlock?.neighborhood ?? 'Central',
      price: `Rs. ${Number(monthlyRent || 45000).toLocaleString('en-IN')}`, pricePeriod: '/ mo',
      deposit: `Rs. ${Number(securityDeposit || 90000).toLocaleString('en-IN')}`,
      beds: parseInt(bedrooms), baths: parseInt(washrooms), sqft,
      availableFrom, visitWeekday: visitSlots[0]?.day ?? 'Saturday',
      visitStartTime: visitSlots[0]?.startTime ?? '10:00 AM', visitEndTime: visitSlots[0]?.endTime ?? '1:00 PM',
      preferredVisitSlots: visitSlots, visitSchedulingEnabled: true, leaseDuration, noticePeriod,
      image: currentBlock?.image ?? 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      gallery: currentBlock?.gallery ?? ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'],
      highlights: [
        { label: 'No. of Bedroom', value: `${bedrooms} Bedroom` },
        { label: 'Property Type', value: unitType },
        { label: 'Preferred Tenant', value: preferredTenant || 'Any' },
        { label: 'Possession', value: possession },
        { label: 'Parking', value: parkingType || 'None' },
        { label: 'Age of Building', value: ageOfBuilding || '3-5 Years' },
        { label: 'Balcony', value: balcony },
        { label: 'Posted On', value: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
      ],
      overviewSpecs: [
        { label: 'Furnishing Status', value: furnishingStatus || 'Semi-Furnished' }, { label: 'Facing', value: facing || 'East' },
        { label: 'Water Supply', value: waterSupply || 'Corporation' }, { label: 'Floor', value: floorDisplay },
        { label: 'Bathroom', value: washrooms }, { label: 'Pet Allowed', value: petPolicy ? 'Yes' : 'No' },
        { label: 'Non-Veg Allowed', value: nonVegAllowed ? 'Yes' : 'No' }, { label: 'Gated Security', value: buildingFeatures.security ? 'Yes' : 'No' },
      ],
      overview: [
        description || `${unitTitle} — ${bedrooms} BHK on floor ${floor} with ${sqft} sqft built-up area.`,
        ...(sellingPoints ? [sellingPoints] : []),
        `Configuration: ${bedrooms} Bedrooms, ${hall} Hall, ${kitchen} Kitchen, ${washrooms} Washrooms.`,
      ],
      amenities: [
        ...(amenities.wifi ? [{ icon: 'wifi', label: 'High-Speed WiFi' }] : []),
        ...(amenities.ac ? [{ icon: 'ac_unit', label: 'Air Conditioning' }] : []),
        ...(amenities.heating ? [{ icon: 'thermostat', label: 'Heating' }] : []),
        ...(amenities.smartLock ? [{ icon: 'lock', label: 'Smart Lock' }] : []),
        ...(amenities.washerDryer ? [{ icon: 'local_laundry_service', label: 'Washer/Dryer' }] : []),
        ...(amenities.dishwasher ? [{ icon: 'kitchen', label: 'Dishwasher' }] : []),
        ...(parkingType && parkingType !== 'None' ? [{ icon: 'local_parking', label: parkingType }] : []),
        ...(buildingFeatures.security ? [{ icon: 'security', label: 'Gated Security' }] : []),
        ...(buildingFeatures.gym ? [{ icon: 'fitness_center', label: 'Fitness Center' }] : []),
        ...(buildingFeatures.pool ? [{ icon: 'pool', label: 'Swimming Pool' }] : []),
      ],
      rules: rules.length > 0 ? rules : [{ rule: 'Enterprise lease terms', category: 'Lease' }],
      nearby: nearby.essentials.length > 0 || nearby.transit.busStations.length > 0 ? nearby : (currentBlock?.nearby ?? { essentials: [], utility: [], transit: { busStations: [], airport: [], trainStations: [] } }),
      noBrokerServices: false, views: 0, shortlists: 0, contacts: 0, createdAt: timestamp, updatedAt: timestamp,
    }
    const unitListing = { id: unitListingId, propertyId: newUnitPropertyId, ownerId, segment: 'enterprise' as const, status: 'Active' as const, postedDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), updated: 'Just now', badge: null, brokerEnabled: true, createdAt: timestamp, updatedAt: timestamp }

    usePrototypeStore.setState((state) => ({
      properties: [unitProperty, ...state.properties.map((p) => p.id === currentBlockId && p.enterpriseBlock ? { ...p, enterpriseBlock: { ...p.enterpriseBlock, units: [...p.enterpriseBlock.units, newUnit] }, updatedAt: timestamp } : p)],
      listings: [unitListing, ...state.listings],
    }))
    setSupportStatus(`Unit ${unitNumber} added. It's now visible to tenants.`)
    setTimeout(() => navigate(ROUTES.ENTERPRISE.PORTFOLIO), 1000)
  }

  // Block required for unit creation (skip check in edit mode)
  if (!isEditMode && (!currentBlock || !blockData)) {
    return (
      <div className="min-h-screen bg-canvas-alt px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-3xl text-center py-20">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <Building2 size={28} />
          </div>
          <h1 className="mt-6 text-heading-1 font-bold text-text-primary">Block Required</h1>
          <p className="mt-4 text-body text-text-muted">
            You need to create a block under your property before you can add units. Go to Edit Property to add a block first.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <button type="button" onClick={() => navigate(ROUTES.ENTERPRISE.PORTFOLIO)} className="rounded-button border border-outline bg-white px-6 py-3 text-body font-semibold text-text-primary shadow-sm hover:bg-hover-light">Back to Portfolio</button>
            <button type="button" onClick={() => navigate(`${ROUTES.ENTERPRISE.PORTFOLIO}/register`)} className="rounded-button bg-navy px-6 py-3 text-body font-semibold text-white shadow-sm hover:bg-slate-800">Add Property with Block</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas-alt px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-label text-text-muted">Portfolio › Block {blockData?.blockName ?? ''} › <span className="text-text-primary">{isEditMode ? 'Edit Unit' : 'Add Unit'}</span></p>
            <h1 className="mt-2 text-heading-1 font-bold tracking-tight text-text-primary">{isEditMode ? 'Edit Unit' : 'Add New Unit'}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => navigate(ROUTES.ENTERPRISE.PORTFOLIO)} className="rounded-button border border-outline bg-white px-5 py-2.5 text-body font-medium text-text-primary shadow-sm hover:bg-hover-light">Cancel</button>
            <button type="button" onClick={handleSubmit} className="rounded-button bg-navy px-5 py-2.5 text-body font-semibold text-white shadow-sm hover:bg-slate-800">{isEditMode ? 'Save Changes' : 'Add Unit'}</button>
          </div>
        </div>
        {supportStatus && <p className="text-label font-semibold text-status-success-text">{supportStatus}</p>}
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <div className="space-y-6">
            <div className="rounded-card border border-outline bg-white p-5 shadow-sm">
              <nav className="space-y-4">
                {steps.map((step) => { const isC = step.number < currentStep; const isA = step.number === currentStep; return (
                  <button type="button" key={step.number} onClick={() => setCurrentStep(step.number)} className="flex w-full items-start gap-3 text-left">
                    <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-badge font-bold', isC ? 'bg-primary text-white' : isA ? 'bg-navy text-white' : 'bg-slate-100 text-text-muted')}>{isC ? <Check size={14} /> : step.number}</div>
                    <span className={cn('pt-0.5 text-body', isA ? 'font-bold text-text-primary' : 'font-medium text-text-muted')}>{step.label}</span>
                  </button>
                ) })}
              </nav>
            </div>
            <div className="rounded-card bg-primary-100 p-5">
              <h3 className="text-body font-bold text-text-primary flex items-center gap-2"><Building2 size={15} /> Current Block</h3>
              <p className="mt-2 text-label text-text-muted">Block {blockData?.blockName ?? '—'} · {blockData?.floors ?? 0} floors · {blockData?.units.length ?? 0} units</p>
            </div>
          </div>
          <div className="space-y-6">

{/* STEP 1 */}
{currentStep === 1 && (<div className="space-y-6">
  <div className="rounded-card border border-outline bg-white p-6 shadow-sm space-y-5">
    <div><h2 className="text-heading-3 font-bold text-text-primary">Unit Configuration</h2><p className="mt-1 text-label text-text-muted">Block {blockData?.blockName ?? ''} unit details.</p></div>
    <div className="grid gap-4 sm:grid-cols-2">
      <div><label className="text-body font-medium text-text-primary">Unit Number</label><input value={unitNumber} onChange={(e) => setUnitNumber(e.target.value)} placeholder="e.g., 101" className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" /><p className="mt-1 text-label text-text-muted">Unique identifier within the block.</p></div>
      <div><label className="text-body font-medium text-text-primary">Floor</label><select value={floor} onChange={(e) => setFloor(e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none">{Array.from({ length: blockData?.floors ?? 10 }, (_, i) => i + 1).map((f) => <option key={f} value={f}>Floor {f}</option>)}</select></div>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      <div><label className="text-body font-medium text-text-primary">Unit Type</label><select value={unitType} onChange={(e) => setUnitType(e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none"><option>Apartment</option><option>Studio</option><option>Penthouse</option><option>Villa</option><option>Commercial Office</option></select></div>
      <div><label className="text-body font-medium text-text-primary">Built-up Area (sqft)</label><input value={sqft} onChange={(e) => setSqft(e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none" /></div>
    </div>
    <div className="border-t border-outline pt-5"><h3 className="text-body font-bold text-text-primary mb-4">Room Configuration</h3>
      <div className="grid gap-4 sm:grid-cols-4">
        <div><label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Bedrooms</label><select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-3 text-body text-text-primary focus:border-primary focus:outline-none">{[1,2,3,4,5].map(n=><option key={n} value={n}>{n}</option>)}</select></div>
        <div><label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Hall</label><select value={hall} onChange={(e) => setHall(e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-3 text-body text-text-primary focus:border-primary focus:outline-none">{[0,1,2].map(n=><option key={n} value={n}>{n}</option>)}</select></div>
        <div><label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Kitchen</label><select value={kitchen} onChange={(e) => setKitchen(e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-3 text-body text-text-primary focus:border-primary focus:outline-none">{[0,1,2].map(n=><option key={n} value={n}>{n}</option>)}</select></div>
        <div><label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Washrooms</label><select value={washrooms} onChange={(e) => setWashrooms(e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-3 text-body text-text-primary focus:border-primary focus:outline-none">{[1,2,3,4].map(n=><option key={n} value={n}>{n}</option>)}</select></div>
      </div>
    </div>
    <div><label className="text-body font-medium text-text-primary">Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value.slice(0,1000))} rows={3} placeholder="Describe this unit..." className="mt-1.5 w-full rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary focus:border-primary focus:outline-none resize-none" /></div>
  </div>
  {/* Property Specifications */}
  <div className="rounded-card border border-outline bg-white p-6 shadow-sm space-y-5">
    <h2 className="text-heading-3 font-bold text-text-primary">Property Specifications</h2>
    <div className="grid gap-4 sm:grid-cols-3">
      <div><label className="text-body font-medium text-text-primary">Furnishing Status</label><select value={furnishingStatus} onChange={(e) => setFurnishingStatus(e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none"><option value="">Select</option><option>Furnished</option><option>Semi-Furnished</option><option>Unfurnished</option></select></div>
      <div><label className="text-body font-medium text-text-primary">Facing</label><select value={facing} onChange={(e) => setFacing(e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none"><option value="">Select</option><option>East</option><option>West</option><option>North</option><option>South</option><option>North-East</option><option>South-West</option></select></div>
      <div><label className="text-body font-medium text-text-primary">Water Supply</label><select value={waterSupply} onChange={(e) => setWaterSupply(e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none"><option value="">Select</option><option>Corporation</option><option>Borewell</option><option>Both</option><option>Tanker</option></select></div>
    </div>
    <div className="grid gap-4 sm:grid-cols-3">
      <div><label className="text-body font-medium text-text-primary">Balcony</label><select value={balcony} onChange={(e) => setBalcony(e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none"><option>Yes</option><option>No</option></select></div>
      <div><label className="text-body font-medium text-text-primary">Age of Building</label><select value={ageOfBuilding} onChange={(e) => setAgeOfBuilding(e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none"><option value="">Select</option><option>Less than 1 Year</option><option>1-3 Years</option><option>3-5 Years</option><option>5-10 Years</option><option>10+ Years</option></select></div>
      <div><label className="text-body font-medium text-text-primary">Preferred Tenant</label><select value={preferredTenant} onChange={(e) => setPreferredTenant(e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none"><option value="">No Preference</option><option>Family</option><option>Bachelors / Singles</option><option>Working Professionals</option><option>Students</option><option>Any</option></select></div>
    </div>
    <div className="grid gap-4 sm:grid-cols-3">
      <div><label className="text-body font-medium text-text-primary">Possession</label><select value={possession} onChange={(e) => setPossession(e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none"><option>Immediately</option><option>Within 15 Days</option><option>Within 30 Days</option><option>After 30 Days</option></select></div>
      <div><label className="text-body font-medium text-text-primary">Parking</label><select value={parkingType} onChange={(e) => setParkingType(e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none"><option value="">Select</option><option>Bike</option><option>Car</option><option>Bike and Car</option><option>None</option></select></div>
      <div className="flex items-center justify-between rounded-button border border-outline bg-canvas-alt p-4">
        <div><p className="text-body font-medium text-text-primary">Non-Veg Allowed</p></div>
        <button type="button" onClick={() => setNonVegAllowed(!nonVegAllowed)} className={cn('relative h-6 w-11 shrink-0 rounded-pill transition-colors', nonVegAllowed ? 'bg-navy' : 'bg-slate-200')}><span className={cn('absolute left-0 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform', nonVegAllowed ? 'translate-x-5' : 'translate-x-0.5')} /></button>
      </div>
    </div>
  </div>
</div>)}

{/* STEP 2 */}
{currentStep === 2 && (<div className="space-y-6">
  <div className="rounded-card border border-outline bg-white p-6 shadow-sm space-y-5">
    <div><h2 className="text-heading-3 font-bold text-text-primary">Location Details</h2><p className="mt-1 text-label text-text-muted">Inherited from block. Override if needed.</p></div>
    <div className="grid gap-4 sm:grid-cols-2">
      <div><label className="text-body font-medium text-text-primary">City</label><input defaultValue={currentBlock?.city ?? ''} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none" /></div>
      <div><label className="text-body font-medium text-text-primary">Neighborhood</label><input defaultValue={currentBlock?.neighborhood ?? ''} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none" /></div>
    </div>
    <div><label className="text-body font-medium text-text-primary">Full Address</label><input defaultValue={currentBlock?.address ?? ''} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none" /></div>
  </div>
  {/* Nearby */}
  <div className="rounded-card border border-outline bg-white p-6 shadow-sm space-y-5">
    <h2 className="text-heading-3 font-bold text-text-primary">What's Nearby</h2>
    <NearbySection title="Transit - Bus Stations" items={nearby.transit.busStations} onAdd={() => setNearby({ ...nearby, transit: { ...nearby.transit, busStations: [...nearby.transit.busStations, { name: '', distance: '', time: '' }] } })} onRemove={(i) => setNearby({ ...nearby, transit: { ...nearby.transit, busStations: nearby.transit.busStations.filter((_, idx) => idx !== i) } })} onChange={(i, f, v) => setNearby({ ...nearby, transit: { ...nearby.transit, busStations: nearby.transit.busStations.map((item, idx) => idx === i ? { ...item, [f]: v } : item) } })} />
    <NearbySection title="Transit - Train/Metro" items={nearby.transit.trainStations} onAdd={() => setNearby({ ...nearby, transit: { ...nearby.transit, trainStations: [...nearby.transit.trainStations, { name: '', distance: '', time: '' }] } })} onRemove={(i) => setNearby({ ...nearby, transit: { ...nearby.transit, trainStations: nearby.transit.trainStations.filter((_, idx) => idx !== i) } })} onChange={(i, f, v) => setNearby({ ...nearby, transit: { ...nearby.transit, trainStations: nearby.transit.trainStations.map((item, idx) => idx === i ? { ...item, [f]: v } : item) } })} />
    <NearbySection title="Essentials" items={nearby.essentials} onAdd={() => setNearby({ ...nearby, essentials: [...nearby.essentials, { name: '', distance: '', time: '' }] })} onRemove={(i) => setNearby({ ...nearby, essentials: nearby.essentials.filter((_, idx) => idx !== i) })} onChange={(i, f, v) => setNearby({ ...nearby, essentials: nearby.essentials.map((item, idx) => idx === i ? { ...item, [f]: v } : item) })} />
    <NearbySection title="Utility" items={nearby.utility} onAdd={() => setNearby({ ...nearby, utility: [...nearby.utility, { name: '', distance: '', time: '' }] })} onRemove={(i) => setNearby({ ...nearby, utility: nearby.utility.filter((_, idx) => idx !== i) })} onChange={(i, f, v) => setNearby({ ...nearby, utility: nearby.utility.map((item, idx) => idx === i ? { ...item, [f]: v } : item) })} />
  </div>
</div>)}

{/* STEP 3 */}
{currentStep === 3 && (<div className="space-y-6">
  <div className="rounded-card border border-outline bg-white p-6 shadow-sm">
    <h2 className="flex items-center gap-2 text-heading-3 font-bold text-text-primary"><Zap size={20} />General Amenities</h2>
    <div className="mt-5 grid gap-3 sm:grid-cols-3">
      {([['wifi','High-speed Wi-Fi','Fiber Optic Ready'],['ac','Air Conditioning','Central HVAC'],['heating','Heating','Radiant Floor'],['smartLock','Smart Lock','Keyless Entry'],['washerDryer','Washer/Dryer','In-unit Laundry'],['dishwasher','Dishwasher','Modern Stainless']] as const).map(([key,label,desc]) => (
        <label key={key} className={cn('flex items-start gap-3 rounded-button border p-4 cursor-pointer transition-colors', amenities[key] ? 'border-navy bg-slate-50' : 'border-outline')}>
          <input type="checkbox" checked={amenities[key]} onChange={() => setAmenities({ ...amenities, [key]: !amenities[key] })} className="mt-0.5 h-4 w-4 rounded border-outline text-navy" />
          <div><p className="text-body font-semibold text-text-primary">{label}</p><p className="text-label text-text-muted">{desc}</p></div>
        </label>
      ))}
    </div>
  </div>
  <div className="rounded-card border border-outline bg-white p-6 shadow-sm">
    <h2 className="flex items-center gap-2 text-heading-3 font-bold text-text-primary"><Building2 size={20} />Building Features</h2>
    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      {([['gym','Gym / Fitness Center',Dumbbell],['pool','Swimming Pool',Waves],['parking','Dedicated Parking',Car],['security','24/7 Security',ShieldCheck]] as const).map(([key,label,Icon]) => (
        <div key={key} className="flex items-center justify-between rounded-button border border-outline p-4">
          <div className="flex items-center gap-3"><Icon size={18} className="text-text-muted" /><span className="text-body font-medium text-text-primary">{label}</span></div>
          <button type="button" onClick={() => setBuildingFeatures({ ...buildingFeatures, [key]: !buildingFeatures[key] })} className={cn('relative h-6 w-11 rounded-pill transition-colors', buildingFeatures[key] ? 'bg-navy' : 'bg-slate-200')}><span className={cn('absolute left-0 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform', buildingFeatures[key] ? 'translate-x-5' : 'translate-x-0.5')} /></button>
        </div>
      ))}
    </div>
  </div>
  <div className="rounded-card border border-outline bg-white p-6 shadow-sm">
    <h2 className="flex items-center gap-2 text-heading-3 font-bold text-text-primary"><Star size={20} />Special Features</h2>
    <textarea value={sellingPoints} onChange={(e) => setSellingPoints(e.target.value)} rows={3} placeholder="Unique selling points..." className="mt-4 w-full rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary focus:border-primary focus:outline-none resize-none" />
  </div>
  <div className="rounded-card border border-outline bg-white p-6 shadow-sm space-y-4">
    <div className="flex items-center justify-between"><h2 className="text-heading-3 font-bold text-text-primary">Property Rules</h2><button type="button" onClick={() => setRules([...rules, { rule: '', category: 'General' }])} className="text-label font-bold text-primary hover:underline"><Plus size={14} className="inline" /> Add Rule</button></div>
    {rules.map((r, i) => (<div key={i} className="grid gap-3 sm:grid-cols-[1fr_160px_auto] items-end">
      <div><input type="text" value={r.rule} onChange={(e) => { const u = [...rules]; u[i] = { ...u[i], rule: e.target.value }; setRules(u) }} placeholder="Rule..." className="h-10 w-full rounded-input border border-outline bg-white px-3 text-label text-text-primary focus:border-primary focus:outline-none" /></div>
      <div><select value={r.category} onChange={(e) => { const u = [...rules]; u[i] = { ...u[i], category: e.target.value }; setRules(u) }} className="h-10 w-full rounded-input border border-outline bg-white px-3 text-label text-text-primary focus:border-primary focus:outline-none"><option>Health & Safety</option><option>Payments</option><option>Security</option><option>Lease</option><option>General</option></select></div>
      <button type="button" onClick={() => setRules(rules.filter((_, idx) => idx !== i))} className="h-10 px-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
    </div>))}
    {rules.length === 0 && <p className="text-label text-text-muted italic">No rules added.</p>}
  </div>
</div>)}

{/* STEP 4 */}
{currentStep === 4 && (<div className="space-y-6">
  <div className="rounded-card border border-outline bg-white p-6 shadow-sm">
    <h2 className="text-heading-3 font-bold text-text-primary">Property Photos</h2>
    <div className="mt-5 flex flex-col items-center justify-center rounded-card border-2 border-dashed border-outline bg-canvas-alt py-12 text-center">
      <p className="text-body font-semibold text-text-primary">Drag and drop images here or click to browse</p>
      <p className="mt-1 text-label text-text-muted">High resolution JPG or PNG up to 10MB each.</p>
    </div>
  </div>
  <div className="rounded-card border border-outline bg-white p-6 shadow-sm">
    <h2 className="text-heading-3 font-bold text-text-primary">Virtual Tour / Video</h2>
    <div className="mt-3"><label className="text-label font-medium text-text-muted">Embed Virtual Tour URL</label><input value={virtualTourUrl} onChange={(e) => setVirtualTourUrl(e.target.value)} placeholder="https://matterport.com/..." className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none" /></div>
  </div>
</div>)}

{/* STEP 5 */}
{currentStep === 5 && (<div className="space-y-6">
  <div className="rounded-card border border-outline bg-white p-6 shadow-sm space-y-5">
    <h2 className="text-heading-3 font-bold text-text-primary">Pricing & Lease</h2>
    <div className="grid gap-4 sm:grid-cols-[1fr_1fr_160px] items-end">
      <div><label className="text-label font-medium text-text-muted">Monthly Rent (Rs.)</label><input value={monthlyRent} onChange={(e) => setMonthlyRent(e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none" /></div>
      <div><label className="text-label font-medium text-text-muted">Security Deposit (Rs.)</label><input value={securityDeposit} onChange={(e) => setSecurityDeposit(e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none" /></div>
      <div><label className="text-label font-medium text-text-muted">Lease (Months)</label><input type="number" min={1} max={36} value={leaseDuration} onChange={(e) => setLeaseDuration(parseInt(e.target.value) || 12)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none" /></div>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      <div><label className="text-label font-medium text-text-muted">Available From</label><input value={availableFrom} onChange={(e) => setAvailableFrom(e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none" /></div>
      <div><label className="text-label font-medium text-text-muted">Notice Period (Days)</label><input value={noticePeriod} onChange={(e) => setNoticePeriod(e.target.value)} className="mt-1.5 h-11 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none" /></div>
    </div>
    <div><label className="text-body font-medium text-text-primary">Utilities Included</label>
      <div className="mt-3 flex flex-wrap gap-3">
        {(['electricity','water','internet','gas'] as const).map(u => (<label key={u} className={cn('inline-flex items-center gap-2 rounded-button border px-4 py-2.5 cursor-pointer text-body font-medium transition-colors', utilities[u] ? 'border-navy bg-primary-100 text-text-primary' : 'border-outline text-text-muted')}><input type="checkbox" checked={utilities[u]} onChange={() => setUtilities({ ...utilities, [u]: !utilities[u] })} className="h-4 w-4 rounded border-outline text-navy" />{u.charAt(0).toUpperCase() + u.slice(1)}</label>))}
      </div>
    </div>
    <div className="flex items-center justify-between rounded-button border border-outline bg-canvas-alt p-4">
      <div><p className="text-body font-medium text-text-primary">Pet Policy</p><p className="text-label text-text-muted">Allow domestic animals</p></div>
      <button type="button" onClick={() => setPetPolicy(!petPolicy)} className={cn('relative h-6 w-11 rounded-pill transition-colors', petPolicy ? 'bg-navy' : 'bg-slate-200')}><span className={cn('absolute left-0 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform', petPolicy ? 'translate-x-5' : 'translate-x-0.5')} /></button>
    </div>
  </div>
  {/* Visit Slots */}
  <div className="rounded-card border border-outline bg-white p-6 shadow-sm space-y-4">
    <div className="flex items-center justify-between"><h2 className="text-body font-bold text-text-primary">Preferred Visit Timings</h2><button type="button" onClick={() => setVisitSlots([...visitSlots, { day: 'Saturday', startTime: '10:00 AM', endTime: '1:00 PM' }])} className="text-label font-bold text-primary hover:underline">+ Add Slot</button></div>
    {visitSlots.map((slot, i) => (<div key={i} className="grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto] items-end">
      <div><label className="text-[10px] font-bold uppercase text-text-muted">Day</label><select value={slot.day} onChange={(e) => { const u = [...visitSlots]; u[i] = { ...u[i], day: e.target.value }; setVisitSlots(u) }} className="mt-1 h-10 w-full rounded-input border border-outline bg-white px-3 text-label text-text-primary">{['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d=><option key={d}>{d}</option>)}</select></div>
      <div><label className="text-[10px] font-bold uppercase text-text-muted">Start</label><input value={slot.startTime} onChange={(e) => { const u = [...visitSlots]; u[i] = { ...u[i], startTime: e.target.value }; setVisitSlots(u) }} className="mt-1 h-10 w-full rounded-input border border-outline bg-white px-3 text-label text-text-primary" /></div>
      <div><label className="text-[10px] font-bold uppercase text-text-muted">End</label><input value={slot.endTime} onChange={(e) => { const u = [...visitSlots]; u[i] = { ...u[i], endTime: e.target.value }; setVisitSlots(u) }} className="mt-1 h-10 w-full rounded-input border border-outline bg-white px-3 text-label text-text-primary" /></div>
      {visitSlots.length > 1 && <button type="button" onClick={() => setVisitSlots(visitSlots.filter((_, idx) => idx !== i))} className="h-10 px-2 text-red-500 hover:bg-red-50 rounded text-label font-bold">Remove</button>}
    </div>))}
  </div>
</div>)}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              {currentStep > 1 ? (<button type="button" onClick={goPrev} className="inline-flex items-center gap-2 text-body font-medium text-text-muted hover:text-text-primary"><ArrowLeft size={16} /> Previous Step</button>) : <span />}
              {currentStep < 5 ? (
                <button type="button" onClick={goNext} className="inline-flex items-center gap-2 rounded-button bg-navy px-6 py-3 text-body font-semibold text-white shadow-sm hover:bg-slate-800">Continue <ArrowRight size={16} /></button>
              ) : (
                <button type="button" onClick={handleSubmit} disabled={!unitNumber.trim()} className="inline-flex items-center gap-2 rounded-button bg-primary px-6 py-3 text-body font-semibold text-white hover:bg-primary-700 disabled:opacity-50">{isEditMode ? 'Save Changes' : 'Add Unit'} <Check size={16} /></button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* Nearby Section Helper */
function NearbySection({ title, items, onAdd, onRemove, onChange }: { title: string; items: { name: string; distance: string; time: string }[]; onAdd: () => void; onRemove: (i: number) => void; onChange: (i: number, f: 'name' | 'distance' | 'time', v: string) => void }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between"><p className="text-body font-medium text-text-primary">{title}</p><button type="button" onClick={onAdd} className="text-label font-bold text-primary hover:underline"><Plus size={14} className="inline" /> Add</button></div>
      {items.map((item, i) => (<div key={i} className="grid gap-3 sm:grid-cols-[1fr_100px_100px_auto] items-end">
        <input type="text" placeholder="Name" value={item.name} onChange={(e) => onChange(i, 'name', e.target.value)} className="h-10 w-full rounded-input border border-outline bg-white px-3 text-label text-text-primary focus:border-primary focus:outline-none" />
        <input type="text" placeholder="0.5 km" value={item.distance} onChange={(e) => onChange(i, 'distance', e.target.value)} className="h-10 w-full rounded-input border border-outline bg-white px-3 text-label text-text-primary focus:border-primary focus:outline-none" />
        <input type="text" placeholder="5 mins" value={item.time} onChange={(e) => onChange(i, 'time', e.target.value)} className="h-10 w-full rounded-input border border-outline bg-white px-3 text-label text-text-primary focus:border-primary focus:outline-none" />
        <button type="button" onClick={() => onRemove(i)} className="h-10 px-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
      </div>))}
      {items.length === 0 && <p className="text-label text-text-muted italic">None added.</p>}
    </div>
  )
}
