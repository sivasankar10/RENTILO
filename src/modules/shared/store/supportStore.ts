import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { usePrototypeStore } from './prototypeStore'

// ───────────────────────── Types ─────────────────────────
export type SupportRole = 'tenant' | 'owner' | 'broker'
export type SupportAuthorRole = SupportRole | 'admin'
export type SupportCategory = 'App' | 'Property' | 'Payments' | 'Account' | 'Listings' | 'Other'
export type SupportStatus = 'Open' | 'Answered' | 'Resolved'

/** A single message inside a query thread. The first message is the query itself. */
export interface SupportMessage {
  id: string
  authorId: string
  authorName: string
  authorRole: SupportAuthorRole
  body: string
  createdAt: string
}

export interface SupportQuery {
  id: string
  ticketNo: string
  subject: string
  category: SupportCategory
  authorId: string
  authorName: string
  authorRole: SupportRole
  status: SupportStatus
  /** When true the Q&A is published to the common questions list. */
  isFaq: boolean
  /** Which audience sees the published FAQ (null when not published). */
  faqAudience: SupportRole | 'all' | null
  /** True when the query has activity (new query / user reply) the admin has not viewed yet. */
  adminUnread: boolean
  messages: SupportMessage[]
  createdAt: string
  updatedAt: string
}

