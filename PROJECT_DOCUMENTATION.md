# RENTILO - Project Documentation

## Overview

**Rentilo** is a comprehensive rental property marketplace platform built with React, TypeScript, and Tailwind CSS. It facilitates connections between property owners, brokers, tenants, and administrators through a sophisticated multi-role system with feature-based access control.

**Current Status:** Pre-production with mock data and local storage
**Tech Stack:** React 18 + TypeScript + React Router v6 + Zustand + TailwindCSS
**Version:** 0.0.0

---

## Architecture Overview

### Core Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend Framework** | React 18.2.0 | UI components and state management |
| **Routing** | React Router 6.23.1 | SPA navigation and protected routes |
| **State Management** | Zustand 4.5.2 | Global stores per module |
| **Data Fetching** | TanStack Query 5.45.1 | API query caching and sync |
| **Styling** | TailwindCSS 3.4.4 | Utility-first CSS framework |
| **HTTP Client** | Axios 1.7.2 | REST API communication |
| **Icons** | Lucide React 0.395.0 | Consistent icon system |
| **Build Tool** | Vite 5.3.1 | Fast development server and bundling |
| **Type Checking** | TypeScript 5.4.5 | Static type safety |

### Project Structure

```
src/
├── app/                          # Application-level concerns
│   ├── layouts/                  # Layout components (AuthLayout, OwnerLayout, TenantLayout, etc.)
│   ├── providers/                # React context providers (AppProviders)
│   ├── router/                   # Route configuration and protected routes
│   ├── store/                    # Application-level auth store
│   └── queryClient.ts            # TanStack Query client configuration
│
├── modules/                      # Feature modules (role-based)
│   ├── admin/                    # Admin dashboard and management
│   ├── auth/                     # Authentication flows (login, OTP, register)
│   ├── broker/                   # Broker marketplace and property management
│   ├── enterprise/               # Enterprise/corporate property management
│   ├── owner/                    # Property owner dashboard and features
│   ├── tenant/                   # Tenant browsing and profile management
│   ├── marketing/                # Landing pages and marketing content
│   └── shared/                   # Shared components, utilities, and hooks
│
├── assets/                       # Static media
│   ├── fonts/
│   ├── icons/
│   └── images/                   # Property photos and user avatars
│
├── config/                       # Environment configuration
├── constants/                    # Global constants and enums
├── styles/                       # Global CSS and theme tokens
├── types/                        # Global TypeScript interfaces
└── main.tsx / App.tsx            # Application entry points
```

---

## Role-Based Architecture

Rentilo supports **6 distinct user roles**, each with dedicated modules and feature access:

### 1. **Tenant** (`/tenant`)
Browse and rent properties, manage leases and payments.

**Key Features:**
- Property listings with advanced filters (location, price, amenities)
- Property details with gallery, specifications, and nearby amenities
- Save/bookmark properties
- Submit rental applications
- Lease document management
- Payment tracking
- Maintenance requests
- Serious buyer badge (premium feature)

**Routes:**
- `/tenant/dashboard` - Dashboard overview
- `/tenant/listings` - Browse available properties
- `/tenant/properties/:id` - Property details
- `/tenant/saved` - Saved properties
- `/tenant/profile` - Profile management
- `/tenant/leases` - Active and historical leases
- `/tenant/payments` - Payment history
- `/tenant/maintenance` - Maintenance tickets

**Store:** `useOnboardingStore` (shared with owner for lease data)

---

### 2. **Owner** (`/owner`)
List properties, manage tenants, track payments, upgrade to premium.

**Key Features:**
- Property portfolio management
- Tenant relationship management
- Lease document handling
- Payment tracking and analytics
- Maintenance ticket management
- **Premium Subscription Features:**
  - Detailed viewer insights
  - Direct tenant messaging
  - Promotion management
  - Inquiry and viewing management
  - Financial reports
  - Broker assignment tools

**Routes:**
- `/owner/dashboard` - Overview with premium/free plan distinction
- `/owner/portfolio` - Properties showcase
- `/owner/properties` - Property CRUD
- `/owner/leases` - Lease management
- `/owner/tenants` - Tenant relationship tracking
- `/owner/payments` - Payment management
- `/owner/analytics` - Data and insights
- `/owner/maintenance` - Maintenance tickets
- `/owner/plans-rules` - Subscription management
- `/owner/premium-payment` - Upgrade flow
- `/owner/inquiries` - Viewer inquiries (premium)
- `/owner/viewings` - Viewing calendar (premium)
- `/owner/brokers` - Broker management (premium)
- `/owner/promotions` - Property promotions (premium)
- `/owner/financials` - Financial reports (premium)

