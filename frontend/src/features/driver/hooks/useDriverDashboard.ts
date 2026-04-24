'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/fetch'
import { Trip, PageResponse } from '@/features/trips/types'
import { DriverDashboardStats } from '../types'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useMemo } from 'react'

export function useDriverDashboard() {
  const { user } = useAuthStore()

  const { data, isLoading, error } = useQuery({
    queryKey: ['driver-trips', user?.userId],
    queryFn: () => api.get<{ success: boolean; data: PageResponse<Trip> }>('/api/trips/driver'),
    enabled: !!user?.userId,
  })

  const trips = data?.data.content || []

  const dashboardData = useMemo(() => {
    const now = new Date()
    const todayStr = now.toDateString()
    
    // Sort all trips by time
    const sortedTrips = [...trips].sort((a, b) => 
      new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime()
    )

    // 1. Active Trip: Any trip currently IN_TRANSIT (regardless of date)
    const activeTrip = sortedTrips.find(trip => trip.status === 'IN_TRANSIT')

    // 2. Next Trip: The earliest SCHEDULED trip that is in the future
    const nextTrip = sortedTrips.find(trip => 
      trip.status === 'SCHEDULED' && new Date(trip.departureTime).getTime() > now.getTime()
    )

    // 3. Today's Schedule: Only trips that fall on the local today
    const todayTrips = sortedTrips.filter(trip => {
      const tripDate = new Date(trip.departureTime)
      return tripDate.toDateString() === todayStr
    })

    // 4. Stats: Based on today's trips
    const stats: DriverDashboardStats = {
      tripsToday: todayTrips.length,
      totalSeatsToday: todayTrips.reduce((acc, trip) => acc + (trip.seatsGenerated || 0), 0),
      boardedToday: 0,
    }

    return {
      todayTrips,
      activeTrip,
      nextTrip: activeTrip ? null : nextTrip,
      stats,
    }
  }, [trips])

  return {
    ...dashboardData,
    isLoading,
    error,
  }
}
