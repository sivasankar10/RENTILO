import { useState } from 'react'
import {
  Users,
  Calendar,
  Filter,
  LayoutGrid,
  List,
  MoreVertical,
} from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { FeatureGate } from '../components/FeatureGate'

import sarahJenkinsImg from '@/assets/images/sarah_jenkins.png'
import brokerProfileImg from '@/assets/images/broker_profile.png'

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type LeadStatus = 'NEW INQUIRY' | 'CONTACTED' | 'SCHEDULED' | 'REJECTED'
type ViewMode = 'grid' | 'list'

interface ActiveLead {
  id: string
  name: string
  initials: string
  avatar?: string
  subtitle: string
  property: string
  propertyUnit: string
  monthlyRent: number
  score: number
  scoreColor: 'green' | 'yellow' | 'red'
  status: LeadStatus
  actionLabel: string
  actionVariant: 'primary' | 'secondary' | 'outline'
}

/* ─────────────────────────────────────────────
   Mock Data
───────────────────────────────────────────── */
const statsData = {
  newLeads: { value: 48, change: '+12%' },
  scheduledViewings: { value: 156, status: 'Active' },
}

const activeLeads: ActiveLead[] = [
  {
    id: 'lead-1',
    name: 'Sarah Miller',
    initials: 'SM',
    avatar: sarahJenkinsImg,
    subtitle: 'Inquiry 2h ago',
    property: 'Skyline Lofts',
    propertyUnit: '#402',
    monthlyRent: 2400,
    score: 92,
    scoreColor: 'green',
    status: 'NEW INQUIRY',
    actionLabel: 'Respond',
    actionVariant: 'primary',
  },
  {
    id: 'lead-2',
    name: 'James Chen',
    initials: 'JC',
    avatar: brokerProfileImg,
    subtitle: 'Contacted via Phone',
    property: 'The Heritage',
    propertyUnit: '#12B',
    monthlyRent: 3150,
    score: 85,
    scoreColor: 'green',
    status: 'CONTACTED',
    actionLabel: 'Schedule',
    actionVariant: 'outline',
  },
  {
    id: 'lead-3',
    name: 'Elena Kostic',
    initials: 'EK',
    subtitle: 'Viewing tomorrow at 10 AM',
    property: 'Parkview Residences',
    propertyUnit: '',
    monthlyRent: 1850,
    score: 45,
    scoreColor: 'yellow',
    status: 'SCHEDULED',
    actionLabel: 'Confirm',
    actionVariant: 'secondary',
  },
  {
    id: 'lead-4',
    name: 'Robert Taylor',
    initials: 'RT',
    subtitle: 'Rejected 1d ago',
    property: 'Skyline Lofts',
    propertyUnit: '#102',
    monthlyRent: 2200,
    score: 12,
    scoreColor: 'red',
    status: 'REJECTED',
    actionLabel: 'Archive',
    actionVariant: 'outline',
  },
]

