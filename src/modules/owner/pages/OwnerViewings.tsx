import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Calendar,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  MessageSquare,
  User,
} from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { ROUTES } from '@shared/constants/routes'
import { useAuth } from '@shared/hooks/useAuth'
import {
  DEMO_OWNER,
  type OnboardingRecord,
  useOnboardingStore,
} from '@shared/store/onboardingStore'
import { useLeaseChatStore } from '@shared/store/leaseChatStore'
import { useOwnerChatStore } from '../store/chatStore'

// ─── Types ────────────────────────────────────────────────────────────────────

type EventStatus = 'scheduled' | 'confirmed' | 'completed'

interface CalendarEvent {
  record: OnboardingRecord
  day: number        // day of month (1-31)
  date: string       // "7 Jul 2026"
  time: string       // "10:00 AM"
  status: EventStatus
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

/** Try to extract a numeric day-of-month from the date strings coming from
 *  ScheduleVisitModal: e.g. "7 Jul 2026" → { day: 7, month: 6, year: 2026 }
 *  Falls back to null if parsing fails. */
function parseVisitDate(dateStr: string): { day: number; month: number; year: number } | null {
  if (!dateStr) return null

  // Handle "7 Jul 2026" style
  const monthNames: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  }
  const parts = dateStr.trim().split(/\s+/)
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10)
    const month = monthNames[parts[1]]
    const year = parseInt(parts[2], 10)
    if (!isNaN(day) && month !== undefined && !isNaN(year)) {
      return { day, month, year }
    }
  }

  // Fallback: ISO "2026-07-07"
  const iso = new Date(dateStr)
  if (!isNaN(iso.getTime())) {
    return { day: iso.getDate(), month: iso.getMonth(), year: iso.getFullYear() }
  }

  return null
}

