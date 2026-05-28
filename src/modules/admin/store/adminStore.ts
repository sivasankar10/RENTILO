import { create } from 'zustand'

// ───────── Types ─────────
export type BrokerStatus = 'ACTIVE' | 'BANNED'

export interface AdminBroker {
  id: string
  name: string
  role: string
  avatar: string
  brokerId: string
  status: BrokerStatus
  activeDeals: number
  dealsClosed: number
  successRate: number
  avgTime: string
}

export interface AdminEnterpriseBroker {
  id: string
  name: string
  role: string
  avatar: string
  commission: string
  property: string
  valuation: number
  status: 'Open' | 'Closed'
}

export interface AdminQueueItem {
  id: string
  name: string
  location: string
  assigned: boolean
}

export type ListingStatus = 'Active' | 'Paused' | 'Flagged' | 'Removed'

export interface AdminListing {
  id: string
  slug: string
  segment: 'enterprise' | 'non-enterprise'
  image: string
  owner: string
  location: string
  rent: string
  status: ListingStatus
  postedDate: string
  updated: string
}

export type UserRoleTag = 'OWNER' | 'TENANT' | 'BROKER'
export type KycStatus = 'Verified' | 'Pending' | 'Rejected'
export type UserStatusTag = 'Active' | 'Temp Banned'

export interface AdminUser {
  id: string
  name: string
  email: string
  avatar: string
  role: UserRoleTag
  kyc: KycStatus
  status: UserStatusTag
  flags: number
  lastActive: string
}

export interface BroadcastMessage {
  id: string
  audience: string
  title: string
  body: string
  sentAt: string
}

export type TransactionStatus = 'Success' | 'Pending' | 'Failed' | 'Refunded'
export type TransactionType = 'Rent' | 'Commission' | 'Subscription'

export interface AdminTransaction {
  id: string
  user: string
  userInitials: string
  avatarColor: string
  type: TransactionType
  amount: string
  status: TransactionStatus
  date: string
}

export interface ApprovalRequest {
  id: string
  image: string
  location: string
  owner: string
  metaLabel: string
  status: 'Pending' | 'Approved' | 'Rejected'
}

// ───────── Initial data ─────────
const initialBrokers: AdminBroker[] = [
  { id: 'br-1', name: 'Arjun Mehta', role: 'Premium Broker', avatar: 'AM', brokerId: '#BRK-9281', status: 'ACTIVE', activeDeals: 12, dealsClosed: 148, successRate: 98, avgTime: '14 Days' },
  { id: 'br-2', name: 'Priya Sharma', role: 'Senior Associate', avatar: 'PS', brokerId: '#BRK-4412', status: 'ACTIVE', activeDeals: 8, dealsClosed: 92, successRate: 92, avgTime: '18 Days' },
  { id: 'br-3', name: 'Vikram Singh', role: 'Ex-Broker', avatar: 'VS', brokerId: '#BRK-1053', status: 'BANNED', activeDeals: 0, dealsClosed: 12, successRate: 45, avgTime: 'N/A' },
  { id: 'br-4', name: 'Rohan Desai', role: 'Associate Broker', avatar: 'RD', brokerId: '#BRK-3398', status: 'ACTIVE', activeDeals: 15, dealsClosed: 64, successRate: 89, avgTime: '22 Days' },
]

const initialEnterpriseBrokers: AdminEnterpriseBroker[] = [
  { id: 'eb-1', name: 'Arjun Mehta', role: 'Premium Broker', avatar: 'AM', commission: '45%', property: 'Sarjapur', valuation: 150, status: 'Open' },
  { id: 'eb-2', name: 'Priya Sharma', role: 'Senior Associate', avatar: 'PS', commission: '28%', property: 'Sarjapur', valuation: 92, status: 'Closed' },
  { id: 'eb-3', name: 'Vikram Singh', role: 'Ex-Broker', avatar: 'VS', commission: '35%', property: 'Sarjapur', valuation: 12, status: 'Open' },
  { id: 'eb-4', name: 'Rohan Desai', role: 'Associate Broker', avatar: 'RD', commission: '27%', property: 'Sarjapur', valuation: 64, status: 'Closed' },
]

const initialQueue: AdminQueueItem[] = [
  { id: 'q-1', name: 'Skyline Heights II', location: 'Whitefield, Bangalore', assigned: false },
  { id: 'q-2', name: 'Retail Complex', location: 'Banjara Hills', assigned: false },
]

