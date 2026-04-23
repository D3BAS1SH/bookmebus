'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Ticket,
  Calendar,
  MapPin,
  ChevronRight,
  Search,
  Clock,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { Pagination } from '@/components/ui/Pagination'
import { EmptyState } from '@/components/ui/EmptyState'
import { Tabs } from '@/components/ui/Tabs'
import { cn } from '@/lib/utils'
import { useMyBookings } from '@/features/traveler/hooks/useTraveler'
import type { Booking } from '@/features/traveler/types'

const STATUS_CONFIG = {
  CONFIRMED: { variant: 'success' as const, label: 'Confirmed', color: 'text-tertiary' },
  CANCELED: { variant: 'destructive' as const, label: 'Cancelled', color: 'text-error' },
}

const TABS = [
  { label: 'All', value: 'all' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Cancelled', value: 'CANCELED' },
]

function formatDate(isoStr: string) {
  return new Date(isoStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatTime(isoStr: string) {
  return new Date(isoStr).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

/* ─── Booking Card ─────────────────────────────────────────────── */

interface BookingCardProps {
  booking: Booking
  index: number
  onClick: () => void
}

function BookingCard({ booking, index, onClick }: BookingCardProps) {
  const config = STATUS_CONFIG[booking.status] || STATUS_CONFIG.CONFIRMED

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
    >
      <Card
        className="border-none shadow-ambient bg-surface-container-lowest hover:shadow-lg transition-all cursor-pointer group"
        onClick={onClick}
      >
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            {/* Left accent */}
            <div
              className={cn(
                'w-full sm:w-1.5 h-1.5 sm:h-auto rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none',
                booking.status === 'CONFIRMED' ? 'bg-tertiary' : 'bg-error/40'
              )}
            />

            {/* Content */}
            <div className="flex-1 p-5 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Ticket className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-on-surface">
                      {booking.bookingCode}
                    </p>
                    <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                      Booking Code
                    </p>
                  </div>
                </div>
                <Badge variant={config.variant}>{config.label}</Badge>
              </div>

              {/* Route info */}
              <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="font-medium">
                  {booking.boardingStopName}
                </span>
                <ChevronRight className="h-3 w-3 text-outline-variant" />
                <span className="font-medium">
                  {booking.dropoffStopName}
                </span>
              </div>

              {/* Details */}
              <div className="flex items-center gap-4 text-xs text-on-surface-variant flex-wrap">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(booking.bookedAt)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTime(booking.bookedAt)}
                </div>
                <div className="font-bold text-primary text-sm">
                  ₹{booking.totalPrice.toFixed(2)}
                </div>
                <div className="text-on-surface-variant">
                  Seat {booking.seatNumber}
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden sm:flex items-center pr-4">
              <ChevronRight className="h-5 w-5 text-outline-variant group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

/* ─── Loading Skeleton ─────────────────────────────────────────── */

function BookingSkeleton() {
  return (
    <Card className="border-none shadow-ambient bg-surface-container-lowest">
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/* ─── Main Component ───────────────────────────────────────────── */

export function MyBookings() {
  const router = useRouter()
  const [page, setPage] = useState(0)
  const [statusFilter, setStatusFilter] = useState('all')
  const { data, isLoading, error } = useMyBookings(page)

  const filteredBookings =
    data?.content?.filter((b) => statusFilter === 'all' || b.status === statusFilter) || []

  return (
    <div className="min-h-screen bg-surface py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between flex-wrap gap-4"
        >
          <div>
            <h1 className="text-3xl font-display font-black text-on-surface tracking-tight">
              My Bookings
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Manage your trips and download tickets
            </p>
          </div>
          <Button onClick={() => router.push('/traveler/search')} className="gap-2">
            <Search className="h-4 w-4" />
            Book a Trip
          </Button>
        </motion.div>

        {/* Tabs */}
        <Tabs tabs={TABS} activeTab={statusFilter} onTabChange={setStatusFilter} />

        {/* Bookings list */}
        <div className="space-y-4">
          {isLoading ? (
            <>
              <BookingSkeleton />
              <BookingSkeleton />
              <BookingSkeleton />
            </>
          ) : error ? (
            <Card className="border-none shadow-ambient bg-surface-container-lowest p-8 text-center">
              <p className="text-error font-medium">
                {error instanceof Error ? error.message : 'Failed to load bookings'}
              </p>
            </Card>
          ) : filteredBookings.length === 0 ? (
            <EmptyState
              icon={Ticket}
              title="No bookings yet"
              description={
                statusFilter === 'all'
                  ? "You haven't made any bookings. Start by searching for a trip!"
                  : `No ${statusFilter.toLowerCase()} bookings found.`
              }
              actionLabel="Search Trips"
              onAction={() => router.push('/traveler/search')}
            />
          ) : (
            <>
              {filteredBookings.map((booking, i) => (
                <BookingCard
                  key={booking.bookingId}
                  booking={booking}
                  index={i}
                  onClick={() => router.push(`/traveler/bookings/${booking.bookingId}`)}
                />
              ))}

              {data && (
                <Pagination
                  page={page}
                  totalPages={data.totalPages}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
