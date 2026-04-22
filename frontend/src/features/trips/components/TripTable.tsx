'use client'

import React from 'react'
import {
  Clock,
  Play,
  CheckCircle,
  XCircle,
  MoreVertical,
  Trash2,
} from 'lucide-react'
import { TripStatusBadge } from './TripStatusBadge'
import { TripCard } from './TripCard'
import type { Trip } from '@/features/trips/types'

interface TripTableProps {
  trips: Trip[]
  onStart: (tripId: string) => void
  onComplete: (tripId: string) => void
  onCancel: (tripId: string) => void
  onDelete: (tripId: string) => void
  busLookup: Record<string, string>
  routeLookup: Record<string, string>
}

export function TripTable({
  trips,
  onStart,
  onComplete,
  onCancel,
  onDelete,
  busLookup,
  routeLookup,
}: TripTableProps) {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block bg-surface-container-lowest rounded-3xl shadow-ambient overflow-visible">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant/10">
              {['Route', 'Bus', 'Departure', 'Duration', 'Seats', 'Status', 'Actions'].map(
                (h) => (
                  <th
                    key={h}
                    className={`text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-5 py-4 ${
                      h === 'Actions' ? 'text-right' : h === 'Seats' ? 'text-center' : 'text-left'
                    }`}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <TripTableRow
                key={trip.tripId}
                trip={trip}
                busLabel={busLookup[trip.busId]}
                routeLabel={routeLookup[trip.routeId]}
                onStart={onStart}
                onComplete={onComplete}
                onCancel={onCancel}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-3 md:hidden">
        {trips.map((trip) => (
          <TripCard
            key={trip.tripId}
            trip={trip}
            busLabel={busLookup[trip.busId]}
            routeLabel={routeLookup[trip.routeId]}
            onStart={onStart}
            onComplete={onComplete}
            onCancel={onCancel}
            onDelete={onDelete}
          />
        ))}
      </div>
    </>
  )
}

// ─── Table Row ──────────────────────────────────────────────────

function TripTableRow({
  trip,
  busLabel,
  routeLabel,
  onStart,
  onComplete,
  onCancel,
  onDelete,
}: {
  trip: Trip
  busLabel?: string
  routeLabel?: string
  onStart: (id: string) => void
  onComplete: (id: string) => void
  onCancel: (id: string) => void
  onDelete: (id: string) => void
}) {
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
    <tr className="border-b border-outline-variant/5 hover:bg-surface-container-low/50 transition-colors group">
      <td className="px-5 py-4">
        <span className="text-sm font-semibold text-on-surface">
          {routeLabel || trip.routeId.slice(0, 8) + '…'}
        </span>
      </td>
      <td className="px-5 py-4">
        <span className="text-sm font-medium text-on-surface-variant">
          {busLabel || trip.busId.slice(0, 8) + '…'}
        </span>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-1.5 text-sm text-on-surface-variant">
          <Clock className="h-3.5 w-3.5 text-primary" />
          <span className="font-medium">
            {dep.toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
            })}{' '}
            {dep.toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </td>
      <td className="px-5 py-4 text-sm text-on-surface-variant font-medium">
        {trip.expectedDurationMin
          ? `${Math.floor(trip.expectedDurationMin / 60)}h ${trip.expectedDurationMin % 60}m`
          : '—'}
      </td>
      <td className="px-5 py-4 text-center">
        <span className="inline-flex items-center rounded-lg bg-surface-container-low px-2 py-0.5 text-xs font-bold text-on-surface-variant">
          {trip.seatsGenerated ?? '—'}
        </span>
      </td>
      <td className="px-5 py-4">
        <TripStatusBadge status={trip.status} />
      </td>
      <td className="px-5 py-4 text-right">
        <div className="relative inline-block" ref={menuRef}>
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
                  Cancel
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
      </td>
    </tr>
  )
}
