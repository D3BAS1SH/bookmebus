'use client'

import React from 'react'
import { Navigation, MapPin, MoreVertical, Eye, Plus } from 'lucide-react'
import { RouteCard } from './RouteCard'
import type { Route } from '@/features/routes/types'

interface RouteTableProps {
  routes: Route[]
  onViewStops: (route: Route) => void
  onAddStops: (route: Route) => void
}

export function RouteTable({ routes, onViewStops, onAddStops }: RouteTableProps) {
  return (
    <>
      {/* ─── Desktop Table ──────────────────────────────────────── */}
      <div className="hidden md:block bg-surface-container-lowest rounded-3xl shadow-ambient overflow-visible">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant/10">
              <th className="text-left text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-6 py-4 first:rounded-tl-3xl">
                Route
              </th>
              <th className="text-left text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-6 py-4">
                Origin
              </th>
              <th className="text-left text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-6 py-4">
                Destination
              </th>
              <th className="text-center text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-6 py-4">
                Stops
              </th>
              <th className="text-center text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-6 py-4">
                Distance
              </th>
              <th className="text-right text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-6 py-4 last:rounded-tr-3xl">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route) => (
              <RouteTableRow
                key={route.routeId}
                route={route}
                onViewStops={onViewStops}
                onAddStops={onAddStops}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* ─── Mobile Card Grid ────────────────────────────────────── */}
      <div className="grid gap-3 md:hidden">
        {routes.map((route) => (
          <RouteCard
            key={route.routeId}
            route={route}
            onViewStops={onViewStops}
            onAddStops={onAddStops}
          />
        ))}
      </div>
    </>
  )
}

// ─── Table Row ──────────────────────────────────────────────────────

function RouteTableRow({
  route,
  onViewStops,
  onAddStops,
}: {
  route: Route
  onViewStops: (route: Route) => void
  onAddStops: (route: Route) => void
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

  const stops = route.stops ?? []
  const sorted = [...stops].sort((a, b) => a.sequenceOrder - b.sequenceOrder)
  const origin = sorted[0]?.locationName ?? '—'
  const dest = sorted.length > 1 ? sorted[sorted.length - 1].locationName ?? '—' : '—'
  const totalDist =
    sorted.length > 1
      ? sorted[sorted.length - 1].distanceFromOrigin
      : undefined

  return (
    <tr className="border-b border-outline-variant/5 hover:bg-surface-container-low/50 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/8 group-hover:bg-primary/12 transition-colors">
            <Navigation className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-semibold text-on-surface">
            {route.routeName}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-1.5 text-sm text-on-surface-variant">
          <MapPin className="h-3.5 w-3.5 text-emerald-500" />
          <span className="font-medium">{origin}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-1.5 text-sm text-on-surface-variant">
          <MapPin className="h-3.5 w-3.5 text-rose-500" />
          <span className="font-medium">{dest}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <span className="inline-flex items-center rounded-lg bg-surface-container-low px-2 py-0.5 text-xs font-bold text-on-surface-variant">
          {stops.length}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        <span className="text-sm font-semibold text-on-surface">
          {totalDist != null ? `${totalDist} km` : '—'}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="relative inline-block" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            aria-label={`Actions for ${route.routeName}`}
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
      </td>
    </tr>
  )
}
