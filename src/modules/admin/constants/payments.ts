// Shared payment data and types used by AdminFinancePayments and AdminPaymentReceipt

export type PaymentStatus = 'Success' | 'Pending' | 'Failed' | 'Refunded'

export type PaymentType =
  | 'Commission'
  | 'Rent'
  | 'Subscription'
  | 'Security Deposit'
  | 'Maintenance Fee'
  | 'Refund Issued'
  | 'Platform Fee'

export interface AdminPayment {
  id: string
  txnId: string
  refId: string
  user: string
  userInitials: string
  avatarColor: string
  role: 'Broker' | 'Owner' | 'Tenant' | 'Enterprise'
  type: PaymentType
  direction: 'inbound' | 'outbound'
  amount: number
  via: string
  status: PaymentStatus
  date: string
  time: string
  property?: string
  note?: string
}

export const ALL_PAYMENTS: AdminPayment[] = [
  { id: 'p-1',  txnId: 'TRX-82910', refId: 'REF-0921-A', user: 'Arjun Mehta',            userInitials: 'AM', avatarColor: 'bg-orange-500', role: 'Broker',     type: 'Commission',       direction: 'outbound', amount: 84000,  via: 'Bank Transfer', status: 'Success',  date: '24 Oct 2025', time: '11:20 AM', property: 'Skyline Heights 14B',   note: '3.5% on ₹24L deal' },
  { id: 'p-2',  txnId: 'TRX-82911', refId: 'REF-0922-B', user: 'Priya Sharma',            userInitials: 'PS', avatarColor: 'bg-slate-500',  role: 'Broker',     type: 'Commission',       direction: 'outbound', amount: 56000,  via: 'Bank Transfer', status: 'Pending',  date: '23 Oct 2025', time: '09:45 AM', property: 'Harbor Residences 8C',  note: '2.8% on ₹20L deal' },
  { id: 'p-3',  txnId: 'TRX-82912', refId: 'REF-0923-C', user: 'Julian Casablancas',      userInitials: 'JC', avatarColor: 'bg-teal-500',   role: 'Owner',      type: 'Rent',             direction: 'inbound',  amount: 145000, via: 'UPI AutoPay',   status: 'Success',  date: '22 Oct 2025', time: '04:30 PM', property: 'Vertex Plaza South',    note: 'Oct 2025 rent cycle' },
  { id: 'p-4',  txnId: 'TRX-82913', refId: 'REF-0924-D', user: 'Sarah Jenkins',           userInitials: 'SJ', avatarColor: 'bg-blue-500',   role: 'Tenant',     type: 'Rent',             direction: 'inbound',  amount: 45000,  via: 'UPI',           status: 'Success',  date: '22 Oct 2025', time: '04:15 PM', property: 'Oak Ridge Residences',  note: 'Monthly rent' },
  { id: 'p-5',  txnId: 'TRX-82914', refId: 'REF-0925-E', user: 'Nexus Holding Corp',      userInitials: 'NH', avatarColor: 'bg-indigo-600', role: 'Enterprise', type: 'Subscription',     direction: 'inbound',  amount: 24900,  via: 'Credit Card',   status: 'Success',  date: '21 Oct 2025', time: '10:00 AM', note: 'Enterprise Pro — Oct 2025' },
  { id: 'p-6',  txnId: 'TRX-82915', refId: 'REF-0926-F', user: 'Rohan Desai',             userInitials: 'RD', avatarColor: 'bg-purple-500', role: 'Broker',     type: 'Commission',       direction: 'outbound', amount: 38500,  via: 'Bank Transfer', status: 'Failed',   date: '20 Oct 2025', time: '02:00 PM', property: 'The Loft Collective',   note: 'Transfer bounced — retry needed' },
  { id: 'p-7',  txnId: 'TRX-82916', refId: 'REF-0927-G', user: 'Sarah Jenkins',           userInitials: 'SJ', avatarColor: 'bg-blue-500',   role: 'Tenant',     type: 'Security Deposit', direction: 'inbound',  amount: 90000,  via: 'Net Banking',   status: 'Success',  date: '18 Oct 2025', time: '11:30 AM', property: 'Oak Ridge Residences',  note: '2 months deposit' },
  { id: 'p-8',  txnId: 'TRX-82917', refId: 'REF-0928-H', user: 'Marcus Thorne',           userInitials: 'MT', avatarColor: 'bg-red-500',    role: 'Tenant',     type: 'Refund Issued',    direction: 'outbound', amount: 8200,   via: 'UPI',           status: 'Refunded', date: '17 Oct 2025', time: '03:45 PM', note: 'Maintenance overcharge reversal' },
  { id: 'p-9',  txnId: 'TRX-82918', refId: 'REF-0929-I', user: 'Julian Casablancas',      userInitials: 'JC', avatarColor: 'bg-teal-500',   role: 'Owner',      type: 'Maintenance Fee',  direction: 'inbound',  amount: 12500,  via: 'Debit Card',    status: 'Success',  date: '15 Oct 2025', time: '09:00 AM', property: 'Vertex Plaza South',    note: 'HVAC repair — Oct 2025' },
  { id: 'p-10', txnId: 'TRX-82919', refId: 'REF-0930-J', user: 'Global Retail Partners',  userInitials: 'GR', avatarColor: 'bg-amber-600',  role: 'Enterprise', type: 'Platform Fee',     direction: 'inbound',  amount: 5000,   via: 'Credit Card',   status: 'Pending',  date: '14 Oct 2025', time: '08:00 AM', note: 'Listing boost — 2 properties' },
  { id: 'p-11', txnId: 'TRX-82920', refId: 'REF-0931-K', user: 'Priya Sharma',            userInitials: 'PS', avatarColor: 'bg-slate-500',  role: 'Broker',     type: 'Commission',       direction: 'outbound', amount: 71000,  via: 'Bank Transfer', status: 'Success',  date: '12 Oct 2025', time: '01:30 PM', property: 'Harbor Residences 8C',  note: 'Q3 settlement' },
  { id: 'p-12', txnId: 'TRX-82921', refId: 'REF-0932-L', user: 'Sarah Jenkins',           userInitials: 'SJ', avatarColor: 'bg-blue-500',   role: 'Tenant',     type: 'Rent',             direction: 'inbound',  amount: 45000,  via: 'UPI',           status: 'Failed',   date: '12 Sep 2025', time: '04:10 PM', property: 'Oak Ridge Residences',  note: 'Insufficient balance' },
]

