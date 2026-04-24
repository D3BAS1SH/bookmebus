'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Bus, Users, CheckCircle2 } from 'lucide-react'
import { DriverDashboardStats } from '../types'
import { cn } from '@/lib/utils'

interface QuickStatsProps {
  stats: DriverDashboardStats
  isLoading?: boolean
}

export function QuickStats({ stats, isLoading }: QuickStatsProps) {
  const statItems = [
    { label: 'Trips Today', value: stats.tripsToday, icon: Bus, color: 'bg-blue-500/10 text-blue-500' },
    { label: "Today's Seats", value: stats.totalSeatsToday, icon: Users, color: 'bg-green-500/10 text-green-500' },
    { label: 'Boarded Today', value: stats.boardedToday, icon: CheckCircle2, color: 'bg-purple-500/10 text-purple-500' },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {statItems.map((item, i) => (
        <Card key={i} className="bg-surface-container-lowest border-none shadow-ambient">
          <CardContent className="p-4 flex flex-col items-center justify-center space-y-2">
            <div className={cn("p-2 rounded-xl", item.color)}>
              <item.icon size={20} />
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-on-surface">{isLoading ? '...' : item.value}</p>
              <p className="text-[10px] uppercase font-bold tracking-tighter text-on-surface-variant whitespace-nowrap">
                {item.label}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
