import { useState, useEffect, useCallback, useMemo } from 'react'
import { cn } from '@shared/utils/cn'
import type { LeaseExitType } from '@shared/types/prototype'

export interface ExitNoticeSubmission {
  type: LeaseExitType
  moveOutDate: string
  moveOutDateIso: string
  earliestMoveOutDate: string
  earliestMoveOutDateIso: string
  noticePeriodDays: number
}

interface ExitNoticeModalProps {
  propertyTitle: string
  noticePeriodDays: number
  isOpen: boolean
  onClose: () => void
  onSubmit: (submission: ExitNoticeSubmission) => void
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}
function startOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}
function formatDisplayDate(date: Date) {
  return `${date.getDate()} ${MONTHS[date.getMonth()].slice(0, 3)} ${date.getFullYear()}`
}
function formatIsoDate(date: Date) {
  const y = date.getFullYear()
  const m = `${date.getMonth() + 1}`.padStart(2, '0')
  const d = `${date.getDate()}`.padStart(2, '0')
  return `${y}-${m}-${d}`
}

function DamageVisitNote() {
  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-[#eff6ff] border border-[#dbeafe]">
      <span className="material-symbols-outlined text-[20px] text-[#0F172A] mt-0.5" aria-hidden="true">home_repair_service</span>
      <p className="text-[13px] text-[#334155] leading-relaxed">
        After you submit, you'll schedule a visit for the owner to inspect the property for damages. Your security deposit will
        then be refunded, minus any damage costs, before the notice period ends.
      </p>
    </div>
  )
}

