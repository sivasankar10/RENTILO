import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarCheck, Check, FileSignature, MessageCircle, Phone, Send, X } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { ROUTES } from '@shared/constants/routes'
import {
  DEMO_OWNER,
  type AgreementTerms,
  type OnboardingRecord,
  useOnboardingStore,
} from '@shared/store/onboardingStore'
import { useLeaseChatStore } from '@shared/store/leaseChatStore'
import { useOwnerChatStore } from '../store/chatStore'

const statusLabels: Record<OnboardingRecord['status'], string> = {
  interest_shown: 'Interest shown',
  visit_scheduled: 'Visit scheduled',
  visit_confirmed: 'Visit confirmed',
  awaiting_owner_approval: 'Awaiting approval',
  owner_approved: 'Tenant approved',
  agreement_requested: 'Agreement requested',
  agreement_sent: 'Agreement sent',
  changes_requested: 'Changes requested',
  agreement_approved: 'Tenant signed',
  payment_completed: 'Payment completed',
  active: 'Active lease',
  rejected: 'Rejected',
}

const defaultTerms = (record: OnboardingRecord): AgreementTerms => ({
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10),
  monthlyRent: record.monthlyRent,
  securityDeposit: record.securityDeposit,
  noticePeriod: '30 days',
  utilities: 'Electricity and internet paid by tenant. Water included in rent.',
  maintenanceResponsibility: 'Owner handles structural repairs; tenant handles routine upkeep.',
  petPolicy: 'Pets require written owner approval.',
  specialClauses: 'No subletting without written consent.',
  ownerSignature: DEMO_OWNER.name,
})

