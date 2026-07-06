
# Tenant–Owner Onboarding Flow — Technical Reference

> **Purpose:** This document maps every step of the rental onboarding lifecycle in exhaustive technical detail — state shapes, store actions, cross-role effects, UI entry points, and side-effects. Use this as the canonical blueprint when building any new cross-role feature in Rentilo.

---

## 1. Architecture Overview

The app has **no backend**. All shared state lives in a single Zustand store called `usePrototypeStore`, persisted to `sessionStorage`. Every module reads from it through either:

- **Selectors** (`prototypeSelectors.ts`) — pure functions that query raw state
- **Adapters** (`prototypeAdapters.ts`) — converters from prototype types to module-local types
- **Bridge stores** — module-facing hooks that wrap `usePrototypeStore` with domain logic

```
┌─────────────────────────────────────────────────────────────┐
│                     sessionStorage                          │
│                  (Zustand persist layer)                     │
│                                                             │
│   usePrototypeStore   ←──────────── Single source of truth  │
│   PrototypeStateData:                                       │
│     users, properties, listings, brokerAssignments,         │
│     applications, leases, payments, chats,                  │
│     maintenanceTickets, notifications, adminRequests        │
└───────────┬─────────────────────────────────────────────────┘
            │
     ┌──────┴──────────────────────────────────┐
     │         Bridge / Facade Layer            │
     │                                          │
     │  useOnboardingStore  (tenant + owner UI) │
     │  useLeaseChatStore   (chat threads)      │
     │  usePaymentsStore    (payment history)   │
     │  useAdminStore       (admin UI)          │
     └──────────────────────────────────────────┘
```


---

## 2. Core Data Models

### `RentalApplication` — the spine of the entire flow

```ts
// src/modules/shared/types/prototype.ts

interface RentalApplication {
  id: string                        // e.g. "application-1720000000000-abc123"
  tenantId: string                  // FK → PrototypeUser.id
  ownerId: string                   // FK → PrototypeUser.id
  propertyId: string                // FK → PrototypeProperty.id
  listingId: string                 // FK → PrototypeListing.id
  brokerId?: string                 // FK → PrototypeUser.id (if broker is assigned)
  status: ApplicationStatus         // The current lifecycle stage (see §3)
  scheduledVisit?: ScheduledVisit   // { date: string, time: string }
  agreementVersions: AgreementVersion[]  // Append-only history of agreements
  createdAt: string                 // ISO timestamp
  updatedAt: string                 // ISO timestamp — updated on every status change
}
```

Every action in the onboarding flow mutates **only `status`, `scheduledVisit`, `agreementVersions`, and `updatedAt`** on this record. Nothing is deleted; the record grows.

### `LeaseRecord` — created at payment completion

```ts
interface LeaseRecord {
  id: string
  applicationId: string             // FK → RentalApplication.id
  tenantId: string
  ownerId: string
  propertyId: string
  listingId: string
  status: 'pending_owner_onboarding' | 'active'
  accessKey?: string                // Set when owner confirms onboarding
  activatedAt?: string
  createdAt: string
  updatedAt: string
}
```

### `PrototypePayment` — one record per payment event

```ts
interface PrototypePayment {
  id: string
  applicationId?: string            // Links payment to the application
  leaseId?: string                  // Links payment to the lease
  tenantId?: string
  ownerId: string
  brokerId?: string                 // If commission applies
  category: 'RENT' | 'SECURITY DEPOSIT' | 'COMMISSION' | 'PREMIUM' | ...
  amount: number                    // Raw number for calculations
  amountDisplay: string             // "Rs. 85,000" for display
  txnId: string                     // "RTL-<timestamp>-RENT"
  flow: 'tenant_to_owner' | 'owner_outgoing' | 'platform_to_broker'
  status: 'Successful' | 'Pending' | 'Failed' | 'Refunded'
  paidAt: string                    // Human-readable: "30 Jun 2026, 10:15 AM"
  paidAtIso: string                 // ISO for sorting/filtering
}
```


---

## 3. The `ApplicationStatus` State Machine

There are **12 discrete statuses**. The flow is linear with one branch (`changes_requested` loops back to `agreement_sent`).

