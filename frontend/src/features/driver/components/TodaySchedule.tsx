'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Calendar, ArrowRight, CheckCircle2, Clock, XCircle, Play } from 'lucide-react'
import { Trip, TripStatus } from '@/features/trips/types'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface TodayScheduleProps {
  trips: Trip[]
  isLoading?: boolean
}

export function TodaySchedule({ trips, isLoading }: TodayScheduleProps) {
  return (
    <Card className="bg-surface-container-lowest border-none shadow-ambient">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Calendar size={20} className="text-primary" />
          Today's Schedule
        </CardTitle>
        <span className="text-xs font-medium text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-full">
          {trips.length} Trips Assigned
        </span>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 w-full bg-surface-container animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : trips.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <p className="text-on-surface-variant font-medium">No trips for today</p>
          </div>
        ) : (
          <div className="space-y-3">
            {trips.map((trip) => (
              <Link 
                key={trip.tripId} 
                href={`/driver/trips/${trip.tripId}`}
                className="group block"
              >
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/10 transition-all hover:bg-surface-container-high hover:border-primary/20">
                  <div className="flex flex-col items-center justify-center min-w-[70px] py-1 border-r border-outline-variant/30 pr-4">
                    <span className="text-lg font-black text-on-surface">
                      {new Date(trip.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant">Departure</span>
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 font-display font-bold text-on-surface">
                      <span>Origin</span>
                      <ArrowRight size={14} className="opacity-50" />
                      <span>Destination</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={trip.status} />
                      <span className="text-[10px] text-on-surface-variant font-medium">Bus: {trip.busId.split('-')[0]}</span>
                    </div>
                  </div>

                  <div className="p-2 rounded-full bg-surface-container-lowest text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: TripStatus }) {
  const configs: Record<TripStatus, { label: string; icon: any; color: string }> = {
    SCHEDULED: { label: 'Scheduled', icon: Clock, color: 'bg-blue-500/10 text-blue-500' },
    IN_TRANSIT: { label: 'In Transit', icon: Play, color: 'bg-green-500/10 text-green-500' },
    COMPLETED: { label: 'Completed', icon: CheckCircle2, color: 'bg-surface-container-high text-on-surface-variant' },
    CANCELED: { label: 'Cancelled', icon: XCircle, color: 'bg-red-500/10 text-red-500' },
  }

  const config = configs[status] || configs.SCHEDULED

  return (
    <div className={cn("flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", config.color)}>
      <config.icon size={10} fill={status === 'IN_TRANSIT' ? 'currentColor' : 'none'} className={status === 'IN_TRANSIT' ? 'animate-pulse' : ''} />
      <span>{config.label}</span>
    </div>
  )
}
