'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card'
import { Bus, MapPin, Clock, ArrowRight, CheckCircle2, Play } from 'lucide-react'
import { Trip } from '@/features/trips/types'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface ActiveTripCardProps {
  trip?: Trip | null
  nextTrip?: Trip | null
}

export function ActiveTripCard({ trip, nextTrip }: ActiveTripCardProps) {
  const active = trip || nextTrip
  const isTransit = trip?.status === 'IN_TRANSIT'

  if (!active) {
    return (
      <Card className="bg-surface-container-low border-none">
        <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
          <div className="p-4 rounded-full bg-surface-container text-on-surface-variant">
            <Bus size={32} />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-on-surface">No trips scheduled for today</h3>
            <p className="text-sm text-on-surface-variant">Check back later for updates.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const departureTime = new Date(active.departureTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  const departureDate = new Date(active.departureTime).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
  
  const isToday = new Date(active.departureTime).toDateString() === new Date().toDateString()

  return (
    <Card className={cn(
      "relative overflow-hidden border-none shadow-ambient transition-all hover:shadow-lg",
      isTransit ? "bg-primary text-on-primary" : "bg-surface-container-lowest"
    )}>
      {isTransit && (
        <div className="absolute top-0 right-0 p-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-on-primary/20 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-on-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest">In Transit</span>
          </div>
        </div>
      )}

      <CardHeader>
        <CardTitle className={cn("flex items-center gap-2", isTransit ? "text-on-primary" : "text-on-surface")}>
          {isTransit ? <Bus className="animate-bounce" /> : <Clock className="text-primary" />}
          <span>{isTransit ? 'Active Trip' : 'Upcoming Trip'}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className={cn("text-xs uppercase tracking-widest opacity-70", isTransit ? "text-on-primary" : "text-on-surface-variant")}>Route</p>
            <div className="flex items-center gap-3 font-display text-xl font-bold">
              <span>{active.routeName?.split('-')[0] || 'Origin'}</span>
              <ArrowRight size={20} className="opacity-50" />
              <span>{active.routeName?.split('-')[1] || 'Destination'}</span>
            </div>
            <p className={cn("text-sm", isTransit ? "text-on-primary/80" : "text-on-surface-variant")}>
              Scheduled Departure: {!isToday && `${departureDate} at `}{departureTime}
            </p>
          </div>
          
          <div className="text-right space-y-1">
            <p className={cn("text-xs uppercase tracking-widest opacity-70", isTransit ? "text-on-primary" : "text-on-surface-variant")}>Seats</p>
            <p className="text-2xl font-bold">{active.seatsGenerated || 0} Total</p>
          </div>
        </div>

        {!isTransit && nextTrip && (
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
            <p className="text-sm font-medium text-on-surface">
              Your next trip starts at <span className="text-primary font-bold">{departureTime}</span>
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Link 
          href={isTransit ? `/driver/trips/active` : `/driver/trips/${active.tripId}`}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all",
            isTransit 
              ? "bg-on-primary text-primary hover:bg-on-primary/90" 
              : "bg-primary text-on-primary hover:bg-primary/90 shadow-sm shadow-primary/20"
          )}
        >
          {isTransit ? (
            <>
              <Play size={18} fill="currentColor" />
              <span>Go to Active Trip</span>
            </>
          ) : (
            <>
              <span>View Trip Details</span>
              <ArrowRight size={18} />
            </>
          )}
        </Link>
      </CardFooter>
    </Card>
  )
}
