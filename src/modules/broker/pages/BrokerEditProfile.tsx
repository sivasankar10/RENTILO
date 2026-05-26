import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  BadgeCheck,
  BriefcaseBusiness,
  Camera,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Trash2,
} from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { useAuth } from '@shared/hooks/useAuth'
import brokerProfileImg from '@/assets/images/broker_profile.png'

const inputClass =
  'h-11 w-full rounded-lg border border-outline bg-white px-3.5 text-[14px] text-[#0f172a] outline-none transition-all placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20'

const labelClass = 'mb-2 block text-[12px] font-bold uppercase tracking-wider text-text-muted'

export function BrokerEditProfile() {
  const { user } = useAuth()
  const initialName = useMemo(() => {
    const authName = user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : ''
    return authName || 'Agent Smith'
  }, [user])

  const [name, setName] = useState(initialName)
  const [email, setEmail] = useState(user?.email ?? 'agent.smith@rentilo.com')
  const [phone, setPhone] = useState('+1 (415) 555-0198')
  const [city, setCity] = useState('San Francisco, CA')
  const [license, setLicense] = useState('CA-BRK-24019')
  const [speciality, setSpeciality] = useState('Premium Residential Leasing')
  const [bio, setBio] = useState(
    'Senior broker managing premium residential and commercial tours, owner relationships, and high-intent tenant leads.'
  )
  const [whatsapp, setWhatsapp] = useState(true)
  const [autoAssign, setAutoAssign] = useState(true)
  const [saved, setSaved] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2600)
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            to={ROUTES.BROKER.PROFILE}
            className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-text-muted hover:text-[#0f172a]"
          >
            <ArrowLeft size={15} />
            My Profile
          </Link>
          <h1 className="text-[30px] font-extrabold tracking-tight text-[#0f172a]">
            Edit Profile
          </h1>
          <p className="mt-1 max-w-2xl text-[14px] leading-relaxed text-text-muted">
            Keep your broker identity, lead preferences, and verification details ready
            for owners and tenants.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg border border-outline bg-white px-4 py-3 text-[13px] font-semibold text-[#0f172a] shadow-ambient">
          <BadgeCheck size={16} className="text-green-600" />
          Broker profile 92% complete
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <section className="space-y-5">
          <div className="rounded-xl border border-outline bg-white p-5 shadow-ambient">
            <div className="mb-5 flex items-center justify-between border-b border-outline pb-4">
              <div>
                <h2 className="text-[18px] font-bold text-[#0f172a]">Personal Details</h2>
                <p className="mt-1 text-[12px] text-text-muted">
                  These details appear on your broker profile.
                </p>
              </div>
              <ShieldCheck size={20} className="text-primary" />
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-4">
              <img
                src={brokerProfileImg}
                alt={name}
                className="h-24 w-24 rounded-xl border border-outline object-cover"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0f172a] px-4 text-[13px] font-bold text-white hover:bg-navy/90"
                >
                  <Camera size={15} />
                  Change Photo
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-outline bg-white px-4 text-[13px] font-bold text-text-muted hover:bg-hover-light hover:text-[#0f172a]"
                >
                  <Trash2 size={15} />
                  Remove
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="broker-name" className={labelClass}>
                  Full Name
                </label>
                <input
                  id="broker-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="broker-email" className={labelClass}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                  />
                  <input
                    id="broker-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="broker-phone" className={labelClass}>
                  Mobile Phone
                </label>
                <div className="relative">
                  <Phone
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                  />
                  <input
                    id="broker-phone"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="broker-city" className={labelClass}>
                  Operating Area
                </label>
                <div className="relative">
                  <MapPin
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                  />
                  <input
                    id="broker-city"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-outline bg-white p-5 shadow-ambient">
            <div className="mb-5 flex items-center gap-2 border-b border-outline pb-4">
              <BriefcaseBusiness size={18} className="text-text-muted" />
              <h2 className="text-[18px] font-bold text-[#0f172a]">Broker Details</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="broker-license" className={labelClass}>
                  License ID
                </label>
                <input
                  id="broker-license"
                  value={license}
                  onChange={(event) => setLicense(event.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="broker-speciality" className={labelClass}>
                  Speciality
                </label>
                <input
                  id="broker-speciality"
                  value={speciality}
                  onChange={(event) => setSpeciality(event.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="broker-bio" className={labelClass}>
                  Profile Bio
                </label>
                <textarea
                  id="broker-bio"
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  rows={5}
                  className="w-full resize-none rounded-lg border border-outline bg-white px-3.5 py-3 text-[14px] leading-relaxed text-[#0f172a] outline-none transition-all placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="rounded-xl border border-outline bg-white p-5 shadow-ambient">
            <h2 className="text-[16px] font-bold text-[#0f172a]">Verification</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3 rounded-lg bg-green-50 px-4 py-3 text-[13px] font-bold text-green-800">
                <CheckCircle2 size={17} />
                Email verified
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-green-50 px-4 py-3 text-[13px] font-bold text-green-800">
                <CheckCircle2 size={17} />
                Broker license verified
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-amber-50 px-4 py-3 text-[13px] font-bold text-amber-800">
                <Clock size={17} />
                KYC review pending
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-[#0f172a] p-5 text-white shadow-card">
            <h2 className="text-[16px] font-bold">Lead Preferences</h2>
            <div className="mt-4 space-y-4">
              <label className="flex items-center justify-between gap-4">
                <span className="text-[13px] font-medium text-slate-200">
                  WhatsApp lead updates
                </span>
                <input
                  type="checkbox"
                  checked={whatsapp}
                  onChange={(event) => setWhatsapp(event.target.checked)}
                  className="h-5 w-5 accent-blue-200"
                />
              </label>
              <label className="flex items-center justify-between gap-4">
                <span className="text-[13px] font-medium text-slate-200">
                  Auto-assign hot leads
                </span>
                <input
                  type="checkbox"
                  checked={autoAssign}
                  onChange={(event) => setAutoAssign(event.target.checked)}
                  className="h-5 w-5 accent-blue-200"
                />
              </label>
            </div>
          </div>

          <div className="rounded-xl border border-outline bg-white p-5 shadow-ambient">
            <button
              type="submit"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#0f172a] px-4 text-[13px] font-bold text-white hover:bg-navy/90"
            >
              <Save size={15} />
              Save Profile
            </button>
            {saved && (
              <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-center text-[13px] font-bold text-green-800">
                Profile saved successfully
              </p>
            )}
          </div>
        </aside>
      </form>
    </div>
  )
}
