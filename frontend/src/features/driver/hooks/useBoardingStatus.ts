'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/fetch'
import { TripPassenger } from '@/features/trips/types'
import { BoardingStatus } from '../types'
import { useMemo } from 'react'

export function useBoardingStatus(tripId?: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['trip-bookings', tripId],
    queryFn: () => api.get<{ success: boolean; data: TripPassenger[] }>(`/api/bookings/trip/${tripId}`),
    enabled: !!tripId,
  })

  const boardingStatus = useMemo((): BoardingStatus | null => {
    if (!data?.data) return null

    const passengers = data.data
    const total = passengers.length
    const boarded = passengers.filter(p => p.didBoard).length
    const percentage = total > 0 ? Math.round((boarded / total) * 100) : 0

    return {
      totalBookings: total,
      boardedCount: boarded,
      percentage,
    }
  }, [data])

  return {
    boardingStatus,
    isLoading,
    error,
  }
}
