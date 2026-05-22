import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ROUTES } from '@shared/constants/routes'
import { cn } from '@shared/utils/cn'
import { getPropertyById } from '../constants/properties'
import type { NearbyPlace } from '../types/property'
import { MaterialIcon } from '../components/MaterialIcon'
import { tenantStyles } from '../utils/tenantStyles'

function renderPlaceList(places: NearbyPlace[] | undefined, emptyMessage: string) {
  if (!places?.length) {
    return <p className="text-[13px] text-brand-outline italic">{emptyMessage}</p>
  }
  return (
    <ul className="list-none">
      {places.map((place) => (
        <li
          key={place.name}
          className="flex flex-wrap justify-between items-baseline gap-2 py-3 border-b border-brand-outline-variant last:border-0 first:pt-0 last:pb-0"
        >
          <span className="text-sm font-medium text-brand-on-surface">{place.name}</span>
          <span className="text-[13px] text-brand-outline whitespace-nowrap">
            {place.distance} | {place.time}
          </span>
        </li>
      ))}
    </ul>
  )
}

export function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const property = id ? getPropertyById(id) : null
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [activeNearbyTab, setActiveNearbyTab] = useState<'transit' | 'essentials' | 'utility'>(
    'transit'
  )

  if (!property) {
    return (
      <div className={tenantStyles.page}>
        <div className="max-w-[1200px] mx-auto my-20 text-center">
          <h2 className="text-brand mb-6 font-display text-2xl font-bold">Property not found</h2>
          <button
            type="button"
            className={tenantStyles.brandBtn}
            onClick={() => navigate(ROUTES.TENANT.LISTINGS)}
          >
            Back to listings
          </button>
        </div>
      </div>
    )
  }

  const gallery = property.gallery.length ? property.gallery : [property.image]

  return (
    <div className={cn(tenantStyles.page, 'min-h-screen')}>
      <main className={tenantStyles.main}>
        <button
          type="button"
          className={tenantStyles.backBtn}
          onClick={() => navigate(ROUTES.TENANT.LISTINGS)}
        >
          <MaterialIcon name="arrow_back" />
          Back to listings
        </button>

        <div className="flex flex-wrap justify-between items-start gap-6 mb-8">
          <div>
            <h1 className="font-display text-[clamp(28px,4vw,36px)] font-extrabold text-brand tracking-tight leading-tight mb-2">
              {property.title}
            </h1>
            <p className="flex items-center gap-1 text-[15px] text-brand-outline">
              <MaterialIcon name="location_on" className="!text-xl" />
              {property.location}
            </p>
          </div>
          <div className="text-right max-md:text-left">
            <div>
              <span className="font-display text-[clamp(28px,4vw,36px)] font-extrabold text-brand">
                {property.price}
              </span>
              <span className="text-lg font-semibold text-brand">{property.pricePeriod}</span>
            </div>
            <p className="text-xs font-semibold tracking-wider text-brand-outline mt-1">
              DEPOSIT: {property.deposit}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start max-lg:grid-cols-1">
          <div className="max-lg:order-2">
            <section className="mb-12">
              <div className="w-full aspect-video rounded-xl overflow-hidden bg-brand-container-low mb-3">
                <img
                  src={gallery[activeImageIndex]}
                  alt={`${property.title} — view ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover block"
                />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {gallery.map((src, index) => (
                  <button
                    key={`${src}-${index}`}
                    type="button"
                    className={cn(
                      'aspect-[4/3] rounded-lg overflow-hidden border-2 p-0 cursor-pointer bg-brand-container-low transition-colors',
                      activeImageIndex === index ? 'border-brand' : 'border-transparent'
                    )}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img src={src} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover block" />
                  </button>
                ))}
              </div>
            </section>

            <section className="mb-12">
              <h2 className={tenantStyles.sectionTitle}>Overview</h2>
              {property.overview.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-[15px] leading-relaxed text-brand-on-surface-variant mb-3.5 last:mb-0"
                >
                  {paragraph}
                </p>
              ))}
              {property.overviewSpecs.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-6 p-6 bg-brand-container-lowest border border-brand-outline-variant rounded-xl">
                  {property.overviewSpecs.map((spec) => (
                    <div key={spec.label} className="flex flex-col gap-1">
                      <span className="text-xs text-brand-outline font-medium">{spec.label}</span>
                      <span className="text-sm font-semibold text-brand">{spec.value}</span>
                    </div>
                  ))}
                </div>
              )}
              {property.noBrokerServices && (
                <div className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 rounded-lg bg-brand-verified text-brand text-sm font-semibold">
                  <MaterialIcon name="verified_user" className="!text-xl" />
                  <span>NoBroker Services</span>
                </div>
              )}
            </section>

            <section className="mb-12">
              <h2 className={tenantStyles.sectionTitle}>What&apos;s Nearby</h2>
              <div className="flex gap-2 mb-5 border-b border-brand-outline-variant">
                {(
                  [
                    { id: 'transit' as const, label: 'Transit' },
                    { id: 'essentials' as const, label: 'Essentials' },
                    { id: 'utility' as const, label: 'Utility' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={cn(
                      'px-5 py-2.5 border-0 bg-transparent font-body text-sm font-semibold cursor-pointer -mb-px border-b-2 transition-colors',
                      activeNearbyTab === tab.id
                        ? 'text-brand border-brand'
                        : 'text-brand-outline border-transparent hover:text-brand'
                    )}
                    onClick={() => setActiveNearbyTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="bg-brand-container-lowest border border-brand-outline-variant rounded-xl px-6 py-5">
                {activeNearbyTab === 'transit' && (
                  <>
                    <div className="mb-6 last:mb-0">
                      <h3 className="font-display text-[15px] font-bold text-brand mb-3">
                        Bus Stations
                      </h3>
                      {renderPlaceList(
                        property.nearby.transit.busStations,
                        'No bus stations within 2 km'
                      )}
                    </div>
                    <div className="mb-6 last:mb-0">
                      <h3 className="font-display text-[15px] font-bold text-brand mb-3">Airport</h3>
                      {renderPlaceList(
                        property.nearby.transit.airport,
                        'No airport access points within 5 km'
                      )}
                    </div>
                    <div className="mb-6 last:mb-0">
                      <h3 className="font-display text-[15px] font-bold text-brand mb-3">
                        Train Stations
                      </h3>
                      {renderPlaceList(
                        property.nearby.transit.trainStations,
                        'No train stations within 5 km'
                      )}
                    </div>
                  </>
                )}
                {activeNearbyTab === 'essentials' && (
                  <div>
                    <h3 className="font-display text-[15px] font-bold text-brand mb-3">Essentials</h3>
                    {renderPlaceList(property.nearby.essentials, 'No essentials within 2 km')}
                  </div>
                )}
                {activeNearbyTab === 'utility' && (
                  <div>
                    <h3 className="font-display text-[15px] font-bold text-brand mb-3">Utility</h3>
                    {renderPlaceList(property.nearby.utility, 'No utility points within 2 km')}
                  </div>
                )}
              </div>
            </section>

            <section className="mb-12">
              <h2 className={tenantStyles.sectionTitle}>Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {property.amenities.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center justify-center gap-2.5 py-6 px-4 bg-brand-container-low rounded-xl text-center"
                  >
                    <MaterialIcon name={item.icon} className="!text-[28px] text-brand" />
                    <span className="text-[13px] font-medium text-brand">{item.label}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-12">
              <h2 className={tenantStyles.sectionTitle}>Property Rules</h2>
              <div className="rounded-xl overflow-hidden border border-brand-outline-variant bg-brand-container-lowest">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="text-left py-3.5 px-5 text-[11px] font-bold uppercase tracking-wider text-brand-outline bg-brand-container-low border-b border-brand-outline-variant">
                        Rule
                      </th>
                      <th className="text-left py-3.5 px-5 text-[11px] font-bold uppercase tracking-wider text-brand-outline bg-brand-container-low border-b border-brand-outline-variant">
                        Category
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {property.rules.map((row, i) => (
                      <tr key={i}>
                        <td className="py-3.5 px-5 text-brand-on-surface border-b border-brand-outline-variant align-top last:border-0">
                          {row.rule}
                        </td>
                        <td className="py-3.5 px-5 border-b border-brand-outline-variant align-top last:border-0">
                          <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold text-brand bg-brand-verified">
                            {row.category}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <aside className="sticky top-[100px] max-lg:static max-lg:order-1">
            <div className="bg-brand-container-lowest rounded-2xl p-7 shadow-card border border-brand-outline-variant">
              <div className="grid grid-cols-2 gap-5 mb-6">
                {property.highlights.map((item) => (
                  <div key={item.label}>
                    <span className="block text-[11px] font-semibold text-brand-outline mb-1 leading-snug">
                      {item.label}
                    </span>
                    <span className="text-sm font-semibold text-brand leading-snug">{item.value}</span>
                  </div>
                ))}
              </div>

              <button type="button" className={cn(tenantStyles.primaryBtn, 'mb-3')}>
                Schedule Visit
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-5 mb-6 rounded-[10px] border-0 bg-brand-container-low text-brand font-body text-[15px] font-semibold cursor-pointer hover:bg-brand-container-high transition-colors"
              >
                <MaterialIcon name="chat" className="!text-xl" />
                I&apos;m Interested
              </button>

              <div className="grid grid-cols-3 gap-2 pt-5 border-t border-brand-outline-variant text-center">
                <div>
                  <span className="block font-display text-[22px] font-extrabold text-brand">
                    {property.views}
                  </span>
                  <span className="text-[10px] font-bold tracking-wider text-brand-outline">VIEWS</span>
                </div>
                <div>
                  <span className="block font-display text-[22px] font-extrabold text-brand">
                    {property.shortlists}
                  </span>
                  <span className="text-[10px] font-bold tracking-wider text-brand-outline">
                    SHORTLISTS
                  </span>
                </div>
                <div>
                  <span className="block font-display text-[22px] font-extrabold text-brand">
                    {property.contacts}
                  </span>
                  <span className="text-[10px] font-bold tracking-wider text-brand-outline">
                    CONTACTS
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="border-t border-brand-container-low py-6 px-8 mt-auto">
        <div className="max-w-[1200px] mx-auto flex flex-wrap justify-between items-center gap-4">
          <span className="text-[13px] font-semibold text-brand">
            © 2024 RENTILO. The Curated Estate.
          </span>
          <nav className="flex gap-6">
            {['Privacy', 'Terms', 'Support', 'Contact'].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                className="text-[13px] text-brand-outline no-underline hover:text-brand"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  )
}
