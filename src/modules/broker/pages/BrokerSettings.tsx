import { useState } from 'react'
import {
  Bell,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  FileCheck2,
  Globe,
  Landmark,
  Lock,
  LogOut,
  Mail,
  Moon,
  Phone,
  Save,
  Settings,
  ShieldCheck,
  Smartphone,
  Sun,
  Trash2,
  Upload,
  User,
  Zap,
} from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { useAuth } from '@shared/hooks/useAuth'
import { useAuthStore } from '@app/store/authStore'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@shared/constants/routes'
import brokerProfileImg from '@/assets/images/broker_profile.png'

/* ─────────────────────────────────────────────
   Shared UI helpers
───────────────────────────────────────────── */
const inputCls =
  'h-11 w-full rounded-lg border border-outline bg-white px-3.5 text-[14px] text-[#0f172a] outline-none transition-all placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20'
const labelCls =
  'mb-2 block text-[12px] font-bold uppercase tracking-wider text-text-muted'

function SectionCard({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string
  subtitle?: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="bg-white border border-outline rounded-xl shadow-ambient overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-outline">
        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-[#0f172a]">
          {icon}
        </div>
        <div>
          <h2 className="text-[15px] font-bold text-[#0f172a]">{title}</h2>
          {subtitle && (
            <p className="text-[12px] text-text-muted mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

/* Toggle switch */
function Toggle({
  id,
  checked,
  onChange,
}: {
  id: string
  checked: boolean
  onChange: (val: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30',
        checked ? 'bg-[#0f172a]' : 'bg-slate-200',
      )}
    >
      <span
        className={cn(
          'inline-block w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 absolute top-1',
          checked ? 'translate-x-6' : 'translate-x-1',
        )}
      />
    </button>
  )
}

/* Row with label + toggle */
function ToggleRow({
  label,
  description,
  checked,
  id,
  onChange,
}: {
  label: string
  description?: string
  checked: boolean
  id: string
  onChange: (val: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-outline last:border-0">
      <div>
        <p className="text-[13px] font-semibold text-[#0f172a]">{label}</p>
        {description && (
          <p className="text-[11px] text-text-muted mt-0.5">{description}</p>
        )}
      </div>
      <Toggle id={id} checked={checked} onChange={onChange} />
    </div>
  )
}

/* ─────────────────────────────────────────────
   Settings sections
───────────────────────────────────────────── */
export type SettingsTab =
  | 'account'
  | 'notifications'
  | 'security'
  | 'preferences'
  | 'billing'
  | 'bank'
  | 'kyc'

export const settingsTabs: { key: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { key: 'account', label: 'Account', icon: <User size={15} /> },
  { key: 'notifications', label: 'Notifications', icon: <Bell size={15} /> },
  { key: 'security', label: 'Security', icon: <Lock size={15} /> },
  { key: 'preferences', label: 'Preferences', icon: <Settings size={15} /> },
  { key: 'billing', label: 'Billing', icon: <CreditCard size={15} /> },
  { key: 'bank', label: 'Bank Details', icon: <Landmark size={15} /> },
  { key: 'kyc', label: 'KYC Verification', icon: <FileCheck2 size={15} /> },
]

/* ── Account ── */
export function AccountSection() {
  const { user } = useAuth()
  const [name, setName] = useState(
    user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'Agent Smith' : 'Agent Smith',
  )
  const [email, setEmail] = useState(user?.email ?? 'agent.smith@rentilo.com')
  const [phone, setPhone] = useState('+1 (415) 555-0198')
  const [region, setRegion] = useState('San Francisco, CA')
  const [language, setLanguage] = useState('English (US)')
  const [timezone, setTimezone] = useState('America/Los_Angeles (UTC-8)')
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2800)
  }

  return (
    <form onSubmit={handleSave} className="space-y-5">
      {/* Avatar */}
      <SectionCard title="Profile Photo" icon={<User size={16} />}>
        <div className="flex items-center gap-4">
          <img
            src={brokerProfileImg}
            alt={name}
            className="w-20 h-20 rounded-xl object-cover border border-outline"
          />
          <div className="space-y-2">
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0f172a] text-white text-[12px] font-bold hover:bg-navy/80 transition-colors"
            >
              Change Photo
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-outline text-[12px] font-semibold text-text-muted hover:bg-hover-light transition-colors"
            >
              <Trash2 size={12} /> Remove
            </button>
          </div>
          <div className="ml-auto text-right hidden sm:block">
            <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
              Broker ID
            </p>
            <p className="text-[13px] font-bold text-[#0f172a] mt-0.5">
              BRK-24019-JST
            </p>
            <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
              <CheckCircle2 size={9} /> Verified
            </span>
          </div>
        </div>
      </SectionCard>

      {/* Personal details */}
      <SectionCard
        title="Personal Information"
        subtitle="Visible on your public broker profile"
        icon={<BriefcaseBusiness size={16} />}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="s-name" className={labelCls}>
              Full Name
            </label>
            <input
              id="s-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="s-email" className={labelCls}>
              Email Address
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                id="s-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${inputCls} pl-9`}
              />
            </div>
          </div>
          <div>
            <label htmlFor="s-phone" className={labelCls}>
              Mobile Phone
            </label>
            <div className="relative">
              <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                id="s-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`${inputCls} pl-9`}
              />
            </div>
          </div>
          <div>
            <label htmlFor="s-region" className={labelCls}>
              Operating Region
            </label>
            <input
              id="s-region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="s-language" className={labelCls}>
              Language
            </label>
            <div className="relative">
              <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <select
                id="s-language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`${inputCls} pl-9`}
              >
                {['English (US)', 'English (UK)', 'Spanish', 'French', 'Arabic'].map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="s-tz" className={labelCls}>
              Timezone
            </label>
            <div className="relative">
              <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <select
                id="s-tz"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className={`${inputCls} pl-9`}
              >
                {[
                  'America/Los_Angeles (UTC-8)',
                  'America/New_York (UTC-5)',
                  'Europe/London (UTC+0)',
                  'Asia/Dubai (UTC+4)',
                  'Asia/Kolkata (UTC+5:30)',
                ].map((tz) => (
                  <option key={tz}>{tz}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-outline">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0f172a] text-white text-[13px] font-bold hover:bg-navy/80 transition-colors"
          >
            <Save size={14} /> Save Changes
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-[13px] font-bold text-green-700 bg-green-50 px-3 py-2 rounded-lg">
              <CheckCircle2 size={14} /> Saved successfully
            </span>
          )}
        </div>
      </SectionCard>
    </form>
  )
}

/* ── Notifications ── */
export function NotificationsSection() {
  const [emailLeads, setEmailLeads] = useState(true)
  const [smsLeads, setSmsLeads] = useState(false)
  const [pushLeads, setPushLeads] = useState(true)
  const [emailPayments, setEmailPayments] = useState(true)
  const [pushPayments, setPushPayments] = useState(true)
  const [emailMaintenance, setEmailMaintenance] = useState(false)
  const [pushMaintenance, setPushMaintenance] = useState(true)
  const [saved, setSaved] = useState(false)

  return (
    <div className="space-y-5">
      <SectionCard
        title="Lead & Client Alerts"
        subtitle="Get notified when new leads or client actions occur"
        icon={<Zap size={16} />}
      >
        <ToggleRow
          id="notif-email-leads"
          label="Email for new leads"
          description="Receive an email whenever a new lead is assigned to you"
          checked={emailLeads}
          onChange={setEmailLeads}
        />
        <ToggleRow
          id="notif-sms-leads"
          label="SMS lead alerts"
          description="Text message notification for hot leads"
          checked={smsLeads}
          onChange={setSmsLeads}
        />
        <ToggleRow
          id="notif-push-leads"
          label="Push notifications for leads"
          description="In-app and browser push for lead updates"
          checked={pushLeads}
          onChange={setPushLeads}
        />
      </SectionCard>

      <SectionCard
        title="Payment & Commission"
        subtitle="Notifications about commissions and payouts"
        icon={<CreditCard size={16} />}
      >
        <ToggleRow
          id="notif-email-pay"
          label="Email payment receipts"
          checked={emailPayments}
          onChange={setEmailPayments}
        />
        <ToggleRow
          id="notif-push-pay"
          label="Push for commission payouts"
          checked={pushPayments}
          onChange={setPushPayments}
        />
      </SectionCard>

      <SectionCard
        title="Maintenance & Property"
        subtitle="Alerts about property maintenance and status"
        icon={<Settings size={16} />}
      >
        <ToggleRow
          id="notif-email-maint"
          label="Email maintenance updates"
          checked={emailMaintenance}
          onChange={setEmailMaintenance}
        />
        <ToggleRow
          id="notif-push-maint"
          label="Push maintenance alerts"
          checked={pushMaintenance}
          onChange={setPushMaintenance}
        />
      </SectionCard>

      <button
        type="button"
        onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500) }}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0f172a] text-white text-[13px] font-bold hover:bg-navy/80 transition-colors"
      >
        <Save size={14} />
        {saved ? 'Preferences Saved!' : 'Save Preferences'}
      </button>
    </div>
  )
}

