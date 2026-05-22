interface TenantFooterProps {
  compact?: boolean
}

export function TenantFooter({ compact = false }: TenantFooterProps) {
  return (
    <footer className="w-full border-t border-brand-container-low bg-brand-surface font-body text-[10px] uppercase tracking-widest mt-auto">
      <div className="w-full h-2 bg-brand-container-low" />
      <div className="flex flex-col items-center gap-4 px-8 py-12">
        <div className="font-display text-lg font-bold text-brand mb-2">RENTILO</div>
        {!compact && (
          <nav className="flex flex-wrap justify-center gap-6 mb-4">
            {['Privacy Policy', 'Terms of Service', 'Accessibility', 'Contact Support'].map(
              (label) => (
                <a
                  key={label}
                  href={`#${label.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-[11px] text-brand-outline no-underline transition-colors hover:text-brand normal-case"
                >
                  {label}
                </a>
              )
            )}
          </nav>
        )}
        <p className="text-[11px] text-brand-outline text-center normal-case">
          © 2024 RENTILO. A Curated Estate Management Experience.
        </p>
      </div>
    </footer>
  )
}
