import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed'
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent'
export type TicketCategory =
  | 'Plumbing'
  | 'Electrical'
  | 'Appliance'
  | 'Structural'
  | 'Pest Control'
  | 'HVAC'
  | 'Other'

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
  tenantId?: string
  leaseId?: string
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
  images: string[]
  messages: TicketMessage[]
}

interface OwnerMaintenanceState {
  tickets: OwnerMaintenanceTicket[]
  updateTicket: (ticketId: string, patch: Partial<OwnerMaintenanceTicket>) => void
  sendTicketMessage: (ticketId: string, text: string) => void
  sendTenantTicketMessage: (ticketId: string, tenantId: string, text: string) => void
  createTenantTicket: (
    ticket: Omit<
      OwnerMaintenanceTicket,
      'id' | 'ticketNo' | 'status' | 'submittedAt' | 'lastUpdated' | 'messages' | 'images'
    > & { images?: string[] },
  ) => string
  updateTenantTicket: (
    ticketId: string,
    tenantId: string,
    patch: Pick<Partial<OwnerMaintenanceTicket>, 'category' | 'problem' | 'images'>,
  ) => boolean
}

function getMessageTime() {
  return new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export const useOwnerMaintenanceStore = create<OwnerMaintenanceState>()(
  persist(
    (set, get) => ({
      tickets: [],

      updateTicket: (ticketId, patch) =>
        set((state) => ({
          tickets: state.tickets.map((ticket) =>
            ticket.id === ticketId
              ? {
                  ...ticket,
                  ...patch,
                  lastUpdated: 'Just now',
                }
              : ticket,
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
              : ticket,
          ),
        })),

      sendTenantTicketMessage: (ticketId, tenantId, text) =>
        set((state) => ({
          tickets: state.tickets.map((ticket) =>
            ticket.id === ticketId && ticket.tenantId === tenantId
              ? {
                  ...ticket,
                  lastUpdated: 'Just now',
                  messages: [
                    ...ticket.messages,
                    {
                      id: `tenant-message-${Date.now()}`,
                      sender: 'tenant',
                      text,
                      time: getMessageTime(),
                    },
                  ],
                }
              : ticket,
          ),
        })),

      createTenantTicket: (ticket) => {
        const id = `tenant-ticket-${Date.now()}`
        const ticketNo = `MNT-${Date.now().toString().slice(-4)}`
        set((state) => ({
          tickets: [
            {
              ...ticket,
              id,
              ticketNo,
              status: 'Open',
              submittedAt: new Date().toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short',
              }),
              lastUpdated: 'Just now',
              images: ticket.images ?? [],
              messages: [],
            },
            ...state.tickets,
          ],
        }))
        return ticketNo
      },

      updateTenantTicket: (ticketId, tenantId, patch) => {
        const existing = get().tickets.find(
          (ticket) => ticket.id === ticketId && ticket.tenantId === tenantId,
        )
        if (!existing || existing.status !== 'Open') return false

        set((state) => ({
          tickets: state.tickets.map((ticket) =>
            ticket.id === ticketId && ticket.tenantId === tenantId
              ? {
                  ...ticket,
                  ...patch,
                  lastUpdated: 'Just now',
                }
              : ticket,
          ),
        }))
        return true
      },
    }),
    {
      name: 'rentilo-maintenance-session',
      storage: createJSONStorage(() => sessionStorage),
      version: 2,
      migrate: () => ({ tickets: [] }),
    },
  ),
)
