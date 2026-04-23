'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Ticket,
  Calendar,
  MapPin,
  Clock,
  Download,
  XCircle,
  CheckCircle,
  QrCode,
  Loader2,
  Armchair,
  ChevronRight,
  FileText,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { Modal } from '@/components/ui/Modal'
import { cn } from '@/lib/utils'
import {
  useBookingDetail,
  useCancelBooking,
  useGenerateTicket,
} from '@/features/traveler/hooks/useTraveler'
import type { Booking } from '@/features/traveler/types'

function formatDateTime(isoStr: string) {
  return new Date(isoStr).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

/* ─── Info Row ─────────────────────────────────────────────────── */

function InfoRow({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: React.ElementType
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="h-8 w-8 rounded-lg bg-primary/8 flex items-center justify-center text-primary shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
          {label}
        </p>
        <p
          className={cn(
            'font-semibold truncate',
            highlight ? 'text-primary text-lg' : 'text-on-surface'
          )}
        >
          {value}
        </p>
      </div>
    </div>
  )
}

/* ─── Main Component ───────────────────────────────────────────── */

interface BookingDetailProps {
  bookingId: string
}

export function BookingDetail({ bookingId }: BookingDetailProps) {
  const router = useRouter()
  const [showCancelModal, setShowCancelModal] = useState(false)

  const { data: booking, isLoading, error } = useBookingDetail(bookingId)
  const cancelMutation = useCancelBooking()
  const ticketMutation = useGenerateTicket()

  const handleCancel = async () => {
    try {
      await cancelMutation.mutateAsync(bookingId)
      setShowCancelModal(false)
    } catch {
      // Handled by mutation
    }
  }

  const handleGenerateTicket = async () => {
    try {
      await ticketMutation.mutateAsync(bookingId)
    } catch {
      // Handled by mutation
    }
  }

  const handleDownloadTicket = () => {
    window.open(`/api/tickets/${bookingId}/download`, '_blank')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-surface py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center py-16">
          <p className="text-error font-medium">
            {error instanceof Error ? error.message : 'Booking not found'}
          </p>
          <Button variant="outline" className="mt-4" onClick={() => router.push('/traveler/bookings')}>
            Back to Bookings
          </Button>
        </div>
      </div>
    )
  }

  const isConfirmed = booking.status === 'CONFIRMED'
  const hasTicket = !!booking.ticketPdfPath

  return (
    <div className="min-h-screen bg-surface py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <button
            onClick={() => router.push('/traveler/bookings')}
            className="flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to bookings
          </button>
        </motion.div>

        {/* Status Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card
            className={cn(
              'border-none overflow-hidden',
              isConfirmed
                ? 'bg-gradient-to-br from-tertiary/10 to-tertiary-container/20'
                : 'bg-gradient-to-br from-error/10 to-error-container/20'
            )}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div
                className={cn(
                  'h-14 w-14 rounded-2xl flex items-center justify-center',
                  isConfirmed ? 'bg-tertiary/20 text-tertiary' : 'bg-error/20 text-error'
                )}
              >
                {isConfirmed ? (
                  <CheckCircle className="h-7 w-7" />
                ) : (
                  <XCircle className="h-7 w-7" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-display font-black text-on-surface">
                  Booking {isConfirmed ? 'Confirmed' : 'Cancelled'}
                </h1>
                <p className="text-sm text-on-surface-variant mt-0.5">
                  {isConfirmed
                    ? 'Your seat is reserved. Generate your ticket below.'
                    : 'This booking has been cancelled.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Booking Code + QR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-none shadow-ambient bg-surface-container-lowest">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
                    Booking Code
                  </p>
                  <p className="text-3xl font-display font-black text-on-surface tracking-wider mt-1">
                    {booking.bookingCode}
                  </p>
                </div>
                <div className="h-16 w-16 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                  <QrCode className="h-8 w-8" />
                </div>
              </div>

              {/* Trip Details */}
              <div className="space-y-1 divide-y divide-outline-variant/10">
                <InfoRow
                  icon={MapPin}
                  label="Route"
                  value={`${booking.boardingStopName} → ${booking.dropoffStopName}`}
                />
                <InfoRow
                  icon={Calendar}
                  label="Booked At"
                  value={formatDateTime(booking.bookedAt)}
                />
                <InfoRow
                  icon={Armchair}
                  label="Seat Number"
                  value={booking.seatNumber}
                />
                <InfoRow
                  icon={Ticket}
                  label="Total Price"
                  value={`₹${booking.totalPrice.toFixed(2)}`}
                  highlight
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        {isConfirmed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            {/* Generate / Download Ticket */}
            {hasTicket ? (
              <Button
                className="w-full h-14 text-base font-bold gap-2"
                onClick={handleDownloadTicket}
              >
                <Download className="h-5 w-5" />
                Download Ticket PDF
              </Button>
            ) : (
              <Button
                className="w-full h-14 text-base font-bold gap-2"
                onClick={handleGenerateTicket}
                disabled={ticketMutation.isPending}
              >
                {ticketMutation.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="h-5 w-5" />
                    Generate Ticket
                  </>
                )}
              </Button>
            )}

            {/* Cancel */}
            <Button
              variant="outline"
              className="w-full h-12 text-error border-error/20 hover:bg-error/5 hover:text-error font-bold gap-2"
              onClick={() => setShowCancelModal(true)}
            >
              <XCircle className="h-4 w-4" />
              Cancel Booking
            </Button>
          </motion.div>
        )}

        {/* Boarding status */}
        {booking.didBoard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Badge variant="success" className="text-sm px-4 py-2">
              <CheckCircle className="h-4 w-4 mr-2" />
              Passenger has boarded
            </Badge>
          </motion.div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Booking"
        description="Are you sure you want to cancel this booking? This action cannot be undone."
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-error-container/20 text-sm text-on-surface">
            <p>
              <strong>Booking:</strong> {booking.bookingCode}
            </p>
            <p>
              <strong>Seat:</strong> {booking.seatNumber} — {booking.boardingStopName} →{' '}
              {booking.dropoffStopName}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowCancelModal(false)}
            >
              Keep Booking
            </Button>
            <Button
              className="flex-1 bg-error hover:bg-error/90 text-white gap-2"
              onClick={handleCancel}
              disabled={cancelMutation.isPending}
            >
              {cancelMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Yes, Cancel'
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
