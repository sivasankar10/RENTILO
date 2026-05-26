# Add to Central Repo — From `rentilo fe1` (Tenant Prototype Only)

Use this file in the **central RENTILO** Cursor workspace.  
**Do not copy** the whole `rentilo fe1` project. Central repo already has auth, router, layouts, Tailwind, and other roles.

**Source prototype:** `rentilo fe1` (React + CSS, local `useState` routing)

---

## What NOT to add (already in central repo)

- `Home`, `Auth`, `Otp` → use `modules/auth/`
- Root `App.tsx` page switcher → use `app/router/`
- `TenantTopbar` → use `TenantLayout` + `DashboardLayout` topbar instead
- `package.json`, `vite.config`, `index.css` tokens → use central `tailwind.config.ts` + `globals.css`
- `TenantDashboard` folder (not in current prototype flow)

---

## What TO add under `src/modules/tenant/`

### 1. Routes (`modules/tenant/routes/index.tsx`)

Register these inside existing tenant route tree (under `TenantLayout` + `ProtectedRoute`):

| Route path       | Page component        |
| ---------------- | --------------------- |
| `listings`       | `ListingsPage`        |
| `properties/:id` | `PropertyDetailsPage` |
| `saved`          | `SavedPropertiesPage` |
| `profile`        | `EditProfilePage`     |

**Suggested full paths:** `/tenant/listings`, `/tenant/properties/:id`, `/tenant/saved`, `/tenant/profile`

**Default after tenant login:** confirm with team — prototype uses **listings** as first screen after OTP.

---

### 2. Pages (port from prototype → new `.tsx` + Tailwind)

| Source (rentilo fe1)                                       | Add as (central repo)           | Notes                                               |
| ---------------------------------------------------------- | ------------------------------- | --------------------------------------------------- |
| `src/pages/PropertyListings/PropertyListings.jsx` + `.css` | `pages/ListingsPage.tsx`        | Curated grid, filters sidebar, location/search bars |
| `src/pages/PropertyDetails/PropertyDetails.jsx` + `.css`   | `pages/PropertyDetailsPage.tsx` | See feature list below                              |
| `src/pages/SavedProperties/SavedProperties.jsx` + `.css`   | `pages/SavedPropertiesPage.tsx` | Empty state + saved cards grid                      |
| `src/pages/EditProfile/EditProfile.jsx` + `.css`           | `pages/EditProfilePage.tsx`     | KYC + phone **PENDING** only                        |

**Styling:** Rebuild UI with **Tailwind** per `design_language.md`. Do not copy `.css` files into `globals.css`.

**Edit Profile layout:** Prototype has its own left sidebar — in central repo prefer **only** `TenantLayout` sidebar (form in main area). Drop duplicate sidebar unless design requires exception.

---

### 3. Property Details — feature checklist to port

- Scrollable page
- Header: title, rent, deposit, address
- Gallery: main image + thumbnail strip (click to switch)
- **Right sticky card:** highlights grid, Schedule Visit, I'm Interested, views / shortlists / contacts stats
- **Overview:** description paragraphs + specs grid (furnishing, facing, water, floor, bathroom, pet, non-veg, gated security)
- **NoBroker Services** badge (when `noBrokerServices: true`)
- **Amenities** icon tiles
- **Property Rules** table
- **What's Nearby:** tabs Transit | Essentials | Utility; bus/airport/train lists with `distance | time`

---

### 4. Data (`modules/tenant/constants/properties.ts` or `services/mockProperties.ts`)

Port from `src/data/properties.js`:

- `PROPERTIES` array (3 mock properties)
- `getPropertyById(id)`
- Per property fields: `highlights`, `overviewSpecs`, `overview[]`, `amenities`, `rules`, `nearby` (transit/essentials/utility), `gallery`, `noBrokerServices`, stats (`views`, `shortlists`, `contacts`)

---

### 5. State (`modules/tenant/store/savedPropertiesStore.ts`)

Port behavior from `App.tsx` in prototype:

```ts
// saved property IDs
toggleSaved(id);
saveProperty(id); // add if not present
// used by: listing card heart, saved page remove, optional details
```

**UX to preserve:**

- **Topbar heart** → navigate to `/tenant/saved`
- **Listing card heart** → save property + navigate to `/tenant/saved`
- **Saved page heart** → remove from list (stay on page)
- **Profile avatar** → navigate to `/tenant/profile`

Wire heart + avatar on **`DashboardLayout`** (or `tenant/components/TenantHeaderActions.tsx`) — not a separate `TenantTopbar`.

---

### 6. Types (`modules/tenant/types/`)

Add TypeScript interfaces matching mock data, e.g.:

- `Property`
- `PropertyHighlight`, `OverviewSpec`, `PropertyRule`, `NearbyPlace`, `PropertyNearby`

---

### 7. Tenant layout nav (`TenantLayout.tsx`)

Update `navItems` to include links to new routes, e.g.:

- Listings (or Properties)
- Saved
- Profile
- (Keep existing team items: Dashboard, My Lease, Payments, etc.)

---

### 8. Optional hooks (`modules/tenant/hooks/`)

- `useSavedProperties()` — wrapper around store (if team uses hook pattern)

---

## Behavior map (prototype → central)

| Prototype (`useState`)                    | Central (React Router)                 |
| ----------------------------------------- | -------------------------------------- |
| `currentPage === 'listings'`              | `/tenant/listings`                     |
| `property-details` + `selectedPropertyId` | `/tenant/properties/:id`               |
| `saved-properties`                        | `/tenant/saved`                        |
| `edit-profile`                            | `/tenant/profile`                      |
| `savedPropertyIds` in App                 | `savedPropertiesStore`                 |
| Card click                                | `navigate('/tenant/properties/' + id)` |

---

## Files in prototype — copy reference only

```
rentilo fe1/src/
├── data/properties.js                    → tenant/constants or services
├── pages/PropertyListings/               → tenant/pages/ListingsPage.tsx
├── pages/PropertyDetails/                → tenant/pages/PropertyDetailsPage.tsx
├── pages/SavedProperties/                → tenant/pages/SavedPropertiesPage.tsx
├── pages/EditProfile/                    → tenant/pages/EditProfilePage.tsx
└── components/TenantTopbar/              → DO NOT ADD (use DashboardLayout)
```

---

## Implementation order (for Cursor in central repo)

1. [x] `properties.ts` + types
2. [x] `savedPropertiesStore.ts`
3. [x] `ListingsPage.tsx` + route
4. [x] `PropertyDetailsPage.tsx` + route
5. [x] `SavedPropertiesPage.tsx` + route
6. [x] `EditProfilePage.tsx` + route (no duplicate sidebar)
7. [x] Topbar: heart count + profile link (`TenantHeader` in browse layout)
8. [ ] Test: login as tenant → listings → details → save → saved → profile

---

## Confirm with team before merge

- [x] **Default tenant landing:** `/tenant/listings` (not Dashboard) — after login and `/tenant` index
- [x] **Edit Profile:** `TenantLayout` only (no second sidebar)
- [x] **Mock data** OK until API is ready

---

## Prompt for central repo Cursor

```text
Migrate tenant UI from rentilo fe1 using TENANT_MIGRATION_HANDOFF.md.
Add only modules/tenant pages, routes, store, and constants.
Use Tailwind + TenantLayout. Do not duplicate auth or TenantTopbar.
```
