// Trips feature barrel exports
export { TripsPage } from './components/TripsPage'
export { TripTable } from './components/TripTable'
export { TripTableSkeleton } from './components/TripTable.skeleton'
export { TripCard } from './components/TripCard'
export { TripStatusBadge } from './components/TripStatusBadge'
export { TripSchedulingForm } from './components/TripSchedulingForm'

// Re-export types
export type {
  Trip,
  TripStatus,
  Driver,
  CreateTripInput,
  UpdateTripInput,
  PageResponse,
} from './types'

// Re-export hooks
export {
  useOwnerTrips,
  useTripDetail,
  useCreateTrip,
  useUpdateTrip,
  useDeleteTrip,
  useTripStatusAction,
  useDrivers,
} from './hooks/useTrips'
