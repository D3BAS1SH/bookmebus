'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card'
import { Users, Search, CheckCircle2 } from 'lucide-react'
import { useBoardingStatus } from '../hooks/useBoardingStatus'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/Skeleton'

interface BoardingSummaryProps {
  tripId?: string
}

export function BoardingSummary({ tripId }: BoardingSummaryProps) {
  const { boardingStatus, isLoading } = useBoardingStatus(tripId)

  if (!tripId) {
    return (
      <Card className="bg-surface-container-lowest border-none h-full opacity-50 grayscale">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2 opacity-60">
            <Users size={16} />
            Boarding Status
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6 text-center space-y-2">
          <p className="text-xs font-medium text-on-surface-variant">No active trip</p>
          <div className="w-full h-2 bg-outline-variant/20 rounded-full" />
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="bg-surface-container-lowest border-none h-full">
        <CardHeader>
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-16 mx-auto" />
          <Skeleton className="h-2 w-full" />
        </CardContent>
      </Card>
    )
  }

  const { boardedCount, totalBookings, percentage } = boardingStatus || { boardedCount: 0, totalBookings: 0, percentage: 0 }

  return (
    <Card className="bg-surface-container-lowest border-none shadow-ambient h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
          <Users size={16} className="text-primary" />
          Boarding Status
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-center space-y-1">
          <div className="text-4xl font-display font-black text-on-surface">
            {boardedCount} <span className="text-lg font-medium text-on-surface-variant">/ {totalBookings}</span>
          </div>
          <p className="text-[10px] uppercase font-bold tracking-tighter text-on-surface-variant">Passengers Boarded</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-xs font-bold text-primary">{percentage}% Complete</span>
            <span className="text-[10px] font-medium text-on-surface-variant">{totalBookings - boardedCount} remaining</span>
          </div>
          <div className="h-3 w-full bg-surface-container-high rounded-full overflow-hidden p-0.5 border border-outline-variant/10">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-1000 ease-out shadow-sm shadow-primary/30"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Link 
          href={`/driver/trips/${tripId}/scan`}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-surface-container-high text-on-surface font-bold text-sm hover:bg-primary hover:text-on-primary transition-all shadow-sm"
        >
          <Search size={16} />
          <span>Open Scanner</span>
        </Link>
      </CardFooter>
    </Card>
  )
}
