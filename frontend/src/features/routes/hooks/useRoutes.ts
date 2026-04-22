import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
  Route,
  Location,
  RouteApiResponse,
  CreateRouteInput,
  CreateLocationInput,
  RouteStopRequest,
} from '@/features/routes/types'

// ─── Query Keys ───────────────────────────────────────────────────

export const routeKeys = {
  all: ['routes'] as const,
  detail: (id: string) => ['routes', id] as const,
}

export const locationKeys = {
  all: ['locations'] as const,
}

// ─── Location Fetchers ────────────────────────────────────────────

async function fetchAllLocations(): Promise<Location[]> {
  const res = await fetch('/api/locations/all', { credentials: 'include' })
  const json: RouteApiResponse<Location[]> = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to fetch locations')
  }
  return json.data ?? []
}

async function createLocation(input: CreateLocationInput): Promise<Location> {
  const res = await fetch('/api/locations', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const json: RouteApiResponse<Location> = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to create location')
  }
  return json.data
}

// ─── Route Fetchers ───────────────────────────────────────────────

async function fetchOwnerRoutes(): Promise<Route[]> {
  const res = await fetch('/api/routes', { credentials: 'include' })
  const json: RouteApiResponse<Route[]> = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to fetch routes')
  }
  return json.data ?? []
}

async function fetchRouteById(routeId: string): Promise<Route> {
  const res = await fetch(`/api/routes/${routeId}`, { credentials: 'include' })
  const json: RouteApiResponse<Route> = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to fetch route')
  }
  return json.data
}

async function createRoute(input: CreateRouteInput): Promise<Route> {
  const res = await fetch('/api/routes', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const json: RouteApiResponse<Route> = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to create route')
  }
  return json.data
}

async function addStopsToRoute({
  routeId,
  ...input
}: { routeId: string } & { stops: RouteStopRequest[] }): Promise<Route> {
  const res = await fetch(`/api/routes/${routeId}/stops`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const json: RouteApiResponse<Route> = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to add stops')
  }
  return json.data
}

// ─── Location Hooks ───────────────────────────────────────────────

export function useAllLocations() {
  return useQuery({
    queryKey: locationKeys.all,
    queryFn: fetchAllLocations,
  })
}

export function useCreateLocation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: locationKeys.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create location')
    },
  })
}

// ─── Route Hooks ──────────────────────────────────────────────────

export function useOwnerRoutes() {
  return useQuery({
    queryKey: routeKeys.all,
    queryFn: fetchOwnerRoutes,
  })
}

export function useRouteDetail(routeId: string) {
  return useQuery({
    queryKey: routeKeys.detail(routeId),
    queryFn: () => fetchRouteById(routeId),
    enabled: !!routeId,
  })
}

export function useCreateRoute() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createRoute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routeKeys.all })
      toast.success('Route created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create route')
    },
  })
}

export function useAddStops() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addStopsToRoute,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: routeKeys.all })
      if (data?.routeId) {
        queryClient.invalidateQueries({
          queryKey: routeKeys.detail(data.routeId),
        })
      }
      toast.success('Stops added successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add stops')
    },
  })
}
