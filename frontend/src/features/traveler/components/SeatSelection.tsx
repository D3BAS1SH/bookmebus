'use client'

import React, { useState, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Check,
  MapPin,
  Clock,
  Armchair,
  AlertCircle,
  ChevronDown,
  Ticket,
  Loader2,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { Modal } from '@/components/ui/Modal'
import { cn } from '@/lib/utils'
import {
  useTripSeats,
  useRouteDetail,
  useBusDetail,
  useCreateBooking,
} from '@/features/traveler/hooks/useTraveler'
import { useTripDetail } from '@/features/trips/hooks/useTrips'
import type { TripSeat, RouteStop } from '@/features/traveler/types'

/* ─── Seat status colors ───────────────────────────────────────── */

const SEAT_COLORS = {
  AVAILABLE: {
    bg: 'bg-emerald-100 hover:bg-emerald-200 border-emerald-300 dark:bg-emerald-900/30 dark:border-emerald-800',
    text: 'text-emerald-700 dark:text-emerald-300',
    label: 'Available',
  },
  BOOKED: {
    bg: 'bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700',
    text: 'text-slate-400 dark:text-slate-500',
    label: 'Booked',
  },
  PARTIALLY_BOOKED: {
    bg: 'bg-amber-100 hover:bg-amber-200 border-amber-300 dark:bg-amber-900/30 dark:border-amber-800',
    text: 'text-amber-700 dark:text-amber-300',
    label: 'Partially Booked',
  },
  SELECTED: {
    bg: 'bg-primary border-primary shadow-md',
    text: 'text-white',
    label: 'Selected',
  },
}

/* ─── Stop Dropdown ────────────────────────────────────────────── */

interface StopDropdownProps {
  label: string
  stops: RouteStop[]
  value: RouteStop | null
  onChange: (stop: RouteStop) => void
  filterFn?: (stop: RouteStop) => boolean
}

function StopDropdown({ label, stops, value, onChange, filterFn }: StopDropdownProps) {
  const [open, setOpen] = useState(false)
  const filtered = filterFn ? stops.filter(filterFn) : stops

  return (
    <div className="relative">
      <label className="text-[10px] uppercase tracking-widest font-bold text-primary mb-1 block">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/10 text-sm font-medium text-on-surface hover:bg-surface-container transition-colors"
      >
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          {value ? value.locationName : 'Select stop'}
        </div>
        <ChevronDown className={cn('h-3.5 w-3.5 text-outline transition-transform', open && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute top-full left-0 right-0 mt-1 z-50 glass rounded-xl shadow-ambient py-1 max-h-48 overflow-y-auto"
          >
            {filtered.map((stop) => (
              <button
                key={stop.routeStopId}
                onClick={() => {
                  onChange(stop)
                  setOpen(false)
                }}
                className={cn(
                  'w-full px-3 py-2 text-left text-sm flex items-center justify-between rounded-lg m-0.5 transition-colors',
                  value?.routeStopId === stop.routeStopId
                    ? 'primary-gradient text-white'
                    : 'hover:bg-primary/10 text-on-surface'
                )}
              >
                <span>{stop.locationName}</span>
                <span
                  className={cn(
                    'text-[10px]',
                    value?.routeStopId === stop.routeStopId ? 'text-white/60' : 'text-on-surface-variant'
                  )}
                >
                  Stop #{stop.sequenceOrder}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Seat Map ─────────────────────────────────────────────────── */

interface SeatMapProps {
  seats: TripSeat[]
  selectedSeat: TripSeat | null
  onSelect: (seat: TripSeat) => void
  leftCols: string[]
  rightCols: string[]
  rows: number
}

function SeatMap({ seats, selectedSeat, onSelect, leftCols, rightCols, rows }: SeatMapProps) {
  // Build a lookup from seatNumber → TripSeat
  const seatMap = useMemo(() => {
    const map = new Map<string, TripSeat>()
    seats.forEach((s) => map.set(s.seatNumber, s))
    return map
  }, [seats])

  const totalCols = leftCols.length + rightCols.length

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        {Object.entries(SEAT_COLORS).map(([key, val]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={cn('w-5 h-5 rounded-md border', val.bg)} />
            <span className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">
              {val.label}
            </span>
          </div>
        ))}
      </div>

      {/* Bus body */}
      <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10">
        {/* Steering indicator */}
        <div className="flex justify-end mb-4">
          <div className="w-10 h-10 rounded-full border-2 border-outline-variant/30 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-outline-variant/20" />
          </div>
        </div>

        {/* Seat grid */}
        <div className="space-y-2">
          {Array.from({ length: rows }, (_, rowIdx) => {
            const rowNum = rowIdx + 1
            return (
              <div key={rowNum} className="flex items-center gap-2 justify-center">
                {/* Left seats */}
                <div className="flex gap-2">
                  {leftCols.map((col) => {
                    const seatNumber = `${rowNum}${col}`
                    const seat = seatMap.get(seatNumber)
                    return (
                      <SeatButton
                        key={seatNumber}
                        seatNumber={seatNumber}
                        seat={seat}
                        isSelected={selectedSeat?.seatNumber === seatNumber}
                        onSelect={onSelect}
                      />
                    )
                  })}
                </div>

                {/* Aisle */}
                <div className="w-8 sm:w-12" />

                {/* Right seats */}
                <div className="flex gap-2">
                  {rightCols.map((col) => {
                    const seatNumber = `${rowNum}${col}`
                    const seat = seatMap.get(seatNumber)
                    return (
                      <SeatButton
                        key={seatNumber}
                        seatNumber={seatNumber}
                        seat={seat}
                        isSelected={selectedSeat?.seatNumber === seatNumber}
                        onSelect={onSelect}
                      />
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

interface SeatButtonProps {
  seatNumber: string
  seat: TripSeat | undefined
  isSelected: boolean
  onSelect: (seat: TripSeat) => void
}

function SeatButton({ seatNumber, seat, isSelected, onSelect }: SeatButtonProps) {
  if (!seat) {
    return (
      <div className="w-11 h-11 rounded-lg border border-dashed border-outline-variant/20 flex items-center justify-center text-[10px] text-outline-variant/40">
        —
      </div>
    )
  }

  const isAvailable = seat.seatStatus === 'AVAILABLE' || seat.seatStatus === 'PARTIALLY_BOOKED'
  const colors = isSelected
    ? SEAT_COLORS.SELECTED
    : SEAT_COLORS[seat.seatStatus] || SEAT_COLORS.BOOKED

  return (
    <motion.button
      whileHover={isAvailable ? { scale: 1.1 } : undefined}
      whileTap={isAvailable ? { scale: 0.95 } : undefined}
      disabled={!isAvailable}
      onClick={() => isAvailable && onSelect(seat)}
      className={cn(
        'w-11 h-11 rounded-lg border-2 flex items-center justify-center text-xs font-bold transition-all relative',
        colors.bg,
        colors.text,
        !isAvailable && !isSelected && 'cursor-not-allowed'
      )}
      title={`Seat ${seatNumber} — ${isSelected ? 'Selected' : seat.seatStatus}`}
    >
      {isSelected ? (
        <Check className="h-4 w-4" />
      ) : (
        <span className="text-[10px] font-bold">{seatNumber}</span>
      )}
    </motion.button>
  )
}

/* ─── Main Component ───────────────────────────────────────────── */

interface SeatSelectionProps {
  tripId: string
}

export function SeatSelection({ tripId }: SeatSelectionProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const routeId = searchParams.get('routeId') || ''
  const routeName = searchParams.get('routeName') || ''
  const originName = searchParams.get('originName') || ''
  const destinationName = searchParams.get('destinationName') || ''

  // State
  const [boardingStop, setBoardingStop] = useState<RouteStop | null>(null)
  const [dropoffStop, setDropoffStop] = useState<RouteStop | null>(null)
  const [selectedSeat, setSelectedSeat] = useState<TripSeat | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  // Data fetching
  const { data: trip, isLoading: tripLoading } = useTripDetail(tripId)
  const { data: route, isLoading: routeLoading } = useRouteDetail(routeId)
  const { data: bus, isLoading: busLoading } = useBusDetail(trip?.busId || '')

  const sortedStops = useMemo(() => {
    if (!route?.stops) return []
    return [...route.stops].sort((a, b) => a.sequenceOrder - b.sequenceOrder)
  }, [route])

  // Auto-initialize stops from origin/destination location names
  React.useEffect(() => {
    if (sortedStops.length > 0 && !boardingStop && !dropoffStop) {
      if (originName) {
        const found = sortedStops.find(
          (s) => s.locationName.toLowerCase() === originName.toLowerCase() && s.boardingPoint
        )
        if (found) setBoardingStop(found)
      }
      if (destinationName) {
        const found = sortedStops.find(
          (s) => s.locationName.toLowerCase() === destinationName.toLowerCase() && s.droppingPoint
        )
        if (found) setDropoffStop(found)
      }
    }
  }, [sortedStops, originName, destinationName, boardingStop, dropoffStop])

  const {
    data: seats = [],
    isLoading: seatsLoading,
  } = useTripSeats(
    tripId,
    boardingStop?.locationId,
    dropoffStop?.locationId
  )

  const createBookingMutation = useCreateBooking()

  const handleConfirmBooking = async () => {
    if (!selectedSeat || !boardingStop || !dropoffStop) return
    try {
      const booking = await createBookingMutation.mutateAsync({
        tripId,
        tripSeatId: selectedSeat.tripSeatId,
        boardingStopId: boardingStop.routeStopId,
        dropoffStopId: dropoffStop.routeStopId,
      })
      setShowConfirm(false)
      router.push(`/traveler/bookings/${booking.bookingId}`)
    } catch {
      // Error handled by mutation onError
    }
  }

  const isLoading = tripLoading || routeLoading || busLoading
  const canBook = selectedSeat && boardingStop && dropoffStop

  // Price estimation (pricePerKm * distance between stops)
  const estimatedPrice = useMemo(() => {
    if (!bus || !boardingStop || !dropoffStop) return null
    const distance = Math.abs(dropoffStop.distanceFromOrigin - boardingStop.distanceFromOrigin)
    return Math.round(bus.pricePerKm * distance * 100) / 100
  }, [bus, boardingStop, dropoffStop])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to results
          </button>

          <div>
            <h1 className="text-3xl font-display font-black text-on-surface tracking-tight">
              Select Your Seat
            </h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-on-surface-variant flex-wrap">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span className="font-medium">{routeName}</span>
              </div>
              {trip && (
                <>
                  <span className="text-outline-variant">·</span>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span className="font-medium">
                      {new Date(trip.departureTime).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      })}{' '}
                      at{' '}
                      {new Date(trip.departureTime).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          {/* Left: Seat Map */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {seatsLoading ? (
              <Skeleton className="h-96 w-full rounded-2xl" />
            ) : bus?.seatLayout ? (
              <SeatMap
                seats={seats}
                selectedSeat={selectedSeat}
                onSelect={setSelectedSeat}
                leftCols={bus.seatLayout.leftCols}
                rightCols={bus.seatLayout.rightCols}
                rows={bus.seatLayout.rows}
              />
            ) : (
              <Card className="border-none shadow-ambient bg-surface-container-lowest p-8 text-center">
                <AlertCircle className="h-8 w-8 text-outline-variant mx-auto mb-2" />
                <p className="text-on-surface-variant">Unable to load seat layout</p>
              </Card>
            )}
          </motion.div>

          {/* Right: Booking Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-none shadow-ambient bg-surface-container-lowest sticky top-8">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-lg font-display font-bold text-on-surface">
                  Trip Details
                </h2>

                {/* Stop selectors */}
                <div className="space-y-4">
                  <StopDropdown
                    label="Boarding Point"
                    stops={sortedStops}
                    value={boardingStop}
                    onChange={(stop) => {
                      setBoardingStop(stop)
                      setSelectedSeat(null) // Reset seat when stop changes
                      // Clear dropoff if it's before boarding
                      if (dropoffStop && stop.sequenceOrder >= dropoffStop.sequenceOrder) {
                        setDropoffStop(null)
                      }
                    }}
                    filterFn={(s) => s.boardingPoint}
                  />
                  <StopDropdown
                    label="Drop-off Point"
                    stops={sortedStops}
                    value={dropoffStop}
                    onChange={(stop) => {
                      setDropoffStop(stop)
                      setSelectedSeat(null) // Reset seat when stop changes
                    }}
                    filterFn={(s) =>
                      s.droppingPoint &&
                      (!boardingStop || s.sequenceOrder > boardingStop.sequenceOrder)
                    }
                  />
                </div>

                {/* Divider */}
                <div className="h-px bg-outline-variant/15" />

                {/* Selected seat */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-on-surface-variant">Selected Seat</span>
                    <span className="font-bold text-on-surface">
                      {selectedSeat ? selectedSeat.seatNumber : '—'}
                    </span>
                  </div>

                  {estimatedPrice !== null && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-on-surface-variant">Estimated Price</span>
                      <span className="text-2xl font-display font-black text-primary">
                        ₹{estimatedPrice.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Warning if stops not selected */}
                {(!boardingStop || !dropoffStop) && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary-container/20 text-sm text-on-surface-variant">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-secondary" />
                    <span>Select both boarding and drop-off points to see accurate seat availability and pricing.</span>
                  </div>
                )}

                {/* Book button */}
                <Button
                  className="w-full h-14 text-base font-bold gap-2"
                  disabled={!canBook || createBookingMutation.isPending}
                  onClick={() => setShowConfirm(true)}
                >
                  {createBookingMutation.isPending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    <>
                      <Ticket className="h-5 w-5" />
                      Book Seat {selectedSeat?.seatNumber || ''}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirm Booking"
        description="Review your trip details before confirming."
      >
        <div className="space-y-4">
          <div className="space-y-3 p-4 rounded-xl bg-surface-container-low">
            <DetailRow label="Route" value={routeName} />
            {trip && (
              <DetailRow
                label="Departure"
                value={new Date(trip.departureTime).toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              />
            )}
            <DetailRow label="Boarding" value={boardingStop?.locationName || '—'} />
            <DetailRow label="Drop-off" value={dropoffStop?.locationName || '—'} />
            <DetailRow label="Seat" value={selectedSeat?.seatNumber || '—'} />
            {estimatedPrice !== null && (
              <DetailRow label="Price" value={`₹${estimatedPrice.toFixed(2)}`} highlight />
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 gap-2"
              onClick={handleConfirmBooking}
              disabled={createBookingMutation.isPending}
            >
              {createBookingMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Confirming...
                </>
              ) : (
                'Confirm Booking'
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function DetailRow({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-on-surface-variant">{label}</span>
      <span
        className={cn(
          'font-bold',
          highlight ? 'text-primary text-lg' : 'text-on-surface'
        )}
      >
        {value}
      </span>
    </div>
  )
}
