// Trips feature barrel exports
export { TripsPage } from './components/TripsPage'
export { TripTable } from './components/TripTable'
export { TripTableSkeleton } from './components/TripTable.skeleton'
export { TripCard } from './components/TripCard'
export { TripStatusBadge } from './components/TripStatusBadge'
export { TripSchedulingForm } from './components/TripSchedulingForm'
export { DriverTripsList } from './components/DriverTripsList'
export { DriverTripsListSkeleton } from './components/DriverTripsList.skeleton'
export { ActiveTrip } from './components/ActiveTrip'
export { BoardingScanner } from './components/BoardingScanner'
export { ActiveTripSkeleton } from './components/ActiveTrip.skeleton'
export { BoardingScannerSkeleton } from './components/BoardingScanner.skeleton'

// Re-export types
export type {
  Trip,
  TripStatus,
  Driver,
  CreateTripInput,
  UpdateTripInput,
  PageResponse,
  TripPassenger,
} from './types'

// Re-export hooks
export {
  useOwnerTrips,
  useDriverTrips,
  useInfiniteDriverTrips,
  useTripDetail,
  useTripPassengers,
  useCreateTrip,
  useUpdateTrip,
  useDeleteTrip,
  useTripStatusAction,
  useUpdateTripLocation,
  useDrivers,
} from './hooks/useTrips'
