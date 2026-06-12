import { useState } from 'react'
import { Bus, CarFront, MapPin, Navigation, Plane, Train, type LucideIcon } from 'lucide-react'
import { MaterialIcon } from '@shared/components/MaterialIcon'
import type {
  BrokerAssignedProperty,
  BrokerNearbyPlace,
  BrokerPropertyTransit,
} from '../constants/assignedProperties'

type NearbyTab = 'transit' | 'essentials' | 'utility'

interface BrokerPropertyIntelProps {
  property: BrokerAssignedProperty
  heading?: string
  showHeader?: boolean
}

function NearbyPlaceList({ places, emptyMessage }: { places: BrokerNearbyPlace[]; emptyMessage: string }) {
  if (!places.length) {
    return <p className="py-4 text-[13px] font-medium text-text-muted">{emptyMessage}</p>
  }

  return (
    <ul className="divide-y divide-outline">
      {places.map((place) => (
        <li key={place.name} className="flex flex-wrap items-baseline justify-between gap-3 py-3">
          <span className="text-[14px] font-semibold text-[#0f172a]">{place.name}</span>
          <span className="text-[12px] font-semibold text-text-muted">
            {place.distance} | {place.time}
          </span>
        </li>
      ))}
    </ul>
  )
}

function TransitGroup({
  icon: Icon,
  label,
  places,
  emptyMessage,
}: {
  icon: LucideIcon
  label: string
  places: BrokerNearbyPlace[]
  emptyMessage: string
}) {
  return (
    <div>
      <h4 className="mb-2 flex items-center gap-2 text-[13px] font-bold text-[#0f172a]">
        <Icon size={15} className="text-primary" />
        {label}
      </h4>
      <NearbyPlaceList places={places} emptyMessage={emptyMessage} />
    </div>
  )
}

function NearbyPanel({ tab, transit, places }: {
  tab: NearbyTab
  transit: BrokerPropertyTransit
  places: BrokerNearbyPlace[]
}) {
  if (tab === 'transit') {
    return (
      <div className="space-y-5">
        <TransitGroup
          icon={Bus}
          label="Bus Stations"
          places={transit.busStations}
          emptyMessage="No bus stops within the tracked radius"
        />
        <TransitGroup
          icon={Train}
          label="Train Stations"
          places={transit.trainStations}
          emptyMessage="No train stations within the tracked radius"
        />
        <TransitGroup
          icon={Plane}
          label="Airport"
          places={transit.airport}
          emptyMessage="No airport access points nearby"
        />
      </div>
    )
  }

  return (
    <NearbyPlaceList
      places={places}
      emptyMessage={tab === 'essentials' ? 'No essentials nearby' : 'No utility points nearby'}
    />
  )
}

