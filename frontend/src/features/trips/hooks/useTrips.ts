import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
  Trip,
  Driver,
  PageResponse,
  TripApiResponse,
  CreateTripInput,
  UpdateTripInput,
  TripPassenger,
} from '@/features/trips/types'

// ─── Query Keys ───────────────────────────────────────────────────

export const tripKeys = {
  all: ['trips'] as const,
  list: (page: number, size: number) => ['trips', 'list', page, size] as const,
  driverList: () => ['trips', 'driver'] as const,
  detail: (id: string) => ['trips', id] as const,
  drivers: ['drivers'] as const,
}

// ─── Fetchers ─────────────────────────────────────────────────────

async function fetchOwnerTrips(
  page = 0,
  size = 10
): Promise<PageResponse<Trip>> {
  const res = await fetch(`/api/trips?page=${page}&size=${size}`, {
    credentials: 'include',
  })
  const json: TripApiResponse<PageResponse<Trip>> = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to fetch trips')
  }
  return json.data
}

async function fetchTripById(tripId: string): Promise<Trip> {
  const res = await fetch(`/api/trips/${tripId}`, { credentials: 'include' })
  const json: TripApiResponse<Trip> = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to fetch trip')
  }
  return json.data
}

async function fetchDriverTrips({ pageParam = 0 }): Promise<PageResponse<Trip>> {
  const res = await fetch(`/api/trips/driver?page=${pageParam}&size=20`, {
    credentials: 'include',
  })
  const json: TripApiResponse<PageResponse<Trip>> = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to fetch driver trips')
  }
  return json.data
}

async function createTrip(input: CreateTripInput): Promise<Trip> {
  const res = await fetch('/api/trips', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const json: TripApiResponse<Trip> = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to create trip')
  }
  return json.data
}

async function updateTrip({
  tripId,
  ...input
}: UpdateTripInput & { tripId: string }): Promise<Trip> {
  const res = await fetch(`/api/trips/${tripId}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const json: TripApiResponse<Trip> = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to update trip')
  }
  return json.data
}

async function deleteTrip(tripId: string): Promise<void> {
  const res = await fetch(`/api/trips/${tripId}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  const json = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to delete trip')
  }
}

async function changeTripStatus({
  tripId,
  action,
}: {
  tripId: string
  action: 'start' | 'complete' | 'cancel'
}): Promise<Trip | null> {
  const res = await fetch(`/api/trips/${tripId}/status`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action }),
  })
  const json: TripApiResponse<Trip | null> = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.message || `Failed to ${action} trip`)
  }
  return json.data
}

async function fetchDrivers(): Promise<Driver[]> {
  const res = await fetch('/api/drivers', { credentials: 'include' })
  const json: TripApiResponse<Driver[]> = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to fetch drivers')
  }
  return json.data
}

async function fetchTripPassengers(tripId: string): Promise<TripPassenger[]> {
  const res = await fetch(`/api/bookings/trip/${tripId}`, { credentials: 'include' })
  const json: TripApiResponse<TripPassenger[]> = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to fetch passengers')
  }
  return json.data
}

async function updateTripLocation({
  tripId,
  latitude,
  longitude,
}: {
  tripId: string
  latitude: number
  longitude: number
}): Promise<void> {
  const res = await fetch(`/api/trips/${tripId}/location`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ latitude, longitude }),
  })
  if (!res.ok) {
    const json = await res.json().catch(() => ({}))
    throw new Error(json.message || 'Failed to update location')
  }
}

// ─── Hooks ────────────────────────────────────────────────────────

export function useDrivers() {
  return useQuery({
    queryKey: tripKeys.drivers,
    queryFn: fetchDrivers,
  })
}

export function useOwnerTrips(page = 0, size = 10) {
  return useQuery({
    queryKey: tripKeys.list(page, size),
    queryFn: () => fetchOwnerTrips(page, size),
  })
}

export function useInfiniteDriverTrips() {
  return useInfiniteQuery({
    queryKey: tripKeys.driverList(),
    queryFn: fetchDriverTrips,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.number < lastPage.totalPages - 1) {
        return lastPage.number + 1
      }
      return undefined
    },
  })
}

export function useTripDetail(tripId: string) {
  return useQuery({
    queryKey: tripKeys.detail(tripId),
    queryFn: () => fetchTripById(tripId),
    enabled: !!tripId,
  })
}

export function useCreateTrip() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.all })
      toast.success('Trip scheduled successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create trip')
    },
  })
}

export function useUpdateTrip() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateTrip,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: tripKeys.all })
      if (data?.tripId) {
        queryClient.invalidateQueries({ queryKey: tripKeys.detail(data.tripId) })
      }
      toast.success('Trip updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update trip')
    },
  })
}

export function useDeleteTrip() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.all })
      toast.success('Trip deleted')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete trip')
    },
  })
}

export function useTripStatusAction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: changeTripStatus,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: tripKeys.all })
      const labels = { start: 'started', complete: 'completed', cancel: 'cancelled' }
      toast.success(`Trip ${labels[variables.action]} successfully`)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update trip status')
    },
  })
}

export function useDriverTrips() {
  return useQuery({
    queryKey: tripKeys.driverList(),
    queryFn: () => fetchDriverTrips({ pageParam: 0 }),
  })
}

export function useTripPassengers(tripId: string | undefined) {
  return useQuery({
    queryKey: [...tripKeys.detail(tripId || ''), 'passengers'],
    queryFn: () => fetchTripPassengers(tripId!),
    enabled: !!tripId,
  })
}

export function useUpdateTripLocation() {
  return useMutation({
    mutationFn: updateTripLocation,
  })
}
