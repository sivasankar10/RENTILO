import { cn } from '@shared/utils/cn'
import type { Property } from '../types/property'
import { MaterialIcon } from './MaterialIcon'

interface ListingCardProps {
  property: Property
  isSaved: boolean
  onSelect: () => void
  onFavoriteClick: (e: React.MouseEvent) => void
}

export function ListingCard({
  property,
  isSaved,
  onSelect,
  onFavoriteClick,
}: ListingCardProps) {
  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-lg cursor-pointer bg-white border border-brand-outline-variant/15 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect()
        }
      }}
    >
      <button
        type="button"
        className={cn(
          'absolute top-4 right-4 z-10 flex items-center justify-center p-2 rounded-full border-0',
          'bg-white/80 backdrop-blur-xl text-brand-on-surface shadow-sm transition-colors',
          'hover:text-brand-favorite',
          isSaved && 'text-brand-favorite'
        )}
        onClick={onFavoriteClick}
        aria-label={isSaved ? 'Remove from saved' : 'Save property and view saved list'}
      >
        <MaterialIcon name="favorite" filled={isSaved} />
      </button>

      <div className="relative h-64 overflow-hidden bg-brand-container-low">
        {property.badge && (
          <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-brand-verified/90 backdrop-blur-sm text-brand text-[10px] font-bold uppercase tracking-widest shadow-sm">
            {property.badge}
          </div>
        )}
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          <div className="w-2 h-2 rounded-full bg-white" />
          <div className="w-2 h-2 rounded-full bg-white/50" />
          <div className="w-2 h-2 rounded-full bg-white/50" />
        </div>
      </div>

      <div className="flex flex-col flex-grow p-6">
        <div className="flex justify-between items-start mb-2">
          <h2 className="font-display text-xl font-bold text-brand">{property.title}</h2>
          <div className="text-right whitespace-nowrap">
            <span className="font-display text-lg font-bold text-brand">{property.price} </span>
            <span className="font-body text-sm text-brand-on-surface-variant">/mo</span>
          </div>
        </div>

        <p className="flex items-center gap-1 text-sm text-brand-on-surface-variant mb-4">
          <MaterialIcon name="location_on" className="!text-base" />
          {property.location}
        </p>

        <div className="flex items-center gap-4 text-sm text-brand-on-surface-variant mb-6 pb-4 border-b border-brand-container-high">
          <span className="flex items-center gap-1">
            <MaterialIcon name="bed" className="!text-base" />
            {property.beds} Bed
          </span>
          <span className="flex items-center gap-1">
            <MaterialIcon name="bathtub" className="!text-base" />
            {property.baths} Bath
          </span>
          <span className="flex items-center gap-1">
            <MaterialIcon name="straighten" className="!text-base" />
            {property.sqft} sqft
          </span>
        </div>

        <div className="flex justify-between items-center mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-on-surface-variant">
              Deposit
            </span>
            <span className="font-body text-sm font-medium text-brand">{property.deposit}</span>
          </div>
          <span className="text-xs text-brand-on-surface-variant bg-brand-container-low px-3 py-1 rounded-full">
            {property.posted}
          </span>
        </div>
      </div>
    </article>
  )
}
