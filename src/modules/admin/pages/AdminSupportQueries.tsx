import { useEffect, useMemo, useState } from 'react'
import {
  CheckCircle2,
  Inbox,
  MessageSquare,
  Search,
  Send,
  ShieldCheck,
  Trash2,
} from 'lucide-react'
import { cn } from '@shared/utils/cn'
import {
  useSupportStore,
  selectAdminAnswer,
  type SupportCategory,
  type SupportQuery,
  type SupportRole,
  type SupportStatus,
} from '@shared/store/supportStore'
import { confirm } from '../components/ConfirmDialog'
import { toast } from '../components/Toast'

const ADMIN_ID = 'user-admin-1'
const ADMIN_NAME = 'Rentilo Support'

const roleBadge: Record<SupportRole, string> = {
  tenant: 'bg-primary-100 text-primary',
  owner: 'bg-navy text-white',
  broker: 'bg-slate-700 text-white',
}

const statusBadge: Record<SupportStatus, string> = {
  Open: 'bg-amber-50 text-amber-700',
  Answered: 'bg-primary-100 text-primary',
  Resolved: 'bg-status-success-bg text-status-success-text',
}

const roleFilters: (SupportRole | 'All')[] = ['All', 'tenant', 'owner', 'broker']
const statusFilters: (SupportStatus | 'All')[] = ['All', 'Open', 'Answered', 'Resolved']
const categoryFilters: (SupportCategory | 'All')[] = ['All', 'App', 'Property', 'Payments', 'Account', 'Listings', 'Other']
const faqAudienceOptions: (SupportRole | 'all')[] = ['all', 'tenant', 'owner', 'broker']

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

