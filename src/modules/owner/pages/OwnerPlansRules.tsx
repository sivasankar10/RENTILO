import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Banknote,
  Building2,
  CheckCircle2,
  ChevronRight,
  FileBadge,
  FileText,
  Link2,
  ShieldCheck,
} from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { KycVerificationModal } from '@modules/tenant/components/KycVerificationModal'
import { useOwnerStore } from '../store/ownerStore'
import { ListingPromotionPromoCard } from '../components/ListingPromotionPromoCard'

const tierFeatures = [
  'Up to 50 Properties',
  'Advanced Analytics',
  'Tenant Screening',
  'Priority Email Support',
]

export function OwnerPlansRules() {
  const navigate = useNavigate()
  const kycStatus = useOwnerStore((state) => state.kycStatus)
  const setKycStatus = useOwnerStore((state) => state.setKycStatus)
  const brokerIntegrationEnabled = useOwnerStore((state) => state.brokerIntegrationEnabled)
  const assignedBrokerId = useOwnerStore((state) => state.assignedBrokerId)
  const enableBrokerIntegration = useOwnerStore((state) => state.enableBrokerIntegration)
  const [businessStatus, setBusinessStatus] = useState(kycStatus === 'Verified' ? 'Verified' : 'Pending Upload')
  const [showKycModal, setShowKycModal] = useState(false)
  const [verificationMessage, setVerificationMessage] = useState('')
  const isVerified = kycStatus === 'Verified'
  const brokersEnabled = brokerIntegrationEnabled || Boolean(assignedBrokerId)

  const handleVerified = () => {
    setKycStatus('Verified')
    setBusinessStatus('Verified')
    setVerificationMessage('Owner KYC verified successfully for this session.')
  }

  return (
    <div className="min-h-screen bg-canvas-alt px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <header>
          <p className="text-filter-label uppercase text-text-muted">Management</p>
          <h1 className="mt-2 text-heading-1 font-bold tracking-tight text-text-primary">
            Owner Plans & Rules
          </h1>
          <p className="mt-2 text-body-lg text-text-muted">
            Configure your management tier, verify your identity, and set global reassignment
            logic.
          </p>
        </header>

        <div className="mt-10 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <article className="rounded-card border border-outline bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-heading-2 font-bold leading-tight text-text-primary">
                  KYC
                  <br />
                  Verification
                </h2>
                <span className={isVerified ? 'rounded-sm bg-status-success-bg px-2 py-1 text-badge uppercase text-status-success-text' : 'rounded-sm bg-status-error-bg px-2 py-1 text-badge uppercase text-status-error-text'}>
                  {isVerified ? 'Verified' : 'Required'}
                </span>
              </div>

              <p className="mt-5 text-body leading-6 text-text-muted">
                Complete Aadhaar verification to enable automated payment processing and broker
                assignments.
              </p>

              <div className="mt-6 space-y-4">
                <button
                  type="button"
                  onClick={() => setShowKycModal(true)}
                  className="flex w-full items-center gap-4 rounded-button bg-hover-light p-4 text-left transition-all duration-200 hover:bg-active"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-button bg-white text-navy">
                    <FileBadge size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-label font-bold text-text-primary">Identity Document</p>
                    <p className="text-label text-text-muted">{kycStatus}</p>
                  </div>
                  <ChevronRight size={18} className="text-text-muted" />
                </button>

                <button
                  type="button"
                  onClick={() => setBusinessStatus(isVerified ? 'Verified' : 'Pending KYC')}
                  className="flex w-full items-center gap-4 rounded-button bg-hover-light p-4 text-left transition-all duration-200 hover:bg-active"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-button bg-white text-navy">
                    <Building2 size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-label font-bold text-text-primary">Business Registration</p>
                    <p className="text-label text-text-muted">{businessStatus}</p>
                  </div>
                  <ChevronRight size={18} className="text-text-muted" />
                </button>
              </div>

              {verificationMessage && (
                <p className="mt-5 rounded-button bg-status-success-bg px-4 py-3 text-label font-semibold text-status-success-text">
                  {verificationMessage}
                </p>
              )}

              <button
                type="button"
                onClick={() => { if (!isVerified) setShowKycModal(true) }}
                disabled={isVerified}
                className={isVerified ? 'mt-6 w-full cursor-default rounded-button bg-status-success-bg px-4 py-3 text-body font-semibold text-status-success-text' : 'mt-6 w-full rounded-button bg-navy px-4 py-3 text-body font-semibold text-white transition-all duration-200 hover:bg-slate-800 hover:shadow-md'}
              >
                {isVerified ? 'Verified KYC' : 'Start Verification'}
              </button>
            </article>

            <article className="rounded-card border border-outline bg-white p-6 shadow-sm">
              <h2 className="text-heading-2 font-bold text-text-primary">Broker Integration</h2>

              <div className="mt-6 rounded-button border border-primary-100 bg-primary-50 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-button bg-white text-primary">
                    <Link2 size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-label font-bold text-text-primary">Assign Brokers</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!brokersEnabled) {
                        enableBrokerIntegration()
                      }
                    }}
                    disabled={brokersEnabled}
                    className={
                      brokersEnabled
                        ? 'flex h-6 w-11 cursor-default items-center justify-end rounded-pill bg-primary p-1'
                        : 'flex h-6 w-11 items-center justify-start rounded-pill bg-primary-100 p-1'
                    }
                    aria-pressed={brokersEnabled}
                  >
                    <span className="h-4 w-4 rounded-full bg-white shadow-sm" />
                  </button>
                </div>
              </div>

              <p className="mt-5 text-label leading-5 text-text-muted">
                When enabled, broker recommendations and assignment tools are available in your
                portfolio for the current session.
              </p>
            </article>

            <ListingPromotionPromoCard compact />
          </aside>

          <section className="rounded-card border border-outline bg-white p-6 shadow-sm">
            <h2 className="text-heading-2 font-bold text-text-primary">Management Tiers</h2>
            <p className="mt-2 max-w-md text-body text-text-muted">
              Choose the infrastructure that scales with your portfolio.
            </p>

            <div className="mt-10 rounded-card border border-outline bg-white p-8 shadow-sm">
              <div className="flex items-center gap-4">
                <span className="h-px flex-1 bg-outline" />
                <span className="text-label text-text-muted">Popular</span>
                <span className="h-px flex-1 bg-outline" />
              </div>

              <div className="mt-5">
                <h3 className="text-heading-2 font-bold text-text-primary">Premium</h3>
                <div className="mt-3 flex items-end gap-2">
                  <span className="text-5xl font-black tracking-tight text-text-primary">$149</span>
                  <span className="pb-2 text-body text-text-muted">/month</span>
                </div>
              </div>

              <ul className="mt-8 space-y-5">
                {tierFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-body text-text-primary">
                    <CheckCircle2 size={16} className="text-navy" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => navigate(ROUTES.OWNER.PREMIUM_PAYMENT)}
                className="mt-12 w-full rounded-button border-2 border-text-primary bg-white px-4 py-3 text-body font-semibold text-text-primary transition-all duration-200 hover:bg-navy hover:text-white"
              >
                Select Premium
              </button>
            </div>
          </section>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <article className="flex items-start gap-4 rounded-card border border-outline bg-white p-5 shadow-sm">
            <ShieldCheck className="mt-1 text-primary" size={20} />
            <div>
              <h3 className="text-body font-bold text-text-primary">Verified Management</h3>
              <p className="mt-1 text-label leading-5 text-text-muted">
                Identity checks unlock payment and broker workflows.
              </p>
            </div>
          </article>
          <article className="flex items-start gap-4 rounded-card border border-outline bg-white p-5 shadow-sm">
            <Banknote className="mt-1 text-status-warning-text" size={20} />
            <div>
              <h3 className="text-body font-bold text-text-primary">Automated Payments</h3>
              <p className="mt-1 text-label leading-5 text-text-muted">
                Premium rules support recurring and reassigned revenue flows.
              </p>
            </div>
          </article>
          <article className="flex items-start gap-4 rounded-card border border-outline bg-white p-5 shadow-sm">
            <FileText className="mt-1 text-status-error-text" size={20} />
            <div>
              <h3 className="text-body font-bold text-text-primary">Global Rules</h3>
              <p className="mt-1 text-label leading-5 text-text-muted">
                Keep reassignment policies consistent across the portfolio.
              </p>
            </div>
          </article>
        </div>
      </div>

      <KycVerificationModal
        isOpen={showKycModal}
        onClose={() => setShowKycModal(false)}
        onVerified={() => handleVerified()}
      />
    </div>
  )
}






