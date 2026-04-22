'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Toaster } from 'sonner'
import { useAuthStore } from '@/features/auth/store/authStore'

/** Hydrates the auth session on app mount */
function AuthHydrator({ children }: { children: React.ReactNode }) {
  const checkSession = useAuthStore((s) => s.checkSession)

  useEffect(() => {
    checkSession()
  }, [checkSession])

  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <AuthHydrator>
        {children}
      </AuthHydrator>
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  )
}