export function AdminSupportQueries() {
  const queries = useSupportStore((s) => s.queries)
  const postReply = useSupportStore((s) => s.postReply)
  const setStatus = useSupportStore((s) => s.setStatus)
  const setFaq = useSupportStore((s) => s.setFaq)
  const deleteQuery = useSupportStore((s) => s.deleteQuery)
  const markQueryReadByAdmin = useSupportStore((s) => s.markQueryReadByAdmin)

  const [roleFilter, setRoleFilter] = useState<SupportRole | 'All'>('All')
  const [statusFilter, setStatusFilter] = useState<SupportStatus | 'All'>('All')
  const [categoryFilter, setCategoryFilter] = useState<SupportCategory | 'All'>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(queries[0]?.id ?? null)
  const [replyText, setReplyText] = useState('')
  const [faqAudience, setFaqAudience] = useState<SupportRole | 'all'>('all')

  const filtered = useMemo(() => {
    const sorted = [...queries].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    return sorted.filter((query) => {
      if (roleFilter !== 'All' && query.authorRole !== roleFilter) return false
      if (statusFilter !== 'All' && query.status !== statusFilter) return false
      if (categoryFilter !== 'All' && query.category !== categoryFilter) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return (
          query.subject.toLowerCase().includes(q) ||
          query.ticketNo.toLowerCase().includes(q) ||
          query.authorName.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [queries, roleFilter, statusFilter, categoryFilter, searchQuery])

  const selected = queries.find((query) => query.id === selectedId) ?? filtered[0] ?? null

  // Viewing a query clears its unread flag for the admin.
  useEffect(() => {
    if (selected?.adminUnread) markQueryReadByAdmin(selected.id)
  }, [selected?.id, selected?.adminUnread, markQueryReadByAdmin])

  const stats = useMemo(
    () => ({
      total: queries.length,
      open: queries.filter((q) => q.status === 'Open').length,
      answered: queries.filter((q) => q.status === 'Answered').length,
      published: queries.filter((q) => q.isFaq).length,
    }),
    [queries],
  )

  const handleSendReply = () => {
    if (!selected) return
    if (!replyText.trim()) {
      toast.error('Reply is empty', 'Type an answer before sending.')
      return
    }
    postReply(selected.id, {
      authorId: ADMIN_ID,
      authorName: ADMIN_NAME,
      authorRole: 'admin',
      body: replyText,
    })
    setReplyText('')
    toast.success('Reply sent', `${selected.ticketNo} marked as answered.`)
  }

  const handleReopen = (query: SupportQuery) => {
    setStatus(query.id, 'Open')
    toast.info('Reopened', `${query.ticketNo} moved back to open.`)
  }

  const handleTogglePublish = (query: SupportQuery) => {
    if (query.isFaq) {
      setFaq(query.id, false)
      toast.info('Unpublished', `${query.ticketNo} removed from common questions.`)
      return
    }
    if (!selectAdminAnswer(query)) {
      toast.error('Answer first', 'Publish common Q&A only after replying to it.')
      return
    }
    setFaq(query.id, true, faqAudience)
    toast.success('Published to Common Questions', `Visible to ${faqAudience === 'all' ? 'all users' : `${faqAudience}s`}.`)
  }

  const handleDelete = (query: SupportQuery) => {
    confirm({
      title: 'Delete query?',
      description: `${query.ticketNo} from ${query.authorName} will be permanently removed.`,
      confirmLabel: 'Delete',
      variant: 'danger',
      onConfirm: () => {
        deleteQuery(query.id)
        if (selectedId === query.id) setSelectedId(null)
        toast.success('Query deleted')
      },
    })
  }

  return (
    <div className="min-h-screen bg-canvas-alt px-2 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-heading-1 font-bold tracking-tight text-text-primary">Support & Queries</h1>
          <p className="mt-1 text-body text-text-muted">
            App and property queries raised by tenants, owners, and brokers. Reply, resolve, and publish common answers.
          </p>
        </div>

        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard tone="primary" Icon={Inbox} value={stats.total} label="Total Queries" />
          <SummaryCard tone="warning" Icon={MessageSquare} value={stats.open} label="Awaiting Reply" />
          <SummaryCard tone="primary" Icon={CheckCircle2} value={stats.answered} label="Answered" />
          <SummaryCard tone="success" Icon={ShieldCheck} value={stats.published} label="Published Q&A" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search subject, ticket, or user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-72 rounded-input border border-outline bg-white pl-9 pr-4 text-body text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>
          <FilterSelect label="Role" value={roleFilter} onChange={(v) => setRoleFilter(v as SupportRole | 'All')} options={roleFilters} format={(v) => (v === 'All' ? 'All Roles' : `${v[0].toUpperCase()}${v.slice(1)}s`)} />
          <FilterSelect label="Status" value={statusFilter} onChange={(v) => setStatusFilter(v as SupportStatus | 'All')} options={statusFilters} format={(v) => (v === 'All' ? 'All Statuses' : v)} />
          <FilterSelect label="Category" value={categoryFilter} onChange={(v) => setCategoryFilter(v as SupportCategory | 'All')} options={categoryFilters} format={(v) => (v === 'All' ? 'All Categories' : v)} />
        </div>

        {/* Master + detail */}
        <div className="grid gap-6 lg:grid-cols-[minmax(320px,380px)_1fr]">
          {/* List */}
          <div className="rounded-card border border-outline bg-white shadow-surface overflow-hidden">
            <div className="border-b border-outline px-4 py-3">
              <p className="text-label font-semibold text-text-muted">{filtered.length} queries</p>
            </div>
            <ul className="max-h-[640px] divide-y divide-outline overflow-y-auto">
              {filtered.length === 0 ? (
                <li className="px-4 py-10 text-center text-body text-text-muted">No queries match these filters.</li>
              ) : (
                filtered.map((query) => {
                  const isActive = selected?.id === query.id
                  return (
                    <li key={query.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(query.id)}
                        className={cn(
                          'flex w-full flex-col gap-1.5 px-4 py-3 text-left transition-colors',
                          isActive ? 'bg-primary-50' : 'hover:bg-hover-light',
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-label font-semibold text-text-muted">{query.ticketNo}</span>
                          <span className={cn('rounded-pill px-2 py-0.5 text-badge font-bold', statusBadge[query.status])}>
                            {query.status}
                          </span>
                        </div>
                        <p className="line-clamp-2 text-body font-semibold text-text-primary">{query.subject}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={cn('rounded-pill px-2 py-0.5 text-badge font-bold uppercase', roleBadge[query.authorRole])}>
                            {query.authorRole}
                          </span>
                          <span className="text-label text-text-muted">{query.authorName}</span>
                          {query.isFaq && (
                            <span className="inline-flex items-center gap-1 text-badge font-bold text-status-success">
                              <ShieldCheck size={12} /> Published
                            </span>
                          )}
                        </div>
                      </button>
                    </li>
                  )
                })
              )}
            </ul>
          </div>

          {/* Detail */}
          {selected ? (
            <div className="flex flex-col rounded-card border border-outline bg-white shadow-surface">
              <div className="flex flex-col gap-3 border-b border-outline px-6 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-label font-semibold text-text-muted">{selected.ticketNo}</span>
                      <span className={cn('rounded-pill px-2 py-0.5 text-badge font-bold', statusBadge[selected.status])}>
                        {selected.status}
                      </span>
                      <span className="rounded-pill bg-slate-100 px-2 py-0.5 text-badge font-bold text-slate-600">{selected.category}</span>
                    </div>
                    <h2 className="mt-1.5 text-heading-3 font-bold text-text-primary">{selected.subject}</h2>
                    <p className="mt-1 text-label text-text-muted">
                      Raised by <span className="font-semibold text-text-primary">{selected.authorName}</span>
                      {' · '}
                      <span className="capitalize">{selected.authorRole}</span>
                      {' · '}
                      {formatDate(selected.createdAt)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(selected)}
                    className="inline-flex items-center gap-1.5 rounded-button border border-outline px-3 py-2 text-label font-medium text-text-muted transition-colors hover:border-status-error hover:text-status-error"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>

                {/* Action bar */}
                <div className="flex flex-wrap items-center gap-2">
                  {selected.status === 'Resolved' && (
                    <button
                      type="button"
                      onClick={() => handleReopen(selected)}
                      className="inline-flex items-center gap-1.5 rounded-button border border-outline px-3 py-2 text-label font-semibold text-text-primary transition-colors hover:bg-hover-light"
                    >
                      Reopen
                    </button>
                  )}

                  <div className="ml-auto flex items-center gap-2">
                    {!selected.isFaq && (
                      <select
                        value={faqAudience}
                        onChange={(e) => setFaqAudience(e.target.value as SupportRole | 'all')}
                        className="h-9 rounded-input border border-outline bg-white px-3 text-label text-text-primary focus:border-primary focus:outline-none"
                        aria-label="Publish audience"
                      >
                        {faqAudienceOptions.map((option) => (
                          <option key={option} value={option}>
                            {option === 'all' ? 'All users' : `${option[0].toUpperCase()}${option.slice(1)}s`}
                          </option>
                        ))}
                      </select>
                    )}
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(selected)}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-button px-3 py-2 text-label font-semibold transition-colors',
                        selected.isFaq
                          ? 'border border-outline text-text-primary hover:bg-hover-light'
                          : 'bg-navy text-white hover:bg-slate-800',
                      )}
                    >
                      <ShieldCheck size={14} />
                      {selected.isFaq ? 'Unpublish Q&A' : 'Publish as Common Q&A'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Thread */}
              <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5" style={{ maxHeight: 420 }}>
                {selected.messages.map((message) => {
                  const isAdmin = message.authorRole === 'admin'
                  return (
                    <div key={message.id} className={cn('flex gap-3', isAdmin && 'flex-row-reverse')}>
                      <div
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-badge font-bold',
                          isAdmin ? 'bg-primary text-white' : 'bg-slate-200 text-text-primary',
                        )}
                      >
                        {isAdmin ? 'RS' : initials(message.authorName)}
                      </div>
                      <div className={cn('max-w-[80%] rounded-card border px-4 py-3', isAdmin ? 'border-primary-100 bg-primary-50' : 'border-outline bg-canvas-alt')}>
                        <div className="flex items-center gap-2">
                          <span className="text-label font-semibold text-text-primary">{message.authorName}</span>
                          <span className="text-badge uppercase text-text-muted">{message.authorRole}</span>
                        </div>
                        <p className="mt-1 whitespace-pre-wrap text-body text-text-primary">{message.body}</p>
                        <p className="mt-2 text-badge uppercase text-text-muted">{formatDate(message.createdAt)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Reply box */}
              <div className="border-t border-outline px-6 py-4">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={3}
                  placeholder="Write a reply to this user..."
                  className="w-full resize-none rounded-input border border-outline bg-white px-4 py-3 text-body text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSendReply}
                    className="inline-flex items-center gap-2 rounded-button bg-navy px-5 py-2.5 text-body font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
                  >
                    <Send size={16} /> Send Reply
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-card border border-dashed border-outline bg-white p-12 text-center">
              <div>
                <Inbox className="mx-auto text-text-muted" />
                <p className="mt-3 text-body text-text-muted">Select a query to view the conversation.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  format,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: readonly string[]
  format: (value: string) => string
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="text-label font-semibold uppercase text-text-muted">{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-input border border-outline bg-white px-3 text-body text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {format(option)}
          </option>
        ))}
      </select>
    </label>
  )
}

function SummaryCard({
  tone,
  Icon,
  value,
  label,
}: {
  tone: 'primary' | 'success' | 'warning'
  Icon: typeof Inbox
  value: number
  label: string
}) {
  return (
    <div className="flex items-center gap-4 rounded-card border border-outline bg-white p-5 shadow-sm">
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-full',
          tone === 'primary' && 'bg-primary-100',
          tone === 'success' && 'bg-status-success-bg',
          tone === 'warning' && 'bg-amber-50',
        )}
      >
        <Icon
          size={22}
          className={cn(
            tone === 'primary' && 'text-primary',
            tone === 'success' && 'text-status-success',
            tone === 'warning' && 'text-amber-600',
          )}
        />
      </div>
      <div>
        <p className="text-heading-2 font-bold text-text-primary">{value.toLocaleString()}</p>
        <p className="text-label text-text-muted">{label}</p>
      </div>
    </div>
  )
}
