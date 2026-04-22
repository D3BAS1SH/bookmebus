'use client'

import React, { useState, useMemo } from 'react'
import { Plus, Clock, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Pagination } from '@/components/ui/Pagination'
import { TripTable } from './TripTable'
import { TripTableSkeleton } from './TripTable.skeleton'
import { TripSchedulingForm } from './TripSchedulingForm'
import {
  useOwnerTrips,
  useCreateTrip,
  useTripStatusAction,
  useDeleteTrip,
} from '@/features/trips/hooks/useTrips'
import { useOwnerRoutes } from '@/features/routes/hooks/useRoutes'
import type { CreateTripInput } from '@/features/trips/types'

// Lightweight bus type (reuse fleet's)
interface Bus {
  busId: string
  registrationNumber: string
  vehicleNumber: string
  status: string
}

interface BusListApiResponse {
  success: boolean
  data: Bus[]
}

export function TripsPage() {
  const [page, setPage] = useState(0)
  const [isFormOpen, setIsFormOpen] = useState(false)

  // ─── Data ────────────────────────────────────────────────
  const { data: tripsPage, isLoading, isError, error, refetch } = useOwnerTrips(page)
  const { data: routes = [] } = useOwnerRoutes()
  const [buses, setBuses] = useState<Bus[]>([])
  const [busesLoaded, setBusesLoaded] = useState(false)

  // Fetch buses from existing BFF endpoint
  React.useEffect(() => {
    if (busesLoaded) return
    fetch('/api/buses', { credentials: 'include' })
      .then((r) => r.json())
      .then((json: BusListApiResponse) => {
        if (json.success && Array.isArray(json.data)) setBuses(json.data)
      })
      .catch(() => {})
      .finally(() => setBusesLoaded(true))
  }, [busesLoaded])

  const createMutation = useCreateTrip()
  const statusMutation = useTripStatusAction()
  const deleteMutation = useDeleteTrip()

  // ─── Lookup maps ─────────────────────────────────────────
  const busLookup = useMemo(() => {
    const map: Record<string, string> = {}
    for (const b of buses) map[b.busId] = b.registrationNumber
    return map
  }, [buses])

  const routeLookup = useMemo(() => {
    const map: Record<string, string> = {}
    for (const r of routes) map[r.routeId] = r.routeName
    return map
  }, [routes])

  // ─── Handlers ────────────────────────────────────────────
  function handleCreate(data: CreateTripInput) {
    createMutation.mutate(data, {
      onSuccess: () => setIsFormOpen(false),
    })
  }

  function handleStart(tripId: string) {
    statusMutation.mutate({ tripId, action: 'start' })
  }
  function handleComplete(tripId: string) {
    statusMutation.mutate({ tripId, action: 'complete' })
  }
  function handleCancel(tripId: string) {
    statusMutation.mutate({ tripId, action: 'cancel' })
  }
  function handleDelete(tripId: string) {
    if (confirm('Are you sure you want to delete this trip?')) {
      deleteMutation.mutate(tripId)
    }
  }

  const trips = tripsPage?.content ?? []
  const totalPages = tripsPage?.totalPages ?? 0
  const totalTrips = tripsPage?.totalElements ?? 0

  // ─── Stats ──────────────────────────────────────────────
  const scheduled = trips.filter((t) => t.status === 'SCHEDULED').length
  const inTransit = trips.filter((t) => t.status === 'IN_TRANSIT').length
  const completed = trips.filter((t) => t.status === 'COMPLETED').length

  // ─── Error State ────────────────────────────────────────
  if (isError) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <TripsHeader onSchedule={() => setIsFormOpen(true)} />
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-error/5 mb-6">
            <Clock className="h-8 w-8 text-error/40" />
          </div>
          <h3 className="text-lg font-display font-bold text-on-surface mb-2">
            Failed to load trips
          </h3>
          <p className="text-sm text-on-surface-variant max-w-sm mb-6">
            {error?.message || 'Something went wrong.'}
          </p>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  // ─── Render ─────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <TripsHeader onSchedule={() => setIsFormOpen(true)} />

      {/* Stats */}
      {totalTrips > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total Trips" value={totalTrips} color="text-primary" />
          <StatCard label="Scheduled" value={scheduled} color="text-blue-600" />
          <StatCard label="In Transit" value={inTransit} color="text-amber-600" />
          <StatCard
            label="Completed"
            value={completed}
            color="text-emerald-600"
            className="hidden md:block"
          />
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <TripTableSkeleton />
      ) : trips.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No trips scheduled"
          description="Schedule your first trip by assigning a bus and driver to a route."
          actionLabel="Schedule Trip"
          onAction={() => setIsFormOpen(true)}
        />
      ) : (
        <>
          <TripTable
            trips={trips}
            busLookup={busLookup}
            routeLookup={routeLookup}
            onStart={handleStart}
            onComplete={handleComplete}
            onCancel={handleCancel}
            onDelete={handleDelete}
          />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {/* Form Modal */}
      <TripSchedulingForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
        buses={buses}
        routes={routes}
      />
    </div>
  )
}

// ─── Sub-components ─────────────────────────────────────────────

function TripsHeader({ onSchedule }: { onSchedule: () => void }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-display font-bold text-on-surface">
          Trip Management
        </h1>
        <p className="text-on-surface-variant font-medium">
          Schedule, monitor, and manage your bus trips.
        </p>
      </div>
      <Button onClick={onSchedule} size="sm" className="self-start md:self-auto">
        <Plus className="h-4 w-4 mr-2" />
        Schedule Trip
      </Button>
    </div>
  )
}

function StatCard({
  label,
  value,
  color,
  className = '',
}: {
  label: string
  value: number
  color: string
  className?: string
}) {
  return (
    <div
      className={`rounded-2xl bg-surface-container-lowest p-4 shadow-ambient ${className}`}
    >
      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  )
}