```
interest_shown
    │
    ▼
visit_scheduled
    │
    ▼
visit_confirmed        ← tenant clicks "Yes, visited" in ApplicationProgressPanel
    │
    ▼
awaiting_owner_approval
    │
    ▼
owner_approved         ← owner calls approveTenant() in OwnerPropertyDetail
    │
    ▼
agreement_requested    ← tenant clicks "Request Lease Agreement"
    │
    ▼
agreement_sent         ← owner calls sendAgreement() with AgreementTerms
    │        ╲
    │         ▼
    │    changes_requested  ← tenant clicks "Send Change Request"
    │         │
    │         └──────────── (loops back to agreement_sent when owner resends)
    ▼
agreement_approved     ← tenant signs and calls approveAgreement()
    │
    ▼
payment_completed      ← tenant submits payment (rent + deposit)
    │
    ▼
active                 ← owner calls confirmTenantOnboarding()

[rejected]             ← owner calls rejectTenant() — terminal, removed from active flows
```

**`ONBOARDING_STATUS_ORDER`** is an array that encodes this order numerically so any code can compare progress with `statusIndex(status)`.

```ts
// src/modules/shared/store/onboardingStore.ts
export const ONBOARDING_STATUS_ORDER: OnboardingStatus[] = [
  'interest_shown', 'visit_scheduled', 'visit_confirmed',
  'awaiting_owner_approval', 'owner_approved', 'agreement_requested',
  'agreement_sent', 'changes_requested', 'agreement_approved',
  'payment_completed', 'active',
]
```


---

## 4. The Two-Layer Store Pattern

### Layer 1: `usePrototypeStore` — the backend

Defined in `src/modules/shared/store/prototypeStore.ts`. Owns and persists all data. All mutations go through here. Key internal helpers:

```ts
// Immutable helper — replaces a single application's status + patch
function updateApplicationStatus(
  applications, applicationId, status, patch = {}
) { ... }

// ID factory
function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`
}
```

**Direct store actions for the onboarding flow:**

| Action | Status transition | Side effects |
|--------|-------------------|--------------|
| `showInterest(tenantId, listingId)` | → `interest_shown` | Creates `RentalApplication`, creates `broker_tenant` chat thread if broker assigned, notifies broker |
| `scheduleVisit(applicationId, visit)` | → `visit_scheduled` | Attaches `scheduledVisit` to application, notifies broker |
| `approveTenant(applicationId)` | → `owner_approved` | Status update only |
| `rejectTenant(applicationId)` | → `rejected` | Status update only |
| `sendAgreement(applicationId, terms)` | → `agreement_sent` | Appends new `AgreementVersion` to array |
| `requestAgreementChanges(applicationId, comment)` | → `changes_requested` | Sets `changeRequest` on latest `AgreementVersion` |
| `approveAgreement(applicationId, signature)` | → `agreement_approved` | Sets `tenantSignature` + `tenantApprovedAt` on latest version |
| `completeOnboardingPayment(applicationId, {method, refId})` | → `payment_completed` | Creates `LeaseRecord` (status=`pending_owner_onboarding`), creates 2–3 `PrototypePayment` records (RENT + SECURITY DEPOSIT + optional COMMISSION) |
| `confirmTenantOnboarding(applicationId)` | → `active` | Updates `LeaseRecord` to `active`, sets `accessKey` + `activatedAt` |

### Layer 2: `useOnboardingStore` — the bridge

Defined in `src/modules/shared/store/onboardingStore.ts`. **Not a Zustand store** — it's a hook that calls `usePrototypeStore()` and maps raw state to a rich `OnboardingRecord` domain object on every render.

```ts
// Pattern: every call to useOnboardingStore re-derives from prototypeStore
export function useOnboardingStore<T>(selector: (state: OnboardingState) => T): T {
  const state = usePrototypeStore()      // ← subscribes to all prototype state changes
  return selector(bridgeState(state))    // ← maps + selects on every render
}
```

`bridgeState()` calls `mapRecords()` which joins applications ↔ properties ↔ users ↔ leases ↔ payments into a single flat `OnboardingRecord[]`. This is the view model that all UI components consume.

**`OnboardingRecord` — the view model:**

```ts
interface OnboardingRecord {
  id: string                    // === RentalApplication.id
  tenantPropertyId: string      // === listing.id (used in tenant URLs)
  ownerPropertyId: string       // === property.id (used in owner URLs)
  propertyName: string
  unit: string
  address: string
  monthlyRent: string
  securityDeposit: string
  tenant: OnboardingParty       // { id, name, email, phone, avatar }
  owner: OnboardingParty
  status: OnboardingStatus
  createdAt: string
  updatedAt: string
  timeline: Partial<Record<OnboardingStatus, string>>  // status → ISO timestamp
  scheduledVisit?: { date, time }
  agreementVersions: AgreementVersion[]
  payment?: OnboardingPayment   // Aggregated from all payments on this application
  lease?: LeaseState            // From LeaseRecord if it exists
}
```


---

## 5. Step-by-Step Flow with Code Paths

### Step 1 — Tenant Shows Interest

**Entry point:** `PropertyDetailsPage.tsx` → "I'm Interested" button

```ts
// 1. Build input object from current user + listing
const input = {
  tenantPropertyId: property.id,   // listing.id
  propertyName: property.title,
  address: property.location,
  monthlyRent: property.price,
  securityDeposit: property.deposit,
  tenant: { id, name, email, phone, avatar },  // from useAuth()
}

