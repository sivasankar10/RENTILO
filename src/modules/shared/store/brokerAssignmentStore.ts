/**
 * brokerAssignmentStore — bridge store for Owner/Broker read-only views of
 * Admin-managed broker assignments.
 *
 * IMPORTANT: Per the Broker↔Owner workflow rule, assignment is ALWAYS
 * initiated and decided by Admin (see prototypeStore.assignBroker /
 * requestBrokerListingAccess / decideAdminRequest). Owners and Brokers can
 * only READ their assignment state here — no approve/reject/request actions
 * belong in this store. Broker requests go through
 * useBrokerPrototype().requestAccess -> requestBrokerListingAccess (Admin-routed).
 */

import { useMemo } from 'react'
import { usePrototypeStore } from './prototypeStore'
import type { BrokerAssignment, PrototypePayment, PrototypeListing, PrototypeProperty, PrototypeUser } from '@shared/types/prototype'

// ─── View model ──────────────────────────────────────────────────────────────

export interface BrokerAssignmentBundle {
  assignment: BrokerAssignment
  broker: PrototypeUser
  property: PrototypeProperty
  listing: PrototypeListing
}

// ─── Internal helper ─────────────────────────────────────────────────────────

function buildBundle(
  assignment: BrokerAssignment,
  users: PrototypeUser[],
  properties: PrototypeProperty[],
  listings: PrototypeListing[],
): BrokerAssignmentBundle | null {
  const broker = users.find((u) => u.id === assignment.brokerId)
  const property = properties.find((p) => p.id === assignment.propertyId)
  const listing = listings.find((l) => l.id === assignment.listingId)
  if (!broker || !property || !listing) return null
  return { assignment, broker, property, listing }
}

// ─── Owner-facing hook (read-only) ───────────────────────────────────────────

export interface OwnerBrokerState {
  /** Brokers Admin has actively assigned to this owner's properties */
  activeBrokers: BrokerAssignmentBundle[]
}

/** Used by OwnerBrokerManagement — read-only, Admin owns the assignment lifecycle */
export function useOwnerBrokerStore(ownerId: string): OwnerBrokerState {
  const store = usePrototypeStore()

  const activeBrokers = useMemo(() =>
    store.brokerAssignments
      .filter((a) => a.ownerId === ownerId && a.status === 'Active')
      .map((a) => buildBundle(a, store.users, store.properties, store.listings))
      .filter((b): b is BrokerAssignmentBundle => b !== null),
    [ownerId, store.brokerAssignments, store.users, store.properties, store.listings],
  )

  return { activeBrokers }
}

// ─── Broker-facing hook (read-only) ──────────────────────────────────────────

export interface BrokerAssignmentState {
  /** Properties Admin has actively assigned to this broker */
  activeAssignments: BrokerAssignmentBundle[]
  commissions: PrototypePayment[]
}

/** Used by BrokerListings/BrokerAssignedProperties — read-only assignment state.
 *  To request new access, use useBrokerPrototype().requestAccess (Admin-routed). */
export function useBrokerAssignmentStore(brokerId: string): BrokerAssignmentState {
  const store = usePrototypeStore()

  const activeAssignments = useMemo(() =>
    store.brokerAssignments
      .filter((a) => a.brokerId === brokerId && a.status === 'Active')
      .map((a) => buildBundle(a, store.users, store.properties, store.listings))
      .filter((b): b is BrokerAssignmentBundle => b !== null),
    [brokerId, store.brokerAssignments, store.users, store.properties, store.listings],
  )

  const commissions = useMemo(() =>
    store.payments.filter((p) => p.brokerId === brokerId && p.category === 'COMMISSION'),
    [brokerId, store.payments],
  )

  return { activeAssignments, commissions }
}