/* ── Security ── */
export function SecuritySection() {
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [twoFA, setTwoFA] = useState(true)
  const [biometric, setBiometric] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setCurrentPw('')
    setNewPw('')
    setConfirmPw('')
    setTimeout(() => setSaved(false), 2800)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <SectionCard
        title="Change Password"
        subtitle="Use a strong password of at least 8 characters"
        icon={<Lock size={16} />}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="s-cur-pw" className={labelCls}>Current Password</label>
            <input
              id="s-cur-pw"
              type="password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              placeholder="••••••••"
              className={inputCls}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="s-new-pw" className={labelCls}>New Password</label>
              <input
                id="s-new-pw"
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="••••••••"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="s-confirm-pw" className={labelCls}>Confirm Password</label>
              <input
                id="s-confirm-pw"
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="••••••••"
                className={inputCls}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0f172a] text-white text-[13px] font-bold hover:bg-navy/80 transition-colors"
            >
              <Save size={14} /> Update Password
            </button>
            {saved && (
              <span className="flex items-center gap-1.5 text-[13px] font-bold text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                <CheckCircle2 size={14} /> Password updated
              </span>
            )}
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Two-Factor Authentication"
        subtitle="Enhance your account security"
        icon={<ShieldCheck size={16} />}
      >
        <ToggleRow
          id="s-2fa"
          label="Enable 2FA (Authenticator App)"
          description="Use Google Authenticator or Authy for login verification"
          checked={twoFA}
          onChange={setTwoFA}
        />
        <ToggleRow
          id="s-biometric"
          label="Biometric Login"
          description="Use fingerprint or Face ID on supported devices"
          checked={biometric}
          onChange={setBiometric}
        />
      </SectionCard>

      <SectionCard
        title="Active Sessions"
        subtitle="Devices currently logged into your account"
        icon={<Smartphone size={16} />}
      >
        {[
          { device: 'MacBook Pro', location: 'San Francisco, CA', current: true, time: 'Active now' },
          { device: 'iPhone 15 Pro', location: 'San Francisco, CA', current: false, time: '2 hours ago' },
          { device: 'Chrome on Windows', location: 'New York, NY', current: false, time: 'Oct 22' },
        ].map((session) => (
          <div
            key={session.device}
            className="flex items-center justify-between py-3 border-b border-outline last:border-0"
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[13px] font-semibold text-[#0f172a]">{session.device}</p>
                {session.current && (
                  <span className="text-[10px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded-full border border-green-200">
                    This device
                  </span>
                )}
              </div>
              <p className="text-[11px] text-text-muted mt-0.5">
                {session.location} · {session.time}
              </p>
            </div>
            {!session.current && (
              <button
                type="button"
                className="text-[11px] font-bold text-red-500 hover:text-red-600 transition-colors"
              >
                Revoke
              </button>
            )}
          </div>
        ))}
      </SectionCard>
    </form>
  )
}

