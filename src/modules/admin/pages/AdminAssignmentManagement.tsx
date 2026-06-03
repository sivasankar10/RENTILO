import { useState } from 'react'
import { Building2, Download, Home, Pencil, TrendingUp, AlertTriangle, X } from 'lucide-react'
import { cn } from '@shared/utils/cn'

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
  image: string
  name: string
  type: string
  ownerType: string
  rentPrice: string
  location: string
  status: string
  statusColor: string
}

interface AssignmentRow {
  block: string
  floor: string
  units: string[]
  moreCount: number
  commission: string
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

const standardQueue: StandardProperty[] = [
  {
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=120&q=80',
    name: 'Skyview Unit 402',
    type: '2BR Apartment',
    ownerType: 'Private Individual',
    rentPrice: '$4,500/mo',
    location: 'Chicago, River North',
    status: 'Urgent',
    statusColor: 'bg-status-error-bg text-status-error-text',
  },
  {
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=120&q=80',
    name: 'Oak Ridge Residences',
    type: 'Condominium',
    ownerType: 'Investment Group',
    rentPrice: '$820,000',
    location: 'Austin, TX',
    status: 'Processing',
    statusColor: 'bg-slate-100 text-slate-600',
  },
  {
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=120&q=80',
    name: 'The Loft Collective',
    type: 'Studio Loft',
    ownerType: 'Property REIT',
    rentPrice: '$3,200/mo',
    location: 'Portland, Pearl District',
    status: 'New',
    statusColor: 'bg-slate-100 text-slate-600',
  },
]

const defaultAssignmentRows: AssignmentRow[] = [
  { block: 'A1', floor: '04', units: ['402', '405', '410', '412'], moreCount: 14, commission: '50%' },
  { block: 'A1', floor: '04', units: ['402', '405', '410', '412'], moreCount: 14, commission: '50%' },
  { block: 'A1', floor: '04', units: ['402', '405', '410', '412'], moreCount: 14, commission: '50%' },
]

export function AdminAssignmentManagement() {
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [standardAssignModalOpen, setStandardAssignModalOpen] = useState(false)
  const [, setSelectedProperty] = useState<EnterpriseProperty | null>(null)
  const [selectedStandardProperty, setSelectedStandardProperty] = useState<StandardProperty | null>(null)

  const handleAssignClick = (property: EnterpriseProperty) => {
    setSelectedProperty(property)
    setAssignModalOpen(true)
  }

  const handleStandardAssignClick = (property: StandardProperty) => {
    setSelectedStandardProperty(property)
    setStandardAssignModalOpen(true)
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
                className="inline-flex items-center gap-2 rounded-button border border-outline bg-white px-4 py-2.5 text-body font-medium text-text-primary shadow-sm hover:bg-hover-light transition-colors"
              >
                Export CSV
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-button bg-navy px-4 py-2.5 text-body font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
              >
                Bulk Assign
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
                {enterpriseQueue.map((property) => (
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
                {standardQueue.map((property) => (
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
                      <button
                        type="button"
                        onClick={() => handleStandardAssignClick(property)}
                        className="text-body font-medium text-text-primary hover:text-primary transition-colors"
                      >
                        Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* View All */}
          <div className="text-center">
            <button
              type="button"
              className="inline-flex items-center gap-2 text-body font-medium text-text-muted hover:text-text-primary transition-colors"
            >
              View all properties
              <Download size={14} className="rotate-180" />
            </button>
          </div>
        </div>
      </div>

      {/* Assign Modal (Enterprise) */}
      {assignModalOpen && (
        <AssignModal
          onClose={() => setAssignModalOpen(false)}
          rows={defaultAssignmentRows}
        />
      )}

      {/* Assign Modal (Standard) */}
      {standardAssignModalOpen && selectedStandardProperty && (
        <StandardAssignModal
          onClose={() => setStandardAssignModalOpen(false)}
          property={selectedStandardProperty}
        />
      )}
    </div>
  )
}

function AssignModal({
  onClose,
  rows,
}: {
  onClose: () => void
  rows: AssignmentRow[]
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-modal bg-white p-8 shadow-modal">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-heading-1 font-bold text-text-primary">Assign</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-button text-text-muted hover:bg-hover-light hover:text-text-primary transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Table Header */}
        <div className="mt-8 grid grid-cols-[1fr_1fr] gap-8 border-b border-outline pb-4">
          <p className="text-filter-label uppercase tracking-wider text-text-muted text-center">
            Assigning
          </p>
          <p className="text-filter-label uppercase tracking-wider text-text-muted text-center">
            Commission (%)
          </p>
        </div>

        {/* Assignment Rows */}
        <div className="divide-y divide-outline">
          {rows.map((row, idx) => (
            <div key={idx} className="grid grid-cols-[1fr_1fr] gap-8 py-6 items-center">
              {/* Left: Block, Floor, Units */}
              <div className="flex items-center gap-4">
                {/* Block Select */}
                <div>
                  <p className="text-label text-text-muted">Block</p>
                  <select className="mt-1 h-10 w-20 rounded-input border border-outline bg-white px-2 text-body font-medium text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30">
                    <option>A1</option>
                    <option>A2</option>
                    <option>B1</option>
                    <option>B2</option>
                  </select>
                </div>

                {/* Floor Select */}
                <div>
                  <p className="text-label text-text-muted">Floor</p>
                  <select className="mt-1 h-10 w-20 rounded-input border border-outline bg-white px-2 text-body font-medium text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30">
                    <option>04</option>
                    <option>05</option>
                    <option>06</option>
                    <option>07</option>
                  </select>
                </div>

                {/* Unit Chips */}
                <div className="mt-4">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {row.units.map((unit, unitIdx) => (
                      <span
                        key={unitIdx}
                        className={cn(
                          'inline-flex items-center justify-center h-8 min-w-[40px] px-2 rounded text-label font-semibold',
                          unitIdx === 0
                            ? 'bg-navy text-white'
                            : 'bg-slate-100 text-text-primary',
                        )}
                      >
                        {unit}
                      </span>
                    ))}
                  </div>
                  <p className="mt-1 text-label text-text-muted">+{row.moreCount} more</p>
                </div>
              </div>

              {/* Right: Commission + Assign */}
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-heading-3 font-bold text-text-primary">
                    {row.commission}
                  </span>
                  <button
                    type="button"
                    className="p-1.5 rounded-button text-text-muted hover:text-primary hover:bg-hover-light transition-colors"
                    aria-label="Edit commission"
                  >
                    <Pencil size={16} />
                  </button>
                </div>

                <button
                  type="button"
                  className="rounded-button bg-navy px-6 py-3 text-body font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
                >
                  Assign
                </button>
              </div>
            </div>
          ))}
        </div>

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
}: {
  onClose: () => void
  property: StandardProperty
}) {
  const rows = [0, 1, 2]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-modal bg-white p-8 shadow-modal">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-heading-1 font-bold text-text-primary">Assign</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-button text-text-muted hover:bg-hover-light hover:text-text-primary transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Table Header */}
        <div className="mt-8 grid grid-cols-[1fr_1fr] gap-8 border-b border-outline pb-4">
          <p className="text-filter-label uppercase tracking-wider text-text-muted text-center">
            Property
          </p>
          <p className="text-filter-label uppercase tracking-wider text-text-muted text-center">
            Commission (%)
          </p>
        </div>

        {/* Assignment Rows */}
        <div className="divide-y divide-outline">
          {rows.map((_, idx) => (
            <div key={idx} className="grid grid-cols-[1fr_1fr] gap-8 py-6 items-center">
              {/* Left: Property Info */}
              <div className="flex items-center gap-4">
                <img
                  src={property.image}
                  alt={property.name}
                  className="h-14 w-18 rounded-button object-cover border border-outline"
                />
                <div>
                  <p className="text-body font-semibold text-text-primary">{property.name}</p>
                  <p className="text-label text-text-muted">{property.type}</p>
                </div>
              </div>

              {/* Right: Commission + Assign */}
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-heading-3 font-bold text-text-primary">50%</span>
                  <button
                    type="button"
                    className="p-1.5 rounded-button text-text-muted hover:text-primary hover:bg-hover-light transition-colors"
                    aria-label="Edit commission"
                  >
                    <Pencil size={16} />
                  </button>
                </div>

                <button
                  type="button"
                  className="rounded-button bg-navy px-6 py-3 text-body font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
                >
                  Assign
                </button>
              </div>
            </div>
          ))}
        </div>

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
