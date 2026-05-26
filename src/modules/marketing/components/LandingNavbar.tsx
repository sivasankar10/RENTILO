import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@shared/constants/routes'

export function LandingNavbar() {
  const navigate = useNavigate()

  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] bg-brand-background/80 backdrop-blur-xl border-b border-brand-outline-variant">
      <div className="max-w-container mx-auto flex justify-between items-center px-6 md:px-8 py-5">
        <Link
          to={ROUTES.HOME}
          className="font-display text-2xl font-extrabold text-brand tracking-tight no-underline"
        >
          RENTILO
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            to={ROUTES.AUTH.REGISTER}
            className="font-body text-sm font-bold text-brand no-underline border-b-2 border-brand pb-0.5"
          >
            Post Your Property
          </Link>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(ROUTES.AUTH.LOGIN)}
              className="border-0 bg-transparent font-body text-sm font-medium text-brand-on-surface-variant cursor-pointer hover:text-brand transition-colors"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => navigate(ROUTES.AUTH.REGISTER)}
              className="px-5 py-2.5 rounded-lg border-0 bg-brand text-white font-body text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity"
            >
              Sign Up
            </button>
          </div>
        </div>

        <div className="flex md:hidden items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(ROUTES.AUTH.LOGIN)}
            className="font-body text-sm font-medium text-brand border-0 bg-transparent cursor-pointer"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => navigate(ROUTES.AUTH.REGISTER)}
            className="px-4 py-2 rounded-lg border-0 bg-brand text-white font-body text-sm font-semibold cursor-pointer"
          >
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  )
}
