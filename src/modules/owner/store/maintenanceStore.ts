import { usePrototypeStore, type PrototypeState } from '@shared/store/prototypeStore'

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
    ticket: Omit<OwnerMaintenanceTicket, 'id' | 'ticketNo' | 'status' | 'submittedAt' | 'lastUpdated' | 'messages' | 'images'> & { images?: string[] },
  ) => string
  updateTenantTicket: (
    ticketId: string,
    tenantId: string,
    patch: Pick<Partial<OwnerMaintenanceTicket>, 'category' | 'problem' | 'images'>,
  ) => boolean
}

function mapTickets(state: PrototypeState): OwnerMaintenanceTicket[] {
  return state.maintenanceTickets.map((ticket) => {
    const tenant = state.users.find((item) => item.id === ticket.tenantId)
    const property = state.properties.find((item) => item.id === ticket.propertyId)
    return {
      id: ticket.id,
      ticketNo: ticket.ticketNo,
      propertyId: ticket.propertyId,
      tenantId: ticket.tenantId,
      leaseId: ticket.leaseId,
      tenantName: tenant ? `${tenant.firstName} ${tenant.lastName}` : ticket.tenantId,
      tenantPhone: tenant?.phone ?? '',
      tenantAvatar: tenant?.avatar ?? '',
      unit: property ? `${property.title} - ${property.unit}` : 'Session property',
      category: ticket.category ?? 'Other',
      priority: ticket.priority ?? 'Medium',
      problem: ticket.problem ?? 'Maintenance request details unavailable.',
      status: ticket.status ?? 'Open',
      submittedAt: ticket.submittedAt,
      preferredSlot: ticket.preferredSlot ?? 'Coordinate with tenant',
      assignedTo: ticket.assignedTo ?? 'Not assigned',
      lastUpdated: ticket.lastUpdated,
      ownerNote: ticket.ownerNote ?? '',
      images: ticket.images ?? [],
      messages: (ticket.messages ?? []).map((message) => ({
        id: message.id,
        sender: message.senderRole === 'tenant' ? 'tenant' : 'owner',
        text: message.text,
        time: message.time,
      })),
    }
  })
}

function bridgeState(state: PrototypeState): OwnerMaintenanceState {
  return {
    tickets: mapTickets(state),
    updateTicket: (ticketId, patch) => usePrototypeStore.getState().updateMaintenanceTicket(ticketId, {
      category: patch.category,
      priority: patch.priority,
      problem: patch.problem,
      status: patch.status,
      preferredSlot: patch.preferredSlot,
      assignedTo: patch.assignedTo,
      ownerNote: patch.ownerNote,
      images: patch.images,
    }),
    sendTicketMessage: (ticketId, text) => {
      const ticket = usePrototypeStore.getState().maintenanceTickets.find((item) => item.id === ticketId)
      if (ticket) usePrototypeStore.getState().sendMaintenanceMessage(ticketId, ticket.ownerId, text)
    },
    sendTenantTicketMessage: (ticketId, tenantId, text) => {
      const ticket = usePrototypeStore.getState().maintenanceTickets.find(
        (item) => item.id === ticketId && item.tenantId === tenantId,
      )
      if (ticket) usePrototypeStore.getState().sendMaintenanceMessage(ticketId, tenantId, text)
    },
    createTenantTicket: (ticket) => {
      if (!ticket.tenantId || !ticket.leaseId) return ''
      const id = usePrototypeStore.getState().createMaintenanceTicket(ticket.tenantId, ticket.leaseId, {
        category: ticket.category ?? 'Other',
        priority: ticket.priority ?? 'Medium',
        problem: ticket.problem ?? 'Maintenance request details unavailable.',
        preferredSlot: ticket.preferredSlot ?? 'Coordinate with tenant',
        assignedTo: ticket.assignedTo ?? 'Not assigned',
        images: ticket.images ?? [],
      })
      return usePrototypeStore.getState().maintenanceTickets.find((item) => item.id === id)?.ticketNo ?? ''
    },
    updateTenantTicket: (ticketId, tenantId, patch) => {
      const ticket = usePrototypeStore.getState().maintenanceTickets.find(
        (item) => item.id === ticketId && item.tenantId === tenantId,
      )
      if (!ticket || ticket.status !== 'Open') return false
      usePrototypeStore.getState().updateMaintenanceTicket(ticketId, patch)
      return true
    },
  }
}

export function useOwnerMaintenanceStore<T>(selector: (state: OwnerMaintenanceState) => T): T {
  const state = usePrototypeStore()
  return selector(bridgeState(state))
}