/* ── Preferences ── */
export function PreferencesSection() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light')
  const [compactView, setCompactView] = useState(false)
  const [saved, setSaved] = useState(false)

  return (
    <div className="space-y-5">
      {/* Theme */}
      <SectionCard
        title="Appearance"
        subtitle="Customize how the portal looks"
        icon={<Sun size={16} />}
      >
        <p className={labelCls}>Theme</p>
        <div className="flex items-center gap-2">
          {([
            { key: 'light', icon: <Sun size={14} />, label: 'Light' },
            { key: 'dark', icon: <Moon size={14} />, label: 'Dark' },
            { key: 'system', icon: <Settings size={14} />, label: 'System' },
          ] as const).map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTheme(t.key)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg border text-[13px] font-semibold transition-colors',
                theme === t.key
                  ? 'bg-[#0f172a] text-white border-[#0f172a]'
                  : 'border-outline text-text-muted hover:bg-hover-light',
              )}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <ToggleRow
            id="pref-compact"
            label="Compact view"
            description="Reduce spacing for more information density"
            checked={compactView}
            onChange={setCompactView}
          />
        </div>
      </SectionCard>

      <button
        type="button"
        onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500) }}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0f172a] text-white text-[13px] font-bold hover:bg-navy/80 transition-colors"
      >
        <Save size={14} />
        {saved ? 'Preferences Saved!' : 'Save Preferences'}
      </button>
    </div>
  )
}

