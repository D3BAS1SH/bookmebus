'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  Download,
  ArrowRight,
  Calendar,
  MapPin,
  Armchair,
  Ticket,
  Loader2,
  ExternalLink,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useBookingDetail, useGenerateTicket } from '@/features/traveler/hooks/useTraveler'
import { cn } from '@/lib/utils'

interface BookingSuccessProps {
  bookingId: string
}

export function BookingSuccess({ bookingId }: BookingSuccessProps) {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  
  const { data: booking, isLoading, error } = useBookingDetail(bookingId)
  const generateTicketMutation = useGenerateTicket()

  // Auto-generate ticket if it doesn't exist yet
  useEffect(() => {
    if (booking && !booking.ticketPdfPath && !isGenerating && !generateTicketMutation.isPending) {
      setIsGenerating(true)
      generateTicketMutation.mutate(bookingId)
    }
  }, [booking, bookingId, isGenerating, generateTicketMutation])

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="text-on-surface-variant font-medium animate-pulse">
            Confirming your journey...
          </p>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-none shadow-ambient bg-surface-container-lowest text-center p-8">
          <div className="h-16 w-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-4">
            <Ticket className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-display font-black text-on-surface">Oops!</h2>
          <p className="text-on-surface-variant mt-2 mb-6">
            We couldn't retrieve your booking details. Please check "My Bookings".
          </p>
          <Button onClick={() => router.push('/traveler/bookings')} className="w-full">
            Go to My Bookings
          </Button>
        </Card>
      </div>
    )
  }

  const handleDownload = () => {
    window.open(`/api/tickets/${bookingId}/download`, '_blank')
  }

  return (
    <div className="min-h-screen bg-surface-container-lowest/50 py-12 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden">
      <div className="max-w-3xl mx-auto">
        {/* Confetti-like effect background (Subtle) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 12, stiffness: 200 }}
              className="inline-flex h-24 w-24 bg-tertiary text-white rounded-full items-center justify-center shadow-lg shadow-tertiary/20"
            >
              <CheckCircle2 className="h-12 w-12" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <h1 className="text-4xl sm:text-5xl font-display font-black text-on-surface tracking-tight">
                Booking Confirmed!
              </h1>
              <p className="text-lg text-on-surface-variant">
                Pack your bags! Your journey has been successfully booked.
              </p>
            </motion.div>
          </div>

          {/* Ticket Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-none shadow-premium bg-surface-container-lowest overflow-hidden">
              <div className="h-2 bg-primary w-full" />
              <CardContent className="p-0">
                <div className="p-8 sm:p-10 space-y-8">
                  {/* Code & Price */}
                  <div className="flex items-center justify-between flex-wrap gap-4 border-b border-outline-variant/10 pb-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-primary">
                        Booking Code
                      </p>
                      <p className="text-3xl font-display font-black text-on-surface tracking-widest mt-1">
                        {booking.bookingCode}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
                        Total Amount
                      </p>
                      <p className="text-3xl font-display font-black text-primary mt-1">
                        ₹{booking.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Trip Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
                            Route
                          </p>
                          <p className="font-bold text-on-surface">
                            {booking.boardingStopName}
                            <ArrowRight className="inline-block h-4 w-4 mx-2 text-outline" />
                            {booking.dropoffStopName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
                            Departure Date
                          </p>
                          <p className="font-bold text-on-surface">
                            {new Date(booking.bookedAt).toLocaleDateString('en-IN', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <Armchair className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
                            Seat Number
                          </p>
                          <p className="font-bold text-on-surface text-xl">
                            {booking.seatNumber}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <Badge variant="success" className="uppercase tracking-tighter">
                            Confirmed
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
                            Status
                          </p>
                          <p className="text-sm font-medium text-tertiary">
                            Seat is reserved & ready
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="bg-surface-container-low p-6 sm:p-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
                  {(booking.ticketPdfPath || generateTicketMutation.isSuccess) ? (
                    <Button
                      size="lg"
                      className="w-full sm:w-auto h-14 px-10 text-base font-bold gap-3 shadow-lg shadow-primary/20"
                      onClick={handleDownload}
                    >
                      <Download className="h-5 w-5" />
                      Download Ticket PDF
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      disabled
                      className="w-full sm:w-auto h-14 px-10 text-base font-bold gap-3"
                    >
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Preparing Ticket...
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-full sm:w-auto h-14 font-bold gap-2 text-on-surface-variant hover:text-on-surface"
                    onClick={() => router.push('/traveler/bookings')}
                  >
                    View All Bookings
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tips / Next Steps */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-sm text-on-surface-variant max-w-lg mx-auto"
          >
            <p>
              A confirmation email has been sent to your registered address. 
              Please carry a digital or printed copy of your ticket for boarding.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
