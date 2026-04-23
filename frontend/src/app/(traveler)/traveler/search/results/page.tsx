import React, { Suspense } from 'react'
import { TripResults } from '@/features/traveler'

export const metadata = {
  title: 'Trip Results | BookMeBus',
  description: 'Browse available bus trips for your selected route and date.',
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center">
          <div className="animate-pulse text-on-surface-variant font-medium">Loading results...</div>
        </div>
      }
    >
      <TripResults />
    </Suspense>
  )
}
