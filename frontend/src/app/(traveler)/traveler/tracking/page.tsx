'use client'

import React from 'react'
import { useMyBookings } from '@/features/traveler/hooks/useTraveler'
import Link from 'next/link'
import { Bus, MapPin, Calendar, ArrowRight, Loader2 } from 'lucide-react'

export default function TrackingListPage() {
  const { data: bookingsPage, isLoading, error } = useMyBookings(0)

  // Filter for confirmed bookings that might be trackable
  // In a real app, we might also filter by trip departure date (today)
  const activeBookings = bookingsPage?.content.filter(b => b.status === 'CONFIRMED') || []

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 text-center">
        <div>
          <h2 className="text-xl font-bold text-red-600 mb-2">Error loading bookings</h2>
          <p className="text-gray-600">Please make sure you are logged in as a traveler.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Track Your Bus
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            Select an active booking to view the real-time location of your bus.
          </p>
        </header>

        {activeBookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bus className="text-blue-600 w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No active bookings found</h3>
            <p className="text-gray-500 mb-6">You don't have any confirmed trips to track right now.</p>
            <Link 
              href="/traveler"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              Book a Trip
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {activeBookings.map((booking) => (
              <Link 
                key={booking.bookingId} 
                href={`/traveler/tracking/${booking.tripId}`}
                className="block bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
              >
                {/* Accent line */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500 group-hover:bg-blue-600 transition-colors" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                        {booking.bookingCode}
                      </span>
                      <span className="text-gray-400 text-xs">•</span>
                      <div className="flex items-center text-gray-500 text-xs">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(booking.bookedAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold text-gray-900">{booking.boardingStopName}</p>
                        <div className="flex justify-center my-1">
                          <ArrowRight className="w-4 h-4 text-gray-300" />
                        </div>
                        <p className="text-sm font-semibold text-gray-900">{booking.dropoffStopName}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:text-right border-t sm:border-0 pt-4 sm:pt-0">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Seat</p>
                      <p className="text-sm font-bold text-gray-900">{booking.seatNumber}</p>
                    </div>
                    <div className="bg-blue-600 text-white p-3 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-blue-200">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <footer className="mt-12 text-center">
          <p className="text-sm text-gray-400">
            Real-time tracking is only available for buses currently in transit.
          </p>
        </footer>
      </div>
    </div>
  )
}
