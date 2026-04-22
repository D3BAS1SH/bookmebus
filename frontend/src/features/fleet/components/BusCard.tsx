'use client'

import React from 'react'
import { Bus as BusIcon, Hash, Users, MoreVertical, Pencil, Power, IndianRupee } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { BusStatusBadge } from './BusStatusBadge'
import type { Bus, BusStatus } from '@/features/fleet/types'
import { getBusCapacity } from '@/features/fleet/types'

interface BusCardProps {
  bus: Bus
  onEdit: (bus: Bus) => void
  onStatusChange: (busId: string, status: BusStatus) => void
}

export function BusCard({ bus, onEdit, onStatusChange }: BusCardProps) {
  const [showMenu, setShowMenu] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  // Close menu on outside click
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
    <Card className="bg-surface-container-lowest border-none shadow-ambient hover:shadow-lg transition-all group">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <BusIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-on-surface font-mono">{bus.vehicleNumber}</h3>
              <p className="text-xs text-on-surface-variant">
                {bus.seatLayout.seatType} &middot; {capacity} seats
              </p>
            </div>
          </div>

          {/* Action Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
              aria-label="Bus actions"
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
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <Hash className="h-3.5 w-3.5" />
              <span className="font-semibold">Reg: {bus.registrationNumber}</span>
            </div>
            <BusStatusBadge status={bus.status} />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
              <Users className="h-3.5 w-3.5" />
              <span className="font-semibold">{capacity} seats</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
              <IndianRupee className="h-3.5 w-3.5" />
              <span className="font-semibold">{bus.pricePerKm}/km</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
