'use client'

import React, { useState } from 'react'
import { MapPin, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Location } from '@/features/routes/types'

interface LocationListProps {
  locations: Location[]
  isLoading?: boolean
}

const PAGE_SIZE = 6

export function LocationList({ locations, isLoading }: LocationListProps) {
  const [page, setPage] = useState(0)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const totalPages = Math.ceil(locations.length / PAGE_SIZE)
  const paged = locations.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  function handleCopyId(locationId: string) {
    navigator.clipboard.writeText(locationId)
    setCopiedId(locationId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-ambient space-y-3">
        <div className="h-4 w-32 bg-surface-container-low rounded animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 bg-surface-container-low rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (locations.length === 0) return null

  return (
    <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-ambient space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
          All Locations ({locations.length})
        </p>
        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-semibold text-on-surface-variant tabular-nums">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {paged.map((loc) => (
          <div
            key={loc.locationId}
            className="flex items-center gap-3 rounded-xl bg-surface-container-low px-3.5 py-3 group hover:bg-surface-container transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/8 shrink-0">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-on-surface truncate">
                {loc.locationName}
              </p>
              <p className="text-[10px] text-on-surface-variant font-mono truncate">
                {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
              </p>
            </div>
            <button
              onClick={() => handleCopyId(loc.locationId)}
              className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-lowest hover:text-primary transition-colors shrink-0 opacity-0 group-hover:opacity-100"
              title="Copy Location ID"
            >
              {copiedId === loc.locationId ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
