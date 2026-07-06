import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@shared/constants/routes'
import { MaterialIcon } from '../components/MaterialIcon'
import { TenantHomeBackBar } from '../components/TenantHomeBackBar'

const PRICING_ROWS = [
  { label: 'Type', value: 'One-time paid purchase', highlight: false },
  { label: 'Price', value: '₹99', highlight: true },
  { label: 'Validity', value: '3 months', highlight: false },
  { label: 'Effect', value: 'Badge shown on profile', highlight: false, showBadgeIcon: true },
] as const

const BENEFITS = [
  {
    icon: 'visibility',
    title: 'Higher Visibility',
    description:
      'Get noticed faster by owners with a highlighted profile that sits at the top of their application lists.',
  },
  {
    icon: 'bolt',
    title: 'Faster Responses',
    description:
      'Increase your reply chances instantly as owners prioritize inquiries from serious, verified buyers.',
  },
  {
    icon: 'verified_user',
    title: 'Trusted Profile',
    description:
      "Show you're a verified serious tenant. Build immediate trust with landlords before the first meeting.",
  },
] as const

export function SeriousBuyerBadgePage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-1 flex-col bg-gradient-to-b from-brand-container-low via-brand-background to-brand-background font-body">
      <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 md:py-16">
        <TenantHomeBackBar />
        {/* Hero */}
        <section className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-gold shadow-md mb-6">
            <MaterialIcon name="shield" className="!text-4xl text-white" filled />
          </div>
          <h1 className="font-display text-[clamp(28px,5vw,40px)] font-extrabold text-brand tracking-tight mb-4">
            Stand Out as a Serious Buyer
          </h1>
          <p className="font-body text-base md:text-lg text-brand-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Increase your chances of getting responses from property owners by demonstrating
            your commitment and verified status.
          </p>
        </section>

        {/* Pricing card */}
        <section className="mb-12">
          <div className="max-w-lg mx-auto rounded-2xl bg-brand-container-lowest border border-brand-outline-variant shadow-card overflow-hidden">
            {PRICING_ROWS.map((row, index) => (
              <div
                key={row.label}
                className={`flex items-center justify-between gap-4 px-6 py-5 ${
                  index < PRICING_ROWS.length - 1 ? 'border-b border-brand-outline-variant' : ''
                }`}
              >
                <span className="font-body text-[11px] font-bold tracking-widest text-brand-outline uppercase shrink-0">
                  {row.label}
                </span>
                <div className="flex items-center gap-2 text-right">
                  <span
                    className={
                      row.highlight
                        ? 'font-display text-3xl font-extrabold text-brand-gold'
                        : 'font-body text-sm font-semibold text-brand'
                    }
                  >
                    {row.value}
                  </span>
                  {'showBadgeIcon' in row && row.showBadgeIcon && (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-brand-gold/15">
                      <MaterialIcon name="verified" className="!text-base text-brand-gold" filled />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {BENEFITS.map((benefit) => (
            <article
              key={benefit.title}
              className="p-6 rounded-2xl bg-brand-container-lowest border border-brand-outline-variant shadow-sm"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand text-white mb-4">
                <MaterialIcon name={benefit.icon} className="!text-xl" />
              </div>
              <h2 className="font-display text-lg font-bold text-brand mb-2">{benefit.title}</h2>
              <p className="font-body text-sm text-brand-on-surface-variant leading-relaxed">
                {benefit.description}
              </p>
            </article>
          ))}
        </section>

        {/* CTA */}
        <section className="text-center rounded-2xl bg-brand-container-low border border-brand-outline-variant/60 px-6 py-10 md:py-12">
          <h2 className="font-display text-2xl font-extrabold text-brand mb-2">
            Ready to find your next home?
          </h2>
          <p className="font-body text-brand-on-surface-variant mb-8 max-w-md mx-auto">
            Get Serious Buyer Badge for just ₹99 and unlock exclusive benefits.
          </p>
          <button
            type="button"
            onClick={() => navigate(ROUTES.TENANT.SERIOUS_BUYER_PAYMENT)}
            className="inline-flex items-center justify-center min-w-[200px] px-10 py-4 rounded-xl border-0 bg-brand text-white font-body text-base font-semibold cursor-pointer shadow-md hover:opacity-92 transition-opacity"
          >
            Activate Badge
          </button>
          <p className="mt-5 font-body text-[11px] font-semibold tracking-widest text-brand-outline uppercase">
            Secure payment via Stripe • Instant activation
          </p>
        </section>
      </div>

      {/* Page footer */}
      <footer className="border-t border-brand-outline-variant bg-brand-container-lowest px-6 py-6">
        <div className="max-w-tenant mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="font-body text-[11px] font-semibold tracking-wider text-brand-outline uppercase">
            © 2024 RENTILO Property Management. All rights reserved.
          </p>
          <nav className="flex flex-wrap gap-4 md:gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Contact Support'].map(
              (label) => (
                <a
                  key={label}
                  href={`#${label.toLowerCase().replace(/\s+/g, '-')}`}
                  className="font-body text-[11px] font-semibold tracking-wider text-brand-outline uppercase no-underline hover:text-brand transition-colors"
                >
                  {label}
                </a>
              )
            )}
          </nav>
        </div>
      </footer>
    </div>
  )
}
