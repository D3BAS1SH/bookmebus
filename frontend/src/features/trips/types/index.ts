import { z } from 'zod/v4'

// ─── Trip Status ──────────────────────────────────────────────────

export const tripStatusValues = ['SCHEDULED', 'IN_TRANSIT', 'COMPLETED', 'CANCELED'] as const
export type TripStatus = (typeof tripStatusValues)[number]

// ─── Trip Response ────────────────────────────────────────────────

export const tripResponseSchema = z.object({
  tripId: z.string(),
  busId: z.string(),
  routeId: z.string(),
  driverId: z.string(),
  departureTime: z.string(),
  expectedDurationMin: z.number().optional(),
  status: z.enum(tripStatusValues),
  seatsGenerated: z.number().optional(),
  createdAt: z.string().optional(),
})

export type Trip = z.infer<typeof tripResponseSchema>

// ─── Create Trip Request ──────────────────────────────────────────

export const createTripSchema = z.object({
  busId: z.string().min(1, 'Bus is required'),
  routeId: z.string().min(1, 'Route is required'),
  driverId: z.string().min(1, 'Driver ID is required'),
  departureTime: z.string().min(1, 'Departure time is required'),
  expectedDurationMin: z.number().int().min(1, 'Duration must be at least 1 minute').optional(),
})

export type CreateTripInput = z.infer<typeof createTripSchema>

// ─── Update Trip Request (same shape as create) ──────────────────

export type UpdateTripInput = CreateTripInput

// ─── Page Response (from Spring Boot Pageable) ────────────────────

export interface PageResponse<T> {
  totalElements: number
  totalPages: number
  size: number
  content: T[]
  number: number
  first: boolean
  last: boolean
  numberOfElements: number
  empty: boolean
}

// ─── Driver ──────────────────────────────────────────────────────

export interface Driver {
  driverId: string
  fullName: string
  email: string
  phone: string
  role: string
}

// ─── Generic API wrapper ─────────────────────────────────────────

export interface TripApiResponse<T> {
  success: boolean
  message?: string
  data: T
}

// ─── Trip Passenger ──────────────────────────────────────────────

export interface TripPassenger {
  travelerName: string
  seatNumber: string
  boardingStopName: string
  dropoffStopName: string
  didBoard: boolean
  bookingStatus: string
}
