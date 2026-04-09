'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { DollarSign, Bus, Users, AlertCircle, ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

export function OwnerDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-on-surface">Fleet Overview</h1>
          <p className="text-on-surface-variant font-medium">Real-time performance and fleet status.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
            All systems nominal
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Revenue', value: '$12,840', change: '+12%', icon: DollarSign, color: 'text-emerald-500' },
          { label: 'Active Buses', value: '24/26', change: '92%', icon: Bus, color: 'text-blue-500' },
          { label: 'Total Bookings', value: '1,204', change: '+8%', icon: Users, color: 'text-purple-500' },
          { label: 'Service Alerts', value: '2', change: 'Action required', icon: AlertCircle, color: 'text-rose-500' },
        ].map((stat, i) => (
          <Card key={i} className="bg-surface-container-lowest border-none shadow-ambient group hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-on-surface-variant uppercase tracking-widest text-[10px]">
                {stat.label}
              </CardTitle>
              <stat.icon className={cn("h-4 w-4", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold text-on-surface">{stat.value}</div>
                <div className="flex items-center text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  {stat.change}
                  <ArrowUpRight className="ml-0.5 h-2 w-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-surface-container-lowest border-none shadow-ambient hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="text-on-surface">Revenue Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-end justify-between gap-2 px-2">
              {[40, 60, 45, 70, 55, 90, 80, 85, 75, 100].map((h, i) => (
                <div 
                  key={i} 
                  className="w-full bg-primary/20 rounded-t-sm group-hover:bg-primary/40 transition-all" 
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
              <span>Sun</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 bg-surface-container-lowest border-none shadow-ambient hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="text-on-surface">Fleet Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { label: 'On Route', count: 18, color: 'bg-emerald-500' },
                { label: 'Maintenance', count: 2, color: 'bg-rose-500' },
                { label: 'Idle', count: 4, color: 'bg-amber-500' },
                { label: 'En-route to Base', count: 2, color: 'bg-blue-500' },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-on-surface-variant font-bold">{item.label}</span>
                    <span className="font-bold text-on-surface">{item.count}</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", item.color)} style={{ width: `${(item.count/26)*100}%` }} />
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