/* ─────────────────────────────────────────────
   Stat Card Component
───────────────────────────────────────────── */
function StatCard({
  icon,
  label,
  value,
  badge,
  badgeColor = 'green',
}: {
  icon: React.ReactNode
  label: string
  value: number
  badge?: string
  badgeColor?: 'green' | 'blue'
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 flex-1">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-[#f1f5f9] flex items-center justify-center">
          {icon}
        </div>
        {badge && (
          <span
            className={cn(
              'text-[13px] font-semibold',
              badgeColor === 'green' ? 'text-[#10b981]' : 'text-[#3b82f6]'
            )}
          >
            {badge}
          </span>
        )}
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b] mt-4">
        {label}
      </p>
      <p className="text-[36px] font-bold text-[#0f172a] mt-1 leading-none">{value}</p>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Status Badge Component
───────────────────────────────────────────── */
function StatusBadge({ status }: { status: LeadStatus }) {
  const config: Record<LeadStatus, { bg: string; text: string; border: string }> = {
    'NEW INQUIRY': { bg: 'bg-[#dbeafe]', text: 'text-[#2563eb]', border: 'border-[#93c5fd]' },
    CONTACTED: { bg: 'bg-[#fef3c7]', text: 'text-[#d97706]', border: 'border-[#fcd34d]' },
    SCHEDULED: { bg: 'bg-[#dcfce7]', text: 'text-[#16a34a]', border: 'border-[#86efac]' },
    REJECTED: { bg: 'bg-[#fee2e2]', text: 'text-[#dc2626]', border: 'border-[#fca5a5]' },
  }
  const { bg, text, border } = config[status]

  return (
    <span
      className={cn(
        'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border',
        bg,
        text,
        border
      )}
    >
      {status}
    </span>
  )
}

/* ─────────────────────────────────────────────
   Score Bar Component
───────────────────────────────────────────── */
function ScoreBar({ score, color }: { score: number; color: 'green' | 'yellow' | 'red' }) {
  const colorMap = {
    green: 'bg-[#10b981]',
    yellow: 'bg-[#f59e0b]',
    red: 'bg-[#ef4444]',
  }

  return (
    <div className="flex items-center gap-3">
      <div className="w-16 h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full', colorMap[color])}
          style={{ width: `${score}%` }}
        />
      </div>
      <span
        className={cn(
          'text-[13px] font-semibold',
          color === 'green' ? 'text-[#10b981]' : color === 'yellow' ? 'text-[#f59e0b]' : 'text-[#ef4444]'
        )}
      >
        {score}
      </span>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Action Button Component
───────────────────────────────────────────── */
function ActionButton({
  label,
  variant,
}: {
  label: string
  variant: 'primary' | 'secondary' | 'outline'
}) {
  const variantStyles = {
    primary: 'bg-[#0f172a] text-white hover:bg-[#1e293b]',
    secondary: 'bg-[#10b981] text-white hover:bg-[#059669]',
    outline: 'bg-white border border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc]',
  }

  return (
    <button
      className={cn(
        'px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors',
        variantStyles[variant]
      )}
    >
      {label}
    </button>
  )
}

/* ─────────────────────────────────────────────
   Lead Row Component
───────────────────────────────────────────── */
function LeadRow({ lead }: { lead: ActiveLead }) {
  return (
    <tr className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
      {/* Applicant */}
      <td className="py-4 pr-4">
        <div className="flex items-center gap-3">
          {lead.avatar ? (
            <img
              src={lead.avatar}
              alt={lead.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#e2e8f0] flex items-center justify-center text-[13px] font-bold text-[#64748b]">
              {lead.initials}
            </div>
          )}
          <div>
            <p className="text-[14px] font-semibold text-[#0f172a]">{lead.name}</p>
            <p className="text-[12px] text-[#64748b]">{lead.subtitle}</p>
          </div>
        </div>
      </td>

      {/* Property */}
      <td className="py-4 px-4">
        <div>
          <p className="text-[14px] font-medium text-[#0f172a]">
            {lead.property}{lead.propertyUnit ? `, ${lead.propertyUnit}` : ''}
          </p>
          <p className="text-[12px] text-[#64748b]">${lead.monthlyRent.toLocaleString()}/mo</p>
        </div>
      </td>

      {/* Score */}
      <td className="py-4 px-4">
        <ScoreBar score={lead.score} color={lead.scoreColor} />
      </td>

      {/* Status */}
      <td className="py-4 px-4">
        <StatusBadge status={lead.status} />
      </td>

      {/* Actions */}
      <td className="py-4 pl-4">
        <div className="flex items-center gap-2">
          <ActionButton label={lead.actionLabel} variant={lead.actionVariant} />
          <button className="p-2 rounded-lg hover:bg-[#f1f5f9] transition-colors">
            <MoreVertical size={16} className="text-[#94a3b8]" />
          </button>
        </div>
      </td>
    </tr>
  )
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export function OwnerInquiries() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  return (
    <FeatureGate feature="inquiry_management">
      <div className="min-h-screen bg-[#f8fafc] pb-12">
        <div className="max-w-[1100px] mx-auto px-6 py-8">
          {/* ── Header ── */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-[32px] font-bold text-[#0f172a] tracking-tight">
                Inquiry Management
              </h1>
              <p className="text-[15px] text-[#64748b] mt-1">
                Manage lead conversions and prospective tenant interactions.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Avatar Stack */}
              <div className="flex items-center -space-x-2">
                <img
                  src={sarahJenkinsImg}
                  alt="Team member"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
                <img
                  src={brokerProfileImg}
                  alt="Team member"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
                <div className="w-8 h-8 rounded-full bg-[#e2e8f0] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#64748b]">
                  +4
                </div>
              </div>
              {/* Filters Button */}
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#e2e8f0] bg-white text-[14px] font-semibold text-[#475569] hover:bg-[#f8fafc] transition-colors">
                <Filter size={16} />
                Filters
              </button>
            </div>
          </div>

          {/* ── Stats Row ── */}
          <div className="flex gap-4 mb-8">
            <StatCard
              icon={<Users size={20} className="text-[#64748b]" />}
              label="New Leads (24H)"
              value={statsData.newLeads.value}
              badge={`${statsData.newLeads.change}↗`}
              badgeColor="green"
            />
            <StatCard
              icon={<Calendar size={20} className="text-[#64748b]" />}
              label="Scheduled Viewings"
              value={statsData.scheduledViewings.value}
              badge={statsData.scheduledViewings.status}
              badgeColor="blue"
            />
          </div>

          {/* ── Active Leads Table Card ── */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
            {/* Table Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
              <h2 className="text-[18px] font-bold text-[#0f172a]">Active Leads</h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'w-9 h-9 rounded-lg flex items-center justify-center transition-colors',
                    viewMode === 'grid'
                      ? 'bg-[#0f172a] text-white'
                      : 'text-[#94a3b8] hover:bg-[#f1f5f9]'
                  )}
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'w-9 h-9 rounded-lg flex items-center justify-center transition-colors',
                    viewMode === 'list'
                      ? 'bg-[#0f172a] text-white'
                      : 'text-[#94a3b8] hover:bg-[#f1f5f9]'
                  )}
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e2e8f0]">
                    <th className="text-left py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">
                      Applicant
                    </th>
                    <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">
                      Property
                    </th>
                    <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">
                      Score
                    </th>
                    <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">
                      Status
                    </th>
                    <th className="text-right py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="px-6">
                  {activeLeads.map((lead) => (
                    <LeadRow key={lead.id} lead={lead} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#e2e8f0]">
              <span className="text-[13px] text-[#64748b]">
                Showing 4 of 48 active leads
              </span>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 rounded-lg border border-[#e2e8f0] text-[13px] font-semibold text-[#94a3b8] bg-white hover:bg-[#f8fafc] transition-colors">
                  Previous
                </button>
                <button className="px-4 py-2 rounded-lg border border-[#e2e8f0] text-[13px] font-semibold text-[#475569] bg-white hover:bg-[#f8fafc] transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FeatureGate>
  )
}
