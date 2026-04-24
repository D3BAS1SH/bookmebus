'use client'

import React from 'react'
import { useAuthStore } from '@/features/auth/store/authStore'

export function WelcomeHeader() {
  const { user } = useAuthStore()
  
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="flex flex-col space-y-1">
      <h1 className="text-3xl font-display font-bold text-on-surface">
        {greeting}, {user?.fullName?.split(' ')[0] || 'Driver'} 👋
      </h1>
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-wider uppercase">
          {user?.role || 'DRIVER'}
        </span>
        <span className="text-on-surface-variant text-sm font-medium">
          Today: {today}
        </span>
      </div>
    </div>
  )
}
