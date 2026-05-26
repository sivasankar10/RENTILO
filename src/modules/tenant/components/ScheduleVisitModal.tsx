import { useState, useEffect, useCallback } from 'react'
import { cn } from '@shared/utils/cn'

interface ScheduleVisitModalProps {
  propertyTitle: string
  isOpen: boolean
  onClose: () => void
  onConfirmed: (date: string, time: string) => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

const TIME_SLOTS = [
  '9:00 AM','9:30 AM','10:00 AM','10:30 AM',
  '11:00 AM','11:30 AM','12:00 PM','12:30 PM',
  '2:00 PM','2:30 PM','3:00 PM','3:30 PM',
  '4:00 PM','4:30 PM','5:00 PM','5:30 PM',
]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}
function formatDisplayDate(year: number, month: number, day: number) {
  return `${day} ${MONTHS[month].slice(0, 3)} ${year}`
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ScheduleVisitModal({ propertyTitle, isOpen, onClose, onConfirmed }: ScheduleVisitModalProps) {
  const today = new Date()
  const [viewYear,  setViewYear]  = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selDay,    setSelDay]    = useState<number | null>(null)
  const [selTime,   setSelTime]   = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setViewYear(today.getFullYear())
      setViewMonth(today.getMonth())
      setSelDay(null)
      setSelTime(null)
      setError('')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  // Escape key
  const handleEscape = useCallback((e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }, [onClose])
  useEffect(() => {
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [handleEscape])

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const daysInMonth  = getDaysInMonth(viewYear, viewMonth)
  const firstDayOfMonth = getFirstDayOfMonth(viewYear, viewMonth)
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`

  function isPast(day: number) {
    const d = new Date(viewYear, viewMonth, day)
    d.setHours(0,0,0,0)
    const t = new Date(); t.setHours(0,0,0,0)
    return d < t
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
    setSelDay(null)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
    setSelDay(null)
  }

  async function handleConfirm() {
    if (!selDay) { setError('Please select a date.'); return }
    if (!selTime) { setError('Please select a time slot.'); return }
    setError('')
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 900))
    setSubmitting(false)
    onConfirmed(formatDisplayDate(viewYear, viewMonth, selDay), selTime)
    onClose()
  }

  // Build calendar grid (blanks + days)
  const cells: (number | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-md" onClick={onClose} aria-hidden="true" />

      <div
        role="dialog" aria-modal="true" aria-label="Schedule a visit"
        className="relative w-full max-w-[520px] bg-white rounded-2xl shadow-[0_24px_48px_-8px_rgba(0,0,0,0.18)] overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-[#f1f5f9] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eff6ff] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[20px] text-[#0F172A]" aria-hidden="true">calendar_month</span>
            </div>
            <div>
              <h2 className="font-display text-[19px] font-extrabold text-[#0F172A] leading-tight">Schedule a Visit</h2>
              <p className="text-[12px] text-[#64748b] mt-0.5 truncate max-w-[260px]">{propertyTitle}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#94a3b8] hover:text-[#0F172A] hover:bg-[#f1f5f9] border-0 bg-transparent cursor-pointer transition-colors flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">close</span>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-7 py-6 flex flex-col gap-6">

          {/* ── Calendar ── */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <button type="button" onClick={prevMonth}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e2e8f0] bg-white hover:bg-[#f1f5f9] border-0 cursor-pointer transition-colors text-[#475569]">
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">chevron_left</span>
              </button>
              <span className="font-display text-[15px] font-bold text-[#0F172A]">
                {MONTHS[viewMonth]} {viewYear}
              </span>
              <button type="button" onClick={nextMonth}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e2e8f0] bg-white hover:bg-[#f1f5f9] border-0 cursor-pointer transition-colors text-[#475569]">
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">chevron_right</span>
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
              {DAYS.map(d => (
                <div key={d} className="text-center text-[11px] font-bold text-[#94a3b8] uppercase py-1">{d}</div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                if (!day) return <div key={`blank-${i}`} />
                const past = isPast(day)
                const isToday = `${viewYear}-${viewMonth}-${day}` === todayKey
                const selected = selDay === day
                return (
                  <button key={day} type="button"
                    disabled={past}
                    onClick={() => { if (!past) { setSelDay(day); setError('') } }}
                    className={cn(
                      'aspect-square rounded-xl text-[13px] font-semibold border-0 transition-all duration-150',
                      past
                        ? 'text-[#cbd5e1] cursor-not-allowed bg-transparent'
                        : selected
                          ? 'bg-[#0F172A] text-white cursor-pointer shadow-sm'
                          : isToday
                            ? 'bg-[#eff6ff] text-[#0F172A] cursor-pointer font-bold ring-2 ring-[#0F172A]/20'
                            : 'text-[#0F172A] hover:bg-[#f1f5f9] cursor-pointer bg-transparent'
                    )}>
                    {day}
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── Time slots ── */}
          <div>
            <p className="text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-3">
              Available Time Slots
              {selDay && <span className="normal-case font-normal ml-1 text-[#94a3b8]">— {formatDisplayDate(viewYear, viewMonth, selDay)}</span>}
            </p>
            <div className="grid grid-cols-4 gap-2">
              {TIME_SLOTS.map(slot => (
                <button key={slot} type="button"
                  onClick={() => { setSelTime(slot); setError('') }}
                  className={cn(
                    'py-2 rounded-xl text-[12px] font-semibold border-2 transition-all duration-150 cursor-pointer',
                    selTime === slot
                      ? 'border-[#0F172A] bg-[#0F172A] text-white'
                      : 'border-[#e2e8f0] bg-[#f8fafc] text-[#475569] hover:border-[#94a3b8]'
                  )}>
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Selected summary */}
          {(selDay || selTime) && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
              <span className="material-symbols-outlined text-[20px] text-[#0F172A]" aria-hidden="true">event_available</span>
              <p className="text-[13px] text-[#0F172A] font-medium">
                {selDay && selTime
                  ? <><span className="font-bold">{formatDisplayDate(viewYear, viewMonth, selDay)}</span> at <span className="font-bold">{selTime}</span></>
                  : selDay
                    ? <><span className="font-bold">{formatDisplayDate(viewYear, viewMonth, selDay)}</span> — pick a time</>
                    : <>Date not selected — pick a time: <span className="font-bold">{selTime}</span></>
                }
              </p>
            </div>
          )}

          {error && <p className="text-[13px] text-red-500 font-medium -mt-2">{error}</p>}
        </div>

        {/* Footer */}
        <div className="px-7 pb-7 pt-4 border-t border-[#f1f5f9] flex gap-3 flex-shrink-0">
          <button type="button" onClick={onClose}
            className="flex-1 py-3.5 rounded-xl font-display text-[15px] font-bold text-[#475569] border-2 border-[#e2e8f0] bg-white hover:bg-[#f8fafc] transition-colors cursor-pointer">
            Cancel
          </button>
          <button type="button" onClick={handleConfirm}
            disabled={submitting}
            className={cn(
              'flex-1 py-3.5 rounded-xl font-display text-[15px] font-bold text-white border-0 transition-all duration-150',
              submitting ? 'bg-[#94a3b8] cursor-not-allowed' : 'bg-[#0F172A] hover:bg-[#1e293b] cursor-pointer'
            )}>
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                </svg>
                Confirming…
              </span>
            ) : 'Confirm Visit'}
          </button>
        </div>
      </div>
    </div>
  )
}