**Store:** `useOwnerStore` (subscription plan, features, premium payment state)

---

### 3. **Broker** (`/broker`)
Manage assignments, track commissions, handle buyer relationships.

**Key Features:**
- Assigned property portfolio
- Buyer/tenant client management
- Commission tracking
- Property inquiry management
- Analytics on deals

**Routes:**
- `/broker/dashboard` - Overview
- `/broker/portfolio` - Managed properties
- `/broker/assigned-properties` - Active assignments
- `/broker/clients` - Client management
- `/broker/commission` - Commission tracking

**Store:** Mock data currently

---

### 4. **Admin** (`/admin`)
Platform governance, user management, payments, listing moderation.

**Key Features:**
- Broker management and approval
- Listing moderation
- User account management
- Payment processing and receipts
- Platform configuration
- Assignment management
- Maintenance ticket oversight
- Notifications and messaging

**Routes:**
- `/admin/dashboard` - Platform overview
- `/admin/broker-management` - Broker administration
- `/admin/listing-management` - Property moderation
- `/admin/user-management` - User account controls
- `/admin/finance-payments` - Payment processing
- `/admin/platform-configuration` - System settings
- `/admin/assignment-management` - Property assignments
- `/admin/maintenance-tickets` - Maintenance oversight

**Store:** Mock data with state management for crud operations

---

### 5. **Enterprise** (`/enterprise`)
Corporate/bulk property management.

**Key Features:**
- Multi-property portfolio management
- Team management
- Reporting and analytics
- Batch operations

**Routes:**
- `/enterprise/dashboard`
- `/enterprise/portfolio`
- `/enterprise/teams`
- `/enterprise/reports`

**Status:** Minimal implementation (placeholder pages)

---

### 6. **Auth** (`/auth`)
Authentication and registration flows.

**Key Features:**
- OTP-based login (no passwords)
- Role-based registration
- Phone verification

**Routes:**
- `/auth/login` - OTP login
- `/auth/register` - New user registration
- `/auth/forgot-password` - Password recovery

---

## Feature Architecture: Premium Owner Example

### Subscription Model
Owners can upgrade from **FREE** to **PREMIUM** plan:

**FREE Plan:**
- Basic property listing
- Basic tenant communication
- Standard analytics
- 1-2 property slots

**PREMIUM Plan ($149/month):**
- All free features
- Unlimited properties
- Advanced analytics with viewer insights
- Direct tenant messaging
- Viewing calendar
- Promotion/listing boost
- Broker assignment tools
- Financial reports

### Feature Gating Implementation

```typescript
// In ownerStore.ts
hasFeature(feature: OwnerFeature): boolean {
  return this.subscriptionPlan === 'PREMIUM' && 
         PLAN_CONFIG.PREMIUM.features.includes(feature)
}

// Usage in components
const isPremium = subscriptionPlan === 'PREMIUM'
if (hasFeature('inquiry_management')) {
  // Show premium feature
}
```

**Available Features:**
- `inquiry_management` - View and respond to property inquiries
- `viewings_calendar` - Manage scheduled viewings
- `promoted_listings` - Promote properties for visibility
- `broker_management` - Assign and manage brokers
- `financial_reports` - Advanced financial analytics
- `direct_messaging` - Message tenants directly

### Mock Premium Payment Flow

Located in `src/modules/owner/pages/OwnerPremiumPaymentPage.tsx`:

1. User clicks "Upgrade to Premium"
2. Displays payment form with plan details
3. On submission → Shows "processing overlay"
4. Simulates 2-second payment processing
5. Shows success screen
6. Stores subscription in localStorage via `ownerStore.ts`
7. Updates subscription plan state
8. Syncs to sessionStorage for persistence

---

## State Management

### Zustand Stores (Per Module)

Each module maintains a Zustand store for local state. Key examples:

#### `authStore.ts` (Global)
```typescript
- user: User | null
- isAuthenticated: boolean
- roles: Role[]
- login(phone, otp)
- logout()
```

#### `ownerStore.ts`
```typescript
- subscriptionPlan: 'FREE' | 'PREMIUM'
- subscribedAt: string | null
- selectedPropertyId: string
- registerPropertyDraft: PropertyFormData
- hasFeature(feature: OwnerFeature): boolean
- showUpgradePrompt(feature: OwnerFeature)
- updateSubscription(plan: 'PREMIUM')
- createTenantTicket(), updateTenantTicket()
```

