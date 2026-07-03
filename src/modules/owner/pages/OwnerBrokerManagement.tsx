import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building2,
  CheckCircle2,
  MessageSquare,
  Star,
  UserCheck,
  UserMinus,
  UserX,
  X,
} from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { ROUTES } from '@shared/constants/routes'
import { useAuth } from '@shared/hooks/useAuth'
import { useOwnerBrokerStore } from '@shared/store/brokerAssignmentStore'
import type { BrokerAssignmentBundle } from '@shared/store/prototypeSelectors'

// ─── Confirm dialog ───────────────────────────────────────────────────────────

function ConfirmDialog({
  title,
  body,
  confirmLabel,
  confirmClass,
  onConfirm,
  onCancel,
}: {
  title: string
  body: string
  confirmLabel: string
  confirmClass: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="text-[17px] font-bold text-[#0f172a]">{title}</h3>
        <p className="mt-2 text-[14px] text-[#64748b]">{body}</p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-[#e2e8f0] bg-white px-4 py-2 text-[13px] font-semibold text-[#475569] hover:bg-[#f8fafc] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cn('rounded-xl px-4 py-2 text-[13px] font-semibold text-white cursor-pointer', confirmClass)}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Broker card ─────────────────────────────────────────────────────────────

function BrokerRequestCard({
  bundle,
  onApprove,
  onReject,
}: {
  bundle: BrokerAssignmentBundle
  onApprove: () => void
  onReject: () => void
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
        <p className="text-[15px] font-bold text-[#0f172a]">{broker.firstName} {broker.lastName}</p>
        <p className="text-[13px] text-[#64748b] mt-0.5 flex items-center gap-1.5">
          <Building2 size={13} />
          <span className="truncate">{property.title}</span>
          <span className="text-[#cbd5e1]">·</span>
          <span className="text-[#94a3b8]">{property.unit}</span>
        </p>
        <p className="text-[11px] text-[#94a3b8] mt-1">
          Requested {new Date(assignment.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onApprove}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f172a] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#1e293b] transition-colors cursor-pointer"
        >
          <UserCheck size={14} />
          Approve
        </button>
        <button
          type="button"
          onClick={onReject}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#e2e8f0] bg-white px-4 py-2 text-[13px] font-semibold text-[#ef4444] hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer"
        >
          <UserX size={14} />
          Decline
        </button>
      </div>
    </div>
  )
}

function ActiveBrokerCard({
  bundle,
  onRelease,
  onMessage,
}: {
  bundle: BrokerAssignmentBundle
  onRelease: () => void
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
          Active since {new Date(assignment.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onMessage}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#e2e8f0] bg-white px-4 py-2 text-[13px] font-semibold text-[#0f172a] hover:bg-[#f8fafc] transition-colors cursor-pointer"
        >
          <MessageSquare size={14} />
          Message
        </button>
        <button
          type="button"
          onClick={onRelease}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#e2e8f0] bg-white px-4 py-2 text-[13px] font-semibold text-[#ef4444] hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer"
        >
          <UserMinus size={14} />
          Release
        </button>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

type DialogState =
  | { type: 'approve'; bundle: BrokerAssignmentBundle }
  | { type: 'reject'; bundle: BrokerAssignmentBundle }
  | { type: 'release'; bundle: BrokerAssignmentBundle }
  | null

export function OwnerBrokerManagement() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const ownerId = user?.id ?? ''

  const { pendingRequests, activeBrokers, approveBrokerAssignment, rejectBrokerAssignment, releaseBrokerAssignment } =
    useOwnerBrokerStore(ownerId)

  const [dialog, setDialog] = useState<DialogState>(null)
  const [toast, setToast] = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 4000)
  }

  function handleConfirm() {
    if (!dialog) return
    if (dialog.type === 'approve') {
      approveBrokerAssignment(dialog.bundle.assignment.id)
      showToast(`${dialog.bundle.broker.firstName} approved and notified.`)
    } else if (dialog.type === 'reject') {
      rejectBrokerAssignment(dialog.bundle.assignment.id)
      showToast(`Request from ${dialog.bundle.broker.firstName} declined.`)
    } else if (dialog.type === 'release') {
      releaseBrokerAssignment(dialog.bundle.assignment.id)
      showToast(`${dialog.bundle.broker.firstName} has been released.`)
    }
    setDialog(null)
  }

  const dialogConfig = {
    approve: {
      title: 'Approve broker request?',
      body: `${dialog?.bundle.broker.firstName ?? ''} will be assigned to ${dialog?.bundle.property.title ?? ''} and notified immediately.`,
      confirmLabel: 'Approve',
      confirmClass: 'bg-[#0f172a] hover:bg-[#1e293b]',
    },
    reject: {
      title: 'Decline broker request?',
      body: `${dialog?.bundle.broker.firstName ?? ''}'s request will be declined. They will be notified.`,
      confirmLabel: 'Decline',
      confirmClass: 'bg-red-500 hover:bg-red-600',
    },
    release: {
      title: 'Release broker assignment?',
      body: `${dialog?.bundle.broker.firstName ?? ''} will be removed from ${dialog?.bundle.property.title ?? ''}. This cannot be undone.`,
      confirmLabel: 'Release',
      confirmClass: 'bg-red-500 hover:bg-red-600',
    },
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12">
      <div className="max-w-[900px] mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[28px] font-extrabold text-[#0f172a] tracking-tight">Broker Management</h1>
          <p className="text-[14px] text-[#64748b] mt-1">
            Review broker access requests and manage active assignments for your properties.
          </p>
        </div>

        {/* ── Pending requests ─────────────────────────────── */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-[16px] font-bold text-[#0f172a]">Access Requests</h2>
            {pendingRequests.length > 0 && (
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-white">
                {pendingRequests.length}
              </span>
            )}
          </div>

          {pendingRequests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#e2e8f0] bg-white p-8 text-center">
              <Star size={28} className="mx-auto text-[#cbd5e1] mb-2" />
              <p className="text-[14px] font-semibold text-[#64748b]">No pending requests</p>
              <p className="text-[13px] text-[#94a3b8] mt-1">
                Brokers can request access to your listings. Requests will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((bundle) => (
                <BrokerRequestCard
                  key={bundle.assignment.id}
                  bundle={bundle}
                  onApprove={() => setDialog({ type: 'approve', bundle })}
                  onReject={() => setDialog({ type: 'reject', bundle })}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── Active brokers ───────────────────────────────── */}
        <section>
          <h2 className="text-[16px] font-bold text-[#0f172a] mb-4">Active Brokers</h2>

          {activeBrokers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#e2e8f0] bg-white p-8 text-center">
              <UserCheck size={28} className="mx-auto text-[#cbd5e1] mb-2" />
              <p className="text-[14px] font-semibold text-[#64748b]">No active brokers</p>
              <p className="text-[13px] text-[#94a3b8] mt-1">
                Approve a broker request above to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeBrokers.map((bundle) => (
                <ActiveBrokerCard
                  key={bundle.assignment.id}
                  bundle={bundle}
                  onRelease={() => setDialog({ type: 'release', bundle })}
                  onMessage={() => navigate(ROUTES.OWNER.MESSAGES)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ── Confirm dialog ─────────────────────────────────── */}
      {dialog && dialogConfig[dialog.type] && (
        <ConfirmDialog
          {...dialogConfig[dialog.type]}
          onConfirm={handleConfirm}
          onCancel={() => setDialog(null)}
        />
      )}

      {/* ── Toast ──────────────────────────────────────────── */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 rounded-xl bg-[#0f172a] px-5 py-3.5 text-[13px] font-semibold text-white shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 size={16} className="text-green-400 shrink-0" />
          {toast}
          <button type="button" onClick={() => setToast(null)} className="ml-2 text-white/60 hover:text-white cursor-pointer border-0 bg-transparent p-0">
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
