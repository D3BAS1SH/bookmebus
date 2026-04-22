'use client'

import React from 'react'
import { MapPin, Navigation, MoreVertical, Eye, Plus } from 'lucide-react'
import type { Route } from '@/features/routes/types'

interface RouteCardProps {
  route: Route
  onViewStops: (route: Route) => void
  onAddStops: (route: Route) => void
}

export function RouteCard({ route, onViewStops, onAddStops }: RouteCardProps) {
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

  const stops = route.stops ?? []
  const sorted = [...stops].sort((a, b) => a.sequenceOrder - b.sequenceOrder)
  const origin = sorted[0]?.locationName ?? '—'
  const dest = sorted.length > 1 ? sorted[sorted.length - 1].locationName ?? '—' : '—'

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-ambient p-5 hover:shadow-lg transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Navigation className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-on-surface">{route.routeName}</h3>
            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mt-0.5">
              <MapPin className="h-3 w-3 text-emerald-500" />
              <span>{origin}</span>
              <span className="text-on-surface-variant/40">→</span>
              <MapPin className="h-3 w-3 text-rose-500" />
              <span>{dest}</span>
            </div>
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            aria-label="Route actions"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 z-20 w-44 rounded-xl bg-surface-container-lowest shadow-xl border border-outline-variant/10 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
              <button
                onClick={() => { onViewStops(route); setShowMenu(false) }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
              >
                <Eye className="h-3.5 w-3.5 text-on-surface-variant" />
                View Stops
              </button>
              <button
                onClick={() => { onAddStops(route); setShowMenu(false) }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
              >
                <Plus className="h-3.5 w-3.5 text-on-surface-variant" />
                Add Stops
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-on-surface-variant">
        <span className="font-semibold">{stops.length} stops</span>
        {sorted.length > 1 && sorted[sorted.length - 1].distanceFromOrigin != null && (
          <span className="font-semibold">
            {sorted[sorted.length - 1].distanceFromOrigin} km
          </span>
        )}
      </div>
    </div>
  )
}
