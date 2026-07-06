import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@shared/constants/routes'
import { useListingPromotionStore } from '@shared/store/listingPromotionStore'
import { usePrototypeStore } from '@shared/store/prototypeStore'
import type { Property } from '../types/property'
import { useTenantMarketplace } from '../hooks/useTenantMarketplace'
import { ListingCard } from '../components/ListingCard'
import { TenantFooter } from '../components/TenantFooter'
import { MaterialIcon } from '../components/MaterialIcon'

type TenantTypeKey = 'family' | 'bachelors' | 'couples'
type BhkConfigKey = '1RK' | '1BHK' | '2BHK' | '3BHK' | '4BHK+'
type SortOption = 'recommended' | 'price-low' | 'price-high' | 'newest'

const RENT_MIN = 0
const RENT_MAX = 150000
const RENT_STEP = 5000

const DEFAULT_TENANT_TYPES: Record<TenantTypeKey, boolean> = {
  family: false,
  bachelors: false,
  couples: false,
}

const DEFAULT_BHK_CONFIG: Record<BhkConfigKey, boolean> = {
  '1RK': false,
  '1BHK': false,
  '2BHK': false,
  '3BHK': false,
  '4BHK+': false,
}

const tenantTypeOptions: TenantTypeKey[] = ['family', 'bachelors', 'couples']
const bhkOptions: BhkConfigKey[] = ['1RK', '1BHK', '2BHK', '3BHK', '4BHK+']

function parseRent(price: string) {
  return Number(price.replace(/[^\d]/g, '')) || 0
}

function formatRent(amount: number) {
  return `Rs. ${amount.toLocaleString('en-IN')}`
}

function getSelectedKeys<T extends string>(record: Record<T, boolean>) {
  return Object.entries(record)
    .filter(([, selected]) => selected)
    .map(([key]) => key as T)
}

function getHighlightValue(property: Property, label: string) {
  return property.highlights.find((item) => item.label === label)?.value ?? ''
}

