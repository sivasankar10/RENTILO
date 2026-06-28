import { useState } from 'react'
import { CheckCircle2, FileCheck2, Upload } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { MaterialIcon } from './MaterialIcon'
import { KycVerificationModal } from './KycVerificationModal'
import { useTenantKycStore } from '../store/tenantKycStore'

const inputClass =
  'w-full px-3.5 py-3 border border-brand-outline-variant rounded-lg font-body text-[15px] text-brand-on-surface bg-brand-container-lowest outline-none focus:border-brand'

export function TenantKycSection() {
  const status = useTenantKycStore((s) => s.status)
  const document = useTenantKycStore((s) => s.document)
  const [showModal, setShowModal] = useState(false)
  const isVerified = status === 'verified'

  return (
    <section className="mb-9">
      <h2 className="font-display text-lg font-extrabold text-brand mb-5">KYC Verification</h2>

      <div className="grid gap-4 sm:grid-cols-2 mb-5">
        {[
          { label: 'Identity Check', value: isVerified ? 'Verified' : 'Pending' },
          { label: 'Address Proof', value: isVerified ? 'On file' : 'Not submitted' },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-brand-outline-variant bg-brand-container-low p-5"
          >
            <p className="text-[11px] font-bold uppercase tracking-wider text-brand-outline">
              {item.label}
            </p>
            <p className="mt-2 flex items-center gap-2 text-[16px] font-extrabold text-brand">
              {isVerified && <CheckCircle2 size={17} className="text-green-600 shrink-0" />}
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-brand-outline-variant bg-brand-container-lowest p-6 shadow-card">
        <div className="mb-5 rounded-xl bg-brand px-5 py-5 text-white">
          <p className="text-[11px] font-bold uppercase tracking-widest text-white/70">
            Verification Status
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-display text-[24px] font-extrabold">
                {isVerified ? 'KYC Verified' : 'Verification Required'}
              </p>
              <p className="mt-1 text-[13px] text-white/80">
                {isVerified
                  ? 'Your profile is eligible to schedule property visits and apply for leases.'
                  : 'Complete Aadhaar verification to schedule visits and proceed with applications.'}
              </p>
            </div>
            {document?.referenceId && (
              <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                {document.referenceId}
              </span>
            )}
          </div>
        </div>

        {isVerified && document ? (
          <div className="grid gap-4 sm:grid-cols-2 mb-5">
            <div>
              <p className="text-[13px] font-semibold text-brand-on-surface-variant mb-2">
                Aadhaar Number
              </p>
              <p className={inputClass}>{document.aadhaarMasked}</p>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-brand-on-surface-variant mb-2">
                Verified On
              </p>
              <p className={inputClass}>{document.verifiedAt}</p>
            </div>
          </div>
        ) : (
          <div className="mb-5">
            <label className="block text-[13px] font-semibold text-brand-on-surface-variant mb-2">
              KYC Update
            </label>
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-brand-pending-bg text-brand-pending-text border border-brand-pending-border text-[13px] font-bold tracking-wide">
              <MaterialIcon name="schedule" className="!text-xl" />
              <span>PENDING</span>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 border-t border-brand-outline-variant pt-5">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className={cn(
              'inline-flex items-center gap-2 rounded-[10px] px-5 py-3 text-[14px] font-semibold transition-colors',
              isVerified
                ? 'border border-brand-outline-variant bg-brand-container-low text-brand hover:bg-brand-container-high'
                : 'border-0 bg-brand text-white hover:opacity-90',
            )}
          >
            <FileCheck2 size={16} />
            {isVerified ? 'Re-verify Identity' : 'Start Verification'}
          </button>
          {isVerified && (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-[10px] border border-dashed border-brand-outline-variant bg-brand-container-low px-5 py-3 text-[14px] font-semibold text-brand"
            >
              <Upload size={16} />
              View Submitted Documents
            </button>
          )}
        </div>
      </div>

      <KycVerificationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onVerified={(aadhaarRaw) => {
          useTenantKycStore.getState().setVerified(aadhaarRaw)
          setShowModal(false)
        }}
      />
    </section>
  )
}
