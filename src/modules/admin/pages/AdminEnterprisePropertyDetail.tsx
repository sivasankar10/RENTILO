import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  Grid3X3,
  Layers,
  MapPin,
  Pencil,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
  Filter,
} from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { ROUTES } from '@shared/constants/routes'
import { toast } from '../components/Toast'
import { exportToCsv } from '../utils/exportCsv'

interface Tenant {
  name: string
  flat: string
  leaseStart: string
  leaseEnd: string
  paymentStatus: PaymentStatus
}

interface FloorDetail {
  level: string
  config: string
  avgArea: string
  availability: string
  availableFlats: string
}

interface EnterpriseStats {
  propertyEvaluation: {
    value: string
    trend: string
    verifiedOn: string
  }
  totalCommission: {
    value: string
    period: string
    structure: string
  }
  brokersAssigned: {
    value: string
    tier: string
  }
}

type EditableStatCard = keyof EnterpriseStats
type PaymentStatus = 'PAID' | 'PENDING' | 'OVERDUE'
type TenantStatusFilter = PaymentStatus | 'ALL'

interface StructuralParameters {
  blocks: string
  blockDetail: string
  floors: string
  units: string
  occupancyPercent: string
  totalUnitCount: string
}

const emptyTenant: Tenant = {
  name: '',
  flat: '',
  leaseStart: '',
  leaseEnd: '',
  paymentStatus: 'PENDING',
}

const initialTenants: Tenant[] = [
  { name: 'Rajesh Malhotra', flat: 'A-1801', leaseStart: '15 Jan 2023', leaseEnd: '14 Jan 2025', paymentStatus: 'PAID' },
  { name: 'Sarah Jenkins', flat: 'C-1204', leaseStart: '01 Mar 2023', leaseEnd: '28 Feb 2024', paymentStatus: 'PENDING' },
  { name: 'TechSprint Solutions Ltd', flat: 'B-0402', leaseStart: '12 Nov 2022', leaseEnd: '11 Nov 2025', paymentStatus: 'OVERDUE' },
]

const initialFloorDetails: FloorDetail[] = [
  { level: 'Penthouse (18)', config: '4 BHK Luxury', avgArea: '4,200', availability: '2 / 8', availableFlats: '1011-2' },
  { level: 'Executive (12-17)', config: '3 BHK Premium', avgArea: '2,850', availability: '14 / 48', availableFlats: '1011-2' },
  { level: 'Standard (1-11)', config: '2 & 3 BHK', avgArea: '1,800', availability: '0 / 88', availableFlats: '1011-2' },
]

const paymentStatusColors: Record<string, string> = {
  PAID: 'bg-status-success-bg text-status-success-text',
  PENDING: 'bg-amber-50 text-amber-700',
  OVERDUE: 'bg-status-error-bg text-status-error-text',
}

const initialEnterpriseStats: EnterpriseStats = {
  propertyEvaluation: {
    value: '\u20b945.8Cr',
    trend: '+2.4% vs LY',
    verifiedOn: '12 Oct, 2023',
  },
  totalCommission: {
    value: '\u20b91.12Cr',
    period: 'Projected FY24',
    structure: 'Corporate Flat',
  },
  brokersAssigned: {
    value: '12',
    tier: 'TOP TIER',
  },
}

const initialStructuralParameters: StructuralParameters = {
  blocks: '04',
  blockDetail: 'A, B, C, D',
  floors: '18',
  units: '08',
  occupancyPercent: '82',
  totalUnitCount: '576',
}

type ReportExportRow = {
  section: string
  field: string
  value: string
  detail: string
}

