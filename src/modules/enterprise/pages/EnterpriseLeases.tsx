import { useMemo, useState } from 'react'
import { CalendarCheck, Check, FileSignature, Phone, Send, X } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { useAuth } from '@shared/hooks/useAuth'
import {
  type AgreementTerms,
  type OnboardingRecord,
  useOnboardingStore,
} from '@shared/store/onboardingStore'
import { useEnterpriseContext } from '../hooks/useEnterpriseContext'

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
  ownerSignature: record.owner.name,
})

export function EnterpriseLeases() {
  const { user } = useAuth()
  const ownerId = user?.id ?? ''
  const { enterpriseBlocks } = useEnterpriseContext()
  const [tab, setTab] = useState<'applications' | 'leases' | 'agreements'>('applications')
  const [draftFor, setDraftFor] = useState<OnboardingRecord | null>(null)
  const [terms, setTerms] = useState<AgreementTerms | null>(null)

  const records = useOnboardingStore((state) => state.records)
  const approveTenant = useOnboardingStore((state) => state.approveTenant)
  const rejectTenant = useOnboardingStore((state) => state.rejectTenant)
  const sendAgreement = useOnboardingStore((state) => state.sendAgreement)
  const confirmTenantOnboarding = useOnboardingStore((state) => state.confirmTenantOnboarding)

  // Get all property IDs owned by this enterprise
  const enterprisePropertyIds = useMemo(
    () => new Set(enterpriseBlocks.map((b) => b.id)),
    [enterpriseBlocks],
  )

  const ownerRecords = useMemo(
    () => records.filter((record) => record.owner.id === ownerId || enterprisePropertyIds.has(record.ownerPropertyId)),
    [ownerId, records, enterprisePropertyIds],
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

  return (
    <div className="space-y-6 pb-10">
      <header className="flex flex-col gap-4 border-b border-outline pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Enterprise Onboarding</p>
          <h1 className="mt-2 text-[28px] font-extrabold text-[#0f172a] tracking-tight">Applications & Leases</h1>
          <p className="mt-2 text-[14px] text-text-muted">Review tenant applications, issue agreements, and manage active leases across all units.</p>
        </div>
        <div className="flex gap-2" role="tablist">
          {(['applications', 'leases', 'agreements'] as const).map((item) => (
            <button key={item} type="button" onClick={() => setTab(item)} className={cn('rounded-lg px-4 py-2 text-[12px] font-bold capitalize', tab === item ? 'bg-[#0f172a] text-white' : 'border border-outline bg-white text-[#0f172a]')}>
              {item} ({item === 'applications' ? applications.length : item === 'leases' ? activeLeases.length : agreements.length})
            </button>
          ))}
        </div>
      </header>

      {tab === 'applications' && (
        <section className="space-y-4">
          {applications.map((record) => {
            const latest = record.agreementVersions.at(-1)
            return (
              <article key={record.id} className="rounded-xl border border-outline bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <img src={record.tenant.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-[15px] font-bold text-[#0f172a]">{record.tenant.name}</h2>
                        <span className="rounded-pill bg-primary-50 px-2.5 py-1 text-[10px] font-bold text-primary">{statusLabels[record.status]}</span>
                      </div>
                      <p className="mt-1 text-[12px] font-semibold text-text-primary">{record.propertyName} - {record.unit}</p>
                      <p className="mt-1 text-[12px] text-text-muted">{record.tenant.email} - {record.tenant.phone}</p>
                      {latest?.changeRequest && <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-[12px] font-semibold text-amber-700">Change requested: {latest.changeRequest}</p>}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <a href={`tel:${record.tenant.phone}`} className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline text-[#0f172a]"><Phone size={17} /></a>
                    {record.status === 'awaiting_owner_approval' && (
                      <>
                        <button type="button" onClick={() => rejectTenant(record.id)} className="rounded-lg border border-red-200 px-4 py-2.5 text-[12px] font-bold text-red-600">Reject</button>
                        <button type="button" onClick={() => approveTenant(record.id)} className="rounded-lg bg-[#0f172a] px-4 py-2.5 text-[12px] font-bold text-white">Approve</button>
                      </>
                    )}
                    {['owner_approved', 'agreement_requested', 'changes_requested'].includes(record.status) && (
                      <button type="button" onClick={() => openAgreement(record)} className="flex items-center gap-2 rounded-lg bg-[#0f172a] px-4 py-2.5 text-[12px] font-bold text-white">
                        <FileSignature size={16} /> Send Agreement
                      </button>
                    )}
                    {record.status === 'payment_completed' && (
                      <button type="button" onClick={() => confirmTenantOnboarding(record.id)} className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-[12px] font-bold text-white"><Check size={16} /> Onboard</button>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
          {applications.length === 0 && <EmptyState title="No applications yet" body="Tenant rental applications will appear here when they show interest in your units." />}
        </section>
      )}

      {tab === 'leases' && (
        <section className="grid gap-5 md:grid-cols-2">
          {activeLeases.map((record) => (
            <article key={record.id} className="rounded-xl border border-outline bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase text-green-600">Active Lease</p>
                  <h2 className="mt-2 text-[17px] font-bold text-[#0f172a]">{record.propertyName}</h2>
                  <p className="text-[12px] text-text-muted">{record.unit} - {record.address}</p>
                </div>
                <CalendarCheck className="text-green-600" size={20} />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4 border-y border-outline py-5 text-[12px]">
                <div><p className="font-semibold text-text-muted">Tenant</p><p className="mt-1 font-bold text-text-primary">{record.tenant.name}</p></div>
                <div><p className="font-semibold text-text-muted">Rent</p><p className="mt-1 font-bold text-text-primary">{record.monthlyRent}</p></div>
                <div><p className="font-semibold text-text-muted">Lease ID</p><p className="mt-1 font-bold text-text-primary">{record.lease?.id ?? '—'}</p></div>
                <div><p className="font-semibold text-text-muted">Access Key</p><p className="mt-1 font-bold text-text-primary">{record.lease?.accessKey ?? '—'}</p></div>
              </div>
              <div className="mt-4 flex gap-2">
                <a href={`tel:${record.tenant.phone}`} className="rounded-lg border border-outline px-3 py-2 text-[12px] font-bold text-[#0f172a]">Call</a>
              </div>
            </article>
          ))}
          {activeLeases.length === 0 && <EmptyState title="No active leases" body="Completed onboardings will appear here." />}
        </section>
      )}

      {tab === 'agreements' && (
        <section className="space-y-4">
          {agreements.map((record) => record.agreementVersions.map((agreement) => (
            <article key={agreement.id} className="flex flex-col gap-4 rounded-xl border border-outline bg-white p-5 md:flex-row md:items-center md:justify-between">
              <div><p className="text-[14px] font-bold text-[#0f172a]">{record.propertyName} - Version {agreement.version}</p><p className="mt-1 text-[12px] text-text-muted">{record.tenant.name} - Sent {agreement.sentAt}</p></div>
              <span className={cn('rounded-pill px-3 py-1 text-[10px] font-bold uppercase', agreement.tenantApprovedAt ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700')}>{agreement.tenantApprovedAt ? 'Signed' : 'Awaiting signature'}</span>
            </article>
          )))}
          {agreements.length === 0 && <EmptyState title="No agreements" body="Created rental agreements will appear here." />}
        </section>
      )}

      {/* Agreement Modal */}
      {draftFor && terms && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a]/55 p-4" role="dialog" aria-modal="true">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-xl">
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-outline bg-white p-6">
              <div><h2 className="text-[20px] font-bold text-[#0f172a]">Create Rental Agreement</h2><p className="mt-1 text-[12px] text-text-muted">{draftFor.tenant.name} - {draftFor.propertyName}</p></div>
              <button type="button" onClick={() => setDraftFor(null)} className="rounded-lg border border-outline p-2"><X size={18} /></button>
            </div>
            <div className="grid gap-4 p-6 md:grid-cols-2">
              <AgreementField label="Start date" type="date" value={terms.startDate} onChange={(v) => setTerms({ ...terms, startDate: v })} />
              <AgreementField label="End date" type="date" value={terms.endDate} onChange={(v) => setTerms({ ...terms, endDate: v })} />
              <AgreementField label="Monthly rent" value={terms.monthlyRent} onChange={(v) => setTerms({ ...terms, monthlyRent: v })} />
              <AgreementField label="Security deposit" value={terms.securityDeposit} onChange={(v) => setTerms({ ...terms, securityDeposit: v })} />
              <AgreementField label="Notice period" value={terms.noticePeriod} onChange={(v) => setTerms({ ...terms, noticePeriod: v })} />
              <AgreementField label="Owner signature" value={terms.ownerSignature} onChange={(v) => setTerms({ ...terms, ownerSignature: v })} />
            </div>
            <div className="sticky bottom-0 flex justify-end gap-3 border-t border-outline bg-white p-5">
              <button type="button" onClick={() => setDraftFor(null)} className="rounded-lg border border-outline px-5 py-3 text-[13px] font-bold">Cancel</button>
              <button type="button" onClick={submitAgreement} className="flex items-center gap-2 rounded-lg bg-[#0f172a] px-5 py-3 text-[13px] font-bold text-white"><Send size={17} /> Send to tenant</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function AgreementField({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="space-y-1.5">
      <span className="text-[12px] font-bold text-text-primary">{label}</span>
      <input required type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-outline px-3 py-2.5 text-[13px] outline-none focus:border-primary" />
    </label>
  )
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="col-span-full rounded-xl border border-dashed border-outline bg-white p-12 text-center">
      <h2 className="text-[17px] font-bold text-[#0f172a]">{title}</h2>
      <p className="mt-2 text-[13px] text-text-muted">{body}</p>
    </div>
  )
}
