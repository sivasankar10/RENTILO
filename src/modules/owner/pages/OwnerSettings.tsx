import { useState } from 'react'
import {
  BadgeCheck,
  Bell,
  Building2,
  ChevronRight,
  CircleCheck,
  Crown,
  KeyRound,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  User,
  Wrench,
} from 'lucide-react'
import { useOwnerStore } from '../store/ownerStore'

const bankFields = [
  { label: 'Account Holder Name', placeholder: 'Enter full name' },
  { label: 'Bank Name', placeholder: 'Enter bank name' },
  { label: 'Account Number', placeholder: 'Enter account number' },
  { label: 'IFSC Code', placeholder: 'Enter IFSC code' },
]

export function OwnerSettings() {
  const initialProfile = {
    firstName: 'Alexander',
    lastName: 'Westminster',
    email: 'alexander.w@rentilo.com',
    phone: '+1 (555) 000-0000',
    timezone: 'GMT -5:00 Eastern Time',
    gstin: '87155XXXXXXXXX887',
    gstEntity: 'Alexander LLP Sons Pvt Ltd',
    accountHolder: '',
    bankName: '',
    accountNumber: '',
    ifsc: '',
  }
  const kycStatus = useOwnerStore((state) => state.kycStatus)
  const isKycVerified = kycStatus === 'Verified'
  const [profile, setProfile] = useState(initialProfile)
  const [prefs, setPrefs] = useState({
    'Email Notifications': true,
    'SMS Alerts': false,
    'Weekly Reports': true,
  })
  const [status, setStatus] = useState('')
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)

  const updateProfile = (field: keyof typeof initialProfile, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }))
    setStatus('')
  }

  return (
    <div className="min-h-screen bg-canvas-alt px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-heading-1 font-bold tracking-tight text-text-primary">
              Account Settings
            </h1>
            <p className="mt-2 max-w-2xl text-body text-text-muted">
              Manage your professional identity, payout preferences, and account security.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setProfile(initialProfile)
                setStatus('Changes discarded.')
              }}
              className="rounded-button border border-outline-variant bg-white px-5 py-3 text-label font-semibold text-text-primary transition-colors duration-200 hover:bg-hover-light"
            >
              Discard Changes
            </button>
            <button
              type="button"
              onClick={() => setStatus('Profile saved locally.')}
              className="rounded-button bg-navy px-6 py-3 text-label font-semibold text-white transition-all duration-200 hover:bg-slate-800 hover:shadow-md"
            >
              Save Profiles
            </button>
          </div>
        </div>
        {status && <p className="mt-3 text-label font-semibold text-status-success-text">{status}</p>}

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
          <section className="space-y-6">
            <article className="rounded-card border border-outline bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-outline px-6 py-5">
                <h2 className="inline-flex items-center gap-2 text-heading-3 font-bold text-text-primary">
                  <User size={18} className="text-primary" />
                  Personal Information
                </h2>
                <span className={isKycVerified ? 'rounded-pill bg-status-success-bg px-3 py-1 text-badge text-status-success-text' : 'rounded-pill bg-status-warning-bg px-3 py-1 text-badge text-status-warning-text'}>
                  {isKycVerified ? 'KYC Verified' : `KYC ${kycStatus}`}
                </span>
              </div>

              <div className="grid gap-5 p-6 md:grid-cols-2">
                <label>
                  <span className="text-label font-medium text-text-primary">First Name</span>
                  <input
                    value={profile.firstName}
                    onChange={(event) => updateProfile('firstName', event.target.value)}
                    className="mt-2 w-full rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary-100"
                  />
                </label>
                <label>
                  <span className="text-label font-medium text-text-primary">Last Name</span>
                  <input
                    value={profile.lastName}
                    onChange={(event) => updateProfile('lastName', event.target.value)}
                    className="mt-2 w-full rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary-100"
                  />
                </label>
                <label className="md:col-span-2">
                  <span className="text-label font-medium text-text-primary">Email Address</span>
                  <div className="relative mt-2">
                    <input
                      value={profile.email}
                      onChange={(event) => updateProfile('email', event.target.value)}
                      className="w-full rounded-input border border-outline bg-white px-4 py-3 pr-10 text-body text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary-100"
                    />
                    <CircleCheck
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-status-success"
                    />
                  </div>
                </label>
                <label>
                  <span className="text-label font-medium text-text-primary">Phone Number</span>
                  <input
                    value={profile.phone}
                    onChange={(event) => updateProfile('phone', event.target.value)}
                    className="mt-2 w-full rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary-100"
                  />
                </label>
                <label>
                  <span className="text-label font-medium text-text-primary">Timezone</span>
                  <select
                    value={profile.timezone}
                    onChange={(event) => updateProfile('timezone', event.target.value)}
                    className="mt-2 w-full rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary-100"
                  >
                    <option>GMT -5:00 Eastern Time</option>
                    <option>GMT -8:00 Pacific Time</option>
                  </select>
                </label>
              </div>
            </article>

            <article className="rounded-card border border-outline bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-outline px-6 py-5">
                <h2 className="inline-flex items-center gap-2 text-heading-3 font-bold text-text-primary">
                  <BadgeCheck size={18} className="text-primary" />
                  KYC Verification
                </h2>
                <span className={isKycVerified ? 'rounded-pill bg-status-success-bg px-3 py-1 text-badge text-status-success-text' : 'rounded-pill bg-status-error-bg px-3 py-1 text-badge text-status-error-text'}>
                  {isKycVerified ? 'Verified' : 'Required'}
                </span>
              </div>
              <div className="grid gap-4 p-6 md:grid-cols-2">
                <div className="rounded-button bg-canvas-alt p-4">
                  <p className="text-filter-label uppercase text-text-muted">Identity Document</p>
                  <p className="mt-1 text-body font-bold text-text-primary">{kycStatus}</p>
                </div>
                <div className="rounded-button bg-canvas-alt p-4">
                  <p className="text-filter-label uppercase text-text-muted">Business Registration</p>
                  <p className="mt-1 text-body font-bold text-text-primary">{isKycVerified ? 'Verified' : 'Pending KYC'}</p>
                </div>
              </div>
            </article>
            <article className="rounded-card border border-outline bg-white shadow-sm">
              <div className="border-b border-outline px-6 py-5">
                <h2 className="inline-flex items-center gap-2 text-heading-3 font-bold text-text-primary">
                  <Building2 size={18} className="text-primary" />
                  GST Information
                </h2>
              </div>

              <div className="grid gap-5 p-6 md:grid-cols-2">
                <label>
                  <span className="text-label font-medium text-text-primary">GSTIN</span>
                  <input
                    value={profile.gstin}
                    onChange={(event) => updateProfile('gstin', event.target.value)}
                    className="mt-2 w-full rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary-100"
                  />
                </label>
                <label>
                  <span className="text-label font-medium text-text-primary">GST Entity Name</span>
                  <input
                    value={profile.gstEntity}
                    onChange={(event) => updateProfile('gstEntity', event.target.value)}
                    className="mt-2 w-full rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary-100"
                  />
                </label>
                <div className="rounded-button bg-primary-50 px-4 py-3 text-label leading-5 text-primary md:col-span-2">
                  Tax documents for the 2025 financial year are now available for viewing in the
                  Documents portal.
                </div>
              </div>
            </article>

            <section className="mt-28">
              <h2 className="border-b border-outline pb-3 text-body font-bold text-text-primary">
                Bank Details
              </h2>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {bankFields.map((field, index) => {
                  const keys = ['accountHolder', 'bankName', 'accountNumber', 'ifsc'] as const
                  const key = keys[index]
                  return (
                  <label key={field.label}>
                    <span className="text-label font-medium text-text-primary">{field.label}</span>
                    <input
                      placeholder={field.placeholder}
                      value={profile[key]}
                      onChange={(event) => updateProfile(key, event.target.value)}
                      className="mt-2 w-full rounded-input border border-outline bg-slate-100 px-4 py-3 text-body text-text-primary outline-none placeholder:text-text-muted"
                    />
                  </label>
                )})}
              </div>
            </section>

            <section className="mt-16 border-t border-outline pt-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-body font-bold text-text-primary">Close Account</h2>
                  <p className="mt-1 text-label text-text-muted">
                    Permanently delete your account and all associated property data.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStatus('Account closure request submitted.')}
                  className="rounded-button border border-status-error bg-white px-5 py-3 text-label font-semibold text-status-error transition-colors duration-200 hover:bg-status-error-bg"
                >
                  Request Account Closure
                </button>
              </div>
            </section>
          </section>

          <aside className="space-y-6">
            <article className="rounded-card bg-navy p-6 text-center text-white shadow-modal">
              <div className="mx-auto h-24 w-24 overflow-hidden rounded-card border border-slate-700">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&q=80"
                  alt="Alexander Westminster"
                  className="h-full w-full object-cover"
                />
              </div>
              <h2 className="mt-4 text-heading-3 font-bold">Alexander Westminster</h2>
              <p className="mt-1 text-label text-slate-300">Senior Portfolio Manager</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-button border border-slate-700 p-3">
                  <p className="text-filter-label uppercase text-slate-400">Properties</p>
                  <p className="mt-1 text-body font-bold">24</p>
                </div>
                <div className="rounded-button border border-slate-700 p-3">
                  <p className="text-filter-label uppercase text-slate-400">Rating</p>
                  <p className="mt-1 text-body font-bold">4.9</p>
                </div>
              </div>
            </article>

            <article className="rounded-card border border-outline bg-white p-5 shadow-sm">
              <h2 className="inline-flex items-center gap-2 text-body font-bold text-text-primary">
                <Bell size={16} className="text-primary" />
                Communication Prefs
              </h2>
              <div className="mt-5 space-y-4">
                {[
                  'Email Notifications',
                  'SMS Alerts',
                  'Weekly Reports',
                ].map((label) => {
                  const enabled = prefs[label as keyof typeof prefs]
                  return (
                  <button
                    type="button"
                    key={label}
                    onClick={() =>
                      setPrefs((current) => ({ ...current, [label]: !current[label as keyof typeof prefs] }))
                    }
                    className="flex w-full items-center justify-between gap-4"
                  >
                    <span className="text-label text-text-muted">{label}</span>
                    <span
                      className={
                        enabled
                          ? 'flex h-5 w-9 items-center justify-end rounded-pill bg-primary p-0.5'
                          : 'flex h-5 w-9 items-center justify-start rounded-pill bg-outline p-0.5'
                      }
                    >
                      <span className="h-4 w-4 rounded-full bg-white shadow-sm" />
                    </span>
                  </button>
                )})}
              </div>
            </article>

            <article className="rounded-card border border-outline bg-white p-5 shadow-sm">
              <h2 className="inline-flex items-center gap-2 text-body font-bold text-text-primary">
                <ShieldCheck size={16} className="text-primary" />
                Security
              </h2>
              <div className="mt-5 space-y-3">
                <button
                  type="button"
                  onClick={() => setStatus('Password reset link sent.')}
                  className="flex w-full items-center gap-3 rounded-button border border-outline bg-white px-4 py-3 text-left text-label font-semibold text-text-primary transition-colors duration-200 hover:bg-hover-light"
                >
                  <KeyRound size={16} className="text-text-muted" />
                  <span className="flex-1">Change Password</span>
                  <ChevronRight size={16} className="text-text-muted" />
                </button>
                <button
                  type="button"
                  onClick={() => setTwoFactorEnabled((enabled) => !enabled)}
                  className="flex w-full items-center gap-3 rounded-button border border-outline bg-white px-4 py-3 text-left text-label font-semibold text-text-primary transition-colors duration-200 hover:bg-hover-light"
                >
                  <LockKeyhole size={16} className="text-text-muted" />
                  <span className="flex-1">
                    Two-Factor Auth
                    <span
                      className={
                        twoFactorEnabled
                          ? 'block text-badge uppercase text-status-success-text'
                          : 'block text-badge uppercase text-text-muted'
                      }
                    >
                      {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </span>
                  <ChevronRight size={16} className="text-text-muted" />
                </button>
              </div>
            </article>

            {/* Subscription Status Card */}
            <SubscriptionStatusCard />

            {/* Developer Tools - Only for testing */}
            <DeveloperToolsCard />
          </aside>
        </div>
      </div>
    </div>
  )
}



