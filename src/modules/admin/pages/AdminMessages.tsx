import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Building2,
  CalendarClock,
  CheckCircle2,
  FileText,
  Flag,
  Home,
  MessageSquare,
  Phone,
  Search,
  Send,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { cn } from '@shared/utils/cn'
import { useAdminStore, type AdminListing, type AdminUser } from '../store/adminStore'
import { toast } from '../components/Toast'

type AdminChatMessage = {
  id: string
  sender: 'admin' | 'user'
  text: string
  time: string
}

const roleSubtitles = {
  OWNER: 'Property owner',
  TENANT: 'Tenant account',
  BROKER: 'Broker partner',
} as const

const roleTone = {
  OWNER: 'bg-navy text-white',
  TENANT: 'bg-primary text-white',
  BROKER: 'bg-slate-700 text-white',
} as const

function createInitialMessages(user: AdminUser): AdminChatMessage[] {
  const roleMessage =
    user.role === 'OWNER'
      ? 'I need help checking my listing visibility and broker assignment.'
      : user.role === 'BROKER'
        ? 'Can you confirm why my KYC review is still flagged?'
        : 'I have a question about my visit schedule and payment status.'

  return [
    {
      id: `${user.id}-intro-1`,
      sender: 'user',
      text: roleMessage,
      time: user.lastActive,
    },
    {
      id: `${user.id}-intro-2`,
      sender: 'admin',
      text: `Hi ${user.name.split(' ')[0]}, I am checking your ${user.role.toLowerCase()} account details now.`,
      time: 'Just now',
    },
  ]
}

function getConversationPreview(user: AdminUser) {
  if (user.role === 'OWNER') return 'Listing visibility and property review'
  if (user.role === 'BROKER') return 'Broker verification and assignment support'
  return 'Visit schedule, rent, and tenant account support'
}

function getOwnerListings(user: AdminUser, listings: AdminListing[]) {
  const matches = listings.filter((listing) =>
    listing.owner.toLowerCase().includes(user.name.split(' ')[0].toLowerCase())
  )
  return matches.length > 0 ? matches.slice(0, 3) : listings.filter((listing) => listing.segment === 'non-enterprise').slice(0, 2)
}