// ───────────────────────── Helpers ─────────────────────────
let idCounter = 0
function createId(prefix: string) {
  idCounter += 1
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`
}

function nowIso() {
  return new Date().toISOString()
}

const seedNow = '2026-07-15T09:00:00.000Z'
const ADMIN_ID = 'user-admin-1'
const ADMIN_NAME = 'Rentilo Support'

// ───────────────────────── Seed data ─────────────────────────
// Author IDs match the prototype seed user IDs so a logged-in seed user
// (e.g. "user-tenant-1") sees their own queries under "My Queries".
const seedQueries: SupportQuery[] = [
  {
    id: 'support-seed-1',
    ticketNo: 'QRY-1001',
    subject: 'How do I get the Serious Buyer badge?',
    category: 'Account',
    authorId: 'user-tenant-1',
    authorName: 'Tenant One',
    authorRole: 'tenant',
    status: 'Resolved',
    isFaq: true,
    faqAudience: 'all',
    adminUnread: false,
    createdAt: '2026-07-01T08:00:00.000Z',
    updatedAt: '2026-07-01T10:30:00.000Z',
    messages: [
      {
        id: 'support-seed-1-m1',
        authorId: 'user-tenant-1',
        authorName: 'Tenant One',
        authorRole: 'tenant',
        body: 'I keep seeing a "Serious Buyer" badge on some tenant profiles. How do I get one for my account?',
        createdAt: '2026-07-01T08:00:00.000Z',
      },
      {
        id: 'support-seed-1-m2',
        authorId: ADMIN_ID,
        authorName: ADMIN_NAME,
        authorRole: 'admin',
        body: 'The Serious Buyer badge is a one-time verification you can purchase from the badge page in your account. Once paid and verified, owners see the badge on your applications, which improves your response rate.',
        createdAt: '2026-07-01T10:30:00.000Z',
      },
    ],
  },
  {
    id: 'support-seed-2',
    ticketNo: 'QRY-1002',
    subject: 'When is rent payout credited to my account?',
    category: 'Payments',
    authorId: 'user-owner-1',
    authorName: 'Owner One',
    authorRole: 'owner',
    status: 'Answered',
    isFaq: true,
    faqAudience: 'all',
    adminUnread: false,
    createdAt: '2026-07-03T11:15:00.000Z',
    updatedAt: '2026-07-03T14:05:00.000Z',
    messages: [
      {
        id: 'support-seed-2-m1',
        authorId: 'user-owner-1',
        authorName: 'Owner One',
        authorRole: 'owner',
        body: 'A tenant paid rent two days ago but I have not received the payout yet. What is the usual timeline?',
        createdAt: '2026-07-03T11:15:00.000Z',
      },
      {
        id: 'support-seed-2-m2',
        authorId: ADMIN_ID,
        authorName: ADMIN_NAME,
        authorRole: 'admin',
        body: 'Rent payouts are settled to the owner account within 2-3 business days of a successful tenant payment. You can track the status any time under Payments in your dashboard.',
        createdAt: '2026-07-03T14:05:00.000Z',
      },
    ],
  },
  {
    id: 'support-seed-3',
    ticketNo: 'QRY-1003',
    subject: 'How is my commission calculated for an assigned deal?',
    category: 'Payments',
    authorId: 'user-broker-1',
    authorName: 'Broker One',
    authorRole: 'broker',
    status: 'Answered',
    isFaq: true,
    faqAudience: 'broker',
    adminUnread: false,
    createdAt: '2026-07-05T09:40:00.000Z',
    updatedAt: '2026-07-05T12:20:00.000Z',
    messages: [
      {
        id: 'support-seed-3-m1',
        authorId: 'user-broker-1',
        authorName: 'Broker One',
        authorRole: 'broker',
        body: 'For a property I was assigned, how is my commission percentage decided and when do I get paid?',
        createdAt: '2026-07-05T09:40:00.000Z',
      },
      {
        id: 'support-seed-3-m2',
        authorId: ADMIN_ID,
        authorName: ADMIN_NAME,
        authorRole: 'admin',
        body: 'Commission is set per assignment by the admin when the deal is created and is released once the tenant onboarding payment is confirmed. Your commission breakdown is visible under the Commission section.',
        createdAt: '2026-07-05T12:20:00.000Z',
      },
    ],
  },
  {
    id: 'support-seed-4',
    ticketNo: 'QRY-1004',
    subject: 'The app shows a blank screen after uploading listing photos',
    category: 'App',
    authorId: 'user-owner-2',
    authorName: 'Owner Two',
    authorRole: 'owner',
    status: 'Open',
    isFaq: false,
    faqAudience: null,
    adminUnread: true,
    createdAt: '2026-07-12T16:10:00.000Z',
    updatedAt: '2026-07-12T16:10:00.000Z',
    messages: [
      {
        id: 'support-seed-4-m1',
        authorId: 'user-owner-2',
        authorName: 'Owner Two',
        authorRole: 'owner',
        body: 'When I upload more than five photos while registering a property the screen goes blank and I have to start over. Is there a limit?',
        createdAt: '2026-07-12T16:10:00.000Z',
      },
    ],
  },
  {
    id: 'support-seed-5',
    ticketNo: 'QRY-1005',
    subject: 'Can I request a specific broker for my property?',
    category: 'Property',
    authorId: 'user-owner-1',
    authorName: 'Owner One',
    authorRole: 'owner',
    status: 'Open',
    isFaq: false,
    faqAudience: null,
    adminUnread: true,
    createdAt: '2026-07-14T10:05:00.000Z',
    updatedAt: '2026-07-14T10:05:00.000Z',
    messages: [
      {
        id: 'support-seed-5-m1',
        authorId: 'user-owner-1',
        authorName: 'Owner One',
        authorRole: 'owner',
        body: 'I worked with a broker earlier and would like the same person for my new listing. Is it possible to request them directly?',
        createdAt: '2026-07-14T10:05:00.000Z',
      },
    ],
  },
  {
    id: 'support-seed-6',
    ticketNo: 'QRY-1006',
    subject: 'How do I schedule a property visit?',
    category: 'App',
    authorId: 'user-tenant-2',
    authorName: 'Tenant Two',
    authorRole: 'tenant',
    status: 'Resolved',
    isFaq: true,
    faqAudience: 'tenant',
    adminUnread: false,
    createdAt: '2026-07-06T13:30:00.000Z',
    updatedAt: '2026-07-06T15:00:00.000Z',
    messages: [
      {
        id: 'support-seed-6-m1',
        authorId: 'user-tenant-2',
        authorName: 'Tenant Two',
        authorRole: 'tenant',
        body: 'Where do I book a visit for a property I like?',
        createdAt: '2026-07-06T13:30:00.000Z',
      },
      {
        id: 'support-seed-6-m2',
        authorId: ADMIN_ID,
        authorName: ADMIN_NAME,
        authorRole: 'admin',
        body: 'Open the property details page and use "Show Interest" / "Schedule Visit". Available slots set by the owner will appear, and you can pick one that works for you.',
        createdAt: '2026-07-06T15:00:00.000Z',
      },
    ],
  },
]

// ───────────────────────── Store ─────────────────────────
interface CreateQueryInput {
  subject: string
  body: string
  category: SupportCategory
  authorId: string
  authorName: string
  authorRole: SupportRole
}

interface SupportState {
  queries: SupportQuery[]

  /** A user raises a new query addressed to the admin. Returns the query id. */
  createQuery: (input: CreateQueryInput) => string
  /** Append a reply to a query. Admin replies mark it Answered; user replies re-open it. */
  postReply: (
    queryId: string,
    reply: { authorId: string; authorName: string; authorRole: SupportAuthorRole; body: string },
  ) => void
  /** Admin/user updates the query status. */
  setStatus: (queryId: string, status: SupportStatus) => void
  /** Admin publishes/unpublishes a query as a common Q&A for an audience. */
  setFaq: (queryId: string, isFaq: boolean, audience?: SupportRole | 'all') => void
  /** Marks a query as viewed by the admin, clearing its unread flag. */
  markQueryReadByAdmin: (queryId: string) => void
  /** Admin deletes a query. */
  deleteQuery: (queryId: string) => void
  resetSupportSession: () => void
}

export const useSupportStore = create<SupportState>()(
  persist(
    (set) => ({
      queries: seedQueries,

      createQuery: (input) => {
        const timestamp = nowIso()
        const id = createId('support')
        const ticketNo = `QRY-${Math.floor(1000 + Math.random() * 9000)}`
        const query: SupportQuery = {
          id,
          ticketNo,
          subject: input.subject.trim(),
          category: input.category,
          authorId: input.authorId,
          authorName: input.authorName,
          authorRole: input.authorRole,
          status: 'Open',
          isFaq: false,
          faqAudience: null,
          adminUnread: true,
          createdAt: timestamp,
          updatedAt: timestamp,
          messages: [
            {
              id: createId('support-msg'),
              authorId: input.authorId,
              authorName: input.authorName,
              authorRole: input.authorRole,
              body: input.body.trim(),
              createdAt: timestamp,
            },
          ],
        }
        set((state) => ({ queries: [query, ...state.queries] }))
        return id
      },

      postReply: (queryId, reply) => {
        const timestamp = nowIso()
        const isAdmin = reply.authorRole === 'admin'
        let answered: SupportQuery | undefined
        set((state) => ({
          queries: state.queries.map((query) => {
            if (query.id !== queryId) return query
            const nextStatus: SupportStatus =
              isAdmin ? 'Answered' : query.status === 'Resolved' ? 'Resolved' : 'Open'
            const updated: SupportQuery = {
              ...query,
              status: nextStatus,
              // Admin replying means they have seen it; a user reply flags it unread for admin.
              adminUnread: isAdmin ? false : true,
              updatedAt: timestamp,
              messages: [
                ...query.messages,
                {
                  id: createId('support-msg'),
                  authorId: reply.authorId,
                  authorName: reply.authorName,
                  authorRole: reply.authorRole,
                  body: reply.body.trim(),
                  createdAt: timestamp,
                },
              ],
            }
            answered = updated
            return updated
          }),
        }))

        // When the admin answers, notify the user who raised the query. Clicking the
        // notification deep-links to their support page with this thread opened.
        if (isAdmin && answered) {
          usePrototypeStore.getState().addNotification({
            userId: answered.authorId,
            role: answered.authorRole,
            title: 'Your query has been answered',
            description: `Rentilo Support replied to "${answered.subject}".`,
            action: 'view_support_query',
            relatedId: answered.id,
            important: false,
          })
        }
      },

      setStatus: (queryId, status) =>
        set((state) => ({
          queries: state.queries.map((query) =>
            query.id === queryId ? { ...query, status, updatedAt: nowIso() } : query,
          ),
        })),

      setFaq: (queryId, isFaq, audience = 'all') =>
        set((state) => ({
          queries: state.queries.map((query) =>
            query.id === queryId
              ? { ...query, isFaq, faqAudience: isFaq ? audience : null, updatedAt: nowIso() }
              : query,
          ),
        })),

      markQueryReadByAdmin: (queryId) =>
        set((state) => ({
          queries: state.queries.map((query) =>
            query.id === queryId && query.adminUnread ? { ...query, adminUnread: false } : query,
          ),
        })),

      deleteQuery: (queryId) =>
        set((state) => ({ queries: state.queries.filter((query) => query.id !== queryId) })),

      resetSupportSession: () => set({ queries: seedQueries }),
    }),
    {
      name: 'rentilo-support-session',
      storage: createJSONStorage(() => sessionStorage),
      version: 2,
    },
  ),
)

// ───────────────────────── Selectors ─────────────────────────
/** Common (published) Q&A visible to a given role. */
export function selectFaqForRole(queries: SupportQuery[], role: SupportRole) {
  return queries.filter((query) => query.isFaq && (query.faqAudience === 'all' || query.faqAudience === role))
}

/** Queries authored by a specific user. */
export function selectQueriesByAuthor(queries: SupportQuery[], authorId: string) {
  return queries.filter((query) => query.authorId === authorId)
}

/** The last admin reply in a thread, if any. */
export function selectAdminAnswer(query: SupportQuery) {
  return [...query.messages].reverse().find((message) => message.authorRole === 'admin')
}

/** Number of queries with activity the admin has not viewed yet. */
export function selectAdminUnreadCount(queries: SupportQuery[]) {
  return queries.filter((query) => query.adminUnread).length
}
