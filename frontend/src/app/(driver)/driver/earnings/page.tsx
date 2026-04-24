'use client'

import React from 'react'
import { Wallet, Loader2 } from 'lucide-react'

export default function EarningsPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Wallet size={40} className="text-primary" />
      </div>
      
      <h1 className="text-3xl font-bold text-on-surface mb-2">Driver Earnings</h1>
      <p className="text-on-surface-variant max-w-md mx-auto mb-8">
        We are finalizing the calculation system to ensure your payouts are accurate and timely.
      </p>

      <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-surface-container-high border border-outline-variant/10 text-primary font-bold shadow-ambient">
        <Loader2 className="animate-spin" size={20} />
        <span>Will be loaded soon...</span>
      </div>
    </div>
  )
}