function getSearchableText(property: Property) {
  return [
    property.title,
    property.location,
    property.price,
    property.deposit,
    property.badge,
    property.posted,
    ...property.overview,
    ...property.highlights.flatMap((item) => [item.label, item.value]),
    ...property.amenities.map((item) => item.label),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

function matchesTenantType(property: Property, selectedTypes: TenantTypeKey[]) {
  if (selectedTypes.length === 0) return true

  const preferredTenant = getHighlightValue(property, 'Preferred Tenant').toLowerCase()

  if (preferredTenant.includes('anyone')) return true

  return selectedTypes.some((type) => {
    if (type === 'family') return preferredTenant.includes('family')
    if (type === 'bachelors') {
      return preferredTenant.includes('bachelor') || preferredTenant.includes('single')
    }

    return preferredTenant.includes('couple')
  })
}

function matchesBhk(property: Property, selectedConfigs: BhkConfigKey[]) {
  if (selectedConfigs.length === 0) return true

  return selectedConfigs.some((config) => {
    if (config === '1RK') return property.beds === 0 || property.title.toLowerCase().includes('rk')
    if (config === '1BHK') return property.beds === 1
    if (config === '2BHK') return property.beds === 2
    if (config === '3BHK') return property.beds === 3

    return property.beds >= 4
  })
}

function postedDaysAgo(property: Property) {
  const match = property.posted.match(/(\d+)/)
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER
}

export function ListingsPage() {
  const navigate = useNavigate()
  const { listings: sessionListings, save: saveProperty, isSaved } = useTenantMarketplace()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSearchTerms, setActiveSearchTerms] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortOption>('recommended')
  const [rentRange, setRentRange] = useState({ min: RENT_MIN, max: RENT_MAX })
  const [tenantTypes, setTenantTypes] = useState(DEFAULT_TENANT_TYPES)
  const [bhkConfig, setBhkConfig] = useState(DEFAULT_BHK_CONFIG)
  const promotedListingIds = useListingPromotionStore((state) => state.getActivePromotedTenantListingIds())
  const brokerAssignments = usePrototypeStore((state) => state.brokerAssignments)

  const selectedTenantTypes = useMemo(() => getSelectedKeys(tenantTypes), [tenantTypes])
  const selectedBhkConfigs = useMemo(() => getSelectedKeys(bhkConfig), [bhkConfig])
  const minRentPercent = ((rentRange.min - RENT_MIN) / (RENT_MAX - RENT_MIN)) * 100
  const maxRentPercent = ((rentRange.max - RENT_MIN) / (RENT_MAX - RENT_MIN)) * 100
  const promotedIdSet = useMemo(() => new Set(promotedListingIds), [promotedListingIds])
  const brokerAssignedListingIds = useMemo(
    () => new Set(brokerAssignments.filter((a) => a.status === 'Active').map((a) => a.listingId)),
    [brokerAssignments],
  )
  const tenantProperties = useMemo(() => {
    return sessionListings.map((property) => {
      if (promotedIdSet.has(property.id) || brokerAssignedListingIds.has(property.id)) {
        return { ...property, badge: 'Suggested' as const }
      }


      return property
    })
  }, [promotedIdSet, brokerAssignedListingIds, sessionListings])

  const hasActiveFilters =
    activeSearchTerms.length > 0 ||
    sortBy !== 'recommended' ||
    rentRange.min !== RENT_MIN ||
    rentRange.max !== RENT_MAX ||
    selectedTenantTypes.length > 0 ||
    selectedBhkConfigs.length > 0

  const filteredProperties = useMemo(() => {
    const normalizedTerms = activeSearchTerms.map((term) => term.toLowerCase())

    return tenantProperties.filter((property) => {
      const propertyRent = parseRent(property.price)
      const matchesSearch =
        normalizedTerms.length === 0 ||
        normalizedTerms.every((term) => getSearchableText(property).includes(term))

      return (
        matchesSearch &&
        propertyRent >= rentRange.min &&
        propertyRent <= rentRange.max &&
        matchesTenantType(property, selectedTenantTypes) &&
        matchesBhk(property, selectedBhkConfigs)
      )
    }).sort((a, b) => {
      if (sortBy === 'price-low') return parseRent(a.price) - parseRent(b.price)
      if (sortBy === 'price-high') return parseRent(b.price) - parseRent(a.price)
      if (sortBy === 'newest') return postedDaysAgo(a) - postedDaysAgo(b)

      return (
        Number(Boolean(b.badge)) - Number(Boolean(a.badge)) ||
        b.shortlists - a.shortlists ||
        b.views - a.views
      )
    })
  }, [activeSearchTerms, rentRange.max, rentRange.min, selectedBhkConfigs, selectedTenantTypes, sortBy, tenantProperties])

  const toggleTenantType = (type: TenantTypeKey) => {
    setTenantTypes((prev) => ({ ...prev, [type]: !prev[type] }))
  }

  const toggleBhk = (config: BhkConfigKey) => {
    setBhkConfig((prev) => ({ ...prev, [config]: !prev[config] }))
  }

  const addSearchTerm = () => {
    const nextTerm = searchQuery.trim()
    if (!nextTerm) return

    setActiveSearchTerms((prev) => {
      const alreadyAdded = prev.some((term) => term.toLowerCase() === nextTerm.toLowerCase())
      return alreadyAdded ? prev : [...prev, nextTerm]
    })
    setSearchQuery('')
  }

  const removeSearchTerm = (termToRemove: string) => {
    setActiveSearchTerms((prev) => prev.filter((term) => term !== termToRemove))
  }

  const handleMinRentChange = (value: string) => {
    const nextValue = Math.min(Number(value), rentRange.max - RENT_STEP)
    setRentRange((prev) => ({ ...prev, min: Math.max(RENT_MIN, nextValue) }))
  }

  const handleMaxRentChange = (value: string) => {
    const nextValue = Math.max(Number(value), rentRange.min + RENT_STEP)
    setRentRange((prev) => ({ ...prev, max: Math.min(RENT_MAX, nextValue) }))
  }

  const clearFilters = () => {
    setSearchQuery('')
    setActiveSearchTerms([])
    setSortBy('recommended')
    setRentRange({ min: RENT_MIN, max: RENT_MAX })
    setTenantTypes(DEFAULT_TENANT_TYPES)
    setBhkConfig(DEFAULT_BHK_CONFIG)
  }

  const handleSaveAndGo = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    saveProperty(id)
    navigate(ROUTES.TENANT.SAVED)
  }

  return (
    <div className="flex flex-1 flex-col bg-brand-background font-body">
      <div className="w-full px-8 pt-6 max-md:px-5">
        <div className="max-w-tenant mx-auto">
          <div className="flex items-center justify-between h-[72px] px-4 py-3 rounded-xl bg-gray-50 shadow-ambient border border-brand-outline-variant/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-accent flex items-center justify-center text-black shrink-0">
                <MaterialIcon name="navigation" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 cursor-pointer">
                  <span className="text-lg font-semibold text-brand">Pg</span>
                  <MaterialIcon name="expand_more" className="!text-xl text-brand" />
                </div>
                <span className="text-sm text-brand-outline">
                  134-b, Srinivasa Premium Coliving, Kid...
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-8 py-4 border-b border-brand-outline-variant/15 bg-brand-container-low">
        <div className="max-w-tenant mx-auto flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-[520px] sm:max-w-[calc(100%-132px)]">
            <MaterialIcon
              name="search"
              className="absolute left-4 top-1/2 -translate-y-1/2 !text-xl text-brand-on-surface-variant pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search locations, properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addSearchTerm()
                }
              }}
              className="w-full pl-12 pr-4 py-3 bg-brand-container-high border-0 border-b border-brand-outline/20 rounded-t-lg font-body text-sm text-brand-on-surface outline-none focus:border-brand focus:border-b-2 transition-all"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {activeSearchTerms.map((term) => (
              <span
                key={term}
                className="inline-flex max-w-[220px] items-center gap-2 rounded-full border border-brand-outline/20 bg-white px-3 py-2 text-xs font-medium text-brand shadow-sm"
              >
                <span className="truncate">{term}</span>
                <button
                  type="button"
                  aria-label={`Remove ${term}`}
                  onClick={() => removeSearchTerm(term)}
                  className="grid h-5 w-5 place-items-center rounded-full text-brand-on-surface-variant hover:bg-brand-container-high hover:text-brand"
                >
                  <MaterialIcon name="close" className="!text-base" />
                </button>
              </span>
            ))}
          </div>
          <button
            type="button"
            className="flex items-center gap-2 whitespace-nowrap px-6 py-3 rounded-md border-0 text-white font-body text-sm font-medium cursor-pointer bg-gradient-to-r from-brand to-brand-container shadow-sm hover:opacity-90 transition-opacity"
            onClick={addSearchTerm}
          >
            Search
          </button>
        </div>
      </div>

      <main className="flex-1 w-full max-w-tenant mx-auto px-8 py-12 flex flex-col md:flex-row gap-12">
        <div className="flex-grow w-full md:w-3/4">
          <div className="mb-8">
            <h1 className="font-display text-[30px] font-bold text-brand tracking-tight">
              Curated Properties
            </h1>
            <p className="text-sm text-brand-on-surface-variant mt-2">
              Showing {filteredProperties.length} of {tenantProperties.length} available residences matching your criteria.
            </p>
          </div>

          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredProperties.map((property) => (
                <ListingCard
                  key={property.id}
                  property={property}
                  isSaved={isSaved(property.id)}
                  onSelect={() => navigate(ROUTES.TENANT.PROPERTY(property.id))}
                  onFavoriteClick={(e) => handleSaveAndGo(property.id, e)}
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-lg border border-dashed border-brand-outline/25 bg-brand-container-low px-6 text-center">
              <MaterialIcon name="search_off" className="!text-4xl text-brand-on-surface-variant" />
              <h2 className="mt-4 font-display text-xl font-semibold text-brand">
                No properties found
              </h2>
              <p className="mt-2 max-w-md text-sm text-brand-on-surface-variant">
                Try removing a search term or widening the rent and configuration filters.
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 rounded-md bg-brand px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

        <aside className="w-full md:w-1/4">
          <div className="flex flex-col gap-8 p-6 rounded-lg bg-brand-container-low border border-brand-outline-variant/15">
            <div>
              <label className="block text-filter-label uppercase text-brand-on-surface-variant mb-3">
                Sort Results
              </label>
              <div className="relative w-full">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full appearance-none bg-white border-0 border-b border-brand-outline/20 text-brand-on-surface py-2 pl-3 pr-9 font-body text-sm rounded-t outline-none cursor-pointer focus:border-brand focus:border-b-2"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
                <MaterialIcon
                  name="expand_more"
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none !text-xl text-brand-on-surface-variant"
                />
              </div>
            </div>

            <div>
              <label className="block text-filter-label uppercase text-brand-on-surface-variant mb-3">
                Monthly Rent Range
              </label>
              <div className="px-2">
                <div className="relative mb-4 h-6">
                  <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded bg-brand-container-high" />
                  <div
                    className="absolute top-1/2 h-1 -translate-y-1/2 rounded bg-brand"
                    style={{
                      left: `${minRentPercent}%`,
                      right: `${100 - maxRentPercent}%`,
                    }}
                  />
                  <input
                    type="range"
                    min={RENT_MIN}
                    max={RENT_MAX}
                    step={RENT_STEP}
                    value={rentRange.min}
                    onChange={(e) => handleMinRentChange(e.target.value)}
                    aria-label="Minimum rent"
                    className="pointer-events-none absolute inset-0 h-6 w-full appearance-none bg-transparent accent-brand [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm"
                  />
                  <input
                    type="range"
                    min={RENT_MIN}
                    max={RENT_MAX}
                    step={RENT_STEP}
                    value={rentRange.max}
                    onChange={(e) => handleMaxRentChange(e.target.value)}
                    aria-label="Maximum rent"
                    className="pointer-events-none absolute inset-0 h-6 w-full appearance-none bg-transparent accent-brand [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm"
                  />
                </div>
                <div className="flex justify-between font-body text-sm text-brand-on-surface-variant">
                  <span>{formatRent(rentRange.min)}</span>
                  <span>{rentRange.max === RENT_MAX ? `${formatRent(rentRange.max)}+` : formatRent(rentRange.max)}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-filter-label uppercase text-brand-on-surface-variant mb-3">
                Tenant Profile
              </label>
              <div className="flex flex-col gap-3">
                {tenantTypeOptions.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={tenantTypes[type]}
                        onChange={() => toggleTenantType(type)}
                        className="appearance-none w-5 h-5 border-2 border-brand-outline/50 rounded cursor-pointer checked:bg-brand checked:border-brand transition-all"
                      />
                      <MaterialIcon
                        name="check"
                        className="absolute !text-base text-white opacity-0 pointer-events-none peer-checked:opacity-100"
                        style={{
                          opacity: tenantTypes[type] ? 1 : 0,
                        }}
                      />
                    </div>
                    <span className="font-body text-sm text-brand-on-surface group-hover:text-brand transition-colors capitalize">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-filter-label uppercase text-brand-on-surface-variant mb-3">
                Configuration
              </label>
              <div className="flex flex-wrap gap-2">
                {bhkOptions.map((config) => (
                  <label key={config} className="cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={bhkConfig[config]}
                      onChange={() => toggleBhk(config)}
                    />
                    <span
                      className={`inline-block px-4 py-2 border rounded-md font-body text-sm transition-all ${
                        bhkConfig[config]
                          ? 'bg-brand text-white border-brand'
                          : 'border-brand-outline/30 text-brand-on-surface-variant hover:bg-brand-container-high'
                      }`}
                    >
                      {config}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={addSearchTerm}
              className="w-full mt-4 py-3 rounded-md border-0 bg-brand-container-high text-brand font-body font-medium text-sm cursor-pointer hover:bg-brand-container-low transition-colors"
            >
              Apply Filters
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="w-full -mt-5 py-2 text-sm font-medium text-brand-on-surface-variant hover:text-brand"
              >
                Clear All
              </button>
            )}
          </div>
        </aside>
      </main>

      <TenantFooter />
    </div>
  )
}
