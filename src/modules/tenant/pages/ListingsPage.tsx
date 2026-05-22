import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@shared/constants/routes'
import { PROPERTIES } from '../constants/properties'
import { useSavedPropertiesStore } from '../store/savedPropertiesStore'
import { ListingCard } from '../components/ListingCard'
import { TenantFooter } from '../components/TenantFooter'
import { MaterialIcon } from '../components/MaterialIcon'

export function ListingsPage() {
  const navigate = useNavigate()
  const { saveProperty, isSaved } = useSavedPropertiesStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('recommended')
  const [tenantTypes, setTenantTypes] = useState({
    family: false,
    bachelors: false,
    couples: true,
  })
  const [bhkConfig, setBhkConfig] = useState({
    '1RK': false,
    '1BHK': false,
    '2BHK': true,
    '3BHK': false,
    '4BHK+': false,
  })

  const toggleTenantType = (type: keyof typeof tenantTypes) => {
    setTenantTypes((prev) => ({ ...prev, [type]: !prev[type] }))
  }

  const toggleBhk = (config: keyof typeof bhkConfig) => {
    setBhkConfig((prev) => ({ ...prev, [config]: !prev[config] }))
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
        <div className="max-w-tenant mx-auto flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-1/3">
            <MaterialIcon
              name="search"
              className="absolute left-4 top-1/2 -translate-y-1/2 !text-xl text-brand-on-surface-variant pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search locations, properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-brand-container-high border-0 border-b border-brand-outline/20 rounded-t-lg font-body text-sm text-brand-on-surface outline-none focus:border-brand focus:border-b-2 transition-all"
            />
          </div>
          <button
            type="button"
            className="flex items-center gap-2 whitespace-nowrap px-6 py-3 rounded-md border-0 text-white font-body text-sm font-medium cursor-pointer bg-gradient-to-r from-brand to-brand-container shadow-sm hover:opacity-90 transition-opacity"
            onClick={() => navigate(ROUTES.TENANT.PROFILE)}
          >
            <MaterialIcon name="person" className="!text-xl" />
            My Profile
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
              Showing {PROPERTIES.length} available residences matching your criteria.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {PROPERTIES.map((property) => (
              <ListingCard
                key={property.id}
                property={property}
                isSaved={isSaved(property.id)}
                onSelect={() => navigate(ROUTES.TENANT.PROPERTY(property.id))}
                onFavoriteClick={(e) => handleSaveAndGo(property.id, e)}
              />
            ))}
          </div>
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
                  onChange={(e) => setSortBy(e.target.value)}
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
                <div className="relative h-1 w-full bg-brand-container-high rounded mb-4">
                  <div className="absolute left-[20%] right-[40%] h-full bg-brand rounded" />
                  <div className="absolute left-[20%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-brand rounded-full shadow-sm" />
                  <div className="absolute right-[40%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-brand rounded-full shadow-sm" />
                </div>
                <div className="flex justify-between font-body text-sm text-brand-on-surface-variant">
                  <span>$1,500</span>
                  <span>$8,000+</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-filter-label uppercase text-brand-on-surface-variant mb-3">
                Tenant Profile
              </label>
              <div className="flex flex-col gap-3">
                {(['family', 'bachelors', 'couples'] as const).map((type) => (
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
                {Object.keys(bhkConfig).map((config) => (
                  <label key={config} className="cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={bhkConfig[config as keyof typeof bhkConfig]}
                      onChange={() => toggleBhk(config as keyof typeof bhkConfig)}
                    />
                    <span
                      className={`inline-block px-4 py-2 border rounded-md font-body text-sm transition-all ${
                        bhkConfig[config as keyof typeof bhkConfig]
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
              className="w-full mt-4 py-3 rounded-md border-0 bg-brand-container-high text-brand font-body font-medium text-sm cursor-pointer hover:bg-brand-container-low transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </aside>
      </main>

      <TenantFooter />
    </div>
  )
}