#### `onboardingStore.ts` (Shared - Tenant + Owner)
```typescript
- records: OnboardingRecord[] // Leases between owner & tenant
- createOnboarding() // New lease
- completeOnboarding() // Mark lease complete
```

#### Module Stores
- `useOwnerMaintenanceStore` - Maintenance tickets
- `useOwnerChatStore` - Messages
- Mock stores for broker, admin, enterprise

### Data Persistence
- **Session Storage:** Auth token, user session
- **Local Storage:** Saved properties, subscription state, maintenance tickets
- **In-Memory (Zustand):** Component state during session

---

## Layout System

Rentilo uses per-role layouts to manage navigation and top bars:

### AuthLayout (`/src/app/layouts/AuthLayout.tsx`)
- Used for login/registration pages
- Centered form layout
- No navigation sidebar

### Role-Specific Layouts
Each role has a dedicated layout component:

- **TenantLayout** - Top bar with notifications, profile; sidebar with browse/saved/profile links
- **OwnerLayout** - Fixed sidebar (280px) with navigation; feature gating on sidebar items
- **BrokerLayout** - Sidebar with portfolio, clients, commission links
- **AdminLayout** - Sidebar with management sections
- **EnterpriseLayout** - Team-focused sidebar
- **BrokerDashboardLayout** - Broker browsing properties

### Layout Components
All layouts follow this pattern:
```tsx
export function OwnerLayout() {
  return (
    <div>
      <header>Top bar with logo, profile menu</header>
      <aside>Sidebar with navigation items</aside>
      <main><Outlet /></main>
    </div>
  )
}
```

**Sidebar Features:**
- Dynamic items based on subscription plan
- Feature gating with lock icons
- Upgrade prompts for restricted features
- Responsive mobile bottom bar

---

## Routing & Navigation

### Protected Routes
All role-specific routes are wrapped with `<ProtectedRoute>` to enforce authentication:

```typescript
// src/app/router/ProtectedRoute.tsx
<Route element={<ProtectedRoute requiredRoles={['tenant']}><TenantLayout /></ProtectedRoute>}>
  <Route path="dashboard" element={<TenantDashboard />} />
</Route>
```

### Route Constants
Centralized in `src/modules/shared/constants/routes.ts`:

```typescript
ROUTES = {
  HOME: '/',
  AUTH: { LOGIN, REGISTER, FORGOT_PASSWORD },
  TENANT: { DASHBOARD, LISTINGS, PROPERTIES, ... },
  OWNER: { DASHBOARD, PORTFOLIO, PROPERTIES, ... },
  BROKER: { ... },
  ADMIN: { ... },
  ENTERPRISE: { ... },
}
```

### Dynamic Route Generation
- Owner property detail: `ROUTES.OWNER.PROPERTY_DETAIL(propertyId)`
- Generates: `/owner/properties/{id}`

---

## Component Hierarchy

### Shared Components (`src/modules/shared/`)
Reusable UI components used across all modules:

| Component | Purpose |
|-----------|---------|
| `RoleModeSwitcher` | Switch between tenant/owner roles (if user has multiple) |
| `UpgradeDialog` | Premium feature upgrade prompt |
| `Toast` / `ToastContainer` | Notification system |
| `ErrorBoundary` | Error handling wrapper |
| `ProtectedRoute` | Route access control |

### Module-Specific Components
Each module has its own `components/` folder with role-specific widgets:

**Owner Module Examples:**
- `FeatureGate.tsx` - Conditionally render based on subscription
- `UpgradeDialog.tsx` - Premium upgrade modal
- `ListingPromotionPromoCard.tsx` - Promotion upsell card
- `OwnerProfileMenu.tsx` - Top-right profile dropdown

---

## API Integration (Future)

Currently using **mock data** stored in Zustand stores and localStorage.

### Planned API Endpoints (REST)
```
POST   /api/auth/login
POST   /api/auth/verify-otp
GET    /api/properties
GET    /api/properties/:id
POST   /api/properties
PUT    /api/properties/:id
DELETE /api/properties/:id

POST   /api/leases
GET    /api/leases/:id
PUT    /api/leases/:id/onboard
POST   /api/subscriptions/upgrade
GET    /api/payments
POST   /api/payments
```

