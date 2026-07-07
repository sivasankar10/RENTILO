import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Bath, BedDouble, Briefcase, MapPin, Ruler, ShieldCheck } from 'lucide-react'
import { usePrototypeStore } from '@shared/store/prototypeStore'
import { BROKER_ASSIGNED_PROPERTIES } from '../constants/assignedProperties'

interface OwnerPortfolioPropertyView {
  id: string
  image: string
  title: string
  address: string
  beds: number
  baths: number
  sqft: string
  price: string
  status: string
}

interface OwnerPortfolioView {
  ownerName: string
  ownerInitials: string
  properties: OwnerPortfolioPropertyView[]
}

const statusStyles: Record<string, string> = {
  Active: 'bg-status-success-bg text-status-success-text',
  Paused: 'bg-amber-50 text-amber-700',
  Pending: 'bg-amber-50 text-amber-700',
  Flagged: 'bg-status-error-bg text-status-error-text',
  Removed: 'bg-slate-100 text-slate-600',
  Inactive: 'bg-slate-100 text-slate-600',
}

function initialsFromName(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function BrokerOwnerPortfolio() {
  const navigate = useNavigate()
  const { ownerId } = useParams<{ ownerId: string }>()
  const users = usePrototypeStore((state) => state.users)
  const properties = usePrototypeStore((state) => state.properties)
  const listings = usePrototypeStore((state) => state.listings)

  const portfolio: OwnerPortfolioView | null = useMemo(() => {
    if (!ownerId) return null

    // Real prototype owner — pull live properties from the shared store
    const owner = users.find((user) => user.id === ownerId)
    if (owner) {
      const ownerName = `${owner.firstName} ${owner.lastName}`
      const ownerProperties = properties
        .filter((property) => property.ownerId === owner.id)
        .map<OwnerPortfolioPropertyView>((property) => {
          const listing = listings.find((item) => item.propertyId === property.id)
          return {
            id: property.id,
            image: property.image,
            title: property.title,
            address: `${property.address}, ${property.neighborhood}, ${property.city}`,
            beds: property.beds,
            baths: property.baths,
            sqft: property.sqft,
            price: `${property.price}${property.pricePeriod}`,
            status: listing?.status ?? 'Active',
          }
        })
      return {
        ownerName,
        ownerInitials: initialsFromName(ownerName),
        properties: ownerProperties,
      }
    }

    // Static demo owner (mock-owner-*) — pull from the seeded assigned properties list
    const staticMatches = BROKER_ASSIGNED_PROPERTIES.filter((property) => property.ownerId === ownerId)
    if (staticMatches.length > 0) {
      const ownerName = staticMatches[0].ownerName
      return {
        ownerName,
        ownerInitials: staticMatches[0].ownerInitials,
        properties: staticMatches.map<OwnerPortfolioPropertyView>((property) => ({
          id: property.id,
          image: property.image,
          title: property.name,
          address: property.fullAddress,
          beds: property.beds,
          baths: property.baths,
          sqft: property.sqft,
          price: property.price,
          status: property.status,
        })),
      }
    }

    return null
  }, [ownerId, users, properties, listings])

  if (!portfolio) {
    return (
      <div className="rounded-card border border-outline bg-white p-10 text-center">
        <h1 className="text-heading-2 font-bold text-text-primary">Owner not found</h1>
        <p className="mt-2 text-body text-text-muted">
          We couldn't find portfolio details for this owner.
        </p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#0f172a] px-4 py-2 text-[13px] font-bold text-white hover:bg-navy/80"
        >
          <ArrowLeft size={15} />
          Go back
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-10">
      {/* ── Back ── */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-text-muted hover:text-[#0f172a]"
      >
        <ArrowLeft size={15} />
        Back to property
      </button>

      {/* ── Owner Header ── */}
      <div className="bg-white border border-outline rounded-xl p-6 shadow-ambient">
        <div className="flex items-start gap-5 flex-wrap">
          <div className="relative shrink-0">
            <div className="flex h-[100px] w-[100px] items-center justify-center rounded-xl border-2 border-outline bg-primary-50 text-[28px] font-bold text-primary">
              {portfolio.ownerInitials}
            </div>
            <span className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-primary">
              <ShieldCheck size={16} className="text-white" />
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-[22px] font-bold text-[#0f172a] tracking-tight">{portfolio.ownerName}</h1>
            <p className="text-body text-text-muted mt-0.5">Property Owner</p>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-50 text-green-700 border border-green-200">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                Verified Owner
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                <Briefcase size={11} />
                Portfolio: {portfolio.properties.length} {portfolio.properties.length === 1 ? 'Asset' : 'Assets'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Properties Grid ── */}
      <div>
        <h2 className="text-[18px] font-bold text-[#0f172a] mb-4">Owner's Properties</h2>

        {portfolio.properties.length === 0 ? (
          <div className="rounded-xl border border-dashed border-outline bg-white p-10 text-center">
            <p className="text-body text-text-muted">No other properties listed by this owner yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {portfolio.properties.map((property) => (
              <div
                key={property.id}
                className="overflow-hidden rounded-xl border border-outline bg-white shadow-ambient"
              >
                <div className="relative">
                  <img src={property.image} alt={property.title} className="w-full h-44 object-cover" />
                  <span
                    className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      statusStyles[property.status] ?? 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {property.status}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-[16px] font-bold text-[#0f172a]">{property.title}</h3>
                  <div className="flex items-center gap-1 mt-1 text-label text-text-muted">
                    <MapPin size={11} />
                    <span className="truncate">{property.address}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-label text-text-muted">
                    <span className="inline-flex items-center gap-1">
                      <BedDouble size={13} />
                      {property.beds} Beds
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Bath size={13} />
                      {property.baths} Baths
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Ruler size={13} />
                      {property.sqft} sqft
                    </span>
                  </div>
                  <p className="mt-3 text-[15px] font-bold text-[#0f172a]">{property.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
