import { useState } from 'react'
import {
  User,
  Building2,
  CreditCard,
  Plus,
  MoreVertical,
  Shield,
  BadgeCheck,
  Check,
} from 'lucide-react'
import { useOwnerStore } from '../store/ownerStore'
import { PLAN_CONFIG } from '../config/features'

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface PaymentMethod {
  id: string
  type: 'bank' | 'card'
  name: string
  lastFour: string
  details: string
  isPrimary: boolean
}

/* ─────────────────────────────────────────────
   Mock Data
───────────────────────────────────────────── */
const profileData = {
  fullName: 'Alexander J. Sterling',
  email: 'a.sterling@sterling-holdings.com',
  phone: '+1 (555) 012-3456',
  businessAddress: '722 Wall St, New York, NY 10005',
  kycVerified: true,
  kycDate: 'Mar 12, 2024',
  passportVerified: true,
  passportExpiry: 'Dec 2029',
  passwordLastUpdated: '3 months ago',
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'pm-1',
    type: 'bank',
    name: 'Chase Business Checking (Primary)',
    lastFour: '8821',
    details: 'ACH Transfers',
    isPrimary: true,
  },
  {
    id: 'pm-2',
    type: 'card',
    name: 'Company Debit Card',
    lastFour: '4410',
    details: 'Visa Professional',
    isPrimary: false,
  },
]

