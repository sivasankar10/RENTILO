import { useState } from 'react'
import { cn } from '@shared/utils/cn'

// ─── Types ────────────────────────────────────────────────────────────────────

type StepStatus = 'done' | 'active' | 'pending'

interface ProgressStep {
  id: string
  icon: string
  label: string
  description: string
  status: StepStatus
  tag?: string
}

// ─── Default steps (mock — matches screenshot) ────────────────────────────────

const DEFAULT_STEPS: ProgressStep[] = [
  { id: 'interest',  icon: 'check',          label: 'Interest Shown',     description: 'Application submitted on Oct 24, 2024',       status: 'done'    },
  { id: 'visit',     icon: 'check',          label: 'Visited Property',   description: 'Tour completed with host on Oct 26, 2024',     status: 'done'    },
  { id: 'approval',  icon: 'sync',           label: 'Approval from Owner',description: 'The host is currently reviewing your profile.', status: 'active', tag: 'ESTIMATED WAIT: 24 HOURS' },
  { id: 'lease',     icon: 'description',    label: 'Lease Signed',       description: 'Pending owner approval',                       status: 'pending' },
  { id: 'payment',   icon: 'payments',       label: 'Payment',            description: 'First month and security deposit',             status: 'pending' },
  { id: 'checkin',   icon: 'key',            label: 'Check-in',           description: 'Receive digital access keys',                  status: 'pending' },
]

// ─── Step icon ────────────────────────────────────────────────────────────────

function StepIcon({ step }: { step: ProgressStep }) {
  if (step.status === 'done') {
    return (
      <div className="w-11 h-11 rounded-xl bg-[#0F172A] flex items-center justify-center flex-shrink-0 shadow-sm">
        <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: "'wght' 700" }} aria-hidden="true">check</span>
      </div>
    )
  }
  if (step.status === 'active') {
    return (
      <div className="w-11 h-11 rounded-xl bg-[#1e3a5f] flex items-center justify-center flex-shrink-0 shadow-sm">
        <span className="material-symbols-outlined text-white text-[18px] animate-spin" style={{ animationDuration: '2s' }} aria-hidden="true">sync</span>
      </div>
    )
  }
  return (
    <div className="w-11 h-11 rounded-xl bg-[#f1f5f9] border-2 border-[#e2e8f0] flex items-center justify-center flex-shrink-0">
      <span className="material-symbols-outlined text-[#94a3b8] text-[18px]" aria-hidden="true">{step.icon}</span>
    </div>
  )
}

// ─── Edit Step Modal ──────────────────────────────────────────────────────────

interface EditStepModalProps {
  step: ProgressStep
  onClose: () => void
  onSave: (updated: Partial<ProgressStep>) => void
}

