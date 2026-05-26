import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, Car, Dumbbell, MapPin, MessageSquare, Waves, Wifi } from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'

const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    alt: 'Grand luxury property entrance',
  },
  {
    src: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=500&q=80',
    alt: 'Modern kitchen with green cabinetry',
  },
  {
    src: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=500&q=80',
    alt: 'Bright bedroom with neutral bedding',
  },
  {
    src: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=500&q=80',
    alt: 'Clean white bathroom',
  },
]

const stats = [
  { label: 'Views', value: '124' },
  { label: 'Shortlists', value: '18' },
  { label: 'Contacts', value: '5' },
]

const amenities = [
  { label: 'High-Speed WiFi', icon: Wifi },
  { label: 'Fitness Center', icon: Dumbbell },
  { label: 'Infinity Pool', icon: Waves },
  { label: 'Secure Parking', icon: Car },
]

export function OwnerPropertyDetail() {
  const navigate = useNavigate()
  const [schedulerOpen, setSchedulerOpen] = useState(false)
  const [visitDate, setVisitDate] = useState('')
  const [visitTime, setVisitTime] = useState('10:00')
  const [scheduleStatus, setScheduleStatus] = useState('')

  const scheduleVisit = () => {
    if (!visitDate || !visitTime) {
      setScheduleStatus('Choose a date and time to schedule the visit.')
      return
    }

    setScheduleStatus(`Visit scheduled for ${visitDate} at ${visitTime}.`)
  }

  return (
    <div className="min-h-screen bg-canvas-alt">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px]">
          <main className="space-y-8">
            <header>
              <h1 className="text-heading-1 font-extrabold tracking-tight text-navy">
                The Opus Tower, 14B
              </h1>
              <p className="mt-2 flex items-center gap-2 text-label font-medium text-text-primary">
                <MapPin size={14} />
                Downtown Financial District
              </p>
            </header>

            <section className="rounded-card border border-outline bg-white p-4 shadow-surface">
              <img
                src={galleryImages[0].src}
                alt={galleryImages[0].alt}
                className="h-[420px] w-full rounded-card object-cover"
              />
              <div className="mt-4 grid grid-cols-3 gap-4">
                {galleryImages.slice(1).map((image) => (
                  <img
                    key={image.alt}
                    src={image.src}
                    alt={image.alt}
                    className="h-36 w-full rounded-button object-cover"
                  />
                ))}
              </div>
            </section>

            <section className="rounded-card border border-outline bg-white p-8 shadow-surface">
              <h2 className="text-heading-3 font-bold text-navy">Property Overview</h2>
              <div className="mt-6 space-y-5 text-body leading-6 text-text-primary">
                <p>
                  Experience unparalleled luxury in this stunning high-rise residence at The Opus
                  Tower. Positioned ideally in the heart of the Financial District, this architectural
                  masterpiece offers panoramic city views through floor-to-ceiling windows.
                </p>
                <p>
                  The open-concept living area flows seamlessly into a chef-grade kitchen equipped
                  with top-of-the-line stainless steel appliances and imported stone countertops.
                  Hardwood flooring throughout adds warmth to the crisp, modern aesthetic.
                </p>
                <p>
                  Residents enjoy exclusive access to world-class amenities, ensuring a lifestyle of
                  comfort and sophistication.
                </p>
              </div>
            </section>

            <section className="rounded-card border border-outline bg-white p-8 shadow-surface">
              <h2 className="text-heading-3 font-bold text-navy">Amenities</h2>
              <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
                {amenities.map((amenity) => {
                  const Icon = amenity.icon
                  return (
                    <div key={amenity.label} className="text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-button bg-primary-50 text-navy">
                        <Icon size={20} />
                      </div>
                      <p className="mt-3 text-label font-bold text-text-primary">{amenity.label}</p>
                    </div>
                  )
                })}
              </div>
            </section>
          </main>

          <aside className="xl:pt-14">
            <div className="sticky top-24 rounded-card border border-outline bg-white p-6 shadow-surface">
              <div className="text-right">
                <p className="text-heading-2 font-extrabold tracking-tight text-navy">
                  $4,500
                  <span className="ml-1 text-body font-semibold text-text-primary">/ mo</span>
                </p>
                <p className="text-filter-label uppercase text-text-primary">Deposit: $9,000</p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-5 border-y border-outline py-6">
                <div>
                  <p className="text-filter-label uppercase text-text-muted">Tenant Preference</p>
                  <p className="mt-1 text-label font-bold text-text-primary">Family / Couple</p>
                </div>
                <div>
                  <p className="text-filter-label uppercase text-text-muted">Furnishing</p>
                  <p className="mt-1 text-label font-bold text-text-primary">Semi-Furnished</p>
                </div>
                <div>
                  <p className="text-filter-label uppercase text-text-muted">Parking Available</p>
                  <p className="mt-1 text-label font-bold text-text-primary">Both (2W & 4W)</p>
                </div>
                <div>
                  <p className="text-filter-label uppercase text-text-muted">Listed On</p>
                  <p className="mt-1 text-label font-bold text-text-primary">Posted 2 days ago</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setSchedulerOpen((isOpen) => !isOpen)
                    setScheduleStatus('')
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-button bg-navy px-4 py-3 text-body font-semibold text-white transition-colors duration-200 hover:bg-slate-800"
                  aria-expanded={schedulerOpen}
                >
                  <CalendarDays size={16} />
                  Schedule Visit
                </button>
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.OWNER.MESSAGES)}
                  className="flex w-full items-center justify-center gap-2 rounded-button bg-slate-200 px-4 py-3 text-body font-bold text-navy transition-colors duration-200 hover:bg-slate-300"
                >
                  <MessageSquare size={16} />
                  I'm Interested
                </button>
              </div>

              {schedulerOpen && (
                <div className="mt-4 rounded-card border border-outline bg-slate-50 p-4">
                  <p className="text-label font-bold uppercase text-text-muted">Schedule Visit</p>
                  <div className="mt-3 space-y-3">
                    <label className="block">
                      <span className="text-label font-semibold text-text-primary">Visit Date</span>
                      <input
                        type="date"
                        value={visitDate}
                        min="2026-05-27"
                        onChange={(event) => {
                          setVisitDate(event.target.value)
                          setScheduleStatus('')
                        }}
                        className="mt-2 w-full rounded-input border border-outline bg-white px-3 py-2 text-body text-text-primary outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary-100"
                      />
                    </label>
                    <label className="block">
                      <span className="text-label font-semibold text-text-primary">Visit Time</span>
                      <input
                        type="time"
                        value={visitTime}
                        onChange={(event) => {
                          setVisitTime(event.target.value)
                          setScheduleStatus('')
                        }}
                        className="mt-2 w-full rounded-input border border-outline bg-white px-3 py-2 text-body text-text-primary outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary-100"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={scheduleVisit}
                      className="w-full rounded-button bg-primary px-4 py-2 text-label font-bold text-white transition-colors duration-200 hover:bg-primary-700"
                    >
                      Confirm Visit
                    </button>
                    {scheduleStatus && (
                      <p className="text-label font-semibold text-primary">{scheduleStatus}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-8 grid grid-cols-3 divide-x divide-outline rounded-button bg-slate-50">
                {stats.map((stat) => (
                  <div key={stat.label} className="px-2 py-4 text-center">
                    <p className="text-body font-extrabold text-navy">{stat.value}</p>
                    <p className="mt-1 text-filter-label uppercase text-text-muted">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <footer className="mt-16 flex flex-col gap-4 border-t border-outline py-8 text-filter-label font-semibold uppercase tracking-wider text-text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>(c) 2024 RENTILO. The Curated Estate.</p>
          <div className="flex items-center gap-6">
            <button type="button" className="hover:text-navy">Privacy</button>
            <button type="button" className="hover:text-navy">Terms</button>
            <button type="button" className="hover:text-navy">Support</button>
            <button type="button" className="hover:text-navy">Contact</button>
          </div>
        </footer>
      </div>
    </div>
  )
}
