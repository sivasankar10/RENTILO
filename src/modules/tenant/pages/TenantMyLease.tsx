import { useNavigate } from 'react-router-dom'
import { Building2, DoorOpen, FileSignature, KeyRound, MessageCircle, ReceiptText, ShieldCheck } from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { useOnboardingStore } from '@shared/store/onboardingStore'
import { useTenantChatStore } from '../store/chatStore'
import { useTenantId } from '../hooks/useTenantId'

export function TenantMyLease() {
  const navigate = useNavigate()
  const tenantId = useTenantId()
  const ensureOwnerConversation = useTenantChatStore((state) => state.ensureOwnerConversation)
  const records = useOnboardingStore((state) =>
    state.records.filter((record) => record.tenant.id === tenantId && record.lease),
  )

  if (!records.length) {
    return (
      <div className="rounded-card border border-outline bg-white p-10 text-center shadow-surface">
        <Building2 size={48} className="mx-auto text-text-muted" />
        <h1 className="mt-4 text-heading-2 font-bold text-navy">No lease yet</h1>
        <p className="mt-2 text-body text-text-muted">My Lease appears after agreement approval and onboarding payment.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-filter-label font-bold uppercase tracking-wider text-primary">Tenant Account</p>
        <h1 className="mt-2 text-heading-1 font-bold text-navy">My Lease</h1>
        <p className="mt-1 text-body text-text-muted">Track lease activation, payment and property access.</p>
      </div>

      {records.map((record) => {
        const active = record.lease?.status === 'active'
        const latest = record.agreementVersions[record.agreementVersions.length - 1]
        const agreementLabel = latest?.tenantApprovedAt
          ? `Signed ${latest.tenantApprovedAt}`
          : latest
            ? `Term: ${latest.startDate} – ${latest.endDate}`
            : 'Awaiting agreement'

        const openOwnerChat = () => {
          const conversationId = ensureOwnerConversation({
            onboardingId: record.id,
            ownerId: record.owner.id,
            ownerName: record.owner.name,
            tenantId: record.tenant.id,
            tenantName: record.tenant.name,
            tenantAvatar: record.tenant.avatar,
            propertyName: record.propertyName,
            unit: record.unit,
            address: record.address,
            monthlyRent: record.monthlyRent,
          })
          navigate(`${ROUTES.TENANT.MESSAGES}?conversationId=${conversationId}`)
        }

        return (
          <section key={record.id} className="overflow-hidden rounded-card border border-outline bg-white shadow-surface">
            <header className="flex flex-wrap items-start justify-between gap-4 bg-navy px-7 py-6 text-white">
              <div>
                <p className="text-filter-label font-bold uppercase tracking-wider text-white/60">{record.lease?.id}</p>
                <h2 className="mt-2 text-heading-2 font-bold">{record.propertyName}</h2>
                <p className="mt-1 text-body text-white/70">{record.unit} - {record.address}</p>
              </div>
              <span className={active ? 'rounded-pill bg-green-100 px-3 py-1 text-badge font-bold text-green-700' : 'rounded-pill bg-amber-100 px-3 py-1 text-badge font-bold text-amber-700'}>
                {active ? 'ACTIVE' : 'PENDING OWNER ONBOARDING'}
              </span>
            </header>

            <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
              <LeaseTile icon={ShieldCheck} label="Owner" value={record.owner.name} />
              <LeaseTile icon={ReceiptText} label="Payment" value={record.payment?.transactionId ?? 'Pending'} />
              <LeaseTile icon={FileSignature} label="Agreement" value={agreementLabel} />
              <LeaseTile icon={KeyRound} label="Digital Access" value={record.lease?.accessKey ?? 'Issued after onboarding'} />
            </div>

            <div className="flex flex-wrap gap-3 border-t border-outline px-6 py-4">
              <button onClick={() => navigate(ROUTES.TENANT.AGREEMENT(record.id))} className="rounded-button border border-outline px-4 py-2 text-body font-bold text-navy">View Agreement</button>
              {active && (
                <>
                  <button type="button" onClick={openOwnerChat} className="inline-flex items-center gap-2 rounded-button border border-outline px-4 py-2 text-body font-bold text-navy">
                    <MessageCircle size={16} /> Message Owner
                  </button>
                  <button onClick={() => navigate(ROUTES.TENANT.MAINTENANCE)} className="rounded-button bg-navy px-4 py-2 text-body font-bold text-white">Raise Maintenance Request</button>
                  <button onClick={() => navigate(ROUTES.TENANT.EXIT_NOTICE)} className="inline-flex items-center gap-2 rounded-button border border-outline px-4 py-2 text-body font-bold text-navy">
                    <DoorOpen size={16} /> {record.lease?.exitNotice ? 'View Exit Notice' : 'Initiate Exit Notice'}
                  </button>
                </>
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}

function LeaseTile({ icon: Icon, label, value }: { icon: typeof ShieldCheck; label: string; value: string }) {
  return <div className="rounded-button bg-canvas-alt p-4"><Icon size={18} className="text-primary" /><p className="mt-3 text-filter-label font-bold uppercase tracking-wider text-text-muted">{label}</p><p className="mt-1 break-words text-body font-bold text-navy">{value}</p></div>
}