/* ── Billing ── */
export function BillingSection() {
  return (
    <div className="space-y-5">
      {/* Current plan */}
      <div className="relative overflow-hidden rounded-xl bg-[#0f172a] text-white p-6 shadow-card">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(147,197,253,0.2),transparent_50%)]" />
        <div className="relative">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Current Plan
          </p>
          <h2 className="text-[28px] font-extrabold mt-1">Enterprise Broker</h2>
          <p className="text-slate-300 text-[13px] mt-1">
            Unlimited listings · Priority support · Advanced analytics
          </p>
          <div className="flex items-end gap-1 mt-4">
            <span className="text-[36px] font-extrabold leading-none">$299</span>
            <span className="text-slate-400 text-[14px] pb-1">/month</span>
          </div>
          <p className="text-[12px] text-slate-400 mt-2">Renews on Nov 1, 2024</p>
          <button
            type="button"
            className="mt-4 px-4 py-2 rounded-lg bg-white text-[#0f172a] text-[13px] font-bold hover:bg-blue-50 transition-colors flex items-center gap-2"
          >
            Upgrade Plan <ChevronRight size={13} />
          </button>
        </div>
      </div>

      <SectionCard
        title="Payment Method"
        subtitle="Your default payment method on file"
        icon={<CreditCard size={16} />}
      >
        <div className="flex items-center justify-between py-3 border border-outline rounded-lg px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-7 rounded bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
              <span className="text-white text-[8px] font-extrabold">VISA</span>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#0f172a]">•••• •••• •••• 4242</p>
              <p className="text-[11px] text-text-muted">Expires 09/27</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
            Default
          </span>
        </div>
        <button
          type="button"
          className="mt-3 text-[12px] font-semibold text-primary hover:underline"
        >
          + Add payment method
        </button>
      </SectionCard>

      <SectionCard
        title="Billing History"
        subtitle="Past invoices and receipts"
        icon={<CreditCard size={16} />}
      >
        {[
          { date: 'Oct 1, 2024', amount: '$299.00', status: 'Paid', invoice: 'INV-00124' },
          { date: 'Sep 1, 2024', amount: '$299.00', status: 'Paid', invoice: 'INV-00118' },
          { date: 'Aug 1, 2024', amount: '$199.00', status: 'Paid', invoice: 'INV-00110' },
        ].map((row) => (
          <div
            key={row.invoice}
            className="flex items-center justify-between py-3 border-b border-outline last:border-0 text-[13px]"
          >
            <div>
              <p className="font-semibold text-[#0f172a]">{row.invoice}</p>
              <p className="text-[11px] text-text-muted">{row.date}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-[#0f172a]">{row.amount}</span>
              <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                {row.status}
              </span>
              <button
                type="button"
                className="text-[11px] font-semibold text-primary hover:underline"
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </SectionCard>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main Settings Page
───────────────────────────────────────────── */
export function BankDetailsSection() {
  const [accountHolder, setAccountHolder] = useState('Agent Smith')
  const [bankName, setBankName] = useState('HDFC Bank')
  const [accountNumber, setAccountNumber] = useState('9876543210')
  const [routingCode, setRoutingCode] = useState('HDFC0002145')
  const [accountType, setAccountType] = useState('Current Account')
  const [payoutSchedule, setPayoutSchedule] = useState('Monthly')
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <form onSubmit={handleSave} className="space-y-5">
      <SectionCard
        title="Commission Payout Account"
        subtitle="Bank account used for broker commission settlements"
        icon={<Landmark size={16} />}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="bank-holder" className={labelCls}>Account Holder Name</label>
            <input id="bank-holder" value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label htmlFor="bank-name" className={labelCls}>Bank Name</label>
            <input id="bank-name" value={bankName} onChange={(e) => setBankName(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label htmlFor="bank-account" className={labelCls}>Account Number</label>
            <input id="bank-account" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label htmlFor="bank-routing" className={labelCls}>IFSC / Routing Code</label>
            <input id="bank-routing" value={routingCode} onChange={(e) => setRoutingCode(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label htmlFor="bank-type" className={labelCls}>Account Type</label>
            <select id="bank-type" value={accountType} onChange={(e) => setAccountType(e.target.value)} className={inputCls}>
              {['Savings Account', 'Current Account', 'Business Account'].map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="bank-payout" className={labelCls}>Payout Schedule</label>
            <select id="bank-payout" value={payoutSchedule} onChange={(e) => setPayoutSchedule(e.target.value)} className={inputCls}>
              {['Weekly', 'Monthly', 'After every closed deal'].map((schedule) => (
                <option key={schedule}>{schedule}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
          <p className="flex items-center gap-2 text-[13px] font-bold text-green-800">
            <CheckCircle2 size={15} />
            Primary payout account
          </p>
          <p className="mt-1 text-[12px] leading-5 text-green-700">
            Commission payouts will be settled to this account after the finance team confirms the deal.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-outline pt-4">
          <button type="submit" className="flex items-center gap-2 rounded-lg bg-[#0f172a] px-5 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-navy/80">
            <Save size={14} /> Save Bank Details
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-2 text-[13px] font-bold text-green-700">
              <CheckCircle2 size={14} /> Bank details saved
            </span>
          )}
        </div>
      </SectionCard>
    </form>
  )
}

export function KycVerificationSection() {
  const [documentType, setDocumentType] = useState('Aadhaar / National ID')
  const [documentNumber, setDocumentNumber] = useState('XXXX-XXXX-1234')
  const [addressProof, setAddressProof] = useState('Utility Bill')
  const [consent, setConsent] = useState(true)
  const [status, setStatus] = useState<'verified' | 'under_review'>('verified')

  const handleSubmit = () => {
    if (!consent) return
    setStatus('under_review')
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Identity Check', value: status === 'verified' ? 'Verified' : 'Under Review' },
          { label: 'Address Proof', value: 'Verified' },
          { label: 'Broker License', value: 'Active' },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-outline bg-white p-5 shadow-ambient">
            <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">{item.label}</p>
            <p className="mt-2 flex items-center gap-2 text-[16px] font-extrabold text-[#0f172a]">
              <CheckCircle2 size={17} className="text-green-600" />
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <SectionCard
        title="KYC Verification"
        subtitle="Identity and compliance details required for broker payouts"
        icon={<FileCheck2 size={16} />}
      >
        <div className="mb-5 rounded-xl bg-[#0f172a] p-5 text-white">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Verification Status</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[26px] font-extrabold">
                {status === 'verified' ? 'KYC Verified' : 'Submitted for Review'}
              </p>
              <p className="mt-1 text-[13px] text-slate-300">
                {status === 'verified'
                  ? 'Your broker profile is eligible for verified leads and commission payouts.'
                  : 'Compliance team review usually completes within 24 to 48 hours.'}
              </p>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-100">
              BRK-KYC-24019
            </span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="kyc-doc-type" className={labelCls}>Identity Document</label>
            <select id="kyc-doc-type" value={documentType} onChange={(e) => setDocumentType(e.target.value)} className={inputCls}>
              {['Aadhaar / National ID', 'Passport', 'Driving License', 'Broker License'].map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="kyc-doc-number" className={labelCls}>Document Number</label>
            <input id="kyc-doc-number" value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label htmlFor="kyc-address-proof" className={labelCls}>Address Proof</label>
            <select id="kyc-address-proof" value={addressProof} onChange={(e) => setAddressProof(e.target.value)} className={inputCls}>
              {['Utility Bill', 'Bank Statement', 'Rental Agreement', 'Tax Receipt'].map((proof) => (
                <option key={proof}>{proof}</option>
              ))}
            </select>
          </div>
          <div>
            <p className={labelCls}>Upload Documents</p>
            <button type="button" className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-outline bg-slate-50 text-[13px] font-bold text-[#0f172a] hover:bg-hover-light">
              <Upload size={15} />
              Upload ID / Address Proof
            </button>
          </div>
        </div>

        <label className="mt-5 flex items-start gap-3 rounded-lg bg-slate-50 px-4 py-3">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-outline text-primary focus:ring-primary"
          />
          <span className="text-[12px] leading-5 text-text-muted">
            I confirm that the uploaded documents are valid and authorize RENTILO to verify them for broker onboarding, leads, and payouts.
          </span>
        </label>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-outline pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!consent}
            className="flex items-center gap-2 rounded-lg bg-[#0f172a] px-5 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-navy/80 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <FileCheck2 size={14} />
            Submit KYC
          </button>
          {status === 'under_review' && (
            <span className="rounded-lg bg-amber-50 px-3 py-2 text-[13px] font-bold text-amber-700">
              KYC sent for review
            </span>
          )}
        </div>
      </SectionCard>
    </div>
  )
}

export function BrokerSettings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('account')
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const sectionMap: Record<SettingsTab, React.ReactNode> = {
    account: <AccountSection />,
    notifications: <NotificationsSection />,
    security: <SecuritySection />,
    preferences: <PreferencesSection />,
    billing: <BillingSection />,
    bank: <BankDetailsSection />,
    kyc: <KycVerificationSection />,
  }

  return (
    <div className="space-y-6 pb-12">
      {/* ── Header ── */}
      <div>
        <h1 className="text-[26px] font-bold text-[#0f172a] tracking-tight">Settings</h1>
        <p className="text-[13px] text-text-muted mt-1">
          Manage your account, notifications, security, and billing preferences.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Sidebar nav ── */}
        <nav className="w-full lg:w-56 shrink-0">
          <div className="bg-white border border-outline rounded-xl shadow-ambient overflow-hidden">
            <ul>
              {settingsTabs.map((tab, i) => (
                <li key={tab.key}>
                  <button
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 text-[13px] font-semibold transition-colors text-left',
                      i < settingsTabs.length - 1 && 'border-b border-outline',
                      activeTab === tab.key
                        ? 'bg-[#0f172a] text-white'
                        : 'text-text-muted hover:bg-hover-light hover:text-[#0f172a]',
                    )}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>

            {/* Danger zone */}
            <div className="border-t border-outline px-4 py-3 space-y-1">
              <button
                type="button"
                onClick={() => { logout(); navigate(ROUTES.AUTH.LOGIN) }}
                className="w-full flex items-center gap-3 px-2 py-2.5 rounded-lg text-[13px] font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut size={15} /> Log Out
              </button>
            </div>
          </div>
        </nav>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0">{sectionMap[activeTab]}</div>
      </div>
    </div>
  )
}
