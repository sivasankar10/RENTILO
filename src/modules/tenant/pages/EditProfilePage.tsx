import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@shared/hooks/useAuth'
import { ROUTES } from '@shared/constants/routes'
import { cn } from '@shared/utils/cn'
import { MaterialIcon } from '../components/MaterialIcon'
import { tenantStyles } from '../utils/tenantStyles'

const AVATAR_SRC =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBsjFwGI8TSSdoEXUZWAE-nRGmK8p1eH8KgYLjT3Urn8_obEczpwXsONy_TGRwKE0xPxoIiwJBviAzhbr8_8hIDA4l_kLNXdDbBX6-QfmRcjzG89x6vzPJXOX37ffQJu6xx0_zNwcREd9vf8PK0Du-IaTWhO6oVo0nqBbRArkk5eIc0SIYI174D3jXGPi3s-g82-4iFdrt9-Rhjwsej9Y7K0PTNiC4gdcsm5cL4dCFxk6wfXLf_ncUSgwvGRPdp_YbPZzioXRLYcnuV'

const inputClass =
  'w-full px-3.5 py-3 border border-brand-outline-variant rounded-lg font-body text-[15px] text-brand-on-surface bg-brand-container-lowest outline-none focus:border-brand'

export function EditProfilePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [name, setName] = useState(
    user ? `${user.firstName} ${user.lastName}`.trim() : 'Danush'
  )
  const [email, setEmail] = useState(user?.email ?? 'danush@example.com')
  const [phone, setPhone] = useState('+1 (555) 012-3456')
  const [whatsappEnabled, setWhatsappEnabled] = useState(false)
  const [accountHolder, setAccountHolder] = useState('')
  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [ifscCode, setIfscCode] = useState('')
  const [saved, setSaved] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleLogout = () => {
    logout()
    navigate(ROUTES.AUTH.LOGIN)
  }

  return (
    <div className="flex flex-1 flex-col bg-brand-background font-body">
      <main className="flex-1 w-full max-w-[900px] mx-auto px-8 py-8 pb-16">
        <form
          className="bg-brand-container-lowest rounded-2xl border border-brand-outline-variant shadow-card px-10 py-8 max-md:px-5"
          onSubmit={handleSubmit}
        >
          <h1 className="font-display text-[28px] font-extrabold text-brand mb-4">
            Edit Your Profile
          </h1>
          <div className="h-px bg-brand-outline-variant mb-7" />

          <div className="flex items-center gap-6 mb-8 max-sm:flex-col max-sm:items-start">
            <img
              className="w-24 h-24 rounded-xl object-cover border-2 border-brand-container-low"
              src={AVATAR_SRC}
              alt="Profile"
            />
            <div className="flex gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg border-0 bg-brand text-white font-body text-sm font-semibold cursor-pointer"
              >
                <MaterialIcon name="edit" />
                Edit
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg border border-brand-outline-variant bg-brand-container-lowest text-brand font-body text-sm font-semibold cursor-pointer"
              >
                <MaterialIcon name="delete" />
                Remove
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-5 mb-9">
            <div>
              <label htmlFor="profile-name" className="block text-[13px] font-semibold text-brand-on-surface-variant mb-2">
                Name
              </label>
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="profile-email" className="block text-[13px] font-semibold text-brand-on-surface-variant mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(inputClass, 'pr-10')}
                />
                <MaterialIcon
                  name="error"
                  className="absolute right-3 top-1/2 -translate-y-1/2 !text-[22px] text-brand-favorite pointer-events-none"
                />
              </div>
              <button type="button" className="mt-2 border-0 bg-transparent p-0 font-body text-[13px] font-medium text-brand-secondary underline cursor-pointer text-left hover:text-brand">
                Click here to generate email verification mail
              </button>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-brand-on-surface-variant mb-2">
                KYC Update
              </label>
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-brand-pending-bg text-brand-pending-text border border-brand-pending-border text-[13px] font-bold tracking-wide">
                <MaterialIcon name="schedule" className="!text-xl" />
                <span>PENDING</span>
              </div>
            </div>

            <div>
              <label htmlFor="profile-phone" className="block text-[13px] font-semibold text-brand-on-surface-variant mb-2">
                Mobile Phone
              </label>
              <div className="flex items-center gap-3 max-sm:flex-col max-sm:items-stretch">
                <input
                  id="profile-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={cn(inputClass, 'flex-1')}
                />
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-brand-pending-bg text-brand-pending-text border border-brand-pending-border text-[11px] font-bold tracking-wide shrink-0">
                  <MaterialIcon name="schedule" className="!text-base" />
                  PENDING
                </span>
              </div>
            </div>

            <div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 border-0 bg-transparent p-0 font-body text-[13px] font-medium text-brand-secondary cursor-pointer hover:text-brand hover:underline"
              >
                <MaterialIcon name="refresh" />
                Click here to generate password reset email
              </button>
            </div>

            <div className="flex items-center justify-between px-5 py-4 bg-brand-container-low rounded-[10px] mt-2">
              <div className="flex items-center gap-3 text-sm font-medium text-brand-on-surface">
                <MaterialIcon name="chat" className="!text-2xl text-brand-whatsapp" />
                <span>Get Updates on WhatsApp</span>
              </div>
              <label className="relative inline-block w-12 h-[26px] shrink-0 cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={whatsappEnabled}
                  onChange={(e) => setWhatsappEnabled(e.target.checked)}
                />
                <span className="absolute inset-0 rounded-full bg-brand-outline-variant transition-colors peer-checked:bg-brand before:absolute before:content-[''] before:h-5 before:w-5 before:left-0.5 before:bottom-0.5 before:bg-white before:rounded-full before:shadow before:transition-transform peer-checked:before:translate-x-[22px]" />
              </label>
            </div>
          </div>

          <h2 className="font-display text-lg font-extrabold text-brand mb-5">Bank Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            {[
              { id: 'account-holder', label: 'Account Holder Name', value: accountHolder, set: setAccountHolder, ph: 'Enter full name' },
              { id: 'bank-name', label: 'Bank Name', value: bankName, set: setBankName, ph: 'Enter bank name' },
              { id: 'account-number', label: 'Account Number', value: accountNumber, set: setAccountNumber, ph: 'Enter account number' },
              { id: 'ifsc-code', label: 'IFSC Code', value: ifscCode, set: setIfscCode, ph: 'Enter IFSC code' },
            ].map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-[13px] font-semibold text-brand-on-surface-variant mb-2">
                  {field.label}
                </label>
                <input
                  id={field.id}
                  type="text"
                  placeholder={field.ph}
                  value={field.value}
                  onChange={(e) => field.set(e.target.value)}
                  className={inputClass}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-4 flex-wrap">
            {saved && (
              <span className="text-sm font-medium text-green-800">Profile saved successfully</span>
            )}
            <button type="submit" className={tenantStyles.brandBtn}>
              <MaterialIcon name="save" />
              Save Profile
            </button>
            <button
              type="button"
              className="border-0 bg-transparent font-body text-sm text-brand-secondary underline cursor-pointer hover:text-brand"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </form>

        <p className="mt-6 text-[11px] font-semibold tracking-wider text-brand-outline text-center">
          PROPERTY ID: RTL-882-DAN • LEASE ACTIVE UNTIL OCT 2024
        </p>
      </main>
    </div>
  )
}
