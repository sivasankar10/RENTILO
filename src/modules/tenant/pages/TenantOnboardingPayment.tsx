import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2, CreditCard, Landmark, ShieldCheck, Smartphone } from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { cn } from '@shared/utils/cn'
import { useOnboardingStore } from '@shared/store/onboardingStore'

const methods = [
  { id: 'UPI', icon: Smartphone },
  { id: 'Credit Card', icon: CreditCard },
  { id: 'Debit Card', icon: CreditCard },
  { id: 'Bank Transfer', icon: Landmark },
]

export function TenantOnboardingPayment() {
  const { onboardingId } = useParams<{ onboardingId: string }>()
  const navigate = useNavigate()
  const record = useOnboardingStore((state) => state.records.find((item) => item.id === onboardingId))
  const completePayment = useOnboardingStore((state) => state.completeOnboardingPayment)
  const [method, setMethod] = useState('UPI')
  const [reference, setReference] = useState('')
  const [complete, setComplete] = useState(Boolean(record?.payment))

  if (!record || !['agreement_approved', 'payment_completed', 'active'].includes(record.status)) {
    return <div className="rounded-card border border-outline bg-white p-10 text-center text-body text-text-muted">Payment is not available for this application.</div>
  }

  const pay = () => {
    completePayment(record.id, method, reference.trim())
    setComplete(true)
  }

  if (complete) {
    return (
      <div className="mx-auto max-w-2xl rounded-card border border-outline bg-white p-10 text-center shadow-surface">
        <CheckCircle2 size={52} className="mx-auto text-status-success" />
        <h1 className="mt-4 text-heading-1 font-bold text-navy">Payment completed</h1>
        <p className="mt-2 text-body text-text-muted">Your lease is waiting for final owner onboarding confirmation.</p>
        <button onClick={() => navigate(ROUTES.TENANT.MY_LEASE)} className="mt-6 rounded-button bg-navy px-6 py-3 font-bold text-white">View My Lease</button>
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_360px]">
      <section className="rounded-card border border-outline bg-white p-6 shadow-surface">
        <p className="text-filter-label font-bold uppercase tracking-wider text-primary">Secure Onboarding</p>
        <h1 className="mt-2 text-heading-1 font-bold text-navy">Complete Payment</h1>
        <p className="mt-2 text-body text-text-muted">Choose a dummy payment method. No real amount will be charged.</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {methods.map((item) => {
            const Icon = item.icon
            return (
              <button key={item.id} onClick={() => setMethod(item.id)} className={cn('flex items-center gap-3 rounded-button border px-4 py-4 text-left font-bold', method === item.id ? 'border-primary bg-primary-50 text-primary' : 'border-outline text-navy')}>
                <Icon size={20} /> {item.id}
              </button>
            )
          })}
        </div>

        <label className="mt-6 block">
          <span className="text-filter-label font-bold uppercase tracking-wider text-text-muted">Payment Reference</span>
          <input value={reference} onChange={(event) => setReference(event.target.value)} placeholder={method === 'UPI' ? 'name@upi' : 'Enter dummy account/card reference'} className="mt-2 h-12 w-full rounded-input border border-outline px-4 outline-none focus:border-primary" />
        </label>

        <button onClick={pay} disabled={!reference.trim()} className="mt-6 w-full rounded-button bg-navy px-6 py-4 text-body-lg font-bold text-white disabled:opacity-50">
          Pay First Month + Deposit
        </button>
      </section>

      <aside className="h-fit rounded-card border border-outline bg-canvas-alt p-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-primary" />
          <h2 className="text-heading-3 font-bold text-navy">Payment Summary</h2>
        </div>
        <div className="mt-5 space-y-4">
          <SummaryRow label="Property" value={record.propertyName} />
          <SummaryRow label="First Month Rent" value={record.monthlyRent} />
          <SummaryRow label="Security Deposit" value={record.securityDeposit} />
          <SummaryRow label="Payment Method" value={method} />
        </div>
      </aside>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-start justify-between gap-4 border-b border-outline pb-3"><span className="text-label text-text-muted">{label}</span><span className="text-right text-body font-bold text-navy">{value}</span></div>
}
