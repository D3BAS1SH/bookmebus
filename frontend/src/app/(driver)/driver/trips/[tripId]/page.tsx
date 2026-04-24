import { ActiveTrip } from '@/features/trips'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Active Trip | BookMeBus Driver',
  description: 'Manage active trip and view passengers',
}

interface PageProps {
  params: Promise<{
    tripId: string
  }>
}

export default async function ActiveTripPage({ params }: PageProps) {
  const resolvedParams = await params
  
  return (
    <ActiveTrip tripId={resolvedParams.tripId} />
  )
}
