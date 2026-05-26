import { Link } from 'react-router-dom'
import {
  Award,
  Building2,
  CalendarDays,
  CheckCircle2,
  Edit3,
  Mail,
  MapPin,
  Phone,
  Star,
  TrendingUp,
} from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { useAuth } from '@shared/hooks/useAuth'
import brokerProfileImg from '@/assets/images/broker_profile.png'

const recentWins = [
  { property: 'Skyline Heights 14B', value: '$4,500', date: 'Oct 24' },
  { property: 'Harbor View Offices', value: '$8,200', date: 'Oct 18' },
  { property: 'Garden Lofts Apt 12', value: '$2,100', date: 'Oct 12' },
]

export function BrokerProfile() {
  const { user } = useAuth()
  const fullName =
    user && `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
      ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
      : 'Agent Smith'
  const email = user?.email ?? 'agent.smith@rentilo.com'

  return (
    <div className="space-y-6 pb-10">
      <section className="relative overflow-hidden rounded-2xl bg-[#0f172a] text-white shadow-card">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(147,197,253,0.28),transparent_45%)]" />
        <div className="relative grid gap-6 p-6 lg:grid-cols-[1fr_280px] lg:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <img
              src={brokerProfileImg}
              alt={fullName}
              className="h-28 w-28 rounded-2xl border-4 border-white/10 object-cover shadow-card"
            />
            <div className="min-w-0">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-100">
                <CheckCircle2 size={13} />
                Verified Broker
              </div>
              <h1 className="text-[30px] font-extrabold leading-tight tracking-tight">
                {fullName}
              </h1>
              <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-slate-300">
                Senior leasing specialist focused on premium residential and commercial
                portfolios across central market districts.
              </p>
              <div className="mt-4 flex flex-wrap gap-3 text-[13px] text-slate-300">
                <span className="inline-flex items-center gap-1.5">
                  <Mail size={14} /> {email}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Phone size={14} /> +1 (415) 555-0198
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={14} /> San Francisco, CA
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/10 p-5 backdrop-blur">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Profile strength
              </p>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-[38px] font-extrabold leading-none">92%</span>
                <span className="pb-1 text-[12px] font-semibold text-green-300">
                  +8% this month
                </span>
              </div>
              <div className="mt-4 h-2 rounded-full bg-white/15">
                <div className="h-full w-[92%] rounded-full bg-blue-200" />
              </div>
            </div>
            <Link
              to={ROUTES.BROKER.EDIT_PROFILE}
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-4 text-[13px] font-bold text-[#0f172a] transition-colors hover:bg-blue-50"
            >
              <Edit3 size={15} />
              Edit Profile
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Portfolio Value', value: '$14.8M', icon: Building2, tone: 'bg-blue-100 text-blue-700' },
          { label: 'Client Rating', value: '4.9', icon: Star, tone: 'bg-amber-100 text-amber-700' },
          { label: 'Closed Deals', value: '38', icon: Award, tone: 'bg-green-100 text-green-700' },
        ].map((item) => {
          const Icon = item.icon
          return (
            <div key={item.label} className="rounded-xl border border-outline bg-white p-5 shadow-ambient">
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${item.tone}`}>
                <Icon size={20} />
              </div>
              <p className="text-[12px] font-semibold uppercase tracking-wider text-text-muted">
                {item.label}
              </p>
              <p className="mt-1 text-[28px] font-extrabold tracking-tight text-[#0f172a]">
                {item.value}
              </p>
            </div>
          )
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="overflow-hidden rounded-xl border border-outline bg-white shadow-ambient">
          <div className="flex items-center justify-between border-b border-outline px-5 py-4">
            <h2 className="text-[16px] font-bold text-[#0f172a]">Recent Commissions</h2>
            <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-green-700">
              <TrendingUp size={14} /> On track
            </span>
          </div>
          <div className="divide-y divide-outline">
            {recentWins.map((win) => (
              <div key={win.property} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-4 text-[13px]">
                <span className="font-semibold text-[#0f172a]">{win.property}</span>
                <span className="font-bold text-[#0f172a]">{win.value}</span>
                <span className="text-text-muted">{win.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-outline bg-white p-5 shadow-ambient">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays size={16} className="text-text-muted" />
            <h2 className="text-[16px] font-bold text-[#0f172a]">Availability</h2>
          </div>
          <div className="rounded-xl bg-canvas p-4">
            <p className="text-[13px] font-bold text-[#0f172a]">Open for tours</p>
            <p className="mt-1 text-[12px] leading-relaxed text-text-muted">
              Weekdays, 10:00 AM to 6:00 PM. Priority slots held for hot leads.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
