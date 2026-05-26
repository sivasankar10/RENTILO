import { Link } from 'react-router-dom'

export function LandingFooter() {
  return (
    <footer className="bg-brand-container-low border-t border-brand-outline-variant py-12 px-6">
      <div className="max-w-container mx-auto flex flex-col md:flex-row md:justify-between md:items-start gap-8">
        <div className="max-w-sm">
          <div className="font-display text-xl font-extrabold text-brand mb-3">RENTILO</div>
          <p className="font-body text-sm text-brand-on-surface-variant leading-relaxed">
            Elevating property management through premium design and verified connections.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 md:gap-8 font-body text-sm font-medium text-brand-on-surface-variant">
          <a href="#about" className="hover:text-brand no-underline transition-colors">
            About Us
          </a>
          <a href="#contact" className="hover:text-brand no-underline transition-colors">
            Contact Us
          </a>
          <a href="#terms" className="hover:text-brand no-underline transition-colors">
            Terms of Service
          </a>
          <Link to="/auth/login" className="hover:text-brand no-underline transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
      <p className="max-w-container mx-auto mt-10 pt-6 border-t border-brand-outline-variant font-body text-xs text-brand-outline text-center md:text-left">
        © 2024 RENTILO. All rights reserved.
      </p>
    </footer>
  )
}
