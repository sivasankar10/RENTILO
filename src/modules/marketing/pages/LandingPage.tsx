import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@shared/constants/routes'
import { MaterialIcon } from '@shared/components/MaterialIcon'
import { LandingNavbar } from '../components/LandingNavbar'
import { LandingFooter } from '../components/LandingFooter'

const COLLECTIONS = [
  {
    title: 'Urban Penthouses',
    badge: 'Luxury Edition',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC6_Ef4jvA5jfyZiufUaD4zcEyIlOHIRlpKV2vJpJdSWOUpBcuNLaBkeQ588I4CcCmIMI8wYvPIB1GuAAqdhxUL2IFd2ko9rXTPcJfUmO-UZSwKs6AVH3P58HFujBerVQvDBwS_dbmzQLsEODrMUpvGTWW6CIvARbf1TEhZhb8_ieum1fS0nyEeQhz4eQ2mnpsaOv13mpLiRuUSS4aNEGdJO2l-6qvS74NU5ES3CecK8XynOibIPqQW8nfRyvag63FU00ytABpOEYM1',
    className: 'md:col-span-2 md:row-span-2',
  },
  {
    title: 'Waterfront Living',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBIbFTomh7DpHuI-dXwMBgEM4HEaZ2ocpyjJ2odZ6FnjoFLat9DYG34h35yL3jlUQTavpM229bHGqWxXVmW3kh7iYV9P_E6VQPjcLJXj5AthzsdLWUurD0SUOtDL5cS3SeZ_OcmYwNW_czT83SA1InTLLzodMKY0B0Q6s7rDRvfFyBLcRIZa6TNk-O-wAoi-l3cd4qiPc777BP1UjMNjBORdD2FQjNYvaf74FZIW8bnamCxT0DBFR-APGSSPjKWrIgwMEAE8MR3Dn5s',
    className: 'md:col-span-2',
  },
  {
    title: 'Compact Studios',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDUb7dK52OHzj79aMDP1qG3q5DdZFb1JF2vH3Lih6abMO8HQZf5DTPq-RCvnZy-r6muVCxeWdjS7fL9e6nw2wn8sxEo2g1kGoCW-H4YRt4nj6qY73eZa0IaUMw_848tR0LeN60fAaeB0EacfFbI-X8javQJzrgJQ9iy7xaRm44j6rj4v1svJM8I9IwOCJ669tZnsKq93aSLzXZE_h4S_taOsUKxLcAelab7zVrVjMVh7D23dk3BCF0bIHtPTZaqxYoYIge0YPZqB-qr',
    className: '',
  },
  {
    title: 'Family Estates',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAZHBzhVwAANAXMoCqiy2Flc5MPRnXQ1o1hQY4OxBLtRDUA18KSK4k6YnFPL3yiUOoFT2ICgcOF0S2RLTbKobGrx6RhSXa-tjZzxvfV6uibhuO_Qzwl5EAe1KXFc-XqPR-gcMmryiqeM1enQa_co56rLJW0CK8Wr5U1p6tW6r5sCbftvmx51-gAO6JFDyxfxrC7uKBcwSfvMoyAjpKrHCJ-bshVNVoxwTS21K885syaFoLqaMv29VS4erFmdNlq_m6Qr8IPsAFJarrN',
    className: '',
  },
] as const

