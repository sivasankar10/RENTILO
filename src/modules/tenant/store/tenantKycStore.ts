import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type TenantKycStatus = 'pending' | 'verified'

export interface TenantKycDocument {
  aadhaarMasked: string
  verifiedAt: string
  referenceId: string
}

interface TenantKycState {
  status: TenantKycStatus
  document: TenantKycDocument | null
  isVerified: () => boolean
  setVerified: (aadhaarRaw: string) => void
  resetKyc: () => void
}

function maskAadhaar(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.length < 4) return 'XXXX XXXX XXXX'
  return `XXXX XXXX ${digits.slice(-4)}`
}

export const useTenantKycStore = create<TenantKycState>()(
  persist(
    (set, get) => ({
      status: 'pending',
      document: null,

      isVerified: () => get().status === 'verified',

      setVerified: (aadhaarRaw) => {
        const verifiedAt = new Date().toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })
        set({
          status: 'verified',
          document: {
            aadhaarMasked: maskAadhaar(aadhaarRaw),
            verifiedAt,
            referenceId: `TNT-KYC-${Date.now().toString().slice(-6)}`,
          },
        })
      },

      resetKyc: () => set({ status: 'pending', document: null }),
    }),
    {
      name: 'rentilo-tenant-kyc-session',
      storage: createJSONStorage(() => sessionStorage),
      version: 1,
    },
  ),
)
