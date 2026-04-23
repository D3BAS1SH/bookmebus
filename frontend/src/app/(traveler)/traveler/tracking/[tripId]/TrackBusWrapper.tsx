'use client'

import dynamic from 'next/dynamic'

const TrackBusClient = dynamic(() => import('./TrackBusClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-sans">
      <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <div className="text-gray-500 font-medium animate-pulse">Initializing map tracking...</div>
    </div>
  ),
})

export default function TrackBusWrapper({ tripId }: { tripId: string }) {
  return <TrackBusClient tripId={tripId} />
}
