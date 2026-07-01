import { useMemo } from 'react'
import { useAuth } from '@shared/hooks/useAuth'
import { toBrokerAssignedProperty } from '@shared/store/prototypeAdapters'
import { usePrototypeStore } from '@shared/store/prototypeStore'

export function useBrokerPrototype() {
  const { user } = useAuth()
  const brokerId = user?.id ?? ''
  const state = usePrototypeStore()

  return useMemo(() => {
    const assignmentByListing = new Map(
      state.brokerAssignments
        .filter((assignment) => assignment.brokerId === brokerId && assignment.status === 'Active')
        .map((assignment) => [assignment.listingId, assignment]),
    )
    const bundles = state.listings.flatMap((listing) => {
      const property = state.properties.find((item) => item.id === listing.propertyId)
      const owner = state.users.find((item) => item.id === listing.ownerId)
      if (!property || !owner) return []
      return [{ listing, property, owner, brokerAssignment: assignmentByListing.get(listing.id) }]
    })
    const assignedBundles = bundles.filter((bundle) => bundle.brokerAssignment)
    const assignedPropertyIds = new Set(assignedBundles.map((bundle) => bundle.property.id))

    return {
      brokerId,
      assignedBundles,
      assignedProperties: assignedBundles.map(toBrokerAssignedProperty),
      suggestedBundles: bundles.filter(
        (bundle) => bundle.listing.status === 'Active' && !assignedPropertyIds.has(bundle.property.id),
      ),
      leads: state.applications.filter((application) => application.brokerId === brokerId),
      requests: state.adminRequests.filter((request) => request.requesterId === brokerId),
      notifications: state.notifications.filter(
        (notification) =>
          notification.userId === brokerId ||
          notification.role === 'broker' ||
          notification.role === 'all',
      ),
      chats: state.chats.filter((thread) => thread.participantIds.includes(brokerId)),
      commissions: state.payments.filter(
        (payment) => payment.brokerId === brokerId && payment.category === 'COMMISSION',
      ),
      users: state.users,
      properties: state.properties,
      requestAccess: (propertyId: string) => state.requestBrokerListingAccess(brokerId, propertyId),
      requestRemoval: (listingId: string, reason: string) =>
        state.requestBrokerListingRemoval(brokerId, listingId, reason),
      sendMessage: (threadId: string, text: string) =>
        state.sendChatMessage(threadId, brokerId, text),
      markNotificationRead: state.markNotificationRead,
    }
  }, [brokerId, state])
}
