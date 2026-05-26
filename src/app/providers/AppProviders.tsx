import React from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@app/queryClient'

interface AppProvidersProps {
  children: React.ReactNode
}

/**
 * Wraps the app with all necessary providers.
 * Add future providers (Theme, Toast, etc.) here.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
