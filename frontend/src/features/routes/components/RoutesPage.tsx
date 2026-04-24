'use client'

import React, { useState } from 'react'
import { Plus, Navigation, RefreshCw, MapPinPlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { RouteTable } from './RouteTable'
import { RouteTableSkeleton } from './RouteTable.skeleton'
import { RouteFormModal } from './RouteFormModal'
import { LocationFormModal } from './LocationFormModal'
import { LocationList } from './LocationList'
import { StopsModal } from './StopsModal'
import {
  useOwnerRoutes,
  useCreateRoute,
  useCreateLocation,
  useAddStops,
  useAllLocations,
} from '@/features/routes/hooks/useRoutes'
import type { Route, CreateRouteInput, CreateLocationInput, RouteStopRequest } from '@/features/routes/types'
import { toast } from 'sonner'

export function RoutesPage() {
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false)
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
  const [stopsRoute, setStopsRoute] = useState<Route | null>(null)
  const [isStopsModalOpen, setIsStopsModalOpen] = useState(false)

  // ─── Data ──────────────────────────────────────────────────
  const { data: routes, isLoading, isError, error, refetch } = useOwnerRoutes()
  const { data: locations = [], isLoading: locationsLoading } = useAllLocations()
  const createRouteMutation = useCreateRoute()
  const createLocationMutation = useCreateLocation()
  const addStopsMutation = useAddStops()

  // ─── Handlers ──────────────────────────────────────────────

  function handleCreateRoute(data: CreateRouteInput) {
    createRouteMutation.mutate(data, {
      onSuccess: () => setIsRouteModalOpen(false),
    })
  }

  function handleCreateLocation(data: CreateLocationInput) {
    createLocationMutation.mutate(data, {
      onSuccess: (location) => {
        toast.success(`Location "${location.locationName}" created!`, {
          duration: 5000,
        })
        setIsLocationModalOpen(false)
      },
    })
  }

  function handleViewStops(route: Route) {
    setStopsRoute(route)
    setIsStopsModalOpen(true)
  }

  function handleOpenAddStops(route: Route) {
    setStopsRoute(route)
    setIsStopsModalOpen(true)
  }

  function handleAddStop(routeId: string, stop: RouteStopRequest) {
    addStopsMutation.mutate(
      { routeId, ...stop },
      {
        onSuccess: () => {
          setIsStopsModalOpen(false)
          setStopsRoute(null)
        },
      }
    )
  }

  // ─── Error State ───────────────────────────────────────────
  if (isError) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <RoutesHeader
          onAddRoute={() => setIsRouteModalOpen(true)}
          onAddLocation={() => setIsLocationModalOpen(true)}
        />
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-error/5 mb-6">
            <Navigation className="h-8 w-8 text-error/40" />
          </div>
          <h3 className="text-lg font-display font-bold text-on-surface mb-2">
            Failed to load routes
          </h3>
          <p className="text-sm text-on-surface-variant max-w-sm mb-6">
            {error?.message || 'Something went wrong. Please try again.'}
          </p>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  // ─── Render ────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <RoutesHeader
        onAddRoute={() => setIsRouteModalOpen(true)}
        onAddLocation={() => setIsLocationModalOpen(true)}
      />

      {/* Stats */}
      {routes && routes.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-ambient">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
              Total Routes
            </p>
            <p className="text-2xl font-bold text-primary">{routes.length}</p>
          </div>
          <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-ambient">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
              Total Stops
            </p>
            <p className="text-2xl font-bold text-emerald-600">
              {routes.reduce((acc, r) => acc + (r.stops?.length ?? 0), 0)}
            </p>
          </div>
          <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-ambient hidden md:block">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
              Locations
            </p>
            <p className="text-2xl font-bold text-amber-600">
              {locations.length}
            </p>
          </div>
        </div>
      )}

      {/* Locations List */}
      <LocationList locations={locations} isLoading={locationsLoading} />

      {/* Routes Content */}
      {isLoading ? (
        <RouteTableSkeleton />
      ) : !routes || routes.length === 0 ? (
        <EmptyState
          icon={Navigation}
          title="No routes defined"
          description="Create locations first, then define routes between them."
          actionLabel="Create Route"
          onAction={() => setIsRouteModalOpen(true)}
        />
      ) : (
        <RouteTable
          routes={routes}
          onViewStops={handleViewStops}
          onAddStops={handleOpenAddStops}
        />
      )}

      {/* Modals */}
      <RouteFormModal
        open={isRouteModalOpen}
        onClose={() => setIsRouteModalOpen(false)}
        onSubmit={handleCreateRoute}
        isLoading={createRouteMutation.isPending}
        locations={locations}
      />

      <LocationFormModal
        open={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSubmit={handleCreateLocation}
        isLoading={createLocationMutation.isPending}
      />

      <StopsModal
        open={isStopsModalOpen}
        onClose={() => {
          setIsStopsModalOpen(false)
          setStopsRoute(null)
        }}
        route={stopsRoute}
        onAddStop={handleAddStop}
        isLoading={addStopsMutation.isPending}
        locations={locations}
      />
    </div>
  )
}

// ─── Sub-component: Page Header ────────────────────────────────────

function RoutesHeader({
  onAddRoute,
  onAddLocation,
}: {
  onAddRoute: () => void
  onAddLocation: () => void
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-display font-bold text-on-surface">
          Route Management
        </h1>
        <p className="text-on-surface-variant font-medium">
          Define routes and manage stops for your bus services.
        </p>
      </div>
      <div className="flex items-center gap-2 self-start md:self-auto">
        <Button onClick={onAddLocation} variant="outline" size="sm">
          <MapPinPlus className="h-4 w-4 mr-2" />
          Add Location
        </Button>
        <Button onClick={onAddRoute} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Create Route
        </Button>
      </div>
    </div>
  )
}
