import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
  Location,
  Route,
  TripSearchResult,
  TripSeat,
  Booking,
  BookingRequest,
  Bus,
  PageResponse,
  ApiResponse,
} from '@/features/traveler/types'

// ─── Query Keys ───────────────────────────────────────────────────

export const travelerKeys = {
  locations: ['traveler', 'locations'] as const,
  routes: ['traveler', 'routes'] as const,
  routeDetail: (id: string) => ['traveler', 'routes', id] as const,
  tripSearch: (routeId: string, date: string, page: number) =>
    ['traveler', 'trips', 'search', routeId, date, page] as const,
  segmentSearch: (originId: string, destId: string, date: string, page: number) =>
    ['traveler', 'trips', 'segment', originId, destId, date, page] as const,
  seats: (tripId: string, boardingStopId?: string, dropoffStopId?: string) =>
    ['traveler', 'seats', tripId, boardingStopId, dropoffStopId] as const,
  busDetail: (busId: string) => ['traveler', 'bus', busId] as const,
  bookings: ['traveler', 'bookings'] as const,
  bookingList: (page: number) => ['traveler', 'bookings', 'list', page] as const,
  bookingDetail: (id: string) => ['traveler', 'bookings', id] as const,
}

// ─── Fetchers ─────────────────────────────────────────────────────

async function fetchAllLocations(): Promise<Location[]> {
  const res = await fetch('/api/locations/all', { credentials: 'include' })
  const json: ApiResponse<Location[]> = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || 'Failed to fetch locations')
  return json.data
}

async function fetchPublicRoutes(): Promise<Route[]> {
  const res = await fetch('/api/routes/public', { credentials: 'include' })
  const json: ApiResponse<Route[]> = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || 'Failed to fetch routes')
  return json.data
}

async function fetchRouteDetail(routeId: string): Promise<Route> {
  const res = await fetch(`/api/routes/${routeId}`, { credentials: 'include' })
  const json: ApiResponse<Route> = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || 'Failed to fetch route')
  return json.data
}

async function searchTrips(
  routeId: string,
  date: string,
  page = 0,
  size = 10
): Promise<PageResponse<TripSearchResult>> {
  const res = await fetch(
    `/api/trips/search?routeId=${routeId}&date=${date}&page=${page}&size=${size}`,
    { credentials: 'include' }
  )
  const json: ApiResponse<PageResponse<TripSearchResult>> = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || 'Failed to search trips')
  return json.data
}

async function searchTripsBySegment(
  originLocationId: string,
  destinationLocationId: string,
  date: string,
  page = 0,
  size = 10
): Promise<PageResponse<TripSearchResult>> {
  const res = await fetch(
    `/api/trips/search/segment?originLocationId=${originLocationId}&destinationLocationId=${destinationLocationId}&date=${date}&page=${page}&size=${size}`,
    { credentials: 'include' }
  )
  const json: ApiResponse<PageResponse<TripSearchResult>> = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || 'Failed to search trips')
  return json.data
}

async function fetchSeats(
  tripId: string,
  boardingLocationId?: string,
  dropoffLocationpId?: string
): Promise<TripSeat[]> {
  const params = new URLSearchParams()
  if (boardingLocationId) params.set('boardingLocationId', boardingLocationId)
  if (dropoffLocationpId) params.set('dropoffLocationpId', dropoffLocationpId)
  const qs = params.toString()
  const url = `/api/trips/${tripId}/seats${qs ? `?${qs}` : ''}`
  const res = await fetch(url, { credentials: 'include' })
  const json: ApiResponse<TripSeat[]> = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || 'Failed to fetch seats')
  return json.data
}

async function fetchBusDetail(busId: string): Promise<Bus> {
  const res = await fetch(`/api/buses/${busId}`, { credentials: 'include' })
  const json: ApiResponse<Bus> = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || 'Failed to fetch bus')
  return json.data
}

async function createBooking(input: BookingRequest): Promise<Booking> {
  const res = await fetch('/api/bookings', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const json: ApiResponse<Booking> = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || 'Failed to create booking')
  return json.data
}

