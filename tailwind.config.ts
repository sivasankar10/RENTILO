import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      /* ── RENTILO Design Language Colors ── */
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          dark: '#0F172A',
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#2563eb',
          600: '#2358d4',
          700: '#1d4ed8',
        },
        secondary: '#64748b',
        canvas: {
          DEFAULT: '#faf8ff',
          alt: '#f8fafc',
        },
        surface: '#ffffff',
        navy: '#0F172A',
        outline: {
          DEFAULT: '#e2e8f0',
          variant: '#cbd5e1',
        },
        hover: {
          DEFAULT: 'rgba(15, 23, 42, 0.05)',
          light: '#f1f5f9',
        },
        active: '#dbeafe',
        text: {
          primary: '#0F172A',
          muted: '#64748b',
          inverse: '#ffffff',
        },
        status: {
          success: '#22c55e',
          'success-bg': '#f0fdf4',
          'success-text': '#15803d',
          warning: '#f59e0b',
          'warning-bg': '#fffbeb',
          'warning-text': '#b45309',
          error: '#ef4444',
          'error-bg': '#fef2f2',
          'error-text': '#b91c1c',
        },
      },

      /* ── Typography ── */
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
      },
      fontSize: {
        'heading-1': ['36px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'heading-2': ['24px', { lineHeight: '1.3', fontWeight: '700' }],
        'heading-3': ['18px', { lineHeight: '1.4', fontWeight: '700' }],
        'body': ['14px', { lineHeight: '1.5', fontWeight: '500' }],
        'body-lg': ['16px', { lineHeight: '1.5', fontWeight: '500' }],
        'label': ['12px', { lineHeight: '1.5', fontWeight: '500' }],
        'badge': ['11px', { lineHeight: '1', fontWeight: '700' }],
      },

      /* ── Spacing (strict 4px/8px grid) ── */
      spacing: {
        '4.5': '18px',
        '13': '52px',
        '15': '60px',
        '18': '72px',
        '70': '280px',   // Sidebar width
        '16-mobile': '64px', // Mobile bottom bar
      },

      /* ── Border Radius ── */
      borderRadius: {
        'card': '8px',
        'card-mobile': '12px',
        'button': '8px',
        'modal': '16px',
        'input': '8px',
        'pill': '9999px',
      },

      /* ── Shadows ── */
      boxShadow: {
        'surface': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'modal': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },

      /* ── Layout ── */
      maxWidth: {
        'container': '1280px',
      },

      /* ── Transitions ── */
      transitionDuration: {
        '200': '200ms',
      },
    },
  },
  plugins: [],
}

export default config
