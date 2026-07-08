import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AlertTriangle, Building2, CheckCircle2, Download, Eye, Home, Plus, Search, Trash2, TrendingUp, UserCheck, X } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { useAdminStore, type AdminBroker } from '../store/adminStore'
import { usePrototypeStore } from '@shared/store/prototypeStore'
import { ActionMenu } from '../components/ActionMenu'
import { toast } from '../components/Toast'
import { exportToCsv } from '../utils/exportCsv'

interface EnterpriseProperty {
  image: string
  name: string
  type: string
  organization: string
  valuation: string
  location: string
  brokerStatus: string
  statusColor: string
}

interface StandardProperty {
  id: string
  image: string
  name: string
  type: string
  ownerType: string
  rentPrice: string
  location: string
  status: string
  statusColor: string
}

interface EnterpriseAssignmentRow {
  id: string
  propertyName: string
  block: string
  floor: string
  commission: string
  assignedBrokerId?: string
}

interface StandardAssignmentRow {
  id: string
  propertyName: string
  commission: string
  assignedBrokerId?: string
}

interface AssignmentExportRow {
  queue: string
  propertyName: string
  propertyType: string
  organizationOrOwner: string
  valueOrRent: string
  location: string
  status: string
}

const enterpriseQueue: EnterpriseProperty[] = [
  {
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=120&q=80',
    name: 'Vertex Plaza South',
    type: 'Commercial Office',
    organization: 'Nexus Holding Corp',
    valuation: '$42.5M',
    location: 'London, Canary Wharf',
    brokerStatus: 'Awaiting Review',
    statusColor: 'bg-amber-50 text-amber-700',
  },
  {
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=120&q=80',
    name: 'The Meridian Atrium',
    type: 'Mixed Use Retail',
    organization: 'Global Retail Partners',
    valuation: '$18.2M',
    location: 'New York, Hudson Yards',
    brokerStatus: 'Active Inquiry',
    statusColor: 'bg-primary-100 text-primary',
  },
]

function createInitialEnterpriseRows(property: EnterpriseProperty): EnterpriseAssignmentRow[] {
  return [
    {
      id: `${property.name}-a1-04-402`,
      propertyName: `${property.name} - Unit 402`,
      block: 'A1',
      floor: '04',
      commission: '50',
    },
    {
      id: `${property.name}-a1-04-405`,
      propertyName: `${property.name} - Unit 405`,
      block: 'A1',
      floor: '04',
      commission: '50',
    },
    {
      id: `${property.name}-a1-04-410`,
      propertyName: `${property.name} - Unit 410`,
      block: 'A1',
      floor: '04',
      commission: '50',
    },
  ]
}

function createInitialStandardRows(property: StandardProperty): StandardAssignmentRow[] {
  return [
    {
      id: `${property.name}-primary`,
      propertyName: property.name,
      commission: '50',
    },
  ]
}

