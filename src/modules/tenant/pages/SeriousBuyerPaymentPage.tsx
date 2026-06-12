import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@shared/constants/routes'
import { MaterialIcon } from '../components/MaterialIcon'

type PaymentMethodId = 'credit-card' | 'debit-card' | 'upi' | 'account-number'

const PAYMENT_METHODS: Array<{
  id: PaymentMethodId
  label: string
  icon: string
  description: string
}> = [
  {
    id: 'credit-card',
    label: 'Credit Card',
    icon: 'credit_card',
    description: 'Pay using any major credit card.',
  },
  {
    id: 'debit-card',
    label: 'Debit Card',
    icon: 'credit_card',
    description: 'Use a bank debit card for instant payment.',
  },
  {
    id: 'upi',
    label: 'UPI',
    icon: 'account_balance_wallet',
    description: 'Pay with a UPI ID or payment app.',
  },
  {
    id: 'account-number',
    label: 'Account Number',
    icon: 'account_balance',
    description: 'Enter bank account details for a dummy transfer.',
  },
]

const badgeBenefits = ['Badge validity: 3 months', 'Profile trust highlight', 'Priority visibility']

type CheckoutLineItem = {
  label: string
  value: string
}

type CheckoutPaymentPageProps = {
  backLabel: string
  backRoute: string
  eyebrow: string
  title: string
  description: string
  amount: string
  submitLabel: string
  successTitle: string
  successDescription: string
  successActionLabel: string
  successActionRoute: string
  productTitle: string
  productSubtitle: string
  productIcon: string
  benefits: string[]
  lineItems: CheckoutLineItem[]
  total: string
}

