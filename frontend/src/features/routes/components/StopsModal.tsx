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
  onAddStop: (routeId: string, stop: RouteStopRequest) => void
  isLoading: boolean
  locations: Location[]
}

export function StopsModal({
  open,
  onClose,
  route,
  onAddStop,
  isLoading,
  locations,
}: StopsModalProps) {
  const [locationId, setLocationId] = useState('')
  const [sequenceOrder, setSequenceOrder] = useState<number>(1)
  const [distanceFromOrigin, setDistanceFromOrigin] = useState('')
  const [boardingPoint, setBoardingPoint] = useState(true)
  const [droppingPoint, setDroppingPoint] = useState(true)
  const [error, setError] = useState('')

  // Update defaults when route changes
  React.useEffect(() => {
    if (route) {
      const nextSequence = (route.stops?.length ?? 0) + 1
      setSequenceOrder(nextSequence)
      // Default: If adding at the end, it's typically a dropping point
      // If in between, both are true.
      if (nextSequence > 1) {
        setBoardingPoint(true)
        setDroppingPoint(true)
      }
    }
  }, [route])

  // Automatic boarding/dropping point logic
  React.useEffect(() => {
    if (!route) return
    const existingCount = route.stops?.length ?? 0
    
    // If sequenceOrder is between 1 and existingCount+1 (inclusive)
    // If it's 1, it's the new origin.
    // If it's existingCount + 1, it's the new destination.
    // "In between" means sequenceOrder > 1 AND sequenceOrder <= existingCount
    // Wait, the user said: "If the sequenece number is in between of the route stops then the both(boarding and droppoff point) should be true."
    
    if (sequenceOrder > 1 && sequenceOrder <= existingCount) {
      setBoardingPoint(true)
      setDroppingPoint(true)
    }
  }, [sequenceOrder, route])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!locationId.trim()) {
      setError('Please select a location.')
      return
    }

    if (!route) return

    const stopRequest: RouteStopRequest = {
      locationId: locationId.trim(),
      sequenceOrder,
      distanceFromOrigin: distanceFromOrigin ? Number(distanceFromOrigin) : 0,
      boardingPoint,
      droppingPoint,
    }

    onAddStop(route.routeId, stopRequest)
  }

  function handleClose() {
    if (!isLoading) {
      setLocationId('')
      setDistanceFromOrigin('')
      setError('')
      onClose()
    }
  }

  const existingStops = [...(route?.stops ?? [])].sort((a, b) => a.sequenceOrder - b.sequenceOrder)

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={route ? `Add Stop — ${route.routeName}` : 'Add Stop'}
      description="Add a new stop to this route by specifying location and sequence."
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Existing stops visualization (mini) */}
        {existingStops.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Existing Route
            </p>
            <div className="flex flex-wrap gap-1.5">
              {existingStops.map((s, i) => (
                <div key={i} className="flex items-center gap-1 px-2 py-1 bg-surface-container rounded-lg border border-outline-variant/10">
                  <span className="text-[10px] font-bold text-primary">{s.sequenceOrder}</span>
                  <span className="text-[10px] font-medium text-on-surface truncate max-w-[80px]">
                    {s.locationName || s.locationId}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4 rounded-2xl bg-surface-container-low p-4">
          {error && (
            <div className="rounded-xl bg-error-container/10 border border-error/20 px-4 py-2.5 text-xs text-error font-medium mb-2">
              {error}
            </div>
          )}

          {/* Location Selection */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant pointer-events-none" />
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
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

          <div className="grid grid-cols-2 gap-4">
            {/* Sequence Order */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">
                Sequence Order
              </label>
              <Input
                type="number"
                min={1}
                max={(route?.stops?.length ?? 0) + 1}
                value={sequenceOrder}
                onChange={(e) => setSequenceOrder(Number(e.target.value))}
                disabled={isLoading}
                className="bg-surface-container-lowest"
              />
            </div>

            {/* Distance */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">
                Dist from Origin (km)
              </label>
              <div className="relative">
                <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant pointer-events-none" />
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  placeholder="0"
                  value={distanceFromOrigin}
                  onChange={(e) => setDistanceFromOrigin(e.target.value)}
                  disabled={isLoading}
                  className="w-full rounded-xl bg-surface-container-lowest border border-outline-variant/20 pl-9 pr-3 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Points */}
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={boardingPoint}
                  onChange={(e) => setBoardingPoint(e.target.checked)}
                  disabled={isLoading}
                  className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary transition-all cursor-pointer disabled:opacity-50"
                />
              </div>
              <span className="text-xs font-semibold text-on-surface-variant group-hover:text-primary transition-colors">
                Boarding Point
              </span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={droppingPoint}
                  onChange={(e) => setDroppingPoint(e.target.checked)}
                  disabled={isLoading}
                  className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary transition-all cursor-pointer disabled:opacity-50"
                />
              </div>
              <span className="text-xs font-semibold text-on-surface-variant group-hover:text-primary transition-colors">
                Dropping Point
              </span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="px-8">
            {isLoading ? 'Saving…' : 'Add Stop'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
