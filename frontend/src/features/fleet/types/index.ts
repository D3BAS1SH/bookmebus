import { z } from 'zod/v4'

// ─── Enums ────────────────────────────────────────────────────────

export const BUS_STATUSES = ['ACTIVE', 'MAINTENANCE', 'RETIRED', 'IDLE'] as const

export const BusStatus = {
  ACTIVE: 'ACTIVE',
  MAINTENANCE: 'MAINTENANCE',
  RETIRED: 'RETIRED',
  IDLE: 'IDLE',
} as const

export type BusStatus = (typeof BusStatus)[keyof typeof BusStatus]

// ─── Seat Layout ──────────────────────────────────────────────────

export const seatLayoutSchema = z.object({
  seatType: z.string(),       // e.g. "2+2", "2+1"
  rows: z.number(),
  leftCols: z.array(z.string()),   // e.g. ["A", "B"]
  rightCols: z.array(z.string()),  // e.g. ["C", "D"]
})

export type SeatLayout = z.infer<typeof seatLayoutSchema>

// ─── Bus Schema (matches backend response) ────────────────────────

export const busSchema = z.object({
  busId: z.string(),
  vehicleNumber: z.string(),
  registrationNumber: z.string(),
  pricePerKm: z.number(),
  seatLayout: seatLayoutSchema,
  status: z.enum(BUS_STATUSES),
  ownerId: z.string().optional(),
  ownerEmail: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type Bus = z.infer<typeof busSchema>

/** Derive total seat capacity from layout */
export function getBusCapacity(layout: SeatLayout): number {
  return layout.rows * (layout.leftCols.length + layout.rightCols.length)
}

// ─── Create / Update Schemas ──────────────────────────────────────

export const SEAT_TYPE_OPTIONS = ['2+2', '2+1', '1+1'] as const

export const createBusSchema = z.object({
  vehicleNumber: z
    .string()
    .min(1, 'Vehicle number is required')
    .max(20, 'Vehicle number is too long'),
  registrationNumber: z
    .string()
    .min(1, 'Registration number is required')
    .max(30, 'Registration number is too long'),
  pricePerKm: z
    .number({ error: 'Price per KM must be a number' })
    .min(0.01, 'Price must be greater than 0'),
  seatLayout: z.object({
    seatType: z.string().min(1, 'Seat type is required'),
    rows: z
      .number({ error: 'Rows must be a number' })
      .int('Rows must be a whole number')
      .min(1, 'Must have at least 1 row')
      .max(30, 'Rows cannot exceed 30'),
  }),
})

export type CreateBusInput = z.infer<typeof createBusSchema>

export const updateBusSchema = createBusSchema.partial()

export type UpdateBusInput = z.infer<typeof updateBusSchema>

export const updateBusStatusSchema = z.object({
  status: z.enum(BUS_STATUSES, { error: 'Invalid bus status' }),
})

export type UpdateBusStatusInput = z.infer<typeof updateBusStatusSchema>

// ─── API Response Wrapper ─────────────────────────────────────────

export interface BusApiResponse<T> {
  success: boolean
  message: string
  data: T
}
