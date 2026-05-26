import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@shared/hooks/useAuth'
import { useEnableRole } from '@modules/auth/hooks/useEnableRole'
import { ROLES } from '@shared/constants/roles'
import { getRoleHome } from '@shared/constants/roleHome'
import { MaterialIcon } from './MaterialIcon'

export function EnableOwnerModeCard() {
  const navigate = useNavigate()
  const { hasRole, setActiveRole } = useAuth()
  const enableRole = useEnableRole()
  const [showSwitchPrompt, setShowSwitchPrompt] = useState(false)

  if (hasRole(ROLES.OWNER)) {
    return null
  }

  const handleEnable = () => {
    enableRole.mutate(ROLES.OWNER, {
      onSuccess: () => setShowSwitchPrompt(true),
    })
  }

  const handleSwitchToOwner = () => {
    setActiveRole(ROLES.OWNER)
    navigate(getRoleHome(ROLES.OWNER), { replace: true })
  }

  return (
    <section className="rounded-2xl border border-brand-outline-variant bg-gradient-to-br from-brand-container-low to-brand-container-lowest p-6 mb-8">
      <div className="flex items-start gap-4 max-sm:flex-col">
        <div className="w-12 h-12 rounded-xl bg-brand text-white flex items-center justify-center shrink-0">
          <MaterialIcon name="home_work" className="!text-2xl" />
        </div>
        <div className="flex-1">
          <h2 className="font-display text-lg font-extrabold text-brand mb-1">
            List a property?
          </h2>
          <p className="font-body text-sm text-brand-on-surface-variant leading-relaxed mb-4">
            Enable owner mode to post listings and manage tenants. You can switch between tenant
            and owner anytime from the header.
          </p>

          {showSwitchPrompt ? (
            <div className="flex flex-wrap gap-3">
              <p className="w-full font-body text-sm text-brand font-semibold">
                Owner mode enabled.
              </p>
              <button
                type="button"
                onClick={handleSwitchToOwner}
                className="px-5 py-2.5 rounded-lg border-0 bg-brand text-white font-body text-sm font-semibold cursor-pointer"
              >
                Switch to Owner
              </button>
              <button
                type="button"
                onClick={() => setShowSwitchPrompt(false)}
                className="px-5 py-2.5 rounded-lg border border-brand-outline-variant bg-brand-container-lowest text-brand font-body text-sm font-semibold cursor-pointer"
              >
                Stay as Tenant
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleEnable}
              disabled={enableRole.isPending}
              className="px-5 py-2.5 rounded-lg border-0 bg-brand text-white font-body text-sm font-semibold cursor-pointer disabled:opacity-60"
            >
              {enableRole.isPending ? 'Enabling…' : 'Enable Owner Mode'}
            </button>
          )}

          {enableRole.error && (
            <p className="mt-2 font-body text-sm text-red-600">
              Could not enable owner mode. Please try again.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
