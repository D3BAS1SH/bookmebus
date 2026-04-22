'use client'

import React, { useState } from 'react'
import { MapPin, Ruler } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { Route, Location, RouteStopRequest } from '@/features/routes/types'

interface StopsModalProps {
  open: boolean
  onClose: () => void
  route: Route | null
  onAddStops: (routeId: string, stops: RouteStopRequest[]) => void
  isLoading: boolean
  locations: Location[]
}

interface StopInput {
  locationId: string
  distanceFromOrigin: string
  boardingPoint: boolean
  droppingPoint: boolean
}

export function StopsModal({
  open,
  onClose,
  route,
  onAddStops,
  isLoading,
  locations,
}: StopsModalProps) {
  const [newStops, setNewStops] = useState<StopInput[]>([
    { locationId: '', distanceFromOrigin: '', boardingPoint: true, droppingPoint: true },
  ])
  const [error, setError] = useState('')

  function handleAddRow() {
    setNewStops([
      ...newStops,
      { locationId: '', distanceFromOrigin: '', boardingPoint: true, droppingPoint: true },
    ])
  }

  function handleRemoveRow(index: number) {
    if (newStops.length <= 1) return
    setNewStops(newStops.filter((_, i) => i !== index))
  }

  function handleChange(index: number, field: keyof StopInput, value: string | boolean) {
    setNewStops(
      newStops.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const existingCount = route?.stops?.length ?? 0

    const validStops: RouteStopRequest[] = newStops
      .filter((s) => s.locationId.trim())
      .map((s, i) => ({
        locationId: s.locationId.trim(),
        sequenceOrder: existingCount + i + 1,
        distanceFromOrigin: s.distanceFromOrigin ? Number(s.distanceFromOrigin) : 0,
        boardingPoint: s.boardingPoint,
        droppingPoint: s.droppingPoint,
      }))

    if (validStops.length === 0) {
      setError('Add at least one stop with a valid location selected.')
      return
    }

    if (!route) return
    onAddStops(route.routeId, validStops)
  }

  function handleClose() {
    if (!isLoading) {
      setNewStops([
        { locationId: '', distanceFromOrigin: '', boardingPoint: true, droppingPoint: true },
      ])
      setError('')
      onClose()
    }
  }

  const existingStops = route?.stops ?? []

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={route ? `Stops — ${route.routeName}` : 'Route Stops'}
      description={
        existingStops.length > 0
          ? `${existingStops.length} existing stops. Add more below.`
          : 'No stops yet. Add the first stop below.'
      }
      maxWidth="max-w-xl"
    >
      {/* Existing stops */}
      {existingStops.length > 0 && (
        <div className="mb-4 space-y-2">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            Current Stops
          </p>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {[...existingStops]
              .sort((a, b) => a.sequenceOrder - b.sequenceOrder)
              .map((stop, i) => (
                <div
                  key={stop.routeStopId || i}
                  className="flex items-center gap-3 rounded-xl bg-surface-container-low px-4 py-2.5"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                    {stop.sequenceOrder}
                  </span>
                  <div className="flex-1 text-sm">
                    <span className="font-medium text-on-surface">
                      {stop.locationName || stop.locationId}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-on-surface-variant mt-0.5">
                      {stop.boardingPoint && (
                        <span className="text-emerald-600 font-semibold">Boarding</span>
                      )}
                      {stop.droppingPoint && (
                        <span className="text-rose-500 font-semibold">Dropping</span>
                      )}
                    </div>
                  </div>
                  {stop.distanceFromOrigin != null && (
                    <span className="text-xs text-on-surface-variant font-semibold">
                      {stop.distanceFromOrigin} km
                    </span>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Add New Stops Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
          Add New Stops
        </p>

        {error && (
          <div className="rounded-xl bg-error-container/10 border border-error/20 px-4 py-2.5 text-sm text-error font-medium">
            {error}
          </div>
        )}

        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {newStops.map((stop, i) => (
            <div
              key={i}
              className="rounded-xl bg-surface-container-low p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface">
                  Stop #{(route?.stops?.length ?? 0) + i + 1}
                </span>
                {newStops.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(i)}
                    className="text-on-surface-variant hover:text-error transition-colors text-lg font-bold px-1"
                    disabled={isLoading}
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="grid grid-cols-[1fr_80px] gap-2">
                <div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant pointer-events-none" />
                    <select
                      value={stop.locationId}
                      onChange={(e) => handleChange(i, 'locationId', e.target.value)}
                      disabled={isLoading}
                      className="w-full rounded-xl bg-surface-container-lowest border border-outline-variant/20 pl-9 pr-3 py-2 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors appearance-none cursor-pointer disabled:opacity-50"
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
                <div className="relative">
                  <Ruler className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant pointer-events-none" />
                  <input
                    type="number"
                    step="0.1"
                    min={0}
                    placeholder="km"
                    value={stop.distanceFromOrigin}
                    onChange={(e) => handleChange(i, 'distanceFromOrigin', e.target.value)}
                    disabled={isLoading}
                    className="w-full rounded-xl bg-surface-container-lowest border border-outline-variant/20 pl-8 pr-2 py-2 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stop.boardingPoint}
                    onChange={(e) => handleChange(i, 'boardingPoint', e.target.checked)}
                    disabled={isLoading}
                    className="h-3.5 w-3.5 rounded border-outline-variant text-primary focus:ring-primary"
                  />
                  <span className="text-[11px] font-medium text-on-surface-variant">Boarding</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stop.droppingPoint}
                    onChange={(e) => handleChange(i, 'droppingPoint', e.target.checked)}
                    disabled={isLoading}
                    className="h-3.5 w-3.5 rounded border-outline-variant text-primary focus:ring-primary"
                  />
                  <span className="text-[11px] font-medium text-on-surface-variant">Dropping</span>
                </label>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddRow}
          className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          disabled={isLoading}
        >
          + Add another stop
        </button>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving…' : 'Add Stops'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
