import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ChevronDown,
  HelpCircle,
  LifeBuoy,
  MessageSquarePlus,
  Search,
  Send,
  X,
} from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { useAuth } from '@shared/hooks/useAuth'
import {
  useSupportStore,
  selectAdminAnswer,
  selectFaqForRole,
  selectQueriesByAuthor,
  type SupportCategory,
  type SupportQuery,
  type SupportRole,
  type SupportStatus,
} from '@shared/store/supportStore'

const categories: SupportCategory[] = ['App', 'Property', 'Payments', 'Account', 'Listings', 'Other']

const statusBadge: Record<SupportStatus, string> = {
  Open: 'bg-amber-50 text-amber-700',
  Answered: 'bg-blue-50 text-blue-700',
  Resolved: 'bg-emerald-50 text-emerald-700',
}

type Tab = 'faq' | 'mine'

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/**
 * Self-contained support center for non-admin users (tenant / owner / broker).
 * Reads the current user from auth and derives their role. Lets them browse
 * published common Q&A and raise / follow up on their own queries to the admin.
 */
export function SupportCenter() {
  const { user, activeRole } = useAuth()
  const role = (activeRole ?? user?.primaryRole ?? 'tenant') as SupportRole
  const userId = user?.id ?? ''
  const userName = user ? `${user.firstName} ${user.lastName}`.trim() : 'You'

  const queries = useSupportStore((s) => s.queries)
  const createQuery = useSupportStore((s) => s.createQuery)
  const postReply = useSupportStore((s) => s.postReply)
  const setStatus = useSupportStore((s) => s.setStatus)

  const [tab, setTab] = useState<Tab>('faq')
  const [faqSearch, setFaqSearch] = useState('')
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)
  const [openThreadId, setOpenThreadId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [composerOpen, setComposerOpen] = useState(false)

  const faqs = useMemo(() => {
    const list = selectFaqForRole(queries, role)
    if (!faqSearch) return list
    const q = faqSearch.toLowerCase()
    return list.filter(
      (item) =>
        item.subject.toLowerCase().includes(q) ||
        item.messages.some((m) => m.body.toLowerCase().includes(q)),
    )
  }, [queries, role, faqSearch])

  const myQueries = useMemo(
    () => selectQueriesByAuthor(queries, userId).sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)),
    [queries, userId],
  )

  // Deep-link: opening ?query=<id> (e.g. from an "answered" notification) jumps
  // straight to that thread in the My Queries tab.
  const [searchParams, setSearchParams] = useSearchParams()
  useEffect(() => {
    const queryId = searchParams.get('query')
    if (!queryId) return
    if (myQueries.some((query) => query.id === queryId)) {
      setTab('mine')
      setOpenThreadId(queryId)
    }
    searchParams.delete('query')
    setSearchParams(searchParams, { replace: true })
  }, [searchParams, myQueries, setSearchParams])

  const openThread = myQueries.find((query) => query.id === openThreadId) ?? null

  const handleReply = () => {
    if (!openThread || !replyText.trim()) return
    postReply(openThread.id, { authorId: userId, authorName: userName, authorRole: role, body: replyText })
    setReplyText('')
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-2xl bg-navy p-6 text-white sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <LifeBuoy size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Help & Support</h1>
            <p className="mt-1 text-sm text-white/70">
              Browse common questions or send a new query to the Rentilo team.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setComposerOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-white/90"
        >
          <MessageSquarePlus size={16} /> Ask a Question
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
        <TabButton active={tab === 'faq'} onClick={() => setTab('faq')} label="Common Questions" count={faqs.length} />
        <TabButton active={tab === 'mine'} onClick={() => setTab('mine')} label="My Queries" count={myQueries.length} />
      </div>

      {tab === 'faq' ? (
        <section className="space-y-4">
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search common questions..."
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy/30"
            />
          </div>

          {faqs.length === 0 ? (
            <EmptyState icon={HelpCircle} title="No common questions yet" description="Answered questions published by the team will show up here." />
          ) : (
            <ul className="space-y-3">
              {faqs.map((faq) => {
                const answer = selectAdminAnswer(faq)
                const isOpen = expandedFaq === faq.id
                return (
                  <li key={faq.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                      className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                    >
                      <span className="flex items-center gap-3">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                          {faq.category}
                        </span>
                        <span className="text-sm font-semibold text-slate-800">{faq.subject}</span>
                      </span>
                      <ChevronDown size={18} className={cn('shrink-0 text-slate-400 transition-transform', isOpen && 'rotate-180')} />
                    </button>
                    {isOpen && (
                      <div className="space-y-3 border-t border-slate-100 px-5 py-4">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Question</p>
                          <p className="mt-1 text-sm text-slate-700">{faq.messages[0]?.body}</p>
                        </div>
                        {answer && (
                          <div className="rounded-lg bg-blue-50/60 p-4">
                            <p className="text-[11px] font-bold uppercase tracking-wide text-blue-600">Answer from Rentilo</p>
                            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{answer.body}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      ) : (
        <section className="space-y-4">
          {myQueries.length === 0 ? (
            <EmptyState
              icon={MessageSquarePlus}
              title="You have not raised any queries"
              description="Ask a question and the Rentilo team will reply here."
              action={
                <button
                  type="button"
                  onClick={() => setComposerOpen(true)}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  <MessageSquarePlus size={16} /> Ask a Question
                </button>
              }
            />
          ) : (
            <ul className="space-y-3">
              {myQueries.map((query) => (
                <li key={query.id} className="rounded-xl border border-slate-200 bg-white">
                  <button
                    type="button"
                    onClick={() => setOpenThreadId(query.id)}
                    className="flex w-full flex-col gap-1.5 px-5 py-4 text-left transition-colors hover:bg-slate-50"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-400">{query.ticketNo}</span>
                      <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-bold', statusBadge[query.status])}>
                        {query.status}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800">{query.subject}</p>
                    <p className="text-xs text-slate-500">
                      {query.category} · Updated {formatDate(query.updatedAt)} · {query.messages.length} message
                      {query.messages.length > 1 ? 's' : ''}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {composerOpen && (
        <QueryComposer
          role={role}
          onClose={() => setComposerOpen(false)}
          onSubmit={(input) => {
            const id = createQuery({ ...input, authorId: userId, authorName: userName, authorRole: role })
            setComposerOpen(false)
            setTab('mine')
            setOpenThreadId(id)
          }}
        />
      )}

      {openThread && (
        <ThreadDrawer
          query={openThread}
          replyText={replyText}
          onReplyChange={setReplyText}
          onReply={handleReply}
          onResolve={() => setStatus(openThread.id, 'Resolved')}
          onClose={() => {
            setOpenThreadId(null)
            setReplyText('')
          }}
        />
      )}
    </div>
  )
}

function TabButton({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors',
        active ? 'bg-white text-navy shadow-sm' : 'text-slate-500 hover:text-slate-700',
      )}
    >
      {label} <span className={cn('ml-1', active ? 'text-navy/60' : 'text-slate-400')}>({count})</span>
    </button>
  )
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: typeof HelpCircle
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center">
      <Icon className="mx-auto text-slate-300" size={36} />
      <h2 className="mt-3 text-lg font-bold text-slate-800">{title}</h2>
      <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{description}</p>
      {action}
    </div>
  )
}

function QueryComposer({
  role,
  onClose,
  onSubmit,
}: {
  role: SupportRole
  onClose: () => void
  onSubmit: (input: { subject: string; body: string; category: SupportCategory }) => void
}) {
  const [subject, setSubject] = useState('')
  const [category, setCategory] = useState<SupportCategory>('App')
  const [body, setBody] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (!subject.trim() || !body.trim()) {
      setError('Please add a subject and describe your question.')
      return
    }
    onSubmit({ subject, body, category })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Ask a Question</h2>
            <p className="text-xs text-slate-500">Your query goes to the Rentilo admin team.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-4 px-6 py-5">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Subject</span>
            <input
              type="text"
              value={subject}
              onChange={(e) => { setSubject(e.target.value); setError('') }}
              placeholder="Briefly summarise your question"
              className="mt-1.5 h-11 w-full rounded-lg border border-slate-200 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy/30"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as SupportCategory)}
              className="mt-1.5 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy/30"
            >
              {categories.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Details</span>
            <textarea
              value={body}
              onChange={(e) => { setBody(e.target.value); setError('') }}
              rows={5}
              placeholder="Describe your question or issue in detail..."
              className="mt-1.5 w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy/30"
            />
          </label>
          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
          <p className="text-xs text-slate-400 capitalize">Posting as: {role}</p>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
            <Send size={15} /> Submit Query
          </button>
        </div>
      </div>
    </div>
  )
}

function ThreadDrawer({
  query,
  replyText,
  onReplyChange,
  onReply,
  onResolve,
  onClose,
}: {
  query: SupportQuery
  replyText: string
  onReplyChange: (value: string) => void
  onReply: () => void
  onResolve: () => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-slate-900/50" onClick={onClose}>
      <div className="flex h-full w-full max-w-md flex-col bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">{query.ticketNo}</span>
              <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-bold', statusBadge[query.status])}>{query.status}</span>
            </div>
            <h2 className="mt-1.5 text-base font-bold text-slate-800">{query.subject}</h2>
            <p className="text-xs text-slate-500">{query.category}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          {query.messages.map((message) => {
            const isAdmin = message.authorRole === 'admin'
            return (
              <div key={message.id} className={cn('flex gap-3', isAdmin && 'flex-row-reverse')}>
                <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold', isAdmin ? 'bg-navy text-white' : 'bg-slate-200 text-slate-700')}>
                  {isAdmin ? 'RS' : initials(message.authorName)}
                </div>
                <div className={cn('max-w-[80%] rounded-xl border px-4 py-2.5', isAdmin ? 'border-blue-100 bg-blue-50/60' : 'border-slate-200 bg-slate-50')}>
                  <p className="text-[11px] font-semibold text-slate-500">{isAdmin ? 'Rentilo Support' : message.authorName}</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{message.body}</p>
                  <p className="mt-1.5 text-[10px] uppercase text-slate-400">{formatDate(message.createdAt)}</p>
                </div>
              </div>
            )
          })}
        </div>

        {query.status === 'Resolved' ? (
          <div className="border-t border-slate-100 px-6 py-4 text-center text-sm text-slate-500">
            This query is marked resolved.
          </div>
        ) : (
          <div className="border-t border-slate-100 px-6 py-4">
            <textarea
              value={replyText}
              onChange={(e) => onReplyChange(e.target.value)}
              rows={3}
              placeholder="Add a reply..."
              className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy/30"
            />
            <div className="mt-3 flex items-center justify-between">
              <button type="button" onClick={onResolve} className="text-sm font-semibold text-slate-500 hover:text-slate-700">
                Mark as resolved
              </button>
              <button type="button" onClick={onReply} className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
                <Send size={15} /> Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
