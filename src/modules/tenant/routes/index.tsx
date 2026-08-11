import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import { ROUTES } from '@shared/constants/routes'
import { ListingsPage } from '../pages/ListingsPage'
import { PropertyDetailsPage } from '../pages/PropertyDetailsPage'
import { SavedPropertiesPage } from '../pages/SavedPropertiesPage'
import { EditProfilePage } from '../pages/EditProfilePage'
import { TenantDashboard } from '../pages/TenantDashboard'
import { TenantProperties } from '../pages/TenantProperties'
import { TenantPayments } from '../pages/TenantPayments'
import { TenantMaintenance } from '../pages/TenantMaintenance'
import { TenantDocuments } from '../pages/TenantDocuments'
import { NotificationsPage } from '../pages/NotificationsPage'
import { MessagesPage } from '../pages/MessagesPage'
import { SeriousBuyerBadgePage } from '../pages/SeriousBuyerBadgePage'
import { SeriousBuyerPaymentPage } from '../pages/SeriousBuyerPaymentPage'
import { TenantAgreementReview } from '../pages/TenantAgreementReview'
import { TenantOnboardingPayment } from '../pages/TenantOnboardingPayment'
import { TenantMyLease } from '../pages/TenantMyLease'
import { TenantExitNotice } from '../pages/TenantExitNotice'
import { TenantMaintenanceDetail } from '../pages/TenantMaintenanceDetail'
import { TenantSupport } from '../pages/TenantSupport'
import { PaymentReceiptPage } from '@shared/pages/PaymentReceiptPage'
import { TenantHomeBackBar } from '../components/TenantHomeBackBar'

function TenantPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 w-full max-w-[1200px] mx-auto px-8 py-8 font-body">
      <TenantHomeBackBar />
      {children}
    </div>
  )
}

export const tenantRoutes: RouteObject[] = [
  { index: true, element: <Navigate to={ROUTES.TENANT.LISTINGS} replace /> },
  { path: 'listings', element: <ListingsPage /> },
  { path: 'properties/:id', element: <PropertyDetailsPage /> },
  { path: 'saved', element: <SavedPropertiesPage /> },
  { path: 'notifications', element: <NotificationsPage /> },
  { path: 'messages', element: <MessagesPage /> },
  { path: 'support', element: <TenantSupport /> },
  { path: 'serious-buyer-badge', element: <SeriousBuyerBadgePage /> },
  { path: 'serious-buyer-badge/payment', element: <SeriousBuyerPaymentPage /> },
  { path: 'profile', element: <EditProfilePage /> },
  {
    path: 'dashboard',
    element: (
      <TenantPageShell>
        <TenantDashboard />
      </TenantPageShell>
    ),
  },
  {
    path: 'properties',
    element: (
      <TenantPageShell>
        <TenantProperties />
      </TenantPageShell>
    ),
  },
  {
    path: 'payments',
    element: (
      <TenantPageShell>
        <TenantPayments />
      </TenantPageShell>
    ),
  },
  {
    path: 'payments/:paymentId',
    element: (
      <TenantPageShell>
        <PaymentReceiptPage backRoute={ROUTES.TENANT.PAYMENTS} backLabel="Back to Payments" audience="tenant" />
      </TenantPageShell>
    ),
  },
  {
    path: 'maintenance',
    element: (
      <TenantPageShell>
        <TenantMaintenance />
      </TenantPageShell>
    ),
  },
  {
    path: 'maintenance/:ticketId',
    element: (
      <TenantPageShell>
        <TenantMaintenanceDetail />
      </TenantPageShell>
    ),
  },
  {
    path: 'documents',
    element: (
      <TenantPageShell>
        <TenantDocuments />
      </TenantPageShell>
    ),
  },
  {
    path: 'agreements/:onboardingId',
    element: (
      <TenantPageShell>
        <TenantAgreementReview />
      </TenantPageShell>
    ),
  },
  {
    path: 'onboarding/:onboardingId/payment',
    element: (
      <TenantPageShell>
        <TenantOnboardingPayment />
      </TenantPageShell>
    ),
  },
  {
    path: 'my-lease',
    element: (
      <TenantPageShell>
        <TenantMyLease />
      </TenantPageShell>
    ),
  },
  {
    path: 'exit-notice',
    element: (
      <TenantPageShell>
        <TenantExitNotice />
      </TenantPageShell>
    ),
  },]
