import React from 'react'
import { cn } from '@/lib/utils'
import { Compass } from 'lucide-react'

export function Branding({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl primary-gradient text-white shadow-ambient">
        <Compass className="h-6 w-6" />
      </div>
      <span className="text-xl font-display font-black tracking-tighter text-on-surface">
        Ethereal Voyager
      </span>
    </div>
  )
}