// 2. Call onboarding bridge
showInterest(input)   // useOnboardingStore((s) => s.showInterest)
```

**Inside `useOnboardingStore.showInterest`:**

```ts
// a. Resolves listingId from input.tenantPropertyId
//    (handles both listing.id and property.id as input)
const listingId = listingIdFor(input)

// b. Delegates to prototypeStore
const applicationId = usePrototypeStore.getState().showInterest(tenantId, listingId)

// c. Creates leaseChatStore thread (tenant ↔ owner)
useLeaseChatStore.getState().ensureThread({ onboardingId: applicationId, ... })

// d. Sends notification to owner
addNotification({
  userId: application.ownerId,
  role: 'owner',
  title: 'New tenant interest',
  action: 'review_application',
  relatedId: applicationId,
})
```

**Inside `prototypeStore.showInterest`:**

```ts
// Idempotency check: if non-rejected application already exists, returns existing id
const existing = applications.find(
  a => a.tenantId === tenantId && a.listingId === listingId && a.status !== 'rejected'
)
if (existing) return existing.id

// Creates application
const application: RentalApplication = {
  id: createId('application'),
  tenantId, ownerId: listing.ownerId,
  propertyId: listing.propertyId, listingId,
  brokerId: assignment?.brokerId,    // broker is automatically linked if assigned
  status: 'interest_shown',
  agreementVersions: [],
  ...timestamps
}

