# RENTILO — Project Update Log

This file tracks project state, known issues, files/screens, and technical notes.  
**Only add or change entries when Danush explicitly asks, or when a instructed task is completed.**

---

## Working rules (agent)

| Rule                     | Detail                                                                                                      |
| ------------------------ | ----------------------------------------------------------------------------------------------------------- |
| **No new pages**         | Do not create any page/screen/component unless explicitly instructed in a prompt.                           |
| **No drive-by fixes**    | Known flaws stay documented here; fix them only when a prompt asks for that fix.                            |
| **Follow Stitch assets** | New UI must follow provided sample images, HTML, and markdown from Stitch.                                  |
| **Stack**                | React.js + CSS (co-located or `TenantDashboard.css` for tenant views). No extra libraries unless requested. |
| **Scope**                | Tenant screens only until other roles (Owner, Broker, Enterprise, Admin) are requested.                     |

---

## Tech stack (frontend)

| Item      | Spec                                                                                  |
| --------- | ------------------------------------------------------------------------------------- |
| Framework | React 19                                                                              |
| Build     | Vite 6 (`npm run dev` → port 3000)                                                    |
| Language  | Mostly `.jsx`; entry `App.tsx` / `main.tsx`                                           |
| Styling   | Plain CSS + CSS variables in `src/index.css`                                          |
| Icons     | Google Material Symbols (global)                                                      |
| Routing   | None — `useState` page switch in `App.tsx`; tenant sub-views in `TenantDashboard.jsx` |
| Data      | Mock data in components; no API layer in `src` yet                                    |

---

## Product roles (planned — not all built)

| Role             | Tiers                | Built in repo?                     |
| ---------------- | -------------------- | ---------------------------------- |
| Tenant           | Free, Serious Tenant | Partial (dashboard shell + views)  |
| Owner            | Free, Premium        | No                                 |
| Broker           | Free, Premium        | No (Auth has broker checkbox only) |
| Enterprise Owner | —                    | No                                 |
| Admin            | —                    | No                                 |

---

## Files & screens (existing — do not recreate without instruction)

### App-level flow (`src/App.tsx`)

| `currentPage`      | File                                          | Purpose                      |
| ------------------ | --------------------------------------------- | ---------------------------- |
| `home`             | `pages/Home/Home.jsx`                         | Marketing landing            |
| `auth`             | `pages/Auth/Auth.jsx`                         | Login / signup               |
| `otp`              | `pages/Otp/Otp.jsx`                           | OTP verification (simulated) |
| `listings`         | `pages/PropertyListings/PropertyListings.jsx` | Post-OTP listings hub        |
| `property-details` | `pages/PropertyDetails/PropertyDetails.jsx`   | Single property details      |
| `tenant-dashboard` | `pages/TenantDashboard/TenantDashboard.jsx`   | Tenant dashboard shell       |

### Shared components

| File                           | Purpose                                                 |
| ------------------------------ | ------------------------------------------------------- |
| `components/Navbar/Navbar.jsx` | Top nav (Home)                                          |
| `components/Footer/Footer.jsx` | Footer (Home)                                           |
| `src/index.css`                | Global tokens, fonts (Inter, Manrope), Material Symbols |

### Tenant dashboard views (`src/pages/TenantDashboard/views/`)

| View key     | File                      | Sidebar?    | Notes                         |
| ------------ | ------------------------- | ----------- | ----------------------------- |
| `explore`    | `PropertyExploreView.jsx` | Yes         | Listing search & filters      |
| `details`    | `PropertyDetailsView.jsx` | Via explore | Property detail               |
| `shortlists` | `ShortlistsView.jsx`      | Yes         | Shortlist + compare           |
| `serious`    | `SeriousUpgradeView.jsx`  | No          | ₹99 Serious Tenant upgrade    |
| `kyc`        | `KycVerificationView.jsx` | No          | Aadhaar KYC flow              |
| `tracker`    | `StatusTrackerView.jsx`   | Yes         | Application status            |
| `inbox`      | `ChatView.jsx`            | Yes         | Owner/broker chat             |
| `payments`   | `PaymentsView.jsx`        | Yes         | Rent & invoices               |
| `profile`    | `ProfileSettingsView.jsx` | Yes         | Profile + dev sandbox toggles |

| Styles | `TenantDashboard.css` | ~4k lines, all tenant view styles |

---

## Files created by agent

| Date       | File                                            | Purpose                                                                 |
| ---------- | ----------------------------------------------- | ----------------------------------------------------------------------- |
| 2026-05-20 | `src/data/properties.js`                        | Shared mock property data for listings + property details               |
| 2026-05-20 | `src/pages/PropertyDetails/PropertyDetails.jsx` | Tenant post-login property details page (scrollable, matches Stitch UI) |
| 2026-05-20 | `src/pages/PropertyDetails/PropertyDetails.css` | Styles for property details layout, gallery, sidebar card, rules table  |

---

## Known flaws / technical debt (fix only when instructed)

1. **Prop API mismatch** — `TenantDashboard.jsx` passes `navigateToView`, `shortlistedIds`, `propertyId`; child views still expect `onSelectProperty`, `onOpenUpgradeModal`, `shortlists`, `property` object, `onUpgradeSuccess`, `onKycSuccess`, `onExploreMore`, etc. Navigation between views may be broken.
2. **Shortlist seed IDs** — Default `["prop-2", "prop-4"]` in `TenantDashboard.jsx` does not match property IDs `"1"`–`"6"` in mock data.
3. **Duplicate mock listings** — Listings + new `PropertyDetails` share `src/data/properties.js`; tenant dashboard `PropertyExploreView` / `ShortlistsView` still use separate ₹ Bangalore data.
4. **Missing shared state** — `appliedProperties` for tracker/apply flow not lifted in parent; `activeChatId` not passed to `ChatView` from details.
5. **No URL routing** — No deep links or browser back for sub-views.
6. **Broker checkbox** — `Auth.jsx` `isBroker` not passed to later screens.
7. **Unused dependencies** — `lucide-react`, `motion`, `express`, `@google/genai` in `package.json` but unused in `src`.

---

## Application flow (from Danush)

```text
Landing (common)
  → Sign up / Login (common)
    → OTP (common)
      → Role-specific dashboard
```

- **Tenant (current focus):** After OTP, tenant gets their own dashboard. A **Property Listings** page (`PropertyListings.jsx`) already exists in the repo.
- **Other roles** (Owner, Broker, Enterprise, Admin): Each gets its own dashboard later; not built yet.

### Current code path (`App.tsx`) — reference only

OTP → **`listings`** → click card → **`property-details`**. Tenant dashboard via “My Tenancy” / “My Profile”. Change only when instructed.

---

## Explicit additions from Danush

- Documented intended global flow: Landing → Auth → OTP → per-role dashboard (tenant first).

---

## Changelog

| Date       | Summary                                                                                                                    |
| ---------- | -------------------------------------------------------------------------------------------------------------------------- |
| 2026-05-20 | Created `update.md`. Documented rules, stack, existing files, known flaws. Prior agent wiring changes were undone by user. |
| 2026-05-20 | Added Property Details page; wired `App.tsx` + listings card click; shared `properties.js`.                                |
