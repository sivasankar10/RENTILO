# RENTILO Design System & Visual Language

This is the canonical design language for RENTILO. All upcoming UI work in this repository should follow these instructions unless the user explicitly provides a newer direction.

## 1. Design Philosophy

**Overall UI Style:** "Architectural Precision" meets "Modern Marketplace." The interface is characterized by high data density balanced with significant whitespace, prioritizing clarity and structural hierarchy.

**Visual Identity:** Sophisticated, enterprise-grade, and trustworthy. It avoids the playfulness of consumer apps in favor of a crisp, professional aesthetic.

**Mood & Aesthetic:** Minimalist, corporate-premium, and highly organized. It uses a restricted color palette and strong grid alignment to convey reliability and scale.

**Density & Spacing:** High density for data-rich enterprise views on web and airy card-based layouts for management views on mobile.

## 2. Color System

### Brand & Functional

- **Primary (Brand Blue):** `#2563eb` for the modern rental marketplace; `#0F172A` for deep navy architectural precision.
- **Secondary:** `#64748b` (Slate-500) for supporting icons and secondary actions.
- **Background (Canvas):** `#faf8ff` (light lavender tint) or `#f8fafc` (Slate-50).
- **Surface (Cards/Containers):** `#ffffff`.
- **Sidebar/Navigation:** `#0F172A` for web top bars; `#ffffff` for standard sidebars.
- **Border/Outline:** `#e2e8f0` (Slate-200) or `#cbd5e1` (Slate-300).
- **Hover States:** `rgba(15, 23, 42, 0.05)` or `#f1f5f9`.
- **Active States:** Primary blue with high contrast, such as `#dbeafe` for active backgrounds.

### Typography & Status

- **Primary Text:** `#0F172A` (Slate-900).
- **Muted/Secondary Text:** `#64748b` (Slate-500).
- **Success:** `#22c55e` (Green-500), used for "Verified" and "Active."
- **Warning/Pending:** `#f59e0b` (Amber-500), used for "Scheduled" and "Maintenance."
- **Error/Urgent:** `#ef4444` (Red-500), used for "Urgent" and "Not Done."

## 3. Typography System

- **Font Family:** Manrope, a modern geometric sans-serif.
- **Heading 1 (Hero/Dashboard):** 30px-36px, Semi-Bold/Extra-Bold, tracking `-0.02em`.
- **Heading 2 (Section Headers):** 24px, Bold.
- **Heading 3 (Card Titles):** 18px, Bold.
- **Body (Primary):** 14px-16px, Medium, leading 1.5.
- **Label/Muted (Details):** 12px, Regular/Medium.
- **Weight Scale:** Regular (400), Medium (500), Semi-Bold (600), Bold (700), Black (900).

## 4. Spacing System (4px/8px Base)

- **Section Gaps:** 32px-48px on web; 24px on mobile.
- **Card Padding:** 24px for large containers; 16px for mobile and small cards.
- **Container Spacing:** Max-width 1280px for web; 20px-24px gutters for mobile.
- **Button Padding:** `px-6 py-3` for primary buttons; `px-4 py-2` for small buttons.
- **Grid Spacing:** `gap-6` (24px) as the standard dashboard grid gap.

## 5. Border Radius System

- **Standard Card:** 12px on mobile; 8px on web for a more rigid, architectural feel.
- **Buttons:** 8px or 12px, consistent with cards.
- **Modals:** 16px for high-depth components.
- **Inputs:** 8px.
- **Chips/Badges:** 9999px full pill.

## 6. Shadow System

- **Surface Level (Cards):** `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`.
- **Modal/Overlay:** `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`.
- **Active/Hover:** Transition from `shadow-sm` to `shadow-md`.

## 7. Component Design Rules

- **Buttons:** Primary buttons are solid blue or navy with white text. Secondary buttons are ghost or outlined with `#e2e8f0` borders.
- **Cards:** Pure white background, subtle `#e2e8f0` border, and 4px-8px shadow. Header sections often use a light grey border-bottom.
- **Tables:** Minimalist. Headers are uppercase, tracking-wider, and Slate-500. Rows use a 1px border-bottom with no vertical lines.
- **Badges:** 10px-11px font, uppercase/bold, high-contrast text on light status backgrounds.
- **Sidebars (Web):** Fixed 280px width. Active links use a left-border or background-fill indicator.

## 8. Tailwind Design Tokens

Source of truth: `src/styles/theme/rentilo-tokens.ts`, consumed by `tailwind.config.ts` and `src/styles/globals.css`.

- **Colors:** `bg-surface`, `text-primary`, `border-outline-variant`.
- **Typography:** `font-manrope`, `tracking-tight` for headings.
- **Layout:** `max-w-7xl`, `mx-auto`, `px-6`.
- **Transitions:** `transition-all duration-200 ease-in-out`.

## 9. Rules Another AI Agent Must Follow

- **Strict 8px Grid:** Every margin, padding, and gap must be a multiple of 4, preferably 8. Never use arbitrary values like `margin: 17px`.
- **Avatar Consistency:** Profile pictures must always be high-quality, professional headshots with consistent circular masking.
- **Status Badge Logic:** Always use a light background version of the status color, such as `bg-green-50 text-green-700`.
- **No Pure Black:** Never use `#000000` for text; use `#0F172A` (Slate-900) or `#1e293b`.
- **Icon Pairing:** Icons must always be matched with labels in navigation; never leave mystery-meat navigation.
- **Whitespace is Content:** If a section feels crowded, double the padding rather than shrinking the text.
- **Responsive Integrity:** Maintain the 280px sidebar width on web; transition to a bottom bar on mobile with 64px height.

## 10. Reference Screen Notes

The provided dashboard reference uses:

- A deep navy web top bar with compact navigation, right-aligned upgrade action, utility icons, and a circular avatar.
- A fixed left sidebar with portfolio switcher, icon+label navigation, visible active state, disabled finance item, and bottom support/logout links.
- A light canvas with a centered dashboard work area, white cards, subtle borders, and measured shadows.
- A data-dense owner dashboard composition: listing hero card, tenant signals card, dark daily activity panel, and a dashed upsell card.
- Blue primary actions, light status badges, muted secondary text, and strict alignment between the sidebar, content grid, and right rail.
