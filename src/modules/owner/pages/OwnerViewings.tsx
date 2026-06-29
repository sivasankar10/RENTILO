import { useState } from 'react'
import {
  Calendar,
  Clock,
  CheckCircle2,
  MessageSquare,
  MoreVertical,
  Plus,
} from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { FeatureGate } from '../components/FeatureGate'

import harborResidencesImg from '@/assets/images/harbor_residences.png'
import sarahJenkinsImg from '@/assets/images/sarah_jenkins.png'

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type ViewMode = 'Month' | 'Week' | 'Day'
type EventStatus = 'scheduled' | 'completed' | 'pending' | 'cancelled'

interface CalendarEvent {
  id: string
  date: number
  time: string
  title: string
  status: EventStatus
  propertyId?: string
}

interface ViewingDetails {
  id: string
  propertyName: string
  propertyAddress: string
  propertyImage: string
  date: string
  time: string
  rent: number
  prospectName: string
  prospectAvatar: string
  prospectVerified: boolean
  prospectCreditScore: number
  prospectJob: string
  prospectIncome: string
  prospectMoveIn: string
  createdBy: string
  lastEdited: string
}


/* ─────────────────────────────────────────────
   Mock Data
───────────────────────────────────────────── */
const calendarEvents: CalendarEvent[] = [
  { id: 'e-1', date: 4, time: '09:00', title: 'Sm...', status: 'scheduled' },
  { id: 'e-2', date: 7, time: '14:30', title: 'Pen...', status: 'pending' },
  { id: 'e-3', date: 9, time: '10:00', title: 'Harbor Loft', status: 'scheduled' },
  { id: 'e-4', date: 9, time: '13:00', title: 'Stu...', status: 'pending' },
  { id: 'e-5', date: 15, time: '11:15', title: 'Canc...', status: 'cancelled' },
]

const selectedViewing: ViewingDetails = {
  id: 'v-1',
  propertyName: 'Harbor Loft - Unit 402',
  propertyAddress: '24 Waterfront Drive, Marina District',
  propertyImage: harborResidencesImg,
  date: 'Oct 9, 2023',
  time: '10:00 AM',
  rent: 4250,
  prospectName: 'Sarah J. Montgomery',
  prospectAvatar: sarahJenkinsImg,
  prospectVerified: true,
  prospectCreditScore: 780,
  prospectJob: 'Senior UI Designer',
  prospectIncome: '$135k+',
  prospectMoveIn: 'Nov 15, 2023',
  createdBy: 'Automator Bot',
  lastEdited: '4h ago',
}

