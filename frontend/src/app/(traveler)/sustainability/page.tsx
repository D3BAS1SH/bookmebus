'use client'

import React from 'react'
import { Navbar } from '@/components/common/Navbar'
import { Footer } from '@/components/common/Footer'
import { Badge } from '@/components/ui/Badge'

export default function SustainabilityPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <Badge variant="default" className="mb-6 px-4 py-1.5 uppercase tracking-wider text-xs">
            OUR COMMITMENT
          </Badge>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tighter mb-6">
            Sustainability
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            We are working hard to build a greener future. Information about our sustainability initiatives is coming soon.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