export function BrokerPropertyIntel({
  property,
  heading = 'Property Details',
  showHeader = true,
}: BrokerPropertyIntelProps) {
  const [activeNearbyTab, setActiveNearbyTab] = useState<NearbyTab>('transit')
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${property.name} ${property.fullAddress}`
  )}`
  const nearbyPlaces =
    activeNearbyTab === 'essentials' ? property.nearby.essentials : property.nearby.utility

  return (
    <section className="space-y-5">
      {showHeader && (
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-text-muted">
              Assigned Property
            </p>
            <h2 className="mt-1 text-[20px] font-extrabold text-[#0f172a]">{heading}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-700">
              {property.type}
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
              {property.leasePercent}% leased
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <div className="rounded-xl border border-outline bg-white p-6 shadow-ambient">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <h3 className="text-[22px] font-extrabold text-[#0f172a]">{property.name}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-[14px] font-medium text-text-muted">
                  <MapPin size={15} />
                  {property.fullAddress}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-[24px] font-extrabold text-[#0f172a]">{property.price}</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Deposit: {property.deposit}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { label: 'Bedrooms', value: `${property.beds} Beds` },
                { label: 'Bathrooms', value: `${property.baths} Baths` },
                { label: 'Total Area', value: `${property.sqft} sqft` },
                { label: 'Preference', value: property.tenantPreference },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-slate-50 px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    {item.label}
                  </p>
                  <p className="mt-1 text-[14px] font-bold text-[#0f172a]">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {property.specs.map((spec) => (
                <div key={spec.label} className="flex items-center justify-between gap-3 border-b border-outline py-2 last:border-b-0 lg:[&:nth-last-child(-n+3)]:border-b-0">
                  <span className="text-[12px] font-semibold text-text-muted">{spec.label}</span>
                  <span className="text-right text-[13px] font-bold text-[#0f172a]">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-outline bg-white p-6 shadow-ambient">
            <h3 className="text-[16px] font-bold text-[#0f172a]">Overview</h3>
            <div className="mt-4 space-y-3">
              {property.overview.map((paragraph) => (
                <p key={paragraph} className="text-[14px] leading-7 text-text-muted">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-outline bg-white p-6 shadow-ambient">
            <h3 className="text-[16px] font-bold text-[#0f172a]">What&apos;s Nearby</h3>
            <div className="mt-4 flex gap-2 border-b border-outline">
              {[
                { id: 'transit' as const, label: 'Transit' },
                { id: 'essentials' as const, label: 'Essentials' },
                { id: 'utility' as const, label: 'Utility' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`-mb-px px-4 py-2.5 text-[13px] font-bold transition-colors ${
                    activeNearbyTab === tab.id
                      ? 'border-b-2 border-primary text-primary'
                      : 'border-b-2 border-transparent text-text-muted hover:text-[#0f172a]'
                  }`}
                  onClick={() => setActiveNearbyTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="mt-5 rounded-lg border border-outline bg-slate-50 px-5 py-4">
              <NearbyPanel
                tab={activeNearbyTab}
                transit={property.nearby.transit}
                places={nearbyPlaces}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.15fr]">
            <div className="rounded-xl border border-outline bg-white p-6 shadow-ambient">
              <h3 className="text-[16px] font-bold text-[#0f172a]">Amenities</h3>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {property.amenities.map((amenity) => (
                  <div
                    key={amenity.label}
                    className="flex min-h-[96px] flex-col items-center justify-center gap-2 rounded-lg bg-slate-50 p-4 text-center"
                  >
                    <MaterialIcon name={amenity.icon} className="!text-[28px] text-primary" />
                    <span className="text-[12px] font-bold text-[#0f172a]">{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-outline bg-white p-6 shadow-ambient">
              <h3 className="text-[16px] font-bold text-[#0f172a]">Property Rules</h3>
              <div className="mt-4 overflow-hidden rounded-lg border border-outline">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-text-muted">
                        Rule
                      </th>
                      <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-text-muted">
                        Category
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline">
                    {property.rules.map((rule) => (
                      <tr key={rule.rule}>
                        <td className="px-4 py-3 text-[13px] font-medium leading-5 text-[#0f172a]">
                          {rule.rule}
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                            {rule.category}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="overflow-hidden rounded-xl border border-outline bg-white shadow-ambient">
            <div className="relative h-[300px] bg-[#dfe8ef]">
              <div className="absolute inset-0 opacity-60">
                <div className="absolute left-0 top-[24%] h-2 w-full rotate-[-8deg] bg-white/80" />
                <div className="absolute left-0 top-[58%] h-2 w-full rotate-[10deg] bg-white/80" />
                <div className="absolute left-[28%] top-0 h-full w-2 rotate-[18deg] bg-white/80" />
                <div className="absolute right-[22%] top-0 h-full w-2 rotate-[-16deg] bg-white/80" />
              </div>
              <div className="absolute left-8 top-8 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-slate-700 shadow-ambient">
                {property.map.title}
              </div>
              <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0f172a] text-white shadow-card">
                  <MapPin size={26} fill="currentColor" />
                </span>
                <span className="mt-2 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#0f172a] shadow-ambient">
                  {property.name}
                </span>
              </div>
              <div className="absolute bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-ambient">
                <Navigation size={20} />
              </div>
            </div>
            <div className="space-y-4 p-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Coordinates
                </p>
                <p className="mt-1 text-[14px] font-bold text-[#0f172a]">{property.map.coordinates}</p>
              </div>
              <p className="text-[13px] leading-6 text-text-muted">{property.map.coverage}</p>
              <p className="flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-3 text-[13px] font-semibold leading-5 text-[#0f172a]">
                <CarFront size={16} className="mt-0.5 shrink-0 text-primary" />
                {property.map.commuteNote}
              </p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#0f172a] text-[13px] font-bold text-white hover:bg-navy/80"
              >
                <Navigation size={15} />
                Open Map
              </a>
            </div>
          </div>

          <div className="rounded-xl border border-outline bg-[#0f172a] p-5 text-white shadow-card">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Brokerage Snapshot
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <p className="text-[22px] font-extrabold">{property.value}</p>
                <p className="text-[11px] font-semibold text-slate-400">Asset value</p>
              </div>
              <div>
                <p className="text-[22px] font-extrabold">{property.leasePercent}%</p>
                <p className="text-[11px] font-semibold text-slate-400">Leased</p>
              </div>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-white" style={{ width: `${property.leasePercent}%` }} />
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
