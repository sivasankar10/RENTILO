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

interface Tenant {
  name: string
  flat: string
  leaseStart: string
  leaseEnd: string
  paymentStatus: 'PAID' | 'PENDING' | 'OVERDUE'
}

interface FloorDetail {
  level: string
  config: string
  avgArea: string
  availability: string
  availableFlats: string
}

const tenants: Tenant[] = [
  { name: 'Rajesh Malhotra', flat: 'A-1801', leaseStart: '15 Jan 2023', leaseEnd: '14 Jan 2025', paymentStatus: 'PAID' },
  { name: 'Sarah Jenkins', flat: 'C-1204', leaseStart: '01 Mar 2023', leaseEnd: '28 Feb 2024', paymentStatus: 'PENDING' },
  { name: 'TechSprint Solutions Ltd', flat: 'B-0402', leaseStart: '12 Nov 2022', leaseEnd: '11 Nov 2025', paymentStatus: 'OVERDUE' },
]

const floorDetails: FloorDetail[] = [
  { level: 'Penthouse (18)', config: '4 BHK Luxury', avgArea: '4,200', availability: '2 / 8', availableFlats: '1011-2' },
  { level: 'Executive (12-17)', config: '3 BHK Premium', avgArea: '2,850', availability: '14 / 48', availableFlats: '1011-2' },
  { level: 'Standard (1-11)', config: '2 & 3 BHK', avgArea: '1,800', availability: '0 / 88', availableFlats: '1011-2' },
]

const paymentStatusColors: Record<string, string> = {
  PAID: 'bg-status-success-bg text-status-success-text',
  PENDING: 'bg-amber-50 text-amber-700',
  OVERDUE: 'bg-status-error-bg text-status-error-text',
}

export function AdminEnterprisePropertyDetail() {
  const navigate = useNavigate()
  const { propertyId } = useParams()

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
              className="inline-flex items-center gap-2 rounded-button border border-outline bg-white px-4 py-2.5 text-body font-medium text-text-primary shadow-sm hover:bg-hover-light transition-colors"
            >
              <Download size={16} />
              Export Report
            </button>
            <button
              type="button"
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
            <p className="mt-3 text-heading-2 font-bold text-text-primary">₹45.8Cr</p>
            <p className="mt-1 text-label text-status-success">+2.4% vs LY</p>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-label text-text-muted">Verified on 12 Oct, 2023</p>
              <button type="button" className="p-1 text-text-muted hover:text-primary transition-colors">
                <Pencil size={14} />
              </button>
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
            <p className="mt-3 text-heading-2 font-bold text-text-primary">₹1.12Cr</p>
            <p className="mt-1 text-label text-text-muted">Projected FY24</p>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-label text-text-muted">Structure: Corporate Flat</p>
              <button type="button" className="p-1 text-text-muted hover:text-primary transition-colors">
                <Pencil size={14} />
              </button>
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
            <div className="mt-3 flex items-center gap-3">
              <p className="text-heading-2 font-bold text-text-primary">12</p>
              <span className="rounded-pill bg-status-error-bg px-2.5 py-0.5 text-badge font-bold text-status-error-text">
                TOP TIER
              </span>
            </div>
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
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[9px] font-bold text-slate-500">
                  +9
                </div>
              </div>
              <button type="button" className="p-1 text-text-muted hover:text-primary transition-colors">
                <Pencil size={14} />
              </button>
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
              <button type="button" className="p-1.5 text-text-muted hover:text-primary transition-colors">
                <Edit size={16} />
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-button bg-canvas-alt">
                  <Building2 size={18} className="text-text-primary" />
                </div>
                <div>
                  <p className="text-heading-3 font-bold text-text-primary">04</p>
                  <p className="text-label text-text-muted">Blocks (A, B, C, D)</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-button bg-canvas-alt">
                  <Layers size={18} className="text-text-primary" />
                </div>
                <div>
                  <p className="text-heading-3 font-bold text-text-primary">18</p>
                  <p className="text-label text-text-muted">Floors</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-button bg-canvas-alt">
                  <Grid3X3 size={18} className="text-text-primary" />
                </div>
                <div>
                  <p className="text-heading-3 font-bold text-text-primary">08</p>
                  <p className="text-label text-text-muted">Units</p>
                </div>
              </div>
            </div>

            {/* Inventory Occupancy */}
            <div className="mt-6 border-t border-outline pt-5">
              <div className="flex items-center justify-between">
                <p className="text-filter-label uppercase tracking-wider text-text-muted">
                  Inventory Occupancy
                </p>
                <p className="text-body font-bold text-primary">82%</p>
              </div>
              <div className="mt-2 h-2 rounded-pill bg-slate-100">
                <div className="h-full w-[82%] rounded-pill bg-primary" />
              </div>
              <p className="mt-3 text-label text-text-muted">
                Total unit count: 576 units across complex.
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
                className="inline-flex items-center gap-1.5 rounded-button border border-outline px-3 py-2 text-label font-medium text-text-muted hover:bg-hover-light transition-colors"
              >
                <Filter size={14} />
                Filter
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-button bg-navy px-3 py-2 text-label font-semibold text-white hover:bg-slate-800 transition-colors"
              >
                <UserPlus size={14} />
                Add Tenant
              </button>
            </div>
          </div>

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
                {tenants.map((tenant) => (
                  <tr
                    key={tenant.flat}
                    className="border-b border-outline last:border-0 hover:bg-hover-light transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="inline-block rounded-button border border-outline px-3 py-1.5 text-body font-medium text-text-primary">
                        {tenant.name}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-block rounded-button border border-outline px-3 py-1.5 text-body text-text-primary">
                        {tenant.flat}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-block rounded-button border border-outline px-3 py-1.5 text-label text-text-primary">
                        {tenant.leaseStart}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-block rounded-button border border-outline px-3 py-1.5 text-label text-text-primary">
                        {tenant.leaseEnd}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={cn(
                          'inline-block rounded-pill px-3 py-1 text-badge font-bold',
                          paymentStatusColors[tenant.paymentStatus],
                        )}
                      >
                        {tenant.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          className="p-1.5 rounded-button text-text-muted hover:text-primary hover:bg-hover-light transition-colors"
                          aria-label={`Edit ${tenant.name}`}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
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
            <p className="text-label text-text-muted">Showing 3 of 472 tenants</p>
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
                {floorDetails.map((floor) => (
                  <tr
                    key={floor.level}
                    className="border-b border-outline last:border-0 hover:bg-hover-light transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="inline-block rounded-button border border-outline px-3 py-1.5 text-body font-medium text-text-primary">
                        {floor.level}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-block rounded-button border border-outline px-3 py-1.5 text-body text-text-primary">
                        {floor.config}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-block rounded-button border border-outline px-3 py-1.5 text-body text-text-primary">
                        {floor.avgArea}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-block rounded-button border border-outline px-3 py-1.5 text-body text-text-primary">
                        {floor.availability}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-block rounded-button border border-outline px-3 py-1.5 text-body text-text-primary">
                        {floor.availableFlats}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        type="button"
                        className="p-1.5 rounded-button text-text-muted hover:text-primary hover:bg-hover-light transition-colors"
                        aria-label={`Edit ${floor.level}`}
                      >
                        <Pencil size={14} />
                      </button>
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