const initialNotificationPrefs = {
  rentPayments: [
    { id: 'rp-1', label: 'Instant payout confirmation', checked: true },
    { id: 'rp-2', label: 'Late payment alerts', checked: true },
  ],
  maintenance: [
    { id: 'mt-1', label: 'New maintenance requests', checked: true },
    { id: 'mt-2', label: 'Vendor quote approvals', checked: false },
  ],
  systemAlerts: [
    { id: 'sa-1', label: 'Security & login notifications', checked: true },
    { id: 'sa-2', label: 'Platform updates & news', checked: true },
  ],
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export function OwnerProfile() {
  const [notificationPrefs, setNotificationPrefs] = useState(initialNotificationPrefs)
  const { subscriptionPlan } = useOwnerStore()
  const planConfig = PLAN_CONFIG[subscriptionPlan]

  const toggleNotification = (
    category: 'rentPayments' | 'maintenance' | 'systemAlerts',
    id: string
  ) => {
    setNotificationPrefs((prev) => ({
      ...prev,
      [category]: prev[category].map((pref) =>
        pref.id === id ? { ...pref, checked: !pref.checked } : pref
      ),
    }))
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12">
      <div className="max-w-[960px] mx-auto px-6 py-8">
        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-[32px] font-bold text-[#0f172a] tracking-tight">
              Owner Profile
            </h1>
            <p className="text-[15px] text-[#64748b] mt-1">
              Manage your account key info, payout methods, and security preferences.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Subscription Badge */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
              subscriptionPlan === 'PREMIUM' 
                ? 'bg-[#fef3c7] border-[#fcd34d]' 
                : 'bg-[#f1f5f9] border-[#e2e8f0]'
            }`}>
              <span className={`text-[13px] font-bold uppercase tracking-wide ${
                subscriptionPlan === 'PREMIUM' ? 'text-[#d97706]' : 'text-[#64748b]'
              }`}>
                {planConfig.name}
              </span>
            </div>
            {profileData.kycVerified && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#ecfdf5] border border-[#a7f3d0]">
                <BadgeCheck size={18} className="text-[#10b981]" />
                <span className="text-[13px] font-bold text-[#059669] uppercase tracking-wide">
                  KYC Verified
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Main Content Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Personal Information Card */}
            <section className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <User size={20} className="text-[#64748b]" />
                  <h2 className="text-[20px] font-bold text-[#0f172a]">
                    Personal Information
                  </h2>
                </div>
                <button className="text-[14px] font-semibold text-[#64748b] hover:text-[#0f172a] transition-colors">
                  Edit Info
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Legal Name */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] mb-1.5">
                    Full Legal Name
                  </p>
                  <p className="text-[15px] font-medium text-[#0f172a] pb-2 border-b border-[#e2e8f0]">
                    {profileData.fullName}
                  </p>
                </div>

                {/* Email Address */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] mb-1.5">
                    Email Address
                  </p>
                  <p className="text-[15px] font-medium text-[#0f172a] pb-2 border-b border-[#e2e8f0]">
                    {profileData.email}
                  </p>
                </div>

                {/* Phone Number */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] mb-1.5">
                    Phone Number
                  </p>
                  <p className="text-[15px] font-medium text-[#0f172a] pb-2 border-b border-[#e2e8f0]">
                    {profileData.phone}
                  </p>
                </div>

                {/* Business Address */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] mb-1.5">
                    Business Address
                  </p>
                  <p className="text-[15px] font-medium text-[#0f172a] pb-2 border-b border-[#e2e8f0]">
                    {profileData.businessAddress}
                  </p>
                </div>
              </div>
            </section>

            {/* Payment Methods Card */}
            <section className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[20px] font-bold text-[#0f172a]">
                  Payment Methods
                </h2>
                <button className="flex items-center gap-1.5 text-[14px] font-semibold text-[#64748b] hover:text-[#0f172a] transition-colors">
                  <Plus size={16} />
                  Add New
                </button>
              </div>

              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border ${
                      method.isPrimary
                        ? 'bg-[#f8fafc] border-[#e2e8f0]'
                        : 'bg-white border-[#e2e8f0]'
                    }`}
                  >
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-lg bg-[#f1f5f9] flex items-center justify-center">
                      {method.type === 'bank' ? (
                        <Building2 size={22} className="text-[#475569]" />
                      ) : (
                        <CreditCard size={22} className="text-[#475569]" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-[#0f172a]">
                        {method.name}
                      </p>
                      <p className="text-[13px] text-[#64748b] mt-0.5">
                        • • • • {method.lastFour} | {method.details}
                      </p>
                    </div>

                    {/* Status / Action */}
                    {method.isPrimary ? (
                      <span className="px-3 py-1 rounded-full bg-[#0f172a] text-white text-[11px] font-bold uppercase">
                        Active
                      </span>
                    ) : (
                      <button className="p-2 rounded-lg hover:bg-[#f1f5f9] transition-colors">
                        <MoreVertical size={18} className="text-[#94a3b8]" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Notification Preferences Card */}
            <section className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
              <h2 className="text-[20px] font-bold text-[#0f172a] mb-6">
                Notification Preferences
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Rent Payments */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-4 bg-[#0f172a] rounded-full" />
                    <p className="text-[12px] font-bold uppercase tracking-wider text-[#64748b]">
                      Rent Payments
                    </p>
                  </div>
                  <div className="space-y-3">
                    {notificationPrefs.rentPayments.map((pref) => (
                      <label
                        key={pref.id}
                        className="flex items-start gap-3 cursor-pointer group"
                      >
                        <div
                          onClick={() => toggleNotification('rentPayments', pref.id)}
                          className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${
                            pref.checked
                              ? 'bg-[#0f172a] border-[#0f172a]'
                              : 'bg-white border-[#cbd5e1] group-hover:border-[#94a3b8]'
                          }`}
                        >
                          {pref.checked && <Check size={12} className="text-white" />}
                        </div>
                        <span className="text-[14px] text-[#334155] leading-tight">
                          {pref.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Maintenance */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-4 bg-[#0f172a] rounded-full" />
                    <p className="text-[12px] font-bold uppercase tracking-wider text-[#64748b]">
                      Maintenance
                    </p>
                  </div>
                  <div className="space-y-3">
                    {notificationPrefs.maintenance.map((pref) => (
                      <label
                        key={pref.id}
                        className="flex items-start gap-3 cursor-pointer group"
                      >
                        <div
                          onClick={() => toggleNotification('maintenance', pref.id)}
                          className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${
                            pref.checked
                              ? 'bg-[#0f172a] border-[#0f172a]'
                              : 'bg-white border-[#cbd5e1] group-hover:border-[#94a3b8]'
                          }`}
                        >
                          {pref.checked && <Check size={12} className="text-white" />}
                        </div>
                        <span className="text-[14px] text-[#334155] leading-tight">
                          {pref.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* System Alerts */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-4 bg-[#0f172a] rounded-full" />
                    <p className="text-[12px] font-bold uppercase tracking-wider text-[#64748b]">
                      System Alerts
                    </p>
                  </div>
                  <div className="space-y-3">
                    {notificationPrefs.systemAlerts.map((pref) => (
                      <label
                        key={pref.id}
                        className="flex items-start gap-3 cursor-pointer group"
                      >
                        <div
                          onClick={() => toggleNotification('systemAlerts', pref.id)}
                          className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${
                            pref.checked
                              ? 'bg-[#0f172a] border-[#0f172a]'
                              : 'bg-white border-[#cbd5e1] group-hover:border-[#94a3b8]'
                          }`}
                        >
                          {pref.checked && <Check size={12} className="text-white" />}
                        </div>
                        <span className="text-[14px] text-[#334155] leading-tight">
                          {pref.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Identity Card */}
            <section className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
              <h2 className="text-[20px] font-bold text-[#0f172a] mb-3">Identity</h2>
              <p className="text-[14px] text-[#64748b] leading-relaxed mb-5">
                Your identity has been verified through our secure KYC process on{' '}
                {profileData.kycDate}.
              </p>

              {/* Passport Verified Badge */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] mb-4">
                <div className="w-12 h-12 rounded-lg bg-white border border-[#e2e8f0] flex items-center justify-center">
                  <Shield size={22} className="text-[#475569]" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#0f172a]">Passport Verified</p>
                  <p className="text-[13px] text-[#64748b]">
                    Expires: {profileData.passportExpiry}
                  </p>
                </div>
              </div>

              <button className="w-full h-12 rounded-xl bg-[#f1f5f9] text-[14px] font-semibold text-[#0f172a] hover:bg-[#e2e8f0] transition-colors">
                Re-certify Identity
              </button>
            </section>

            {/* Security Card */}
            <section className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
              <h2 className="text-[20px] font-bold text-[#0f172a] mb-4">Security</h2>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-bold text-[#0f172a]">Password</p>
                  <p className="text-[13px] text-[#64748b] mt-0.5">
                    Last updated {profileData.passwordLastUpdated}
                  </p>
                </div>
                <button className="text-[14px] font-semibold text-[#64748b] hover:text-[#0f172a] transition-colors">
                  Change
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
