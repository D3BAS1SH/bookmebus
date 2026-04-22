'use client'

import React, { useState } from 'react'
import { Bus, Route, User, Calendar, Clock } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { createTripSchema, type CreateTripInput } from '@/features/trips/types'
import type { Route as RouteType } from '@/features/routes/types'
import { z } from 'zod/v4'

interface Bus {
  busId: string
  registrationNumber: string
  vehicleNumber: string
  status: string
}

interface TripSchedulingFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateTripInput) => void
  isLoading: boolean
  buses: Bus[]
  routes: RouteType[]
}

interface FieldError {
  busId?: string
  routeId?: string
  driverId?: string
  departureTime?: string
  expectedDurationMin?: string
}

export function TripSchedulingForm({
  open,
  onClose,
  onSubmit,
  isLoading,
  buses,
  routes,
}: TripSchedulingFormProps) {
  const [busId, setBusId] = useState('')
  const [routeId, setRouteId] = useState('')
  const [driverId, setDriverId] = useState('')
  const [departureTime, setDepartureTime] = useState('')
  const [expectedDurationMin, setExpectedDurationMin] = useState('')
  const [errors, setErrors] = useState<FieldError>({})

  function resetForm() {
    setBusId('')
    setRouteId('')
    setDriverId('')
    setDepartureTime('')
    setExpectedDurationMin('')
    setErrors({})
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    const parsed = createTripSchema.safeParse({
      busId,
      routeId,
      driverId: driverId.trim(),
      departureTime: departureTime ? new Date(departureTime).toISOString() : '',
      expectedDurationMin: expectedDurationMin
        ? Number(expectedDurationMin)
        : undefined,
    })

    if (!parsed.success) {
      const fieldErrors: FieldError = {}
      const flat = z.flattenError(parsed.error)
      if (flat.fieldErrors.busId?.[0]) fieldErrors.busId = flat.fieldErrors.busId[0]
      if (flat.fieldErrors.routeId?.[0]) fieldErrors.routeId = flat.fieldErrors.routeId[0]
      if (flat.fieldErrors.driverId?.[0]) fieldErrors.driverId = flat.fieldErrors.driverId[0]
      if (flat.fieldErrors.departureTime?.[0]) fieldErrors.departureTime = flat.fieldErrors.departureTime[0]
      if (flat.fieldErrors.expectedDurationMin?.[0])
        fieldErrors.expectedDurationMin = flat.fieldErrors.expectedDurationMin[0]
      setErrors(fieldErrors)
      return
    }

    onSubmit(parsed.data)
  }

  function handleClose() {
    if (!isLoading) {
      resetForm()
      onClose()
    }
  }

  const activeBuses = buses.filter((b) => b.status === 'ACTIVE')

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Schedule Trip"
      description="Assign a bus and driver to a route with a departure time."
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Bus Selector */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            Bus
          </label>
          <div className="relative">
            <Bus className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant pointer-events-none" />
            <select
              value={busId}
              onChange={(e) => setBusId(e.target.value)}
              disabled={isLoading}
              className="w-full rounded-xl bg-surface-container-lowest border border-outline-variant/20 pl-10 pr-4 py-3 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors appearance-none cursor-pointer disabled:opacity-50"
            >
              <option value="">Select a bus…</option>
              {activeBuses.map((bus) => (
                <option key={bus.busId} value={bus.busId}>
                  {bus.registrationNumber} ({bus.vehicleNumber})
                </option>
              ))}
            </select>
          </div>
          {errors.busId && (
            <p className="text-xs text-error font-medium">{errors.busId}</p>
          )}
        </div>

        {/* Route Selector */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            Route
          </label>
          <div className="relative">
            <Route className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant pointer-events-none" />
            <select
              value={routeId}
              onChange={(e) => setRouteId(e.target.value)}
              disabled={isLoading}
              className="w-full rounded-xl bg-surface-container-lowest border border-outline-variant/20 pl-10 pr-4 py-3 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors appearance-none cursor-pointer disabled:opacity-50"
            >
              <option value="">Select a route…</option>
              {routes.map((r) => (
                <option key={r.routeId} value={r.routeId}>
                  {r.routeName}
                </option>
              ))}
            </select>
          </div>
          {errors.routeId && (
            <p className="text-xs text-error font-medium">{errors.routeId}</p>
          )}
        </div>

        {/* Driver ID */}
        <div className="space-y-1">
          <Input
            icon={<User className="h-5 w-5" />}
            label="Driver ID (UUID)"
            placeholder="e.g. f47ac10b-58cc-4372-a567-0e02b2c3d479"
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
            disabled={isLoading}
          />
          {errors.driverId && (
            <p className="text-xs text-error pl-6 font-medium">{errors.driverId}</p>
          )}
        </div>

        {/* Departure Time */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            Departure Time
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant pointer-events-none" />
            <input
              type="datetime-local"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              disabled={isLoading}
              className="w-full rounded-xl bg-surface-container-lowest border border-outline-variant/20 pl-10 pr-4 py-3 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors disabled:opacity-50"
            />
          </div>
          {errors.departureTime && (
            <p className="text-xs text-error font-medium">{errors.departureTime}</p>
          )}
        </div>

        {/* Duration */}
        <div className="space-y-1">
          <Input
            icon={<Clock className="h-5 w-5" />}
            label="Expected Duration (minutes)"
            type="number"
            placeholder="e.g. 180"
            value={expectedDurationMin}
            onChange={(e) => setExpectedDurationMin(e.target.value)}
            disabled={isLoading}
          />
          {errors.expectedDurationMin && (
            <p className="text-xs text-error pl-6 font-medium">
              {errors.expectedDurationMin}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Scheduling…' : 'Schedule Trip'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
