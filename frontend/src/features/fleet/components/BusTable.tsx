'use client'

import React from 'react'
import { Pencil, Power, Bus as BusIcon, MoreVertical } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { BusStatusBadge } from './BusStatusBadge'
import { BusCard } from './BusCard'
import type { Bus, BusStatus } from '@/features/fleet/types'
import { getBusCapacity } from '@/features/fleet/types'

interface BusTableProps {
  buses: Bus[]
  onEdit: (bus: Bus) => void
  onStatusChange: (busId: string, status: BusStatus) => void
}

export function BusTable({ buses, onEdit, onStatusChange }: BusTableProps) {
  return (
    <>
      {/* ─── Desktop Table ──────────────────────────────────────── */}
      <div className="hidden md:block bg-surface-container-lowest rounded-3xl shadow-ambient overflow-visible">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant/10">
              <th className="text-left text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-6 py-4 first:rounded-tl-3xl">
                Vehicle No.
              </th>
              <th className="text-left text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-6 py-4">
                Registration No.
              </th>
              <th className="text-center text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-6 py-4">
                Layout
              </th>
              <th className="text-center text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-6 py-4">
                Seats
              </th>
              <th className="text-center text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-6 py-4">
                ₹/km
              </th>
              <th className="text-center text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-6 py-4">
                Status
              </th>
              <th className="text-right text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-6 py-4 last:rounded-tr-3xl">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {buses.map((bus) => (
              <BusTableRow
                key={bus.busId}
                bus={bus}
                onEdit={onEdit}
                onStatusChange={onStatusChange}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* ─── Mobile Card Grid ────────────────────────────────────── */}
      <div className="grid gap-3 md:hidden">
        {buses.map((bus) => (
          <BusCard
            key={bus.busId}
            bus={bus}
            onEdit={onEdit}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </>
  )
}

// ─── Table Row Component ────────────────────────────────────────────

function BusTableRow({
  bus,
  onEdit,
  onStatusChange,
}: {
  bus: Bus
  onEdit: (bus: Bus) => void
  onStatusChange: (busId: string, status: BusStatus) => void
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

  const nextStatus: BusStatus =
    bus.status === 'ACTIVE'
      ? 'IDLE'
      : bus.status === 'IDLE'
        ? 'ACTIVE'
        : bus.status === 'MAINTENANCE'
          ? 'ACTIVE'
          : 'IDLE'

  const capacity = getBusCapacity(bus.seatLayout)

  return (
    <tr className="border-b border-outline-variant/5 hover:bg-surface-container-low/50 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/8 group-hover:bg-primary/12 transition-colors">
            <BusIcon className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-semibold text-on-surface font-mono">
            {bus.vehicleNumber}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-on-surface-variant font-mono font-medium">
          {bus.registrationNumber}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        <span className="inline-flex items-center rounded-lg bg-surface-container-low px-2 py-0.5 text-xs font-bold text-on-surface-variant">
          {bus.seatLayout.seatType}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        <span className="text-sm font-semibold text-on-surface">
          {capacity}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        <span className="text-sm font-semibold text-on-surface">
          ₹{bus.pricePerKm}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        <BusStatusBadge status={bus.status} />
      </td>
      <td className="px-6 py-4 text-right">
        <div className="relative inline-block" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            aria-label={`Actions for ${bus.vehicleNumber}`}
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 z-20 w-44 rounded-xl bg-surface-container-lowest shadow-xl border border-outline-variant/10 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
              <button
                onClick={() => {
                  onEdit(bus)
                  setShowMenu(false)
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
              >
                <Pencil className="h-3.5 w-3.5 text-on-surface-variant" />
                Edit Details
              </button>
              <button
                onClick={() => {
                  onStatusChange(bus.busId, nextStatus)
                  setShowMenu(false)
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
              >
                <Power className="h-3.5 w-3.5 text-on-surface-variant" />
                Set {nextStatus.charAt(0) + nextStatus.slice(1).toLowerCase()}
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  )
}
