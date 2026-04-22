'use client'

import React, { useState } from 'react'
import { Navigation, MapPin, Ruler, Plus, X, ArrowUp, ArrowDown } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { Location, CreateRouteInput, RouteStopRequest } from '@/features/routes/types'

interface RouteFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateRouteInput) => void
  isLoading: boolean
  locations: Location[]
}

interface StopFormEntry {
  locationId: string
  distanceFromOrigin: string
  boardingPoint: boolean
  droppingPoint: boolean
}

function emptyStop(): StopFormEntry {
  return { locationId: '', distanceFromOrigin: '', boardingPoint: true, droppingPoint: true }
}

export function RouteFormModal({
  open,
  onClose,
  onSubmit,
  isLoading,
  locations,
}: RouteFormModalProps) {
  const [routeName, setRouteName] = useState('')
  const [stops, setStops] = useState<StopFormEntry[]>([
    { ...emptyStop(), droppingPoint: false }, // origin
    { ...emptyStop(), boardingPoint: false }, // destination
  ])
  const [errors, setErrors] = useState<{ routeName?: string; stops?: string }>({})

  function resetForm() {
    setRouteName('')
    setStops([
      { ...emptyStop(), droppingPoint: false },
      { ...emptyStop(), boardingPoint: false },
    ])
    setErrors({})
  }

  function handleAddStop() {
    // Insert new stop before the last entry (destination)
    const updated = [...stops]
    updated.splice(stops.length - 1, 0, emptyStop())
    setStops(updated)
  }

  function handleRemoveStop(idx: number) {
    if (stops.length <= 2) return // keep origin + destination
    setStops(stops.filter((_, i) => i !== idx))
  }

  function handleMoveStop(idx: number, direction: 'up' | 'down') {
    const newIdx = direction === 'up' ? idx - 1 : idx + 1
    if (newIdx < 0 || newIdx >= stops.length) return
    const updated = [...stops]
    ;[updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]]
    setStops(updated)
  }

  function handleStopChange(idx: number, field: keyof StopFormEntry, value: string | boolean) {
    setStops(stops.map((s, i) => (i === idx ? { ...s, [field]: value } : s)))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    const name = routeName.trim()
    if (!name) {
      setErrors({ routeName: 'Route name is required' })
      return
    }

    // Validate stops
    const emptyLocations = stops.filter((s) => !s.locationId)
    if (emptyLocations.length > 0) {
      setErrors({ stops: 'All stops must have a location selected' })
      return
    }

    if (stops.length < 2) {
      setErrors({ stops: 'At least 2 stops required (origin + destination)' })
      return
    }

    const routeStops: RouteStopRequest[] = stops.map((s, i) => ({
      locationId: s.locationId,
      sequenceOrder: i + 1,
      distanceFromOrigin: s.distanceFromOrigin ? Number(s.distanceFromOrigin) : 0,
      boardingPoint: s.boardingPoint,
      droppingPoint: s.droppingPoint,
    }))

    onSubmit({ routeName: name, routeStops })
  }

  function handleClose() {
    if (!isLoading) {
      resetForm()
      onClose()
    }
  }

  function getLocationLabel(locId: string): string {
    const loc = locations.find((l) => l.locationId === locId)
    return loc ? loc.locationName : ''
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Create Route"
      description="Define a route with ordered stops. The first stop is the origin and the last is the destination."
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Route Name */}
        <div className="space-y-1">
          <Input
            icon={<Navigation className="h-5 w-5" />}
            label="Route Name"
            placeholder="e.g. Bhubaneswar-Berhampur"
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
            disabled={isLoading}
          />
          {errors.routeName && (
            <p className="text-xs text-error pl-6 font-medium">{errors.routeName}</p>
          )}
        </div>

        {/* Stops */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Route Stops ({stops.length})
            </p>
            <button
              type="button"
              onClick={handleAddStop}
              className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              disabled={isLoading}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Intermediate Stop
            </button>
          </div>

          {errors.stops && (
            <div className="rounded-xl bg-error-container/10 border border-error/20 px-4 py-2 text-sm text-error font-medium">
              {errors.stops}
            </div>
          )}

          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
            {stops.map((stop, idx) => {
              const isOrigin = idx === 0
              const isDestination = idx === stops.length - 1
              const label = isOrigin
                ? '🟢 Origin'
                : isDestination
                  ? '🔴 Destination'
                  : `Stop ${idx}`

              return (
                <div
                  key={idx}
                  className="rounded-xl bg-surface-container-low p-3 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-on-surface">{label}</span>
                    <div className="flex items-center gap-1">
                      {!isOrigin && (
                        <button
                          type="button"
                          onClick={() => handleMoveStop(idx, 'up')}
                          className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                          disabled={isLoading}
                          title="Move up"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {!isDestination && (
                        <button
                          type="button"
                          onClick={() => handleMoveStop(idx, 'down')}
                          className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                          disabled={isLoading}
                          title="Move down"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {!isOrigin && !isDestination && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStop(idx)}
                          className="p-1 rounded text-on-surface-variant hover:text-error hover:bg-error/5 transition-colors"
                          disabled={isLoading}
                          title="Remove stop"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-[1fr_100px] gap-2">
                    {/* Location Picker */}
                    <div>
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1 block">
                        Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant pointer-events-none" />
                        <select
                          value={stop.locationId}
                          onChange={(e) => handleStopChange(idx, 'locationId', e.target.value)}
                          disabled={isLoading}
                          className="w-full rounded-xl bg-surface-container-lowest border border-outline-variant/20 pl-9 pr-3 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors appearance-none cursor-pointer disabled:opacity-50"
                        >
                          <option value="">Select location…</option>
                          {locations.map((loc) => (
                            <option key={loc.locationId} value={loc.locationId}>
                              {loc.locationName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Distance */}
                    <div>
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1 block">
                        Dist (km)
                      </label>
                      <div className="relative">
                        <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant pointer-events-none" />
                        <input
                          type="number"
                          step="0.1"
                          min={0}
                          placeholder="0"
                          value={stop.distanceFromOrigin}
                          onChange={(e) => handleStopChange(idx, 'distanceFromOrigin', e.target.value)}
                          disabled={isLoading || isOrigin}
                          className="w-full rounded-xl bg-surface-container-lowest border border-outline-variant/20 pl-9 pr-3 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Boarding / Dropping toggles */}
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={stop.boardingPoint}
                        onChange={(e) => handleStopChange(idx, 'boardingPoint', e.target.checked)}
                        disabled={isLoading}
                        className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                      />
                      <span className="text-xs font-medium text-on-surface-variant">
                        Boarding
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={stop.droppingPoint}
                        onChange={(e) => handleStopChange(idx, 'droppingPoint', e.target.checked)}
                        disabled={isLoading}
                        className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                      />
                      <span className="text-xs font-medium text-on-surface-variant">
                        Dropping
                      </span>
                    </label>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating…' : 'Create Route'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
