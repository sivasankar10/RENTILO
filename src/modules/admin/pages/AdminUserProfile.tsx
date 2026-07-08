import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Building2, FileText, Mail, MapPin, MessageSquare, Phone, Shield, UserCheck } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { ROUTES } from '@shared/constants/routes'
import { usePrototypeStore } from '@shared/store/prototypeStore'
import { useOnboardingStore } from '@shared/store/onboardingStore'

export function AdminUserProfile() {
  const navigate = useNavigate()
  const { userId } = useParams<{ userId: string }>()
  const users = usePrototypeStore((s) => s.users)
  const properties = usePrototypeStore((s) => s.properties)
  const applications = usePrototypeStore((s) => s.applications)
  const brokerAssignments = usePrototypeStore((s) => s.brokerAssignments)
  const onboardingRecords = useOnboardingStore((s) => s.records)

  const user = users.find((u) => u.id === userId)

  if (!user) {
    return (
      <div className="min-h-screen bg-canvas-alt px-6 py-10">
        <div className="mx-auto max-w-3xl rounded-card border border-outline bg-white p-10 text-center shadow-surface">
          <h1 className="text-heading-2 font-bold text-text-primary">User not found</h1>
          <p className="mt-2 text-body text-text-muted">This user may have been removed or doesn't exist.</p>
          <button type="button" onClick={() => navigate(ROUTES.ADMIN.USER_MANAGEMENT)} className="mt-6 rounded-button bg-navy px-5 py-2.5 text-body font-semibold text-white hover:bg-slate-800">
            Back to Users
          </button>
        </div>
      </div>
    )
  }

  const fullName = `${user.firstName} ${user.lastName}`
  const initials = `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`
  const isOwner = user.roles.includes('owner')
  const isBroker = user.roles.includes('broker')
  const isTenant = user.roles.includes('tenant')

  // Owner properties
  const ownerProperties = isOwner ? properties.filter((p) => p.ownerId === user.id) : []

  // Broker assignments
  const brokerActiveAssignments = isBroker
    ? brokerAssignments.filter((a) => a.brokerId === user.id && a.status === 'Active')
    : []
  const brokerLeads = isBroker ? applications.filter((a) => a.brokerId === user.id) : []

  // Tenant activity
  const tenantApplications = isTenant ? applications.filter((a) => a.tenantId === user.id) : []
  const tenantLeases = isTenant ? onboardingRecords.filter((r) => r.tenant.id === user.id && r.status === 'active') : []

  return (
    <div className="min-h-screen bg-canvas-alt px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate(ROUTES.ADMIN.USER_MANAGEMENT)}
          className="inline-flex items-center gap-2 text-label font-semibold text-text-muted hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          Back to User Management
        </button>

        {/* Profile Header */}
        <div className="rounded-card border border-outline bg-white p-6 shadow-surface">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {user.avatar ? (
                <img src={user.avatar} alt={fullName} className="h-16 w-16 rounded-full object-cover border-2 border-primary-100" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-navy text-lg font-bold text-white">{initials}</div>
              )}
              <div>
                <h1 className="text-heading-2 font-bold text-text-primary">{fullName}</h1>
                <p className="mt-1 text-body text-text-muted">{user.email}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {user.roles.map((role) => (
                    <span key={role} className="rounded-pill bg-primary-100 px-2.5 py-1 text-badge font-bold uppercase text-primary">{role}</span>
                  ))}
                  <span className={cn('rounded-pill px-2.5 py-1 text-badge font-bold', user.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700')}>
                    {user.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => navigate(`${ROUTES.ADMIN.MESSAGES}?user=${encodeURIComponent(user.id)}`)}
                className="inline-flex items-center gap-1.5 rounded-button border border-outline bg-white px-4 py-2.5 text-label font-semibold text-text-primary hover:bg-hover-light transition-colors"
              >
                <MessageSquare size={15} />
                Chat
              </button>
              <button
                type="button"
                onClick={() => {}}
                className="inline-flex items-center gap-1.5 rounded-button bg-navy px-4 py-2.5 text-label font-semibold text-white hover:bg-slate-800 transition-colors"
              >
                <Phone size={15} />
                Call
              </button>
            </div>
          </div>
        </div>

        {/* Contact & KYC Info */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-card border border-outline bg-white p-6 shadow-sm">
            <h2 className="text-body font-bold text-text-primary flex items-center gap-2"><Mail size={16} /> Contact Details</h2>
            <div className="mt-4 space-y-3">
              <InfoRow label="Phone" value={user.phone} />
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Account" value={user.accountName} />
              <InfoRow label="Last Active" value={user.lastActive} />
            </div>
          </div>

          <div className="rounded-card border border-outline bg-white p-6 shadow-sm">
            <h2 className="text-body font-bold text-text-primary flex items-center gap-2"><Shield size={16} /> Verification & Status</h2>
            <div className="mt-4 space-y-3">
              <InfoRow label="KYC Status" value={user.kycStatus} />
              <InfoRow label="Account Status" value={user.status} />
              <InfoRow label="Primary Role" value={user.primaryRole} />
              <InfoRow label="Member Since" value={new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} />
            </div>
          </div>
        </div>

        {/* Role-specific data */}
        {isOwner && ownerProperties.length > 0 && (
          <div className="rounded-card border border-outline bg-white p-6 shadow-sm">
            <h2 className="text-body font-bold text-text-primary flex items-center gap-2"><Building2 size={16} /> Owned Properties ({ownerProperties.length})</h2>
            <div className="mt-4 space-y-3">
              {ownerProperties.map((property) => (
                <div key={property.id} className="flex items-center gap-3 rounded-lg border border-outline p-3">
                  <img src={property.image} alt={property.title} className="h-12 w-16 rounded object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-body font-semibold text-text-primary truncate">{property.title}</p>
                    <p className="text-label text-text-muted flex items-center gap-1"><MapPin size={11} />{property.neighborhood}, {property.city}</p>
                  </div>
                  <p className="text-body font-bold text-primary shrink-0">{property.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {isBroker && (
          <div className="rounded-card border border-outline bg-white p-6 shadow-sm">
            <h2 className="text-body font-bold text-text-primary flex items-center gap-2"><UserCheck size={16} /> Broker Activity</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <StatBox label="Active Assignments" value={String(brokerActiveAssignments.length)} />
              <StatBox label="Total Leads" value={String(brokerLeads.length)} />
              <StatBox label="Closed Deals" value={String(brokerLeads.filter((l) => l.status === 'active').length)} />
            </div>
          </div>
        )}

        {isTenant && (
          <div className="rounded-card border border-outline bg-white p-6 shadow-sm">
            <h2 className="text-body font-bold text-text-primary flex items-center gap-2"><FileText size={16} /> Tenant Activity</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <StatBox label="Applications" value={String(tenantApplications.length)} />
              <StatBox label="Active Leases" value={String(tenantLeases.length)} />
              <StatBox label="Properties Viewed" value={String(tenantApplications.length)} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-label text-text-muted">{label}</span>
      <span className="text-body font-semibold text-text-primary">{value}</span>
    </div>
  )
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-outline bg-canvas-alt p-4 text-center">
      <p className="text-[24px] font-bold text-text-primary">{value}</p>
      <p className="mt-1 text-label text-text-muted">{label}</p>
    </div>
  )
}
