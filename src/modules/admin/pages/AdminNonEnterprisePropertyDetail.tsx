import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  Accessibility,
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  Car,
  CheckCircle2,
  Home,
  Image,
  IndianRupee,
  Lock,
  MapPin,
  Navigation,
  Pencil,
  Save,
  Share2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Upload,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { ROUTES } from '@shared/constants/routes'
import { useAdminStore, type AdminListing, type ListingStatus } from '../store/adminStore'
import { toast } from '../components/Toast'

import { usePrototypeStore } from '@shared/store/prototypeStore'
import { useOnboardingStore } from '@shared/store/onboardingStore'

type StepNumber = 1 | 2 | 3 | 4 | 5

type Step = {
  number: StepNumber
  label: string
  description: string
  icon: LucideIcon
}

interface ListingForm {
  propertyTitle: string
  propertyType: string
  owner: string
  rent: string
  status: ListingStatus
  streetAddress: string
  unit: string
  postalCode: string
  city: string
  neighborhood: string
  residentialZoning: boolean
  mixedUse: boolean
  description: string
  bedrooms: string
  bathrooms: string
  furnishing: string
  parking: string
  tenantPreference: string
  builtUpArea: string
  amenities: string[]
  image: string
  mediaUrls: string[]
  deposit: string
  leaseTerm: string
  availableFrom: string
  maintenanceCharges: string
}

const steps: Step[] = [
  { number: 1, label: 'Basic Information', description: 'Property identity and owner details', icon: Home },
  { number: 2, label: 'Property Location', description: 'Address, map pin, and zoning', icon: MapPin },
  { number: 3, label: 'Amenities & Features', description: 'Configuration and tenant fit', icon: Sparkles },
  { number: 4, label: 'Media & Gallery', description: 'Photos and listing previews', icon: Image },
  { number: 5, label: 'Pricing & Lease', description: 'Rent, deposit, and availability', icon: IndianRupee },
]

const listingStatusOptions: ListingStatus[] = ['Active', 'Paused', 'Flagged', 'Removed']
const propertyTypeOptions = ['Apartment', 'Villa', 'Independent House', 'Studio', 'Penthouse', 'Builder Floor']
const furnishingOptions = ['Unfurnished', 'Semi-Furnished', 'Fully Furnished']
const tenantPreferenceOptions = ['Family', 'Bachelors', 'Couples', 'Family / Couple', 'Any Verified Tenant']
const parkingOptions = ['None', 'Two Wheeler', 'Four Wheeler', 'Both 2W & 4W']
const leaseTermOptions = ['6 months', '11 months', '12 months', '24 months', 'Flexible']
const amenityOptions = [
  'Power Backup',
  'Lift',
  'Security',
  'Gym',
  'Swimming Pool',
  'Club House',
  'Pet Friendly',
  'Balcony',
  'Modular Kitchen',
  'Gated Community',
  'Water Supply',
  'Visitor Parking',
]

const fallbackMedia = [
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=80',
]

function normalizeStep(value: string | null): StepNumber {
  const parsed = Number(value)
  return steps.some((step) => step.number === parsed) ? (parsed as StepNumber) : 1
}