async function fetchMyBookings(page = 0, size = 10): Promise<PageResponse<Booking>> {
  const res = await fetch(`/api/bookings?page=${page}&size=${size}&sort=bookedAt,desc`, {
    credentials: 'include',
  })
  const json: ApiResponse<PageResponse<Booking>> = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || 'Failed to fetch bookings')
  return json.data
}

async function fetchBookingDetail(bookingId: string): Promise<Booking> {
  const res = await fetch(`/api/bookings/${bookingId}`, { credentials: 'include' })
  const json: ApiResponse<Booking> = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || 'Failed to fetch booking')
  return json.data
}

async function cancelBooking(bookingId: string): Promise<void> {
  const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
    method: 'PATCH',
    credentials: 'include',
  })
  const json = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || 'Failed to cancel booking')
}

async function generateTicket(bookingId: string): Promise<Booking> {
  const res = await fetch(`/api/tickets/${bookingId}`, {
    method: 'POST',
    credentials: 'include',
  })
  const json: ApiResponse<Booking> = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || 'Failed to generate ticket')
  return json.data
}

// ─── Hooks ────────────────────────────────────────────────────────

export function useAllLocations() {
  return useQuery({
    queryKey: travelerKeys.locations,
    queryFn: fetchAllLocations,
    staleTime: 5 * 60 * 1000,
  })
}

export function usePublicRoutes() {
  return useQuery({
    queryKey: travelerKeys.routes,
    queryFn: fetchPublicRoutes,
    staleTime: 5 * 60 * 1000,
  })
}

export function useRouteDetail(routeId: string) {
  return useQuery({
    queryKey: travelerKeys.routeDetail(routeId),
    queryFn: () => fetchRouteDetail(routeId),
    enabled: !!routeId,
  })
}

export function useTripSearch(routeId: string, date: string, page = 0, enabled = true) {
  return useQuery({
    queryKey: travelerKeys.tripSearch(routeId, date, page),
    queryFn: () => searchTrips(routeId, date, page),
    enabled: enabled && !!routeId && !!date,
  })
}

export function useSegmentSearch(
  originLocationId: string,
  destinationLocationId: string,
  date: string,
  page = 0,
  enabled = true
) {
  return useQuery({
    queryKey: travelerKeys.segmentSearch(originLocationId, destinationLocationId, date, page),
    queryFn: () => searchTripsBySegment(originLocationId, destinationLocationId, date, page),
    enabled: enabled && !!originLocationId && !!destinationLocationId && !!date,
  })
}

export function useTripSeats(
  tripId: string,
  boardingLocationId?: string,
  dropoffLocationpId?: string
) {
  return useQuery({
    queryKey: travelerKeys.seats(tripId, boardingLocationId, dropoffLocationpId),
    queryFn: () => fetchSeats(tripId, boardingLocationId, dropoffLocationpId),
    enabled: !!tripId,
  })
}

export function useBusDetail(busId: string) {
  return useQuery({
    queryKey: travelerKeys.busDetail(busId),
    queryFn: () => fetchBusDetail(busId),
    enabled: !!busId,
  })
}

export function useMyBookings(page = 0) {
  return useQuery({
    queryKey: travelerKeys.bookingList(page),
    queryFn: () => fetchMyBookings(page),
  })
}

export function useBookingDetail(bookingId: string) {
  return useQuery({
    queryKey: travelerKeys.bookingDetail(bookingId),
    queryFn: () => fetchBookingDetail(bookingId),
    enabled: !!bookingId,
  })
}

export function useCreateBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: travelerKeys.bookings })
      toast.success('Booking confirmed! 🎉')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create booking')
    },
  })
}

export function useCancelBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: travelerKeys.bookings })
      toast.success('Booking cancelled')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to cancel booking')
    },
  })
}

export function useGenerateTicket() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: generateTicket,
    onSuccess: (_data, bookingId) => {
      queryClient.invalidateQueries({ queryKey: travelerKeys.bookingDetail(bookingId) })
      toast.success('Ticket generated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to generate ticket')
    },
  })
}