const CTA_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA9dBsxn1DmZgZ91QQtxzAZOwnfxPPRK4G2TPn4P2btGS-0fhYeKvjvPkz1Emmuvy5kzJOkZnJBnAE_Bz6eoqF9GoxIqOqlzjnprIh-Z2e0oBH-d9lxUQmsZ_rUZKeiXRLA9q3H8HL8KiyFt0At7V3NsjeRZTp_FWpbMnX0CCZ_j3kIeD_5htXwYsMpGiXXBd5Cy5NYlDPqZ2Mxhu99EskjvPQPfQy6z49MhcyVkZ-YkrrwB5ca4TKpxZK7t3vfxQwPUX0_dzlF8tu_'

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-brand-background font-body text-brand-on-surface pt-20">
      <LandingNavbar />

      <main>
        {/* Hero */}
        <section className="relative px-6 py-16 md:py-20 text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-brand-verified/20 blur-[120px] translate-x-1/4 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-brand-verified/30 blur-[100px] -translate-x-1/4 translate-y-1/2 pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-brand leading-tight tracking-tight mb-6">
              Find Your Perfect Rental,
              <br />
              Without the Hassle
            </h1>
            <p className="font-body text-lg text-brand-on-surface-variant max-w-2xl mx-auto mb-12 leading-relaxed">
              Connecting tenants, owners, and brokers in one seamless platform built on
              trust and transparency.
            </p>

            <div className="max-w-4xl mx-auto p-2 rounded-xl bg-brand-container-lowest shadow-modal flex flex-col md:flex-row gap-2">
              <div className="flex items-center gap-3 px-4 py-3 md:w-1/4 rounded-lg bg-brand-container-low border-b-2 border-transparent focus-within:border-brand transition-colors">
                <MaterialIcon name="location_on" className="text-brand-outline shrink-0" />
                <select className="w-full border-0 bg-transparent font-body text-sm font-medium text-brand outline-none cursor-pointer">
                  <option>Select City</option>
                  <option>Mumbai</option>
                  <option>Bengaluru</option>
                  <option>Chennai</option>
                  <option>New York</option>
                </select>
              </div>
              <div className="hidden md:block w-px bg-brand-outline-variant self-stretch my-2" />
              <div className="flex flex-1 items-center gap-3 px-4 py-3 rounded-lg bg-brand-container-low border-b-2 border-transparent focus-within:border-brand transition-colors">
                <MaterialIcon name="search" className="text-brand-outline shrink-0" />
                <input
                  type="text"
                  placeholder="Search by locality, landmark, or property..."
                  className="w-full border-0 bg-transparent font-body text-sm font-medium text-brand outline-none placeholder:text-brand-outline"
                />
              </div>
              <button
                type="button"
                onClick={() => navigate(ROUTES.AUTH.LOGIN)}
                className="px-8 py-3 rounded-lg border-0 bg-gradient-to-br from-brand to-brand-container text-white font-display font-bold text-sm tracking-wide cursor-pointer shadow-md hover:opacity-95 transition-opacity whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 py-16 md:py-24 max-w-container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-brand mb-4">
              Why Choose RENTILO?
            </h2>
            <div className="w-20 h-1.5 bg-brand-container rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: 'verified_user',
                iconClass: 'bg-brand-verified text-brand',
                title: 'Verified Listings',
                text: 'Every property is manually checked for authenticity to ensure you only see legitimate, high-quality rental options.',
                alt: false,
              },
              {
                icon: 'travel_explore',
                iconClass: 'bg-brand-search-bg text-brand-secondary',
                title: 'Easy Search',
                text: 'Intelligent filters and map-based exploration help you narrow down your search to the exact street you want to call home.',
                alt: true,
              },
              {
                icon: 'handshake',
                iconClass: 'bg-brand-trusted-bg text-brand-trusted-icon',
                title: 'Trusted Connections',
                text: 'We bridge the gap between landlords and tenants with direct messaging and transparent rental history tracking.',
                alt: false,
              },
            ].map((feature) => (
              <article
                key={feature.title}
                className={`p-8 rounded-2xl transition-all duration-300 border-b-2 border-transparent hover:bg-white hover:shadow-card hover:border-brand-container ${
                  feature.alt ? 'bg-brand-container-low' : 'bg-brand-container-lowest'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${feature.iconClass}`}
                >
                  <MaterialIcon name={feature.icon} className="!text-3xl" />
                </div>
                <h3 className="font-display text-xl font-bold text-brand mb-3">{feature.title}</h3>
                <p className="font-body text-brand-on-surface-variant leading-relaxed">
                  {feature.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Owner CTA */}
        <section className="px-6 py-16 md:py-24">
          <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden relative shadow-2xl">
            <div className="absolute inset-0">
              <img src={CTA_IMAGE} alt="" className="w-full h-full object-cover grayscale opacity-20" />
              <div className="absolute inset-0 bg-brand-container-low/90 mix-blend-multiply" />
            </div>
            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8 p-8 md:p-12 lg:px-20">
              <div className="text-center lg:text-left">
                <span className="block font-body text-xs font-bold uppercase tracking-[0.2em] text-brand mb-4">
                  Partner with us
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-extrabold text-brand mb-4">
                  Are you a property owner?
                </h2>
                <p className="font-body text-lg text-brand-on-surface-variant max-w-lg">
                  List your property and find high-quality tenants faster. Our automated
                  vetting process saves you hours of paperwork.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate(ROUTES.AUTH.REGISTER)}
                className="shrink-0 px-10 py-5 rounded-lg border-0 bg-gradient-to-r from-brand to-brand-container text-white font-display font-extrabold text-lg cursor-pointer shadow-lg hover:-translate-y-1 transition-transform whitespace-nowrap"
              >
                Post Your Property
              </button>
            </div>
          </div>
        </section>

        {/* Collections */}
        <section className="px-6 py-16 md:py-24 bg-brand-container-low">
          <div className="max-w-container mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-extrabold text-brand mb-1">
                  Hand-picked Collections
                </h2>
                <p className="font-body text-brand-on-surface-variant">
                  Curated estates for the modern professional.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate(ROUTES.AUTH.LOGIN)}
                className="inline-flex items-center gap-2 border-0 bg-transparent font-body font-bold text-brand cursor-pointer hover:underline"
              >
                View All Collections
                <MaterialIcon name="trending_flat" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[280px] gap-4">
              {COLLECTIONS.map((item) => (
                <div
                  key={item.title}
                  className={`relative rounded-xl overflow-hidden cursor-pointer group shadow-md min-h-[280px] ${item.className}`}
                  onClick={() => navigate(ROUTES.AUTH.LOGIN)}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(ROUTES.AUTH.LOGIN)}
                  role="button"
                  tabIndex={0}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                    {'badge' in item && item.badge && (
                      <span className="inline-block w-fit mb-3 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-bold uppercase tracking-wider">
                        {item.badge}
                      </span>
                    )}
                    <h3 className="font-display text-xl font-bold">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}
