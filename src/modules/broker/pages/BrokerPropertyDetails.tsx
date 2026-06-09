import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Bath,
  BedDouble,
  Camera,
  ChevronRight,
  Eye,
  Image as ImageIcon,
  Mail,
  MapPin,
  ParkingCircle,
  Pencil,
  PlayCircle,
  Ruler,
  Share2,
  ShieldCheck,
  Tag,
  Waves,
} from 'lucide-react'
import { BrokerPropertyIntel } from '../components/BrokerPropertyIntel'
import {
  BROKER_ASSIGNED_PROPERTIES,
  getBrokerPropertyById,
} from '../constants/assignedProperties'
import locationAerialImg from '@/assets/images/property_location_aerial.png'
import julianVaneImg from '@/assets/images/julian_vane_owner.png'
import sarahJenkinsImg from '@/assets/images/sarah_jenkins.png'
import brokerProfileImg from '@/assets/images/broker_profile.png'

const leads = [
  {
    name: 'Sarah Miller',
    note: 'Qualified - $1.9M Pre-approved',
    image: sarahJenkinsImg,
  },
  {
    name: 'Robert Blackstone',
    note: 'Pending ID - Cash Offer',
    image: brokerProfileImg,
  },
]

const timeline = [
  {
    icon: Eye,
    title: 'Viewing Scheduled',
    meta: 'Sarah Miller - Oct 24, 2023 - 2:00 PM',
  },
  {
    icon: Tag,
    title: 'Price Updated',
    meta: 'Reduced by $50,000 - Oct 18, 2023',
  },
  {
    icon: Share2,
    title: 'Asset Listed',
    meta: 'Enterprise Suite Portal - Oct 12, 2023',
  },
]

const featureTiles = [
  { icon: ShieldCheck, label: 'Certified Energy Efficient' },
  { icon: ParkingCircle, label: '3-Car Heated Garage' },
  { icon: Waves, label: 'Indoor Infinity Pool' },
  { icon: ShieldCheck, label: 'Advanced Smart Security' },
]

