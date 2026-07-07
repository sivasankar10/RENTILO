import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  Car,
  CheckCircle2,
  Clock3,
  ClipboardList,
  FileText,
  Dumbbell,
  Home,
  KeyRound,
  MapPin,
  MessageSquare,
  PawPrint,
  Phone,
  Send,
  ShieldCheck,
  Sofa,
  UserRound,
  Utensils,
  Waves,
  Wifi,
  X,
} from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { ROUTES } from '@shared/constants/routes'
import { useAuth } from '@shared/hooks/useAuth'
import { DEMO_OWNER, getOwnerLeaseForProperty, useOnboardingStore } from '@shared/store/onboardingStore'
import { useLeaseChatStore } from '@shared/store/leaseChatStore'
import { usePaymentsStore } from '@shared/store/paymentsStore'
import { useOwnerChatStore } from '../store/chatStore'
import { PRIMARY_OWNER_PROPERTY_ID } from '../constants/portfolioProperty'
import { useOwnerPrototype } from '../hooks/useOwnerPrototype'
import { usePrototypeStore } from '@shared/store/prototypeStore'

const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    alt: 'Grand luxury property entrance',
  },
  {
    src: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=500&q=80',
    alt: 'Modern kitchen with green cabinetry',
  },
  {
    src: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=500&q=80',
    alt: 'Bright bedroom with neutral bedding',
  },
  {
    src: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=500&q=80',
    alt: 'Clean white bathroom',
  },
]

const stats = [
  { label: 'Views', value: '124' },
  { label: 'Shortlists', value: '18' },
  { label: 'Contacts', value: '5' },
]

const amenities = [
  { label: 'High-Speed WiFi', icon: Wifi },
  { label: 'Fitness Center', icon: Dumbbell },
  { label: 'Infinity Pool', icon: Waves },
  { label: 'Secure Parking', icon: Car },
]

const overviewSpecs = [
  { label: 'Bedrooms', value: '2 Beds', icon: BedDouble },
  { label: 'Bathrooms', value: '2 Baths', icon: Bath },
  { label: 'Built-up Area', value: '1,200 sqft', icon: Home },
  { label: 'Floor', value: '14 / 32', icon: Building2 },
  { label: 'Property Type', value: 'Luxury Apartment', icon: ClipboardList },
  { label: 'Possession', value: 'Immediate', icon: KeyRound },
]

const propertyFeatures = [
  { label: 'Semi-Furnished', detail: 'Sofa, wardrobes, dining setup', icon: Sofa },
  { label: 'Modular Kitchen', detail: 'Hob, chimney, storage, stone counter', icon: Utensils },
  { label: 'Gated Security', detail: '24/7 front desk and CCTV coverage', icon: ShieldCheck },
  { label: 'Pet Friendly', detail: 'Pets allowed with owner approval', icon: PawPrint },
  { label: 'Both Parking', detail: '2-wheeler and 4-wheeler parking available', icon: Car },
  { label: 'NoBroker Services', detail: 'Verified listing support enabled', icon: CheckCircle2 },
]

const propertyRules = [
  { rule: 'No smoking inside the unit or common areas', category: 'Health & Safety' },
  { rule: 'Quiet hours between 10:00 PM and 7:00 AM', category: 'Community' },
  { rule: 'Visitors must register with security after 9:00 PM', category: 'Security' },
  { rule: 'Monthly rent must be paid by the 5th of each month', category: 'Payments' },
  { rule: 'Subletting requires written owner approval', category: 'Lease' },
]

const nearbyHighlights = [
  { name: 'Central Metro Station', distance: '0.4 km', time: '5 mins' },
  { name: 'Fresh Mart Grocery', distance: '0.5 km', time: '7 mins' },
  { name: 'City Care Clinic', distance: '1.2 km', time: '14 mins' },
  { name: 'HDFC ATM', distance: '0.3 km', time: '4 mins' },
]

type VisitStatus = 'Confirmed' | 'Pending' | 'Completed'

interface ContactTarget {
  id: string
  name: string
  phone: string
  avatar: string
  context: string
}

