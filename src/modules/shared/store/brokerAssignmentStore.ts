/**
 * brokerAssignmentStore — bridge store for the Owner ↔ Broker assignment workflow.
 *
 * Mirrors the pattern of useOnboardingStore:
 * - Reads from usePrototypeStore (single source of truth)
 * - Derives a rich view model on every render
 * - Exposes typed action wrappers so UI components stay logic-free
 */

import { usePrototypeStore } from './prototypeStore'
import {
  selectOwnerActiveBrokers,
  selectOwnerBrokerRequests,
  selectBrokerAssignmentsForBroker,
  selectBrokerCommissions,
  type BrokerAssignmentBundle,
} from './prototypeSelectors'
import type { PrototypePayment } from '@shared/types/prototype'

// ─── View models ─────────────────────────────────────────────────────────────

export interface OwnerBrokerState {
  pendingRequests: BrokerAssignmentBundle[]
  activeBrokers: BrokerAssignmentBundle[]
  approveBrokerAssignment: (assignmentId: string) => void
  rejectBrokerAssignment: (assignmentId: string) => void
  releaseBrokerAssignment: (assignmentId: string) => void
}

export interface BrokerAssignmentState {
  assignments: BrokerAssignmentBundle[]
  commissions: PrototypePayment[]
  requestAssignment: (propertyId: string) => string | null
  releaseSelf: (assignmentId: string) => void
}

// ─── Owner-facing hook ───────────────────────────────────────────────────────

/** Used by OwnerBrokerManagement page */
export function useOwnerBrokerStore(ownerId: string): OwnerBrokerState {
  const store = usePrototypeStore()

  return {
    pendingRequests: selectOwnerBrokerRequests(ownerId),
    activeBrokers: selectOwnerActiveBrokers(ownerId),
    approveBrokerAssignment: store.approveBrokerAssignment,
    rejectBrokerAssignment: store.rejectBrokerAssignment,
    releaseBrokerAssignment: store.releaseBrokerAssignment,
  }
}

// ─── Broker-facing hook ──────────────────────────────────────────────────────

/** Used by BrokerListings / BrokerAssignedProperties pages */
export function useBrokerAssignmentStore(brokerId: string): BrokerAssignmentState {
  const store = usePrototypeStore()

  return {
    assignments: selectBrokerAssignmentsForBroker(brokerId),
    commissions: selectBrokerCommissions(brokerId),
    requestAssignment: (propertyId: string) =>
      store.requestBrokerAssignment(brokerId, propertyId),
    releaseSelf: store.releaseBrokerAssignment,
  }
}