export function ExitNoticeModal({ propertyTitle, noticePeriodDays, isOpen, onClose, onSubmit }: ExitNoticeModalProps) {
  const today = useMemo(() => startOfDay(new Date()), [])

  // Earliest permitted move-out without penalty = today + notice period.
  const earliestMoveOut = useMemo(() => {
    const d = new Date(today)
    d.setDate(d.getDate() + noticePeriodDays)
    return startOfDay(d)
  }, [today, noticePeriodDays])

  const [mode, setMode] = useState<LeaseExitType>('notice_period')
  const [viewYear, setViewYear] = useState(earliestMoveOut.getFullYear())
  const [viewMonth, setViewMonth] = useState(earliestMoveOut.getMonth())
  const [selDay, setSelDay] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setMode('notice_period')
      setViewYear(earliestMoveOut.getFullYear())
      setViewMonth(earliestMoveOut.getMonth())
      setSelDay(null)
      setError('')
      setSubmitting(false)
    }
  }, [isOpen, earliestMoveOut])

  const handleEscape = useCallback((e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }, [onClose])
  useEffect(() => {
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [handleEscape])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDayOfMonth = getFirstDayOfMonth(viewYear, viewMonth)

  // A day is disabled if it falls before the earliest permitted move-out date.
  function isDisabled(day: number) {
    const d = startOfDay(new Date(viewYear, viewMonth, day))
    return d < earliestMoveOut
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11) }
    else setViewMonth((m) => m - 1)
    setSelDay(null)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0) }
    else setViewMonth((m) => m + 1)
    setSelDay(null)
  }

  const earliestIso = formatIsoDate(earliestMoveOut)
  const earliestDisplay = formatDisplayDate(earliestMoveOut)

  async function handleServeNotice() {
    if (!selDay) { setError('Select a move-out date after the notice period ends.'); return }
    const chosen = startOfDay(new Date(viewYear, viewMonth, selDay))
    if (chosen < earliestMoveOut) { setError('The selected date is within the notice period.'); return }
    setError('')
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 700))
    setSubmitting(false)
    onSubmit({
      type: 'notice_period',
      moveOutDate: formatDisplayDate(chosen),
      moveOutDateIso: formatIsoDate(chosen),
      earliestMoveOutDate: earliestDisplay,
      earliestMoveOutDateIso: earliestIso,
      noticePeriodDays,
    })
  }

  async function handleRequestEarlyExit() {
    setError('')
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 700))
    setSubmitting(false)
    onSubmit({
      type: 'immediate',
      moveOutDate: formatDisplayDate(today),
      moveOutDateIso: formatIsoDate(today),
      earliestMoveOutDate: earliestDisplay,
      earliestMoveOutDateIso: earliestIso,
      noticePeriodDays,
    })
  }

  const cells: (number | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-md" onClick={onClose} aria-hidden="true" />

      <div
        role="dialog" aria-modal="true" aria-label="Initiate exit notice"
        className="relative w-full max-w-[540px] bg-white rounded-2xl shadow-[0_24px_48px_-8px_rgba(0,0,0,0.18)] overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-[#f1f5f9] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eff6ff] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[20px] text-[#0F172A]" aria-hidden="true">logout</span>
            </div>
            <div>
              <h2 className="font-display text-[19px] font-extrabold text-[#0F172A] leading-tight">Initiate Exit Notice</h2>
              <p className="text-[12px] text-[#64748b] mt-0.5 truncate max-w-[280px]">{propertyTitle}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#94a3b8] hover:text-[#0F172A] hover:bg-[#f1f5f9] border-0 bg-transparent cursor-pointer transition-colors flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">close</span>
          </button>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-2 px-7 pt-5 flex-shrink-0">
          <button type="button" onClick={() => { setMode('notice_period'); setError('') }}
            className={cn(
              'flex-1 py-2.5 rounded-xl text-[13px] font-bold border-2 transition-all duration-150 cursor-pointer',
              mode === 'notice_period' ? 'border-[#0F172A] bg-[#0F172A] text-white' : 'border-[#e2e8f0] bg-white text-[#475569] hover:border-[#94a3b8]',
            )}>
            Serve Notice Period
          </button>
          <button type="button" onClick={() => { setMode('immediate'); setError('') }}
            className={cn(
              'flex-1 py-2.5 rounded-xl text-[13px] font-bold border-2 transition-all duration-150 cursor-pointer',
              mode === 'immediate' ? 'border-[#0F172A] bg-[#0F172A] text-white' : 'border-[#e2e8f0] bg-white text-[#475569] hover:border-[#94a3b8]',
            )}>
            Exit Early
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-7 py-6 flex flex-col gap-5">
          {mode === 'notice_period' ? (
            <>
              <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                <span className="material-symbols-outlined text-[20px] text-[#0F172A] mt-0.5" aria-hidden="true">event_upcoming</span>
                <p className="text-[13px] text-[#334155] leading-relaxed">
                  This property requires a <span className="font-bold">{noticePeriodDays}-day</span> notice period. You can move out on or after{' '}
                  <span className="font-bold text-[#0F172A]">{earliestDisplay}</span>. Earlier dates are unavailable.
                </p>
              </div>

              <DamageVisitNote />

              {/* Calendar */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <button type="button" onClick={prevMonth}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e2e8f0] bg-white hover:bg-[#f1f5f9] cursor-pointer transition-colors text-[#475569]">
                    <span className="material-symbols-outlined text-[18px]" aria-hidden="true">chevron_left</span>
                  </button>
                  <span className="font-display text-[15px] font-bold text-[#0F172A]">{MONTHS[viewMonth]} {viewYear}</span>
                  <button type="button" onClick={nextMonth}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e2e8f0] bg-white hover:bg-[#f1f5f9] cursor-pointer transition-colors text-[#475569]">
                    <span className="material-symbols-outlined text-[18px]" aria-hidden="true">chevron_right</span>
                  </button>
                </div>

                <div className="grid grid-cols-7 mb-1">
                  {DAYS.map((d) => (
                    <div key={d} className="text-center text-[11px] font-bold text-[#94a3b8] uppercase py-1">{d}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {cells.map((day, i) => {
                    if (!day) return <div key={`blank-${i}`} />
                    const disabled = isDisabled(day)
                    const isEarliest = formatIsoDate(new Date(viewYear, viewMonth, day)) === earliestIso
                    const selected = selDay === day
                    return (
                      <button key={day} type="button"
                        disabled={disabled}
                        onClick={() => { if (!disabled) { setSelDay(day); setError('') } }}
                        className={cn(
                          'aspect-square rounded-xl text-[13px] font-semibold border-0 transition-all duration-150',
                          disabled
                            ? 'text-[#cbd5e1] cursor-not-allowed bg-transparent'
                            : selected
                              ? 'bg-[#0F172A] text-white cursor-pointer shadow-sm'
                              : isEarliest
                                ? 'bg-[#eff6ff] text-[#0F172A] cursor-pointer font-bold ring-2 ring-[#0F172A]/20'
                                : 'text-[#0F172A] hover:bg-[#f1f5f9] cursor-pointer bg-transparent',
                        )}>
                        {day}
                      </button>
                    )
                  })}
                </div>
              </div>

              {selDay && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                  <span className="material-symbols-outlined text-[20px] text-[#0F172A]" aria-hidden="true">event_available</span>
                  <p className="text-[13px] text-[#0F172A] font-medium">
                    Move-out date: <span className="font-bold">{formatDisplayDate(new Date(viewYear, viewMonth, selDay))}</span>
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-[#fff7ed] border border-[#fed7aa]">
                <span className="material-symbols-outlined text-[20px] text-[#c2410c] mt-0.5" aria-hidden="true">bolt</span>
                <p className="text-[13px] text-[#7c2d12] leading-relaxed">
                  Leave before the {noticePeriodDays}-day notice period ends. The owner will set an early-exit penalty, which you'll
                  pay before scheduling the inspection.
                </p>
              </div>

              <ol className="space-y-3">
                {[
                  'You request an early exit.',
                  'The owner reviews and sets an early-exit penalty.',
                  'You pay the penalty.',
                  'You schedule the damage-inspection visit.',
                  'The owner inspects and refunds your deposit (minus damages).',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#0F172A] text-[11px] font-bold text-white">{i + 1}</span>
                    <span className="text-[13px] text-[#334155] leading-relaxed pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>

              <DamageVisitNote />
            </>
          )}

          {error && <p className="text-[13px] text-red-500 font-medium">{error}</p>}
        </div>

        {/* Footer */}
        <div className="px-7 pb-7 pt-4 border-t border-[#f1f5f9] flex gap-3 flex-shrink-0">
          <button type="button" onClick={onClose}
            className="flex-1 py-3.5 rounded-xl font-display text-[15px] font-bold text-[#475569] border-2 border-[#e2e8f0] bg-white hover:bg-[#f8fafc] transition-colors cursor-pointer">
            Cancel
          </button>
          <button type="button" onClick={mode === 'notice_period' ? handleServeNotice : handleRequestEarlyExit}
            disabled={submitting}
            className={cn(
              'flex-1 py-3.5 rounded-xl font-display text-[15px] font-bold text-white border-0 transition-all duration-150',
              submitting ? 'bg-[#94a3b8] cursor-not-allowed' : 'bg-[#0F172A] hover:bg-[#1e293b] cursor-pointer',
            )}>
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Processing…
              </span>
            ) : mode === 'notice_period' ? 'Confirm Exit Notice' : 'Request Early Exit'}
          </button>
        </div>
      </div>
    </div>
  )
}
