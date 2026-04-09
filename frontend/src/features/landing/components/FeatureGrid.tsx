'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

const features = [
  {
    title: '24/7 Updates',
    description: 'Stay informed with real-time notifications about delays, gate changes, and weather alerts.',
    icon: 'schedule',
    color: 'bg-primary-fixed text-primary',
  },
  {
    title: 'Emergency Help',
    description: 'Instant access to local emergency services and our dedicated 24/7 travel support team.',
    icon: 'emergency',
    color: 'bg-error-container text-error',
  },
  {
    title: 'Booking Guidelines',
    description: 'Simplified local regulations and travel requirements clearly explained for every destination.',
    icon: 'rule',
    color: 'bg-tertiary-fixed text-tertiary',
  },
  {
    title: 'Pre-booking (3 mo)',
    description: 'Secure your spots up to three months in advance with our priority reservation system.',
    icon: 'event_available',
    color: 'bg-secondary-fixed text-secondary',
  },
  {
    title: 'Cancellation Policy',
    description: 'Flexible, no-questions-asked cancellation windows for a stress-free planning experience.',
    icon: 'cancel',
    color: 'bg-primary-fixed text-primary',
  },
  {
    title: 'Instant Confirmation',
    description: 'No more waiting. Get your digital tickets and confirmation codes delivered instantly.',
    icon: 'verified',
    color: 'bg-tertiary-fixed text-tertiary',
  },
  {
    title: 'Real-time Availability',
    description: 'What you see is what you get. Our inventory updates in milliseconds to prevent double bookings.',
    icon: 'bolt',
    color: 'bg-secondary-fixed text-secondary',
  },
  {
    title: 'Customer-first',
    description: 'Dedicated concierge services that prioritize your comfort and safety above all else.',
    icon: 'heart_check',
    color: 'bg-primary-fixed text-primary',
  },
  {
    title: 'Live Bus Tracking',
    description: 'Track your transfers and shuttles in real-time with precise GPS location mapping.',
    icon: 'near_me',
    color: 'bg-secondary-fixed text-secondary',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
}

export function FeatureGrid() {
  return (
    <section className="py-32 px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div className="max-w-xl">
          <h2 className="font-display text-4xl font-extrabold text-on-surface mb-6">
            Designed for Seamless Travel
          </h2>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Experience a travel ecosystem that anticipates your needs, from the moment you dream of a trip to the second you return home.
          </p>
        </div>
        <div>
          <Badge variant="success" className="px-4 py-2 gap-2 text-sm">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            Verified Safe
          </Badge>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {features.map((feature, index) => (
          <motion.div key={feature.title} variants={itemVariants}>
            <Card className="p-8 group hover:bg-surface-container-low transition-colors duration-500">
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                <span className="material-symbols-outlined">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                {feature.description}
              </p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
