'use client'

import React, { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Clock,
  Bus,
  ChevronRight,
  Calendar,
  MapPin,
  Search,
  Armchair,
  IndianRupee,
  ArrowRight,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { Pagination } from '@/components/ui/Pagination'
import { EmptyState } from '@/components/ui/EmptyState'
import { cn } from '@/lib/utils'
import { useSegmentSearch } from '@/features/traveler/hooks/useTraveler'
import type { TripSearchResult } from '@/features/traveler/types'

const STATUS_STYLES: Record<
  string,
  { variant: 'default' | 'success' | 'secondary' | 'destructive'; label: string }
> = {
  SCHEDULED: { variant: 'default', label: 'Scheduled' },
  IN_TRANSIT: { variant: 'success', label: 'In Transit' },
  COMPLETED: { variant: 'secondary', label: 'Completed' },
  CANCELED: { variant: 'destructive', label: 'Cancelled' },
}

function formatTime(isoStr: string) {
  return new Date(isoStr).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/* ─── Trip Card ────────────────────────────────────────────────── */

interface TripCardProps {
  trip: TripSearchResult
  index: number
  onSelect: (trip: TripSearchResult) => void
}

function TripCard({ trip, index, onSelect }: TripCardProps) {
  const style = STATUS_STYLES[trip.status] || STATUS_STYLES.SCHEDULED
  const isBookable = trip.status === 'SCHEDULED'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Card
        className={cn(
          'border-none shadow-ambient bg-surface-container-lowest hover:shadow-lg transition-all group cursor-pointer',
          !isBookable && 'opacity-60'
        )}
        onClick={() => isBookable && onSelect(trip)}
      >
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row items-stretch">
            {/* Trip Info */}
            <div className="flex-1 p-6 space-y-4">
              {/* Top row: time + status */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-display font-black text-on-surface tabular-nums">
                      {formatTime(trip.departureTime)}
                    </p>
                    <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                      Departure
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-2 mx-4 text-outline-variant">
                  <div className="w-8 h-px bg-outline-variant/30" />
                  <span className="text-xs font-bold text-on-surface-variant whitespace-nowrap">
                    {formatDuration(trip.expectedDurationMin)}
                  </span>
                  <div className="w-8 h-px bg-outline-variant/30" />
                </div>

                <Badge variant={style.variant}>{style.label}</Badge>
              </div>

              {/* Route name */}
              <div className="flex items-center gap-2 text-sm font-semibold text-on-surface">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>{trip.routeName}</span>
              </div>

              {/* Details row */}
              <div className="flex items-center gap-4 sm:gap-6 text-sm text-on-surface-variant flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Bus className="h-3.5 w-3.5" />
                  <span className="font-medium">{trip.busRegistrationNumber}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Armchair className="h-3.5 w-3.5" />
                  <span className="font-medium">
                    {trip.availableSeats}/{trip.seatsGenerated} seats
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:hidden">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="font-medium">{formatDuration(trip.expectedDurationMin)}</span>
                </div>
              </div>
            </div>

            {/* Price + Book button */}
            {isBookable && (
              <div className="flex items-center justify-between sm:justify-center gap-4 p-6 border-t sm:border-t-0 sm:border-l border-outline-variant/10 bg-surface-container/30 sm:flex-col sm:min-w-[160px]">
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                    Starts from
                  </p>
                  <p className="text-2xl font-display font-black text-primary tabular-nums">
                    ₹{trip.estimatedPrice?.toFixed(0) || '—'}
                  </p>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelect(trip)
                  }}
                  className="gap-2 px-6"
                  size="sm"
                >
                  Select Seats
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

/* ─── Loading Skeleton ─────────────────────────────────────────── */

function TripCardSkeleton() {
  return (
    <Card className="border-none shadow-ambient bg-surface-container-lowest">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}

/* ─── Main Component ───────────────────────────────────────────── */

export function TripResults() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const originLocationId = searchParams.get('originLocationId') || ''
  const destinationLocationId = searchParams.get('destinationLocationId') || ''
  const date = searchParams.get('date') || ''
  const originName = searchParams.get('originName') || 'Origin'
  const destinationName = searchParams.get('destinationName') || 'Destination'

  const [page, setPage] = useState(0)
  const { data, isLoading, error } = useSegmentSearch(
    originLocationId,
    destinationLocationId,
    date,
    page
  )

  const handleSelectTrip = (trip: TripSearchResult) => {
    const params = new URLSearchParams({
      routeId: trip.routeId,
      routeName: trip.routeName,
      originLocationId,
      destinationLocationId,
      originName,
      destinationName,
    })
    router.push(`/traveler/trips/${trip.tripId}?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-surface py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <button
            onClick={() => router.push('/traveler/search')}
            className="flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to search
          </button>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-display font-black text-on-surface tracking-tight">
                Available Trips
              </h1>
              <div className="flex items-center gap-2 mt-2 text-sm text-on-surface-variant flex-wrap">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span className="font-semibold text-on-surface">{originName}</span>
                </div>
                <ArrowRight className="h-3 w-3 text-outline-variant" />
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span className="font-semibold text-on-surface">{destinationName}</span>
                </div>
                <span className="text-outline-variant">·</span>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span className="font-medium">{date ? formatDate(date) : 'No date'}</span>
                </div>
              </div>
            </div>

            {data && !data.empty && (
              <Badge variant="outline" className="text-xs">
                {data.totalElements} trip{data.totalElements !== 1 ? 's' : ''} found
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Results */}
        <div className="space-y-4">
          {isLoading ? (
            <>
              <TripCardSkeleton />
              <TripCardSkeleton />
              <TripCardSkeleton />
            </>
          ) : error ? (
            <Card className="border-none shadow-ambient bg-surface-container-lowest">
              <CardContent className="p-8 text-center">
                <p className="text-error font-medium">
                  {error instanceof Error ? error.message : 'Something went wrong'}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => router.push('/traveler/search')}
                >
                  Try again
                </Button>
              </CardContent>
            </Card>
          ) : !data || data.empty ? (
            <EmptyState
              icon={Search}
              title="No trips found"
              description={`No trips available from ${originName} to ${destinationName} on ${date ? formatDate(date) : 'the selected date'}. Try a different date or route.`}
              actionLabel="Search again"
              onAction={() => router.push('/traveler/search')}
            />
          ) : (
            <>
              {data.content.map((trip, i) => (
                <TripCard
                  key={trip.tripId}
                  trip={trip}
                  index={i}
                  onSelect={handleSelectTrip}
                />
              ))}

              <Pagination
                page={page}
                totalPages={data.totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