function EditStepModal({ step, onClose, onSave }: EditStepModalProps) {
  const [label,       setLabel]       = useState(step.label)
  const [description, setDescription] = useState(step.description)
  const [status,      setStatus]      = useState<StepStatus>(step.status)
  const [tag,         setTag]         = useState(step.tag ?? '')

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    onSave({ label, description, status, tag: tag.trim() || undefined })
    onClose()
  }

  const inputCls = 'w-full px-3.5 py-2.5 rounded-xl border-2 border-[#e2e8f0] outline-none font-body text-[14px] text-[#0F172A] bg-[#f8fafc] focus:border-[#0F172A] focus:bg-white transition-all'

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[#0F172A]/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-[400px] bg-white rounded-2xl shadow-[0_24px_48px_-8px_rgba(0,0,0,0.2)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#f1f5f9]">
          <h3 className="font-display text-[17px] font-extrabold text-[#0F172A]">Edit Step</h3>
          <button type="button" onClick={onClose} aria-label="Close"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#94a3b8] hover:text-[#0F172A] hover:bg-[#f1f5f9] border-0 bg-transparent cursor-pointer transition-colors">
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">close</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="px-6 py-5 flex flex-col gap-4">
          {/* Label */}
          <div>
            <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-1.5">Step Label</label>
            <input type="text" value={label} onChange={e => setLabel(e.target.value)} className={inputCls} required />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-1.5">Description</label>
            <textarea rows={2} value={description} onChange={e => setDescription(e.target.value)}
              className={cn(inputCls, 'resize-none')} required />
          </div>

          {/* Status */}
          <div>
            <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-1.5">Status</label>
            <div className="flex gap-2">
              {(['done', 'active', 'pending'] as StepStatus[]).map(s => (
                <button key={s} type="button" onClick={() => setStatus(s)}
                  className={cn(
                    'flex-1 py-2 rounded-xl text-[12px] font-bold border-2 cursor-pointer transition-all capitalize',
                    status === s
                      ? s === 'done'   ? 'border-green-600 bg-green-600 text-white'
                        : s === 'active' ? 'border-[#1e3a5f] bg-[#1e3a5f] text-white'
                        : 'border-[#94a3b8] bg-[#94a3b8] text-white'
                      : 'border-[#e2e8f0] bg-[#f8fafc] text-[#475569] hover:border-[#94a3b8]'
                  )}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Tag (optional) */}
          <div>
            <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-1.5">
              Tag <span className="normal-case font-normal text-[#94a3b8]">(optional)</span>
            </label>
            <input type="text" value={tag} onChange={e => setTag(e.target.value)}
              placeholder="e.g. ESTIMATED WAIT: 24 HOURS" className={inputCls} />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl font-display text-[14px] font-bold text-[#475569] border-2 border-[#e2e8f0] bg-white hover:bg-[#f8fafc] cursor-pointer transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-3 rounded-xl font-display text-[14px] font-bold text-white bg-[#0F172A] hover:bg-[#1e293b] border-0 cursor-pointer transition-colors">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

export function ApplicationProgressPanel() {
  const [steps, setSteps] = useState<ProgressStep[]>(DEFAULT_STEPS)
  const [editingStep, setEditingStep] = useState<ProgressStep | null>(null)

  function handleSave(id: string, updated: Partial<ProgressStep>) {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s))
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08)] overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[#f1f5f9]">
          <h3 className="font-display text-[18px] font-extrabold text-[#0F172A]">Application Progress</h3>
        </div>

        {/* Steps */}
        <div className="px-6 py-4 flex flex-col">
          {steps.map((step, idx) => (
            <div key={step.id} className="relative">
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div className={cn(
                  'absolute left-[21px] top-[44px] w-0.5 h-[calc(100%-8px)]',
                  step.status === 'done' ? 'bg-[#0F172A]' : 'bg-[#e2e8f0]'
                )} />
              )}

              {/* Step row */}
              <div className="flex items-start gap-4 py-3 group">
                <StepIcon step={step} />

                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={cn(
                      'text-[14px] font-bold leading-snug',
                      step.status === 'pending' ? 'text-[#94a3b8]' : 'text-[#0F172A]'
                    )}>
                      {step.label}
                    </p>
                    {step.status === 'active' && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
                    )}
                  </div>
                  <p className={cn(
                    'text-[12px] mt-0.5 leading-snug',
                    step.status === 'pending' ? 'text-[#cbd5e1]' : 'text-[#64748b]'
                  )}>
                    {step.description}
                  </p>
                  {step.tag && (
                    <span className="inline-block mt-1.5 px-2.5 py-1 rounded-lg bg-[#eff6ff] text-[#1d4ed8] text-[10px] font-bold tracking-wide">
                      {step.tag}
                    </span>
                  )}
                </div>

                {/* Edit button — visible on hover */}
                <button
                  type="button"
                  onClick={() => setEditingStep(step)}
                  aria-label={`Edit step: ${step.label}`}
                  className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-[#94a3b8] hover:text-[#0F172A] hover:bg-[#f1f5f9] border-0 bg-transparent cursor-pointer transition-all opacity-0 group-hover:opacity-100 mt-1"
                >
                  <span className="material-symbols-outlined text-[15px]" aria-hidden="true">edit</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Owner CTA */}
        <div className="px-6 pb-6 pt-2">
          <button type="button"
            className="w-full py-3.5 rounded-xl bg-[#0F172A] text-white font-display text-[13px] font-bold tracking-wider border-0 cursor-pointer hover:bg-[#1e293b] transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[16px]" aria-hidden="true">arrow_forward</span>
            CONTACT OWNER
          </button>
        </div>
      </div>

      {/* Edit modal */}
      {editingStep && (
        <EditStepModal
          step={editingStep}
          onClose={() => setEditingStep(null)}
          onSave={(updated) => handleSave(editingStep.id, updated)}
        />
      )}
    </>
  )
}