/* ─────────────────────────────────────────────
   Calendar Day Cell Component
───────────────────────────────────────────── */
function CalendarDayCell({
  day,
  events,
  isSelected,
  isCurrentMonth = true,
  onSelect,
}: {
  day: number
  events: CalendarEvent[]
  isSelected?: boolean
  isCurrentMonth?: boolean
  onSelect?: () => void
}) {
  const dayEvents = events.filter((e) => e.date === day)

  const statusColors: Record<EventStatus, { bg: string; text: string }> = {
    scheduled: { bg: 'bg-[#3b82f6]', text: 'text-white' },
    completed: { bg: 'bg-[#10b981]', text: 'text-white' },
    pending: { bg: 'bg-[#f59e0b]', text: 'text-white' },
    cancelled: { bg: 'bg-[#ef4444]', text: 'text-white' },
  }

  return (
    <td
      className={cn(
        'border border-[#e2e8f0] p-2 align-top min-h-[100px] h-28 cursor-pointer transition-colors',
        isSelected && 'bg-[#eff6ff]',
        !isCurrentMonth && 'bg-[#f8fafc]'
      )}
      onClick={onSelect}
    >
      <div className="flex flex-col h-full">
        <span
          className={cn(
            'text-[13px] font-semibold mb-1',
            isSelected
              ? 'w-7 h-7 rounded-full bg-[#3b82f6] text-white flex items-center justify-center'
              : isCurrentMonth
                ? 'text-[#0f172a]'
                : 'text-[#94a3b8]'
          )}
        >
          {day}
        </span>
        <div className="flex-1 space-y-1 overflow-hidden">
          {dayEvents.map((event) => {
            const { bg, text } = statusColors[event.status]
            return (
              <div
                key={event.id}
                className={cn(
                  'px-1.5 py-0.5 rounded text-[10px] font-medium truncate',
                  bg,
                  text
                )}
              >
                {event.time} - {event.title}
              </div>
            )
          })}
        </div>
      </div>
    </td>
  )
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export function OwnerViewings() {
  const [viewMode, setViewMode] = useState<ViewMode>('Month')
  const [selectedDate, setSelectedDate] = useState(9)

  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

  const calendarGrid = [
    [null, null, 1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18, 19],
  ]

  const legendItems = [
    { label: 'Scheduled', color: 'bg-[#3b82f6]' },
    { label: 'Completed', color: 'bg-[#10b981]' },
    { label: 'Pending Follow-up', color: 'bg-[#f59e0b]' },
    { label: 'Cancelled', color: 'bg-[#ef4444]' },
  ]

  return (
    <FeatureGate feature="viewings_calendar">
      <div className="min-h-screen bg-[#f8fafc]">
        <div className="flex">
          {/* ── Main Content (Calendar) ── */}
          <div className="flex-1 p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-[32px] font-bold text-[#0f172a] tracking-tight">
                  Viewings Calendar
                </h1>
                <p className="text-[15px] text-[#64748b] mt-1">
                  Manage and track property viewings for October 2023
                </p>
              </div>
              {/* View Mode Toggle */}
              <div className="flex items-center bg-white rounded-xl border border-[#e2e8f0] p-1">
                {(['Month', 'Week', 'Day'] as ViewMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors',
                      viewMode === mode
                        ? 'bg-[#0f172a] text-white'
                        : 'text-[#64748b] hover:text-[#0f172a]'
                    )}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {weekDays.map((day) => (
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
                  {calendarGrid.map((week, weekIndex) => (
                    <tr key={weekIndex}>
                      {week.map((day, dayIndex) => (
                        <CalendarDayCell
                          key={`${weekIndex}-${dayIndex}`}
                          day={day ?? 0}
                          events={day ? calendarEvents : []}
                          isSelected={day === selectedDate}
                          isCurrentMonth={day !== null}
                          onSelect={() => day && setSelectedDate(day)}
                        />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-4">
              {legendItems.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className={cn('w-3 h-3 rounded-full', item.color)} />
                  <span className="text-[12px] text-[#64748b]">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Floating Add Button */}
            <button className="fixed bottom-8 right-[360px] w-14 h-14 rounded-full bg-[#3b82f6] text-white flex items-center justify-center shadow-lg hover:bg-[#2563eb] transition-colors">
              <Plus size={24} />
            </button>
          </div>

          {/* ── Right Sidebar (Viewing Details) ── */}
          <div className="w-[320px] bg-white border-l border-[#e2e8f0] p-6 min-h-screen">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[20px] font-bold text-[#0f172a]">Viewing Details</h2>
              <button className="p-1.5 rounded-lg hover:bg-[#f1f5f9] transition-colors">
                <MoreVertical size={18} className="text-[#64748b]" />
              </button>
            </div>

            {/* Property Image */}
            <div className="relative rounded-xl overflow-hidden mb-4">
              <img
                src={selectedViewing.propertyImage}
                alt={selectedViewing.propertyName}
                className="w-full h-40 object-cover"
              />
              <span className="absolute top-3 right-3 px-2 py-1 rounded bg-[#0f172a] text-white text-[10px] font-bold uppercase">
                Premium Listing
              </span>
            </div>

            {/* Property Info */}
            <div className="mb-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] mb-1">
                Property
              </p>
              <p className="text-[16px] font-bold text-[#0f172a]">
                {selectedViewing.propertyName}
              </p>
              <p className="text-[13px] text-[#64748b] mt-0.5">
                {selectedViewing.propertyAddress}
              </p>
            </div>

            {/* Date & Time + Rent */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] mb-1">
                  Date & Time
                </p>
                <p className="flex items-center gap-1.5 text-[13px] text-[#0f172a]">
                  <Calendar size={14} className="text-[#64748b]" />
                  {selectedViewing.date}
                </p>
                <p className="flex items-center gap-1.5 text-[13px] text-[#0f172a] mt-1">
                  <Clock size={14} className="text-[#64748b]" />
                  {selectedViewing.time}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] mb-1">
                  Rent
                </p>
                <p className="text-[20px] font-bold text-[#ef4444]">
                  ${selectedViewing.rent.toLocaleString()}
                  <span className="text-[13px] font-normal text-[#64748b]">/mo</span>
                </p>
              </div>
            </div>

            {/* Prospect Information */}
            <div className="mb-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] mb-3">
                Prospect Information
              </p>
              <div className="bg-[#f8fafc] rounded-xl p-4">
                {/* Prospect Header */}
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={selectedViewing.prospectAvatar}
                    alt={selectedViewing.prospectName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-[14px] font-bold text-[#0f172a]">
                      {selectedViewing.prospectName}
                    </p>
                    <p className="flex items-center gap-1 text-[11px] text-[#64748b]">
                      {selectedViewing.prospectVerified && (
                        <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                      )}
                      ID Verified • Credit Score: {selectedViewing.prospectCreditScore}
                    </p>
                  </div>
                </div>

                {/* Prospect Details */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#64748b]">Current Job:</span>
                    <span className="text-[12px] font-semibold text-[#0f172a]">
                      {selectedViewing.prospectJob}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#64748b]">Annual Income:</span>
                    <span className="text-[12px] font-semibold text-[#0f172a]">
                      {selectedViewing.prospectIncome}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#64748b]">Move-in Date:</span>
                    <span className="text-[12px] font-semibold text-[#0f172a]">
                      {selectedViewing.prospectMoveIn}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-[#0f172a] text-white text-[14px] font-semibold hover:bg-[#1e293b] transition-colors">
                <CheckCircle2 size={18} />
                Confirm Attendance
              </button>
              <button className="w-full flex items-center justify-center gap-2 h-12 rounded-xl border border-[#e2e8f0] bg-white text-[#0f172a] text-[14px] font-semibold hover:bg-[#f8fafc] transition-colors">
                <MessageSquare size={18} />
                Message Prospect
              </button>
            </div>

            {/* Footer */}
            <p className="text-[11px] text-[#94a3b8] mt-6 text-center">
              Created on Oct 02 by {selectedViewing.createdBy} • Last edited{' '}
              {selectedViewing.lastEdited}
            </p>
          </div>
        </div>
      </div>
    </FeatureGate>
  )
}
