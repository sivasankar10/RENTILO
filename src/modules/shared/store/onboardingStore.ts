import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { usePaymentsStore } from '@shared/store/paymentsStore'
import { useOwnerStore } from '@modules/owner/store/ownerStore'

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

/** Ordered pipeline for progress UI and comparisons */
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
  const index = ONBOARDING_STATUS_ORDER.indexOf(status)
  const minIndex = ONBOARDING_STATUS_ORDER.indexOf(PROGRESS_PANEL_MIN_STATUS)
  return index >= minIndex
}

export function statusIndex(status: OnboardingStatus): number {
  return ONBOARDING_STATUS_ORDER.indexOf(status)
}

/** Tenant may open the agreement page only after the owner has sent a version. */
export function tenantCanViewAgreement(record: OnboardingRecord | undefined): boolean {
  if (!record || record.agreementVersions.length === 0) return false
  return (
    record.status === 'agreement_sent' ||
    ['agreement_approved', 'payment_completed', 'active'].includes(record.status)
  )
}

export function getOwnerLeaseForProperty(
  records: OnboardingRecord[],
  ownerId: string,
  ownerPropertyId: string,
  statuses: OnboardingStatus[] = ['active'],
) {
  return records.find(
    (record) =>
      record.owner.id === ownerId &&
      record.ownerPropertyId === ownerPropertyId &&
      statuses.includes(record.status),
  )
}

export interface OnboardingParty {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
}

export interface AgreementTerms {
  startDate: string
  endDate: string
  monthlyRent: string
  securityDeposit: string
  noticePeriod: string
  utilities: string
  maintenanceResponsibility: string
  petPolicy: string
  specialClauses: string
  ownerSignature: string
}

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

const AUTO_APPROVE_MS = 5000

export const DEMO_TENANT: OnboardingParty = {
  id: 'demo-tenant-1',
  name: 'Priya Nair',
  email: 'priya.nair@example.com',
  phone: '+91 98765 43210',
  avatar: 'https://i.pravatar.cc/96?img=47',
}

export const DEMO_OWNER: OnboardingParty = {
  id: 'demo-owner-1',
  name: 'Rajesh Kumar',
  email: 'rajesh.kumar@example.com',
  phone: '+91 98400 22110',
  avatar: 'https://i.pravatar.cc/96?img=12',
}

const PROPERTY_BRIDGE: Record<string, { ownerPropertyId: string; ownerPropertyName: string; unit: string }> = {
  'prop-1': { ownerPropertyId: 'opus-tower-14b', ownerPropertyName: 'The Opus Tower, 14B', unit: 'Unit 14B' },
  'prop-2': { ownerPropertyId: 'parkview-residences', ownerPropertyName: 'Parkview Residences', unit: 'Villa 2' },
  'prop-3': { ownerPropertyId: 'modern-penthouse-suite', ownerPropertyName: 'Modern Penthouse Suite', unit: 'Unit 15A' },
}

const now = () => new Date().toISOString()
const displayDate = () => new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })

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
    ownerSignature: DEMO_OWNER.name,
  }
}