export function OwnerLeases() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<'applications' | 'leases' | 'agreements'>('applications')
  const [draftFor, setDraftFor] = useState<OnboardingRecord | null>(null)
  const [terms, setTerms] = useState<AgreementTerms | null>(null)
  const records = useOnboardingStore((state) => state.records)
  const approveTenant = useOnboardingStore((state) => state.approveTenant)
  const rejectTenant = useOnboardingStore((state) => state.rejectTenant)
  const sendAgreement = useOnboardingStore((state) => state.sendAgreement)
  const confirmTenantOnboarding = useOnboardingStore((state) => state.confirmTenantOnboarding)
  const ensureTenantConversation = useOwnerChatStore((state) => state.ensureTenantConversation)
  const ensureLeaseThread = useLeaseChatStore((state) => state.ensureThread)

  const ownerRecords = useMemo(
    () => records.filter((record) => record.owner.id === DEMO_OWNER.id),
    [records],
  )
  const applications = ownerRecords.filter((record) => !['active', 'rejected'].includes(record.status))
  const activeLeases = ownerRecords.filter((record) => record.status === 'active')
  const agreements = ownerRecords.filter((record) => record.agreementVersions.length > 0)

  const openAgreement = (record: OnboardingRecord) => {
    const latest = record.agreementVersions.at(-1)
    setDraftFor(record)
    setTerms(latest ? { ...latest } : defaultTerms(record))
  }

  const submitAgreement = () => {
    if (!draftFor || !terms) return
    sendAgreement(draftFor.id, terms)
    setDraftFor(null)
    setTerms(null)
  }

  const openLeaseDocuments = (record: OnboardingRecord) => {
    navigate(ROUTES.OWNER.LEASE_DOCUMENTS(record.id))
  }

  const openTenantChat = (record: OnboardingRecord) => {
    ensureLeaseThread({
      onboardingId: record.id,
      ownerId: record.owner.id,
      tenantId: record.tenant.id,
      tenantName: record.tenant.name,
      tenantAvatar: record.tenant.avatar,
      ownerName: record.owner.name,
      propertyName: record.propertyName,
      unit: record.unit,
      address: record.address,
      monthlyRent: record.monthlyRent,
    })
    const conversationId = ensureTenantConversation({
      tenantId: record.tenant.id,
      onboardingId: record.id,
      name: record.tenant.name,
      propertyName: record.propertyName,
      unit: record.unit,
      address: record.address,
      monthlyRent: record.monthlyRent,
      avatar: record.tenant.avatar,
    })
    navigate(`${ROUTES.OWNER.MESSAGES}?conversationId=${conversationId}`)
  }

  return (
    <div className="min-h-screen bg-canvas-alt px-5 py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 border-b border-outline pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-filter-label font-bold uppercase tracking-wider text-primary">Tenant onboarding</p>
            <h1 className="mt-2 text-heading-1 font-extrabold text-navy">Applications & Leases</h1>
            <p className="mt-2 text-body text-text-muted">Review applications, issue agreements, and activate paid leases.</p>
          </div>
          <div className="flex gap-2" role="tablist">
            {(['applications', 'leases', 'agreements'] as const).map((item) => (
              <button key={item} type="button" onClick={() => setTab(item)} className={cn('rounded-button px-4 py-2 text-label font-bold capitalize', tab === item ? 'bg-navy text-white' : 'border border-outline bg-white text-text-primary')}>
                {item} ({item === 'applications' ? applications.length : item === 'leases' ? activeLeases.length : agreements.length})
              </button>
            ))}
          </div>
        </header>

        {tab === 'applications' && (
          <section className="mt-7 space-y-4">
            {applications.map((record) => {
              const latest = record.agreementVersions.at(-1)
              return (
                <article key={record.id} className="rounded-card border border-outline bg-white p-5 shadow-surface">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                      <img src={record.tenant.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-body-lg font-bold text-navy">{record.tenant.name}</h2>
                          <span className="rounded-pill bg-primary-50 px-2.5 py-1 text-badge font-bold text-primary">{statusLabels[record.status]}</span>
                        </div>
                        <p className="mt-1 text-label font-semibold text-text-primary">{record.propertyName} � {record.unit}</p>
                        <p className="mt-1 text-label text-text-muted">{record.tenant.email} � {record.tenant.phone}</p>
                        {latest?.changeRequest && <p className="mt-2 rounded-button bg-status-warning-bg px-3 py-2 text-label font-semibold text-status-warning-text">Requested change: {latest.changeRequest}</p>}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <a href={`tel:${record.tenant.phone}`} title="Call tenant" className="flex h-10 w-10 items-center justify-center rounded-button border border-outline text-navy"><Phone size={17} /></a>
                      <button type="button" onClick={() => openTenantChat(record)} title="Chat with tenant" className="flex h-10 w-10 items-center justify-center rounded-button border border-outline text-navy"><MessageCircle size={17} /></button>
                      {record.status === 'awaiting_owner_approval' && (
                        <>
                          <button type="button" onClick={() => rejectTenant(record.id)} className="rounded-button border border-red-200 px-4 py-2.5 text-label font-bold text-red-600">Reject</button>
                          <button type="button" onClick={() => approveTenant(record.id)} className="rounded-button bg-navy px-4 py-2.5 text-label font-bold text-white">Approve tenant</button>
                        </>
                      )}
                      {['owner_approved', 'agreement_requested', 'changes_requested'].includes(record.status) && (
                        <button type="button" onClick={() => openAgreement(record)} className="flex items-center gap-2 rounded-button bg-navy px-4 py-2.5 text-label font-bold text-white">
                          <FileSignature size={16} />{' '}
                          {record.status === 'changes_requested'
                            ? 'Revise agreement'
                            : record.status === 'agreement_requested'
                              ? 'Send agreement'
                              : 'Create agreement'}
                        </button>
                      )}
                      {record.status === 'agreement_sent' && <span className="text-label font-semibold text-text-muted">Waiting for tenant review</span>}
                      {record.status === 'agreement_approved' && <span className="text-label font-semibold text-text-muted">Waiting for payment</span>}
                      {record.status === 'payment_completed' && <button type="button" onClick={() => confirmTenantOnboarding(record.id)} className="flex items-center gap-2 rounded-button bg-status-success px-4 py-2.5 text-label font-bold text-white"><Check size={16} /> Onboard tenant</button>}
                    </div>
                  </div>
                </article>
              )
            })}
            {applications.length === 0 && <EmptyCopy title="No applications yet" body="Tenant rental agreement requests will appear here." />}
          </section>
        )}

        {tab === 'leases' && (
          <section className="mt-7 grid gap-5 md:grid-cols-2">
            {activeLeases.map((record) => (
              <article
                key={record.id}
                role="button"
                tabIndex={0}
                onClick={() => openLeaseDocuments(record)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    openLeaseDocuments(record)
                  }
                }}
                className="cursor-pointer rounded-card border border-outline bg-white p-6 shadow-surface transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div><p className="text-filter-label font-bold uppercase text-status-success">Active lease</p><h2 className="mt-2 text-heading-3 font-bold text-navy">{record.propertyName}</h2><p className="text-label text-text-muted">{record.unit} · {record.address}</p></div>
                  <CalendarCheck className="text-status-success" />
                </div>
                <div className="mt-5 grid grid-cols-2 gap-4 border-y border-outline py-5 text-label">
                  <Info label="Tenant" value={record.tenant.name} /><Info label="Lease ID" value={record.lease?.id ?? '-'} /><Info label="Rent" value={record.monthlyRent} /><Info label="Access key" value={record.lease?.accessKey ?? '-'} />
                </div>
                <div className="mt-4 flex gap-2">
                  <a href={`tel:${record.tenant.phone}`} onClick={(event) => event.stopPropagation()} className="rounded-button border border-outline px-3 py-2 text-label font-bold text-navy">Call tenant</a>
                  <button type="button" onClick={(event) => { event.stopPropagation(); openTenantChat(record) }} className="rounded-button bg-navy px-3 py-2 text-label font-bold text-white">Chat</button>
                </div>
              </article>
            ))}
            {activeLeases.length === 0 && <EmptyCopy title="No active leases" body="A paid application appears here after you confirm tenant onboarding." />}
          </section>
        )}

        {tab === 'agreements' && (
          <section className="mt-7 space-y-4">
            {agreements.map((record) => record.agreementVersions.map((agreement) => (
              <article key={agreement.id} className="flex flex-col gap-4 rounded-card border border-outline bg-white p-5 md:flex-row md:items-center md:justify-between">
                <div><p className="text-body font-bold text-navy">{record.propertyName} � Version {agreement.version}</p><p className="mt-1 text-label text-text-muted">{record.tenant.name} � Sent {agreement.sentAt}</p></div>
                <span className={cn('rounded-pill px-3 py-1 text-badge font-bold uppercase', agreement.tenantApprovedAt ? 'bg-status-success-bg text-status-success' : 'bg-status-warning-bg text-status-warning-text')}>{agreement.tenantApprovedAt ? 'Signed' : 'Awaiting signature'}</span>
              </article>
            )))}
            {agreements.length === 0 && <EmptyCopy title="No agreements" body="Created rental agreements and their versions will appear here." />}
          </section>
        )}
      </div>

      {draftFor && terms && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/55 p-4" role="dialog" aria-modal="true">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-card bg-white shadow-modal">
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-outline bg-white p-6">
              <div><h2 className="text-heading-2 font-bold text-navy">Create Rental Agreement</h2><p className="mt-1 text-label text-text-muted">{draftFor.tenant.name} � {draftFor.propertyName}</p></div>
              <button type="button" onClick={() => setDraftFor(null)} className="rounded-button border border-outline p-2"><X size={18} /></button>
            </div>
            <div className="grid gap-4 p-6 md:grid-cols-2">
              <Field label="Start date" type="date" value={terms.startDate} onChange={(value) => setTerms({ ...terms, startDate: value })} />
              <Field label="End date" type="date" value={terms.endDate} onChange={(value) => setTerms({ ...terms, endDate: value })} />
              <Field label="Monthly rent" value={terms.monthlyRent} onChange={(value) => setTerms({ ...terms, monthlyRent: value })} />
              <Field label="Security deposit" value={terms.securityDeposit} onChange={(value) => setTerms({ ...terms, securityDeposit: value })} />
              <Field label="Notice period" value={terms.noticePeriod} onChange={(value) => setTerms({ ...terms, noticePeriod: value })} />
              <Field label="Owner signature" value={terms.ownerSignature} onChange={(value) => setTerms({ ...terms, ownerSignature: value })} />
              <TextField label="Utilities" value={terms.utilities} onChange={(value) => setTerms({ ...terms, utilities: value })} />
              <TextField label="Maintenance responsibilities" value={terms.maintenanceResponsibility} onChange={(value) => setTerms({ ...terms, maintenanceResponsibility: value })} />
              <TextField label="Pet policy" value={terms.petPolicy} onChange={(value) => setTerms({ ...terms, petPolicy: value })} />
              <TextField label="Special clauses" value={terms.specialClauses} onChange={(value) => setTerms({ ...terms, specialClauses: value })} />
            </div>
            <div className="sticky bottom-0 flex justify-end gap-3 border-t border-outline bg-white p-5"><button type="button" onClick={() => setDraftFor(null)} className="rounded-button border border-outline px-5 py-3 font-bold">Cancel</button><button type="button" onClick={submitAgreement} className="flex items-center gap-2 rounded-button bg-navy px-5 py-3 font-bold text-white"><Send size={17} /> Send to tenant</button></div>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <label className="space-y-1.5"><span className="text-label font-bold text-text-primary">{label}</span><input required type={type} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-input border border-outline px-3 py-2.5 outline-none focus:border-primary" /></label>
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="space-y-1.5"><span className="text-label font-bold text-text-primary">{label}</span><textarea rows={3} value={value} onChange={(event) => onChange(event.target.value)} className="w-full resize-none rounded-input border border-outline px-3 py-2.5 outline-none focus:border-primary" /></label>
}

function Info({ label, value }: { label: string; value: string }) { return <div><p className="font-semibold text-text-muted">{label}</p><p className="mt-1 font-bold text-text-primary">{value}</p></div> }
function EmptyCopy({ title, body }: { title: string; body: string }) { return <div className="col-span-full rounded-card border border-dashed border-outline bg-white p-12 text-center"><h2 className="text-heading-3 font-bold text-navy">{title}</h2><p className="mt-2 text-body text-text-muted">{body}</p></div> }
