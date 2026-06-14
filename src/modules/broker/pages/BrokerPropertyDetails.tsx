import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Bath,
  BedDouble,
  Camera,
  ChevronRight,
  Eye,
  Image as ImageIcon,
  Mail,
  MapPin,
  MessageSquare,
  ParkingCircle,
  Pencil,
  Phone,
  PlayCircle,
  Plus,
  Ruler,
  Share2,
  ShieldCheck,
  Tag,
  Trash2,
  Waves,
  X,
} from 'lucide-react'
import { BrokerPropertyIntel } from '../components/BrokerPropertyIntel'
import {
  BROKER_ASSIGNED_PROPERTIES,
  getBrokerPropertyById,
} from '../constants/assignedProperties'
import { ROUTES } from '@shared/constants/routes'
import locationAerialImg from '@/assets/images/property_location_aerial.png'
import julianVaneImg from '@/assets/images/julian_vane_owner.png'
import sarahJenkinsImg from '@/assets/images/sarah_jenkins.png'
import brokerProfileImg from '@/assets/images/broker_profile.png'

type PropertyLead = {
  id: string
  propertyName: string
  name: string
  note: string
  image: string
  status: string
  lastAction: string
  phone: string
  email: string
  conversationId: string
}

type SeedPropertyLead = Omit<
  PropertyLead,
  'id' | 'propertyName' | 'phone' | 'email' | 'conversationId'
> &
  Partial<Pick<PropertyLead, 'phone' | 'email' | 'conversationId'>>

type LeadFormState = {
  propertyName: string
  name: string
  email: string
  phone: string
  note: string
  status: string
  lastAction: string
}

const defaultAssociatedLeads: SeedPropertyLead[] = [
  {
    name: 'Sarah Miller',
    note: 'Qualified - $1.9M Pre-approved',
    image: sarahJenkinsImg,
    status: 'Hot lead',
    lastAction: 'Viewing scheduled',
  },
  {
    name: 'Robert Blackstone',
    note: 'Pending ID - Cash Offer',
    image: brokerProfileImg,
    status: 'Follow-up',
    lastAction: 'Awaiting documents',
  },
]

const propertyLeadMap: Record<string, SeedPropertyLead[]> = {
  'skyline-plaza': [
    {
      name: 'Sarah Miller',
      note: 'Corporate tenant - 18 month lease interest',
      image: sarahJenkinsImg,
      status: 'Hot lead',
      lastAction: 'Viewing scheduled for Friday',
    },
    {
      name: 'Robert Blackstone',
      note: 'Executive relocation - budget approved',
      image: brokerProfileImg,
      status: 'Qualified',
      lastAction: 'Lease terms shared',
    },
    {
      name: 'Julian Thorne',
      note: 'Family tenant - wants concierge and parking',
      image: julianVaneImg,
      status: 'Follow-up',
      lastAction: 'Call back requested',
    },
  ],
  'harbor-residences': [
    {
      name: 'Eleonor Vance',
      note: 'Waterfront preference - move-in within 30 days',
      image: sarahJenkinsImg,
      status: 'New',
      lastAction: 'Brochure sent',
    },
    {
      name: 'Marcus Chen',
      note: 'Couple lead - asked for pet policy',
      image: brokerProfileImg,
      status: 'Contacted',
      lastAction: 'Pet approval pending',
    },
  ],
  'canary-wharf': [
    {
      name: 'Nisha Rao',
      note: 'Professional tenant - office commute priority',
      image: sarahJenkinsImg,
      status: 'Qualified',
      lastAction: 'Video tour completed',
    },
    {
      name: 'Daniel Brooks',
      note: 'Finance professional - immediate occupancy',
      image: brokerProfileImg,
      status: 'Hot lead',
      lastAction: 'Deposit discussion active',
    },
  ],
  'shoreditch-penthouse': [
    {
      name: 'Amelia Hart',
      note: 'Creative founder - rooftop terrace preference',
      image: sarahJenkinsImg,
      status: 'Hot lead',
      lastAction: 'Viewing scheduled',
    },
    {
      name: 'Oscar Flynn',
      note: 'Designer couple - needs work-from-home setup',
      image: brokerProfileImg,
      status: 'Follow-up',
      lastAction: 'Awaiting availability',
    },
  ],
  'greenwich-modern-home': [
    {
      name: 'Meera Iyer',
      note: 'Family tenant - school proximity required',
      image: sarahJenkinsImg,
      status: 'Qualified',
      lastAction: 'School details shared',
    },
    {
      name: 'Arjun Patel',
      note: 'Long-term lease interest - garage required',
      image: brokerProfileImg,
      status: 'Contacted',
      lastAction: 'Follow-up call tomorrow',
    },
  ],
}

