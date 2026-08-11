import { usePrototypeStore, type PrototypeState } from '@shared/store/prototypeStore'
import { useLeaseChatStore } from '@shared/store/leaseChatStore'
import { PROTOTYPE_USER_IDS } from '@shared/data/prototypeSeed'
import type { AgreementTerms as PrototypeAgreementTerms, LeaseExitNotice, LeaseExitType, PrototypeNotification } from '@shared/types/prototype'

export type OnboardingStatus =
  | 'interest_shown'
  | 'visit_scheduled'
  | 'visit_confirmed'
  | 'awaiting_owner_approval'
  | 'owner_approved'
  | 'agreement_requested'
  | 'agreement_sent'
  | 'changes_requested'
  | 'agreement_approved'
  | 'payment_completed'
  | 'active'
  | 'rejected'

export const ONBOARDING_STATUS_ORDER: OnboardingStatus[] = [
  'interest_shown',
  'visit_scheduled',
  'visit_confirmed',
  'awaiting_owner_approval',
  'owner_approved',
  'agreement_requested',
  'agreement_sent',
  'changes_requested',
  'agreement_approved',
  'payment_completed',
  'active',
]

export const PROGRESS_PANEL_MIN_STATUS: OnboardingStatus = 'visit_scheduled'

export function isProgressPanelVisible(status: OnboardingStatus | undefined): boolean {
  if (!status || status === 'rejected') return false
  return ONBOARDING_STATUS_ORDER.indexOf(status) >= ONBOARDING_STATUS_ORDER.indexOf(PROGRESS_PANEL_MIN_STATUS)
}

export function statusIndex(status: OnboardingStatus): number {
  return ONBOARDING_STATUS_ORDER.indexOf(status)
}

export interface OnboardingParty {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
}

export interface AgreementTerms extends PrototypeAgreementTerms {}

export interface AgreementVersion extends AgreementTerms {
  id: string
  version: number
  sentAt: string
  tenantSignature?: string
  tenantApprovedAt?: string
  changeRequest?: string
}

export interface OnboardingPayment {
  transactionId: string
  amount: string
  method: string
  paidAt: string
}

export interface LeaseState {
  id: string
  status: 'pending_owner_onboarding' | 'active'
  activatedAt?: string
  accessKey?: string
  exitNotice?: LeaseExitNotice
}

export interface ScheduledVisit {
  date: string
  time: string
}

export interface OnboardingRecord {
  id: string
  tenantPropertyId: string
  ownerPropertyId: string
  propertyName: string
  ownerPropertyName: string
  unit: string
  address: string
  monthlyRent: string
  securityDeposit: string
  monthlyRentAmount: number
  noticePeriodDays: number
  tenant: OnboardingParty
  owner: OnboardingParty
  status: OnboardingStatus
  createdAt: string
  updatedAt: string
  timeline: Partial<Record<OnboardingStatus, string>>
  scheduledVisit?: ScheduledVisit
  ownerApprovalDueAt?: string
  agreementVersions: AgreementVersion[]
  payment?: OnboardingPayment
  lease?: LeaseState
}

export interface OnboardingNotification {
  id: string
  audience: 'tenant' | 'owner'
  onboardingId: string
  title: string
  description: string
  createdAt: string
  unread: boolean
  important: boolean
  action: 'review_application' | 'review_agreement' | 'pay' | 'onboard' | 'view_lease'
}

export interface PropertyApplicationInput {
  tenantPropertyId: string
  propertyName: string
  address: string
  monthlyRent: string
  securityDeposit: string
  tenant: OnboardingParty
}

export const DEMO_TENANT: OnboardingParty = {
  id: PROTOTYPE_USER_IDS.tenant1,
  name: 'Tenant One',
  email: 'tenant1@rentilo.test',
  phone: '9000001001',
  avatar: '',
}

export const DEMO_OWNER: OnboardingParty = {
  id: PROTOTYPE_USER_IDS.multiPropertyOwner,
  name: 'MultiProperty Owner',
  email: 'multipropertyowner@rentilo.test',
  phone: '9000002001',
  avatar: '',
}

