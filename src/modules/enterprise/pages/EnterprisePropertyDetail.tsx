import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Mail, MapPin, Phone } from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'

const demoProperty = {
  name: 'The Meridian Heights, Penthouse 402',
  location: 'Upper East Side, New York',
  status: 'Occupied',
  image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80',
  beds: '5 Bedrooms',
  baths: '4.5 Baths',
  sqft: '4,200 SQFT',
  description: 'A premier enterprise-grade residential asset featuring smart-home integration, floor-to-ceiling soundproof glass, and private elevator access. Fully renovated in 2023 with sustainable materials and high-efficiency climate control systems.',
  yearBuilt: '2018 (Renovated 2023)',
  marketValue: '$4,250,000',
  monthlyYield: '$18,500',
  amenities: ['Infinity Pool', 'Private Gym', '3 Car Parking', '24/7 Concierge'],
  broker: { name: 'Marcus Thorne', role: 'Senior Asset Advisor', avatar: 'MT' },
  timeline: [
    { date: 'TODAY, 09:42 AM', title: 'Maintenance Resolved', desc: 'HVAC system inspection completed by Facility Team.' },
    { date: 'OCT 12, 2023', title: 'Rent Payment Received', desc: 'Monthly lease payment of $18,500 successfully processed.' },
    { date: 'OCT 05, 2023', title: 'Broker Site Visit', desc: 'Marcus Thorne conducted a quarterly inspection.' },
  ],
  annualRevenue: '$222,000',
  capRate: '5.2%',
}

export function EnterprisePropertyDetail() {
  const navigate = useNavigate()
  useParams()

  return (
    <div className="space-y-6 pb-10">
      {/* Breadcrumb + Header */}
      <div>
        <button type="button" onClick={() => navigate(ROUTES.ENTERPRISE.PORTFOLIO)} className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-widest text-primary hover:underline">
          <ArrowLeft size={14} /> Portfolio / Properties
        </button>
        <h1 className="mt-2 text-[26px] font-extrabold text-[#0f172a] tracking-tight">{demoProperty.name}</h1>
        <div className="mt-1 flex items-center gap-3 text-[13px] text-text-muted">
          <span className="flex items-center gap-1"><MapPin size={13} /> {demoProperty.location}</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="font-semibold text-green-700">{demoProperty.status.toUpperCase()}</span>
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3">
        <button className="rounded-lg border border-outline bg-white px-4 py-2.5 text-[13px] font-semibold text-[#0f172a] hover:bg-hover-light transition-colors">Reassign Broker</button>
        <button className="rounded-lg bg-[#0f172a] px-4 py-2.5 text-[13px] font-bold text-white hover:bg-navy/80 transition-colors">Edit Property</button>
      </div>

      {/* Main Grid: Property Image + Sidebar */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Property Image */}
        <div className="relative rounded-2xl overflow-hidden aspect-[16/9]">
          <img src={demoProperty.image} alt={demoProperty.name} className="h-full w-full object-cover" />
          <div className="absolute bottom-4 left-4 flex gap-2">
            <span className="rounded-lg bg-[#0f172a]/80 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-sm">{demoProperty.beds}</span>
            <span className="rounded-lg bg-[#0f172a]/80 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-sm">{demoProperty.baths}</span>
            <span className="rounded-lg bg-[#0f172a]/80 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-sm">{demoProperty.sqft}</span>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Assigned Broker */}
          <div className="rounded-xl border border-outline bg-white p-5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Assigned Brokers</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-200 text-[12px] font-bold text-[#0f172a]">{demoProperty.broker.avatar}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-[#0f172a]">{demoProperty.broker.name}</p>
                <p className="text-[11px] text-text-muted">{demoProperty.broker.role}</p>
              </div>
              <div className="flex gap-1.5">
                <button className="p-1.5 rounded-lg border border-outline text-text-muted hover:bg-hover-light"><Mail size={14} /></button>
                <button className="p-1.5 rounded-lg border border-outline text-text-muted hover:bg-hover-light"><Phone size={14} /></button>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="rounded-xl border border-outline bg-white p-5 shadow-sm">
            <p className="text-[13px] font-bold text-[#0f172a] mb-4">Activity Timeline</p>
            <div className="space-y-5">
              {demoProperty.timeline.map((item, i) => (
                <div key={i} className="relative pl-5">
                  <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-[#0f172a] bg-white" />
                  {i < demoProperty.timeline.length - 1 && <span className="absolute left-[4px] top-4 bottom-0 w-px bg-outline" />}
                  <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">{item.date}</p>
                  <p className="mt-0.5 text-[13px] font-semibold text-[#0f172a]">{item.title}</p>
                  <p className="mt-0.5 text-[11px] text-text-muted">{item.desc}</p>
                </div>
              ))}
            </div>
            <button className="mt-4 text-[12px] font-semibold text-[#0f172a] hover:text-primary">View All Logs ›</button>
          </div>
        </div>
      </div>

      {/* Asset Overview + Active Amenities */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-outline bg-white p-6 shadow-sm">
          <h3 className="text-[15px] font-bold text-[#0f172a] flex items-center gap-2">🏢 Asset Overview</h3>
          <p className="mt-3 text-[13px] text-text-muted leading-relaxed">{demoProperty.description}</p>
          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-text-muted">Year Built:</span>
              <span className="font-bold text-[#0f172a]">{demoProperty.yearBuilt}</span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-text-muted">Market Value:</span>
              <span className="font-bold text-[#0f172a]">{demoProperty.marketValue}</span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-text-muted">Monthly Yield:</span>
              <span className="font-bold text-[#0f172a]">{demoProperty.monthlyYield}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-outline bg-white p-6 shadow-sm">
          <h3 className="text-[15px] font-bold text-[#0f172a] flex items-center gap-2">✨ Active Amenities</h3>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {demoProperty.amenities.map((amenity) => (
              <div key={amenity} className="flex items-center gap-2">
                <span className="text-[14px]">
                  {amenity.includes('Pool') ? '🏊' : amenity.includes('Gym') ? '💪' : amenity.includes('Parking') ? '🚗' : '🛎️'}
                </span>
                <span className="text-[13px] font-semibold text-[#0f172a]">{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Performance */}
      <div className="rounded-xl border border-outline bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-bold text-[#0f172a]">Financial Performance</h3>
          <div className="flex items-center gap-6 text-[12px]">
            <span className="text-text-muted">Annual Revenue: <span className="font-bold text-[#0f172a]">{demoProperty.annualRevenue}</span></span>
            <span className="text-text-muted">Cap Rate: <span className="font-bold text-primary">{demoProperty.capRate}</span></span>
          </div>
        </div>
        <div className="flex items-end gap-1.5 h-40 pt-4">
          {['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'].map((month, i) => {
            const heights = [35, 25, 40, 50, 45, 55, 60, 65, 50, 70, 75, 68]
            return (
              <div key={month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-0.5">
                  <div className="flex-1 bg-[#0f172a] rounded-t" style={{ height: `${heights[i]}%` }} />
                  <div className="flex-1 bg-slate-300 rounded-t" style={{ height: `${heights[i] * 0.6}%` }} />
                </div>
                <span className="text-[9px] text-text-muted">{month}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
