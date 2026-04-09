'use client'

import React from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export function SearchBar() {
  return (
    <div className="mt-20 glass rounded-[2rem] p-2 shadow-ambient max-w-5xl mx-auto md:mx-0">
      <div className="flex flex-col md:flex-row items-center gap-1 p-2">
        <div className="flex-1 w-full">
          <Input
            placeholder="Dream destination"
            className="bg-transparent border-none focus-visible:ring-0 h-auto py-2"
            icon={<span className="material-symbols-outlined text-primary">location_on</span>}
            label="Where to?"
          />
        </div>
        
        <div className="hidden md:block w-px h-10 bg-outline-variant/20 mx-2" />
        
        <div className="flex-1 w-full">
          <Input
            placeholder="Add dates"
            className="bg-transparent border-none focus-visible:ring-0 h-auto py-2"
            icon={<span className="material-symbols-outlined text-primary">calendar_month</span>}
            label="When?"
          />
        </div>

        <div className="hidden md:block w-px h-10 bg-outline-variant/20 mx-2" />

        <div className="flex-1 w-full">
          <Input
            placeholder="Add guests"
            className="bg-transparent border-none focus-visible:ring-0 h-auto py-2"
            icon={<span className="material-symbols-outlined text-primary">group</span>}
            label="Who?"
          />
        </div>

        <Button className="w-full md:w-auto p-5 rounded-[1.5rem] h-auto aspect-square">
          <span className="material-symbols-outlined text-white">search</span>
        </Button>
      </div>
    </div>
  )
}

// Re-defining Input with Label support if needed, or just use it here locally.
// Actually I'll refine the Input component to handle the "label" style from the design.
