'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const steps = [
  {
    title: 'Search',
    description: 'Browse thousands of curated global destinations.',
    icon: 'travel_explore',
  },
  {
    title: 'Book',
    description: 'Seamless checkout with instant digital confirmation.',
    icon: 'confirmation_number',
  },
  {
    title: 'Track',
    description: 'Monitor your journey live with our Voyager app.',
    icon: 'location_searching',
  },
  {
    title: 'Travel',
    description: 'Focus on the moment while we handle the logistics.',
    icon: 'flight_takeoff',
    highlight: true,
  },
]

export function Workflow() {
  return (
    <section className="py-24 bg-surface-container-low overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl font-extrabold text-on-surface mb-4"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-on-surface-variant max-w-md mx-auto"
          >
            Four simple steps to your next unforgettable memory.
          </motion.p>
        </div>

        <div className="relative flex flex-col md:flex-row justify-between gap-12">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-10 left-0 w-full h-px bg-outline-variant/30 z-0" />

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative z-10 flex-1 flex flex-col items-center text-center group"
            >
              <div
                className={cn(
                  'w-20 h-20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-ambient border border-outline-variant/10',
                  step.highlight 
                    ? 'primary-gradient text-white' 
                    : 'bg-surface-container-lowest text-primary'
                )}
              >
                <span className="material-symbols-outlined text-3xl">
                  {step.icon}
                </span>
              </div>
              <h4 className="text-xl font-bold mb-2 text-on-surface">
                {step.title}
              </h4>
              <p className="text-sm text-on-surface-variant px-4">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
