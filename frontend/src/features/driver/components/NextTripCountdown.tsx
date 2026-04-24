'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Timer, Clock } from 'lucide-react'
import { Trip } from '@/features/trips/types'

interface NextTripCountdownProps {
  trip?: Trip | null
}

export function NextTripCountdown({ trip }: NextTripCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>('')

  useEffect(() => {
    if (!trip) return

    const targetDate = new Date(trip.departureTime).getTime()

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate - now

      if (distance < 0) {
        setTimeLeft('Boarding Now')
        clearInterval(interval)
        return
      }

      const hours = Math.floor(distance / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
    }, 1000)

    return () => clearInterval(interval)
  }, [trip])

  if (!trip) {
    return (
      <Card className="bg-surface-container-lowest border-none h-full opacity-50 grayscale">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2 opacity-60">
            <Timer size={16} />
            Next Trip In
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6 text-center">
          <p className="text-xs font-medium text-on-surface-variant">No upcoming trips today</p>
        </CardContent>
      </Card>
    )
  }

  const departureTime = new Date(trip.departureTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <Card className="bg-surface-container-lowest border-none shadow-ambient h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
          <Timer size={16} className="text-orange-500" />
          Next Trip In
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-4xl font-display font-black text-on-surface tabular-nums tracking-tight">
            {timeLeft || '--h --m --s'}
          </div>
          <p className="text-[10px] uppercase font-bold tracking-widest text-orange-500 mt-1">Countdown Started</p>
        </div>

        <div className="p-3 rounded-2xl bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-on-surface-variant" />
            <span className="text-xs font-medium text-on-surface">Departing at</span>
          </div>
          <span className="text-sm font-bold text-primary">{departureTime}</span>
        </div>
      </CardContent>
    </Card>
  )
}
