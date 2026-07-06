import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@shared/constants/routes'
import { MaterialIcon } from './MaterialIcon'

/**
 * Persistent navigation bar shown above tenant sub-pages.
 * - Back: goes one step back in browser history.
 * - Home: jumps straight to the properties listing screen (tenant home).
 */
export function TenantHomeBackBar() {
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-2 mb-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 rounded-lg border-0 bg-transparent px-2 py-1.5 text-body font-semibold text-brand-secondary hover:text-brand hover:bg-brand-container-low transition-colors cursor-pointer"
        aria-label="Go back"
      >
        <MaterialIcon name="arrow_back" className="!text-[20px]" />
        Back
      </button>

      <span className="h-4 w-px bg-brand-container-low" aria-hidden="true" />

      <button
        type="button"
        onClick={() => navigate(ROUTES.TENANT.LISTINGS)}
        className="inline-flex items-center gap-1.5 rounded-lg border-0 bg-transparent px-2 py-1.5 text-body font-semibold text-brand-secondary hover:text-brand hover:bg-brand-container-low transition-colors cursor-pointer"
        aria-label="Go to home"
      >
        <MaterialIcon name="home" className="!text-[20px]" />
        Home
      </button>
    </div>
  )
}