function party(state: PrototypeState, userId: string): OnboardingParty {
  const user = state.users.find((item) => item.id === userId)
  if (!user) return userId.includes('tenant') ? DEMO_TENANT : DEMO_OWNER
  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`.trim(),
    email: user.email,
    phone: user.phone,
    avatar: user.avatar ?? '',
  }
}

function money(value: number) {
  return `Rs. ${value.toLocaleString('en-IN')}`
}

function moneyToNumber(value: string | undefined) {
  return Number((value ?? '').replace(/\D/g, '')) || 0
}

function parseNoticePeriodDays(value: string | undefined) {
  const days = Number((value ?? '').replace(/\D/g, ''))
  return Number.isFinite(days) && days > 0 ? days : 30
}

function mapRecords(state: PrototypeState): OnboardingRecord[] {
  return state.applications.map((application) => {
    const property = state.properties.find((item) => item.id === application.propertyId)
    const lease = state.leases.find((item) => item.applicationId === application.id)
    const payments = state.payments.filter((item) => item.applicationId === application.id)
    const total = payments.reduce((sum, payment) => sum + payment.amount, 0)
    const latestPayment = payments[0]
    const timeline = Object.fromEntries(
      ONBOARDING_STATUS_ORDER.slice(0, Math.max(1, ONBOARDING_STATUS_ORDER.indexOf(application.status) + 1))
        .map((status) => [status, application.updatedAt]),
    ) as Partial<Record<OnboardingStatus, string>>

    return {
      id: application.id,
      tenantPropertyId: application.listingId,
      ownerPropertyId: application.propertyId,
      propertyName: property?.title ?? 'Session property',
      ownerPropertyName: property?.title ?? 'Session property',
      unit: property?.unit ?? 'Unit 1',
      address: property?.address ?? '',
      monthlyRent: property?.price ?? 'Rs. 0',
      securityDeposit: property?.deposit ?? 'Rs. 0',
      monthlyRentAmount: moneyToNumber(property?.price),
      noticePeriodDays: parseNoticePeriodDays(property?.noticePeriod),
      tenant: party(state, application.tenantId),
      owner: party(state, application.ownerId),
      status: application.status,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
      timeline,
      scheduledVisit: application.scheduledVisit,
      agreementVersions: application.agreementVersions,
      payment: latestPayment
        ? {
            transactionId: latestPayment.txnId,
            amount: money(total),
            method: latestPayment.method,
            paidAt: latestPayment.paidAt,
          }
        : undefined,
      lease: lease
        ? {
            id: lease.id,
            status: lease.status,
            activatedAt: lease.activatedAt,
            accessKey: lease.accessKey,
            exitNotice: lease.exitNotice,
          }
        : undefined,
    }
  })
}

const validActions = new Set<OnboardingNotification['action']>([
  'review_application',
  'review_agreement',
  'pay',
  'onboard',
  'view_lease',
])

function mapNotifications(state: PrototypeState): OnboardingNotification[] {
  return state.notifications.flatMap((item) => {
    const audience = item.role === 'owner' ? 'owner' : item.role === 'tenant' ? 'tenant' : null
    if (!audience || !item.relatedId) return []
    const action = validActions.has(item.action as OnboardingNotification['action'])
      ? (item.action as OnboardingNotification['action'])
      : 'review_application'
    return [{
      id: item.id,
      audience,
      onboardingId: item.relatedId,
      title: item.title,
      description: item.description,
      createdAt: item.createdAt,
      unread: item.unread,
      important: item.important,
      action,
    }]
  })
}

function addNotification(notification: Omit<PrototypeNotification, 'id' | 'createdAt' | 'unread'>) {
  usePrototypeStore.getState().addNotification(notification)
}

function setApplicationStatus(id: string, status: OnboardingStatus) {
  usePrototypeStore.setState((state) => ({
    applications: state.applications.map((application) =>
      application.id === id ? { ...application, status, updatedAt: new Date().toISOString() } : application,
    ),
  }))
}

function listingIdFor(input: PropertyApplicationInput) {
  const state = usePrototypeStore.getState()
  return state.listings.some((item) => item.id === input.tenantPropertyId)
    ? input.tenantPropertyId
    : state.listings.find((item) => item.propertyId === input.tenantPropertyId)?.id
}

export function defaultAgreementTerms(record: OnboardingRecord): AgreementTerms {
  return {
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10),
    monthlyRent: record.monthlyRent,
    securityDeposit: record.securityDeposit,
    noticePeriod: '30 days',
    utilities: 'Electricity and internet paid by tenant. Water included in rent.',
    maintenanceResponsibility: 'Owner handles structural repairs; tenant handles routine upkeep.',
    petPolicy: 'Pets require written owner approval.',
    specialClauses: 'No subletting without written consent.',
    ownerSignature: record.owner.name,
  }
}

export function tenantCanViewAgreement(record: OnboardingRecord | undefined): boolean {
  return Boolean(record?.agreementVersions.length) && Boolean(record && [
    'agreement_sent',
    'agreement_approved',
    'payment_completed',
    'active',
  ].includes(record.status))
}

export function getOwnerLeaseForProperty(
  records: OnboardingRecord[],
  ownerId: string,
  ownerPropertyId: string,
  statuses: OnboardingStatus[] = ['active'],
) {
  return records.find((record) =>
    record.owner.id === ownerId && record.ownerPropertyId === ownerPropertyId && statuses.includes(record.status),
  )
}

interface OnboardingState {
  records: OnboardingRecord[]
  notifications: OnboardingNotification[]
  showInterest: (input: PropertyApplicationInput) => string
  scheduleVisit: (input: PropertyApplicationInput, visit: ScheduledVisit) => string
  confirmPropertyVisit: (id: string, completed: boolean) => void
  processDueOwnerApprovals: () => void
  requestLeaseAgreement: (id: string) => void
  approveTenant: (id: string) => void
  rejectTenant: (id: string) => void
  sendAgreement: (id: string, terms: AgreementTerms) => void
  requestAgreementChanges: (id: string, comment: string) => void
  approveAgreement: (id: string, tenantSignature: string) => void
  completeOnboardingPayment: (id: string, method: string, refId?: string) => void
  confirmTenantOnboarding: (id: string) => void
  initiateLeaseExit: (
    leaseId: string,
    input: {
      type: LeaseExitType
      moveOutDate: string
      moveOutDateIso: string
      earliestMoveOutDate: string
      earliestMoveOutDateIso: string
      noticePeriodDays: number
    },
  ) => void
  setEarlyExitPenalty: (leaseId: string, penaltyAmount: number) => void
  payEarlyExitPenalty: (leaseId: string, paymentInput: { method: string; refId?: string }) => void
  scheduleExitInspection: (leaseId: string, visit: { date: string; time: string }) => void
  settleExitRefund: (
    leaseId: string,
    input: { damageAmount: number; damageNotes?: string; method: string; refId?: string },
  ) => void
  markNotificationRead: (notificationId: string) => void
  toggleNotificationImportant: (notificationId: string) => void
  resetOnboardingDemo: () => void
}

function bridgeState(state: PrototypeState): OnboardingState {
  return {
    records: mapRecords(state),
    notifications: mapNotifications(state),
    showInterest: (input) => {
      const listingId = listingIdFor(input)
      if (!listingId) return ''
      const applicationId = usePrototypeStore.getState().showInterest(input.tenant.id, listingId) ?? ''
      const current = usePrototypeStore.getState()
      const application = current.applications.find((item) => item.id === applicationId)
      if (application) {
        const property = current.properties.find((item) => item.id === application.propertyId)
        const owner = party(current, application.ownerId)
        useLeaseChatStore.getState().ensureThread({
          onboardingId: applicationId,
          ownerId: application.ownerId,
          tenantId: application.tenantId,
          tenantName: input.tenant.name,
          tenantAvatar: input.tenant.avatar,
          ownerName: owner.name,
          propertyName: property?.title ?? input.propertyName,
          unit: property?.unit ?? 'Unit 1',
          address: property?.address ?? input.address,
          monthlyRent: property?.price ?? input.monthlyRent,
        })
        addNotification({
          userId: application.ownerId,
          role: 'owner',
          title: 'New tenant interest',
          description: `${input.tenant.name} is interested in ${input.propertyName}.`,
          action: 'review_application',
          relatedId: applicationId,
          important: false,
        })
      }
      return applicationId
    },
    scheduleVisit: (input, visit) => {
      const listingId = listingIdFor(input)
      if (!listingId) return ''
      const applicationId = usePrototypeStore.getState().showInterest(input.tenant.id, listingId) ?? ''
      if (applicationId) {
        usePrototypeStore.getState().scheduleVisit(applicationId, visit)
        const application = usePrototypeStore.getState().applications.find((item) => item.id === applicationId)
        if (application) addNotification({
          userId: application.ownerId,
          role: 'owner',
          title: 'Visit scheduled',
          description: `${input.tenant.name} scheduled ${input.propertyName} for ${visit.date} at ${visit.time}.`,
          action: 'review_application',
          relatedId: applicationId,
          important: false,
        })
      }
      return applicationId
    },
    confirmPropertyVisit: (id, completed) => {
      if (!completed) return
      setApplicationStatus(id, 'awaiting_owner_approval')
    },
    processDueOwnerApprovals: () => {
      usePrototypeStore.getState().applications
        .filter((item) => item.status === 'awaiting_owner_approval')
        .forEach((item) => usePrototypeStore.getState().approveTenant(item.id))
    },
    requestLeaseAgreement: (id) => {
      const application = usePrototypeStore.getState().applications.find((item) => item.id === id)
      if (!application) return
      setApplicationStatus(id, 'agreement_requested')
      addNotification({
        userId: application.ownerId,
        role: 'owner',
        title: 'Lease agreement requested',
        description: 'The tenant requested the rental agreement.',
        action: 'review_application',
        relatedId: id,
        important: true,
      })
    },
    approveTenant: (id) => {
      const application = usePrototypeStore.getState().applications.find((item) => item.id === id)
      usePrototypeStore.getState().approveTenant(id)
      if (application) addNotification({
        userId: application.tenantId,
        role: 'tenant',
        title: 'Application approved',
        description: 'The owner approved your rental application.',
        action: 'review_application',
        relatedId: id,
        important: true,
      })
    },
    rejectTenant: (id) => {
      const application = usePrototypeStore.getState().applications.find((item) => item.id === id)
      usePrototypeStore.getState().rejectTenant(id)
      if (application) addNotification({ userId: application.tenantId, role: 'tenant', title: 'Application update', description: 'The owner did not proceed with this rental application.', action: 'review_application', relatedId: id, important: false })
    },
    sendAgreement: (id, terms) => {
      const application = usePrototypeStore.getState().applications.find((item) => item.id === id)
      usePrototypeStore.getState().sendAgreement(id, terms)
      if (application) addNotification({
        userId: application.tenantId,
        role: 'tenant',
        title: 'Rental agreement ready',
        description: 'Your rental agreement is ready for review and signature.',
        action: 'review_agreement',
        relatedId: id,
        important: true,
      })
    },
    requestAgreementChanges: (id, comment) => usePrototypeStore.getState().requestAgreementChanges(id, comment),
    approveAgreement: (id, signature) => usePrototypeStore.getState().approveAgreement(id, signature),
    completeOnboardingPayment: (id, method, refId) => {
      const application = usePrototypeStore.getState().applications.find((item) => item.id === id)
      usePrototypeStore.getState().completeOnboardingPayment(id, { method, refId })
      if (application) addNotification({
        userId: application.ownerId,
        role: 'owner',
        title: 'Onboard tenant?',
        description: 'The tenant completed rent and security deposit payment.',
        action: 'onboard',
        relatedId: id,
        important: true,
      })
    },
    confirmTenantOnboarding: (id) => {
      const application = usePrototypeStore.getState().applications.find((item) => item.id === id)
      usePrototypeStore.getState().confirmTenantOnboarding(id)
      if (application) addNotification({
        userId: application.tenantId,
        role: 'tenant',
        title: 'Lease activated',
        description: 'Your owner completed onboarding. Lease access is active.',
        action: 'view_lease',
        relatedId: id,
        important: true,
      })
    },
    initiateLeaseExit: (leaseId, input) => usePrototypeStore.getState().initiateLeaseExit(leaseId, input),
    setEarlyExitPenalty: (leaseId, penaltyAmount) => usePrototypeStore.getState().setEarlyExitPenalty(leaseId, penaltyAmount),
    payEarlyExitPenalty: (leaseId, paymentInput) => usePrototypeStore.getState().payEarlyExitPenalty(leaseId, paymentInput),
    scheduleExitInspection: (leaseId, visit) => usePrototypeStore.getState().scheduleExitInspection(leaseId, visit),
    settleExitRefund: (leaseId, input) => usePrototypeStore.getState().settleExitRefund(leaseId, input),
    markNotificationRead: (id) => usePrototypeStore.getState().markNotificationRead(id),
    toggleNotificationImportant: (id) => usePrototypeStore.setState((current) => ({
      notifications: current.notifications.map((notification) =>
        notification.id === id ? { ...notification, important: !notification.important } : notification,
      ),
    })),
    resetOnboardingDemo: () => usePrototypeStore.getState().resetPrototypeSession(),
  }
}

export function useOnboardingStore<T>(selector: (state: OnboardingState) => T): T {
  const state = usePrototypeStore()
  return selector(bridgeState(state))
}
