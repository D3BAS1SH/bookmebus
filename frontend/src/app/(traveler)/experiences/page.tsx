'use client'

import React from 'react'
import Image from 'next/image'
import { Navbar } from '@/components/common/Navbar'
import { Footer } from '@/components/common/Footer'
import { Badge } from '@/components/ui/Badge'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Wifi, Wind, BedDouble, Coffee, ShieldCheck, Map, Smartphone, Tv } from 'lucide-react'

const experiences = [
  {
    id: 'sleeper-buses',
    title: 'Premium Sleeper Buses',
    description: 'Travel in ultimate comfort with our state-of-the-art sleeper buses, designed for a restful journey across long distances.',
    icon: <BedDouble className="w-8 h-8 text-primary" />,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=3538&auto=format&fit=crop',
    features: ['Ergonomic memory foam mattresses', 'Privacy curtains', 'Personal reading lights', 'Charging ports at every berth']
  },
  {
    id: 'ac-climate',
    title: 'Advanced AC & Climate Control',
    description: 'Experience perfect temperatures throughout your journey, regardless of the weather outside.',
    icon: <Wind className="w-8 h-8 text-primary" />,
    image: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=3540&auto=format&fit=crop',
    features: ['Individual AC vents', 'Air purification systems', 'Optimized humidity control', 'Quiet cooling technology']
  },
  {
    id: 'connectivity',
    title: 'High-Speed Wi-Fi & Entertainment',
    description: 'Stay connected and entertained throughout your trip with our onboard digital amenities.',
    icon: <Wifi className="w-8 h-8 text-primary" />,
    image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=3540&auto=format&fit=crop',
    features: ['Free high-speed Wi-Fi', 'Personal entertainment screens', 'Curated movie libraries', 'USB & Type-C charging']
  },
  {
    id: 'lounges',
    title: 'Premium Boarding Lounges',
    description: 'Start your journey right with access to our exclusive, comfortable boarding lounges across major cities.',
    icon: <Coffee className="w-8 h-8 text-primary" />,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=3538&auto=format&fit=crop',
    features: ['Comfortable seating', 'Complimentary refreshments', 'Clean washrooms', 'Real-time departure screens']
  },
  {
    id: 'scenic',
    title: 'Scenic Views',
    description: 'Enjoy breathtaking landscapes through our panoramic windows, turning your travel into a sightseeing tour.',
    icon: <Map className="w-8 h-8 text-primary" />,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=3540&auto=format&fit=crop',
    features: ['Panoramic anti-glare windows', 'Elevated seating views', 'Clean glass policy', 'Curated scenic routes']
  }
]

export default function ExperiencesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <Badge variant="default" className="mb-6 px-4 py-1.5 uppercase tracking-wider text-xs">
              THE VOYAGER EXPERIENCE
            </Badge>
            <h1 className="font-display text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tighter mb-6">
              Travel in Unmatched Comfort
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              We believe the journey should be as beautiful as the destination. Discover the premium amenities that make traveling with us a world-class experience.
            </p>
          </div>

          <div className="space-y-24">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
                className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}
              >
                <div className="w-full lg:w-1/2">
                  <div className="relative h-[400px] w-full rounded-3xl overflow-hidden ambient-shadow">
                    <Image
                      src={exp.image}
                      alt={exp.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
                
                <div className="w-full lg:w-1/2 space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    {exp.icon}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white">
                    {exp.title}
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                    {exp.description}
                  </p>
                  
                  <ul className="space-y-4 pt-4">
                    {exp.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-slate-700 dark:text-slate-200 font-medium">
                        <ShieldCheck className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
