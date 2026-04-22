'use client'

import React from 'react'
import { Clock, Bus, Route, Play, CheckCircle, XCircle, MoreVertical, Trash2 } from 'lucide-react'
import { TripStatusBadge } from './TripStatusBadge'
import type { Trip } from '@/features/trips/types'

interface TripCardProps {
  trip: Trip
  onStart: (tripId: string) => void
  onComplete: (tripId: string) => void
  onCancel: (tripId: string) => void
  onDelete: (tripId: string) => void
  busLabel?: string
  routeLabel?: string
}

export function TripCard({
  trip,
  onStart,
  onComplete,
  onCancel,
  onDelete,
  busLabel,
  routeLabel,
}: TripCardProps) {
  const [showMenu, setShowMenu] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    if (showMenu) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showMenu])

  const dep = new Date(trip.departureTime)

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-ambient p-5 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="space-y-1">
          <TripStatusBadge status={trip.status} />
          <h3 className="text-sm font-bold text-on-surface mt-1.5">
            {routeLabel || trip.routeId.slice(0, 8) + '…'}
          </h3>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 z-20 w-40 rounded-xl bg-surface-container-lowest shadow-xl border border-outline-variant/10 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
              {trip.status === 'SCHEDULED' && (
                <button
                  onClick={() => { onStart(trip.tripId); setShowMenu(false) }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
                >
                  <Play className="h-3.5 w-3.5 text-emerald-600" />
                  Start Trip
                </button>
              )}
              {trip.status === 'IN_TRANSIT' && (
                <button
                  onClick={() => { onComplete(trip.tripId); setShowMenu(false) }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
                >
                  <CheckCircle className="h-3.5 w-3.5 text-blue-600" />
                  Complete
                </button>
              )}
              {(trip.status === 'SCHEDULED' || trip.status === 'IN_TRANSIT') && (
                <button
                  onClick={() => { onCancel(trip.tripId); setShowMenu(false) }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
                >
                  <XCircle className="h-3.5 w-3.5 text-amber-600" />
                  Cancel Trip
                </button>
              )}
              <button
                onClick={() => { onDelete(trip.tripId); setShowMenu(false) }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-error hover:bg-error/5 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 text-xs text-on-surface-variant">
        <div className="flex items-center gap-2">
          <Bus className="h-3.5 w-3.5 text-primary" />
          <span className="font-medium">{busLabel || trip.busId.slice(0, 8) + '…'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-primary" />
          <span className="font-medium">
            {dep.toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}{' '}
            at{' '}
            {dep.toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        {trip.expectedDurationMin && (
          <div className="flex items-center gap-2">
            <Route className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium">
              {Math.floor(trip.expectedDurationMin / 60)}h{' '}
              {trip.expectedDurationMin % 60}m
            </span>
          </div>
        )}
        {trip.seatsGenerated != null && (
          <div className="text-xs font-semibold text-primary/70 mt-1">
            {trip.seatsGenerated} seats
          </div>
        )}
      </div>
    </div>
  )
}