export function AdminMessages() {
  const users = useAdminStore((state) => state.users)
  const listings = useAdminStore((state) => state.listings)
  const brokers = useAdminStore((state) => state.brokers)
  const location = useLocation()
  const navigate = useNavigate()
  const requestedUserId = useMemo(() => new URLSearchParams(location.search).get('user'), [location.search])
  const [search, setSearch] = useState('')
  const [selectedUserId, setSelectedUserId] = useState(requestedUserId ?? users[0]?.id ?? '')
  const [draft, setDraft] = useState('')
  const [callStatus, setCallStatus] = useState('')
  const [messagesByUser, setMessagesByUser] = useState<Record<string, AdminChatMessage[]>>(() =>
    Object.fromEntries(users.map((user) => [user.id, createInitialMessages(user)]))
  )

  useEffect(() => {
    if (requestedUserId && users.some((user) => user.id === requestedUserId)) {
      setSelectedUserId(requestedUserId)
      setCallStatus('')
    }
  }, [requestedUserId, users])

  useEffect(() => {
    if (!users.some((user) => user.id === selectedUserId)) {
      setSelectedUserId(users[0]?.id ?? '')
    }
  }, [selectedUserId, users])

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return users
    return users.filter((user) =>
      [user.name, user.email, user.id, user.role, user.status, user.kyc]
        .join(' ')
        .toLowerCase()
        .includes(query)
    )
  }, [search, users])

  const selectedUser = users.find((user) => user.id === selectedUserId) ?? filteredUsers[0] ?? users[0]
  const selectedMessages = selectedUser
    ? messagesByUser[selectedUser.id] ?? createInitialMessages(selectedUser)
    : []

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId)
    setCallStatus('')
    navigate(`${ROUTES.ADMIN.MESSAGES}?user=${encodeURIComponent(userId)}`, { replace: true })
  }

  const handleSend = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedUser || !draft.trim()) return

    const message: AdminChatMessage = {
      id: `admin-msg-${Date.now()}`,
      sender: 'admin',
      text: draft.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessagesByUser((current) => ({
      ...current,
      [selectedUser.id]: [...(current[selectedUser.id] ?? createInitialMessages(selectedUser)), message],
    }))
    setDraft('')
  }

  const handleCall = () => {
    if (!selectedUser) return
    setCallStatus(`Call request logged for ${selectedUser.name}.`)
    toast.success('Call logged', `Admin call activity recorded for ${selectedUser.name}.`)
  }

  return (
    <div className="min-h-screen bg-canvas-alt px-2 py-6 sm:px-4">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-label font-semibold uppercase tracking-widest text-text-muted">Admin Communication</p>
            <h1 className="mt-2 text-heading-1 font-bold tracking-tight text-text-primary">Messages</h1>
            <p className="mt-2 max-w-2xl text-body text-text-muted">
              Chat with owners, tenants, and brokers while reviewing the account context needed for support decisions.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(ROUTES.ADMIN.USER_MANAGEMENT)}
            className="inline-flex items-center justify-center gap-2 rounded-button border border-outline bg-white px-4 py-2.5 text-body font-semibold text-text-primary transition-colors hover:bg-hover-light"
          >
            <UserRound size={16} />
            User Management
          </button>
        </div>

        <section className="grid min-h-[720px] overflow-hidden rounded-card border border-outline bg-white shadow-surface xl:grid-cols-[330px_minmax(0,1fr)_340px]">
          <aside className="flex min-h-0 flex-col border-b border-outline xl:border-b-0 xl:border-r">
            <div className="border-b border-outline p-4">
              <div className="relative">
                <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search users, roles, status..."
                  className="h-11 w-full rounded-input border border-outline bg-white pl-10 pr-4 text-body text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary-100"
                />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {filteredUsers.map((user) => {
                const active = user.id === selectedUser?.id
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleSelectUser(user.id)}
                    className={cn(
                      'flex w-full items-start gap-3 border-b border-outline px-4 py-4 text-left transition-colors last:border-b-0',
                      active ? 'bg-primary-100/70' : 'hover:bg-hover-light'
                    )}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-200 text-badge font-bold text-text-primary">
                      {user.avatar}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-body font-bold text-text-primary">{user.name}</span>
                        <span className="shrink-0 text-[10px] font-bold uppercase text-text-muted">{user.lastActive}</span>
                      </span>
                      <span className="mt-1 block truncate text-label text-text-muted">{getConversationPreview(user)}</span>
                      <span className="mt-2 flex items-center gap-2">
                        <span className={cn('rounded-pill px-2 py-0.5 text-[10px] font-bold', roleTone[user.role])}>
                          {user.role}
                        </span>
                        {user.flags > 0 && (
                          <span className="rounded-pill bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">
                            {user.flags} flags
                          </span>
                        )}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </aside>

          {selectedUser ? (
            <>
              <main className="flex min-h-0 flex-col border-b border-outline xl:border-b-0 xl:border-r">
                <div className="flex items-center justify-between gap-4 border-b border-outline px-5 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-body font-bold text-primary">
                      {selectedUser.avatar}
                    </span>
                    <div className="min-w-0">
                      <h2 className="truncate text-heading-3 font-bold text-text-primary">{selectedUser.name}</h2>
                      <p className="truncate text-label text-text-muted">
                        {selectedUser.email} - {roleSubtitles[selectedUser.role]}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCall}
                    className="inline-flex items-center gap-2 rounded-button bg-navy px-4 py-2.5 text-body font-semibold text-white transition-colors hover:bg-slate-800"
                  >
                    <Phone size={16} />
                    Call
                  </button>
                </div>

                {callStatus && (
                  <p className="mx-5 mt-4 rounded-button bg-primary-100 px-3 py-2 text-label font-semibold text-primary">
                    {callStatus}
                  </p>
                )}

                <div className="min-h-[430px] flex-1 space-y-3 overflow-y-auto bg-canvas-alt px-5 py-5">
                  {selectedMessages.map((message) => {
                    const fromAdmin = message.sender === 'admin'
                    return (
                      <div key={message.id} className={cn('flex', fromAdmin ? 'justify-end' : 'justify-start')}>
                        <div
                          className={cn(
                            'max-w-[78%] rounded-2xl px-4 py-3 text-body shadow-sm',
                            fromAdmin
                              ? 'rounded-br-sm bg-navy text-white'
                              : 'rounded-bl-sm bg-white text-text-primary'
                          )}
                        >
                          <p>{message.text}</p>
                          <p className={cn('mt-1 text-[11px] font-semibold', fromAdmin ? 'text-white/70' : 'text-text-muted')}>
                            {fromAdmin ? 'Admin' : selectedUser.name} - {message.time}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <form onSubmit={handleSend} className="border-t border-outline bg-white p-4">
                  <div className="flex items-center gap-2 rounded-input border border-outline bg-white px-3 py-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary-100">
                    <input
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      placeholder={`Message ${selectedUser.name}...`}
                      className="h-9 min-w-0 flex-1 border-0 bg-transparent text-body text-text-primary outline-none placeholder:text-text-muted"
                    />
                    <button
                      type="submit"
                      disabled={!draft.trim()}
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-full transition-colors',
                        draft.trim()
                          ? 'bg-navy text-white hover:bg-slate-800'
                          : 'cursor-not-allowed bg-slate-100 text-text-muted'
                      )}
                      aria-label="Send message"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </form>
              </main>

              <AdminUserContextPanel user={selectedUser} listings={listings} brokers={brokers} />
            </>
          ) : (
            <main className="flex items-center justify-center p-8 xl:col-span-2">
              <div className="text-center">
                <MessageSquare size={42} className="mx-auto text-text-muted" />
                <p className="mt-3 text-body font-bold text-text-primary">No user selected</p>
                <p className="mt-1 text-label text-text-muted">Select a user to start an admin chat.</p>
              </div>
            </main>
          )}
        </section>
      </div>
    </div>
  )
}

function AdminUserContextPanel({
  user,
  listings,
  brokers,
}: {
  user: AdminUser
  listings: AdminListing[]
  brokers: ReturnType<typeof useAdminStore.getState>['brokers']
}) {
  const ownerListings = user.role === 'OWNER' ? getOwnerListings(user, listings) : []
  const brokerStats = user.role === 'BROKER' ? brokers.find((broker) => broker.avatar === user.avatar) ?? brokers[0] : null
  const tenantProperty = listings.find((listing) => listing.segment === 'non-enterprise') ?? listings[0]

  return (
    <aside className="min-h-0 overflow-y-auto bg-white p-5">
      <div className="rounded-card border border-outline bg-canvas-alt p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-body font-bold text-text-primary">
            {user.avatar}
          </span>
          <div>
            <p className="text-body-lg font-bold text-text-primary">{user.name}</p>
            <p className="text-label text-text-muted">{user.email}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <InfoTile label="Role" value={user.role} />
          <InfoTile label="KYC" value={user.kyc} />
          <InfoTile label="Status" value={user.status} />
          <InfoTile label="Flags" value={String(user.flags)} danger={user.flags > 0} />
        </div>
      </div>

      {user.role === 'OWNER' && (
        <section className="mt-5 space-y-3">
          <ContextHeading icon={Home} title="Owner Properties" />
          {ownerListings.map((listing) => (
            <div key={listing.id} className="rounded-card border border-outline p-4">
              <div className="flex gap-3">
                <img src={listing.image} alt={listing.owner} className="h-14 w-16 rounded-button object-cover" />
                <div className="min-w-0">
                  <p className="truncate text-body font-bold text-text-primary">
                    {listing.propertyTitle ?? listing.location}
                  </p>
                  <p className="mt-1 text-label text-text-muted">{listing.location}</p>
                  <p className="mt-2 text-label font-bold text-primary">{listing.rent}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-label">
                <span className="text-text-muted">{listing.id}</span>
                <span className="rounded-pill bg-primary-100 px-2 py-1 font-bold text-primary">{listing.status}</span>
              </div>
            </div>
          ))}
        </section>
      )}

      {user.role === 'TENANT' && tenantProperty && (
        <section className="mt-5 space-y-3">
          <ContextHeading icon={Building2} title="Tenant Context" />
          <div className="rounded-card border border-outline p-4">
            <p className="text-label font-bold uppercase tracking-widest text-text-muted">Interested Property</p>
            <div className="mt-3 flex gap-3">
              <img src={tenantProperty.image} alt={tenantProperty.location} className="h-16 w-20 rounded-button object-cover" />
              <div>
                <p className="text-body font-bold text-text-primary">{tenantProperty.location}</p>
                <p className="mt-1 text-label text-text-muted">Owner: {tenantProperty.owner}</p>
                <p className="mt-1 text-label font-bold text-primary">{tenantProperty.rent}</p>
              </div>
            </div>
          </div>
          <InfoTile label="Visit Status" value="Scheduled this week" icon={CalendarClock} />
          <InfoTile label="Documents" value="KYC pending review" icon={FileText} />
        </section>
      )}

      {user.role === 'BROKER' && brokerStats && (
        <section className="mt-5 space-y-3">
          <ContextHeading icon={ShieldCheck} title="Broker Details" />
          <div className="rounded-card border border-outline p-4">
            <p className="text-body font-bold text-text-primary">{brokerStats.name}</p>
            <p className="mt-1 text-label text-text-muted">{brokerStats.role} - {brokerStats.brokerId}</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <InfoTile label="Active Deals" value={String(brokerStats.activeDeals)} />
              <InfoTile label="Closed" value={String(brokerStats.dealsClosed)} />
              <InfoTile label="Success" value={`${brokerStats.successRate}%`} />
              <InfoTile label="Avg Time" value={brokerStats.avgTime} />
            </div>
          </div>
          <InfoTile label="Assignment Queue" value="2 properties available" icon={Building2} />
          <InfoTile label="Admin Flags" value={`${user.flags} compliance flags`} icon={Flag} danger={user.flags > 0} />
        </section>
      )}
    </aside>
  )
}

function ContextHeading({ icon: Icon, title }: { icon: typeof Home; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={17} className="text-primary" />
      <h3 className="text-body font-bold text-text-primary">{title}</h3>
    </div>
  )
}

function InfoTile({
  label,
  value,
  danger = false,
  icon: Icon = CheckCircle2,
}: {
  label: string
  value: string
  danger?: boolean
  icon?: typeof CheckCircle2
}) {
  return (
    <div className="rounded-card border border-outline bg-white p-3">
      <div className="flex items-center gap-2">
        <Icon size={15} className={danger ? 'text-status-error' : 'text-text-muted'} />
        <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{label}</p>
      </div>
      <p className={cn('mt-1 text-body font-bold', danger ? 'text-status-error' : 'text-text-primary')}>
        {value}
      </p>
    </div>
  )
}
