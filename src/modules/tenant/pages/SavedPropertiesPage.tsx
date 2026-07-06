import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@shared/constants/routes'
import { useTenantMarketplace } from '../hooks/useTenantMarketplace'
import { ListingCard } from '../components/ListingCard'
import { TenantFooter } from '../components/TenantFooter'
import { MaterialIcon } from '../components/MaterialIcon'
import { tenantStyles } from '../utils/tenantStyles'

export function SavedPropertiesPage() {
  const navigate = useNavigate()
  const { savedListings: savedProperties, unsave, isSaved } = useTenantMarketplace()

  return (
    <div className={tenantStyles.page}>
      <main className={tenantStyles.main}>
        <button
          type="button"
          className={tenantStyles.backBtn}
          onClick={() => navigate(ROUTES.TENANT.LISTINGS)}
        >
          <MaterialIcon name="arrow_back" />
          Back to all properties
        </button>

        <div className="mb-8">
          <h1 className={tenantStyles.pageTitle}>Saved Properties</h1>
          <p className={tenantStyles.pageSubtitle}>
            {savedProperties.length === 0
              ? 'Properties you save with the heart icon appear here.'
              : `You have ${savedProperties.length} saved ${
                  savedProperties.length === 1 ? 'property' : 'properties'
                }.`}
          </p>
        </div>

        {savedProperties.length === 0 ? (
          <div className="text-center py-16 px-6 bg-brand-container-lowest rounded-2xl border border-brand-outline-variant">
            <MaterialIcon
              name="favorite_border"
              className="!text-[56px] text-brand-outline mb-4 block mx-auto"
            />
            <h2 className="font-display text-[22px] text-brand mb-2">No saved properties yet</h2>
            <p className="text-[15px] text-brand-on-surface-variant mb-6">
              Tap the heart on any listing to save it and view it here.
            </p>
            <button
              type="button"
              className={tenantStyles.brandBtn}
              onClick={() => navigate(ROUTES.TENANT.LISTINGS)}
            >
              Browse properties
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-full">
            {savedProperties.map((property) => (
              <ListingCard
                key={property.id}
                property={property}
                isSaved={isSaved(property.id)}
                onSelect={() => navigate(ROUTES.TENANT.PROPERTY(property.id))}
                onFavoriteClick={(e) => {
                  e.stopPropagation()
                  unsave(property.id)
                }}
              />
            ))}
          </div>
        )}
      </main>

      <TenantFooter compact />
    </div>
  )
}
