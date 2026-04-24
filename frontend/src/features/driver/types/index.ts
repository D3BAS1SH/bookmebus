import { z } from 'zod/v4'
import { Trip, TripPassenger } from '@/features/trips/types'

export interface DriverDashboardStats {
  tripsToday: number
  totalSeatsToday: number
  boardedToday: number
}

export interface BoardingStatus {
  totalBookings: number
  boardedCount: number
  percentage: number
}

export type TripWithBoarding = Trip & {
  boardingStatus?: BoardingStatus
}
