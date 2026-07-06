import { useNavigate } from 'react-router-dom'
import { Building2, CheckCircle2, MessageSquare, ShieldCheck, UserCheck } from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { useAuth } from '@shared/hooks/useAuth'
import { useOwnerBrokerStore } from '@shared/store/brokerAssignmentStore'
import type { BrokerAssignmentBundle } from '@shared/store/brokerAssignmentStore'

// ─── Active broker card (read-only) ──────────────────────────────────────────

function ActiveBrokerCard({
  bundle,
  onMessage,
}: {
  bundle: BrokerAssignmentBundle
  onMessage: () => void
}) {
  const { broker, property, assignment } = bundle
  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5 flex flex-col sm:flex-row sm:items-center gap-4">
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-[#f1f5f9] border border-[#e2e8f0] overflow-hidden shrink-0 flex items-center justify-center">
        {broker.avatar ? (
          <img src={broker.avatar} alt={broker.firstName} className="w-full h-full object-cover" />
        ) : (
          <span className="text-[18px] font-bold text-[#64748b]">
            {broker.firstName[0]}{broker.lastName[0]}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-[15px] font-bold text-[#0f172a]">{broker.firstName} {broker.lastName}</p>
          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-bold text-green-700">
            <CheckCircle2 size={10} />
            Active
          </span>
        </div>
        <p className="text-[13px] text-[#64748b] mt-0.5 flex items-center gap-1.5">
          <Building2 size={13} />
          <span className="truncate">{property.title}</span>
          <span className="text-[#cbd5e1]">·</span>
          <span className="text-[#94a3b8]">{property.unit}</span>
        </p>
        <p className="text-[11px] text-[#94a3b8] mt-1">
          Assigned by Admin on {new Date(assignment.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      </div>

      {/* Read-only action — message only, no release control */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onMessage}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#e2e8f0] bg-white px-4 py-2 text-[13px] font-semibold text-[#0f172a] hover:bg-[#f8fafc] transition-colors cursor-pointer"
        >
          <MessageSquare size={14} />
          Message
        </button>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function OwnerBrokerManagement() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const ownerId = user?.id ?? ''

  const { activeBrokers } = useOwnerBrokerStore(ownerId)

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12">
      <div className="max-w-[900px] mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[28px] font-extrabold text-[#0f172a] tracking-tight">Broker Management</h1>
          <p className="text-[14px] text-[#64748b] mt-1">
            Brokers are assigned to your properties by the Rentilo platform team. You can message
            any broker once they're assigned.
          </p>
        </div>

        {/* ── Info banner — explains the Admin-mediated model ── */}
        <div className="mb-8 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
          <ShieldCheck size={18} className="text-blue-600 shrink-0 mt-0.5" />
          <p className="text-[13px] text-blue-900 leading-relaxed">
            Broker assignment is managed centrally by Rentilo admins to ensure quality and
            compliance. If you'd like a broker assigned or removed, contact support and our team
            will coordinate the change.
          </p>
        </div>

        {/* ── Active brokers (read-only) ───────────────────── */}
        <section>
          <h2 className="text-[16px] font-bold text-[#0f172a] mb-4">Active Brokers</h2>

          {activeBrokers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#e2e8f0] bg-white p-8 text-center">
              <UserCheck size={28} className="mx-auto text-[#cbd5e1] mb-2" />
              <p className="text-[14px] font-semibold text-[#64748b]">No brokers assigned yet</p>
              <p className="text-[13px] text-[#94a3b8] mt-1">
                Once an admin assigns a broker to one of your properties, they'll appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeBrokers.map((bundle) => (
                <ActiveBrokerCard
                  key={bundle.assignment.id}
                  bundle={bundle}
                  onMessage={() => navigate(ROUTES.OWNER.MESSAGES)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
