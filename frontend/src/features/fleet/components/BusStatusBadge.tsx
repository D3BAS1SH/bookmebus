import React from 'react'
import { cn } from '@/lib/utils'
import type { BusStatus } from '@/features/fleet/types'

const STATUS_CONFIG: Record<
  BusStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  ACTIVE: {
    label: 'Active',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-600',
    dot: 'bg-emerald-500',
  },
  IDLE: {
    label: 'Idle',
    bg: 'bg-amber-500/10',
    text: 'text-amber-600',
    dot: 'bg-amber-500',
  },
  MAINTENANCE: {
    label: 'Maintenance',
    bg: 'bg-rose-500/10',
    text: 'text-rose-600',
    dot: 'bg-rose-500',
  },
  RETIRED: {
    label: 'Retired',
    bg: 'bg-gray-400/10',
    text: 'text-gray-500',
    dot: 'bg-gray-400',
  },
}

interface BusStatusBadgeProps {
  status: BusStatus
  className?: string
}

export function BusStatusBadge({ status, className }: BusStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.IDLE

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold',
        config.bg,
        config.text,
        className
      )}
    >
      <span
        className={cn('h-1.5 w-1.5 rounded-full', config.dot, {
          'animate-pulse': status === 'ACTIVE',
        })}
      />
      {config.label}
    </span>
  )
}