// If broker is assigned: also creates broker_tenant chat thread
// and notifies broker with role: 'broker'
```

**Cross-role visibility after this step:**
- **Tenant:** sees "Interest Sent" on property page; `ApplicationProgressPanel` replaces the action sidebar
- **Owner:** notification appears in bell icon; `OwnerPropertyDetail` shows tenant under "Interested Leads"
- **Broker (if assigned):** notification "New tenant lead"; appears in `BrokerClients` via `selectBrokerLeads(brokerId)`

---

### Step 2 — Tenant Schedules a Visit

**Entry point:** `PropertyDetailsPage.tsx` → "Schedule Visit" button

**KYC gate:** before opening the calendar modal, the system checks:
```ts
const kycVerified = localKycVerified || sharedKycVerified
// localKycVerified: useTenantKycStore (sessionStorage, just for this demo session)
// sharedKycVerified: user.kycStatus === 'Verified' in prototypeStore
if (!kycVerified) { setShowKycModal(true); return }
```

If KYC is not verified, `KycVerificationModal` opens. On success it calls `useTenantKycStore.setVerified(aadhaarRaw)`.

**After KYC, on calendar confirm:**
```ts
handleCalendarConfirmed(date, time) {
  scheduleVisit(input, { date, time })  // useOnboardingStore
}
```

**Inside `useOnboardingStore.scheduleVisit`:**
```ts
// Ensures application exists first (calls showInterest if needed)
const applicationId = usePrototypeStore.getState().showInterest(tenantId, listingId)
// Then schedules
usePrototypeStore.getState().scheduleVisit(applicationId, { date, time })
// Notifies owner
addNotification({ userId: ownerId, role: 'owner', title: 'Visit scheduled', ... })
```

**State change:** `application.status = 'visit_scheduled'`, `application.scheduledVisit = { date, time }`

**Cross-role visibility:**
- **Owner:** visit appears in `OwnerPropertyDetail` "Upcoming Schedules" section (filtered by `visit_scheduled | visit_confirmed | awaiting_owner_approval`)
- **Broker:** notification "Lead scheduled a visit" in `BrokerNotifications`


---

### Step 3 — Tenant Confirms Visit Completion

**Entry point:** `ApplicationProgressPanel.tsx` — inline confirmation card shown when `status === 'visit_scheduled'`

```tsx
// "Yes, visited" button
confirmPropertyVisit(record.id, true)
// "Not yet" button
confirmPropertyVisit(record.id, false)  // does nothing
```

**Inside `useOnboardingStore.confirmPropertyVisit`:**
```ts
if (!completed) return
setApplicationStatus(id, 'awaiting_owner_approval')
// Note: no notification sent here — owner polls via processDueOwnerApprovals()
```

**Auto-approval timer:** `ApplicationProgressPanel` uses `useEffect` to call `processDueOwnerApprovals()` immediately (simulating that any `awaiting_owner_approval` applications get auto-approved in the prototype):

```ts
// ApplicationProgressPanel.tsx
useEffect(() => {
  processDueOwnerApprovals()
  // Also sets a timer based on ownerApprovalDueAt if present
}, [recordId, recordStatus, ownerApprovalDueAt, processDueOwnerApprovals])
```

`processDueOwnerApprovals()` calls `approveTenant()` for every application in `awaiting_owner_approval` status — effectively making owner approval automatic in the prototype.

---

### Step 4 — Owner Approves / Rejects

**Manual entry point (if not auto-approved):** `OwnerPropertyDetail.tsx`

The owner sees interested leads from:
```ts
const interestedLeads = ownerRecords.filter(r => r.status === 'interest_shown')
```

And visit schedules from:
```ts
const visitSchedules = ownerRecords.filter(
  r => r.scheduledVisit && ['visit_scheduled', 'visit_confirmed', 'awaiting_owner_approval'].includes(r.status)
)
```

The approve/reject buttons call:
```ts
useOnboardingStore((s) => s.approveTenant)(id)
useOnboardingStore ((s) => s.rejectTenant)(id)
```

Which delegate to `prototypeStore.approveTenant/rejectTenant` and add a notification to the **tenant**.

**State change (approve):** `application.status = 'owner_approved'`
**State change (reject):** `application.status = 'rejected'` — the record is excluded from all active filters

---

### Step 5 — Tenant Requests Lease Agreement

**Entry point:** `ApplicationProgressPanel.tsx` — "Request Lease Agreement" button, shown when `status === 'owner_approved'`

```ts
requestLeaseAgreement(record.id)
```

**Inside `useOnboardingStore.requestLeaseAgreement`:**
```ts
setApplicationStatus(id, 'agreement_requested')
addNotification({
  userId: application.ownerId,
  role: 'owner',
  title: 'Lease agreement requested',
  action: 'review_application',
  important: true,
})
```

**State change:** `application.status = 'agreement_requested'`

---

### Step 6 — Owner Sends Agreement

**Entry point:** `OwnerPropertyDetail.tsx` — "Send Agreement" action (calls `useOnboardingStore.sendAgreement`)

```ts
const terms: AgreementTerms = {
  startDate, endDate,
  monthlyRent, securityDeposit,
  noticePeriod, utilities,
  maintenanceResponsibility, petPolicy,
  specialClauses, ownerSignature,
}
sendAgreement(record.id, terms)
```

**Inside `prototypeStore.sendAgreement`:**
```ts
// Appends a new AgreementVersion to the array (never overwrites)
{
  ...terms,
  id: createId('agreement'),
  version: application.agreementVersions.length + 1,
  sentAt: displayDate(),
}
```

**State change:** `application.status = 'agreement_sent'`, `application.agreementVersions` has one new entry

**Side effect in bridge:** Notifies tenant:
```ts
addNotification({
  userId: application.tenantId,
  role: 'tenant',
  title: 'Rental agreement ready',
  action: 'review_agreement',
  relatedId: id,
  important: true,
})
```

`defaultAgreementTerms(record)` in `onboardingStore.ts` provides pre-filled values that owner can edit.


---

### Step 7 — Tenant Reviews & Signs (or Requests Changes)

**Entry point:** `TenantAgreementReview.tsx` — navigated to from `ApplicationProgressPanel` "Review Agreement" button

**Route:** `/tenant/agreement/:onboardingId`

The page reads:
```ts
const record = useOnboardingStore((s) => s.records.find(r => r.id === onboardingId))
const latest = record?.agreementVersions[record.agreementVersions.length - 1]
```

**Guard:** `tenantCanViewAgreement(record)` — returns true only if `agreementVersions.length > 0` AND status is one of `agreement_sent | agreement_approved | payment_completed | active`.

**Path A — Approve (sign):**
```ts
approveAgreement(record.id, signature.trim())
// → prototypeStore.approveAgreement:
//   Sets latest.tenantSignature = signature
//   Sets latest.tenantApprovedAt = displayDate()
//   application.status = 'agreement_approved'
```

**Path B — Request Changes:**
```ts
requestChanges(record.id, comment.trim())
// → prototypeStore.requestAgreementChanges:
//   Sets latest.changeRequest = comment
//   application.status = 'changes_requested'
// Then navigates back to PropertyDetailsPage
```

When owner sees `changes_requested`, they can send a **new version** by calling `sendAgreement` again — this appends version 2 (or N) with a fresh `AgreementTerms`. Status returns to `agreement_sent` and the tenant gets notified again.

**Agreement version history is always preserved** — `agreementVersions` is append-only.

---

### Step 8 — Tenant Completes Onboarding Payment

**Entry point:** `TenantAgreementReview.tsx` → "Complete Onboarding Payment" button (shown after approval) or `ApplicationProgressPanel` → "Complete Payment"

**Route:** `/tenant/onboarding-payment/:onboardingId`

**Page:** `TenantOnboardingPayment.tsx`

```ts
const record = useOnboardingStore(s => s.records.find(r => r.id === onboardingId))
// Guard: status must be 'agreement_approved' | 'payment_completed' | 'active'