function buildEnterprisePropertyReportRows(
  stats: EnterpriseStats,
  structure: StructuralParameters,
  tenants: Tenant[],
  floorDetails: FloorDetail[],
): ReportExportRow[] {
  const overviewRows: ReportExportRow[] = [
    { section: 'Overview', field: 'Property Name', value: 'Skyline Heights', detail: '' },
    { section: 'Overview', field: 'Building Name', value: 'Skyline Heights Phase II', detail: '' },
    { section: 'Overview', field: 'Property ID', value: 'ENT-BGL-55201', detail: '' },
    {
      section: 'Overview',
      field: 'Full Address',
      value: 'Plot No. 45-48, EPIP Zone, Whitefield Main Road',
      detail: 'Near Prestige Shantiniketan, Indiranagar Sub-division, Bengaluru, Karnataka 560066',
    },
    { section: 'Overview', field: 'Listing Status', value: 'Verified Listing', detail: '' },
  ]

  const statsRows: ReportExportRow[] = [
    {
      section: 'Financials',
      field: 'Property Evaluation',
      value: stats.propertyEvaluation.value,
      detail: `${stats.propertyEvaluation.trend} | Verified on ${stats.propertyEvaluation.verifiedOn}`,
    },
    {
      section: 'Financials',
      field: 'Total Commission',
      value: stats.totalCommission.value,
      detail: `${stats.totalCommission.period} | Structure: ${stats.totalCommission.structure}`,
    },
    {
      section: 'Operations',
      field: 'Brokers Assigned',
      value: stats.brokersAssigned.value,
      detail: stats.brokersAssigned.tier,
    },
    { section: 'Structure', field: 'Blocks', value: structure.blocks, detail: structure.blockDetail },
    { section: 'Structure', field: 'Floors', value: structure.floors, detail: '' },
    { section: 'Structure', field: 'Units', value: structure.units, detail: '' },
    {
      section: 'Structure',
      field: 'Inventory Occupancy',
      value: `${structure.occupancyPercent}%`,
      detail: `${structure.totalUnitCount} units across complex`,
    },
  ]

  const tenantRows: ReportExportRow[] = tenants.map((tenant) => ({
    section: 'Tenant Details',
    field: tenant.name,
    value: tenant.flat,
    detail: `${tenant.leaseStart} - ${tenant.leaseEnd} | ${tenant.paymentStatus}`,
  }))

  const floorRows: ReportExportRow[] = floorDetails.map((floor) => ({
    section: 'Floor Distribution',
    field: floor.level,
    value: floor.config,
    detail: `${floor.avgArea} sq.ft | Availability ${floor.availability} | Flats ${floor.availableFlats}`,
  }))

  return [...overviewRows, ...statsRows, ...tenantRows, ...floorRows]
}