function createForm(listing: AdminListing): ListingForm {
  const locationParts = listing.location.split(',').map((part) => part.trim())
  const image = listing.image || fallbackMedia[0]
  const mediaUrls = listing.mediaUrls?.length
    ? listing.mediaUrls
    : [image, ...fallbackMedia.filter((url) => url !== image)].slice(0, 4)

  return {
    propertyTitle: listing.propertyTitle ?? `${listing.owner} Listing`,
    propertyType: listing.propertyType ?? 'Apartment',
    owner: listing.owner,
    rent: listing.rent,
    status: listing.status,
    streetAddress: listing.streetAddress ?? '123 Architecture Blvd',
    unit: listing.unit ?? 'Apt 4B',
    postalCode: listing.postalCode ?? '10001',
    city: listing.city ?? locationParts[1] ?? 'Bangalore',
    neighborhood: listing.neighborhood ?? locationParts[0] ?? listing.location,
    residentialZoning: listing.residentialZoning ?? true,
    mixedUse: listing.mixedUse ?? false,
    description:
      listing.description ??
      'A well-maintained rental home with strong tenant demand, clear documentation, and ready-to-review listing details.',
    bedrooms: listing.bedrooms ?? '2 BHK',
    bathrooms: listing.bathrooms ?? '2',
    furnishing: listing.furnishing ?? 'Semi-Furnished',
    parking: listing.parking ?? 'Both 2W & 4W',
    tenantPreference: listing.tenantPreference ?? 'Family / Couple',
    builtUpArea: listing.builtUpArea ?? '1,250 sq ft',
    amenities: listing.amenities ?? ['Power Backup', 'Lift', 'Security', 'Balcony'],
    image,
    mediaUrls,
    deposit: listing.deposit ?? '₹1,70,000',
    leaseTerm: listing.leaseTerm ?? '11 months',
    availableFrom: listing.availableFrom ?? '2026-06-15',
    maintenanceCharges: listing.maintenanceCharges ?? '₹5,000',
  }
}

