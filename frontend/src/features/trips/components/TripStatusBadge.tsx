'use client'

import React from 'react'
import type { TripStatus } from '@/features/trips/types'

const STATUS_CONFIG: Record<
  TripStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  SCHEDULED: {
    label: 'Scheduled',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
  },
  IN_TRANSIT: {
    label: 'In Transit',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
  },
  COMPLETED: {
    label: 'Completed',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
  },
  CANCELED: {
    label: 'Cancelled',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    dot: 'bg-rose-500',
  },
}

export function TripStatusBadge({ status }: { status: TripStatus }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.SCHEDULED

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${config.bg} ${config.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}