const visitStatusStyles: Record<VisitStatus, string> = {
  Confirmed: 'bg-green-50 text-green-700',
  Pending: 'bg-amber-50 text-amber-700',
  Completed: 'bg-slate-100 text-slate-600',
}

export function OwnerPropertyDetail() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { properties } = useOwnerPrototype()
  const ownerId = user?.id ?? DEMO_OWNER.id
  const { propertyId } = useParams<{ propertyId: string }>()
  const ownerPropertyId = propertyId ?? PRIMARY_OWNER_PROPERTY_ID
  const activeProperty = properties.find((p) => p.id === ownerPropertyId) ?? properties[0]
  const propertyTitle = activeProperty?.title ?? 'MultiOwner Skyline 14B'
  const propertyLocation = activeProperty ? `${activeProperty.neighborhood}, ${activeProperty.city}` : 'Indiranagar, Bangalore'
  const [schedulerOpen, setSchedulerOpen] = useState(false)
  const [leadsOpen, setLeadsOpen] = useState(false)
  const [selectedScheduleDate, setSelectedScheduleDate] = useState('')
  const [activeContact, setActiveContact] = useState<ContactTarget | null>(null)
  const [chatDraft, setChatDraft] = useState('')
  const [callStatus, setCallStatus] = useState('')
  const [chatMessages, setChatMessages] = useState<Record<string, string[]>>({})
  const onboardingRecords = useOnboardingStore((state) => state.records)
  const payments = usePaymentsStore((state) => state.payments)
  const ensureTenantConversation = useOwnerChatStore((state) => state.ensureTenantConversation)
  const ensureLeaseThread = useLeaseChatStore((state) => state.ensureThread)

  // Dynamic applications from prototype store for this property
  const prototypeApplications = usePrototypeStore((state) => state.applications)
  const prototypeUsers = usePrototypeStore((state) => state.users)

  // Interested leads: tenants who showed interest in this property (still active leads)
  const interestedLeads = useMemo(
    () => prototypeApplications
      .filter((app) => app.propertyId === ownerPropertyId && !['active', 'rejected', 'payment_completed'].includes(app.status))
      .map((app) => {
        const tenant = prototypeUsers.find((u) => u.id === app.tenantId)
        return {
          id: app.id,
          tenantName: tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Unknown',
          phone: tenant?.phone ?? '',
          avatar: tenant?.avatar ?? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
          profile: tenant?.kycStatus === 'Verified' ? 'Verified tenant' : 'Pending KYC',
          budget: activeProperty?.price ?? '',
          clickedAt: new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        }
      }),
    [prototypeApplications, prototypeUsers, ownerPropertyId, activeProperty?.price],
  )

  // Scheduled visits: applications with a scheduledVisit
  const scheduledVisits = useMemo(
    () => prototypeApplications
      .filter((app) => app.propertyId === ownerPropertyId && app.scheduledVisit && ['visit_scheduled', 'visit_confirmed'].includes(app.status))
      .map((app) => {
        const tenant = prototypeUsers.find((u) => u.id === app.tenantId)
        const visit = app.scheduledVisit!
        const dateObj = new Date(visit.date)
        return {
          id: app.id,
          date: visit.date,
          day: String(dateObj.getDate()).padStart(2, '0'),
          weekday: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
          tenantName: tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Unknown',
          phone: tenant?.phone ?? '',
          avatar: tenant?.avatar ?? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
          time: visit.time,
          status: (app.status === 'visit_confirmed' ? 'Confirmed' : 'Pending') as VisitStatus,
          note: `Visit scheduled for ${visit.date} at ${visit.time}`,
        }
      }),
    [prototypeApplications, prototypeUsers, ownerPropertyId],
  )

  // Build calendar days from scheduled visits
  const calendarDays = useMemo(() => {
    const uniqueDates = [...new Set(scheduledVisits.map((v) => v.date))].sort()
    if (uniqueDates.length === 0) {
      // Show next 6 days if no visits
      const days = []
      const today = new Date()
      for (let i = 0; i < 6; i++) {
        const d = new Date(today)
        d.setDate(d.getDate() + i)
        days.push({
          date: d.toISOString().slice(0, 10),
          day: String(d.getDate()).padStart(2, '0'),
          weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
        })
      }
      return days
    }
    return uniqueDates.map((date) => {
      const d = new Date(date)
      return {
        date,
        day: String(d.getDate()).padStart(2, '0'),
        weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
      }
    })
  }, [scheduledVisits])

  const selectedDayVisits = useMemo(
    () => scheduledVisits.filter((visit) => visit.date === (selectedScheduleDate || calendarDays[0]?.date)),
    [scheduledVisits, selectedScheduleDate, calendarDays],
  )
  const activeLease = useMemo(
    () =>
      getOwnerLeaseForProperty(onboardingRecords, ownerId, ownerPropertyId, [
        'payment_completed',
        'active',
      ]),
    [onboardingRecords, ownerId, ownerPropertyId],
  )
  const isOnboarded = activeLease?.status === 'active'
  const activeAgreement = activeLease?.agreementVersions[activeLease.agreementVersions.length - 1]
  const onboardingPayment = useMemo(
    () =>
      payments.find(
        (payment) =>
          payment.onboardingId === activeLease?.id &&
          payment.flow === 'tenant_to_owner' &&
          payment.category === 'RENT',
      ),
    [payments, activeLease?.id],
  )

  const openTenantChat = () => {
    if (!activeLease) return
    ensureLeaseThread({
      onboardingId: activeLease.id,
      ownerId: activeLease.owner.id,
      tenantId: activeLease.tenant.id,
      tenantName: activeLease.tenant.name,
      tenantAvatar: activeLease.tenant.avatar,
      ownerName: activeLease.owner.name,
      propertyName: activeLease.propertyName,
      unit: activeLease.unit,
      address: activeLease.address,
      monthlyRent: activeLease.monthlyRent,
    })
    const conversationId = ensureTenantConversation({
      tenantId: activeLease.tenant.id,
      onboardingId: activeLease.id,
      name: activeLease.tenant.name,
      propertyName: activeLease.propertyName,
      unit: activeLease.unit,
      address: activeLease.address,
      monthlyRent: activeLease.monthlyRent,
      avatar: activeLease.tenant.avatar,
    })
    navigate(`${ROUTES.OWNER.MESSAGES}?conversationId=${conversationId}`)
  }

  const openChat = (target: ContactTarget) => {
    setActiveContact(target)
    setChatDraft('')
    setCallStatus('')
    setChatMessages((current) => ({
      ...current,
      [target.id]: current[target.id] ?? [`Hi ${target.name}, this is the owner of ${propertyTitle}.`],
    }))
  }

  const handleCall = (target: ContactTarget) => {
    setCallStatus(`Calling ${target.name} at ${target.phone}...`)
    window.setTimeout(() => {
      setCallStatus(`Call request logged for ${target.name}.`)
    }, 900)
  }

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!activeContact || !chatDraft.trim()) return

    setChatMessages((current) => ({
      ...current,
      [activeContact.id]: [...(current[activeContact.id] ?? []), chatDraft.trim()],
    }))
    setChatDraft('')
  }

  return (
    <div className="min-h-screen bg-canvas-alt">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px]">
          <main className="space-y-8">
            <header>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-heading-1 font-extrabold tracking-tight text-navy">
                  {propertyTitle}
                </h1>
                {isOnboarded && (
                  <span className="rounded-pill bg-primary-50 px-3 py-1 text-badge font-bold uppercase text-primary">
                    Occupied
                  </span>
                )}
                {activeLease && !isOnboarded && (
                  <span className="rounded-pill bg-status-warning-bg px-3 py-1 text-badge font-bold uppercase text-status-warning-text">
                    Pending onboarding
                  </span>
                )}
              </div>
              <p className="mt-2 flex items-center gap-2 text-label font-medium text-text-primary">
                <MapPin size={14} />
                {propertyLocation}
              </p>
            </header>

            <section className="rounded-card border border-outline bg-white p-4 shadow-surface">
              <img
                src={galleryImages[0].src}
                alt={galleryImages[0].alt}
                className="h-[420px] w-full rounded-card object-cover"
              />
              <div className="mt-4 grid grid-cols-3 gap-4">
                {galleryImages.slice(1).map((image) => (
                  <img
                    key={image.alt}
                    src={image.src}
                    alt={image.alt}
                    className="h-36 w-full rounded-button object-cover"
                  />
                ))}
              </div>
            </section>

            <section className="rounded-card border border-outline bg-white p-8 shadow-surface">
              <h2 className="text-heading-3 font-bold text-navy">Property Overview</h2>
              <div className="mt-6 space-y-5 text-body leading-6 text-text-primary">
                <p>
                  Experience unparalleled luxury in this stunning high-rise residence at The Opus
                  Tower. Positioned ideally in the heart of the Financial District, this architectural
                  masterpiece offers panoramic city views through floor-to-ceiling windows.
                </p>
                <p>
                  The open-concept living area flows seamlessly into a chef-grade kitchen equipped
                  with top-of-the-line stainless steel appliances and imported stone countertops.
                  Hardwood flooring throughout adds warmth to the crisp, modern aesthetic.
                </p>
                <p>
                  Residents enjoy exclusive access to world-class amenities, ensuring a lifestyle of
                  comfort and sophistication.
                </p>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {overviewSpecs.map((spec) => {
                  const Icon = spec.icon
                  return (
                    <div key={spec.label} className="flex items-center gap-4 rounded-button bg-canvas-alt px-4 py-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-button bg-primary-50 text-navy">
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="text-filter-label uppercase text-text-muted">{spec.label}</p>
                        <p className="mt-1 text-label font-bold text-text-primary">{spec.value}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            <section className="rounded-card border border-outline bg-white p-8 shadow-surface">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-heading-3 font-bold text-navy">Property Features</h2>
                  <p className="mt-2 text-label text-text-muted">
                    Complete feature list visible to tenants and useful for owner review.
                  </p>
                </div>
                <span className="w-fit rounded-pill bg-primary-50 px-3 py-1 text-badge font-bold uppercase text-primary">
                  {propertyFeatures.length} active features
                </span>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {propertyFeatures.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <div key={feature.label} className="flex gap-4 rounded-button border border-outline bg-white p-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-button bg-primary-50 text-navy">
                        <Icon size={19} />
                      </div>
                      <div>
                        <p className="text-body font-bold text-text-primary">{feature.label}</p>
                        <p className="mt-1 text-label leading-5 text-text-muted">{feature.detail}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-card border border-outline bg-white p-8 shadow-surface">
                <h2 className="text-heading-3 font-bold text-navy">Property Rules</h2>
                <div className="mt-6 overflow-hidden rounded-button border border-outline">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-canvas-alt">
                        <th className="px-4 py-3 text-filter-label font-bold uppercase text-text-muted">
                          Rule
                        </th>
                        <th className="px-4 py-3 text-filter-label font-bold uppercase text-text-muted">
                          Category
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline">
                      {propertyRules.map((rule) => (
                        <tr key={rule.rule}>
                          <td className="px-4 py-3 text-label font-medium text-text-primary">
                            {rule.rule}
                          </td>
                          <td className="px-4 py-3">
                            <span className="rounded-pill bg-primary-50 px-2.5 py-1 text-badge font-bold text-primary">
                              {rule.category}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-card border border-outline bg-white p-8 shadow-surface">
                <h2 className="text-heading-3 font-bold text-navy">Nearby Highlights</h2>
              <div className="mt-6 space-y-3">
                  {nearbyHighlights.map((place) => (
                    <div key={place.name} className="flex items-baseline justify-between gap-4 border-b border-outline pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="text-label font-bold text-text-primary">{place.name}</p>
                        <p className="mt-0.5 text-filter-label uppercase text-text-muted">{place.time}</p>
                      </div>
                      <span className="shrink-0 text-label font-semibold text-navy">{place.distance}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-card border border-outline bg-white p-8 shadow-surface">
              <h2 className="text-heading-3 font-bold text-navy">Amenities</h2>
              <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
                {amenities.map((amenity) => {
                  const Icon = amenity.icon
                  return (
                    <div key={amenity.label} className="text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-button bg-primary-50 text-navy">
                        <Icon size={20} />
                      </div>
                      <p className="mt-3 text-label font-bold text-text-primary">{amenity.label}</p>
                    </div>
                  )
                })}
              </div>
            </section>
          </main>

          <aside className="xl:pt-14">
            <div className="sticky top-24 rounded-card border border-outline bg-white p-6 shadow-surface">
              <div className="text-right">
                <p className="text-heading-2 font-extrabold tracking-tight text-navy">
                  {activeProperty?.price ?? 'Rs. 85,000'}
                  <span className="ml-1 text-body font-semibold text-text-primary">/ mo</span>
                </p>
                <p className="text-filter-label uppercase text-text-primary">Deposit: {activeProperty?.deposit ?? 'Rs. 1,70,000'}</p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-5 border-y border-outline py-6">
                <div>
                  <p className="text-filter-label uppercase text-text-muted">Tenant Preference</p>
                  <p className="mt-1 text-label font-bold text-text-primary">Family / Couple</p>
                </div>
                <div>
                  <p className="text-filter-label uppercase text-text-muted">Furnishing</p>
                  <p className="mt-1 text-label font-bold text-text-primary">Semi-Furnished</p>
                </div>
                <div>
                  <p className="text-filter-label uppercase text-text-muted">Parking Available</p>
                  <p className="mt-1 text-label font-bold text-text-primary">Both (2W & 4W)</p>
                </div>
                <div>
                  <p className="text-filter-label uppercase text-text-muted">Listed On</p>
                  <p className="mt-1 text-label font-bold text-text-primary">Posted 2 days ago</p>
                </div>
              </div>

              {activeLease && (
                <div className="mt-6 space-y-4 rounded-card border border-outline bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <img src={activeLease.tenant.avatar} alt={activeLease.tenant.name} className="h-12 w-12 rounded-full object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="text-filter-label uppercase tracking-widest text-text-muted">
                        {isOnboarded ? 'Current Tenant' : 'Tenant — payment received'}
                      </p>
                      <h3 className="mt-1 truncate text-body-lg font-bold text-navy">{activeLease.tenant.name}</h3>
                      <p className="mt-1 text-label text-text-muted">{activeLease.tenant.email}</p>
                      <p className="mt-1 text-label text-text-muted">{activeLease.tenant.phone}</p>
                      {isOnboarded && activeLease.lease?.accessKey && (
                        <p className="mt-2 text-label font-semibold text-navy">Access key: {activeLease.lease.accessKey}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={openTenantChat}
                      className="inline-flex items-center justify-center gap-2 rounded-button bg-navy px-3 py-2 text-label font-bold text-white transition-colors hover:bg-slate-800"
                    >
                      <MessageSquare size={14} />
                      Chat
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCall({
                        id: `tenant-call-${activeLease.tenant.id}`,
                        name: activeLease.tenant.name,
                        phone: activeLease.tenant.phone,
                        avatar: activeLease.tenant.avatar,
                        context: `${activeLease.unit} active lease`,
                      })}
                      className="inline-flex items-center justify-center gap-2 rounded-button border border-outline bg-white px-3 py-2 text-label font-bold text-navy transition-colors hover:bg-hover-light"
                    >
                      <Phone size={14} />
                      Call
                    </button>
                  </div>

                  <div className="border-t border-outline pt-4">
                    <p className="text-filter-label font-bold uppercase tracking-widest text-text-muted">Documents</p>
                    <div className="mt-3 space-y-2">
                      <button
                        type="button"
                        onClick={() => navigate(ROUTES.OWNER.LEASE_DOCUMENTS(activeLease.id))}
                        className="flex w-full items-center gap-3 rounded-button border border-outline bg-white px-3 py-3 text-left transition-colors hover:bg-hover-light"
                      >
                        <FileText size={16} className="text-navy" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-label font-bold text-text-primary">
                            Rental Agreement v{activeAgreement?.version ?? 1}
                          </span>
                          <span className="block truncate text-label text-text-muted">
                            {activeAgreement?.tenantApprovedAt
                              ? `Signed ${activeAgreement.tenantApprovedAt}`
                              : 'View signed agreement'}
                          </span>
                        </span>
                      </button>
                      {onboardingPayment && (
                        <button
                          type="button"
                          onClick={() => navigate(ROUTES.OWNER.PAYMENT_RECEIPT(onboardingPayment.id))}
                          className="flex w-full items-center gap-3 rounded-button border border-outline bg-white px-3 py-3 text-left transition-colors hover:bg-hover-light"
                        >
                          <FileText size={16} className="text-navy" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-label font-bold text-text-primary">Payment Receipt</span>
                            <span className="block truncate text-label text-text-muted">{onboardingPayment.txnId}</span>
                          </span>
                        </button>
                      )}
                      {isOnboarded && (
                        <button
                          type="button"
                          onClick={() => navigate(ROUTES.OWNER.LEASES)}
                          className="flex w-full items-center gap-3 rounded-button border border-outline bg-white px-3 py-3 text-left transition-colors hover:bg-hover-light"
                        >
                          <FileText size={16} className="text-navy" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-label font-bold text-text-primary">Lease Summary</span>
                            <span className="block truncate text-label text-text-muted">{activeLease.lease?.id ?? 'Active lease'}</span>
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {!activeLease && (
              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setSchedulerOpen((isOpen) => !isOpen)
                    setLeadsOpen(false)
                    setCallStatus('')
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-button bg-navy px-4 py-3 text-body font-semibold text-white transition-colors duration-200 hover:bg-slate-800"
                  aria-expanded={schedulerOpen}
                >
                  <CalendarDays size={16} />
                  Upcoming Schedules
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLeadsOpen((isOpen) => !isOpen)
                    setSchedulerOpen(false)
                    setCallStatus('')
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-button bg-slate-200 px-4 py-3 text-body font-bold text-navy transition-colors duration-200 hover:bg-slate-300"
                  aria-expanded={leadsOpen}
                >
                  <MessageSquare size={16} />
                  View Interested Tenants
                </button>
              </div>

              )}
              {!activeLease && schedulerOpen && (
                <div className="mt-4 rounded-card border border-outline bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-label font-bold uppercase tracking-widest text-text-muted">Upcoming Schedules</p>
                      <p className="mt-1 text-label text-text-muted">Tap a day to view tenants.</p>
                    </div>
                    <span className="rounded-pill bg-white px-2.5 py-1 text-badge font-bold text-navy">
                      {scheduledVisits.length} visits
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {calendarDays.map((day) => {
                      const visitsForDay = scheduledVisits.filter((visit) => visit.date === day.date)
                      const isSelected = day.date === (selectedScheduleDate || calendarDays[0]?.date)

                      return (
                        <button
                          type="button"
                          key={day.date}
                          onClick={() => setSelectedScheduleDate(day.date)}
                          className={cn(
                            'rounded-button border px-2 py-3 text-center transition-colors',
                            isSelected
                              ? 'border-navy bg-navy text-white'
                              : 'border-outline bg-white text-text-primary hover:border-navy'
                          )}
                        >
                          <span className="block text-[11px] font-bold uppercase tracking-widest opacity-80">{day.weekday}</span>
                          <span className="mt-1 block text-body-lg font-extrabold">{day.day}</span>
                          <span
                            className={cn(
                              'mx-auto mt-1 block h-1.5 w-1.5 rounded-full',
                              visitsForDay.length > 0 ? 'bg-primary' : 'bg-transparent',
                              isSelected && visitsForDay.length > 0 && 'bg-white'
                            )}
                          />
                        </button>
                      )
                    })}
                  </div>

                  <div className="mt-4 space-y-3">
                    {selectedDayVisits.length > 0 ? (
                      selectedDayVisits.map((visit) => {
                        const target: ContactTarget = {
                          id: `visit-${visit.id}`,
                          name: visit.tenantName,
                          phone: visit.phone,
                          avatar: visit.avatar,
                          context: `${visit.time} visit on ${visit.weekday}, June ${visit.day}`,
                        }

                        return (
                          <div key={visit.id} className="rounded-button border border-outline bg-white p-3">
                            <div className="flex gap-3">
                              <img src={visit.avatar} alt={visit.tenantName} className="h-10 w-10 rounded-full object-cover" />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <p className="truncate text-label font-bold text-text-primary">{visit.tenantName}</p>
                                    <p className="mt-0.5 inline-flex items-center gap-1 text-label text-text-muted">
                                      <Clock3 size={13} />
                                      {visit.time}
                                    </p>
                                  </div>
                                  <span className={cn('rounded-pill px-2 py-0.5 text-[10px] font-bold', visitStatusStyles[visit.status])}>
                                    {visit.status}
                                  </span>
                                </div>
                                <p className="mt-2 line-clamp-2 text-label text-text-muted">{visit.note}</p>
                                <div className="mt-3 flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => openChat(target)}
                                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-button border border-outline bg-white px-3 py-2 text-label font-bold text-navy transition-colors hover:bg-hover-light"
                                  >
                                    <MessageSquare size={14} />
                                    Chat
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleCall(target)}
                                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-button bg-navy px-3 py-2 text-label font-bold text-white transition-colors hover:bg-slate-800"
                                  >
                                    <Phone size={14} />
                                    Call
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="rounded-button border border-dashed border-outline bg-white px-3 py-5 text-center">
                        <CalendarDays size={24} className="mx-auto text-text-muted" />
                        <p className="mt-2 text-label font-semibold text-text-muted">No visits scheduled for this day.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!activeLease && leadsOpen && (
                <div className="mt-4 rounded-card border border-outline bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-label font-bold uppercase tracking-widest text-text-muted">Interested Tenant Leads</p>
                      <p className="mt-1 text-label text-text-muted">Tenants who clicked the interest button.</p>
                    </div>
                    <span className="rounded-pill bg-white px-2.5 py-1 text-badge font-bold text-navy">
                      {interestedLeads.length} leads
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {interestedLeads.map((lead) => {
                      const target: ContactTarget = {
                        id: `lead-${lead.id}`,
                        name: lead.tenantName,
                        phone: lead.phone,
                        avatar: lead.avatar,
                        context: `Interested lead - ${lead.clickedAt}`,
                      }

                      return (
                        <div key={lead.id} className="rounded-button border border-outline bg-white p-3">
                          <div className="flex items-start gap-3">
                            <img src={lead.avatar} alt={lead.tenantName} className="h-10 w-10 rounded-full object-cover" />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="truncate text-label font-bold text-text-primary">{lead.tenantName}</p>
                                  <p className="mt-0.5 text-label text-text-muted">{lead.profile}</p>
                                </div>
                                <span className="shrink-0 text-[10px] font-bold uppercase text-text-muted">{lead.clickedAt}</span>
                              </div>
                              <p className="mt-2 text-label font-semibold text-navy">Budget: {lead.budget}</p>
                              <button
                                type="button"
                                onClick={() => openChat(target)}
                                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-button bg-navy px-3 py-2 text-label font-bold text-white transition-colors hover:bg-slate-800"
                              >
                                <MessageSquare size={14} />
                                Chat
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCall(target)}
                                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-button border border-outline bg-white px-3 py-2 text-label font-bold text-navy transition-colors hover:bg-hover-light"
                              >
                                <Phone size={14} />
                                Call
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {callStatus && (
                <p className="mt-4 rounded-button bg-primary-100 px-3 py-2 text-label font-semibold text-primary">
                  {callStatus}
                </p>
              )}

              <div className="mt-8 grid grid-cols-3 divide-x divide-outline rounded-button bg-slate-50">
                {stats.map((stat) => (
                  <div key={stat.label} className="px-2 py-4 text-center">
                    <p className="text-body font-extrabold text-navy">{stat.value}</p>
                    <p className="mt-1 text-filter-label uppercase text-text-muted">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {activeContact && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
            <button
              type="button"
              className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
              onClick={() => setActiveContact(null)}
              aria-label="Close chat overlay"
            />
            <section className="relative z-[91] flex max-h-[86vh] w-full max-w-md flex-col overflow-hidden rounded-card border border-outline bg-white shadow-modal">
              <header className="flex items-start justify-between gap-4 border-b border-outline px-5 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  {activeContact.avatar ? (
                    <img src={activeContact.avatar} alt={activeContact.name} className="h-11 w-11 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 text-primary">
                      <UserRound size={20} />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h2 className="truncate text-body-lg font-bold text-navy">{activeContact.name}</h2>
                    <p className="truncate text-label text-text-muted">{activeContact.context}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveContact(null)}
                  className="rounded-button p-2 text-text-muted transition-colors hover:bg-hover-light hover:text-navy"
                  aria-label="Close chat"
                >
                  <X size={18} />
                </button>
              </header>

              <div className="flex-1 space-y-3 overflow-y-auto bg-canvas-alt px-5 py-4">
                <div className="flex justify-start">
                  <div className="max-w-[82%] rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-body text-text-primary shadow-sm">
                    <p>I saw your activity on {propertyTitle}. How can I help with your visit or questions?</p>
                    <p className="mt-1 text-[11px] font-semibold text-text-muted">Owner prompt</p>
                  </div>
                </div>
                {(chatMessages[activeContact.id] ?? []).map((message, index) => (
                  <div key={`${activeContact.id}-${index}`} className="flex justify-end">
                    <div className="max-w-[82%] rounded-2xl rounded-br-sm bg-navy px-4 py-3 text-body text-white shadow-sm">
                      <p>{message}</p>
                      <p className="mt-1 text-[11px] font-semibold text-white/70">Sent now</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-outline p-4">
                <div className="mb-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleCall(activeContact)}
                    className="inline-flex items-center justify-center gap-2 rounded-button border border-outline bg-white px-3 py-2 text-label font-bold text-navy transition-colors hover:bg-hover-light"
                  >
                    <Phone size={14} />
                    Call Tenant
                  </button>
                  <a
                    href={`sms:${activeContact.phone}`}
                    className="inline-flex items-center justify-center gap-2 rounded-button border border-outline bg-white px-3 py-2 text-label font-bold text-navy transition-colors hover:bg-hover-light"
                  >
                    <MessageSquare size={14} />
                    SMS
                  </a>
                </div>
                <form onSubmit={handleSendMessage} className="flex items-center gap-2 rounded-input border border-outline bg-white px-3 py-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary-100">
                  <input
                    value={chatDraft}
                    onChange={(event) => setChatDraft(event.target.value)}
                    placeholder="Type a message..."
                    className="h-9 min-w-0 flex-1 border-0 bg-transparent text-body text-text-primary outline-none placeholder:text-text-muted"
                  />
                  <button
                    type="submit"
                    disabled={!chatDraft.trim()}
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-full transition-colors',
                      chatDraft.trim()
                        ? 'bg-navy text-white hover:bg-slate-800'
                        : 'cursor-not-allowed bg-slate-100 text-text-muted'
                    )}
                    aria-label="Send message"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </section>
          </div>
        )}

        <footer className="mt-16 flex flex-col gap-4 border-t border-outline py-8 text-filter-label font-semibold uppercase tracking-wider text-text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>(c) 2024 RENTILO. The Curated Estate.</p>
          <div className="flex items-center gap-6">
            <button type="button" className="hover:text-navy">Privacy</button>
            <button type="button" className="hover:text-navy">Terms</button>
            <button type="button" className="hover:text-navy">Support</button>
            <button type="button" className="hover:text-navy">Contact</button>
          </div>
        </footer>
      </div>
    </div>
  )
}
