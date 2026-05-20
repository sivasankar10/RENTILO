# RENTILO Design System & Visual Language

## 1. DESIGN PHILOSOPHY
**Overall UI Style:** "Architectural Precision" meets "Modern Marketplace." The interface is characterized by high data density balanced with significant whitespace, prioritizing clarity and structural hierarchy.
**Visual Identity:** Sophisticated, enterprise-grade, and trustworthy. It avoids the playfulness of consumer apps in favor of a crisp, professional aesthetic.
**Mood & Aesthetic:** Minimalist, corporate-premium, and highly organized. It uses a restricted color palette and strong grid alignment to convey reliability and scale.
**Density & Spacing:** High density for data-rich enterprise views (Web) and "airy" card-based layouts for management views (Mobile).

## 2. COLOR SYSTEM

### Brand & Functional
*   **Primary (Brand Blue):** `#2563eb` (Modern Rental Marketplace) / `#0F172A` (Deep Navy for Architectural Precision)
*   **Secondary:** `#64748b` (Slate-500) for supporting icons and secondary actions.
*   **Background (Canvas):** `#faf8ff` (Light Lavender tint) or `#f8fafc` (Slate-50).
*   **Surface (Cards/Containers):** `#ffffff` (Pure White).
*   **Sidebar/Navigation:** `#0F172A` (Deep Navy) for Web top bars; `#ffffff` for standard sidebars.
*   **Border/Outline:** `#e2e8f0` (Slate-200) or `#cbd5e1` (Slate-300).
*   **Hover States:** `rgba(15, 23, 42, 0.05)` (Subtle grey overlay) or `#f1f5f9`.
*   **Active States:** Primary blue with high contrast (e.g., `#dbeafe` for backgrounds).

### Typography & Status
*   **Primary Text:** `#0F172A` (Slate-900).
*   **Muted/Secondary Text:** `#64748b` (Slate-500).
*   **Success:** `#22c55e` (Green-500) — used for "Verified" and "Active."
*   **Warning/Pending:** `#f59e0b` (Amber-500) — used for "Scheduled" and "Maintenance."
*   **Error/Urgent:** `#ef4444` (Red-500) — used for "Urgent" and "Not Done."

## 3. TYPOGRAPHY SYSTEM
*   **Font Family:** Manrope (Sans-serif, modern, geometric).
*   **Heading 1 (Hero/Dashboard):** 30px-36px, Semi-Bold/Extra-Bold, Tracking -0.02em.
*   **Heading 2 (Section Headers):** 24px, Bold.
*   **Heading 3 (Card Titles):** 18px, Bold.
*   **Body (Primary):** 14px-16px, Medium, Leading 1.5.
*   **Label/Muted (Details):** 12px, Regular/Medium.
*   **Weight Scale:** Regular (400), Medium (500), Semi-Bold (600), Bold (700), Black (900).

## 4. SPACING SYSTEM (4px/8px Base)
*   **Section Gaps:** 32px-48px (Web), 24px (Mobile).
*   **Card Padding:** 24px (Large Containers), 16px (Mobile/Small Cards).
*   **Container Spacing:** Max-width 1280px for Web; gutter-lg (20px-24px) for Mobile.
*   **Button Padding:** px-6 py-3 (Primary), px-4 py-2 (Small).
*   **Grid Spacing:** gap-6 (24px) standard for dashboard grids.

## 5. BORDER RADIUS SYSTEM
*   **Standard Card:** 12px (Mobile) / 8px (Web - more rigid).
*   **Buttons:** 8px or 12px (consistent with cards).
*   **Modals:** 16px for high-depth components.
*   **Inputs:** 8px.
*   **Chips/Badges:** 9999px (Full pill).

## 6. SHADOW SYSTEM
*   **Surface Level (Cards):** `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` (Subtle elevation).
*   **Modal/Overlay:** `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`.
*   **Active/Hover:** Transition from `shadow-sm` to `shadow-md`.

## 7. COMPONENT DESIGN RULES
*   **Buttons:** Primary is solid blue/navy with white text. Secondary is ghost or outlined with `#e2e8f0` borders.
*   **Cards:** Pure white background, subtle border `#e2e8f0`, and 4px-8px shadow. Header sections often have a light grey border-bottom.
*   **Tables:** Minimalist. Headers are uppercase, tracking-wider, slate-500. Rows use a 1px border-bottom (no vertical lines).
*   **Badges:** Small font (10px-11px), uppercase/bold, high-contrast text on light background (e.g., Green text on light green background).
*   **Sidebars (Web):** Fixed 280px width. Active links use a left-border or background-fill indicator.

## 8. TAILWIND DESIGN TOKENS
*   **Colors:** `bg-surface`, `text-primary`, `border-outline-variant`.
*   **Typography:** `font-manrope`, `tracking-tight` for headings.
*   **Layout:** `max-w-7xl`, `mx-auto`, `px-6`.
*   **Transitions:** `transition-all duration-200 ease-in-out`.

## 9. RULES ANOTHER AI AGENT MUST FOLLOW
*   **Strict 8px Grid:** Every margin, padding, and gap must be a multiple of 4 (preferably 8). Never use arbitrary values like margin: 17px.
*   **Avatar Consistency:** Profile pictures must always be high-quality, professional headshots with consistent circular masking.
*   **Status Badge Logic:** Always use a light background version of the status color (e.g., `bg-green-50 text-green-700`).
*   **No Pure Black:** Never use `#000000` for text; use `#0F172A` (Slate-900) or `#1e293b`.
*   **Icon Pairing:** Icons must always be matched with labels in navigation; never leave "mystery meat" navigation.
*   **Whitespace is Content:** If a section feels crowded, double the padding rather than shrinking the text.
*   **Responsive Integrity:** Maintain the 280px sidebar width on Web; transition to a bottom bar on Mobile (64px height).