function notification(
  audience: OnboardingNotification['audience'],
  onboardingId: string,
  title: string,
  description: string,
  action: OnboardingNotification['action'],
): OnboardingNotification {
  return {
    id: `onboarding-notification-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    audience,
    onboardingId,
    title,
    description,
    action,
    createdAt: displayDate(),
    unread: true,
    important: action === 'onboard' || action === 'review_agreement',
  }
}

function updateRecord(
  records: OnboardingRecord[],
  id: string,
  status: OnboardingStatus,
  patch: Partial<OnboardingRecord> = {},
) {
  const timestamp = now()
  return records.map((record) =>
    record.id === id
      ? {
          ...record,
          ...patch,
          status,
          updatedAt: timestamp,
          timeline: { ...record.timeline, [status]: timestamp },
        }
      : record,
  )
}

function findActiveRecord(records: OnboardingRecord[], tenantId: string, propertyId: string) {
  return records.find(
    (record) =>
      record.tenant.id === tenantId &&
      record.tenantPropertyId === propertyId &&
      record.status !== 'rejected',
  )
}

function buildRecord(
  input: PropertyApplicationInput,
  status: OnboardingStatus,
  patch: Partial<OnboardingRecord> = {},
): OnboardingRecord {
  const bridge = PROPERTY_BRIDGE[input.tenantPropertyId] ?? {
    ownerPropertyId: input.tenantPropertyId,
    ownerPropertyName: input.propertyName,
    unit: 'Unit 1',
  }
  const timestamp = now()
  return {
    id: `onboarding-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    tenantPropertyId: input.tenantPropertyId,
    ownerPropertyId: bridge.ownerPropertyId,
    propertyName: input.propertyName,
    ownerPropertyName: bridge.ownerPropertyName,
    unit: bridge.unit,
    address: input.address,
    monthlyRent: input.monthlyRent,
    securityDeposit: input.securityDeposit,
    tenant: input.tenant,
    owner: DEMO_OWNER,
    status,
    createdAt: timestamp,
    updatedAt: timestamp,
    timeline: { [status]: timestamp },
    agreementVersions: [],
    ...patch,
  }
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
  markNotificationRead: (notificationId: string) => void
  toggleNotificationImportant: (notificationId: string) => void
  resetOnboardingDemo: () => void
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      records: [],
      notifications: [],

      showInterest: (input) => {
        const existing = findActiveRecord(get().records, input.tenant.id, input.tenantPropertyId)
        if (existing) return existing.id

        const record = buildRecord(input, 'interest_shown')
        set((state) => ({
          records: [record, ...state.records],
          notifications: [
            notification(
              'owner',
              record.id,
              'New tenant interest',
              `Profile named ${input.tenant.name} shown interest on ur property ${input.propertyName}.`,
              'review_application',
            ),
            ...state.notifications,
          ],
        }))
        return record.id
      },

      scheduleVisit: (input, visit) => {
        const existing = findActiveRecord(get().records, input.tenant.id, input.tenantPropertyId)
        const timestamp = now()

        if (existing) {
          set((state) => ({
            records: updateRecord(state.records, existing.id, 'visit_scheduled', {
              scheduledVisit: visit,
              timeline: {
                ...existing.timeline,
                interest_shown: existing.timeline.interest_shown ?? timestamp,
                visit_scheduled: timestamp,
              },
            }),
          }))
          return existing.id
        }

        const record = buildRecord(input, 'visit_scheduled', {
          scheduledVisit: visit,
          timeline: { interest_shown: timestamp, visit_scheduled: timestamp },
        })
        set((state) => ({ records: [record, ...state.records] }))
        return record.id
      },

      confirmPropertyVisit: (id, completed) => {
        if (!completed) return

        const dueAt = new Date(Date.now() + AUTO_APPROVE_MS).toISOString()
        set((state) => ({
          records: updateRecord(state.records, id, 'awaiting_owner_approval', {
            ownerApprovalDueAt: dueAt,
            timeline: {
              ...state.records.find((r) => r.id === id)?.timeline,
              visit_confirmed: now(),
              awaiting_owner_approval: now(),
            },
          }),
        }))
      },

      processDueOwnerApprovals: () => {
        const dueRecords = get().records.filter(
          (record) =>
            record.status === 'awaiting_owner_approval' &&
            record.ownerApprovalDueAt &&
            Date.now() >= new Date(record.ownerApprovalDueAt).getTime(),
        )
        dueRecords.forEach((record) => get().approveTenant(record.id))
      },

      requestLeaseAgreement: (id) => {
        const record = get().records.find((item) => item.id === id)
        if (!record || record.status !== 'owner_approved') return
        set((state) => ({
          records: updateRecord(state.records, id, 'agreement_requested', {
            timeline: {
              ...record.timeline,
              agreement_requested: now(),
            },
          }),
          notifications: [
            notification(
              'owner',
              id,
              'Lease agreement requested',
              `${record.tenant.name} requested the rental agreement for ${record.propertyName}. Send the agreement when ready.`,
              'review_application',
            ),
            ...state.notifications,
          ],
        }))
      },

      approveTenant: (id) =>
        set((state) => {
          const record = state.records.find((item) => item.id === id)
          if (!record || record.status !== 'awaiting_owner_approval') return state
          return {
            records: updateRecord(state.records, id, 'owner_approved', {
              ownerApprovalDueAt: undefined,
            }),
            notifications: [
              notification(
                'tenant',
                id,
                'Application approved',
                `${record.owner.name} approved your application for ${record.propertyName}.`,
                'review_application',
              ),
              ...state.notifications,
            ],
          }
        }),

      rejectTenant: (id) => set((state) => ({ records: updateRecord(state.records, id, 'rejected') })),

      sendAgreement: (id, terms) =>
        set((state) => {
          const record = state.records.find((item) => item.id === id)
          if (
            !record ||
            !['owner_approved', 'agreement_requested', 'changes_requested'].includes(record.status)
          ) {
            return state
          }
          const version: AgreementVersion = {
            ...terms,
            id: `agreement-${id}-v${record.agreementVersions.length + 1}`,
            version: record.agreementVersions.length + 1,
            sentAt: displayDate(),
          }
          return {
            records: updateRecord(state.records, id, 'agreement_sent', {
              agreementVersions: [...record.agreementVersions, version],
            }),
            notifications: [
              notification(
                'tenant',
                id,
                'Rental agreement ready',
                `Version ${version.version} for ${record.propertyName} is ready for review.`,
                'review_agreement',
              ),
              ...state.notifications,
            ],
          }
        }),

      requestAgreementChanges: (id, comment) =>
        set((state) => {
          const record = state.records.find((item) => item.id === id)
          const trimmed = comment.trim()
          if (
            !record ||
            record.status !== 'agreement_sent' ||
            !record.agreementVersions.length ||
            trimmed.length < 10
          ) {
            return state
          }
          const latestId = record.agreementVersions[record.agreementVersions.length - 1]!.id
          return {
            records: updateRecord(state.records, id, 'changes_requested', {
              agreementVersions: record.agreementVersions.map((version) =>
                version.id === latestId ? { ...version, changeRequest: trimmed } : version,
              ),
            }),
            notifications: [
              notification(
                'owner',
                id,
                'Agreement changes requested',
                `${record.tenant.name} requested changes to the rental agreement.`,
                'review_application',
              ),
              ...state.notifications,
            ],
          }
        }),

      approveAgreement: (id, tenantSignature) =>
        set((state) => {
          const record = state.records.find((item) => item.id === id)
          const trimmed = tenantSignature.trim()
          if (
            !record ||
            record.status !== 'agreement_sent' ||
            !record.agreementVersions.length ||
            trimmed.length < 2
          ) {
            return state
          }
          const latestId = record.agreementVersions[record.agreementVersions.length - 1]!.id
          return {
            records: updateRecord(state.records, id, 'agreement_approved', {
              agreementVersions: record.agreementVersions.map((version) =>
                version.id === latestId
                  ? { ...version, tenantSignature: trimmed, tenantApprovedAt: displayDate() }
                  : version,
              ),
            }),
            notifications: [
              notification(
                'owner',
                id,
                'Agreement approved by tenant',
                `${record.tenant.name} approved and signed the agreement.`,
                'review_application',
              ),
              notification(
                'tenant',
                id,
                'Complete onboarding payment',
                `Pay the first month and deposit for ${record.propertyName}.`,
                'pay',
              ),
              ...state.notifications,
            ],
          }
        }),

      completeOnboardingPayment: (id, method, refId = '') =>
        set((state) => {
          const record = state.records.find((item) => item.id === id)
          if (!record || record.status !== 'agreement_approved') return state
          const transactionId = `RTL-ONB-${Date.now()}`
          const leaseId = `LSE-${Date.now().toString().slice(-6)}`
          const amount = `${record.monthlyRent} + ${record.securityDeposit}`

          usePaymentsStore.getState().recordOnboardingPayments({
            onboardingId: record.id,
            leaseId,
            tenantId: record.tenant.id,
            tenantName: record.tenant.name,
            ownerPropertyId: record.ownerPropertyId,
            propertyName: record.propertyName,
            unit: record.unit,
            monthlyRent: record.monthlyRent,
            securityDeposit: record.securityDeposit,
            method,
            refId,
            transactionId,
          })

          useOwnerStore.getState().releaseBrokerForProperty(record.ownerPropertyId)

          return {
            records: updateRecord(state.records, id, 'payment_completed', {
              payment: {
                transactionId,
                amount,
                method,
                paidAt: displayDate(),
              },
              lease: {
                id: leaseId,
                status: 'pending_owner_onboarding',
              },
            }),
            notifications: [
              notification(
                'owner',
                id,
                'Onboard tenant?',
                `${record.tenant.name} completed payment for ${record.propertyName}.`,
                'onboard',
              ),
              ...state.notifications,
            ],
          }
        }),

      confirmTenantOnboarding: (id) =>
        set((state) => {
          const record = state.records.find((item) => item.id === id)
          if (!record || !record.lease || record.lease.status === 'active') return state
          return {
            records: updateRecord(state.records, id, 'active', {
              lease: {
                ...record.lease,
                status: 'active',
                activatedAt: displayDate(),
                accessKey: `KEY-${record.unit.replace(/\W/g, '').toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
              },
            }),
            notifications: [
              notification(
                'tenant',
                id,
                'Tenant onboarding complete',
                `${record.propertyName} is now your active lease.`,
                'view_lease',
              ),
              ...state.notifications,
            ],
          }
        }),

      markNotificationRead: (notificationId) =>
        set((state) => ({
          notifications: state.notifications.map((item) =>
            item.id === notificationId ? { ...item, unread: false } : item,
          ),
        })),

      toggleNotificationImportant: (notificationId) =>
        set((state) => ({
          notifications: state.notifications.map((item) =>
            item.id === notificationId ? { ...item, important: !item.important } : item,
          ),
        })),

      resetOnboardingDemo: () => set({ records: [], notifications: [] }),
    }),
    {
      name: 'rentilo-onboarding-session',
      storage: createJSONStorage(() => sessionStorage),
      version: 2,
      migrate: () => ({ records: [], notifications: [] }),
    },
  ),
)
