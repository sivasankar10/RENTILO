import { MapPin, Bed, Bath, Maximize } from 'lucide-react'
import { Card } from '@shared/ui'
import { StatusBadge } from './StatusBadge'
import { cn } from '@shared/utils/cn'
import type { Property } from '@shared/types'

interface PropertyCardProps {
  property: Property
  onClick?: () => void
  className?: string
}

export function PropertyCard({ property, onClick, className }: PropertyCardProps) {
  return (
    <Card
      hover
      padding="sm"
      className={cn('overflow-hidden p-0', className)}
      onClick={onClick}
    >
      {/* Property Image */}
      <div className="relative h-48 bg-canvas overflow-hidden">
        {property.images[0] ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-text-muted text-label">
            No Image
          </div>
        )}
        <div className="absolute top-3 right-3">
          <StatusBadge status={property.status} />
        </div>
      </div>

      {/* Property Details */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-heading-3 text-text-primary line-clamp-1">
            {property.title}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-text-muted text-label mb-3">
          <MapPin size={14} />
          <span className="line-clamp-1">
            {property.city}, {property.state}
          </span>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4 text-text-muted text-label mb-4">
          <div className="flex items-center gap-1">
            <Bed size={14} />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath size={14} />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize size={14} />
            <span>
              {property.area} {property.areaUnit}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-3 border-t border-outline">
          <span className="text-heading-3 text-primary">
            {property.currency} {property.price.toLocaleString()}
          </span>
          <span className="text-label text-text-muted">/month</span>
        </div>
      </div>
    </Card>
  )
}