const leadStatusOptions = ['Hot lead', 'Qualified', 'Follow-up', 'New', 'Contacted']

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const getLeadBadgeClass = (status: string) => {
  const normalized = status.toLowerCase()
  if (normalized.includes('hot')) return 'bg-red-50 text-red-600'
  if (normalized.includes('qualified')) return 'bg-emerald-50 text-emerald-700'
  if (normalized.includes('follow')) return 'bg-primary-50 text-primary'
  if (normalized.includes('contact')) return 'bg-amber-50 text-amber-700'
  return 'bg-slate-100 text-slate-600'
}

const buildPropertyLeads = (
  propertyId: string,
  propertyName: string,
  seedLeads: SeedPropertyLead[],
): PropertyLead[] =>
  seedLeads.map((lead, index) => {
    const slug = slugify(lead.name) || `lead-${index + 1}`
    return {
      ...lead,
      id: `${propertyId}-${slug}-${index + 1}`,
      propertyName,
      phone: lead.phone ?? `+1 212 555 01${String(index + 1).padStart(2, '0')}`,
      email: lead.email ?? `${slug}@example.com`,
      conversationId: lead.conversationId ?? `lead-${propertyId}-${slug}`,
    }
  })

const createEmptyLeadForm = (propertyName: string): LeadFormState => ({
  propertyName,
  name: '',
  email: '',
  phone: '',
  note: '',
  status: 'New',
  lastAction: 'Lead added manually',
})

const createLeadFormFromLead = (lead: PropertyLead): LeadFormState => ({
  propertyName: lead.propertyName,
  name: lead.name,
  email: lead.email,
  phone: lead.phone,
  note: lead.note,
  status: lead.status,
  lastAction: lead.lastAction,
})

const timeline = [
  {
    icon: Eye,
    title: 'Viewing Scheduled',
    meta: 'Sarah Miller - Oct 24, 2023 - 2:00 PM',
  },
  {
    icon: Tag,
    title: 'Price Updated',
    meta: 'Reduced by $50,000 - Oct 18, 2023',
  },
  {
    icon: Share2,
    title: 'Asset Listed',
    meta: 'Enterprise Suite Portal - Oct 12, 2023',
  },
]

const featureTiles = [
  { icon: ShieldCheck, label: 'Certified Energy Efficient' },
  { icon: ParkingCircle, label: '3-Car Heated Garage' },
  { icon: Waves, label: 'Indoor Infinity Pool' },
  { icon: ShieldCheck, label: 'Advanced Smart Security' },
]