const initialListings: AdminListing[] = [
  { id: '#ENT-55201', slug: 'ent-55201', segment: 'enterprise', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=120&q=80', owner: 'Skyline Corp', location: 'Whitefield, Bangalore', rent: '₹4,50,000', status: 'Active', postedDate: '12 Oct 2023', updated: 'Just now' },
  { id: '#ENT-55202', slug: 'ent-55202', segment: 'enterprise', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=120&q=80', owner: 'Prestige Group', location: 'Indiranagar, Bangalore', rent: '₹3,20,000', status: 'Active', postedDate: '08 Oct 2023', updated: '1 day ago' },
  { id: '#ENT-55203', slug: 'ent-55203', segment: 'enterprise', image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=120&q=80', owner: 'Brigade Enterprises', location: 'Bandra West, Mumbai', rent: '₹6,80,000', status: 'Paused', postedDate: '01 Oct 2023', updated: '3 days ago' },
  { id: '#ENT-55204', slug: 'ent-55204', segment: 'enterprise', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=120&q=80', owner: 'DLF Limited', location: 'Cyber City, Gurgaon', rent: '₹8,50,000', status: 'Active', postedDate: '25 Sep 2023', updated: '5 hours ago' },
  { id: '#ENT-55205', slug: 'ent-55205', segment: 'enterprise', image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=120&q=80', owner: 'Godrej Properties', location: 'Worli, Mumbai', rent: '₹5,20,000', status: 'Flagged', postedDate: '18 Sep 2023', updated: '1 week ago' },
  { id: '#LST-88210', slug: 'lst-88210', segment: 'non-enterprise', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=120&q=80', owner: 'Arjun Raghavan', location: 'Koramangala 4th B', rent: '₹85,000', status: 'Active', postedDate: '12 Oct 2023', updated: 'Just now' },
  { id: '#LST-45902', slug: 'lst-45902', segment: 'non-enterprise', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=120&q=80', owner: 'Priya Sharma', location: 'EPIP Zone, Whitefield', rent: '₹1,20,000', status: 'Paused', postedDate: '05 Oct 2023', updated: '2 days ago' },
  { id: '#LST-22314', slug: 'lst-22314', segment: 'non-enterprise', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=120&q=80', owner: 'Vikram Malhotra', location: 'Indiranagar, Doublewood', rent: '₹45,000', status: 'Flagged', postedDate: '28 Sep 2023', updated: '5 days ago' },
  { id: '#LST-11005', slug: 'lst-11005', segment: 'non-enterprise', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=120&q=80', owner: 'Sanya Reddy', location: 'Sarjapur Road, Bangalore', rent: '₹32,000', status: 'Removed', postedDate: '15 Sep 2023', updated: '1 week ago' },
  { id: '#LST-99203', slug: 'lst-99203', segment: 'non-enterprise', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=120&q=80', owner: 'Karan Singh', location: 'HSR Layout Sector 7', rent: '₹32,500', status: 'Active', postedDate: '10 Sep 2023', updated: '3 hours ago' },
]

const initialUsers: AdminUser[] = [
  { id: 'u-1', name: 'Julian Casablancas', email: 'j.casa@example.com', avatar: 'JC', role: 'OWNER', kyc: 'Verified', status: 'Active', flags: 0, lastActive: '2 mins ago' },
  { id: 'u-2', name: 'Sarah Jenkins', email: 's.jenkins@webmail.com', avatar: 'SJ', role: 'TENANT', kyc: 'Pending', status: 'Active', flags: 3, lastActive: '4 hours ago' },
  { id: 'u-3', name: 'Marcus Thorne', email: 'm.thorne@brokerage.com', avatar: 'MT', role: 'BROKER', kyc: 'Rejected', status: 'Temp Banned', flags: 12, lastActive: '1 day ago' },
]

const initialTransactions: AdminTransaction[] = [
  { id: '#TRX-82910', user: 'Amit Kumar', userInitials: 'AK', avatarColor: 'bg-teal-500', type: 'Rent', amount: '₹ 45,000', status: 'Success', date: 'Oct 24, 2023' },
  { id: '#TRX-82911', user: 'Sneha Patil', userInitials: 'SP', avatarColor: 'bg-slate-400', type: 'Commission', amount: '₹ 8,400', status: 'Pending', date: 'Oct 23, 2023' },
  { id: '#TRX-82912', user: 'Rajesh Khanna', userInitials: 'RK', avatarColor: 'bg-blue-500', type: 'Subscription', amount: '₹ 2,499', status: 'Failed', date: 'Oct 22, 2023' },
  { id: '#TRX-82913', user: 'Maanav D.', userInitials: 'MD', avatarColor: 'bg-indigo-400', type: 'Rent', amount: '₹ 32,500', status: 'Success', date: 'Oct 22, 2023' },
]

const initialListingApprovals: ApprovalRequest[] = [
  { id: 'RF-99210', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=80&q=80', location: 'Bandra West, Mumbai', owner: 'Vikram Malhotra', metaLabel: '1 BHK', status: 'Pending' },
  { id: 'RF-88219', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=80&q=80', location: 'Whitefield, Bangalore', owner: 'Anjali Gupta', metaLabel: '3 BHK', status: 'Pending' },
]

const initialPromotedApprovals: ApprovalRequest[] = [
  { id: 'RF-99210-P', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=80&q=80', location: 'Bandra West, Mumbai', owner: 'Vikram Malhotra', metaLabel: 'Premium', status: 'Pending' },
  { id: 'RF-88219-P', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=80&q=80', location: 'Whitefield, Bangalore', owner: 'Anjali Gupta', metaLabel: 'Free', status: 'Pending' },
]

interface AdminState {
  // Brokers
  brokers: AdminBroker[]
  enterpriseBrokers: AdminEnterpriseBroker[]
  assignmentQueue: AdminQueueItem[]
  setBrokerStatus: (id: string, status: BrokerStatus) => void
  removeBroker: (id: string) => void
  removeEnterpriseBroker: (id: string) => void
  assignQueueItem: (id: string) => void
  assignAllQueueItems: () => void

  // Listings
  listings: AdminListing[]
  setListingStatus: (id: string, status: ListingStatus) => void
  removeListing: (id: string) => void
  addListing: (listing: AdminListing) => void

  // Users
  users: AdminUser[]
  broadcasts: BroadcastMessage[]
  toggleUserStatus: (id: string) => void
  removeUser: (id: string) => void
  addBroadcast: (audience: string, title: string, body: string) => void

  // Transactions
  transactions: AdminTransaction[]
  refundTransaction: (id: string) => void
  retryTransaction: (id: string) => void

  // Approvals
  listingApprovals: ApprovalRequest[]
  promotedApprovals: ApprovalRequest[]
  decideListingApproval: (id: string, decision: 'Approved' | 'Rejected') => void
  decidePromotedApproval: (id: string, decision: 'Approved' | 'Rejected') => void

  // Platform config
  kycConnected: boolean
  toggleKyc: () => void
}

export const useAdminStore = create<AdminState>((set) => ({
  brokers: initialBrokers,
  enterpriseBrokers: initialEnterpriseBrokers,
  assignmentQueue: initialQueue,
  listings: initialListings,
  users: initialUsers,
  broadcasts: [],
  transactions: initialTransactions,
  listingApprovals: initialListingApprovals,
  promotedApprovals: initialPromotedApprovals,
  kycConnected: true,

  setBrokerStatus: (id, status) =>
    set((s) => ({
      brokers: s.brokers.map((b) => (b.id === id ? { ...b, status } : b)),
    })),

  removeBroker: (id) =>
    set((s) => ({ brokers: s.brokers.filter((b) => b.id !== id) })),

  removeEnterpriseBroker: (id) =>
    set((s) => ({ enterpriseBrokers: s.enterpriseBrokers.filter((b) => b.id !== id) })),

  assignQueueItem: (id) =>
    set((s) => ({
      assignmentQueue: s.assignmentQueue.map((q) =>
        q.id === id ? { ...q, assigned: true } : q,
      ),
    })),

  assignAllQueueItems: () =>
    set((s) => ({
      assignmentQueue: s.assignmentQueue.map((q) => ({ ...q, assigned: true })),
    })),

  setListingStatus: (id, status) =>
    set((s) => ({
      listings: s.listings.map((l) => (l.id === id ? { ...l, status, updated: 'Just now' } : l)),
    })),

  removeListing: (id) =>
    set((s) => ({ listings: s.listings.filter((l) => l.id !== id) })),

  addListing: (listing) =>
    set((s) => ({ listings: [listing, ...s.listings] })),

  toggleUserStatus: (id) =>
    set((s) => ({
      users: s.users.map((u) =>
        u.id === id
          ? { ...u, status: u.status === 'Active' ? 'Temp Banned' : 'Active' }
          : u,
      ),
    })),

  removeUser: (id) => set((s) => ({ users: s.users.filter((u) => u.id !== id) })),

  addBroadcast: (audience, title, body) =>
    set((s) => ({
      broadcasts: [
        {
          id: `bc-${Date.now()}`,
          audience,
          title,
          body,
          sentAt: new Date().toISOString(),
        },
        ...s.broadcasts,
      ],
    })),

  refundTransaction: (id) =>
    set((s) => ({
      transactions: s.transactions.map((t) =>
        t.id === id ? { ...t, status: 'Refunded' } : t,
      ),
    })),

  retryTransaction: (id) =>
    set((s) => ({
      transactions: s.transactions.map((t) =>
        t.id === id ? { ...t, status: 'Success' } : t,
      ),
    })),

  decideListingApproval: (id, decision) =>
    set((s) => ({
      listingApprovals: s.listingApprovals.map((r) =>
        r.id === id ? { ...r, status: decision } : r,
      ),
    })),

  decidePromotedApproval: (id, decision) =>
    set((s) => ({
      promotedApprovals: s.promotedApprovals.map((r) =>
        r.id === id ? { ...r, status: decision } : r,
      ),
    })),

  toggleKyc: () => set((s) => ({ kycConnected: !s.kycConnected })),
}))
