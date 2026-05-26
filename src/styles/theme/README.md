# RENTILO Theme

Single source of truth: **`rentilo-tokens.ts`**

| Token set | Tailwind prefix | CSS variables | Used by |
|-----------|-----------------|---------------|---------|
| Marketplace | `primary`, `canvas`, `text-*`, `status-*` | — | Auth, owner/broker/enterprise dashboards, shared UI |
| Brand (fe1) | `brand-*` | — (Tailwind only) | Tenant pages & components (`src/modules/tenant/`) |

## Usage

**Dashboard / shared components**

```tsx
<button className="bg-primary text-white">Save</button>
<div className="bg-canvas text-text-muted">...</div>
```

**New tenant components (prefer Tailwind brand tokens)**

```tsx
<h1 className="text-brand font-display text-3xl font-bold">Curated Properties</h1>
<div className="bg-brand-background">...</div>
```

## Changing colors

1. Edit `src/styles/theme/rentilo-tokens.ts`
2. `tailwind.config.ts` picks up changes via `rentiloTailwindExtend` automatically