export function BrokerPropertyDetails() {
  const { propertyId } = useParams<{ propertyId: string }>()
  const property = getBrokerPropertyById(propertyId) ?? BROKER_ASSIGNED_PROPERTIES[0]!
  const gallery = property.gallery.length ? property.gallery : [property.image]

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 })
  }, [])

  return (
    <div className="pb-10">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[clamp(30px,4vw,42px)] font-extrabold leading-none text-[#050505]">
            {property.name}
          </h1>
          <p className="mt-2 text-[15px] text-text-muted">{property.fullAddress}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex h-11 items-center gap-2 rounded-lg border border-outline bg-white px-4 text-[14px] font-semibold text-[#0f172a] hover:bg-hover-light">
            <Share2 size={17} />
            Share Asset
          </button>
          <button className="inline-flex h-11 items-center gap-2 rounded-lg bg-black px-4 text-[14px] font-bold text-white hover:bg-[#1f2937]">
            <Pencil size={16} />
            Edit Details
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row xl:items-start gap-6">
        <main className="flex-1 min-w-0 space-y-6">
          <section className="grid grid-cols-1 md:grid-cols-[1fr_152px] gap-3">
            <div className="relative min-h-[340px] overflow-hidden rounded-lg border border-outline bg-white md:min-h-[510px]">
              <img
                src={gallery[0]}
                alt={`${property.name} exterior`}
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-6 left-6 rounded-full bg-black px-5 py-2 text-[12px] font-bold text-white">
                Featured Exterior
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
              <div className="overflow-hidden rounded-lg border border-outline bg-white">
                <img
                  src={gallery[1] ?? gallery[0]}
                  alt={`${property.name} kitchen detail`}
                  className="h-full min-h-[160px] w-full object-cover md:min-h-[246px]"
                />
              </div>
              <div className="relative overflow-hidden rounded-lg border border-outline bg-white">
                <img
                  src={gallery[2] ?? gallery[0]}
                  alt={`${property.name} bedroom suite`}
                  className="h-full min-h-[160px] w-full object-cover md:min-h-[246px]"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 text-white">
                  <div className="text-center">
                    <ImageIcon size={25} className="mx-auto mb-1" />
                    <p className="text-[16px] font-medium">+14 more</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-2 divide-x divide-outline rounded-lg border border-outline bg-white p-6 sm:grid-cols-4">
            <div className="px-4 py-2">
              <p className="text-[15px] text-text-muted">Listing Price</p>
              <p className="mt-2 text-[25px] font-extrabold leading-tight text-black">{property.price}</p>
            </div>
            <div className="px-4 py-2">
              <p className="text-[15px] text-text-muted">Bedrooms</p>
              <p className="mt-4 flex items-end gap-3 text-[25px] font-extrabold text-black">
                <BedDouble size={21} className="mb-1 text-slate-600" />
                {property.beds} <span>Beds</span>
              </p>
            </div>
            <div className="px-4 py-2">
              <p className="text-[15px] text-text-muted">Bathrooms</p>
              <p className="mt-4 flex items-end gap-3 text-[25px] font-extrabold text-black">
                <Bath size={21} className="mb-1 text-slate-600" />
                {property.baths} <span>Baths</span>
              </p>
            </div>
            <div className="px-4 py-2">
              <p className="text-[15px] text-text-muted">Total Area</p>
              <p className="mt-4 flex items-end gap-3 text-[25px] font-extrabold text-black">
                <Ruler size={21} className="mb-1 text-slate-600" />
                {property.sqft} <span>sqft</span>
              </p>
            </div>
          </section>

          <section className="rounded-lg border border-outline bg-white p-8">
            <h2 className="text-[16px] font-semibold text-black">Asset Description</h2>
            <div className="mt-7 max-w-2xl space-y-3">
              {property.overview.map((paragraph) => (
                <p key={paragraph} className="text-[15px] leading-7 text-text-muted">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {featureTiles.map((feature) => {
                const Icon = feature.icon
                return (
                  <div key={feature.label} className="flex min-h-[78px] items-center gap-5 rounded bg-slate-50 px-5">
                    <Icon size={22} className="shrink-0 text-slate-600" />
                    <span className="text-[15px] text-[#222]">{feature.label}</span>
                  </div>
                )
              })}
            </div>
          </section>

          <BrokerPropertyIntel
            property={property}
            heading="Tenant-Visible Details"
          />

          <section className="pt-20">
            <h2 className="mb-7 text-[16px] font-semibold text-black">Virtual Tour &amp; Media</h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {[
                { src: gallery[1] ?? gallery[0], alt: `${property.name} private office view`, icon: ImageIcon },
                { src: gallery[2] ?? gallery[0], alt: `${property.name} media tour`, icon: PlayCircle },
                { src: gallery[3] ?? locationAerialImg, alt: `${property.name} evening terrace view`, icon: Camera },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.alt} className="relative aspect-[1.45] overflow-hidden rounded-lg border border-outline bg-white">
                    <img src={item.src} alt={item.alt} className="h-full w-full object-cover" />
                    <span className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-black/45 text-white">
                      <Icon size={22} />
                    </span>
                  </div>
                )
              })}
            </div>
          </section>
        </main>

        <aside className="w-full shrink-0 space-y-6 xl:w-[300px]">
          <section className="rounded-lg border border-outline bg-white p-6">
            <p className="text-[14px] uppercase text-text-muted">Primary Owner</p>
            <div className="mt-7 flex items-center gap-4">
              <img src={julianVaneImg} alt={property.ownerName} className="h-16 w-16 rounded-lg object-cover" />
              <div>
                <h2 className="text-[20px] font-extrabold leading-tight text-black">{property.ownerName}</h2>
                <span className="mt-1 inline-flex rounded bg-primary-100 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                  Primary Owner
                </span>
                <p className="mt-1 text-[12px] text-text-muted">Portfolio: 8 Assets</p>
              </div>
            </div>
            <button className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-black text-[14px] font-semibold text-white">
              <Mail size={18} />
              Contact Owner
            </button>
            <button className="mt-4 h-12 w-full rounded-lg border border-outline bg-white text-[14px] font-semibold text-[#111] hover:bg-hover-light">
              View Owner Portfolio
            </button>
          </section>

          <section className="rounded-lg border border-outline bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <p className="text-[14px] uppercase leading-6 text-text-muted">Interested<br />Leads</p>
              <button className="text-[12px] font-semibold text-slate-600">Manage Leads</button>
            </div>
            <div className="mt-8 space-y-7">
              {leads.map((lead) => (
                <button key={lead.name} className="flex w-full items-center gap-4 text-left">
                  <img src={lead.image} alt={lead.name} className="h-10 w-10 rounded-lg object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold text-black">{lead.name}</span>
                    <span className="block text-[11px] leading-4 text-text-muted">{lead.note}</span>
                  </span>
                  <ChevronRight size={18} className="text-slate-700" />
                </button>
              ))}
            </div>
            <button className="mt-8 h-9 w-full rounded bg-slate-50 text-[12px] font-semibold text-[#333] hover:bg-slate-100">
              + Add New Lead
            </button>
          </section>

          <section className="rounded-lg border border-outline bg-white p-6">
            <p className="text-[14px] uppercase leading-6 text-text-muted">Activity Timeline (Will See Later)</p>
            <div className="mt-7 space-y-6">
              {timeline.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <Icon size={17} className="text-[#111]" />
                      <span className="mt-2 h-12 w-px bg-outline last:hidden" />
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-black">{item.title}</p>
                      <p className="mt-1 text-[11px] leading-4 text-text-muted">{item.meta}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="relative aspect-[1.45] overflow-hidden rounded-lg border border-outline bg-white">
            <img src={locationAerialImg} alt="Asset location aerial" className="h-full w-full object-cover grayscale" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <span className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-[12px] font-bold text-white">
                <MapPin size={15} />
                Asset Location
              </span>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
