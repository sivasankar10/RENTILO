import type { Config } from 'tailwindcss'
import {
  rentiloBrand,
  rentiloLayout,
  rentiloMarketplace,
  rentiloShadows,
  rentiloStatus,
  rentiloTypography,
} from './rentilo-tokens'

/** Tailwind `theme.extend` — import in tailwind.config.ts */
export const rentiloTailwindExtend: NonNullable<Config['theme']>['extend'] = {
  colors: {
    /* Marketplace / auth / role dashboards (design_language.md) */
    primary: {
      DEFAULT: rentiloMarketplace.primary,
      dark: rentiloMarketplace.primaryDark,
      50: rentiloMarketplace.primary50,
      100: rentiloMarketplace.primary100,
      500: rentiloMarketplace.primary,
      600: rentiloMarketplace.primary600,
      700: rentiloMarketplace.primary700,
    },
    secondary: rentiloMarketplace.secondary,
    canvas: {
      DEFAULT: rentiloMarketplace.canvas,
      alt: rentiloMarketplace.canvasAlt,
    },
    surface: rentiloMarketplace.surface,
    navy: rentiloMarketplace.navy,
    outline: {
      DEFAULT: rentiloMarketplace.outline,
      variant: rentiloMarketplace.outlineVariant,
    },
    hover: {
      DEFAULT: rentiloMarketplace.hover,
      light: rentiloMarketplace.hoverLight,
    },
    active: rentiloMarketplace.active,
    text: {
      primary: rentiloMarketplace.textPrimary,
      muted: rentiloMarketplace.textMuted,
      inverse: '#ffffff',
    },
    status: {
      success: rentiloStatus.success,
      'success-bg': rentiloStatus.successBg,
      'success-text': rentiloStatus.successText,
      warning: rentiloStatus.warning,
      'warning-bg': rentiloStatus.warningBg,
      'warning-text': rentiloStatus.warningText,
      error: rentiloStatus.error,
      'error-bg': rentiloStatus.errorBg,
      'error-text': rentiloStatus.errorText,
    },

    /* Curated tenant / fe1 brand palette — use bg-brand, text-brand, etc. */
    brand: {
      DEFAULT: rentiloBrand.primary,
      container: rentiloBrand.primaryContainer,
      secondary: rentiloBrand.secondary,
      surface: rentiloBrand.surface,
      background: rentiloBrand.background,
      'on-surface': rentiloBrand.onSurface,
      'on-surface-variant': rentiloBrand.onSurfaceVariant,
      outline: rentiloBrand.outline,
      'outline-variant': rentiloBrand.outlineVariant,
      'container-low': rentiloBrand.surfaceContainerLow,
      'container-lowest': rentiloBrand.surfaceContainerLowest,
      'container-high': rentiloBrand.surfaceContainerHigh,
      verified: rentiloBrand.verifiedBg,
      favorite: rentiloBrand.favorite,
      accent: rentiloBrand.locationAccent,
      pending: {
        bg: '#fff4e5',
        text: '#8a5a00',
        border: '#ffd89b',
      },
      membership: '#b8860b',
      whatsapp: '#25d366',
    },
  },

  fontFamily: {
    manrope: rentiloTypography.fontMarketplace,
    inter: ['Inter', 'sans-serif'],
    display: rentiloTypography.fontDisplay,
    body: rentiloTypography.fontBody,
  },

  fontSize: {
    'heading-1': ['36px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
    'heading-2': ['24px', { lineHeight: '1.3', fontWeight: '700' }],
    'heading-3': ['18px', { lineHeight: '1.4', fontWeight: '700' }],
    body: ['14px', { lineHeight: '1.5', fontWeight: '500' }],
    'body-lg': ['16px', { lineHeight: '1.5', fontWeight: '500' }],
    label: ['12px', { lineHeight: '1.5', fontWeight: '500' }],
    badge: ['11px', { lineHeight: '1', fontWeight: '700' }],
    'filter-label': ['10px', { lineHeight: '1', fontWeight: '700', letterSpacing: '0.08em' }],
  },

  spacing: {
    '4.5': '18px',
    '13': '52px',
    '15': '60px',
    '18': '72px',
    '70': rentiloLayout.sidebarWidth,
    '16-mobile': rentiloLayout.mobileBarHeight,
  },

  borderRadius: {
    card: '8px',
    'card-mobile': '12px',
    button: '8px',
    modal: '16px',
    input: '8px',
    pill: '9999px',
  },

  borderWidth: {
    '3': '3px',
  },

  boxShadow: {
    surface: rentiloShadows.surface,
    modal: rentiloShadows.modal,
    card: rentiloShadows.cardElevated,
    'card-hover': rentiloShadows.cardHover,
    ambient: rentiloShadows.ambient,
  },

  maxWidth: {
    container: rentiloLayout.containerMax,
    tenant: rentiloLayout.tenantContainerMax,
    '7xl': rentiloLayout.containerMax,
  },

  transitionDuration: {
    '200': '200ms',
  },
}