completePayment(record.id, method, reference.trim())
// → useOnboardingStore.completeOnboardingPayment
// → prototypeStore.completeOnboardingPayment
```

**Inside `prototypeStore.completeOnboardingPayment` — this is the richest action:**

```ts
// 1. Reads property for rent/deposit amounts
const rent = moneyToNumber(property.price)
const deposit = moneyToNumber(property.deposit)

// 2. Creates LeaseRecord
const leaseId = createId('lease')
// leases: [..., { id: leaseId, applicationId, tenantId, ownerId, propertyId, listingId,
//                  status: 'pending_owner_onboarding', createdAt, updatedAt }]

// 3. Creates payment records (minimum 2, up to 3)
payments.push({
  category: 'RENT',
  amount: rent,
  txnId: `RTL-${Date.now()}-RENT`,
  flow: 'tenant_to_owner',
  counterparty: application.ownerId,
  ...
})
payments.push({
  category: 'SECURITY DEPOSIT',
  amount: deposit,
  txnId: `RTL-${Date.now()}-DEP`,
  ...
})

// 4. If broker is on the application: auto-creates commission payment
if (application.brokerId) {
  const commission = Math.max(1000, Math.round(rent * 0.02))  // 2% of rent, min ₹1000
  payments.push({
    category: 'COMMISSION',
    amount: commission,
    flow: 'platform_to_broker',
    brokerId: application.brokerId,
    ...
  })
}

// 5. Updates application status
application.status = 'payment_completed'
```

**Bridge side effect:** notifies owner:
```ts
addNotification({
  userId: application.ownerId,
  role: 'owner',
  title: 'Onboard tenant?',
  action: 'onboard',
  important: true,
})
```

**Cross-role visibility after payment:**
- **Tenant:** `TenantMyLease` shows lease in `pending_owner_onboarding` state
- **Owner:** `OwnerPropertyDetail` sidebar shows tenant card with "Pending onboarding" badge; payment receipt link appears
- **Broker:** COMMISSION payment record appears in `BrokerCommission` page via `paymentsStore`
- **Admin:** payment records appear in `AdminFinancePayments` via `selectAdminPayments()`


---

### Step 9 — Owner Confirms Tenant Onboarding

**Entry point:** `OwnerPropertyDetail.tsx` — "Confirm Onboarding" / "Onboard Tenant" button shown when `activeLease.status === 'pending_owner_onboarding'`

```ts
useOnboardingStore((s) => s.confirmTenantOnboarding)(activeLease.id)
```

**Inside `prototypeStore.confirmTenantOnboarding`:**
```ts
// Finds lease by applicationId
const lease = leases.find(l => l.applicationId === applicationId)
const accessKey = `RTL-${Date.now().toString(36).toUpperCase()}`

