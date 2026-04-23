'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { SearchBar } from './SearchBar'

export function Hero() {
  return (
    <header className="relative min-h-[921px] flex items-center overflow-hidden">
      {/* Background Image with Hero Mask */}
      <div className="absolute inset-0 z-0 bg-slate-900">
        <Image
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=3540&auto=format&fit=crop"
          alt="Ethereal Mountain Range"
          className="object-cover hero-mask opacity-80"
          priority
          fill
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent z-10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full pt-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="default" className="mb-6 px-4 py-1.5 uppercase tracking-wider text-xs">
              THE WEIGHTLESS JOURNEY
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display text-6xl md:text-7xl font-extrabold text-white tracking-tighter leading-[1.1] mb-6"
          >
            Plan Your Journey with Confidence
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-white/90 font-medium leading-relaxed mb-10 max-w-lg"
          >
            Real-time booking, tracking, and support for a seamless travel experience designed for the modern explorer.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <Button size="lg" className="group">
              Book Now
              <span className="material-symbols-outlined ml-2 text-lg group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Button>
            <Button variant="secondary" size="lg">
              Explore Routes
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <SearchBar />
        </motion.div>
      </div>
    </header>
  )
}
