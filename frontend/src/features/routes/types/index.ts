import { z } from 'zod/v4'

// ─── Location ─────────────────────────────────────────────────────

export const locationSchema = z.object({
  locationId: z.string(),
  locationName: z.string(),
  latitude: z.number(),
  longitude: z.number(),
})

export type Location = z.infer<typeof locationSchema>

export const createLocationSchema = z.object({
  locationName: z.string().min(1, 'Location name is required').max(100, 'Too long'),
  latitude: z.number({ error: 'Latitude is required' }).min(-90).max(90),
  longitude: z.number({ error: 'Longitude is required' }).min(-180).max(180),
})

export type CreateLocationInput = z.infer<typeof createLocationSchema>

// ─── Route Stop ───────────────────────────────────────────────────

/** Backend response shape for a stop inside a route */
export const routeStopResponseSchema = z.object({
  routeStopId: z.string(),
  routeId: z.string(),
  locationId: z.string(),
  locationName: z.string().optional(),
  sequenceOrder: z.number(),
  distanceFromOrigin: z.number().optional(),
  boardingPoint: z.boolean(),
  droppingPoint: z.boolean(),
})

export type RouteStopResponse = z.infer<typeof routeStopResponseSchema>

/** Request shape when creating a stop */
export const routeStopRequestSchema = z.object({
  locationId: z.string().min(1, 'Location is required'),
  sequenceOrder: z.number().int().min(1),
  distanceFromOrigin: z.number().min(0).optional(),
  boardingPoint: z.boolean(),
  droppingPoint: z.boolean(),
})

export type RouteStopRequest = z.infer<typeof routeStopRequestSchema>

// ─── Route ────────────────────────────────────────────────────────

export const routeResponseSchema = z.object({
  routeId: z.string(),
  routeName: z.string(),
  ownerId: z.string().optional(),
  stops: z.array(routeStopResponseSchema).optional(),
  createdAt: z.string().optional(),
})

export type Route = z.infer<typeof routeResponseSchema>

// ─── Create Route ─────────────────────────────────────────────────

export const createRouteSchema = z.object({
  routeName: z
    .string()
    .min(1, 'Route name is required')
    .max(100, 'Route name is too long'),
  routeStops: z
    .array(routeStopRequestSchema)
    .min(2, 'At least 2 stops are required (origin + destination)'),
})

export type CreateRouteInput = z.infer<typeof createRouteSchema>

// ─── Add Stop (to existing route) ───────────────────────────────
export type AddStopInput = RouteStopRequest & { routeId: string }

// ─── API Response wrapper ────────────────────────────────────────

export interface RouteApiResponse<T> {
  success: boolean
  message: string
  data: T
}
