import { Suspense } from 'react'
import { DriverTripsList, DriverTripsListSkeleton } from '@/features/trips'

export const metadata = {
  title: 'My Trips | BookMeBus Driver',
  description: 'View and manage your assigned trips',
}

export default function DriverTripsPage() {
  return (
    <Suspense fallback={<DriverTripsListSkeleton />}>
      <DriverTripsList />
    </Suspense>
  )
}
