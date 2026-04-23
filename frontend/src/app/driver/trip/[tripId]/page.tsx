'use client'

import React, { useEffect, useState, useRef } from 'react'

interface DriverTrackerClientProps {
  tripId: string
}

export default function DriverTripTracker({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = React.use(params)
  
  const [status, setStatus] = useState<'IDLE' | 'TRANSMITTING' | 'ERROR'>('IDLE')
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const transmitLocation = () => {
      if (!navigator.geolocation) {
        setStatus('ERROR')
        setErrorMessage('Geolocation is not supported by your browser')
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          
          setCoords({ lat, lng })
          setStatus('TRANSMITTING')
          setErrorMessage('')

          try {
            const res = await fetch(`/api/v1/trips/${tripId}/location`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                latitude: lat,
                longitude: lng
              })
            })

            if (!res.ok) {
              throw new Error('BFF rejected location update')
            }
          } catch (error) {
            console.error('Failed to transmit location', error)
            setStatus('ERROR')
            setErrorMessage('Network error while transmitting location')
          }
        },
        (error) => {
          console.error('Geolocation error', error)
          setStatus('ERROR')
          setErrorMessage(error.message || 'GPS unavailable')
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      )
    }

    // Initial transmission
    transmitLocation()

    // Setup interval for every 8 seconds
    intervalRef.current = setInterval(transmitLocation, 8000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [tripId])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white text-center">
          <h1 className="text-2xl font-bold tracking-tight">Driver Tracker</h1>
          <p className="text-blue-100 text-sm mt-1">Trip ID: {tripId}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl border border-gray-100">
            {/* Status indicator */}
            <div className="flex items-center gap-3 mb-4">
              <span className="relative flex h-4 w-4">
                {status === 'TRANSMITTING' && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                )}
                <span 
                  className={`relative inline-flex rounded-full h-4 w-4 ${
                    status === 'TRANSMITTING' ? 'bg-green-500' : 
                    status === 'ERROR' ? 'bg-red-500' : 'bg-gray-400'
                  }`}
                ></span>
              </span>
              <span className="font-semibold text-gray-700 uppercase tracking-wider text-sm">
                {status === 'TRANSMITTING' ? 'Transmitting...' : 
                 status === 'ERROR' ? 'GPS Unavailable' : 'Waiting...'}
              </span>
            </div>

            {/* Coordinates */}
            {coords ? (
              <div className="w-full space-y-3 mt-2">
                <div className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center shadow-sm">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Latitude</span>
                  <span className="font-mono text-gray-800 font-medium">{coords.lat.toFixed(6)}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center shadow-sm">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Longitude</span>
                  <span className="font-mono text-gray-800 font-medium">{coords.lng.toFixed(6)}</span>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-gray-400 text-sm">
                Acquiring GPS signal...
              </div>
            )}

            {/* Error Message */}
            {status === 'ERROR' && errorMessage && (
              <div className="w-full mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
                {errorMessage}
              </div>
            )}
          </div>

          <p className="text-center text-xs text-gray-400">
            Location is transmitted every 8 seconds. Keep this page open while driving.
          </p>
        </div>
      </div>
    </div>
  )
}