export function AdminNonEnterprisePropertyDetail() {
  const navigate = useNavigate()
  const { propertyId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const listings = useAdminStore((s) => s.listings)
  const updateListing = useAdminStore((s) => s.updateListing)

  const activeStep = normalizeStep(searchParams.get('step'))
  const routeEditMode = searchParams.get('mode') === 'edit'

  const listing = useMemo(
    () =>
      listings.find(
        (item) => item.segment === 'non-enterprise' && item.slug === propertyId
      ),
    [listings, propertyId]
  )

  const [editing, setEditing] = useState(routeEditMode)
  const [form, setForm] = useState<ListingForm | null>(() => (listing ? createForm(listing) : null))

  useEffect(() => {
    if (!listing) {
      setForm(null)
      return
    }

    setForm(createForm(listing))
  }, [listing])

  useEffect(() => {
    setEditing(routeEditMode)
  }, [routeEditMode])

  if (!listing || !form) {
    return (
      <div className="min-h-screen bg-canvas-alt px-2 py-6 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-card border border-outline bg-white p-8 text-center shadow-surface">
          <h1 className="text-heading-2 font-bold text-text-primary">Listing not found</h1>
          <p className="mt-2 text-body text-text-muted">
            This non-enterprise listing may have been removed or archived.
          </p>
          <button
            type="button"
            onClick={() => navigate(ROUTES.ADMIN.LISTING_MANAGEMENT)}
            className="mt-6 rounded-button bg-navy px-5 py-2.5 text-body font-semibold text-white hover:bg-slate-800"
          >
            Back to listings
          </button>
        </div>
      </div>
    )
  }

  const setField = <K extends keyof ListingForm>(key: K, value: ListingForm[K]) => {
    setForm((current) => (current ? { ...current, [key]: value } : current))
  }

  const setRouteState = (step: StepNumber, nextEditing = editing) => {
    setSearchParams(nextEditing ? { step: String(step), mode: 'edit' } : { step: String(step) })
  }

  const handleEdit = () => {
    setEditing(true)
    setRouteState(activeStep, true)
  }

  const handleCancel = () => {
    setForm(createForm(listing))
    setEditing(false)
    setRouteState(activeStep, false)
  }

  const handleSave = () => {
    const nextLocation = [form.neighborhood, form.city].filter(Boolean).join(', ')

    updateListing(listing.id, {
      propertyTitle: form.propertyTitle,
      propertyType: form.propertyType,
      owner: form.owner,
      rent: form.rent,
      status: form.status,
      location: nextLocation || listing.location,
      streetAddress: form.streetAddress,
      unit: form.unit,
      postalCode: form.postalCode,
      city: form.city,
      neighborhood: form.neighborhood,
      residentialZoning: form.residentialZoning,
      mixedUse: form.mixedUse,
      description: form.description,
      bedrooms: form.bedrooms,
      bathrooms: form.bathrooms,
      furnishing: form.furnishing,
      parking: form.parking,
      tenantPreference: form.tenantPreference,
      builtUpArea: form.builtUpArea,
      amenities: form.amenities,
      image: form.image,
      mediaUrls: form.mediaUrls,
      deposit: form.deposit,
      leaseTerm: form.leaseTerm,
      availableFrom: form.availableFrom,
      maintenanceCharges: form.maintenanceCharges,
    })
    setEditing(false)
    setRouteState(activeStep, false)
    toast.success('Listing updated', `${listing.id} changes saved across all pages.`)
  }

  const handleStepChange = (step: StepNumber) => {
    setRouteState(step)
  }

  const handlePreviousStep = () => {
    if (activeStep === 1) {
      navigate(ROUTES.ADMIN.LISTING_MANAGEMENT)
      return
    }
    setRouteState((activeStep - 1) as StepNumber)
  }

  const handleNextStep = () => {
    if (activeStep === 5) {
      if (editing) {
        handleSave()
      }
      return
    }
    setRouteState((activeStep + 1) as StepNumber)
  }

  const updateAmenity = (amenity: string, checked: boolean) => {
    const nextAmenities = checked
      ? [...form.amenities, amenity]
      : form.amenities.filter((item) => item !== amenity)
    setField('amenities', Array.from(new Set(nextAmenities)))
  }

  const updateMedia = (index: number, value: string) => {
    const nextMedia = [...form.mediaUrls]
    nextMedia[index] = value
    setField('mediaUrls', nextMedia)
    if (index === 0) {
      setField('image', value)
    }
  }

  const currentStep = steps.find((step) => step.number === activeStep) ?? steps[0]

  return (
    <div className="min-h-screen bg-canvas-alt px-2 py-6 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-heading-2 font-bold tracking-tight text-text-primary">
              {editing ? 'Edit Non-Enterprise Listing' : 'Non-Enterprise Listing Overview'}
            </h1>
            <p className="mt-1 text-label text-text-muted">
              <button
                type="button"
                onClick={() => navigate(ROUTES.ADMIN.LISTING_MANAGEMENT)}
                className="transition-colors hover:text-primary"
              >
                Listing Management
              </button>
              {' > '}
              <span className="text-text-primary">{listing.id}</span>
              {' > '}
              <span>{currentStep.label}</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {editing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center gap-2 rounded-button border border-outline bg-white px-4 py-2.5 text-body font-medium text-text-primary shadow-sm transition-colors hover:bg-hover-light"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 rounded-button bg-navy px-4 py-2.5 text-body font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
                >
                  <Save size={14} />
                  Save Changes
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleEdit}
                className="inline-flex items-center gap-2 rounded-button border border-outline bg-white px-4 py-2.5 text-body font-medium text-text-primary shadow-sm transition-colors hover:bg-hover-light"
              >
                <Pencil size={14} />
                Edit Details
              </button>
            )}
            <button
              type="button"
              onClick={() => toast.info('Report shared', `${listing.id} report link copied.`)}
              className="inline-flex items-center gap-2 rounded-button bg-navy px-4 py-2.5 text-body font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
            >
              <Share2 size={14} />
              Share Report
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="space-y-6">
            <div className="rounded-card border border-outline bg-white p-4 shadow-sm">
              <nav className="space-y-2">
                {steps.map((step) => {
                  const Icon = step.icon
                  const isActive = step.number === activeStep
                  const isCompleted = step.number < activeStep

                  return (
                    <button
                      key={step.number}
                      type="button"
                      onClick={() => handleStepChange(step.number)}
                      className={cn(
                        'flex w-full items-start gap-3 rounded-button px-3 py-3 text-left transition-colors',
                        isActive ? 'bg-navy text-white' : 'text-text-primary hover:bg-hover-light'
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-badge font-bold',
                          isActive
                            ? 'bg-white text-navy'
                            : isCompleted
                              ? 'bg-primary text-white'
                              : 'bg-slate-100 text-text-muted'
                        )}
                      >
                        {isCompleted ? <CheckCircle2 size={15} /> : <Icon size={15} />}
                      </span>
                      <span>
                        <span className="block text-body font-bold">{step.label}</span>
                        <span className={cn('mt-0.5 block text-label', isActive ? 'text-white/75' : 'text-text-muted')}>
                          {step.description}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </nav>
            </div>

            <div className="rounded-card bg-primary-100 p-5">
              <h3 className="text-body font-bold text-text-primary">Listing Snapshot</h3>
              <div className="mt-4 space-y-3">
                <SnapshotRow label="Listing ID" value={listing.id} />
                <SnapshotRow label="Status" value={form.status} />
                <SnapshotRow label="Location" value={[form.neighborhood, form.city].filter(Boolean).join(', ')} />
                <SnapshotRow label="Updated" value={listing.updated} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Property Overview Card (like owner portfolio) */}
            {!editing && (
              <PropertyOverviewCard listingForm={form} />
            )}

            {activeStep === 1 && (
              <StepSection
                icon={Home}
                title="Basic Information"
                description="Edit the identity, owner, configuration, and public description for this listing."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField label="Property Title" value={form.propertyTitle} disabled={!editing} onChange={(value) => setField('propertyTitle', value)} />
                  <TextField label="Owner" value={form.owner} disabled={!editing} onChange={(value) => setField('owner', value)} />
                  <SelectField label="Property Type" value={form.propertyType} options={propertyTypeOptions} disabled={!editing} onChange={(value) => setField('propertyType', value)} />
                  <TextField label="Built-up Area" value={form.builtUpArea} disabled={!editing} onChange={(value) => setField('builtUpArea', value)} />
                  <TextField label="Configuration" value={form.bedrooms} disabled={!editing} onChange={(value) => setField('bedrooms', value)} />
                  <TextField label="Bathrooms" value={form.bathrooms} disabled={!editing} onChange={(value) => setField('bathrooms', value)} />
                </div>
                <TextareaField label="Listing Description" value={form.description} disabled={!editing} onChange={(value) => setField('description', value)} />
              </StepSection>
            )}

            {activeStep === 2 && (
              <StepSection
                icon={MapPin}
                title="Property Location"
                description="Update the complete address, locality, and compliance details for map and search visibility."
              >
                <TextField
                  label="Street Address"
                  helper="Full legal address as it appears on title deeds."
                  value={form.streetAddress}
                  disabled={!editing}
                  onChange={(value) => setField('streetAddress', value)}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField label="Unit / Suite Number" value={form.unit} disabled={!editing} onChange={(value) => setField('unit', value)} />
                  <TextField label="Postal Code" value={form.postalCode} disabled={!editing} onChange={(value) => setField('postalCode', value)} />
                  <TextField label="City" value={form.city} disabled={!editing} onChange={(value) => setField('city', value)} />
                  <TextField label="Neighborhood" value={form.neighborhood} disabled={!editing} onChange={(value) => setField('neighborhood', value)} />
                </div>

                <div className="rounded-card border border-outline bg-canvas-alt p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-body font-bold text-text-primary">Map Pin</h3>
                      <p className="text-label text-text-muted">Dummy map preview for the current listing address.</p>
                    </div>
                    <button
                      type="button"
                      disabled={!editing}
                      onClick={() => toast.info('GPS updated', 'Dummy map pin has been refreshed.')}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-button border border-outline bg-white px-3 py-2 text-label font-medium transition-colors',
                        editing ? 'text-text-primary hover:bg-hover-light' : 'cursor-not-allowed text-text-muted opacity-60'
                      )}
                    >
                      <Navigation size={14} />
                      Use GPS
                    </button>
                  </div>
                  <div className="relative mt-4 h-56 overflow-hidden rounded-button bg-slate-200">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=900&q=70')] bg-cover bg-center opacity-60" />
                    <div className="absolute inset-0 bg-navy/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy/80 text-white shadow-lg">
                        <MapPin size={22} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <ToggleCard
                    icon={Building2}
                    title="Residential Zoning"
                    description="Approved for standard long-term housing."
                    checked={form.residentialZoning}
                    disabled={!editing}
                    onChange={(checked) => setField('residentialZoning', checked)}
                  />
                  <ToggleCard
                    icon={Building2}
                    title="Mixed Use"
                    description="Permits commercial ground-floor operations."
                    checked={form.mixedUse}
                    disabled={!editing}
                    onChange={(checked) => setField('mixedUse', checked)}
                  />
                </div>
              </StepSection>
            )}

            {activeStep === 3 && (
              <StepSection
                icon={Sparkles}
                title="Amenities & Features"
                description="Control what tenants see for property comfort, fit, furnishing, and parking."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <SelectField label="Tenant Preference" value={form.tenantPreference} options={tenantPreferenceOptions} disabled={!editing} onChange={(value) => setField('tenantPreference', value)} />
                  <SelectField label="Furnishing" value={form.furnishing} options={furnishingOptions} disabled={!editing} onChange={(value) => setField('furnishing', value)} />
                  <SelectField label="Parking Available" value={form.parking} options={parkingOptions} disabled={!editing} onChange={(value) => setField('parking', value)} />
                  <TextField label="Configuration Label" value={form.bedrooms} disabled={!editing} onChange={(value) => setField('bedrooms', value)} />
                </div>

                <CheckboxGrid
                  title="Included Amenities"
                  options={amenityOptions}
                  selected={form.amenities}
                  disabled={!editing}
                  onChange={updateAmenity}
                />

                <div>
                  <p className="text-body font-medium text-text-primary">Accessibility Features</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      { icon: Accessibility, label: 'Wheelchair Access' },
                      { icon: Building2, label: 'Elevator in Building' },
                      { icon: Car, label: 'On-site Parking' },
                    ].map((feature) => {
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
              </StepSection>
            )}

            {activeStep === 4 && (
              <StepSection
                icon={Image}
                title="Media & Gallery"
                description="Update the listing cover image and dummy gallery URLs used in admin previews."
              >
                <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="space-y-4">
                    <TextField
                      label="Cover Image URL"
                      value={form.image}
                      disabled={!editing}
                      onChange={(value) => {
                        setField('image', value)
                        updateMedia(0, value)
                      }}
                    />
                    {form.mediaUrls.map((url, index) => (
                      <TextField
                        key={index}
                        label={`Gallery Image ${index + 1}`}
                        value={url}
                        disabled={!editing}
                        onChange={(value) => updateMedia(index, value)}
                      />
                    ))}
                    <button
                      type="button"
                      disabled={!editing}
                      onClick={() => toast.info('Dummy upload', 'Paste an image URL for now. Upload integration can be added later.')}
                      className={cn(
                        'inline-flex items-center gap-2 rounded-button border border-outline bg-white px-4 py-2.5 text-body font-medium transition-colors',
                        editing ? 'text-text-primary hover:bg-hover-light' : 'cursor-not-allowed text-text-muted opacity-60'
                      )}
                    >
                      <Upload size={16} />
                      Upload Placeholder
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    <PreviewImage label="Cover Preview" url={form.image} large />
                    <div className="grid gap-3 sm:grid-cols-3">
                      {form.mediaUrls.slice(1, 4).map((url, index) => (
                        <PreviewImage key={index} label={`Image ${index + 2}`} url={url} />
                      ))}
                    </div>
                  </div>
                </div>
              </StepSection>
            )}

            {activeStep === 5 && (
              <StepSection
                icon={IndianRupee}
                title="Pricing & Lease"
                description="Manage public rent values, deposit, lease duration, availability, and listing status."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField label="Monthly Rent" value={form.rent} disabled={!editing} onChange={(value) => setField('rent', value)} />
                  <TextField label="Security Deposit" value={form.deposit} disabled={!editing} onChange={(value) => setField('deposit', value)} />
                  <TextField label="Maintenance Charges" value={form.maintenanceCharges} disabled={!editing} onChange={(value) => setField('maintenanceCharges', value)} />
                  <SelectField label="Lease Term" value={form.leaseTerm} options={leaseTermOptions} disabled={!editing} onChange={(value) => setField('leaseTerm', value)} />
                  <TextField label="Available From" type="date" value={form.availableFrom} disabled={!editing} onChange={(value) => setField('availableFrom', value)} />
                  <SelectField label="Listing Status" value={form.status} options={listingStatusOptions} disabled={!editing} onChange={(value) => setField('status', value as ListingStatus)} />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <MiniMetric icon={IndianRupee} label="Rent" value={form.rent} />
                  <MiniMetric icon={CalendarDays} label="Available" value={form.availableFrom} />
                  <MiniMetric icon={ShieldCheck} label="Status" value={form.status} />
                </div>
              </StepSection>
            )}

            <div className="flex flex-col gap-3 border-t border-outline pt-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handlePreviousStep}
                className="inline-flex items-center gap-2 text-body font-medium text-text-muted transition-colors hover:text-text-primary"
              >
                <ArrowLeft size={16} />
                {activeStep === 1 ? 'Back to Listings' : 'Previous Step'}
              </button>
              <div className="flex flex-wrap items-center gap-3">
                {editing && (
                  <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex items-center gap-2 rounded-button border border-outline bg-white px-5 py-2.5 text-body font-semibold text-text-primary shadow-sm transition-colors hover:bg-hover-light"
                  >
                    <Save size={16} />
                    Save All Pages
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="inline-flex items-center gap-2 rounded-button bg-navy px-6 py-3 text-body font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
                >
                  {activeStep === 5 ? (editing ? 'Save Listing' : 'Finish Review') : 'Next Step'}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <InfoCard icon={ShieldCheck} title="Verified Listings" description="Verified properties receive 5x more views and inquiries." tone="primary" />
          <InfoCard icon={TrendingUp} title="Pricing Insights" description="We can suggest optimal rents based on local market data." tone="error" />
          <InfoCard icon={Lock} title="Data Privacy" description="Property documents and owner records stay restricted to admins." tone="error" />
        </div>
      </div>
    </div>
  )
}

function PropertyOverviewCard({ listingForm }: { listingForm: ListingForm }) {
  const prototypeProperties = usePrototypeStore((state) => state.properties)
  const prototypeUsers = usePrototypeStore((state) => state.users)
  const brokerAssignments = usePrototypeStore((state) => state.brokerAssignments)
  const onboardingRecords = useOnboardingStore((state) => state.records)

  // Try to match this listing to a prototype property
  const matchedProperty = prototypeProperties.find(
    (p) => p.title.toLowerCase().includes(listingForm.propertyTitle.toLowerCase()) ||
      listingForm.propertyTitle.toLowerCase().includes(p.title.toLowerCase())
  )

  const owner = matchedProperty ? prototypeUsers.find((u) => u.id === matchedProperty.ownerId) : null
  const activeBroker = matchedProperty
    ? brokerAssignments.find((a) => a.propertyId === matchedProperty.id && a.status === 'Active')
    : null
  const brokerUser = activeBroker ? prototypeUsers.find((u) => u.id === activeBroker.brokerId) : null
  const activeOnboarding = matchedProperty
    ? onboardingRecords.find((r) => r.ownerPropertyId === matchedProperty.id && ['active', 'payment_completed'].includes(r.status))
    : null

  return (
    <article className="overflow-hidden rounded-card border border-outline bg-white shadow-surface">
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <img
          src={listingForm.image}
          alt={listingForm.propertyTitle}
          className="h-full w-full object-cover"
        />
        <span className={cn(
          'absolute left-5 top-5 rounded-pill px-3 py-1 text-badge font-bold uppercase',
          activeOnboarding?.status === 'active'
            ? 'bg-primary-50 text-primary'
            : activeOnboarding
              ? 'bg-amber-50 text-amber-700'
              : 'bg-green-50 text-green-700'
        )}>
          {activeOnboarding?.status === 'active' ? 'Occupied' : activeOnboarding ? 'Pending Onboarding' : 'Vacant'}
        </span>
      </div>

      <div className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-heading-3 font-bold text-text-primary">{listingForm.propertyTitle}</h2>
            <p className="mt-1 text-label text-text-muted flex items-center gap-1">
              <MapPin size={13} />
              {listingForm.neighborhood}, {listingForm.city}
            </p>
          </div>
          <p className="text-heading-2 font-bold text-primary">{listingForm.rent}<span className="text-label font-normal text-text-muted"> /mo</span></p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-label text-text-muted">
          <span>{listingForm.bedrooms}</span>
          <span>{listingForm.bathrooms} Baths</span>
          <span>{listingForm.builtUpArea}</span>
          <span>{listingForm.furnishing}</span>
          <span>{listingForm.parking}</span>
        </div>

        {/* Owner & Broker Info */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-outline bg-canvas-alt p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Owner</p>
            <p className="mt-1 text-body font-bold text-text-primary">{owner ? `${owner.firstName} ${owner.lastName}` : listingForm.owner}</p>
            <p className="mt-0.5 text-label text-text-muted">{owner?.email ?? 'owner@rentilo.test'}</p>
          </div>

          <div className="rounded-lg border border-outline bg-canvas-alt p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Assigned Broker</p>
            {brokerUser ? (
              <>
                <p className="mt-1 text-body font-bold text-text-primary">{brokerUser.firstName} {brokerUser.lastName}</p>
                <p className="mt-0.5 text-label text-text-muted">{brokerUser.phone}</p>
              </>
            ) : (
              <p className="mt-1 text-body text-text-muted">No broker assigned</p>
            )}
          </div>
        </div>

        {/* Tenant Info (if onboarded) */}
        {activeOnboarding && (
          <div className="mt-4 rounded-lg border border-primary-100 bg-primary-50/50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
              {activeOnboarding.status === 'active' ? 'Current Tenant' : 'Tenant — Payment Received'}
            </p>
            <div className="mt-2 flex items-center gap-3">
              {activeOnboarding.tenant.avatar && (
                <img src={activeOnboarding.tenant.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
              )}
              <div>
                <p className="text-body font-bold text-navy">{activeOnboarding.tenant.name}</p>
                <p className="text-label text-text-muted">{activeOnboarding.tenant.email} · {activeOnboarding.tenant.phone}</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-label">
              <div>
                <span className="text-text-muted">Monthly Rent:</span>
                <span className="ml-1 font-semibold text-text-primary">{activeOnboarding.monthlyRent}</span>
              </div>
              <div>
                <span className="text-text-muted">Unit:</span>
                <span className="ml-1 font-semibold text-text-primary">{activeOnboarding.unit}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}

function StepSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-card border border-outline bg-white p-6 shadow-surface">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-button bg-primary-100 text-primary">
          <Icon size={20} />
        </div>
        <div>
          <h2 className="text-heading-3 font-bold text-text-primary">{title}</h2>
          <p className="mt-1 text-label text-text-muted">{description}</p>
        </div>
      </div>
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  )
}

function SnapshotRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-filter-label uppercase tracking-wider text-text-muted">{label}</p>
      <p className="mt-0.5 text-body font-semibold text-text-primary">{value}</p>
    </div>
  )
}

function TextField({
  label,
  helper,
  value,
  disabled,
  onChange,
  type = 'text',
}: {
  label: string
  helper?: string
  value: string
  disabled: boolean
  onChange: (value: string) => void
  type?: string
}) {
  return (
    <label className="block">
      <span className="text-label font-medium text-text-muted">{label}</span>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          'mt-1.5 h-10 w-full rounded-input border border-outline bg-white px-4 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30',
          disabled && 'bg-canvas-alt text-text-muted'
        )}
      />
      {helper && <p className="mt-1 text-label text-text-muted">{helper}</p>}
    </label>
  )
}

function TextareaField({
  label,
  value,
  disabled,
  onChange,
}: {
  label: string
  value: string
  disabled: boolean
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="text-label font-medium text-text-muted">{label}</span>
      <textarea
        value={value}
        disabled={disabled}
        rows={5}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          'mt-1.5 w-full resize-none rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30',
          disabled && 'bg-canvas-alt text-text-muted'
        )}
      />
    </label>
  )
}

