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
      <div className="absolute inset-0 z-0">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtNmv157iZOu-dHQU71TwGA250eOH5_1xxtYSb83e45C9ArriuybVq_VzXxVpJmfh3GuS5-S6O7_aFz7SbZei1gRxVchEcB0yzVfgoclFyx572oAaohRoUvDXZXT-ZI6ygTG60FE8s5XHFwTDkqKAnmt1_AoK2Qk3VUzjOETv-d2p2ryrAvCgQLxOp-bf7_6ALPCsxsdAxH-lOibG9RGFfP8qZY6CmrMZWervq0evasmQUmdWP4eipF8LT6evzat_aygmwsFX7qjSa"
          alt="Ethereal Mountain Range"
          sizes='fit'
          className="object-cover hero-mask"
          priority
          height={1080}
          width={1920}
        />
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
            className="font-display text-6xl md:text-7xl font-extrabold text-on-surface tracking-tighter leading-[1.1] mb-6"
          >
            Plan Your Journey with Confidence
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-on-surface-variant font-medium leading-relaxed mb-10 max-w-lg"
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