function getFirstDayOfMonthMonday(year: number, month: number): number {
  // 0=Mon…6=Sun
  const day = new Date(year, month, 1).getDay()
  return (day + 6) % 7
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function buildCalendarGrid(year: number, month: number): (number | null)[][] {
  const firstDayOffset = getFirstDayOfMonthMonday(year, month)
  const daysInMonth = getDaysInMonth(year, month)
  const cells: (number | null)[] = [
    ...Array<null>(firstDayOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null)
  const weeks: (number | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

const statusConfig: Record<EventStatus, { label: string; dotClass: string; pillClass: string }> = {
  scheduled: { label: 'Scheduled', dotClass: 'bg-blue-500', pillClass: 'bg-blue-500 text-white' },
  confirmed: { label: 'Confirmed', dotClass: 'bg-emerald-500', pillClass: 'bg-emerald-500 text-white' },
  completed: { label: 'Completed', dotClass: 'bg-slate-400', pillClass: 'bg-slate-200 text-slate-600' },
}

// ─── Calendar Day Cell ────────────────────────────────────────────────────────

function CalendarDayCell({
  day,
  events,
  isSelected,
  isToday,
  onSelect,
}: {
  day: number | null
  events: CalendarEvent[]
  isSelected?: boolean
  isToday?: boolean
  onSelect?: () => void
}) {
  if (day === null) {
    return <td className="border border-[#e2e8f0] bg-[#f8fafc] min-h-[90px]" />
  }

  const dayEvents = events.filter((e) => e.day === day)

  return (
    <td
      onClick={onSelect}
      className={cn(
        'border border-[#e2e8f0] p-2 align-top min-h-[90px] h-24 cursor-pointer transition-colors',
        isSelected ? 'bg-blue-50' : 'hover:bg-[#fafbfc]',
      )}
    >
      <div className="flex flex-col h-full">
        <span
          className={cn(
            'text-[13px] font-semibold mb-1 flex items-center justify-center',
            isSelected
              ? 'w-7 h-7 rounded-full bg-[#0f172a] text-white'
              : isToday
                ? 'w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold'
                : 'text-[#0f172a]',
          )}
        >
          {day}
        </span>
        <div className="flex-1 space-y-1 overflow-hidden">
          {dayEvents.slice(0, 2).map((event) => {
            const s = statusConfig[event.status]
            return (
              <div
                key={event.record.id}
                className={cn('px-1.5 py-0.5 rounded text-[10px] font-medium truncate', s.pillClass)}
              >
                {event.time} — {event.record.tenant.name.split(' ')[0]}
              </div>
            )
          })}
          {dayEvents.length > 2 && (
            <span className="text-[10px] text-[#64748b] font-semibold pl-1">
              +{dayEvents.length - 2} more
            </span>
          )}
        </div>
      </div>
    </td>
  )
}

// ─── Viewing Detail Sidebar ───────────────────────────────────────────────────

function ViewingDetailPanel({
  events,
  onConfirmAttendance,
  onMessageProspect,
}: {
  events: CalendarEvent[]
  onConfirmAttendance: (record: OnboardingRecord) => void
  onMessageProspect: (record: OnboardingRecord) => void
}) {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const event = events[selectedIdx] ?? null

  if (!event) {
    return (
      <div className="w-[300px] bg-white border-l border-[#e2e8f0] p-6 min-h-screen flex flex-col items-center justify-center">
        <CalendarDays size={36} className="text-[#cbd5e1] mb-3" />
        <p className="text-[14px] font-semibold text-[#64748b] text-center">
          No viewings on this day
        </p>
        <p className="text-[12px] text-[#94a3b8] mt-1 text-center">
          Select a day with an event to see details.
        </p>
      </div>
    )
  }

  const { record } = event
  const s = statusConfig[event.status]
  const canConfirm = event.status === 'scheduled'

  return (
    <div className="w-[300px] bg-white border-l border-[#e2e8f0] p-6 min-h-screen flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-[#0f172a]">Viewing Details</h2>
        {events.length > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSelectedIdx((i) => Math.max(0, i - 1))}
              disabled={selectedIdx === 0}
              className="p-1 rounded-lg hover:bg-[#f1f5f9] disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-[12px] text-[#64748b] font-semibold">{selectedIdx + 1}/{events.length}</span>
            <button
              type="button"
              onClick={() => setSelectedIdx((i) => Math.min(events.length - 1, i + 1))}
              disabled={selectedIdx === events.length - 1}
              className="p-1 rounded-lg hover:bg-[#f1f5f9] disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Status */}
      <span className={cn('self-start rounded-full px-2.5 py-1 text-[11px] font-bold', s.pillClass)}>
        {s.label}
      </span>

      {/* Property */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] mb-1">Property</p>
        <p className="text-[15px] font-bold text-[#0f172a]">{record.propertyName}</p>
        <div className="flex items-center gap-1 mt-1 text-[12px] text-[#64748b]">
          <MapPin size={12} />
          {record.address || 'Address on file'}
        </div>
        <p className="text-[13px] font-semibold text-[#0f172a] mt-1">{record.monthlyRent}/mo</p>
      </div>

      {/* Date & Time */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] mb-1">Date & Time</p>
        <p className="flex items-center gap-1.5 text-[13px] text-[#0f172a]">
          <Calendar size={13} className="text-[#64748b]" />
          {event.date}
        </p>
        <p className="flex items-center gap-1.5 text-[13px] text-[#0f172a] mt-1">
          <Clock size={13} className="text-[#64748b]" />
          {event.time}
        </p>
      </div>

      {/* Prospect */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] mb-2">Prospect</p>
        <div className="bg-[#f8fafc] rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            {record.tenant.avatar ? (
              <img
                src={record.tenant.avatar}
                alt={record.tenant.name}
                className="w-10 h-10 rounded-full object-cover border border-[#e2e8f0]"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#e2e8f0] flex items-center justify-center">
                <User size={18} className="text-[#64748b]" />
              </div>
            )}
            <div>
              <p className="text-[14px] font-bold text-[#0f172a]">{record.tenant.name}</p>
              <p className="text-[11px] text-[#64748b]">{record.tenant.email}</p>
            </div>
          </div>
          {record.tenant.phone && (
            <p className="text-[12px] text-[#64748b]">{record.tenant.phone}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto space-y-2">
        <button
          type="button"
          disabled={!canConfirm}
          onClick={() => onConfirmAttendance(record)}
          className={cn(
            'w-full flex items-center justify-center gap-2 h-11 rounded-xl text-[13px] font-semibold transition-colors',
            canConfirm
              ? 'bg-[#0f172a] text-white hover:bg-[#1e293b]'
              : 'bg-[#f1f5f9] text-[#94a3b8] cursor-not-allowed',
          )}
        >
          <CheckCircle2 size={16} />
          {event.status === 'confirmed' ? 'Attendance Confirmed' : 'Confirm Attendance'}
        </button>
        <button
          type="button"
          onClick={() => onMessageProspect(record)}
          className="w-full flex items-center justify-center gap-2 h-11 rounded-xl border border-[#e2e8f0] bg-white text-[#0f172a] text-[13px] font-semibold hover:bg-[#f8fafc] transition-colors"
        >
          <MessageSquare size={16} />
          Message Prospect
        </button>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function OwnerViewings() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const ownerId = user?.id ?? DEMO_OWNER.id

  // Lean real data from onboarding store
  const records = useOnboardingStore((state) => state.records)
  const approveTenant = useOnboardingStore((state) => state.approveTenant)
  const ensureTenantConversation = useOwnerChatStore((state) => state.ensureTenantConversation)
  const ensureLeaseThread = useLeaseChatStore((state) => state.ensureThread)

  const [viewYear, setViewYear] = useState(new Date().getFullYear())
  const [viewMonth, setViewMonth] = useState(new Date().getMonth())
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate())

  const today = new Date()
  const todayDay = today.getDate()
  const todayMonth = today.getMonth()
  const todayYear = today.getFullYear()

  // Build events from real onboarding records
  const allEvents = useMemo<CalendarEvent[]>(() => {
    return records
      .filter((record) =>
        record.owner.id === ownerId &&
        (record.status === 'visit_scheduled' ||
          record.status === 'visit_confirmed' ||
          record.status === 'awaiting_owner_approval' ||
          record.status === 'owner_approved') &&
        record.scheduledVisit,
      )
      .flatMap((record) => {
        const visit = record.scheduledVisit!
        const parsed = parseVisitDate(visit.date)
        if (!parsed) return []

        let status: EventStatus = 'scheduled'
        if (record.status === 'visit_confirmed' || record.status === 'awaiting_owner_approval' || record.status === 'owner_approved') {
          status = 'confirmed'
        }

        return [{
          record,
          day: parsed.day,
          date: visit.date,
          time: visit.time,
          status,
          _year: parsed.year,
          _month: parsed.month,
        }]
      }) as CalendarEvent[]
  }, [records, ownerId])

  // Events for the currently displayed month
  const monthEvents = useMemo(
    () => allEvents.filter((e) => {
      const parsed = parseVisitDate(e.date)
      return parsed?.year === viewYear && parsed?.month === viewMonth
    }),
    [allEvents, viewYear, viewMonth],
  )

  // Events for the selected day
  const dayEvents = useMemo(
    () => (selectedDay ? monthEvents.filter((e) => e.day === selectedDay) : []),
    [monthEvents, selectedDay],
  )

  const calendarGrid = useMemo(() => buildCalendarGrid(viewYear, viewMonth), [viewYear, viewMonth])

  const legendItems: { label: string; dotClass: string }[] = [
    { label: 'Scheduled', dotClass: 'bg-blue-500' },
    { label: 'Confirmed', dotClass: 'bg-emerald-500' },
    { label: 'Completed', dotClass: 'bg-slate-400' },
  ]

  function prevMonth() {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11) }
    else setViewMonth((m) => m - 1)
    setSelectedDay(null)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0) }
    else setViewMonth((m) => m + 1)
    setSelectedDay(null)
  }

  function handleConfirmAttendance(record: OnboardingRecord) {
    // Advances status so the visit appears confirmed. After this the record
    // moves to awaiting_owner_approval which is then auto-approved by the prototype.
    approveTenant(record.id)
  }

  function handleMessageProspect(record: OnboardingRecord) {
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

  const totalThisMonth = monthEvents.length

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="flex">

        {/* ── Main Calendar ── */}
        <div className="flex-1 p-8 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
            <div>
              <h1 className="text-[28px] font-extrabold text-[#0f172a] tracking-tight">
                Viewings Calendar
              </h1>
              <p className="text-[14px] text-[#64748b] mt-1">
                {totalThisMonth > 0
                  ? `${totalThisMonth} viewing${totalThisMonth !== 1 ? 's' : ''} in ${MONTHS[viewMonth]} ${viewYear}`
                  : `No viewings scheduled for ${MONTHS[viewMonth]} ${viewYear} yet.`}
              </p>
            </div>

            {/* Month navigator */}
            <div className="flex items-center gap-2 bg-white rounded-xl border border-[#e2e8f0] px-3 py-2">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1 rounded-lg hover:bg-[#f1f5f9] transition-colors text-[#64748b]"
                aria-label="Previous month"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-[14px] font-bold text-[#0f172a] w-36 text-center">
                {MONTHS[viewMonth]} {viewYear}
              </span>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1 rounded-lg hover:bg-[#f1f5f9] transition-colors text-[#64748b]"
                aria-label="Next month"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Calendar grid */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {WEEKDAYS.map((day) => (
                    <th
                      key={day}
                      className="py-3 px-2 text-[11px] font-bold uppercase tracking-wider text-[#64748b] bg-[#f8fafc] border-b border-[#e2e8f0]"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {calendarGrid.map((week, weekIdx) => (
                  <tr key={weekIdx}>
                    {week.map((day, dayIdx) => {
                      const isSelected = day !== null && day === selectedDay
                      const isToday =
                        day !== null &&
                        day === todayDay &&
                        viewMonth === todayMonth &&
                        viewYear === todayYear
                      return (
                        <CalendarDayCell
                          key={`${weekIdx}-${dayIdx}`}
                          day={day}
                          events={monthEvents}
                          isSelected={isSelected}
                          isToday={isToday}
                          onSelect={() => day && setSelectedDay(day)}
                        />
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-5 mt-4 flex-wrap">
            {legendItems.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span className={cn('w-2.5 h-2.5 rounded-full', item.dotClass)} />
                <span className="text-[12px] text-[#64748b]">{item.label}</span>
              </div>
            ))}
          </div>

          {/* No scheduled viewings prompt */}
          {allEvents.length === 0 && (
            <div className="mt-6 rounded-xl border border-dashed border-[#e2e8f0] bg-white p-8 text-center">
              <CalendarDays size={32} className="mx-auto text-[#cbd5e1] mb-3" />
              <p className="text-[15px] font-semibold text-[#64748b]">
                No viewings yet
              </p>
              <p className="text-[13px] text-[#94a3b8] mt-1">
                When tenants schedule visits on your property listings, they'll appear here automatically.
              </p>
            </div>
          )}
        </div>

        {/* ── Right Detail Sidebar ── */}
        <ViewingDetailPanel
          events={dayEvents}
          onConfirmAttendance={handleConfirmAttendance}
          onMessageProspect={handleMessageProspect}
        />
      </div>
    </div>
  )
}