// Updates LeaseRecord
lease.status = 'active'
lease.accessKey = accessKey
lease.activatedAt = displayDate()

// Updates application
application.status = 'active'
```

**Bridge side effect:** notifies tenant:
```ts
addNotification({
  userId: application.tenantId,
  role: 'tenant',
  title: 'Lease activated',
  action: 'view_lease',
  important: true,
})
```

**After activation:**
- **Tenant:** `TenantMyLease` shows "Lease Active" with `lease.accessKey` displayed
- **Owner:** property card in `OwnerPortfolio` shows "Occupied" badge; sidebar shows "Current Tenant" card
- **Broker:** no additional action; commission already recorded at payment step
- **Admin:** `AdminListingManagement` reflects lease status through application state

---

## 6. Chat Threads Created During the Flow

The onboarding flow automatically creates chat threads at key moments. All threads live in `prototypeStore.chats: ChatThread[]`.

| Thread Type | Created When | Participants | `applicationId` |
|-------------|-------------|-------------|----------------|
| `owner_broker` | Broker assigned to listing (`assignBroker`) | `[ownerId, brokerId]` | null |
| `broker_tenant` | Tenant shows interest on a broker-assigned listing (`showInterest`) | `[brokerId, tenantId]` | yes |
| `tenant_owner` | `leaseChatStore.ensureThread()` called after `showInterest` | `[tenantId, ownerId]` | yes |

**`leaseChatStore`** is a thin bridge over `prototypeStore.chats` that filters to threads with an `applicationId`. It exposes:
- `ensureThread(payload)` — idempotent: creates a `tenant_owner` chat if none exists for this `applicationId`
- `sendMessage(onboardingId, 'owner'|'tenant', text)` — calls `prototypeStore.sendChatMessage(threadId, senderId, text)`
- `getThread(onboardingId)` — lookup by `applicationId`

All messages are stored as `ChatMessage[]` inside the `ChatThread` in `prototypeStore`.

---

## 7. Notification System

All notifications live in `prototypeStore.notifications: PrototypeNotification[]`.

```ts
interface PrototypeNotification {
  id: string
  userId?: string          // If undefined, shown to all users of the 'role'
  role: UserRole | 'all'
  title: string
  description: string
  action?: string          // e.g. 'review_application', 'review_agreement', 'pay', 'onboard'
  relatedId?: string       // applicationId or propertyId for deep linking
  unread: boolean
  important: boolean
  createdAt: string
}
```

**Role-based filtering** (`selectRoleNotifications`):
```ts
state.notifications.filter(n =>
  n.role === 'all' ||
  n.userId === userId ||
  n.role === role
)
```

**Who gets notified at each step:**

| Action | Notified Role | `action` value |
|--------|--------------|----------------|
| `showInterest` | owner | `review_application` |
| `scheduleVisit` | broker (if any) | `view_lead` |
| `scheduleVisit` | owner | `review_application` |
| `approveTenant` | tenant | `review_application` |
| `rejectTenant` | tenant | `review_application` |
| `sendAgreement` | tenant | `review_agreement` |
| `requestLeaseAgreement` | owner | `review_application` |
| `completeOnboardingPayment` | owner | `onboard` |
| `confirmTenantOnboarding` | tenant | `view_lease` |
| `assignBroker` | broker | `view_assignment` |
| `assignBroker` | owner | `view_listing` |


---

## 8. Role-Specific Views of the Same Application

The same `RentalApplication` record is surfaced to all four roles simultaneously. Here is how each role reads it:

### Tenant View

```ts
// Selector
selectTenantApplications(tenantId)
  → applications.filter(a => a.tenantId === tenantId)

// Bridge: useOnboardingStore
records.find(r => r.tenant.id === tenantId && r.tenantPropertyId === listingId)

// UI components that read it:
// PropertyDetailsPage    → ApplicationProgressPanel (replace sidebar when status >= 'visit_scheduled')
// TenantProperties       → lists all applications
// TenantAgreementReview  → reads agreement content from record.agreementVersions
// TenantOnboardingPayment→ reads record.monthlyRent, record.securityDeposit
// TenantMyLease          → reads record.lease.accessKey, record.status === 'active'
```

### Owner View

```ts
// Selector
selectOwnerApplications(ownerId, propertyId?)
  → applications.filter(a => a.ownerId === ownerId && (!propertyId || a.propertyId === propertyId))