export function AdminAssignmentManagement() {
  const navigate = useNavigate()
  const brokers = useAdminStore((state) => state.brokers)
  const properties = usePrototypeStore((state) => state.properties)
  const users = usePrototypeStore((state) => state.users)
  const assignments = usePrototypeStore((state) => state.brokerAssignments)
  const assignBrokerToProperty = usePrototypeStore((state) => state.assignBroker)
  const adminRequests = usePrototypeStore((state) => state.adminRequests)
  const standardQueue: StandardProperty[] = properties
    .map((property) => {
      const owner = users.find((user) => user.id === property.ownerId)
      const activeAssignment = assignments.find(
        (a) => a.propertyId === property.id && a.status === 'Active',
      )
      const pendingRequest = adminRequests.find(
        (r) => r.propertyId === property.id && r.type === 'broker_listing_access' && r.status === 'Pending',
      )
      const status = activeAssignment ? 'Assigned' : pendingRequest ? 'Processing' : 'Unassigned'
      const statusColor = activeAssignment
        ? 'bg-green-50 text-green-700'
        : pendingRequest
          ? 'bg-amber-50 text-amber-700'
          : 'bg-slate-100 text-slate-600'
      return {
        id: property.id,
        image: property.image,
        name: property.title,
        type: property.propertyType,
        ownerType: owner?.accountName ?? 'Property Owner',
        rentPrice: property.price,
        location: `${property.neighborhood}, ${property.city}`,
        status,
        statusColor,
      }
    })
  const [searchParams, setSearchParams] = useSearchParams()
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [standardAssignModalOpen, setStandardAssignModalOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<EnterpriseProperty | null>(null)
  const [selectedStandardProperty, setSelectedStandardProperty] = useState<StandardProperty | null>(null)
  const [enterprisePage, setEnterprisePage] = useState(1)
  const [standardPage, setStandardPage] = useState(1)
  const ITEMS_PER_PAGE = 5
  const [enterpriseAssignments, setEnterpriseAssignments] = useState<Record<string, EnterpriseAssignmentRow[]>>(
    () =>
      Object.fromEntries(
        enterpriseQueue.map((property) => [property.name, createInitialEnterpriseRows(property)])
      )
  )
  const [standardAssignments, setStandardAssignments] = useState<Record<string, StandardAssignmentRow[]>>(
    () =>
      Object.fromEntries(
        standardQueue.map((property) => [property.name, createInitialStandardRows(property)])
      )
  )

  // Auto-open assign modal when navigated from broker management queue
  useEffect(() => {
    const assignName = searchParams.get('assign')
    const assignType = searchParams.get('type')
    if (!assignName) return

    if (assignType === 'enterprise') {
      const match = enterpriseQueue.find((p) => p.name === assignName)
      if (match) {
        setSelectedProperty(match)
        setAssignModalOpen(true)
      }
    } else {
      const match = standardQueue.find((p) => p.name === assignName)
      if (match) {
        setSelectedStandardProperty(match)
        setStandardAssignModalOpen(true)
      }
    }
    // Clear query params after consuming them
    setSearchParams({}, { replace: true })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAssignClick = (property: EnterpriseProperty) => {
    setSelectedProperty(property)
    setAssignModalOpen(true)
  }

  const handleStandardAssignClick = (property: StandardProperty) => {
    setSelectedStandardProperty(property)
    setStandardAssignModalOpen(true)
  }

  const handleExportCsv = () => {
    const rows: AssignmentExportRow[] = [
      ...enterpriseQueue.map((property) => ({
        queue: 'Enterprise',
        propertyName: property.name,
        propertyType: property.type,
        organizationOrOwner: property.organization,
        valueOrRent: property.valuation,
        location: property.location,
        status: property.brokerStatus,
      })),
      ...standardQueue.map((property) => ({
        queue: 'Non-Enterprise',
        propertyName: property.name,
        propertyType: property.type,
        organizationOrOwner: property.ownerType,
        valueOrRent: property.rentPrice,
        location: property.location,
        status: property.status,
      })),
    ]

    exportToCsv('assignment-queue.csv', rows, [
      { key: 'queue', label: 'Queue' },
      { key: 'propertyName', label: 'Property Name' },
      { key: 'propertyType', label: 'Property Type' },
      { key: 'organizationOrOwner', label: 'Organization / Owner' },
      { key: 'valueOrRent', label: 'Value / Rent' },
      { key: 'location', label: 'Location' },
      { key: 'status', label: 'Status' },
    ])
    toast.success('Export started', `${rows.length} assignment records downloaded.`)
  }

  return (
    <div className="min-h-screen bg-canvas-alt px-2 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-heading-1 font-bold tracking-tight text-text-primary">
            Assignment Management
          </h1>
          <p className="mt-1 text-body text-text-muted">
            Review and distribute properties to specialized brokers across portfolios.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex items-center gap-4 rounded-card border border-outline bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-button bg-navy">
              <Building2 size={22} className="text-white" />
            </div>
            <div>
              <p className="text-filter-label uppercase tracking-wider text-text-muted">
                Total Enterprise Queue
              </p>
              <p className="mt-1 text-[36px] font-bold leading-none tracking-tight text-text-primary">
                124
              </p>
              <p className="mt-1.5 flex items-center gap-1 text-label text-text-muted">
                <TrendingUp size={12} />
                12% from last week
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-card border border-outline bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-button bg-navy">
              <Home size={22} className="text-white" />
            </div>
            <div>
              <p className="text-filter-label uppercase tracking-wider text-text-muted">
                Total Standard Queue
              </p>
              <p className="mt-1 text-[36px] font-bold leading-none tracking-tight text-text-primary">
                452
              </p>
              <p className="mt-1.5 flex items-center gap-1 text-label text-status-error">
                <AlertTriangle size={12} />
                High Volume Alert
              </p>
            </div>
          </div>
        </div>

        {/* Enterprise Assignment Queue */}
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-heading-3 font-bold text-text-primary">
                <span className="h-2.5 w-2.5 rounded-full bg-text-primary" />
                Enterprise Assignment Queue
              </h2>
              <p className="mt-1 text-label text-text-muted">
                High-value commercial assets requiring senior brokerage teams.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleExportCsv}
                className="inline-flex items-center gap-2 rounded-button border border-outline bg-white px-4 py-2.5 text-body font-medium text-text-primary shadow-sm hover:bg-hover-light transition-colors"
              >
                <Download size={16} />
                Export CSV
              </button>
            </div>
          </div>

          <div className="rounded-card border border-outline bg-white shadow-surface overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline">
                  <th className="px-6 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    Property Name
                  </th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    Organization
                  </th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    Valuation
                  </th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    Location
                  </th>
                  <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">
                    Broker Status
                  </th>
                  <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {enterpriseQueue.slice((enterprisePage - 1) * ITEMS_PER_PAGE, enterprisePage * ITEMS_PER_PAGE).map((property) => (
                  <tr
                    key={property.name}
                    className="border-b border-outline last:border-0 hover:bg-hover-light transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={property.image}
                          alt={property.name}
                          className="h-11 w-14 rounded-button object-cover"
                        />
                        <div>
                          <p className="text-body font-semibold text-text-primary">{property.name}</p>
                          <p className="text-label text-text-muted">{property.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-body text-text-primary">
                      {property.organization}
                    </td>
                    <td className="px-4 py-4 text-body font-semibold text-text-primary">
                      {property.valuation}
                    </td>
                    <td className="px-4 py-4 text-body text-text-primary">
                      {property.location}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={cn(
                          'inline-block rounded-pill px-3 py-1 text-badge font-bold',
                          property.statusColor,
                        )}
                      >
                        {property.brokerStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleAssignClick(property)}
                        className="rounded-button border border-outline px-4 py-1.5 text-body font-medium text-text-primary hover:bg-hover-light transition-colors"
                      >
                        Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Enterprise Pagination */}
          {enterpriseQueue.length > ITEMS_PER_PAGE && (
            <div className="flex items-center justify-between px-2 pt-4">
              <p className="text-label text-text-muted">
                Showing {Math.min((enterprisePage - 1) * ITEMS_PER_PAGE + 1, enterpriseQueue.length)}–{Math.min(enterprisePage * ITEMS_PER_PAGE, enterpriseQueue.length)} of {enterpriseQueue.length}
              </p>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.ceil(enterpriseQueue.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setEnterprisePage(page)}
                    className={cn(
                      'h-8 w-8 rounded-lg text-label font-bold transition-colors',
                      page === enterprisePage ? 'bg-navy text-white' : 'text-text-muted hover:bg-hover-light',
                    )}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Non-Enterprise Assignment Queue */}
        <div className="space-y-4">
          <div>
            <h2 className="flex items-center gap-2 text-heading-3 font-bold text-text-primary">
              <span className="h-2.5 w-2.5 rounded-full bg-text-primary" />
              Non-Enterprised Assignment Queue
            </h2>
            <p className="mt-1 text-label text-text-muted">
              Individual residential units and multi-family portfolio listings.
            </p>
          </div>

          <div className="rounded-card border border-outline bg-white shadow-surface overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline">
                  <th className="px-6 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    Property Name
                  </th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    Owner Type
                  </th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    Rent/Price
                  </th>
                  <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">
                    Location
                  </th>
                  <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {standardQueue.slice((standardPage - 1) * ITEMS_PER_PAGE, standardPage * ITEMS_PER_PAGE).map((property) => (
                  <tr
                    key={property.name}
                    className="border-b border-outline last:border-0 hover:bg-hover-light transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={property.image}
                          alt={property.name}
                          className="h-11 w-14 rounded-button object-cover"
                        />
                        <div>
                          <button type="button" onClick={(e) => { e.stopPropagation(); navigate(`/admin/property/${property.id}`) }} className="text-body font-semibold text-primary hover:underline text-left">{property.name}</button>
                          <p className="text-label text-text-muted">{property.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-body text-text-primary">
                      {property.ownerType}
                    </td>
                    <td className="px-4 py-4 text-body font-semibold text-text-primary">
                      {property.rentPrice}
                    </td>
                    <td className="px-4 py-4 text-body text-text-primary">
                      {property.location}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={cn(
                          'inline-block rounded-pill px-3 py-1 text-badge font-bold',
                          property.statusColor,
                        )}
                      >
                        {property.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <ActionMenu
                        ariaLabel={`Actions for ${property.name}`}
                        items={[
                          { label: 'View', icon: Eye, onClick: () => toast.info('Property details', `${property.name} - ${property.location}`) },
                          ...(property.status === 'Unassigned' ? [{
                            label: 'Assign',
                            icon: UserCheck,
                            onClick: () => handleStandardAssignClick(property),
                          }] : []),
                          {
                            label: 'Delete',
                            icon: Trash2,
                            variant: 'danger' as const,
                            onClick: () => toast.info('Delete', `${property.name} removal is not supported in prototype.`),
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Non-Enterprise Pagination */}
          <div className="flex items-center justify-between px-2 pt-4">
            <p className="text-label text-text-muted">
              Showing {Math.min((standardPage - 1) * ITEMS_PER_PAGE + 1, standardQueue.length)}–{Math.min(standardPage * ITEMS_PER_PAGE, standardQueue.length)} of {standardQueue.length}
            </p>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.max(1, Math.ceil(standardQueue.length / ITEMS_PER_PAGE)) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setStandardPage(page)}
                  className={cn(
                    'h-8 w-8 rounded-lg text-label font-bold transition-colors',
                    page === standardPage ? 'bg-navy text-white' : 'text-text-muted hover:bg-hover-light',
                  )}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Assign Modal (Enterprise) */}
      {assignModalOpen && selectedProperty && (
        <AssignModal
          onClose={() => setAssignModalOpen(false)}
          property={selectedProperty}
          brokers={brokers}
          rows={enterpriseAssignments[selectedProperty.name] ?? createInitialEnterpriseRows(selectedProperty)}
          onRowsChange={(rows) =>
            setEnterpriseAssignments((current) => ({
              ...current,
              [selectedProperty.name]: rows,
            }))
          }
        />
      )}

      {/* Assign Modal (Standard) */}
      {standardAssignModalOpen && selectedStandardProperty && (
        <StandardAssignModal
          onClose={() => setStandardAssignModalOpen(false)}
          property={selectedStandardProperty}
          brokers={brokers}
          rows={standardAssignments[selectedStandardProperty.name] ?? createInitialStandardRows(selectedStandardProperty)}
          onAssign={(brokerId) => assignBrokerToProperty(selectedStandardProperty.id, brokerId, 'user-admin-1')}
          onRowsChange={(rows) =>
            setStandardAssignments((current) => ({
              ...current,
              [selectedStandardProperty.name]: rows,
            }))
          }
        />
      )}
    </div>
  )
}

function AssignModal({
  onClose,
  property,
  brokers,
  rows,
  onRowsChange,
}: {
  onClose: () => void
  property: EnterpriseProperty
  brokers: AdminBroker[]
  rows: EnterpriseAssignmentRow[]
  onRowsChange: (rows: EnterpriseAssignmentRow[]) => void
}) {
  const [brokerPickerRowId, setBrokerPickerRowId] = useState<string | null>(null)
  const [brokerSearch, setBrokerSearch] = useState('')
  const activeRow = rows.find((row) => row.id === brokerPickerRowId)
  const availableBrokers = brokers.filter((broker) => {
    const query = brokerSearch.trim().toLowerCase()
    const active = broker.status === 'ACTIVE'
    if (!query) return active
    return (
      active &&
      [broker.name, broker.role, broker.brokerId, String(broker.successRate), broker.avgTime]
        .join(' ')
        .toLowerCase()
        .includes(query)
    )
  })

  const updateRow = (rowId: string, patch: Partial<EnterpriseAssignmentRow>) => {
    onRowsChange(rows.map((row) => (row.id === rowId ? { ...row, ...patch } : row)))
  }

  const addPropertyRow = () => {
    const nextIndex = rows.length + 1
    onRowsChange([
      ...rows,
      {
        id: `${property.name}-new-${Date.now()}`,
        propertyName: `${property.name} - New Property ${nextIndex}`,
        block: 'A1',
        floor: String(nextIndex).padStart(2, '0'),
        commission: '50',
      },
    ])
  }

  const assignBroker = (row: EnterpriseAssignmentRow, broker: AdminBroker) => {
    updateRow(row.id, { assignedBrokerId: broker.id })
    setBrokerPickerRowId(null)
    setBrokerSearch('')
    toast.success('Broker assigned', `${broker.name} assigned to ${row.propertyName}.`)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal */}
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-modal bg-white p-8 shadow-modal">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-heading-1 font-bold text-text-primary">Assign</h2>
            <p className="mt-1 text-body text-text-muted">
              {property.name} - {property.organization}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-button text-text-muted hover:bg-hover-light hover:text-text-primary transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-card border border-outline bg-canvas-alt px-4 py-3">
          <div className="flex items-center gap-3">
            <img src={property.image} alt={property.name} className="h-12 w-16 rounded-button object-cover" />
            <div>
              <p className="text-body font-bold text-text-primary">{property.type}</p>
              <p className="text-label text-text-muted">
                {property.location} - {property.valuation}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={addPropertyRow}
            className="inline-flex items-center gap-2 rounded-button bg-navy px-4 py-2.5 text-body font-semibold text-white hover:bg-slate-800"
          >
            <Plus size={16} />
            Add Property
          </button>
        </div>

        {/* Table Header */}
        <div className="mt-8 hidden grid-cols-[minmax(220px,1.4fr)_110px_110px_130px_minmax(190px,0.9fr)_120px] gap-3 border-b border-outline pb-4 lg:grid">
          <p className="text-filter-label uppercase tracking-wider text-text-muted">Property Name</p>
          <p className="text-filter-label uppercase tracking-wider text-text-muted">Block</p>
          <p className="text-filter-label uppercase tracking-wider text-text-muted">Floor</p>
          <p className="text-filter-label uppercase tracking-wider text-text-muted">Commission (%)</p>
          <p className="text-filter-label uppercase tracking-wider text-text-muted">Assigned Broker</p>
          <p className="text-filter-label uppercase tracking-wider text-text-muted text-center">Action</p>
        </div>

        {/* Assignment Rows */}
        <div className="divide-y divide-outline">
          {rows.map((row) => {
            const assignedBroker = brokers.find((broker) => broker.id === row.assignedBrokerId)
            return (
            <div key={row.id} className="grid gap-3 py-5 lg:grid-cols-[minmax(220px,1.4fr)_110px_110px_130px_minmax(190px,0.9fr)_120px] lg:items-center">
              <label className="block">
                <span className="mb-1 block text-filter-label uppercase tracking-wider text-text-muted lg:hidden">
                  Property Name
                </span>
                <input
                  value={row.propertyName}
                  onChange={(event) => updateRow(row.id, { propertyName: event.target.value })}
                  className="h-11 w-full rounded-input border border-outline bg-white px-3 text-body font-semibold text-text-primary outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-filter-label uppercase tracking-wider text-text-muted lg:hidden">
                  Block
                </span>
                <input
                  value={row.block}
                  onChange={(event) => updateRow(row.id, { block: event.target.value })}
                  className="h-11 w-full rounded-input border border-outline bg-white px-3 text-body font-semibold text-text-primary outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-filter-label uppercase tracking-wider text-text-muted lg:hidden">
                  Floor
                </span>
                <input
                  value={row.floor}
                  onChange={(event) => updateRow(row.id, { floor: event.target.value })}
                  className="h-11 w-full rounded-input border border-outline bg-white px-3 text-body font-semibold text-text-primary outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-filter-label uppercase tracking-wider text-text-muted lg:hidden">
                  Commission
                </span>
                <div className="flex h-11 items-center rounded-input border border-outline bg-white px-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30">
                  <input
                    value={row.commission}
                    onChange={(event) => updateRow(row.id, { commission: event.target.value.replace(/[^0-9.]/g, '') })}
                    className="min-w-0 flex-1 border-0 bg-transparent text-body font-semibold text-text-primary outline-none"
                    inputMode="decimal"
                  />
                  <span className="text-body font-bold text-text-muted">%</span>
                </div>
              </label>

              <div>
                <span className="mb-1 block text-filter-label uppercase tracking-wider text-text-muted lg:hidden">
                  Assigned Broker
                </span>
                {assignedBroker ? (
                  <div className="flex items-center gap-2 rounded-button bg-primary-100 px-3 py-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                      {assignedBroker.avatar}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-label font-bold text-primary">{assignedBroker.name}</span>
                      <span className="block truncate text-[10px] font-semibold text-text-muted">{assignedBroker.brokerId}</span>
                    </span>
                  </div>
                ) : (
                  <span className="inline-flex h-11 w-full items-center rounded-button bg-slate-50 px-3 text-label font-semibold text-text-muted">
                    Not assigned
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setBrokerPickerRowId(row.id)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-button bg-navy px-4 text-body font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                <UserCheck size={16} />
                {assignedBroker ? 'Change' : 'Assign'}
              </button>
            </div>
          )})}
        </div>

        {activeRow && (
          <section className="mt-6 overflow-hidden rounded-card border border-outline bg-canvas-alt">
            <div className="flex flex-col gap-3 border-b border-outline bg-white px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-filter-label font-bold uppercase tracking-wider text-primary">
                  Available Brokers
                </p>
                <h3 className="mt-1 text-heading-3 font-bold text-text-primary">
                  Assign broker to {activeRow.propertyName}
                </h3>
                <p className="mt-1 text-label text-text-muted">
                  Brokers can be assigned to multiple enterprise properties.
                </p>
              </div>
              <div className="relative w-full lg:w-72">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  value={brokerSearch}
                  onChange={(event) => setBrokerSearch(event.target.value)}
                  placeholder="Search broker..."
                  className="h-10 w-full rounded-input border border-outline bg-white pl-9 pr-3 text-body outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                />
              </div>
            </div>

            <div className="max-h-[320px] overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline bg-white">
                    <th className="px-5 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">Broker</th>
                    <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">Performance</th>
                    <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">Current Assignments</th>
                    <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {availableBrokers.map((broker) => {
                    const assignedCount = rows.filter((row) => row.assignedBrokerId === broker.id).length
                    const assignedToActive = activeRow.assignedBrokerId === broker.id
                    return (
                      <tr key={broker.id} className="border-b border-outline bg-white last:border-0 hover:bg-hover-light">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-badge font-bold text-white">
                              {broker.avatar}
                            </span>
                            <div>
                              <p className="text-body font-bold text-text-primary">{broker.name}</p>
                              <p className="text-label text-text-muted">{broker.role} - {broker.brokerId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-body font-bold text-text-primary">{broker.successRate}% success</p>
                          <p className="text-label text-text-muted">
                            {broker.dealsClosed} closed - Avg {broker.avgTime}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex rounded-pill bg-primary-100 px-3 py-1 text-badge font-bold text-primary">
                            {assignedCount} enterprise properties
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => assignBroker(activeRow, broker)}
                            className={cn(
                              'inline-flex items-center gap-2 rounded-button px-4 py-2 text-body font-semibold transition-colors',
                              assignedToActive
                                ? 'bg-status-success-bg text-status-success-text hover:bg-green-100'
                                : 'bg-navy text-white hover:bg-slate-800'
                            )}
                          >
                            {assignedToActive && <CheckCircle2 size={15} />}
                            {assignedToActive ? 'Assigned' : 'Assign Broker'}
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {availableBrokers.length === 0 && (
                <div className="bg-white px-6 py-10 text-center">
                  <p className="text-body font-bold text-text-primary">No available brokers found</p>
                  <p className="mt-1 text-label text-text-muted">Try a different broker name or speciality.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Footer */}
        <div className="mt-6 flex justify-end border-t border-outline pt-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-button border border-outline px-8 py-3 text-body font-medium text-text-primary hover:bg-hover-light transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

function StandardAssignModal({
  onClose,
  property,
  brokers,
  rows,
  onRowsChange,
  onAssign,
}: {
  onClose: () => void
  property: StandardProperty
  brokers: AdminBroker[]
  rows: StandardAssignmentRow[]
  onRowsChange: (rows: StandardAssignmentRow[]) => void
  onAssign: (brokerId: string) => void
}) {
  const [brokerPickerRowId, setBrokerPickerRowId] = useState<string | null>(rows[0]?.id ?? null)
  const [brokerSearch, setBrokerSearch] = useState('')
  const activeRow = rows.find((row) => row.id === brokerPickerRowId)
  const availableBrokers = brokers.filter((broker) => {
    const query = brokerSearch.trim().toLowerCase()
    const active = broker.status === 'ACTIVE'
    if (!query) return active
    return (
      active &&
      [broker.name, broker.role, broker.brokerId, String(broker.successRate), broker.avgTime]
        .join(' ')
        .toLowerCase()
        .includes(query)
    )
  })

  const updateRow = (rowId: string, patch: Partial<StandardAssignmentRow>) => {
    onRowsChange(rows.map((row) => (row.id === rowId ? { ...row, ...patch } : row)))
  }

  const assignBroker = (row: StandardAssignmentRow, broker: AdminBroker) => {
    onAssign(broker.id)
    updateRow(row.id, { assignedBrokerId: broker.id })
    toast.success('Broker assigned', `${broker.name} assigned to ${row.propertyName}.`)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal */}
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-modal bg-white p-8 shadow-modal">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-heading-1 font-bold text-text-primary">Assign</h2>
            <p className="mt-1 text-body text-text-muted">
              {property.name} - {property.ownerType}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-button text-text-muted hover:bg-hover-light hover:text-text-primary transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-card border border-outline bg-canvas-alt px-4 py-3">
          <img
            src={property.image}
            alt={property.name}
            className="h-14 w-20 rounded-button object-cover"
          />
          <div>
            <p className="text-body font-bold text-text-primary">{property.type}</p>
            <p className="mt-0.5 text-label text-text-muted">
              {property.location} - {property.rentPrice}
            </p>
          </div>
          <span className={cn('ml-auto rounded-pill px-3 py-1 text-badge font-bold', property.statusColor)}>
            {property.status}
          </span>
        </div>

        {/* Table Header */}
        <div className="mt-8 hidden grid-cols-[minmax(220px,1.3fr)_150px_minmax(190px,0.9fr)_120px] gap-3 border-b border-outline pb-4 lg:grid">
          <p className="text-filter-label uppercase tracking-wider text-text-muted">Property</p>
          <p className="text-filter-label uppercase tracking-wider text-text-muted">Commission (%)</p>
          <p className="text-filter-label uppercase tracking-wider text-text-muted">Assigned Broker</p>
          <p className="text-filter-label uppercase tracking-wider text-text-muted text-center">Action</p>
        </div>

        {/* Assignment Rows */}
        <div className="divide-y divide-outline">
          {rows.map((row) => {
            const assignedBroker = brokers.find((broker) => broker.id === row.assignedBrokerId)
            return (
            <div key={row.id} className="grid gap-3 py-5 lg:grid-cols-[minmax(220px,1.3fr)_150px_minmax(190px,0.9fr)_120px] lg:items-center">
              <div className="flex items-center gap-4">
                <img
                  src={property.image}
                  alt={row.propertyName}
                  className="h-14 w-20 rounded-button border border-outline object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-body font-bold text-text-primary">{row.propertyName}</p>
                  <p className="mt-1 text-label text-text-muted">{property.type}</p>
                </div>
              </div>

              <label className="block">
                <span className="mb-1 block text-filter-label uppercase tracking-wider text-text-muted lg:hidden">
                  Commission
                </span>
                <div className="flex h-11 items-center rounded-input border border-outline bg-white px-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30">
                  <input
                    value={row.commission}
                    onChange={(event) => updateRow(row.id, { commission: event.target.value.replace(/[^0-9.]/g, '') })}
                    className="min-w-0 flex-1 border-0 bg-transparent text-body font-semibold text-text-primary outline-none"
                    inputMode="decimal"
                  />
                  <span className="text-body font-bold text-text-muted">%</span>
                </div>
              </label>

              <div>
                <span className="mb-1 block text-filter-label uppercase tracking-wider text-text-muted lg:hidden">
                  Assigned Broker
                </span>
                {assignedBroker ? (
                  <div className="flex items-center gap-2 rounded-button bg-primary-100 px-3 py-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                      {assignedBroker.avatar}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-label font-bold text-primary">{assignedBroker.name}</span>
                      <span className="block truncate text-[10px] font-semibold text-text-muted">{assignedBroker.brokerId}</span>
                    </span>
                  </div>
                ) : (
                  <span className="inline-flex h-11 w-full items-center rounded-button bg-slate-50 px-3 text-label font-semibold text-text-muted">
                    Not assigned
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setBrokerPickerRowId(row.id)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-button bg-navy px-4 text-body font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                <UserCheck size={16} />
                {assignedBroker ? 'Change' : 'Assign'}
              </button>
            </div>
          )})}
        </div>

        {activeRow && (
          <section className="mt-6 overflow-hidden rounded-card border border-outline bg-canvas-alt">
            <div className="flex flex-col gap-3 border-b border-outline bg-white px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-filter-label font-bold uppercase tracking-wider text-primary">
                  Available Brokers
                </p>
                <h3 className="mt-1 text-heading-3 font-bold text-text-primary">
                  Assign broker to {activeRow.propertyName}
                </h3>
                <p className="mt-1 text-label text-text-muted">
                  Choose any active broker and set the commission percentage above.
                </p>
              </div>
              <div className="relative w-full lg:w-72">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  value={brokerSearch}
                  onChange={(event) => setBrokerSearch(event.target.value)}
                  placeholder="Search broker..."
                  className="h-10 w-full rounded-input border border-outline bg-white pl-9 pr-3 text-body outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                />
              </div>
            </div>

            <div className="max-h-[320px] overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline bg-white">
                    <th className="px-5 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">Broker</th>
                    <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">Performance</th>
                    <th className="px-4 py-3 text-left text-filter-label uppercase tracking-wider text-text-muted">Commission</th>
                    <th className="px-4 py-3 text-center text-filter-label uppercase tracking-wider text-text-muted">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {availableBrokers.map((broker) => {
                    const assignedToActive = activeRow.assignedBrokerId === broker.id
                    return (
                      <tr key={broker.id} className="border-b border-outline bg-white last:border-0 hover:bg-hover-light">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-badge font-bold text-white">
                              {broker.avatar}
                            </span>
                            <div>
                              <p className="text-body font-bold text-text-primary">{broker.name}</p>
                              <p className="text-label text-text-muted">{broker.role} - {broker.brokerId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-body font-bold text-text-primary">{broker.successRate}% success</p>
                          <p className="text-label text-text-muted">
                            {broker.activeDeals} active - {broker.dealsClosed} closed
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex rounded-pill bg-slate-100 px-3 py-1 text-badge font-bold text-text-primary">
                            {activeRow.commission || '0'}%
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => assignBroker(activeRow, broker)}
                            className={cn(
                              'inline-flex items-center gap-2 rounded-button px-4 py-2 text-body font-semibold transition-colors',
                              assignedToActive
                                ? 'bg-status-success-bg text-status-success-text hover:bg-green-100'
                                : 'bg-navy text-white hover:bg-slate-800'
                            )}
                          >
                            {assignedToActive && <CheckCircle2 size={15} />}
                            {assignedToActive ? 'Assigned' : 'Assign Broker'}
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {availableBrokers.length === 0 && (
                <div className="bg-white px-6 py-10 text-center">
                  <p className="text-body font-bold text-text-primary">No available brokers found</p>
                  <p className="mt-1 text-label text-text-muted">Try a different broker name or speciality.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Footer */}
        <div className="mt-6 flex justify-end border-t border-outline pt-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-button border border-outline px-8 py-3 text-body font-medium text-text-primary hover:bg-hover-light transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
