import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  CreditCard,
  Crown,
  Lock,
  Shield,
  Sparkles,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { ROUTES } from '@shared/constants/routes'
<<<<<<< HEAD
import { useOwnerStore } from '../store/ownerStore'
import { PLAN_CONFIG, FEATURE_LABELS } from '../config/features'
import type { OwnerFeature } from '../config/features'
=======
import { usePaymentsStore } from '@shared/store/paymentsStore'
>>>>>>> main

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type PaymentStep = 'form' | 'processing' | 'success'
type BillingCycle = 'monthly' | 'yearly'

interface CardFormData {
  cardNumber: string
  cardHolder: string
  expiryDate: string
  cvv: string
}

/* ─────────────────────────────────────────────
   Premium Features List
───────────────────────────────────────────── */
const PREMIUM_FEATURES: OwnerFeature[] = [
  'analytics',
  'inquiry_management',
  'viewings_calendar',
  'broker_management',
  'promoted_listings',
  'financial_reports',
  'smart_match',
  'priority_support',
]

/* ─────────────────────────────────────────────
   Card Input Formatting
───────────────────────────────────────────── */
function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
}

function formatExpiryDate(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 2) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`
  }
  return digits
}


/* ─────────────────────────────────────────────
   Processing Overlay Component
───────────────────────────────────────────── */
function ProcessingOverlay({ 
  progress 
}: { 
  progress: 'processing' | 'verifying' | 'success' 
}) {
  const steps = [
    { key: 'processing', label: 'Processing payment...', icon: CreditCard },
    { key: 'verifying', label: 'Verifying transaction...', icon: Shield },
    { key: 'success', label: 'Payment successful!', icon: CheckCircle2 },
  ]
  
  const currentIndex = steps.findIndex(s => s.key === progress)
  
  return (
<<<<<<< HEAD
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm mx-4 bg-white rounded-2xl p-8 text-center">
        {progress === 'success' ? (
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#dcfce7] flex items-center justify-center">
            <CheckCircle2 size={40} className="text-[#16a34a]" />
          </div>
        ) : (
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#f1f5f9] flex items-center justify-center">
            <Loader2 size={40} className="text-[#0f172a] animate-spin" />
          </div>
        )}
        
        <h3 className="text-xl font-bold text-[#0f172a] mb-2">
          {progress === 'success' ? 'Payment Successful!' : 'Processing Payment'}
        </h3>
        
        <div className="space-y-3 mt-6">
          {steps.map((step, index) => {
            const isActive = step.key === progress
            const isComplete = index < currentIndex || progress === 'success'
            
            return (
              <div
                key={step.key}
                className={cn(
                  'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
                  isActive && 'bg-[#f1f5f9]',
                  isComplete && 'text-[#16a34a]'
                )}
              >
                {isComplete ? (
                  <Check size={18} className="text-[#16a34a]" />
                ) : isActive ? (
                  <Loader2 size={18} className="animate-spin text-[#0f172a]" />
                ) : (
                  <div className="w-[18px] h-[18px] rounded-full border-2 border-[#e2e8f0]" />
                )}
                <span className={cn(
                  'text-sm',
                  isActive ? 'font-semibold text-[#0f172a]' : 'text-[#64748b]'
                )}>
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
        
        <p className="text-xs text-[#94a3b8] mt-6">
          Please do not close this window
        </p>
      </div>
    </div>
  )
}


/* ─────────────────────────────────────────────
   Success Screen Component
───────────────────────────────────────────── */
function SuccessScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#0f172a] flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        {/* Success Animation */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl">
            <Crown size={56} className="text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#10b981] flex items-center justify-center">
            <Check size={18} className="text-white" />
          </div>
          <Sparkles className="absolute top-0 left-4 text-amber-400 animate-pulse" size={24} />
          <Sparkles className="absolute bottom-4 right-4 text-amber-400 animate-pulse delay-300" size={20} />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-3">
          Welcome to Premium!
        </h1>
        <p className="text-white/70 mb-8">
          Your subscription is now active. Enjoy unlimited access to all premium features.
        </p>
        
        {/* Features Unlocked */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-8">
          <p className="text-sm font-semibold text-amber-400 uppercase tracking-wide mb-4">
            Features Unlocked
          </p>
          <div className="grid grid-cols-2 gap-3">
            {PREMIUM_FEATURES.slice(0, 6).map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-white/90 text-sm">
                <Check size={14} className="text-[#10b981]" />
                {FEATURE_LABELS[feature]}
              </div>
            ))}
          </div>
        </div>
        
        <button
          onClick={onContinue}
          className="w-full py-4 rounded-xl bg-white text-[#0f172a] font-bold text-lg hover:bg-white/90 transition-colors"
        >
          Go to Dashboard
        </button>
        
        <p className="text-white/50 text-xs mt-6">
          Subscription started today • Renews automatically
        </p>
      </div>
    </div>
  )
}


/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export function OwnerPremiumPaymentPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<PaymentStep>('form')
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')
  const [cardData, setCardData] = useState<CardFormData>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  })
  
  const { 
    subscriptionPlan, 
    upgradeToPremium, 
    upgradeProgress,
    isUpgrading,
  } = useOwnerStore()
  
  const premiumConfig = PLAN_CONFIG.PREMIUM
  const price = billingCycle === 'monthly' ? premiumConfig.monthlyPrice : premiumConfig.yearlyPrice
  const savings = billingCycle === 'yearly' 
    ? Math.round((premiumConfig.monthlyPrice * 12 - premiumConfig.yearlyPrice) / (premiumConfig.monthlyPrice * 12) * 100)
    : 0

  // If already premium, redirect to dashboard
  if (subscriptionPlan === 'PREMIUM' && step === 'form') {
    navigate(ROUTES.OWNER.DASHBOARD)
    return null
  }

  const handleInputChange = (field: keyof CardFormData, value: string) => {
    let formattedValue = value
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value)
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value)
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4)
    }
    
    setCardData(prev => ({ ...prev, [field]: formattedValue }))
  }

  const isFormValid = 
    cardData.cardNumber.replace(/\s/g, '').length >= 15 &&
    cardData.cardHolder.trim().length >= 2 &&
    cardData.expiryDate.length === 5 &&
    cardData.cvv.length >= 3

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return
    
    setStep('processing')
    
    try {
      await upgradeToPremium()
      setStep('success')
    } catch (error) {
      console.error('Payment failed:', error)
      setStep('form')
    }
  }

  const handleContinue = () => {
    navigate(ROUTES.OWNER.DASHBOARD)
  }


  // Show success screen
  if (step === 'success') {
    return <SuccessScreen onContinue={handleContinue} />
  }

  return (
    <>
      {/* Processing Overlay */}
      {step === 'processing' && upgradeProgress !== 'idle' && (
        <ProcessingOverlay progress={upgradeProgress as 'processing' | 'verifying' | 'success'} />
      )}
      
      <div className="min-h-screen bg-[#f8fafc]">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Header */}
          <button
            onClick={() => navigate(ROUTES.OWNER.PLANS_RULES)}
            className="flex items-center gap-2 text-[#64748b] hover:text-[#0f172a] transition-colors mb-6"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Plans</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
            {/* Left Column - Payment Form */}
            <div>
              <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                    <Crown size={24} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-[#0f172a]">Upgrade to Premium</h1>
                    <p className="text-sm text-[#64748b]">Complete your payment to unlock all features</p>
                  </div>
                </div>

                {/* Billing Cycle Toggle */}
                <div className="flex items-center gap-2 p-1 bg-[#f1f5f9] rounded-xl mb-8">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={cn(
                      'flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors',
                      billingCycle === 'monthly'
                        ? 'bg-white text-[#0f172a] shadow-sm'
                        : 'text-[#64748b] hover:text-[#0f172a]'
                    )}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={cn(
                      'flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors relative',
                      billingCycle === 'yearly'
                        ? 'bg-white text-[#0f172a] shadow-sm'
                        : 'text-[#64748b] hover:text-[#0f172a]'
                    )}
                  >
                    Yearly
                    <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-[#10b981] text-white text-[10px] font-bold rounded-full">
                      Save {savings}%
                    </span>
                  </button>
                </div>

                {/* Card Form */}
                <form onSubmit={handleSubmit}>
                  <div className="space-y-5">
                    {/* Card Number */}
                    <div>
                      <label className="block text-sm font-semibold text-[#0f172a] mb-2">
                        Card Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardData.cardNumber}
                          onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                          placeholder="1234 5678 9012 3456"
                          className="w-full h-12 px-4 pr-12 rounded-xl border border-[#e2e8f0] text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0f172a] focus:ring-2 focus:ring-[#0f172a]/10 transition-all"
                        />
                        <CreditCard size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                      </div>
                    </div>

                    {/* Card Holder */}
                    <div>
                      <label className="block text-sm font-semibold text-[#0f172a] mb-2">
                        Card Holder Name
                      </label>
                      <input
                        type="text"
                        value={cardData.cardHolder}
                        onChange={(e) => handleInputChange('cardHolder', e.target.value)}
                        placeholder="John Doe"
                        className="w-full h-12 px-4 rounded-xl border border-[#e2e8f0] text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0f172a] focus:ring-2 focus:ring-[#0f172a]/10 transition-all"
                      />
                    </div>

                    {/* Expiry & CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-[#0f172a] mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={cardData.expiryDate}
                          onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                          placeholder="MM/YY"
                          className="w-full h-12 px-4 rounded-xl border border-[#e2e8f0] text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0f172a] focus:ring-2 focus:ring-[#0f172a]/10 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#0f172a] mb-2">
                          CVV
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={cardData.cvv}
                            onChange={(e) => handleInputChange('cvv', e.target.value)}
                            placeholder="123"
                            className="w-full h-12 px-4 pr-10 rounded-xl border border-[#e2e8f0] text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0f172a] focus:ring-2 focus:ring-[#0f172a]/10 transition-all"
                          />
                          <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!isFormValid || isUpgrading}
                    className={cn(
                      'w-full h-14 mt-8 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2',
                      isFormValid && !isUpgrading
                        ? 'bg-[#0f172a] text-white hover:bg-[#1e293b]'
                        : 'bg-[#e2e8f0] text-[#94a3b8] cursor-not-allowed'
                    )}
                  >
                    {isUpgrading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock size={18} />
                        Pay ${price}
                      </>
                    )}
                  </button>

                  {/* Security Note */}
                  <div className="flex items-center justify-center gap-2 mt-4 text-[#64748b]">
                    <Shield size={14} />
                    <span className="text-xs">Secured with 256-bit SSL encryption</span>
                  </div>
                </form>
              </div>

              {/* Demo Note */}
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm text-amber-800">
                  <strong>Demo Mode:</strong> Enter any valid-looking card details to test the payment flow. No real charges will be made.
                </p>
              </div>
            </div>


            {/* Right Column - Order Summary */}
            <div>
              <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 sticky top-24">
                <h2 className="text-lg font-bold text-[#0f172a] mb-6">Order Summary</h2>
                
                {/* Plan Details */}
                <div className="flex items-start gap-4 pb-6 border-b border-[#e2e8f0]">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                    <Crown size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#0f172a]">{premiumConfig.name}</p>
                    <p className="text-sm text-[#64748b]">
                      {billingCycle === 'monthly' ? 'Monthly billing' : 'Annual billing'}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-[#0f172a]">
                    ${price}
                    <span className="text-sm font-normal text-[#64748b]">
                      /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  </p>
                </div>

                {/* Features List */}
                <div className="py-6 border-b border-[#e2e8f0]">
                  <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-4">
                    What's included
                  </p>
                  <ul className="space-y-3">
                    {PREMIUM_FEATURES.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#dcfce7] flex items-center justify-center">
                          <Check size={12} className="text-[#16a34a]" />
                        </div>
                        <span className="text-sm text-[#475569]">{FEATURE_LABELS[feature]}</span>
                      </li>
                    ))}
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#dcfce7] flex items-center justify-center">
                        <Check size={12} className="text-[#16a34a]" />
                      </div>
                      <span className="text-sm text-[#475569]">Unlimited properties</span>
                    </li>
                  </ul>
                </div>

                {/* Total */}
                <div className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#64748b]">Subtotal</span>
                    <span className="text-[#0f172a]">${price}</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[#64748b]">Tax</span>
                    <span className="text-[#0f172a]">$0</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-[#e2e8f0]">
                    <span className="text-lg font-bold text-[#0f172a]">Total</span>
                    <span className="text-lg font-bold text-[#0f172a]">${price}</span>
                  </div>
                </div>

                {/* Guarantee */}
                <div className="mt-6 p-4 bg-[#f8fafc] rounded-xl">
                  <div className="flex items-center gap-2 text-[#0f172a] mb-1">
                    <Shield size={16} />
                    <span className="text-sm font-semibold">30-day money-back guarantee</span>
                  </div>
                  <p className="text-xs text-[#64748b]">
                    Not satisfied? Get a full refund within 30 days, no questions asked.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
=======
    <CheckoutPaymentPage
      backLabel="Back to plans"
      backRoute={ROUTES.OWNER.PLANS_RULES}
      eyebrow="Owner Premium Plan"
      title="Complete Premium Payment"
      description="This is a dummy checkout page for now. Choose a payment method and submit to preview the premium activation flow."
      amount="$149"
      submitLabel="Pay $149"
      successTitle="Premium plan payment successful"
      successDescription="Your Owner Premium plan activation has been completed in this dummy flow."
      successActionLabel="Go to Portfolio"
      successActionRoute={ROUTES.OWNER.PORTFOLIO}
      productTitle="Owner Premium"
      productSubtitle="Monthly plan"
      productIcon="workspace_premium"
      benefits={ownerPremiumBenefits}
      lineItems={[
        { label: 'Premium plan', value: '$149' },
        { label: 'Taxes', value: '$0' },
      ]}
      total="$149"
      onPaymentComplete={({ method }) => {
        usePaymentsStore.getState().addOwnerOutgoingPayment({
          amount: 149,
          amountDisplay: '$149',
          method,
          description: 'Owner Premium Plan — monthly subscription',
        })
      }}
    />
>>>>>>> main
  )
}