export function CheckoutPaymentPage({
  backLabel,
  backRoute,
  eyebrow,
  title,
  description,
  amount,
  submitLabel,
  successTitle,
  successDescription,
  successActionLabel,
  successActionRoute,
  productTitle,
  productSubtitle,
  productIcon,
  benefits,
  lineItems,
  total,
}: CheckoutPaymentPageProps) {
  const navigate = useNavigate()
  const [activeMethod, setActiveMethod] = useState<PaymentMethodId>('credit-card')
  const [paymentComplete, setPaymentComplete] = useState(false)
  const selectedMethod = PAYMENT_METHODS.find((method) => method.id === activeMethod) ?? PAYMENT_METHODS[0]

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPaymentComplete(true)
  }

  return (
    <div className="flex flex-1 flex-col bg-brand-background font-body text-brand-on-surface">
      <main className="w-full max-w-tenant mx-auto px-8 py-10 max-md:px-5">
        <button
          type="button"
          onClick={() => navigate(backRoute)}
          className="mb-6 inline-flex items-center gap-2 border-0 bg-transparent p-0 text-sm font-semibold text-brand-secondary hover:text-brand"
        >
          <MaterialIcon name="arrow_back" className="!text-xl" />
          {backLabel}
        </button>

        <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-brand-gold">
              {eyebrow}
            </p>
            <h1 className="font-display text-[clamp(28px,4vw,40px)] font-extrabold tracking-tight text-brand">
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-on-surface-variant md:text-base">
              {description}
            </p>
          </div>

          <div className="rounded-xl border border-brand-outline-variant bg-brand-container-lowest px-5 py-4 shadow-sm">
            <span className="block text-[11px] font-bold uppercase tracking-widest text-brand-outline">
              Amount
            </span>
            <span className="mt-1 block font-display text-3xl font-extrabold text-brand-gold">
              {amount}
            </span>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-2xl border border-brand-outline-variant bg-brand-container-lowest p-6 shadow-card">
            {paymentComplete ? (
              <div className="flex min-h-[440px] flex-col items-center justify-center text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-status-success-bg text-status-success-text">
                  <MaterialIcon name="check_circle" className="!text-4xl" filled />
                </div>
                <h2 className="mt-5 font-display text-2xl font-extrabold text-brand">
                  {successTitle}
                </h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-brand-on-surface-variant">
                  {successDescription}
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => navigate(successActionRoute)}
                    className="rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
                  >
                    {successActionLabel}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentComplete(false)}
                    className="rounded-lg border border-brand-outline/30 px-6 py-3 text-sm font-semibold text-brand hover:bg-brand-container-low"
                  >
                    Test Another Method
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="font-display text-2xl font-extrabold text-brand">
                    Select payment method
                  </h2>
                  <p className="mt-2 text-sm text-brand-on-surface-variant">
                    All methods are mocked for demo use.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {PAYMENT_METHODS.map((method) => {
                    const active = method.id === activeMethod

                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setActiveMethod(method.id)}
                        className={`flex min-h-[104px] items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                          active
                            ? 'border-brand bg-brand text-white shadow-sm'
                            : 'border-brand-outline-variant bg-brand-container-low hover:border-brand/50'
                        }`}
                        aria-pressed={active}
                      >
                        <span
                          className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${
                            active ? 'bg-white/15' : 'bg-white text-brand'
                          }`}
                        >
                          <MaterialIcon name={method.icon} className="!text-2xl" />
                        </span>
                        <span>
                          <span className="block text-sm font-bold">{method.label}</span>
                          <span
                            className={`mt-1 block text-xs leading-relaxed ${
                              active ? 'text-white/80' : 'text-brand-on-surface-variant'
                            }`}
                          >
                            {method.description}
                          </span>
                        </span>
                      </button>
                    )
                  })}
                </div>

                <form key={activeMethod} onSubmit={handleSubmit} className="mt-8">
                  <div className="mb-5 flex items-center gap-3 rounded-xl bg-brand-container-low px-4 py-3">
                    <MaterialIcon name={selectedMethod.icon} className="!text-2xl text-brand" />
                    <div>
                      <h3 className="text-sm font-bold text-brand">{selectedMethod.label}</h3>
                      <p className="text-xs text-brand-on-surface-variant">
                        Enter dummy details to continue.
                      </p>
                    </div>
                  </div>

                  {activeMethod === 'credit-card' || activeMethod === 'debit-card' ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="md:col-span-2">
                        <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-outline">
                          Card Number
                        </span>
                        <input
                          required
                          inputMode="numeric"
                          placeholder="1234 5678 9012 3456"
                          className="w-full rounded-lg border border-brand-outline/20 bg-white px-4 py-3 text-sm outline-none focus:border-brand"
                        />
                      </label>
                      <label className="md:col-span-2">
                        <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-outline">
                          Name on Card
                        </span>
                        <input
                          required
                          placeholder="Enter card holder name"
                          className="w-full rounded-lg border border-brand-outline/20 bg-white px-4 py-3 text-sm outline-none focus:border-brand"
                        />
                      </label>
                      <label>
                        <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-outline">
                          Expiry
                        </span>
                        <input
                          required
                          placeholder="MM/YY"
                          className="w-full rounded-lg border border-brand-outline/20 bg-white px-4 py-3 text-sm outline-none focus:border-brand"
                        />
                      </label>
                      <label>
                        <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-outline">
                          CVV
                        </span>
                        <input
                          required
                          inputMode="numeric"
                          placeholder="123"
                          className="w-full rounded-lg border border-brand-outline/20 bg-white px-4 py-3 text-sm outline-none focus:border-brand"
                        />
                      </label>
                    </div>
                  ) : null}

                  {activeMethod === 'upi' ? (
                    <div className="grid gap-4">
                      <label>
                        <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-outline">
                          UPI ID
                        </span>
                        <input
                          required
                          placeholder="name@upi"
                          className="w-full rounded-lg border border-brand-outline/20 bg-white px-4 py-3 text-sm outline-none focus:border-brand"
                        />
                      </label>
                      <div className="rounded-lg bg-brand-container-low p-4 text-sm text-brand-on-surface-variant">
                        A payment request preview will be generated after submit.
                      </div>
                    </div>
                  ) : null}

                  {activeMethod === 'account-number' ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="md:col-span-2">
                        <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-outline">
                          Account Holder Name
                        </span>
                        <input
                          required
                          placeholder="Enter account holder name"
                          className="w-full rounded-lg border border-brand-outline/20 bg-white px-4 py-3 text-sm outline-none focus:border-brand"
                        />
                      </label>
                      <label>
                        <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-outline">
                          Account Number
                        </span>
                        <input
                          required
                          inputMode="numeric"
                          placeholder="0000 0000 0000"
                          className="w-full rounded-lg border border-brand-outline/20 bg-white px-4 py-3 text-sm outline-none focus:border-brand"
                        />
                      </label>
                      <label>
                        <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-outline">
                          IFSC Code
                        </span>
                        <input
                          required
                          placeholder="BANK0001234"
                          className="w-full rounded-lg border border-brand-outline/20 bg-white px-4 py-3 text-sm uppercase outline-none focus:border-brand"
                        />
                      </label>
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-4 text-base font-semibold text-white shadow-md hover:opacity-90"
                  >
                    <MaterialIcon name="lock" className="!text-xl" />
                    {submitLabel}
                  </button>
                </form>
              </>
            )}
          </section>

          <aside className="h-fit rounded-2xl border border-brand-outline-variant bg-brand-container-low p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-gold text-white">
                <MaterialIcon name={productIcon} className="!text-3xl" filled />
              </div>
              <div>
                <h2 className="font-display text-xl font-extrabold text-brand">
                  {productTitle}
                </h2>
                <p className="text-sm text-brand-on-surface-variant">{productSubtitle}</p>
              </div>
            </div>

            <div className="space-y-3 border-y border-brand-outline-variant py-5">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3 text-sm text-brand-on-surface-variant">
                  <MaterialIcon name="check_circle" className="!text-lg text-brand-gold" filled />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3 text-sm">
              {lineItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between text-brand-on-surface-variant">
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-brand-outline-variant pt-4 font-display text-xl font-extrabold text-brand">
                <span>Total</span>
                <span>{total}</span>
              </div>
            </div>

            <p className="mt-5 rounded-lg bg-white px-4 py-3 text-xs leading-relaxed text-brand-on-surface-variant">
              Dummy page only. No amount will be charged and no real payment provider is connected yet.
            </p>
          </aside>
        </div>
      </main>
    </div>
  )
}

export function SeriousBuyerPaymentPage() {
  return (
    <CheckoutPaymentPage
      backLabel="Back to badge"
      backRoute={ROUTES.TENANT.SERIOUS_BUYER_BADGE}
      eyebrow="Serious Buyer Badge"
      title="Complete Payment"
      description="This is a dummy checkout page for now. Choose a payment method and submit to preview the activation flow."
      amount="Rs. 99"
      submitLabel="Pay Rs. 99"
      successTitle="Badge payment successful"
      successDescription="Your Serious Buyer Badge activation has been completed in this dummy flow."
      successActionLabel="Browse Listings"
      successActionRoute={ROUTES.TENANT.LISTINGS}
      productTitle="Serious Buyer Badge"
      productSubtitle="One-time purchase"
      productIcon="shield"
      benefits={badgeBenefits}
      lineItems={[
        { label: 'Badge fee', value: 'Rs. 99' },
        { label: 'Taxes', value: 'Rs. 0' },
      ]}
      total="Rs. 99"
    />
  )
}