export function AdminEnterprisePropertyDetail() {
  const navigate = useNavigate()
  const { propertyId } = useParams()
  const [stats, setStats] = useState<EnterpriseStats>(initialEnterpriseStats)
  const [draftStats, setDraftStats] = useState<EnterpriseStats>(initialEnterpriseStats)
  const [editingCard, setEditingCard] = useState<EditableStatCard | null>(null)
  const [structure, setStructure] = useState<StructuralParameters>(initialStructuralParameters)
  const [draftStructure, setDraftStructure] = useState<StructuralParameters>(initialStructuralParameters)
  const [editingStructure, setEditingStructure] = useState(false)
  const [savedTenants, setSavedTenants] = useState<Tenant[]>(initialTenants)
  const [draftTenants, setDraftTenants] = useState<Tenant[]>(initialTenants)
  const [tenantStatusFilter, setTenantStatusFilter] = useState<TenantStatusFilter>('ALL')
  const [showTenantFilter, setShowTenantFilter] = useState(false)
  const [showAddTenantForm, setShowAddTenantForm] = useState(false)
  const [newTenant, setNewTenant] = useState<Tenant>(emptyTenant)
  const [editingTenantIndex, setEditingTenantIndex] = useState<number | null>(null)
  const [savedFloorDetails, setSavedFloorDetails] = useState<FloorDetail[]>(initialFloorDetails)
  const [draftFloorDetails, setDraftFloorDetails] = useState<FloorDetail[]>(initialFloorDetails)
  const [editingFloorIndex, setEditingFloorIndex] = useState<number | null>(null)

  const brokerCount = Number.parseInt(draftStats.brokersAssigned.value, 10)
  const extraBrokerCount = Number.isFinite(brokerCount) ? Math.max(brokerCount - 3, 0) : 0
  const occupancyWidth = `${Math.min(Math.max(Number.parseInt(draftStructure.occupancyPercent, 10) || 0, 0), 100)}%`
  const filteredTenants = draftTenants
    .map((tenant, index) => ({ tenant, index }))
    .filter(({ tenant }) => tenantStatusFilter === 'ALL' || tenant.paymentStatus === tenantStatusFilter)

  const handleEditStat = (card: EditableStatCard) => {
    setEditingCard(card)
  }

  const handleCancelStatEdit = () => {
    setDraftStats(stats)
    setEditingCard(null)
  }

  const handleFinishStatEdit = () => {
    setEditingCard(null)
  }

  const handleSaveChanges = () => {
    if (
      editingCard ||
      editingStructure ||
      editingTenantIndex !== null ||
      editingFloorIndex !== null ||
      showAddTenantForm
    ) {
      toast.info('Finish editing first', 'Click Done in the open editor, then save the page changes.')
      return
    }

    setStats(draftStats)
    setStructure(draftStructure)
    setSavedTenants(draftTenants)
    setSavedFloorDetails(draftFloorDetails)
    toast.success('Enterprise property updated', 'All page changes have been saved.')
  }

  const setDraftStat = <
    Card extends EditableStatCard,
    Field extends keyof EnterpriseStats[Card],
  >(
    card: Card,
    field: Field,
    value: EnterpriseStats[Card][Field],
  ) => {
    setDraftStats((current) => ({
      ...current,
      [card]: {
        ...current[card],
        [field]: value,
      },
    }))
  }

  const handleCancelStructureEdit = () => {
    setDraftStructure(structure)
    setEditingStructure(false)
  }

  const setDraftStructureField = <Field extends keyof StructuralParameters>(
    field: Field,
    value: StructuralParameters[Field],
  ) => {
    setDraftStructure((current) => ({ ...current, [field]: value }))
  }

  const setTenantField = <Field extends keyof Tenant>(
    index: number,
    field: Field,
    value: Tenant[Field],
  ) => {
    setDraftTenants((current) =>
      current.map((tenant, tenantIndex) =>
        tenantIndex === index ? { ...tenant, [field]: value } : tenant
      )
    )
  }

  const setNewTenantField = <Field extends keyof Tenant>(field: Field, value: Tenant[Field]) => {
    setNewTenant((current) => ({ ...current, [field]: value }))
  }

  const handleAddTenant = () => {
    if (!newTenant.name.trim() || !newTenant.flat.trim()) {
      toast.error('Tenant details missing', 'Add a tenant name and flat number before saving the row.')
      return
    }

    setDraftTenants((current) => [...current, newTenant])
    setNewTenant(emptyTenant)
    setShowAddTenantForm(false)
    toast.info('Tenant added to draft', 'Click Save Changes when the page edits are complete.')
  }

  const handleCancelTenantEdit = (index: number) => {
    const savedTenant = savedTenants[index]
    setDraftTenants((current) =>
      savedTenant
        ? current.map((tenant, tenantIndex) => (tenantIndex === index ? savedTenant : tenant))
        : current.filter((_, tenantIndex) => tenantIndex !== index)
    )
    setEditingTenantIndex(null)
  }

  const handleDeleteTenant = (index: number) => {
    setDraftTenants((current) => current.filter((_, tenantIndex) => tenantIndex !== index))
    if (editingTenantIndex === index) {
      setEditingTenantIndex(null)
    }
    toast.info('Tenant removed from draft', 'Click Save Changes to finalize the deletion.')
  }

  const setFloorField = <Field extends keyof FloorDetail>(
    index: number,
    field: Field,
    value: FloorDetail[Field],
  ) => {
    setDraftFloorDetails((current) =>
      current.map((floor, floorIndex) =>
        floorIndex === index ? { ...floor, [field]: value } : floor
      )
    )
  }

  const handleCancelFloorEdit = (index: number) => {
    const savedFloor = savedFloorDetails[index]
    if (savedFloor) {
      setDraftFloorDetails((current) =>
        current.map((floor, floorIndex) => (floorIndex === index ? savedFloor : floor))
      )
    }
    setEditingFloorIndex(null)
  }

  const handleExportReport = () => {
    const filename = propertyId
      ? `enterprise-property-${propertyId}-report.csv`
      : 'enterprise-property-report.csv'

    exportToCsv(filename, buildEnterprisePropertyReportRows(stats, structure, savedTenants, savedFloorDetails), [
      { key: 'section', label: 'Section' },
      { key: 'field', label: 'Field' },
      { key: 'value', label: 'Value' },
      { key: 'detail', label: 'Detail' },
    ])
    toast.success('Export started', 'Property report downloaded as CSV.')
  }

  return (
    <div className="min-h-screen bg-canvas-alt px-2 py-6 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-heading-2 font-bold tracking-tight text-text-primary">
              Enterprise Property Overview
            </h1>
            <p className="mt-1 text-label text-text-muted">
              <button
                type="button"
                onClick={() => navigate(ROUTES.ADMIN.LISTING_MANAGEMENT)}
                className="hover:text-primary transition-colors"
              >
                Listings
              </button>
              {' > '}
              <span className="text-text-primary">Skyline Heights</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExportReport}
              className="inline-flex items-center gap-2 rounded-button border border-outline bg-white px-4 py-2.5 text-body font-medium text-text-primary shadow-sm hover:bg-hover-light transition-colors"
            >
              <Download size={16} />
              Export Report
            </button>
            <button
              type="button"
              onClick={handleSaveChanges}
              className="inline-flex items-center gap-2 rounded-button bg-primary px-4 py-2.5 text-body font-semibold text-white shadow-sm hover:bg-primary-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Top Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Property Evaluation */}
          <div className="rounded-card border border-outline bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-filter-label uppercase tracking-wider text-text-muted">
                Property Evaluation
              </p>
              <Building2 size={16} className="text-text-muted" />
            </div>
            {editingCard === 'propertyEvaluation' ? (
              <div className="mt-3 space-y-2">
                <label className="block">
                  <span className="text-filter-label uppercase tracking-wider text-text-muted">Evaluation Value</span>
                  <input
                    type="text"
                    value={draftStats.propertyEvaluation.value}
                    onChange={(event) => setDraftStat('propertyEvaluation', 'value', event.target.value)}
                    className="mt-1 w-full rounded-button border border-outline px-3 py-2 text-heading-3 font-bold text-text-primary focus:border-primary focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-filter-label uppercase tracking-wider text-text-muted">Yearly Change</span>
                  <input
                    type="text"
                    value={draftStats.propertyEvaluation.trend}
                    onChange={(event) => setDraftStat('propertyEvaluation', 'trend', event.target.value)}
                    className="mt-1 w-full rounded-button border border-outline px-3 py-2 text-label text-text-primary focus:border-primary focus:outline-none"
                  />
                </label>
              </div>
            ) : (
              <>
                <p className="mt-3 text-heading-2 font-bold text-text-primary">{draftStats.propertyEvaluation.value}</p>
                <p className="mt-1 text-label text-status-success">{draftStats.propertyEvaluation.trend}</p>
              </>
            )}
            <div className="mt-3 flex items-center justify-between">
              {editingCard === 'propertyEvaluation' ? (
                <label className="block min-w-0 flex-1">
                  <span className="text-filter-label uppercase tracking-wider text-text-muted">Verified Date</span>
                  <input
                    type="text"
                    value={draftStats.propertyEvaluation.verifiedOn}
                    onChange={(event) => setDraftStat('propertyEvaluation', 'verifiedOn', event.target.value)}
                    className="mt-1 w-full rounded-button border border-outline px-3 py-2 text-label text-text-primary focus:border-primary focus:outline-none"
                  />
                </label>
              ) : (
                <p className="text-label text-text-muted">Verified on {draftStats.propertyEvaluation.verifiedOn}</p>
              )}
              {editingCard === 'propertyEvaluation' ? (
                <div className="ml-2 flex items-center gap-2 self-end pb-2">
                  <button
                    type="button"
                    onClick={handleCancelStatEdit}
                    className="text-label font-semibold text-text-muted hover:text-primary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleFinishStatEdit}
                    className="rounded-button bg-primary px-3 py-1.5 text-label font-semibold text-white hover:bg-primary-700 transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleEditStat('propertyEvaluation')}
                  className="p-1 text-text-muted hover:text-primary transition-colors"
                  aria-label="Edit property evaluation"
                >
                  <Pencil size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Total Commission */}
          <div className="rounded-card border border-outline bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-filter-label uppercase tracking-wider text-text-muted">
                Total Commission
              </p>
              <span className="text-body text-text-muted">%</span>
            </div>
            {editingCard === 'totalCommission' ? (
              <div className="mt-3 space-y-2">
                <label className="block">
                  <span className="text-filter-label uppercase tracking-wider text-text-muted">Commission Value</span>
                  <input
                    type="text"
                    value={draftStats.totalCommission.value}
                    onChange={(event) => setDraftStat('totalCommission', 'value', event.target.value)}
                    className="mt-1 w-full rounded-button border border-outline px-3 py-2 text-heading-3 font-bold text-text-primary focus:border-primary focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-filter-label uppercase tracking-wider text-text-muted">Projection Period</span>
                  <input
                    type="text"
                    value={draftStats.totalCommission.period}
                    onChange={(event) => setDraftStat('totalCommission', 'period', event.target.value)}
                    className="mt-1 w-full rounded-button border border-outline px-3 py-2 text-label text-text-primary focus:border-primary focus:outline-none"
                  />
                </label>
              </div>
            ) : (
              <>
                <p className="mt-3 text-heading-2 font-bold text-text-primary">{draftStats.totalCommission.value}</p>
                <p className="mt-1 text-label text-text-muted">{draftStats.totalCommission.period}</p>
              </>
            )}
            <div className="mt-3 flex items-center justify-between">
              {editingCard === 'totalCommission' ? (
                <label className="block min-w-0 flex-1">
                  <span className="text-filter-label uppercase tracking-wider text-text-muted">Commission Structure</span>
                  <input
                    type="text"
                    value={draftStats.totalCommission.structure}
                    onChange={(event) => setDraftStat('totalCommission', 'structure', event.target.value)}
                    className="mt-1 w-full rounded-button border border-outline px-3 py-2 text-label text-text-primary focus:border-primary focus:outline-none"
                  />
                </label>
              ) : (
                <p className="text-label text-text-muted">Structure: {draftStats.totalCommission.structure}</p>
              )}
              {editingCard === 'totalCommission' ? (
                <div className="ml-2 flex items-center gap-2 self-end pb-2">
                  <button
                    type="button"
                    onClick={handleCancelStatEdit}
                    className="text-label font-semibold text-text-muted hover:text-primary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleFinishStatEdit}
                    className="rounded-button bg-primary px-3 py-1.5 text-label font-semibold text-white hover:bg-primary-700 transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleEditStat('totalCommission')}
                  className="p-1 text-text-muted hover:text-primary transition-colors"
                  aria-label="Edit total commission"
                >
                  <Pencil size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Brokers Assigned */}
          <div className="rounded-card border border-outline bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-filter-label uppercase tracking-wider text-text-muted">
                Brokers Assigned
              </p>
              <Users size={16} className="text-text-muted" />
            </div>
            {editingCard === 'brokersAssigned' ? (
              <div className="mt-3 grid grid-cols-[90px_1fr] gap-2">
                <label className="block">
                  <span className="text-filter-label uppercase tracking-wider text-text-muted">Count</span>
                  <input
                    type="number"
                    min="0"
                    value={draftStats.brokersAssigned.value}
                    onChange={(event) => setDraftStat('brokersAssigned', 'value', event.target.value)}
                    className="mt-1 w-full rounded-button border border-outline px-3 py-2 text-heading-3 font-bold text-text-primary focus:border-primary focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-filter-label uppercase tracking-wider text-text-muted">Broker Tier</span>
                  <input
                    type="text"
                    value={draftStats.brokersAssigned.tier}
                    onChange={(event) => setDraftStat('brokersAssigned', 'tier', event.target.value)}
                    className="mt-1 w-full rounded-button border border-outline px-3 py-2 text-label font-bold text-text-primary focus:border-primary focus:outline-none"
                  />
                </label>
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-3">
                <p className="text-heading-2 font-bold text-text-primary">{draftStats.brokersAssigned.value}</p>
                <span className="rounded-pill bg-status-error-bg px-2.5 py-0.5 text-badge font-bold text-status-error-text">
                  {draftStats.brokersAssigned.tier}
                </span>
              </div>
            )}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-300 text-[9px] font-bold text-slate-600"
                  >
                    {i}
                  </div>
                ))}
                {extraBrokerCount > 0 && (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[9px] font-bold text-slate-500">
                    +{extraBrokerCount}
                  </div>
                )}
              </div>
              {editingCard === 'brokersAssigned' ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCancelStatEdit}
                    className="text-label font-semibold text-text-muted hover:text-primary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleFinishStatEdit}
                    className="rounded-button bg-primary px-3 py-1.5 text-label font-semibold text-white hover:bg-primary-700 transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleEditStat('brokersAssigned')}
                  className="p-1 text-text-muted hover:text-primary transition-colors"
                  aria-label="Edit brokers assigned"
                >
                  <Pencil size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Address & Location + Structural Parameters */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Address & Location */}
          <div className="rounded-card border border-outline bg-white p-6 shadow-surface">
            <div className="flex items-center justify-between">
              <h2 className="text-heading-3 font-bold text-text-primary">Address & Location</h2>
              <span className="inline-flex items-center gap-1.5 text-label font-semibold text-status-success">
                <ShieldCheck size={14} />
                Verified Listing
              </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-filter-label uppercase tracking-wider text-text-muted">Building Name</p>
                <p className="mt-1 text-body font-semibold text-text-primary">Skyline Heights Phase II</p>
              </div>
              <div>
                <p className="text-filter-label uppercase tracking-wider text-text-muted">Property ID</p>
                <p className="mt-1 text-body font-semibold text-text-primary">ENT-BGL-55201</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-filter-label uppercase tracking-wider text-text-muted">Full Address</p>
              <p className="mt-1 text-body leading-6 text-text-primary">
                Plot No. 45-48, EPIP Zone, Whitefield Main Road,
                <br />
                Near Prestige Shantiniketan, Indiranagar Sub-division,
                <br />
                Bengaluru, Karnataka 560066
              </p>
            </div>

            {/* Map placeholder */}
            <div className="mt-5 relative h-48 rounded-button bg-slate-200 overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=60')] bg-cover bg-center opacity-70" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy/80 text-white">
                  <MapPin size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* Structural Parameters */}
          <div className="rounded-card border border-outline bg-white p-6 shadow-surface">
            <div className="flex items-center justify-between">
              <h2 className="text-heading-3 font-bold text-text-primary">Structural Parameters</h2>
              {editingStructure ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCancelStructureEdit}
                    className="text-label font-semibold text-text-muted hover:text-primary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingStructure(false)}
                    className="rounded-button bg-primary px-3 py-1.5 text-label font-semibold text-white hover:bg-primary-700 transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditingStructure(true)}
                  className="p-1.5 text-text-muted hover:text-primary transition-colors"
                  aria-label="Edit structural parameters"
                >
                  <Edit size={16} />
                </button>
              )}
            </div>

            {editingStructure ? (
              <div className="mt-6 space-y-3">
                <label className="block">
                  <span className="text-filter-label uppercase tracking-wider text-text-muted">Blocks</span>
                  <input
                    type="text"
                    value={draftStructure.blocks}
                    onChange={(event) => setDraftStructureField('blocks', event.target.value)}
                    className="mt-1 w-full rounded-button border border-outline px-3 py-2 text-body font-semibold text-text-primary focus:border-primary focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-filter-label uppercase tracking-wider text-text-muted">Block Names</span>
                  <input
                    type="text"
                    value={draftStructure.blockDetail}
                    onChange={(event) => setDraftStructureField('blockDetail', event.target.value)}
                    className="mt-1 w-full rounded-button border border-outline px-3 py-2 text-body text-text-primary focus:border-primary focus:outline-none"
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-filter-label uppercase tracking-wider text-text-muted">Floors</span>
                    <input
                      type="text"
                      value={draftStructure.floors}
                      onChange={(event) => setDraftStructureField('floors', event.target.value)}
                      className="mt-1 w-full rounded-button border border-outline px-3 py-2 text-body font-semibold text-text-primary focus:border-primary focus:outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-filter-label uppercase tracking-wider text-text-muted">Units</span>
                    <input
                      type="text"
                      value={draftStructure.units}
                      onChange={(event) => setDraftStructureField('units', event.target.value)}
                      className="mt-1 w-full rounded-button border border-outline px-3 py-2 text-body font-semibold text-text-primary focus:border-primary focus:outline-none"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-filter-label uppercase tracking-wider text-text-muted">Occupancy %</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={draftStructure.occupancyPercent}
                      onChange={(event) => setDraftStructureField('occupancyPercent', event.target.value)}
                      className="mt-1 w-full rounded-button border border-outline px-3 py-2 text-body font-semibold text-text-primary focus:border-primary focus:outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-filter-label uppercase tracking-wider text-text-muted">Total Units</span>
                    <input
                      type="text"
                      value={draftStructure.totalUnitCount}
                      onChange={(event) => setDraftStructureField('totalUnitCount', event.target.value)}
                      className="mt-1 w-full rounded-button border border-outline px-3 py-2 text-body font-semibold text-text-primary focus:border-primary focus:outline-none"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div className="mt-6 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-button bg-canvas-alt">
                    <Building2 size={18} className="text-text-primary" />
                  </div>
                  <div>
                    <p className="text-heading-3 font-bold text-text-primary">{draftStructure.blocks}</p>
                    <p className="text-label text-text-muted">Blocks ({draftStructure.blockDetail})</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-button bg-canvas-alt">
                    <Layers size={18} className="text-text-primary" />
                  </div>
                  <div>
                    <p className="text-heading-3 font-bold text-text-primary">{draftStructure.floors}</p>
                    <p className="text-label text-text-muted">Floors</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-button bg-canvas-alt">
                    <Grid3X3 size={18} className="text-text-primary" />
                  </div>
                  <div>
                    <p className="text-heading-3 font-bold text-text-primary">{draftStructure.units}</p>
                    <p className="text-label text-text-muted">Units</p>
                  </div>
                </div>
              </div>
            )}

            {/* Inventory Occupancy */}
            <div className="mt-6 border-t border-outline pt-5">
              <div className="flex items-center justify-between">
                <p className="text-filter-label uppercase tracking-wider text-text-muted">
                  Inventory Occupancy
                </p>
                <p className="text-body font-bold text-primary">{draftStructure.occupancyPercent}%</p>
              </div>
              <div className="mt-2 h-2 rounded-pill bg-slate-100">
                <div className="h-full rounded-pill bg-primary" style={{ width: occupancyWidth }} />
              </div>
              <p className="mt-3 text-label text-text-muted">
                Total unit count: {draftStructure.totalUnitCount} units across complex.
              </p>
            </div>
          </div>
        </div>

        {/* Tenant Details */}
        <div className="rounded-card border border-outline bg-white shadow-surface overflow-hidden">
          <div className="flex items-center justify-between border-b border-outline px-6 py-4">
            <h2 className="text-heading-3 font-bold text-text-primary">Tenant Details</h2>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowTenantFilter((current) => !current)}
                className="inline-flex items-center gap-1.5 rounded-button border border-outline px-3 py-2 text-label font-medium text-text-muted hover:bg-hover-light transition-colors"
              >
                <Filter size={14} />
                {tenantStatusFilter === 'ALL' ? 'Filter' : tenantStatusFilter}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddTenantForm(true)
                  setEditingTenantIndex(null)
                }}
                className="inline-flex items-center gap-1.5 rounded-button bg-navy px-3 py-2 text-label font-semibold text-white hover:bg-slate-800 transition-colors"
              >
                <UserPlus size={14} />
                Add Tenant
              </button>
            </div>
          </div>
          {showTenantFilter && (
            <div className="flex flex-wrap items-center gap-2 border-b border-outline bg-canvas-alt px-6 py-3">
              {(['ALL', 'PAID', 'PENDING', 'OVERDUE'] as TenantStatusFilter[]).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setTenantStatusFilter(status)}
                  className={cn(
                    'rounded-button border px-3 py-1.5 text-label font-semibold transition-colors',
                    tenantStatusFilter === status
                      ? 'border-primary bg-primary text-white'
                      : 'border-outline bg-white text-text-muted hover:bg-hover-light',
                  )}
                >
                  {status === 'ALL' ? 'All Statuses' : status}
                </button>
              ))}
            </div>
          )}
          {showAddTenantForm && (
            <div className="grid gap-3 border-b border-outline bg-canvas-alt px-6 py-4 md:grid-cols-[1.4fr_0.8fr_0.9fr_0.9fr_0.9fr_auto]">
              <input
                type="text"
                value={newTenant.name}
                onChange={(event) => setNewTenantField('name', event.target.value)}
                placeholder="Tenant name"
                className="rounded-button border border-outline px-3 py-2 text-body text-text-primary focus:border-primary focus:outline-none"
              />
              <input
                type="text"
                value={newTenant.flat}
                onChange={(event) => setNewTenantField('flat', event.target.value)}
                placeholder="Flat no."
                className="rounded-button border border-outline px-3 py-2 text-body text-text-primary focus:border-primary focus:outline-none"
              />
              <input
                type="text"
                value={newTenant.leaseStart}
                onChange={(event) => setNewTenantField('leaseStart', event.target.value)}
                placeholder="Lease start"
                className="rounded-button border border-outline px-3 py-2 text-body text-text-primary focus:border-primary focus:outline-none"
              />
              <input
                type="text"
                value={newTenant.leaseEnd}
                onChange={(event) => setNewTenantField('leaseEnd', event.target.value)}
                placeholder="Lease end"
                className="rounded-button border border-outline px-3 py-2 text-body text-text-primary focus:border-primary focus:outline-none"
              />
              <select
                value={newTenant.paymentStatus}
                onChange={(event) => setNewTenantField('paymentStatus', event.target.value as PaymentStatus)}
                className="rounded-button border border-outline px-3 py-2 text-body text-text-primary focus:border-primary focus:outline-none"
              >
                <option value="PAID">PAID</option>
                <option value="PENDING">PENDING</option>
                <option value="OVERDUE">OVERDUE</option>
              </select>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setNewTenant(emptyTenant)
                    setShowAddTenantForm(false)
                  }}
                  className="text-label font-semibold text-text-muted hover:text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddTenant}
                  className="rounded-button bg-primary px-3 py-2 text-label font-semibold text-white hover:bg-primary-700 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline">
                  <th className="px-6 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    Tenant Name
                  </th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    Flat No.
                  </th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    Lease Start
                  </th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    Lease End
                  </th>
                  <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">
                    Payment Status
                  </th>
                  <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTenants.map(({ tenant, index }) => (
                  <tr
                    key={`${tenant.flat}-${index}`}
                    className="border-b border-outline last:border-0 hover:bg-hover-light transition-colors"
                  >
                    <td className="px-6 py-4">
                      {editingTenantIndex === index ? (
                        <input
                          type="text"
                          value={tenant.name}
                          onChange={(event) => setTenantField(index, 'name', event.target.value)}
                          className="w-full min-w-44 rounded-button border border-outline px-3 py-1.5 text-body font-medium text-text-primary focus:border-primary focus:outline-none"
                        />
                      ) : (
                        <span className="inline-block rounded-button border border-outline px-3 py-1.5 text-body font-medium text-text-primary">
                          {tenant.name}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {editingTenantIndex === index ? (
                        <input
                          type="text"
                          value={tenant.flat}
                          onChange={(event) => setTenantField(index, 'flat', event.target.value)}
                          className="w-28 rounded-button border border-outline px-3 py-1.5 text-body text-text-primary focus:border-primary focus:outline-none"
                        />
                      ) : (
                        <span className="inline-block rounded-button border border-outline px-3 py-1.5 text-body text-text-primary">
                          {tenant.flat}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {editingTenantIndex === index ? (
                        <input
                          type="text"
                          value={tenant.leaseStart}
                          onChange={(event) => setTenantField(index, 'leaseStart', event.target.value)}
                          className="w-32 rounded-button border border-outline px-3 py-1.5 text-label text-text-primary focus:border-primary focus:outline-none"
                        />
                      ) : (
                        <span className="inline-block rounded-button border border-outline px-3 py-1.5 text-label text-text-primary">
                          {tenant.leaseStart}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {editingTenantIndex === index ? (
                        <input
                          type="text"
                          value={tenant.leaseEnd}
                          onChange={(event) => setTenantField(index, 'leaseEnd', event.target.value)}
                          className="w-32 rounded-button border border-outline px-3 py-1.5 text-label text-text-primary focus:border-primary focus:outline-none"
                        />
                      ) : (
                        <span className="inline-block rounded-button border border-outline px-3 py-1.5 text-label text-text-primary">
                          {tenant.leaseEnd}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {editingTenantIndex === index ? (
                        <select
                          value={tenant.paymentStatus}
                          onChange={(event) => setTenantField(index, 'paymentStatus', event.target.value as PaymentStatus)}
                          className="rounded-button border border-outline px-3 py-1.5 text-label font-semibold text-text-primary focus:border-primary focus:outline-none"
                        >
                          <option value="PAID">PAID</option>
                          <option value="PENDING">PENDING</option>
                          <option value="OVERDUE">OVERDUE</option>
                        </select>
                      ) : (
                        <span
                          className={cn(
                            'inline-block rounded-pill px-3 py-1 text-badge font-bold',
                            paymentStatusColors[tenant.paymentStatus],
                          )}
                        >
                          {tenant.paymentStatus}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {editingTenantIndex === index ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleCancelTenantEdit(index)}
                              className="text-label font-semibold text-text-muted hover:text-primary transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingTenantIndex(null)}
                              className="rounded-button bg-primary px-3 py-1.5 text-label font-semibold text-white hover:bg-primary-700 transition-colors"
                            >
                              Done
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingTenantIndex(index)
                              setShowAddTenantForm(false)
                            }}
                            className="p-1.5 rounded-button text-text-muted hover:text-primary hover:bg-hover-light transition-colors"
                            aria-label={`Edit ${tenant.name}`}
                          >
                            <Pencil size={14} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteTenant(index)}
                          className="p-1.5 rounded-button text-text-muted hover:text-status-error hover:bg-status-error-bg transition-colors"
                          aria-label={`Delete ${tenant.name}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-outline px-6 py-4">
            <p className="text-label text-text-muted">
              Showing {filteredTenants.length} of {draftTenants.length} tenants
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-button text-text-muted hover:bg-hover-light transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-button text-text-muted hover:bg-hover-light transition-colors"
                aria-label="Next"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Floor Distribution Details */}
        <div className="rounded-card border border-outline bg-white shadow-surface overflow-hidden">
          <div className="flex items-center justify-between border-b border-outline px-6 py-4">
            <h2 className="text-heading-3 font-bold text-text-primary">Floor Distribution Details</h2>
            <button
              type="button"
              className="text-label font-semibold text-primary hover:text-primary-700 transition-colors"
            >
              View All Units
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline">
                  <th className="px-6 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    Floor Level
                  </th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    Unit Configuration
                  </th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    Avg. Area (Sq.Ft)
                  </th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    Availability
                  </th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    Available Flats
                  </th>
                  <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">
                    Edit
                  </th>
                </tr>
              </thead>
              <tbody>
                {draftFloorDetails.map((floor, index) => (
                  <tr
                    key={`${floor.level}-${index}`}
                    className="border-b border-outline last:border-0 hover:bg-hover-light transition-colors"
                  >
                    <td className="px-6 py-4">
                      {editingFloorIndex === index ? (
                        <input
                          type="text"
                          value={floor.level}
                          onChange={(event) => setFloorField(index, 'level', event.target.value)}
                          className="w-full min-w-40 rounded-button border border-outline px-3 py-1.5 text-body font-medium text-text-primary focus:border-primary focus:outline-none"
                        />
                      ) : (
                        <span className="inline-block rounded-button border border-outline px-3 py-1.5 text-body font-medium text-text-primary">
                          {floor.level}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {editingFloorIndex === index ? (
                        <input
                          type="text"
                          value={floor.config}
                          onChange={(event) => setFloorField(index, 'config', event.target.value)}
                          className="w-full min-w-36 rounded-button border border-outline px-3 py-1.5 text-body text-text-primary focus:border-primary focus:outline-none"
                        />
                      ) : (
                        <span className="inline-block rounded-button border border-outline px-3 py-1.5 text-body text-text-primary">
                          {floor.config}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {editingFloorIndex === index ? (
                        <input
                          type="text"
                          value={floor.avgArea}
                          onChange={(event) => setFloorField(index, 'avgArea', event.target.value)}
                          className="w-28 rounded-button border border-outline px-3 py-1.5 text-body text-text-primary focus:border-primary focus:outline-none"
                        />
                      ) : (
                        <span className="inline-block rounded-button border border-outline px-3 py-1.5 text-body text-text-primary">
                          {floor.avgArea}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {editingFloorIndex === index ? (
                        <input
                          type="text"
                          value={floor.availability}
                          onChange={(event) => setFloorField(index, 'availability', event.target.value)}
                          className="w-28 rounded-button border border-outline px-3 py-1.5 text-body text-text-primary focus:border-primary focus:outline-none"
                        />
                      ) : (
                        <span className="inline-block rounded-button border border-outline px-3 py-1.5 text-body text-text-primary">
                          {floor.availability}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {editingFloorIndex === index ? (
                        <input
                          type="text"
                          value={floor.availableFlats}
                          onChange={(event) => setFloorField(index, 'availableFlats', event.target.value)}
                          className="w-32 rounded-button border border-outline px-3 py-1.5 text-body text-text-primary focus:border-primary focus:outline-none"
                        />
                      ) : (
                        <span className="inline-block rounded-button border border-outline px-3 py-1.5 text-body text-text-primary">
                          {floor.availableFlats}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {editingFloorIndex === index ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCancelFloorEdit(index)}
                            className="text-label font-semibold text-text-muted hover:text-primary transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingFloorIndex(null)}
                            className="rounded-button bg-primary px-3 py-1.5 text-label font-semibold text-white hover:bg-primary-700 transition-colors"
                          >
                            Done
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setEditingFloorIndex(index)}
                          className="p-1.5 rounded-button text-text-muted hover:text-primary hover:bg-hover-light transition-colors"
                          aria-label={`Edit ${floor.level}`}
                        >
                          <Pencil size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
