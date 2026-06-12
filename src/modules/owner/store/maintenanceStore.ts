import { create } from 'zustand'

export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed'
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent'
export type TicketCategory = 'Plumbing' | 'Electrical' | 'Appliance' | 'Structural' | 'Pest Control' | 'HVAC'

export interface TicketMessage {
  id: string
  sender: 'tenant' | 'owner'
  text: string
  time: string
}

export interface OwnerMaintenanceTicket {
  id: string
  ticketNo: string
  propertyId: string
  tenantName: string
  tenantPhone: string
  tenantAvatar: string
  unit: string
  category: TicketCategory
  priority: TicketPriority
  problem: string
  status: TicketStatus
  submittedAt: string
  preferredSlot: string
  assignedTo: string
  lastUpdated: string
  ownerNote: string
  messages: TicketMessage[]
}

interface OwnerMaintenanceState {
  tickets: OwnerMaintenanceTicket[]
  updateTicket: (ticketId: string, patch: Partial<OwnerMaintenanceTicket>) => void
  sendTicketMessage: (ticketId: string, text: string) => void
}

const initialTickets: OwnerMaintenanceTicket[] = [
  {
    id: 'ticket-4421',
    ticketNo: 'MNT-4421',
    propertyId: 'modern-penthouse-suite',
    tenantName: 'Priya Gopal',
    tenantPhone: '+91 98765 43210',
    tenantAvatar: 'https://i.pravatar.cc/96?img=47',
    unit: 'Unit 14B',
    category: 'Plumbing',
    priority: 'High',
    problem: 'Kitchen sink is leaking under the cabinet. Water is pooling near the lower shelves.',
    status: 'Open',
    submittedAt: '10 Apr 2026, 9:15 AM',
    preferredSlot: 'Today, 4:00 PM - 6:00 PM',
    assignedTo: 'Not assigned',
    lastUpdated: '12 mins ago',
    ownerNote: 'Ask plumber to inspect inlet valve and drain line.',
    messages: [
      {
        id: 'msg-4421-1',
        sender: 'tenant',
        text: 'The leak has become faster since morning. I have kept a bucket below the sink.',
        time: '9:20 AM',
      },
      {
        id: 'msg-4421-2',
        sender: 'owner',
        text: 'Thanks for the update. I am checking technician availability now.',
        time: '9:28 AM',
      },
    ],
  },
  {
    id: 'ticket-4398',
    ticketNo: 'MNT-4398',
    propertyId: 'modern-penthouse-suite',
    tenantName: 'Arjun Menon',
    tenantPhone: '+91 99887 77665',
    tenantAvatar: 'https://i.pravatar.cc/96?img=12',
    unit: 'Unit 15A',
    category: 'Electrical',
    priority: 'Urgent',
    problem: 'Living room circuit breaker trips every time the AC and microwave run together.',
    status: 'In Progress',
    submittedAt: '06 Apr 2026, 3:40 PM',
    preferredSlot: 'Tomorrow, 10:00 AM - 12:00 PM',
    assignedTo: 'Kumar Electricals',
    lastUpdated: '1 hour ago',
    ownerNote: 'Electrician assigned. Check load distribution and MCB condition.',
    messages: [
      {
        id: 'msg-4398-1',
        sender: 'tenant',
        text: 'Please let me know before the technician arrives. I will be home after 10 AM.',
        time: '3:45 PM',
      },
      {
        id: 'msg-4398-2',
        sender: 'owner',
        text: 'Technician is scheduled for tomorrow after 10 AM.',
        time: '4:02 PM',
      },
    ],
  },
  {
    id: 'ticket-4375',
    ticketNo: 'MNT-4375',
    propertyId: 'modern-penthouse-suite',
    tenantName: 'Nisha Varma',
    tenantPhone: '+91 91234 56780',
    tenantAvatar: 'https://i.pravatar.cc/96?img=32',
    unit: 'Unit 13C',
    category: 'Appliance',
    priority: 'Medium',
    problem: 'Washing machine makes a loud grinding noise during the spin cycle.',
    status: 'Resolved',
    submittedAt: '01 Apr 2026, 11:00 AM',
    preferredSlot: '02 Apr 2026, 5:00 PM',
    assignedTo: 'HomeServe Appliances',
    lastUpdated: '3 days ago',
    ownerNote: 'Technician replaced drum belt. Confirmed with tenant.',
    messages: [
      {
        id: 'msg-4375-1',
        sender: 'owner',
        text: 'The technician marked this as fixed. Please tell me if the sound returns.',
        time: '6:15 PM',
      },
    ],
  },
  {
    id: 'ticket-4310',
    ticketNo: 'MNT-4310',
    propertyId: 'parkview-residences',
    tenantName: 'Rahul Das',
    tenantPhone: '+91 90123 45678',
    tenantAvatar: 'https://i.pravatar.cc/96?img=5',
    unit: 'Unit 204',
    category: 'Pest Control',
    priority: 'High',
    problem: 'Cockroach infestation noticed in the kitchen and bathroom after the recent pipe work.',
    status: 'Open',
    submittedAt: '18 Mar 2026, 8:30 AM',
    preferredSlot: 'Saturday, 9:00 AM - 11:00 AM',
    assignedTo: 'Not assigned',
    lastUpdated: 'Yesterday',
    ownerNote: 'Coordinate pest control with building security before visit.',
    messages: [
      {
        id: 'msg-4310-1',
        sender: 'tenant',
        text: 'Can pest control visit on Saturday morning?',
        time: '8:42 AM',
      },
    ],
  },
  {
    id: 'ticket-4280',
    ticketNo: 'MNT-4280',
    propertyId: 'parkview-residences',
    tenantName: 'Meera Iyer',
    tenantPhone: '+91 93456 78901',
    tenantAvatar: 'https://i.pravatar.cc/96?img=45',
    unit: 'Unit 208',
    category: 'Structural',
    priority: 'Medium',
    problem: 'Crack appearing on the bedroom ceiling near the window frame.',
    status: 'In Progress',
    submittedAt: '05 Mar 2026, 2:00 PM',
    preferredSlot: 'Friday, 2:00 PM - 4:00 PM',
    assignedTo: 'Site Engineer Review',
    lastUpdated: '2 days ago',
    ownerNote: 'Site engineer needs to inspect before assigning repair team.',
    messages: [
      {
        id: 'msg-4280-1',
        sender: 'owner',
        text: 'I have asked the site engineer to inspect the ceiling this week.',
        time: '2:18 PM',
      },
    ],
  },
]

function getMessageTime() {
  return new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export const useOwnerMaintenanceStore = create<OwnerMaintenanceState>((set) => ({
  tickets: initialTickets,
  updateTicket: (ticketId, patch) =>
    set((state) => ({
      tickets: state.tickets.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              ...patch,
              lastUpdated: 'Just now',
            }
          : ticket
      ),
    })),
  sendTicketMessage: (ticketId, text) =>
    set((state) => ({
      tickets: state.tickets.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              lastUpdated: 'Just now',
              messages: [
                ...ticket.messages,
                {
                  id: `owner-message-${Date.now()}`,
                  sender: 'owner',
                  text,
                  time: getMessageTime(),
                },
              ],
            }
          : ticket
      ),
    })),
}))
