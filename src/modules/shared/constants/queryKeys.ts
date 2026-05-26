import type { UserRole } from './roles'

/**
 * Build TanStack Query keys scoped by active role to avoid cross-mode cache bleed.
 */
export const queryKeys = {
  all: (activeRole: UserRole | null) => ['rentilo', activeRole ?? 'guest'] as const,
  tenant: {
    listings: (activeRole: UserRole | null) =>
      [...queryKeys.all(activeRole), 'tenant', 'listings'] as const,
    saved: (activeRole: UserRole | null) =>
      [...queryKeys.all(activeRole), 'tenant', 'saved'] as const,
  },
  owner: {
    properties: (activeRole: UserRole | null) =>
      [...queryKeys.all(activeRole), 'owner', 'properties'] as const,
  },
}
