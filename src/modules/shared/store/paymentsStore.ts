import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const DEFAULT_OWNER = { id: 'demo-owner-1', name: 'Rajesh Kumar' }

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
  /** Recipient label shown on tenant payment history */
  counterparty: string
  paidAt: string
  paidAtIso: string
  description?: string
}

export function parseMoney(value: string): number {
  return Number(value.replace(/[^\d.]/g, '')) || 0
}

function formatCurrency(amount: number, fallback = ''): string {
  if (fallback.startsWith('$') || fallback.startsWith('₹')) return fallback
  return `₹${amount.toLocaleString('en-IN')}`
}

function paidTimestamp(iso = new Date().toISOString()) {
  const date = new Date(iso)
  return {
    iso,
    display: date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    date: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
  }
}

function buildPayment(
  partial: Omit<PlatformPayment, 'id' | 'paidAt' | 'paidAtIso'> & { paidAtIso?: string },
): PlatformPayment {
  const stamp = paidTimestamp(partial.paidAtIso)
  return {
    ...partial,
    id: `pay-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    paidAt: stamp.display,
    paidAtIso: stamp.iso,
  }
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

export const usePaymentsStore = create<PaymentsState>()(
  persist(
    (set, get) => ({
      payments: [],

      recordOnboardingPayments: (input) => {
        const stamp = paidTimestamp()
        const ref = input.refId?.trim() || 'ONBOARDING'
        const rentAmount = parseMoney(input.monthlyRent)
        const depositAmount = parseMoney(input.securityDeposit)
        const ownerId = DEFAULT_OWNER.id
        const ownerName = DEFAULT_OWNER.name

        const entries: PlatformPayment[] = [
          buildPayment({
            onboardingId: input.onboardingId,
            leaseId: input.leaseId,
            tenantId: input.tenantId,
            tenantName: input.tenantName,
            ownerId,
            ownerName,
            propertyId: input.ownerPropertyId,
            propertyName: input.propertyName,
            unit: input.unit,
            category: 'RENT',
            amount: rentAmount,
            amountDisplay: formatCurrency(rentAmount, input.monthlyRent),
            txnId: `${input.transactionId}-RENT`,
            refId: `${ref}-RENT`,
            method: input.method,
            status: 'Successful',
            flow: 'tenant_to_owner',
            counterparty: ownerName,
            description: `First month rent — ${input.propertyName}`,
            paidAtIso: stamp.iso,
          }),
          buildPayment({
            onboardingId: input.onboardingId,
            leaseId: input.leaseId,
            tenantId: input.tenantId,
            tenantName: input.tenantName,
            ownerId,
            ownerName,
            propertyId: input.ownerPropertyId,
            propertyName: input.propertyName,
            unit: input.unit,
            category: 'SECURITY DEPOSIT',
            amount: depositAmount,
            amountDisplay: formatCurrency(depositAmount, input.securityDeposit),
            txnId: `${input.transactionId}-DEP`,
            refId: `${ref}-DEP`,
            method: input.method,
            status: 'Successful',
            flow: 'tenant_to_owner',
            counterparty: ownerName,
            description: `Security deposit — ${input.propertyName}`,
            paidAtIso: stamp.iso,
          }),
        ]

        set({ payments: [...entries, ...get().payments] })
      },

      addTenantPayment: (input) => {
        const ownerId = input.ownerId ?? DEFAULT_OWNER.id
        const ownerName = input.ownerName ?? DEFAULT_OWNER.name
        const txnId = `RT-${Date.now().toString().slice(-7)}`
        const entry = buildPayment({
          tenantId: input.tenantId,
          tenantName: input.tenantName,
          ownerId,
          ownerName,
          propertyId: input.propertyId,
          propertyName: input.propertyName,
          unit: input.unit,
          category: input.category,
          amount: input.amount,
          amountDisplay: formatCurrency(input.amount),
          txnId,
          refId: input.refId?.trim() || txnId.slice(-4),
          method: input.method,
          status: 'Successful',
          flow: 'tenant_to_owner',
          counterparty: input.to.trim() || ownerName,
          description: input.propertyName ? `Payment for ${input.propertyName}` : undefined,
        })
        set({ payments: [entry, ...get().payments] })
      },

      addOwnerOutgoingPayment: (input) => {
        const ownerId = input.ownerId ?? DEFAULT_OWNER.id
        const ownerName = input.ownerName ?? DEFAULT_OWNER.name
        const txnId = `OWN-${Date.now().toString().slice(-7)}`
        const entry = buildPayment({
          ownerId,
          ownerName,
          category: input.category ?? 'PREMIUM',
          amount: input.amount,
          amountDisplay: input.amountDisplay,
          txnId,
          refId: input.refId?.trim() || txnId.slice(-4),
          method: input.method,
          status: 'Successful',
          flow: 'owner_outgoing',
          counterparty: 'Rentilo Platform',
          description: input.description,
        })
        set({ payments: [entry, ...get().payments] })
      },

      resetPayments: () => set({ payments: [] }),
    }),
    {
      name: 'rentilo-payments-session',
      storage: createJSONStorage(() => sessionStorage),
      version: 1,
    },
  ),
)

export function getTenantPayments(tenantId: string) {
  return usePaymentsStore
    .getState()
    .payments.filter((payment) => payment.tenantId === tenantId && payment.flow === 'tenant_to_owner')
}

export function getOwnerReceivedPayments(ownerId: string) {
  return usePaymentsStore
    .getState()
    .payments.filter((payment) => payment.ownerId === ownerId && payment.flow === 'tenant_to_owner')
}

export function getOwnerSentPayments(ownerId: string) {
  return usePaymentsStore
    .getState()
    .payments.filter((payment) => payment.ownerId === ownerId && payment.flow === 'owner_outgoing')
}
