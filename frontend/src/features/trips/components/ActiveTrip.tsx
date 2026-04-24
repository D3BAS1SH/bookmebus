'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ChevronLeft, 
  Play, 
  Square, 
  ScanLine, 
  Clock, 
  MapPin, 
  Users, 
  AlertCircle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react'
import { TripStatusBadge } from './TripStatusBadge'
import { ActiveTripSkeleton } from './ActiveTrip.skeleton'
import { 
  useDriverTrips, 
  useTripPassengers, 
  useTripStatusAction, 
  useUpdateTripLocation 
} from '@/features/trips'

export function ActiveTrip({ tripId }: { tripId: string }) {
  const router = useRouter()
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'transmitting' | 'error'>('idle')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // 1. Fetch Driver Trips (unconditional)
  const { 
    data: tripsRes, 
    isLoading: isTripsLoading, 
    isError: isTripsError, 
    error: tripsError,
    refetch: refetchTrips
  } = useDriverTrips()
  
  const trips = tripsRes?.content || []

  // 2. Derive the target trip (logic in component body, not conditional hooks)
  const trip = tripId === 'active' 
    ? trips.find(t => t.status === 'IN_TRANSIT') 
    : trips.find(t => t.tripId === tripId)

  // 3. Fetch Passengers for the derived trip (unconditional hook, conditional execution via 'enabled')
  const { 
    data: passengers = [], 
    isLoading: isPassengersLoading,
  } = useTripPassengers(trip?.tripId)

  // 4. Status Action Mutation
  const statusMutation = useTripStatusAction()
  
  // 5. GPS Location Mutation
  const locationMutation = useUpdateTripLocation()

  // GPS Transmitter logic
  const startTransmitting = () => {
    setGpsStatus('transmitting')
    intervalRef.current = setInterval(() => {
      if (!navigator.geolocation) {
        setGpsStatus('error')
        return
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (!trip?.tripId) return
          
          locationMutation.mutate({
            tripId: trip.tripId,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          }, {
            onError: () => setGpsStatus('error'),
            onSuccess: () => setGpsStatus('transmitting')
          })
        },
        (err) => {
          console.warn('GPS error:', err)
          setGpsStatus('error')
        },
        { enableHighAccuracy: true, timeout: 5000 }
      )
    }, 8000)
  }

  const stopTransmitting = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setGpsStatus('idle')
  }

  // Manage GPS lifecycle based on status
  useEffect(() => {
    if (trip?.status === 'IN_TRANSIT') {
      startTransmitting()
    } else {
      stopTransmitting()
    }

    return () => stopTransmitting()
  }, [trip?.status, trip?.tripId])

  const handleStatusChange = async (newStatus: 'IN_TRANSIT' | 'COMPLETED', action: 'start' | 'complete') => {
    if (!trip?.tripId) return
    
    if (newStatus === 'COMPLETED') {
      const confirm = window.confirm("Are you sure you want to complete this trip?")
      if (!confirm) return
    }

    statusMutation.mutate({
      tripId: trip.tripId,
      action
    })
  }

  // Loading States
  if (isTripsLoading) {
    return <ActiveTripSkeleton />
  }

  // Error States or Not Found
  if (isTripsError || (tripId !== 'active' && !trip && !isTripsLoading)) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 text-center space-y-4">
        <div className="bg-rose-50 text-rose-700 p-8 rounded-2xl border border-rose-200">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h3 className="font-display font-bold text-xl">
            {isTripsError ? 'Failed to load trips' : 'Trip not found'}
          </h3>
          <p className="text-sm mt-2 opacity-80 max-w-xs mx-auto">
            {isTripsError ? tripsError?.message : 'The requested trip could not be found in your assigned trips.'}
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <button 
              onClick={() => refetchTrips()}
              className="px-4 py-2 bg-white text-rose-700 rounded-lg shadow-sm border border-rose-200 font-medium hover:bg-rose-50 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <Link 
              href="/driver/trips"
              className="px-4 py-2 bg-rose-600 text-white rounded-lg shadow-sm font-medium hover:bg-rose-700"
            >
              View My Trips
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // No Active Trip Found
  if (tripId === 'active' && !trip) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 text-center space-y-4">
        <div className="bg-slate-50 text-slate-700 p-12 rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
            <MapPin className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="font-display font-bold text-2xl text-slate-900">No active trip found</h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto">
            You don't have any trips currently in transit. Check your schedule for upcoming trips.
          </p>
          <Link 
            href="/driver/trips"
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
          >
            Go to My Trips
          </Link>
        </div>
      </div>
    )
  }

  // At this point, 'trip' is guaranteed to exist
  const currentTrip = trip!
  const boardedCount = passengers.filter(p => p.didBoard).length
  const totalCount = passengers.length

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 md:p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Link 
        href="/driver/trips" 
        className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors group"
      >
        <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
        Back to Trips
      </Link>

      {/* Top Section */}
      <div className="bg-white rounded-2xl shadow-ambient border border-slate-200 p-6 md:p-8 space-y-6 overflow-hidden relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-display font-bold text-slate-900">Trip Configuration</h1>
              <TripStatusBadge status={currentTrip.status} />
            </div>
            <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
              <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest bg-slate-100 px-2 py-0.5 rounded">ID</span> 
              <span className="font-mono text-slate-700">{currentTrip.tripId}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {currentTrip.status === 'SCHEDULED' && (
              <button
                onClick={() => handleStatusChange('IN_TRANSIT', 'start')}
                disabled={statusMutation.isPending}
                className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 disabled:opacity-50 text-on-primary rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
              >
                <Play className="w-5 h-5 fill-current" />
                {statusMutation.isPending ? 'Starting...' : 'Start Trip'}
              </button>
            )}

            {currentTrip.status === 'IN_TRANSIT' && (
              <button
                onClick={() => handleStatusChange('COMPLETED', 'complete')}
                disabled={statusMutation.isPending}
                className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-lg shadow-rose-600/20"
              >
                <Square className="w-5 h-5 fill-current" />
                {statusMutation.isPending ? 'Completing...' : 'Complete Trip'}
              </button>
            )}
            
            {currentTrip.status === 'COMPLETED' && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-bold border border-emerald-100 shadow-sm">
                <CheckCircle2 className="w-5 h-5" />
                Trip Completed
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-slate-100">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">Departure</p>
            <p className="text-slate-900 font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              {new Date(currentTrip.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">Duration</p>
            <p className="text-slate-900 font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              {currentTrip.expectedDurationMin ? `${currentTrip.expectedDurationMin} min` : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">Total Seats</p>
            <p className="text-slate-900 font-bold flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              {currentTrip.seatsGenerated || 0}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">GPS Status</p>
            {currentTrip.status === 'IN_TRANSIT' ? (
              <div className="flex items-center gap-2">
                {gpsStatus === 'transmitting' ? (
                  <span className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    Transmitting
                  </span>
                ) : gpsStatus === 'error' ? (
                  <span className="inline-flex items-center gap-1.5 text-rose-600 font-bold text-sm bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                    <AlertCircle className="w-4 h-4" />
                    Unavailable
                  </span>
                ) : (
                  <span className="text-slate-500 font-bold text-sm italic">Starting...</span>
                )}
              </div>
            ) : (
              <span className="text-slate-400 text-sm font-bold bg-slate-50 px-3 py-1 rounded-full border border-slate-100">Inactive</span>
            )}
          </div>
        </div>
      </div>

      {/* Passengers Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Users className="w-5 h-5 text-slate-600" />
              </div>
              Passenger Manifest
            </h2>
            <div className="flex items-center gap-3 px-1">
              <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500" 
                  style={{ width: `${totalCount ? (boardedCount / totalCount) * 100 : 0}%` }}
                />
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
                {boardedCount} / {totalCount} Boarded
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => router.push(`/driver/trips/${currentTrip.tripId}/scan`)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-slate-900/10 active:scale-95"
          >
            <ScanLine className="w-5 h-5" />
            Boarding Scanner
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-ambient border border-slate-200 overflow-hidden transition-all hover:shadow-lg">
          {isPassengersLoading ? (
            <div className="p-12 text-center space-y-3">
              <RefreshCw className="w-10 h-10 mx-auto text-slate-200 animate-spin" />
              <p className="text-slate-400 font-medium">Loading manifest...</p>
            </div>
          ) : passengers.length === 0 ? (
            <div className="p-12 text-center text-slate-500 bg-slate-50/50">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                <Users className="w-8 h-8 text-slate-200" />
              </div>
              <p className="font-bold text-slate-900">No passengers booked yet</p>
              <p className="text-sm text-slate-400 mt-1">Passenger list will appear here once bookings are made.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {passengers.map((p, idx) => (
                <div key={idx} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors group">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900 group-hover:text-primary transition-colors">{p.travelerName}</span>
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 text-[10px] font-black rounded-full border border-slate-200 uppercase tracking-tighter">
                        Seat {p.seatNumber}
                      </span>
                    </div>
                    <div className="flex items-center text-sm font-medium text-slate-500 gap-2">
                      <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate max-w-[120px] sm:max-w-none" title={p.boardingStopName}>
                          {p.boardingStopName}
                        </span>
                      </div>
                      <span className="text-slate-300 font-bold">→</span>
                      <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                        <span className="truncate max-w-[120px] sm:max-w-none" title={p.dropoffStopName}>
                          {p.dropoffStopName}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    {p.didBoard ? (
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-100 shadow-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        Boarded
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 text-slate-400 font-bold text-xs rounded-full border border-slate-200">
                        <Clock className="w-4 h-4" />
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
