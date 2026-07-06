import { usePrototypeStore, type PrototypeState } from '@shared/store/prototypeStore'
import { PROTOTYPE_USER_IDS } from '@shared/data/prototypeSeed'

export type PaymentStatus = 'Successful' | 'Pending' | 'Failed'
export type PaymentCategory =
  | 'RENT'
  | 'SECURITY DEPOSIT'
  | 'UTILITY BILL'
  | 'MAINTENANCE'
  | 'PREMIUM'
  | 'OTHER'
export type PaymentFlow = 'tenant_to_owner' | 'owner_outgoing'

export interface PlatformPayment {
  id: string
  onboardingId?: string
  leaseId?: string
  tenantId?: string
  tenantName?: string
  ownerId: string
  ownerName: string
  propertyId?: string
  propertyName?: string
  unit?: string
  category: PaymentCategory
  amount: number
  amountDisplay: string
  txnId: string
  refId: string
  method: string
  status: PaymentStatus
  flow: PaymentFlow
  counterparty: string
  paidAt: string
  paidAtIso: string
  description?: string
}

export function parseMoney(value: string): number {
  return Number(value.replace(/[^\d.]/g, '')) || 0
}

function currency(amount: number) {
  return `Rs. ${amount.toLocaleString('en-IN')}`
}

function mapPayments(state: PrototypeState): PlatformPayment[] {
  return state.payments
    .filter((payment) => payment.flow !== 'platform_to_broker')
    .map((payment) => {
      const tenant = state.users.find((item) => item.id === payment.tenantId)
      const owner = state.users.find((item) => item.id === payment.ownerId)
      const property = state.properties.find((item) => item.id === payment.propertyId)
      return {
        id: payment.id,
        onboardingId: payment.applicationId,
        leaseId: payment.leaseId,
        tenantId: payment.tenantId,
        tenantName: tenant ? `${tenant.firstName} ${tenant.lastName}` : undefined,
        ownerId: payment.ownerId,
        ownerName: owner ? `${owner.firstName} ${owner.lastName}` : payment.ownerId,
        propertyId: payment.propertyId,
        propertyName: property?.title,
        unit: property?.unit,
        category: payment.category === 'COMMISSION' ? 'OTHER' : payment.category,
        amount: payment.amount,
        amountDisplay: payment.amountDisplay,
        txnId: payment.txnId,
        refId: payment.refId,
        method: payment.method,
        status: payment.status === 'Refunded' ? 'Failed' : payment.status,
        flow: payment.flow === 'owner_outgoing' ? 'owner_outgoing' : 'tenant_to_owner',
        counterparty: payment.counterparty,
        paidAt: payment.paidAt,
        paidAtIso: payment.paidAtIso,
        description: payment.description,
      }
    })
}

interface OnboardingPaymentInput {
  onboardingId: string
  leaseId?: string
  tenantId: string
  tenantName: string
  ownerPropertyId: string
  propertyName: string
  unit: string
  monthlyRent: string
  securityDeposit: string
  method: string
  refId?: string
  transactionId: string
}

interface TenantPaymentInput {
  tenantId: string
  tenantName: string
  ownerId?: string
  ownerName?: string
  propertyId?: string
  propertyName?: string
  unit?: string
  to: string
  category: PaymentCategory
  amount: number
  method: string
  refId?: string
}

interface OwnerOutgoingInput {
  ownerId?: string
  ownerName?: string
  category?: PaymentCategory
  amount: number
  amountDisplay: string
  method: string
  description: string
  refId?: string
}

interface PaymentsState {
  payments: PlatformPayment[]
  recordOnboardingPayments: (input: OnboardingPaymentInput) => void
  addTenantPayment: (input: TenantPaymentInput) => void
  addOwnerOutgoingPayment: (input: OwnerOutgoingInput) => void
  resetPayments: () => void
}

function addPayment(input: {
  applicationId?: string
  leaseId?: string
  tenantId?: string
  ownerId: string
  propertyId?: string
  category: PaymentCategory
  amount: number
  amountDisplay?: string
  method: string
  refId?: string
  flow: PaymentFlow
  counterparty: string
  description?: string
}) {
  const stamp = Date.now()
  usePrototypeStore.getState().addPayment({
    applicationId: input.applicationId,
    leaseId: input.leaseId,
    tenantId: input.tenantId,
    ownerId: input.ownerId,
    propertyId: input.propertyId,
    category: input.category,
    amount: input.amount,
    amountDisplay: input.amountDisplay ?? currency(input.amount),
    txnId: `RTL-${stamp}`,
    refId: input.refId?.trim() || String(stamp).slice(-6),
    method: input.method,
    status: 'Successful',
    flow: input.flow,
    counterparty: input.counterparty,
    description: input.description,
  })
}

function bridgeState(state: PrototypeState): PaymentsState {
  return {
    payments: mapPayments(state),
    recordOnboardingPayments: (input) => {
      const application = usePrototypeStore.getState().applications.find((item) => item.id === input.onboardingId)
      if (application && !usePrototypeStore.getState().payments.some((item) => item.applicationId === input.onboardingId)) {
        usePrototypeStore.getState().completeOnboardingPayment(input.onboardingId, {
          method: input.method,
          refId: input.refId,
        })
      }
    },
    addTenantPayment: (input) => addPayment({
      tenantId: input.tenantId,
      ownerId: input.ownerId ?? PROTOTYPE_USER_IDS.multiPropertyOwner,
      propertyId: input.propertyId,
      category: input.category,
      amount: input.amount,
      method: input.method,
      refId: input.refId,
      flow: 'tenant_to_owner',
      counterparty: input.tenantId.startsWith('manual-')
        ? input.tenantName
        : input.to.trim() || input.ownerName || 'Property owner',
      description: input.propertyName ? `Payment for ${input.propertyName}` : undefined,
    }),
    addOwnerOutgoingPayment: (input) => addPayment({
      ownerId: input.ownerId ?? PROTOTYPE_USER_IDS.multiPropertyOwner,
      category: input.category ?? 'PREMIUM',
      amount: input.amount,
      amountDisplay: input.amountDisplay,
      method: input.method,
      refId: input.refId,
      flow: 'owner_outgoing',
      counterparty: 'Rentilo Platform',
      description: input.description,
    }),
    resetPayments: () => usePrototypeStore.setState({ payments: [] }),
  }
}

function usePaymentsStoreHook<T>(selector: (state: PaymentsState) => T): T {
  const state = usePrototypeStore()
  return selector(bridgeState(state))
}

export const usePaymentsStore = Object.assign(usePaymentsStoreHook, {
  getState: () => bridgeState(usePrototypeStore.getState()),
})

export function getTenantPayments(tenantId: string) {
  return mapPayments(usePrototypeStore.getState()).filter(
    (payment) => payment.tenantId === tenantId && payment.flow === 'tenant_to_owner',
  )
}

export function getOwnerReceivedPayments(ownerId: string) {
  return mapPayments(usePrototypeStore.getState()).filter(
    (payment) => payment.ownerId === ownerId && payment.flow === 'tenant_to_owner',
  )
}

export function getOwnerSentPayments(ownerId: string) {
  return mapPayments(usePrototypeStore.getState()).filter(
    (payment) => payment.ownerId === ownerId && payment.flow === 'owner_outgoing',
  )
}