// Bridge: useOnboardingStore
onboardingRecords.filter(r => r.owner.id === ownerId && r.status !== 'rejected')

// UI components:
// OwnerPropertyDetail    → interestedLeads (status='interest_shown'),
//                          visitSchedules (status in visit_* stages),
//                          activeLease (status in 'payment_completed'|'active')
// OwnerLeases            → all active/pending leases
// OwnerTenants           → tenant list derived from active records
```

### Broker View

```ts
// Selector
selectBrokerLeads(brokerId)
  → applications.filter(a => a.brokerId === brokerId)

// UI: BrokerClients → shows all leads by application status
//     BrokerCommission → reads payments where brokerId matches and category='COMMISSION'
//     BrokerPropertyDetails → shows tenant count + lead stages per property
```

### Admin View

```ts
// selectAdminPayments() → all payments in prototypeStore.payments
// AdminFinancePayments → complete payment ledger across all roles
// AdminListingManagement → listing status reflects application lifecycle indirectly
// AdminUserManagement → user flags/bans affect whether their applications are visible
```

---

## 9. The `OnboardingRecord` Derivation Pipeline

This is the full path from raw storage to what the UI components consume:

```
sessionStorage
  └── prototypeStore.applications[]     (RentalApplication)
  └── prototypeStore.properties[]       (PrototypeProperty)
  └── prototypeStore.users[]            (PrototypeUser)
  └── prototypeStore.leases[]           (LeaseRecord)
  └── prototypeStore.payments[]         (PrototypePayment)
        │
        ▼
  mapRecords(state: PrototypeState): OnboardingRecord[]
  // For each application:
  //   1. find property by application.propertyId
  //   2. find lease by application.id
  //   3. find all payments by application.id → sum → pick latestPayment
  //   4. resolve tenant and owner to OnboardingParty via party(state, userId)
  //   5. build timeline map from ONBOARDING_STATUS_ORDER
        │
        ▼
  bridgeState(state) → { records, notifications, actions... }
        │
        ▼
  useOnboardingStore<T>(selector: state => T): T
  // Called from any React component with any selector
  // Re-derives on every prototypeStore state change
```

**Performance note:** Because `bridgeState` re-runs on every `usePrototypeStore()` subscription tick, components should use narrow selectors:
```ts
// Good — only re-renders when the specific record changes
const record = useOnboardingStore(s => s.records.find(r => r.id === id))

