import React, { Suspense } from 'react'
import { SeatSelection } from '@/features/traveler'

export const metadata = {
  title: 'Select Seat | BookMeBus',
  description: 'Choose your preferred seat and complete your booking.',
}

function SeatSelectionWrapper({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = React.use(params)
  return <SeatSelection tripId={tripId} />
}

export default function TripSeatPage({ params }: { params: Promise<{ tripId: string }> }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center">
          <div className="animate-pulse text-on-surface-variant font-medium">Loading seats...</div>
        </div>
      }
    >
      <SeatSelectionWrapper params={params} />
    </Suspense>
  )
}
