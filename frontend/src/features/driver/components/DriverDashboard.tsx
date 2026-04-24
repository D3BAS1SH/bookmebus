'use client'

import React, { useEffect, useState } from 'react'
import { WelcomeHeader } from './WelcomeHeader'
import { ActiveTripCard } from './ActiveTripCard'
import { BoardingSummary } from './BoardingSummary'
import { NextTripCountdown } from './NextTripCountdown'
import { QuickStats } from './QuickStats'
import { TodaySchedule } from './TodaySchedule'
import { useDriverDashboard } from '../hooks/useDriverDashboard'
import { useBoardingStatus } from '../hooks/useBoardingStatus'
import { Skeleton } from '@/components/ui/Skeleton'

export function DriverDashboard() {
  const { 
    activeTrip, 
    nextTrip, 
    todayTrips, 
    stats, 
    isLoading: isTripsLoading 
  } = useDriverDashboard()

  // Only fetch boarding for the active trip or the next trip if it's almost time
  const boardingTripId = activeTrip?.tripId || nextTrip?.tripId
  const { boardingStatus, isLoading: isBoardingLoading } = useBoardingStatus(boardingTripId)

  // Merge boarding stats into overall stats
  const enhancedStats = {
    ...stats,
    boardedToday: boardingStatus?.boardedCount || 0
  }

  if (isTripsLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Component 1: Welcome Header */}
      <WelcomeHeader />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 units) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Component 2: Active Trip Card */}
          <ActiveTripCard trip={activeTrip} nextTrip={nextTrip} />

          {/* Component 5: Quick Stats Row */}
          <QuickStats stats={enhancedStats} isLoading={isBoardingLoading} />

          {/* Component 3: Today's Schedule */}
          <TodaySchedule trips={todayTrips} />
        </div>

        {/* Right Column (4 units) */}
        <div className="lg:col-span-4 space-y-8">
          {/* Component 4: Boarding Summary */}
          <BoardingSummary tripId={boardingTripId} />

          {/* Component 6: Next Trip Countdown */}
          {!activeTrip && <NextTripCountdown trip={nextTrip} />}
          
          {/* Additional Info / Help Card */}
          <div className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/10 space-y-4">
            <h4 className="font-bold text-on-surface">Need Help?</h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              If you encounter any issues with your route or passengers, contact dispatch immediately via the emergency button in the active trip view.
            </p>
            <button className="w-full py-3 rounded-xl border border-outline-variant text-xs font-bold hover:bg-surface-container transition-colors">
              Contact Dispatch
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <Skeleton className="h-64 w-full rounded-3xl" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-32 w-full rounded-3xl" />
            <Skeleton className="h-32 w-full rounded-3xl" />
            <Skeleton className="h-32 w-full rounded-3xl" />
          </div>
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
        <div className="lg:col-span-4 space-y-8">
          <Skeleton className="h-80 w-full rounded-3xl" />
          <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  )
}