function SelectField({
  label,
  value,
  options,
  disabled,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  disabled: boolean
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="text-label font-medium text-text-muted">{label}</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          'mt-1.5 h-10 w-full rounded-input border border-outline bg-white px-3 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30',
          disabled && 'bg-canvas-alt text-text-muted'
        )}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

function ToggleCard({
  icon: Icon,
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  icon: LucideIcon
  title: string
  description: string
  checked: boolean
  disabled: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex items-start gap-3 rounded-button border border-outline p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-button bg-canvas-alt">
        <Icon size={18} className="text-text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-body font-semibold text-text-primary">{title}</p>
        <p className="text-label text-text-muted">{description}</p>
      </div>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 rounded border-outline text-navy focus:ring-primary disabled:cursor-not-allowed"
      />
    </label>
  )
}

function CheckboxGrid({
  title,
  options,
  selected,
  disabled,
  onChange,
}: {
  title: string
  options: string[]
  selected: string[]
  disabled: boolean
  onChange: (option: string, checked: boolean) => void
}) {
  return (
    <div>
      <p className="text-body font-medium text-text-primary">{title}</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => {
          const checked = selected.includes(option)
          return (
            <label
              key={option}
              className={cn(
                'flex items-center gap-3 rounded-button border px-3 py-2.5 text-body font-medium transition-colors',
                checked ? 'border-navy bg-primary-100 text-text-primary' : 'border-outline bg-white text-text-muted',
                !disabled && 'cursor-pointer hover:border-navy/50'
              )}
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={(event) => onChange(option, event.target.checked)}
                className="h-4 w-4 rounded border-outline text-navy focus:ring-primary disabled:cursor-not-allowed"
              />
              {option}
            </label>
          )
        })}
      </div>
    </div>
  )
}