// Compute fee breakdowns for receipt display
export function getPaymentReceiptMeta(payment: AdminPayment) {
  const platformFeeRate = payment.type === 'Subscription' ? 0 : payment.type === 'Commission' ? 0.02 : 0.01
  const platformFee = Math.round(payment.amount * platformFeeRate)
  const gst = Math.round(platformFee * 0.18)
  const tds = payment.type === 'Commission' ? Math.round(payment.amount * 0.05) : 0
  const netSettled = Math.max(payment.amount - platformFee - gst - tds, 0)

  return {
    receiptNo: `RCT-${payment.txnId}`,
    platformFee,
    gst,
    tds,
    netSettled,
  }
}

export const statusConfig: Record<PaymentStatus, { dot: string; text: string; bg: string; border: string }> = {
  Success:  { dot: 'bg-green-500',  text: 'text-green-700',  bg: 'bg-green-50',   border: 'border-green-200' },
  Pending:  { dot: 'bg-amber-500',  text: 'text-amber-700',  bg: 'bg-amber-50',   border: 'border-amber-200' },
  Failed:   { dot: 'bg-red-500',    text: 'text-red-700',    bg: 'bg-red-50',     border: 'border-red-200'   },
  Refunded: { dot: 'bg-slate-400',  text: 'text-slate-600',  bg: 'bg-slate-100',  border: 'border-slate-200' },
}

export const typeColors: Record<PaymentType, string> = {
  'Commission':       'bg-orange-50 text-orange-700',
  'Rent':             'bg-blue-50 text-blue-700',
  'Subscription':     'bg-indigo-50 text-indigo-700',
  'Security Deposit': 'bg-purple-50 text-purple-700',
  'Maintenance Fee':  'bg-teal-50 text-teal-700',
  'Refund Issued':    'bg-red-50 text-red-600',
  'Platform Fee':     'bg-slate-100 text-slate-600',
}

export const roleColors: Record<string, string> = {
  Broker:     'bg-[#0F172A] text-white',
  Owner:      'bg-primary text-white',
  Tenant:     'bg-teal-600 text-white',
  Enterprise: 'bg-indigo-600 text-white',
}
