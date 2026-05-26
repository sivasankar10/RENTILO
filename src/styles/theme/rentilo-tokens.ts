/**
 * RENTILO design tokens — single source of truth.
 * Consumed by tailwind.config.ts and globals.css (:root CSS variables).
 *
 * - `brand` / CSS `--primary`: Curated tenant UI (rentilo fe1 / Stitch)
 * - `primary` (Tailwind): Marketplace blue for auth & role dashboards
 */

export const rentiloBrand = {
  primary: '#002542',
  primaryContainer: '#1b3b5a',
  secondary: '#46617b',
  background: '#f6fafe',
  surface: '#f6fafe',
  surfaceContainerLow: '#f0f4f8',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerHigh: '#e4e9ed',
  onSurface: '#171c1f',
  onSurfaceVariant: '#43474d',
  outline: '#73777e',
  outlineVariant: 'rgba(115, 119, 126, 0.15)',
  verifiedBg: '#d1e4ff',
  searchBg: '#cee5ff',
  trustedBg: '#ffddb3',
  trustedIcon: '#5f4110',
  favorite: '#ba1a1a',
  locationAccent: '#fde047',
  badgeGold: '#c5a059',
} as const

export const rentiloMarketplace = {
  primary: '#2563eb',
  primaryDark: '#0F172A',
  primary50: '#eff6ff',
  primary100: '#dbeafe',
  primary600: '#2358d4',
  primary700: '#1d4ed8',
  secondary: '#64748b',
  canvas: '#faf8ff',
  canvasAlt: '#f8fafc',
  surface: '#ffffff',
  navy: '#0F172A',
  outline: '#e2e8f0',
  outlineVariant: '#cbd5e1',
  hover: 'rgba(15, 23, 42, 0.05)',
  hoverLight: '#f1f5f9',
  active: '#dbeafe',
  textPrimary: '#0F172A',
  textMuted: '#64748b',
} as const

export const rentiloStatus = {
  success: '#22c55e',
  successBg: '#f0fdf4',
  successText: '#15803d',
  warning: '#f59e0b',
  warningBg: '#fffbeb',
  warningText: '#b45309',
  error: '#ef4444',
  errorBg: '#fef2f2',
  errorText: '#b91c1c',
} as const

export const rentiloTypography = {
  fontDisplay: ['Manrope', 'sans-serif'] as string[],
  fontBody: ['Inter', 'Manrope', 'sans-serif'] as string[],
  fontMarketplace: ['Manrope', 'sans-serif'] as string[],
}

export const rentiloLayout = {
  sidebarWidth: '280px',
  mobileBarHeight: '64px',
  containerMax: '1280px',
  tenantContainerMax: '1536px',
} as const

export const rentiloShadows = {
  surface: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  modal: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  cardElevated: '0px 12px 32px rgba(23, 28, 31, 0.06)',
  cardHover: '0px 20px 40px rgba(23, 28, 31, 0.1)',
  ambient: '0px 2px 8px rgba(23, 28, 31, 0.03)',
} as const

/** CSS custom properties for tenant module styles (var(--primary), etc.) */
export const rentiloCssVariables: Record<string, string> = {
  '--primary': rentiloBrand.primary,
  '--primary-container': rentiloBrand.primaryContainer,
  '--secondary': rentiloBrand.secondary,
  '--background': rentiloBrand.background,
  '--surface': rentiloBrand.surface,
  '--surface-container-low': rentiloBrand.surfaceContainerLow,
  '--surface-container-lowest': rentiloBrand.surfaceContainerLowest,
  '--surface-container-high': rentiloBrand.surfaceContainerHigh,
  '--on-surface': rentiloBrand.onSurface,
  '--on-surface-variant': rentiloBrand.onSurfaceVariant,
  '--outline': rentiloBrand.outline,
  '--outline-variant': rentiloBrand.outlineVariant,
  '--verified-bg': rentiloBrand.verifiedBg,
  '--search-bg': rentiloBrand.searchBg,
  '--trusted-bg': rentiloBrand.trustedBg,
  '--trusted-icon': rentiloBrand.trustedIcon,
  '--font-display': rentiloTypography.fontDisplay.join(', '),
  '--font-body': rentiloTypography.fontBody.join(', '),
  '--shadow-ambient': rentiloShadows.cardElevated,
}