function LeadManagementModal({
  propertyName,
  leads,
  onClose,
  onEdit,
  onRemove,
  onChat,
  onCall,
}: {
  propertyName: string
  leads: PropertyLead[]
  onClose: () => void
  onEdit: (lead: PropertyLead) => void
  onRemove: (leadId: string) => void
  onChat: (lead: PropertyLead) => void
  onCall: (leadId: string) => void
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-[#0f172a]/60 px-4 py-6 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="manage-leads-title"
        className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-card"
      >
        <div className="flex items-start justify-between gap-4 border-b border-outline px-6 py-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Associated Leads
            </p>
            <h2 id="manage-leads-title" className="mt-1 text-[24px] font-extrabold text-[#0f172a]">
              Manage Leads
            </h2>
            <p className="mt-1 text-[13px] text-text-muted">
              {leads.length} leads linked with {propertyName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-outline bg-white text-text-muted hover:bg-hover-light hover:text-[#0f172a]"
            aria-label="Close manage leads popup"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[68vh] overflow-y-auto p-6">
          {leads.length === 0 ? (
            <div className="rounded-xl border border-dashed border-outline bg-canvas px-6 py-12 text-center">
              <p className="text-[15px] font-bold text-[#0f172a]">No leads added yet</p>
              <p className="mt-1 text-[13px] text-text-muted">
                Add a new lead from the property card to start tracking interest.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-outline">
              <div className="grid grid-cols-[1.4fr_1fr_1fr_160px] gap-4 bg-slate-50 px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-text-muted">
                <span>Lead</span>
                <span>Property</span>
                <span>Status</span>
                <span className="text-right">Actions</span>
              </div>
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="grid grid-cols-[1.4fr_1fr_1fr_160px] items-center gap-4 border-t border-outline px-5 py-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <img src={lead.image} alt={lead.name} className="h-11 w-11 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-bold text-[#0f172a]">{lead.name}</p>
                      <p className="truncate text-[12px] text-text-muted">{lead.email}</p>
                      <p className="mt-1 truncate text-[12px] text-slate-500">{lead.note}</p>
                    </div>
                  </div>
                  <p className="text-[13px] font-semibold text-[#0f172a]">{lead.propertyName}</p>
                  <div>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-[10px] font-bold uppercase ${getLeadBadgeClass(lead.status)}`}
                    >
                      {lead.status}
                    </span>
                    <p className="mt-1 text-[11px] text-text-muted">{lead.lastAction}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onChat(lead)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-outline text-slate-600 hover:bg-hover-light hover:text-[#0f172a]"
                      aria-label={`Chat with ${lead.name}`}
                    >
                      <MessageSquare size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onCall(lead.id)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-outline text-slate-600 hover:bg-hover-light hover:text-[#0f172a]"
                      aria-label={`Call ${lead.name}`}
                    >
                      <Phone size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(lead)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-outline text-slate-600 hover:bg-hover-light hover:text-[#0f172a]"
                      aria-label={`Edit ${lead.name}`}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(lead.id)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-600 hover:bg-red-50"
                      aria-label={`Remove ${lead.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function LeadFormModal({
  mode,
  form,
  onChange,
  onSubmit,
  onClose,
}: {
  mode: 'add' | 'edit'
  form: LeadFormState
  onChange: (patch: Partial<LeadFormState>) => void
  onSubmit: () => void
  onClose: () => void
}) {
  const canSubmit = Boolean(form.name.trim() && form.email.trim() && form.phone.trim())

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-[#0f172a]/60 px-4 py-6 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-form-title"
        className="w-full max-w-2xl rounded-2xl bg-white shadow-card"
      >
        <div className="flex items-start justify-between gap-4 border-b border-outline px-6 py-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
              {mode === 'add' ? 'New Lead' : 'Edit Lead'}
            </p>
            <h2 id="lead-form-title" className="mt-1 text-[22px] font-extrabold text-[#0f172a]">
              {mode === 'add' ? 'Add New Lead' : 'Update Lead Details'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-outline bg-white text-text-muted hover:bg-hover-light hover:text-[#0f172a]"
            aria-label="Close lead form"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="mb-2 block text-[12px] font-bold uppercase tracking-wider text-text-muted">
              Property Name
            </span>
            <input
              value={form.propertyName}
              readOnly
              className="h-11 w-full rounded-xl border border-outline bg-slate-50 px-4 text-[14px] font-semibold text-[#0f172a]"
            />
          </label>

          <label>
            <span className="mb-2 block text-[12px] font-bold uppercase tracking-wider text-text-muted">
              Lead Name
            </span>
            <input
              value={form.name}
              onChange={(event) => onChange({ name: event.target.value })}
              placeholder="Example: Aisha Thomas"
              className="h-11 w-full rounded-xl border border-outline bg-white px-4 text-[14px] text-[#0f172a] outline-none placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label>
            <span className="mb-2 block text-[12px] font-bold uppercase tracking-wider text-text-muted">
              Status
            </span>
            <select
              value={form.status}
              onChange={(event) => onChange({ status: event.target.value })}
              className="h-11 w-full rounded-xl border border-outline bg-white px-4 text-[14px] font-semibold text-[#0f172a] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {leadStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-2 block text-[12px] font-bold uppercase tracking-wider text-text-muted">
              Email
            </span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => onChange({ email: event.target.value })}
              placeholder="lead@example.com"
              className="h-11 w-full rounded-xl border border-outline bg-white px-4 text-[14px] text-[#0f172a] outline-none placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label>
            <span className="mb-2 block text-[12px] font-bold uppercase tracking-wider text-text-muted">
              Phone
            </span>
            <input
              value={form.phone}
              onChange={(event) => onChange({ phone: event.target.value })}
              placeholder="+1 212 555 0199"
              className="h-11 w-full rounded-xl border border-outline bg-white px-4 text-[14px] text-[#0f172a] outline-none placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label className="sm:col-span-2">
            <span className="mb-2 block text-[12px] font-bold uppercase tracking-wider text-text-muted">
              Lead Details
            </span>
            <textarea
              value={form.note}
              onChange={(event) => onChange({ note: event.target.value })}
              rows={3}
              placeholder="Budget, tenant type, lease preference, document status..."
              className="w-full resize-none rounded-xl border border-outline bg-white px-4 py-3 text-[14px] leading-relaxed text-[#0f172a] outline-none placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label className="sm:col-span-2">
            <span className="mb-2 block text-[12px] font-bold uppercase tracking-wider text-text-muted">
              Last Action
            </span>
            <input
              value={form.lastAction}
              onChange={(event) => onChange({ lastAction: event.target.value })}
              placeholder="Example: Viewing requested for Friday"
              className="h-11 w-full rounded-xl border border-outline bg-white px-4 text-[14px] text-[#0f172a] outline-none placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-outline px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-lg border border-outline bg-white px-4 text-[13px] font-bold text-text-muted hover:bg-hover-light hover:text-[#0f172a]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0f172a] px-4 text-[13px] font-bold text-white hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={16} />
            {mode === 'add' ? 'Add Lead' : 'Save Changes'}
          </button>
        </div>
      </section>
    </div>
  )
}

export function BrokerPropertyDetails() {
  const navigate = useNavigate()
  const { propertyId } = useParams<{ propertyId: string }>()
  const property = getBrokerPropertyById(propertyId) ?? BROKER_ASSIGNED_PROPERTIES[0]!
  const gallery = property.gallery.length ? property.gallery : [property.image]
  const seedAssociatedLeads = propertyLeadMap[property.id] ?? defaultAssociatedLeads
  const [leads, setLeads] = useState<PropertyLead[]>(() =>
    buildPropertyLeads(property.id, property.name, seedAssociatedLeads)
  )
  const [openLeadActionId, setOpenLeadActionId] = useState<string | null>(null)
  const [manageLeadsOpen, setManageLeadsOpen] = useState(false)
  const [leadFormMode, setLeadFormMode] = useState<'add' | 'edit' | null>(null)
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null)
  const [leadForm, setLeadForm] = useState<LeadFormState>(() =>
    createEmptyLeadForm(property.name)
  )

  useEffect(() => {
    setLeads(buildPropertyLeads(property.id, property.name, propertyLeadMap[property.id] ?? defaultAssociatedLeads))
    setOpenLeadActionId(null)
    setManageLeadsOpen(false)
    setLeadFormMode(null)
    setEditingLeadId(null)
    setLeadForm(createEmptyLeadForm(property.name))
  }, [property.id, property.name])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 })
  }, [])

  const openAddLeadForm = () => {
    setEditingLeadId(null)
    setLeadForm(createEmptyLeadForm(property.name))
    setLeadFormMode('add')
  }

  const openEditLeadForm = (lead: PropertyLead) => {
    setEditingLeadId(lead.id)
    setLeadForm(createLeadFormFromLead(lead))
    setLeadFormMode('edit')
  }

  const closeLeadForm = () => {
    setLeadFormMode(null)
    setEditingLeadId(null)
    setLeadForm(createEmptyLeadForm(property.name))
  }

  const removeLead = (leadId: string) => {
    setLeads((current) => current.filter((lead) => lead.id !== leadId))
    setOpenLeadActionId((current) => (current === leadId ? null : current))
  }

  const callLead = (leadId: string) => {
    setLeads((current) =>
      current.map((lead) =>
        lead.id === leadId
          ? { ...lead, lastAction: `Call initiated at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` }
          : lead
      )
    )
    setOpenLeadActionId(null)
  }

  const chatWithLead = (lead: PropertyLead) => {
    setOpenLeadActionId(null)
    navigate(`${ROUTES.BROKER.MESSAGES}?conversation=${encodeURIComponent(lead.conversationId)}`, {
      state: {
        leadConversation: {
          id: lead.conversationId,
          leadName: lead.name,
          leadAvatar: lead.image,
          propertyId: property.id,
          propertyName: property.name,
          lastMessage: lead.lastAction,
          note: lead.note,
        },
      },
    })
  }

  const submitLeadForm = () => {
    if (!leadForm.name.trim() || !leadForm.email.trim() || !leadForm.phone.trim()) {
      return
    }

    if (leadFormMode === 'edit' && editingLeadId) {
      setLeads((current) =>
        current.map((lead) =>
          lead.id === editingLeadId
            ? {
                ...lead,
                propertyName: leadForm.propertyName,
                name: leadForm.name.trim(),
                email: leadForm.email.trim(),
                phone: leadForm.phone.trim(),
                note: leadForm.note.trim() || 'Lead details pending',
                status: leadForm.status,
                lastAction: leadForm.lastAction.trim() || 'Lead updated just now',
              }
            : lead
        )
      )
      closeLeadForm()
      return
    }

    const slug = slugify(leadForm.name) || `lead-${Date.now()}`
    const newLead: PropertyLead = {
      id: `${property.id}-${slug}-${Date.now()}`,
      propertyName: leadForm.propertyName,
      name: leadForm.name.trim(),
      email: leadForm.email.trim(),
      phone: leadForm.phone.trim(),
      note: leadForm.note.trim() || 'Lead details pending',
      image: brokerProfileImg,
      status: leadForm.status,
      lastAction: leadForm.lastAction.trim() || 'Lead added manually',
      conversationId: `lead-${property.id}-${slug}-${Date.now()}`,
    }
    setLeads((current) => [...current, newLead])
    closeLeadForm()
  }

  return (
    <div className="pb-10">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[clamp(30px,4vw,42px)] font-extrabold leading-none text-[#050505]">
            {property.name}
          </h1>
          <p className="mt-2 text-[15px] text-text-muted">{property.fullAddress}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex h-11 items-center gap-2 rounded-lg border border-outline bg-white px-4 text-[14px] font-semibold text-[#0f172a] hover:bg-hover-light">
            <Share2 size={17} />
            Share Asset
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row xl:items-start gap-6">
        <main className="flex-1 min-w-0 space-y-6">
          <section className="grid grid-cols-1 md:grid-cols-[1fr_152px] gap-3">
            <div className="relative min-h-[340px] overflow-hidden rounded-lg border border-outline bg-white md:min-h-[510px]">
              <img
                src={gallery[0]}
                alt={`${property.name} exterior`}
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-6 left-6 rounded-full bg-black px-5 py-2 text-[12px] font-bold text-white">
                Featured Exterior
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
              <div className="overflow-hidden rounded-lg border border-outline bg-white">
                <img
                  src={gallery[1] ?? gallery[0]}
                  alt={`${property.name} kitchen detail`}
                  className="h-full min-h-[160px] w-full object-cover md:min-h-[246px]"
                />
              </div>
              <div className="relative overflow-hidden rounded-lg border border-outline bg-white">
                <img
                  src={gallery[2] ?? gallery[0]}
                  alt={`${property.name} bedroom suite`}
                  className="h-full min-h-[160px] w-full object-cover md:min-h-[246px]"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 text-white">
                  <div className="text-center">
                    <ImageIcon size={25} className="mx-auto mb-1" />
                    <p className="text-[16px] font-medium">+14 more</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-2 divide-x divide-outline rounded-lg border border-outline bg-white p-6 sm:grid-cols-4">
            <div className="px-4 py-2">
              <p className="text-[15px] text-text-muted">Listing Price</p>
              <p className="mt-2 text-[25px] font-extrabold leading-tight text-black">{property.price}</p>
            </div>
            <div className="px-4 py-2">
              <p className="text-[15px] text-text-muted">Bedrooms</p>
              <p className="mt-4 flex items-end gap-3 text-[25px] font-extrabold text-black">
                <BedDouble size={21} className="mb-1 text-slate-600" />
                {property.beds} <span>Beds</span>
              </p>
            </div>
            <div className="px-4 py-2">
              <p className="text-[15px] text-text-muted">Bathrooms</p>
              <p className="mt-4 flex items-end gap-3 text-[25px] font-extrabold text-black">
                <Bath size={21} className="mb-1 text-slate-600" />
                {property.baths} <span>Baths</span>
              </p>
            </div>
            <div className="px-4 py-2">
              <p className="text-[15px] text-text-muted">Total Area</p>
              <p className="mt-4 flex items-end gap-3 text-[25px] font-extrabold text-black">
                <Ruler size={21} className="mb-1 text-slate-600" />
                {property.sqft} <span>sqft</span>
              </p>
            </div>
          </section>

          <section className="rounded-lg border border-outline bg-white p-8">
            <h2 className="text-[16px] font-semibold text-black">Asset Description</h2>
            <div className="mt-7 max-w-2xl space-y-3">
              {property.overview.map((paragraph) => (
                <p key={paragraph} className="text-[15px] leading-7 text-text-muted">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {featureTiles.map((feature) => {
                const Icon = feature.icon
                return (
                  <div key={feature.label} className="flex min-h-[78px] items-center gap-5 rounded bg-slate-50 px-5">
                    <Icon size={22} className="shrink-0 text-slate-600" />
                    <span className="text-[15px] text-[#222]">{feature.label}</span>
                  </div>
                )
              })}
            </div>
          </section>

          <BrokerPropertyIntel
            property={property}
            heading="Tenant-Visible Details"
          />

          <section className="pt-20">
            <h2 className="mb-7 text-[16px] font-semibold text-black">Virtual Tour &amp; Media</h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {[
                { src: gallery[1] ?? gallery[0], alt: `${property.name} private office view`, icon: ImageIcon },
                { src: gallery[2] ?? gallery[0], alt: `${property.name} media tour`, icon: PlayCircle },
                { src: gallery[3] ?? locationAerialImg, alt: `${property.name} evening terrace view`, icon: Camera },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.alt} className="relative aspect-[1.45] overflow-hidden rounded-lg border border-outline bg-white">
                    <img src={item.src} alt={item.alt} className="h-full w-full object-cover" />
                    <span className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-black/45 text-white">
                      <Icon size={22} />
                    </span>
                  </div>
                )
              })}
            </div>
          </section>
        </main>

        <aside className="w-full shrink-0 space-y-6 xl:w-[300px]">
          <section className="rounded-lg border border-outline bg-white p-6">
            <p className="text-[14px] uppercase text-text-muted">Primary Owner</p>
            <div className="mt-7 flex items-center gap-4">
              <img src={julianVaneImg} alt={property.ownerName} className="h-16 w-16 rounded-lg object-cover" />
              <div>
                <h2 className="text-[20px] font-extrabold leading-tight text-black">{property.ownerName}</h2>
                <span className="mt-1 inline-flex rounded bg-primary-100 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                  Primary Owner
                </span>
                <p className="mt-1 text-[12px] text-text-muted">Portfolio: 8 Assets</p>
              </div>
            </div>
            <button 
              onClick={() => {
                // Navigate to messages with owner conversation selected
                navigate(ROUTES.BROKER.MESSAGES, { 
                  state: { 
                    ownerName: property.ownerName,
                    propertyId: property.id 
                  } 
                })
              }}
              className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-black text-[14px] font-semibold text-white hover:bg-[#1f2937] transition-colors"
            >
              <Mail size={18} />
              Contact Owner
            </button>
            <button 
              onClick={() => navigate(ROUTES.OWNER.PORTFOLIO)}
              className="mt-4 h-12 w-full rounded-lg border border-outline bg-white text-[14px] font-semibold text-[#111] hover:bg-hover-light transition-colors"
            >
              View Owner Portfolio
            </button>
          </section>

          <section className="rounded-lg border border-outline bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[14px] uppercase leading-6 text-text-muted">Associated<br />Leads</p>
                <p className="mt-1 text-[12px] font-semibold text-[#111]">
                  {leads.length} leads for this property
                </p>
              </div>
              <button
                type="button"
                onClick={() => setManageLeadsOpen(true)}
                className="text-[12px] font-semibold text-slate-600 hover:text-[#0f172a]"
              >
                Manage Leads
              </button>
            </div>
            <div className="mt-8 space-y-7">
              {leads.length === 0 ? (
                <div className="rounded-lg border border-dashed border-outline bg-slate-50 px-4 py-5 text-center">
                  <p className="text-[12px] font-semibold text-text-muted">No leads added for this property.</p>
                </div>
              ) : (
                leads.map((lead) => (
                  <div key={lead.id} className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenLeadActionId((current) => (current === lead.id ? null : lead.id))
                      }
                      className="flex w-full items-center gap-4 text-left"
                      aria-expanded={openLeadActionId === lead.id}
                    >
                      <img src={lead.image} alt={lead.name} className="h-10 w-10 rounded-lg object-cover" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-semibold text-black">{lead.name}</span>
                        <span className="block text-[11px] leading-4 text-text-muted">{lead.note}</span>
                        <span
                          className={`mt-1 inline-flex rounded px-2 py-0.5 text-[10px] font-bold uppercase ${getLeadBadgeClass(lead.status)}`}
                        >
                          {lead.status}
                        </span>
                        <span className="mt-1 block text-[11px] leading-4 text-text-muted">
                          {lead.lastAction}
                        </span>
                      </span>
                      <ChevronRight
                        size={18}
                        className={`text-slate-700 transition-transform ${openLeadActionId === lead.id ? 'rotate-90' : ''}`}
                      />
                    </button>

                    {openLeadActionId === lead.id && (
                      <div className="absolute right-0 top-12 z-20 w-40 overflow-hidden rounded-xl border border-outline bg-white shadow-card">
                        <button
                          type="button"
                          onClick={() => chatWithLead(lead)}
                          className="flex w-full items-center gap-2 px-4 py-3 text-left text-[12px] font-bold text-[#0f172a] hover:bg-hover-light"
                        >
                          <MessageSquare size={15} />
                          Chat
                        </button>
                        <button
                          type="button"
                          onClick={() => callLead(lead.id)}
                          className="flex w-full items-center gap-2 border-t border-outline px-4 py-3 text-left text-[12px] font-bold text-[#0f172a] hover:bg-hover-light"
                        >
                          <Phone size={15} />
                          Call
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            <button
              type="button"
              onClick={openAddLeadForm}
              className="mt-8 inline-flex h-9 w-full items-center justify-center gap-2 rounded bg-slate-50 text-[12px] font-semibold text-[#333] hover:bg-slate-100"
            >
              <Plus size={14} />
              Add New Lead
            </button>
          </section>

          <section className="rounded-lg border border-outline bg-white p-6">
            <p className="text-[14px] uppercase leading-6 text-text-muted">Activity Timeline (Will See Later)</p>
            <div className="mt-7 space-y-6">
              {timeline.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <Icon size={17} className="text-[#111]" />
                      <span className="mt-2 h-12 w-px bg-outline last:hidden" />
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-black">{item.title}</p>
                      <p className="mt-1 text-[11px] leading-4 text-text-muted">{item.meta}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="relative aspect-[1.45] overflow-hidden rounded-lg border border-outline bg-white">
            <img src={locationAerialImg} alt="Asset location aerial" className="h-full w-full object-cover grayscale" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <span className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-[12px] font-bold text-white">
                <MapPin size={15} />
                Asset Location
              </span>
            </div>
          </section>
        </aside>
      </div>

      {manageLeadsOpen && (
        <LeadManagementModal
          propertyName={property.name}
          leads={leads}
          onClose={() => setManageLeadsOpen(false)}
          onEdit={openEditLeadForm}
          onRemove={removeLead}
          onChat={chatWithLead}
          onCall={callLead}
        />
      )}

      {leadFormMode && (
        <LeadFormModal
          mode={leadFormMode}
          form={leadForm}
          onChange={(patch) => setLeadForm((current) => ({ ...current, ...patch }))}
          onSubmit={submitLeadForm}
          onClose={closeLeadForm}
        />
      )}
    </div>
  )
}
