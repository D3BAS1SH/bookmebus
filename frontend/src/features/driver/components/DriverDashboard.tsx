'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Bus, Users, MapPin, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export function DriverDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-display font-bold">Driver Dashboard</h1>
        <p className="text-zinc-400">Welcome back! Here's your trip overview for today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Today\'s Trips', value: '3', icon: Bus, color: 'text-blue-500' },
          { label: 'Total Passengers', value: '142', icon: Users, color: 'text-green-500' },
          { label: 'Next Stop', value: 'City Center', icon: MapPin, color: 'text-orange-500' },
          { label: 'Rating', value: '4.9', icon: TrendingUp, color: 'text-yellow-500' },
        ].map((stat, i) => (
          <Card key={i} className="bg-zinc-900/50 border-white/5 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                {stat.label}
              </CardTitle>
              <stat.icon className={cn("h-4 w-4", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-zinc-900/50 border-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Active Trip Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center border border-dashed border-white/10 rounded-lg text-zinc-500">
              [Map View / Tracking Visualization Placeholder]
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 bg-zinc-900/50 border-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Upcoming Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-white/5 bg-white/[0.02]">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Route 40{i} - Downtown</p>
                    <p className="text-xs text-zinc-500">Scheduled: 1{i}:30 PM</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