function PreviewImage({ label, url, large = false }: { label: string; url: string; large?: boolean }) {
  return (
    <div className="overflow-hidden rounded-card border border-outline bg-white">
      <div className={cn('bg-canvas-alt', large ? 'h-64' : 'h-24')}>
        {url ? (
          <img src={url} alt={label} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-label text-text-muted">No image</div>
        )}
      </div>
      <p className="px-3 py-2 text-label font-medium text-text-muted">{label}</p>
    </div>
  )
}

function MiniMetric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-card border border-outline bg-canvas-alt p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-button bg-white text-navy">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-filter-label uppercase tracking-wider text-text-muted">{label}</p>
        <p className="mt-0.5 text-body font-bold text-text-primary">{value}</p>
      </div>
    </div>
  )
}

function InfoCard({
  icon: Icon,
  title,
  description,
  tone,
}: {
  icon: LucideIcon
  title: string
  description: string
  tone: 'primary' | 'error'
}) {
  return (
    <div className="flex items-start gap-3 rounded-card border border-outline bg-white p-5 shadow-sm">
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
          tone === 'primary' ? 'bg-primary-100' : 'bg-status-error-bg'
        )}
      >
        <Icon size={18} className={tone === 'primary' ? 'text-primary' : 'text-status-error'} />
      </div>
      <div>
        <p className="text-body font-bold text-text-primary">{title}</p>
        <p className="text-label text-text-muted">{description}</p>
      </div>
    </div>
  )
}
