import { usePrototypeStore, type PrototypeState } from '@shared/store/prototypeStore'
import type { ChatThread } from '@shared/types/prototype'

export interface LeaseChatMessage {
  id: string
  sender: 'owner' | 'tenant'
  text: string
  time: string
}

export interface LeaseChatThread {
  onboardingId: string
  ownerId: string
  tenantId: string
  tenantName: string
  tenantAvatar: string
  ownerName: string
  propertyName: string
  unit: string
  address: string
  monthlyRent: string
  messages: LeaseChatMessage[]
  updatedAt: string
}

interface LeaseChatState {
  threads: LeaseChatThread[]
  ensureThread: (payload: Omit<LeaseChatThread, 'messages' | 'updatedAt'>) => LeaseChatThread
  sendMessage: (onboardingId: string, sender: 'owner' | 'tenant', text: string) => void
  getThread: (onboardingId: string) => LeaseChatThread | undefined
}

function mapThread(state: PrototypeState, thread: ChatThread): LeaseChatThread | null {
  if (!thread.applicationId) return null
  const application = state.applications.find((item) => item.id === thread.applicationId)
  if (!application) return null
  const property = state.properties.find((item) => item.id === application.propertyId)
  const tenant = state.users.find((item) => item.id === application.tenantId)
  const owner = state.users.find((item) => item.id === application.ownerId)
  return {
    onboardingId: application.id,
    ownerId: application.ownerId,
    tenantId: application.tenantId,
    tenantName: tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Tenant',
    tenantAvatar: tenant?.avatar ?? '',
    ownerName: owner ? `${owner.firstName} ${owner.lastName}` : 'Owner',
    propertyName: property?.title ?? 'Session property',
    unit: property?.unit ?? 'Unit 1',
    address: property?.address ?? '',
    monthlyRent: property?.price ?? 'Rs. 0',
    messages: thread.messages.map((message) => ({
      id: message.id,
      sender: message.senderId === application.ownerId ? 'owner' : 'tenant',
      text: message.text,
      time: message.time,
    })),
    updatedAt: thread.updatedAt,
  }
}

function threads(state: PrototypeState) {
  return state.chats
    .map((thread) => mapThread(state, thread))
    .filter((thread): thread is LeaseChatThread => Boolean(thread))
}

function ensure(payload: Omit<LeaseChatThread, 'messages' | 'updatedAt'>): LeaseChatThread {
  const state = usePrototypeStore.getState()
  const existing = threads(state).find((thread) => thread.onboardingId === payload.onboardingId)
  if (existing) return existing
  const application = state.applications.find((item) => item.id === payload.onboardingId)
  const now = new Date().toISOString()
  if (application) {
    const chat: ChatThread = {
      id: `chat-tenant-owner-${Date.now()}`,
      type: 'tenant_owner',
      participantIds: [payload.tenantId, payload.ownerId],
      propertyId: application.propertyId,
      listingId: application.listingId,
      applicationId: application.id,
      messages: [],
      updatedAt: now,
    }
    usePrototypeStore.setState((current) => ({ chats: [chat, ...current.chats] }))
  }
  return { ...payload, messages: [], updatedAt: now }
}

function bridgeState(state: PrototypeState): LeaseChatState {
  const mapped = threads(state)
  return {
    threads: mapped,
    ensureThread: ensure,
    getThread: (onboardingId) => threads(usePrototypeStore.getState()).find(
      (thread) => thread.onboardingId === onboardingId,
    ),
    sendMessage: (onboardingId, sender, text) => {
      let current = usePrototypeStore.getState()
      let thread = current.chats.find((item) => item.applicationId === onboardingId)
      if (!thread) {
        const application = current.applications.find((item) => item.id === onboardingId)
        if (!application) return
        ensure({
          onboardingId,
          ownerId: application.ownerId,
          tenantId: application.tenantId,
          tenantName: '',
          tenantAvatar: '',
          ownerName: '',
          propertyName: '',
          unit: '',
          address: '',
          monthlyRent: '',
        })
        current = usePrototypeStore.getState()
        thread = current.chats.find((item) => item.applicationId === onboardingId)
      }
      if (!thread) return
      const application = current.applications.find((item) => item.id === onboardingId)
      if (!application) return
      usePrototypeStore.getState().sendChatMessage(
        thread.id,
        sender === 'owner' ? application.ownerId : application.tenantId,
        text,
      )
    },
  }
}

function useLeaseChatStoreHook<T>(selector: (state: LeaseChatState) => T): T {
  const state = usePrototypeStore()
  return selector(bridgeState(state))
}

export const useLeaseChatStore = Object.assign(useLeaseChatStoreHook, {
  getState: () => bridgeState(usePrototypeStore.getState()),
})
