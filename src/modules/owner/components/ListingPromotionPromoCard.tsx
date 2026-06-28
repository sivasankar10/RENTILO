import { Megaphone, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@shared/constants/routes'
import { LISTING_PROMOTION_PRICE_INR } from '@shared/constants/listingPromotion'
import { cn } from '@shared/utils/cn'

interface ListingPromotionPromoCardProps {
  className?: string
  compact?: boolean
}

export function ListingPromotionPromoCard({ className, compact }: ListingPromotionPromoCardProps) {
  const navigate = useNavigate()

  return (
    <article
      className={cn(
        'overflow-hidden rounded-card border border-primary/25 bg-gradient-to-br from-primary-50 via-white to-white shadow-surface',
        className,
      )}
    >
      <div className={cn('p-6', compact && 'p-5')}>
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy text-white">
            <Megaphone size={20} />
          </div>
          <div>
            <p className="text-filter-label font-bold uppercase tracking-wider text-primary">Listing Boost</p>
            <h2 className={cn('mt-1 font-bold text-navy', compact ? 'text-body-lg' : 'text-heading-3')}>
              Promote your listing
            </h2>
            <p className="mt-2 text-body leading-relaxed text-text-muted">
              Get a <span className="font-semibold text-text-primary">Suggested</span> badge and higher placement in tenant search for{' '}
              <span className="font-bold text-navy">₹{LISTING_PROMOTION_PRICE_INR}/month</span> per property.
            </p>
          </div>
        </div>

        <ul className={cn('mt-4 space-y-2 text-label text-text-primary', compact && 'mt-3')}>
          <li className="flex items-center gap-2">
            <Sparkles size={14} className="text-primary" />
            Featured badge on tenant listings
          </li>
          <li className="flex items-center gap-2">
            <Sparkles size={14} className="text-primary" />
            Priority in recommended sort
          </li>
        </ul>

        <button
          type="button"
          onClick={() => navigate(`${ROUTES.OWNER.PORTFOLIO}#listing-promotions`)}
          className={cn(
            'mt-5 w-full rounded-button bg-navy px-4 py-3 text-body font-bold text-white transition-colors hover:bg-slate-800',
            compact && 'mt-4 py-2.5 text-label',
          )}
        >
          Manage promotions
        </button>
      </div>
    </article>
  )
}
