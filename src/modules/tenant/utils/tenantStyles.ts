import { cn } from '@shared/utils/cn'

/** Shared Tailwind patterns for tenant (brand) UI */
export const tenantStyles = {
  page: 'flex flex-1 flex-col min-h-0 bg-brand-background font-body text-brand-on-surface',
  main: 'flex-1 w-full max-w-[1200px] mx-auto px-8 py-6 pb-16 max-md:px-5 max-md:pb-12',
  backBtn:
    'inline-flex items-center gap-1.5 border-0 bg-transparent p-0 mb-6 font-body text-sm font-medium text-brand-secondary cursor-pointer hover:text-brand transition-colors',
  pageTitle: 'font-display text-[32px] font-extrabold text-brand mb-2',
  pageSubtitle: 'text-[15px] text-brand-on-surface-variant',
  sectionTitle: 'font-display text-[22px] font-extrabold text-brand mb-4',
  primaryBtn:
    'w-full border-0 rounded-[10px] bg-brand py-3.5 px-5 font-body text-[15px] font-semibold text-white cursor-pointer transition-opacity hover:opacity-90',
  brandBtn:
    'inline-flex items-center justify-center gap-2 border-0 rounded-[10px] bg-brand px-7 py-3 font-body text-[15px] font-semibold text-white cursor-pointer hover:opacity-90',
}

export function topbarNavLink(active: boolean) {
  return cn(
    'font-body text-sm font-medium text-brand-outline pb-1 border-0 border-b-2 border-transparent bg-transparent cursor-pointer transition-all duration-200',
    active ? 'text-brand font-bold border-brand' : 'hover:text-brand'
  )
}
