import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BadgeInfo,
  Bath,
  Bed,
  CheckCircle2,
  CircleDollarSign,
  Info,
  PlusCircle,
  Ruler,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'

const benefits = [
  {
    icon: ShieldCheck,
    title: '20% Faster Matching',
    description: 'with the suitable tenants',
  },
  {
    icon: Users,
    title: 'Rigorous Vetting',
    description: 'with 5-point tenant screening.',
  },
]

export function OwnerPortfolio() {
  const navigate = useNavigate()
  const [brokerStatus, setBrokerStatus] = useState('Awaiting broker decision.')
  const [propertyPosted, setPropertyPosted] = useState(false)

  return (
    <div className="min-h-screen bg-canvas-alt px-6 py-10">
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 text-filter-label uppercase tracking-normal text-navy">
                <CircleDollarSign size={14} />
                Portfolio Overview
              </p>
              <h1 className="mt-2 text-heading-1 font-bold tracking-tight text-navy">
                Your Properties
              </h1>
              <p className="mt-2 max-w-xl text-body leading-6 text-text-primary">
                Monitor and manage your luxury estates. Upgrade your plan to expand your portfolio
                beyond the initial starter asset.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="inline-flex items-center gap-2 rounded-button bg-status-error-bg px-4 py-3 text-label font-bold text-status-error-text">
                <BadgeInfo size={16} />
                Free Plan: 1/1 Property Listed
              </div>
              <button
                type="button"
                onClick={() => navigate(ROUTES.OWNER.REGISTER_PROPERTY)}
                className="inline-flex items-center justify-center gap-2 rounded-button bg-slate-200 px-4 py-3 text-body font-semibold text-text-primary transition-colors duration-200 hover:bg-outline"
              >
                <PlusCircle size={16} />
                Post New Property
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-label text-text-primary">
            <span>Eligible Properties</span>
            <span className="text-primary">3 Properties Available</span>
          </div>

          <article className="rounded-card border border-outline bg-white p-6 shadow-surface">
            <div className="grid gap-5 md:grid-cols-[220px_minmax(0,1fr)_160px] md:items-center">
              <img
                src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=700&q=80"
                alt="Skyline Heights apartment building"
                className="h-36 w-full rounded-button object-cover"
              />

              <div>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-body-lg font-bold text-text-primary">
                      Skyline Heights - Unit 402
                    </h2>
                    <p className="mt-1 text-label text-text-primary">1248 Park Avenue, New York</p>
                  </div>
                  <span className="rounded-pill bg-status-success-bg px-3 py-1.5 text-badge uppercase text-status-success-text">
                    Vacant
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-label text-text-muted">
                  <span className="inline-flex items-center gap-1">
                    <Bed size={14} />
                    2 Beds
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Bath size={14} />
                    2 Baths
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Ruler size={14} />
                    1,200 sqft
                  </span>
                </div>

                <p className="mt-8 text-heading-2 font-bold tracking-tight text-primary">
                  $4,500 <span className="text-label font-medium text-text-muted">/ mo</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setBrokerStatus('Manual broker assignment started.')}
                className="rounded-button bg-navy px-4 py-3 text-body font-semibold text-white transition-all duration-200 hover:bg-slate-800 hover:shadow-md"
              >
                Assign Broker
              </button>
            </div>
          </article>

          <article className="rounded-card bg-[#1f4b6d] p-8 text-white shadow-surface">
            <h2 className="text-heading-2 font-bold leading-tight">
              Scale your legacy
              <br />
              with Premium
            </h2>
            <ul className="mt-5 space-y-3 text-body text-blue-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} />
                Unlimited property listings
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} />
                Advanced financial analytics
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} />
                AI-driven tenant matching
              </li>
            </ul>
            <button
              type="button"
              onClick={() => navigate(ROUTES.OWNER.PLANS_RULES)}
              className="mt-6 w-full rounded-button bg-blue-100 px-4 py-4 text-body font-bold text-navy transition-all duration-200 hover:bg-white hover:shadow-md"
            >
              Explore Plans
            </button>
          </article>
        </section>

        <aside className="space-y-6">
          <article className="rounded-modal bg-navy p-6 text-white shadow-modal">
            <p className="inline-flex items-center gap-2 text-filter-label uppercase tracking-normal text-blue-200">
              <Sparkles size={14} />
              Suggested For You
            </p>

            <div className="mt-6 text-center">
              <div className="mx-auto h-24 w-24 overflow-hidden rounded-modal border-4 border-primary-700 bg-primary-100 p-1">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&q=80"
                  alt="Alexander Pierce broker portrait"
                  className="h-full w-full rounded-card object-cover"
                />
              </div>
              <h2 className="mt-4 text-heading-3 font-semibold text-white">Alexander Pierce</h2>
              <p className="mt-1 text-body text-slate-300">Senior Portfolio Manager</p>
              <div className="mt-3 flex items-center justify-center gap-1">
                {[1, 2, 3, 4, 5].map((item) => (
                  <Star key={item} size={16} className="fill-status-warning text-status-warning" />
                ))}
                <span className="ml-2 text-body font-semibold">4.9/5.0</span>
              </div>
            </div>

            <div className="mt-6 rounded-button border border-slate-700 p-4 text-label leading-5 text-slate-300">
              "12 years of experience in the NY luxury rental market. Specialized in
              high-occupancy strategies and premium tenant vetting."
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-button border border-slate-700 p-4 text-center">
                <p className="text-body font-bold text-primary-100">150+</p>
                <p className="mt-1 text-filter-label uppercase text-slate-400">Properties Managed</p>
              </div>
              <div className="rounded-button border border-slate-700 p-4 text-center">
                <p className="text-body font-bold text-primary-100">98%</p>
                <p className="mt-1 text-filter-label uppercase text-slate-400">Occupancy Rate</p>
              </div>
            </div>

            <div className="mt-6 space-y-0">
              <button
                type="button"
                onClick={() => {
                  setBrokerStatus('Auto assignment sent to Alexander Pierce.')
                  setPropertyPosted(true)
                }}
                className="flex w-full items-center justify-center gap-3 rounded-t-button bg-primary px-4 py-4 text-body font-semibold text-white transition-colors duration-200 hover:bg-primary-700"
              >
                Auto Assign
                <ArrowRight size={18} />
              </button>
              <button
                type="button"
                onClick={() => setBrokerStatus('Suggested broker rejected. We will find another match.')}
                className="w-full rounded-b-button bg-red-700 px-4 py-4 text-body font-semibold text-white transition-colors duration-200 hover:bg-red-800"
              >
                Reject
              </button>
            </div>
          </article>

          <article className="border-l-4 border-primary bg-primary-50 p-5">
            <div className="flex gap-3">
              <Info size={18} className="mt-1 text-primary" />
              <div>
                <h3 className="text-body font-bold text-primary">Request Status</h3>
                <p className="mt-1 text-label leading-5 text-primary">
                  {brokerStatus}
                  {propertyPosted && ' Expect a verification call within 24 hours.'}
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-card border border-outline bg-white p-5 shadow-sm">
            <h3 className="text-body font-bold text-text-primary">Management Benefits</h3>
            <div className="mt-5 space-y-4">
              {benefits.map((benefit) => {
                const Icon = benefit.icon
                return (
                  <div key={benefit.title} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-button bg-primary-50 text-primary">
                      <Icon size={16} />
                    </div>
                    <div>
                      <p className="text-label font-bold text-text-primary">{benefit.title}</p>
                      <p className="text-label leading-5 text-text-muted">{benefit.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </article>
        </aside>
      </div>
    </div>
  )
}
