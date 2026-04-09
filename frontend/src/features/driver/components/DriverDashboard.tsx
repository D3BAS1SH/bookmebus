'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Bus, Users, MapPin, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export function DriverDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-display font-bold text-on-surface">Driver Dashboard</h1>
        <p className="text-on-surface-variant font-medium">Welcome back! Here's your trip overview for today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Today\'s Trips', value: '3', icon: Bus, color: 'text-blue-500' },
          { label: 'Total Passengers', value: '142', icon: Users, color: 'text-green-500' },
          { label: 'Next Stop', value: 'City Center', icon: MapPin, color: 'text-orange-500' },
          { label: 'Rating', value: '4.9', icon: TrendingUp, color: 'text-yellow-500' },
        ].map((stat, i) => (
          <Card key={i} className="bg-surface-container-lowest border-none shadow-ambient hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-on-surface-variant uppercase tracking-widest text-[10px]">
                {stat.label}
              </CardTitle>
              <stat.icon className={cn("h-4 w-4", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-on-surface">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-surface-container-lowest border-none shadow-ambient">
          <CardHeader>
            <CardTitle className="text-on-surface">Active Trip Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center border border-dashed border-outline-variant/30 rounded-lg text-on-surface-variant bg-surface-container-low/30 font-medium">
              [Map View / Tracking Visualization Placeholder]
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 bg-surface-container-lowest border-none shadow-ambient">
          <CardHeader>
            <CardTitle className="text-on-surface">Upcoming Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-outline-variant/10 bg-surface-container-low transition-colors hover:bg-surface-container">
                  <div className="h-2 w-2 rounded-full bg-primary shadow-sm shadow-primary/30" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-on-surface">Route 40{i} - Downtown</p>
                    <p className="text-xs text-on-surface-variant">Scheduled: 1{i}:30 PM</p>
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