// Bad — re-renders on every store change
const { records, notifications } = useOnboardingStore(s => s)
```


---

## 10. Broker's Role in the Flow

Brokers are **optional participants** — a broker is attached to an application only if a `BrokerAssignment` exists for the listing when `showInterest` is called.

**How a broker gets linked to an application:**
```ts
// In prototypeStore.showInterest:
const assignment = brokerAssignments.find(
  a => a.listingId === listingId && a.status === 'Active'
)
application.brokerId = assignment?.brokerId  // undefined if no broker
```

Once linked, the broker:
1. Sees the tenant as a **lead** in `BrokerClients` via `selectBrokerLeads(brokerId)`
2. Gets a `broker_tenant` chat thread auto-created
3. Is notified when the tenant schedules a visit
4. Receives a **2% commission** payment automatically when tenant completes onboarding payment

Brokers **cannot** directly change application status. Their actions are:
- Communicating with tenants via the `broker_tenant` chat thread
- Requesting listing access via `requestBrokerListingAccess` (goes to admin for approval)
- Requesting listing removal via `requestBrokerListingRemoval` (goes to admin)

---

## 11. Seed Data and Demo Accounts

`src/modules/shared/data/prototypeSeed.ts` defines the initial state loaded on every fresh session.

**Preset scenario at session start:**
- `Broker1` is already assigned to `listing-multi-1` (MultiOwner's Skyline 14B)
- A `owner_broker` chat thread exists between `MultiPropertyOwner` and `Broker1`
- All `applications[]`, `leases[]`, and `payments[]` start **empty** — the full flow must be walked through manually

**Demo accounts (all OTP: `123456`):**

| Account | Phone | Role | Notes |
|---------|-------|------|-------|
| Tenant1 | 9000001001 | tenant | KYC = Pending (tests KYC gate) |
| Tenant2 | 9000001002 | tenant | KYC = Verified |
| MultiPropertyOwner | 9000002001 | owner | Owns 2 properties, Broker1 assigned |
| Owner1 | 9000002002 | owner | Owns Lakeview Studio |
| Owner2 | 9000002003 | owner | Owns Parkside Home |
| Broker1 | 9000003001 | broker | Pre-assigned to MultiOwner Skyline 14B |
| Broker2 | 9000003002 | broker | No assignments in seed |
| Admin1 | 9000009001 | admin | Full platform access |
| TenantOwner | 9000004001 | tenant + owner | Dual-role, role switcher visible |

---

## 12. Pattern: How to Build a New Cross-Role Feature

When building any new feature that must be visible across multiple roles (like the onboarding flow), follow this exact architecture:

### Step 1 — Define the shared data type in `prototype.ts`

Add your new record type to `PrototypeStateData` and to the interface in `prototype.ts`.

### Step 2 — Add actions to `prototypeStore.ts`

- Add the state array to `PrototypeState`
- Write mutations as pure `set()` calls inside the `create()` block
- Use `createId('your-prefix')` for IDs
- Use `nowIso()` for timestamps
- Always emit notifications to affected roles via the notifications array mutation

### Step 3 — Add selectors to `prototypeSelectors.ts`

Write named selector functions that take a `userId`/`roleId` and return the filtered data for that role. Keep selectors pure — no side effects.

### Step 4 — Create a bridge store (if needed)

If your feature needs a domain view model (like `OnboardingRecord`), create a bridge hook:
```ts
export function useYourFeatureStore<T>(selector: (state: YourState) => T): T {
  const state = usePrototypeStore()
  return selector(mapYourState(state))
}
```

### Step 5 — Add adapters to `prototypeAdapters.ts`

If any module uses a different type shape (like `AdminListing` vs `PrototypeListing`), add a `toModuleType()` converter here.

### Step 6 — Seed initial data in `prototypeSeed.ts`

Add seed records to `initialPrototypeState` so the feature has starting data without requiring a user to walk through a full workflow.

### Step 7 — Add notifications for every cross-role state change

Every action that changes data visible to another role **must** push to `state.notifications`. Use `role` to target the right audience:
```ts
notifications: [
  { role: 'owner', userId: ownerId, action: 'your_action', relatedId: recordId, ... },
  { role: 'broker', userId: brokerId, ... },
  ...state.notifications
]
```

### Step 8 — Never split the truth

All state mutations go through `prototypeStore`. Module stores (like `useAdminStore` with its static `adminUiStore`) create divergence bugs. Avoid it.


---

## 13. File Reference Map

| Concern | File |
|---------|------|
| Core data types | `src/modules/shared/types/prototype.ts` |
| Seed data + user IDs | `src/modules/shared/data/prototypeSeed.ts` |
| All state + mutations | `src/modules/shared/store/prototypeStore.ts` |
| Role-scoped selectors | `src/modules/shared/store/prototypeSelectors.ts` |
| Type adapters | `src/modules/shared/store/prototypeAdapters.ts` |
| Onboarding bridge + view model | `src/modules/shared/store/onboardingStore.ts` |
| Lease chat bridge | `src/modules/shared/store/leaseChatStore.ts` |
| Tenant flow entry | `src/modules/tenant/pages/PropertyDetailsPage.tsx` |
| Tenant progress UI | `src/modules/tenant/components/ApplicationProgressPanel.tsx` |
| Tenant agreement page | `src/modules/tenant/pages/TenantAgreementReview.tsx` |
| Tenant payment page | `src/modules/tenant/pages/TenantOnboardingPayment.tsx` |
| Tenant active lease | `src/modules/tenant/pages/TenantMyLease.tsx` |
| Owner property + leads | `src/modules/owner/pages/OwnerPropertyDetail.tsx` |
| KYC verification gate | `src/modules/tenant/components/KycVerificationModal.tsx` |
| KYC local store | `src/modules/tenant/store/tenantKycStore.ts` |
| Visit scheduling modal | `src/modules/tenant/components/ScheduleVisitModal.tsx` |
| Status index utility | `onboardingStore.ts → statusIndex(), ONBOARDING_STATUS_ORDER` |
| Progress panel visibility | `onboardingStore.ts → isProgressPanelVisible()` |
| Agreement guards | `onboardingStore.ts → tenantCanViewAgreement()` |
| Owner lease helper | `onboardingStore.ts → getOwnerLeaseForProperty()` |
| Payment history | `src/modules/shared/store/paymentsStore.ts` |

---

*End of document. Last updated: July 2026.*