### Query Caching Strategy
TanStack Query (`useQuery`, `useMutation`) will handle:
- Automatic cache invalidation
- Retry logic for failed requests
- Stale-while-revalidate patterns
- Optimistic updates

---

## Design System

### Design Principles
**"Architectural Precision" meets "Modern Marketplace"**
- High data density balanced with whitespace
- Sophisticated, enterprise-grade aesthetic
- Minimalist, corporate-premium styling
- Restricted color palette with strong hierarchy

### Color System
| Usage | Color | Hex |
|-------|-------|-----|
| Primary Brand | Blue | `#2563eb` |
| Deep Navy | Architectural | `#0F172A` |
| Secondary | Slate | `#64748b` |
| Background (Canvas) | Light Lavender | `#faf8ff` |
| Surface (Cards) | White | `#ffffff` |
| Border/Outline | Slate-200 | `#e2e8f0` |
| Success | Green | `#22c55e` |
| Warning | Amber | `#f59e0b` |
| Error | Red | `#ef4444` |

### Typography
- **Font Family:** Manrope (modern geometric sans-serif)
- **Heading 1:** 30-36px, Extra-Bold
- **Heading 2:** 24px, Bold
- **Body:** 14-16px, Medium
- **Label:** 12px, Regular/Medium

### Spacing (4px/8px Base)
- Section gaps: 32-48px (web), 24px (mobile)
- Card padding: 24px (large), 16px (mobile)
- Button padding: `px-6 py-3` (primary), `px-4 py-2` (small)
- Grid gap: `gap-6` (24px)

### Border Radius
- Cards: 12px (mobile), 8px (web)
- Buttons: 8-12px
- Modals: 16px
- Inputs: 8px
- Pills/Badges: 9999px

### Responsive Breakpoints
- **Mobile:** <768px (bottom tab bar, full-width cards)
- **Tablet:** 768px-1024px (hybrid layout)
- **Desktop:** >1024px (fixed 280px sidebar, main content area)

---

## Key Data Models

### User
```typescript
{
  id: string
  phone: string
  firstName: string
  lastName: string
  avatar?: string
  roles: Role[] // 'tenant' | 'owner' | 'broker' | 'admin'
  email?: string
  verified: boolean
  kycStatus: 'not_started' | 'pending' | 'verified'
}
```

### Property
```typescript
{
  id: string
  title: string
  description: string
  address: string
  price: number
  bedrooms: number
  bathrooms: number
  sqft: number
  images: string[]
  amenities: string[]
  rules: PropertyRule[]
  ownerId: string
  featured: boolean
  views: number
  saves: number
}
```

### Lease (Onboarding)
```typescript
{
  id: string
  ownerId: string
  tenantId: string
  propertyId: string
  startDate: string
  endDate: string
  status: 'pending' | 'active' | 'completed' | 'terminated'
  documents: Document[]
  payment: Payment
}
```

### MaintenanceTicket
```typescript
{
  id: string
  propertyId: string
  tenantId: string
  category: 'Plumbing' | 'Electrical' | 'Appliance' | ...
  problem: string
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed'
  images: string[]
  priority: 'Low' | 'Medium' | 'High'
  submittedAt: string
}
```

---

## Recent Changes (This Session)

### Fixes Applied
1. **Resolved Merge Conflicts**
   - Fixed `OwnerDashboard.tsx` (multiple merge conflict markers)
   - Fixed `TenantMaintenance.tsx` (duplicate functions and JSX)
   - Fixed `OwnerLayout.tsx` (duplicate imports)

2. **Added Missing Routes**
   - `/owner/inquiries` → OwnerInquiries
   - `/owner/viewings` → OwnerViewings
   - `/owner/brokers` → OwnerBrokerManagement
   - `/owner/promotions` → OwnerPromotions
   - `/owner/financials` → OwnerFinancials

3. **Code Quality Improvements**
   - Removed unused imports and variables
   - Cleaned up unused component definitions
   - Ensured TypeScript compilation passes

---

## Testing Credentials (Mock)

### Tenant (FREE)
- **Phone:** 9000000001
- **OTP:** 123456
- **Features:** Browse, save, lease management

### Owner (FREE)
- **Phone:** 9000000002
- **OTP:** 123456
- **Features:** Basic portfolio, property management

### Premium Owner
- **Phone:** 9000000007
- **OTP:** 123456
- **Features:** All premium features
- **Upgrade:** Click "Upgrade to Premium" in dashboard, fill form

### Admin
- **Phone:** 9000000003
- **OTP:** 123456
- **Features:** Full platform management

### Broker
- **Phone:** 9000000004
- **OTP:** 123456
- **Features:** Client and assignment management

---

## Development Workflow

### Getting Started
```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# Runs on http://localhost:5173 (or next available port)

# Build for production
npm run build

# Type checking
tsc --noEmit

# Linting
npm run lint
```

### Adding a New Feature

1. **Create module directory** if it's a new role:
   ```
   src/modules/new-role/
   ├── pages/
   ├── components/
   ├── routes/
   ├── store/
   ├── types/
   └── index.ts
   ```

2. **Define routes** in `src/modules/new-role/routes/index.tsx`

3. **Create Zustand store** for state management

4. **Implement pages** using shared components and design system

5. **Register routes** in `src/app/router/index.tsx`

6. **Add layout** if needed in `src/app/layouts/`

### Design System Compliance
- Follow `design_language.md` for all UI
- Use Tailwind utilities from `globals.css` theme tokens
- Never use arbitrary values (e.g., `margin-17px`)
- Test responsive behavior on mobile/tablet/desktop

---

## Deployment

### Build Process
```bash
npm run build
# Outputs to: dist/
# Contents: index.html + assets bundle
```

### Environment Configuration
Located in `src/config/env.ts`:
- API_BASE_URL
- Feature flags
- Third-party service keys

### Hosting Options
- **Vercel** (recommended for Vite)
- **Netlify**
- **AWS S3 + CloudFront**
- Any static hosting with SPA routing support

### SPA Routing Configuration
Ensure your server redirects 404s to `/index.html`:
```nginx
# Nginx example
location / {
  try_files $uri $uri/ /index.html;
}
```

---

## Future Roadmap

### Phase 1 (Current)
- [x] Multi-role architecture
- [x] Basic property browsing
- [x] Owner dashboard with mock premium upgrade
- [x] Admin management panels
- [x] Maintenance ticket system

### Phase 2 (Q2 2024)
- [ ] Real payment processing (Stripe/Razorpay)
- [ ] Real API backend integration
- [ ] Database persistence
- [ ] Email/SMS notifications
- [ ] Video tours for properties

### Phase 3 (Q3 2024)
- [ ] Mobile app (React Native)
- [ ] AI-powered recommendations
- [ ] Chatbot support
- [ ] Advanced analytics dashboard
- [ ] API for third-party integrations

---

## Performance Optimizations

### Current
- Code splitting via Vite
- Lazy route loading
- Zustand for minimal re-renders
- TanStack Query caching

### Future
- Image optimization with next-gen formats (WebP)
- Service Workers for offline support
- Bundle size analysis with Vite plugin
- Core Web Vitals monitoring

---

## Security Considerations

### Current (Development)
- Mock authentication (phone + OTP only)
- LocalStorage for state (not secure)
- No CSRF/XSS protection

### Production (To Implement)
- JWT/OAuth authentication
- HTTP-only cookies
- CSRF tokens for state-changing requests
- CSP headers
- Rate limiting on API endpoints
- Input validation and sanitization
- HTTPS enforcement
- Secure password hashing

---

## Common Issues & Solutions

### Issue: Premium features show 404
**Solution:** Ensure routes are registered in `src/modules/owner/routes/index.tsx` and imported in router configuration.

### Issue: Feature gating not working
**Solution:** Check `ownerStore.hasFeature()` is called correctly and subscription plan is set in store.

### Issue: Sidebar items not showing
**Solution:** Verify sidebar items array includes new routes and `OwnerLayout` re-renders on state change.

### Issue: Build fails with TypeScript errors
**Solution:** Run `npm run lint` to check for unused variables/imports and remove them.

---

## Useful Resources

- **React Router:** https://reactrouter.com/
- **Zustand:** https://github.com/pmndrs/zustand
- **TailwindCSS:** https://tailwindcss.com/
- **TanStack Query:** https://tanstack.com/query/latest
- **Vite:** https://vitejs.dev/
- **TypeScript:** https://www.typescriptlang.org/

---

## Support & Contact

For issues or questions:
1. Check existing documentation
2. Review error messages in browser console
3. Check `git log` for recent changes
4. Reach out to development team

---

**Last Updated:** July 2024
**Documentation Version:** 1.0
**Project Status:** Pre-production (Mock Data)
