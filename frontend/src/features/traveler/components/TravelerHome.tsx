'use client'

import React from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { MapPin, ArrowRight, Star, History, Compass, Map as MapIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const DESTINATIONS = [
  {
    id: 'puri',
    name: 'Puri, Odisha',
    image: '/images/puri.png',
    description: 'Visit the sacred Jagannath Temple and enjoy the serene Golden Beach.',
    rating: 4.9,
    price: 'From ₹800'
  },
  {
    id: 'rishikesh',
    name: 'Rishikesh, Uttarakhand',
    image: '/images/rishikesh.png',
    description: 'The yoga capital of the world, nestled in the Himalayan foothills.',
    rating: 4.8,
    price: 'From ₹1,200'
  },
  {
    id: 'goa',
    name: 'Goa',
    image: '/images/goa.png',
    description: 'A paradise of sun-kissed beaches and vibrant colonial history.',
    rating: 4.7,
    price: 'From ₹1,500'
  }
]

const PAST_TRIPS = [
  {
    id: '1',
    route: 'Bhubaneswar → Puri',
    date: 'Oct 12, 2025',
    status: 'Completed',
    image: '/images/puri.png'
  },
  {
    id: '2',
    route: 'Dehradun → Rishikesh',
    date: 'Aug 05, 2025',
    status: 'Completed',
    image: '/images/rishikesh.png'
  }
]

export function TravelerHome() {
  return (
    <div className="space-y-16 pb-20 animate-in fade-in duration-1000 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto px-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-8 border border-primary/20">
            <Compass className="h-3 w-3" />
            Your Next Adventure Awaits
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black tracking-tight mb-8 text-on-surface leading-tight">
            Explore the <br /> 
            <span className="bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">Incredible India</span>
          </h1>
          <p className="text-xl text-on-surface-variant max-w-2xl mx-auto font-medium leading-relaxed mb-10">
            From the sacred temples of Odisha to the mist-covered peaks of Uttarakhand. 
            Travel comfortably, safely, and style with BookMeBus.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/traveler/trips">
              <Button size="lg" className="h-14 px-10 primary-gradient font-bold rounded-2xl shadow-lg shadow-primary/20 group">
                Plan Your Trip
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/traveler/tracking">
              <Button size="lg" variant="outline" className="h-14 px-10 border-outline-variant/30 font-bold rounded-2xl bg-surface/50 backdrop-blur-sm">
                Track Live Bus
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-container/5 rounded-full blur-3xl -z-10" />
      </section>

      {/* Featured Destinations */}
      <section className="space-y-8 px-4 max-w-7xl mx-auto">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-display font-black tracking-tight text-on-surface">Explore Destinations</h2>
            <p className="text-on-surface-variant font-medium">Handpicked places for your next journey</p>
          </div>
          <Link href="/traveler/trips">
            <Button variant="ghost" className="font-bold text-primary group">
              View All <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {DESTINATIONS.map((dest, i) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="group overflow-hidden bg-surface-container-lowest border-none shadow-ambient hover:shadow-2xl transition-all duration-500 rounded-3xl">
                <div className="aspect-[4/5] relative overflow-hidden">
                  <Image 
                    src={dest.image} 
                    alt={dest.name} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/30">
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-bold text-white">{dest.rating}</span>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 space-y-2">
                    <h3 className="text-2xl font-display font-bold text-white">{dest.name}</h3>
                    <p className="text-white/70 text-sm line-clamp-2 font-medium">{dest.description}</p>
                    <div className="pt-4 flex items-center justify-between">
                      <span className="text-white font-bold">{dest.price}</span>
                      <Button size="sm" className="bg-white text-primary hover:bg-white/90 font-bold rounded-xl px-4">
                        Explore
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats/Quick Actions */}
      <section className="bg-surface-container-low/50 py-16 border-y border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex items-start gap-6">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <MapIcon className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg">Wide Network</h3>
              <p className="text-on-surface-variant text-sm font-medium leading-relaxed">Connecting over 100+ cities across India with 500+ daily trips.</p>
            </div>
          </div>
          <div className="flex items-start gap-6">
            <div className="h-16 w-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0">
              <Star className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg">Premium Comfort</h3>
              <p className="text-on-surface-variant text-sm font-medium leading-relaxed">Verified fleet with VIP vans, sleeper buses, and luxury coaches.</p>
            </div>
          </div>
          <div className="flex items-start gap-6">
            <div className="h-16 w-16 rounded-2xl bg-tertiary/10 flex items-center justify-center text-tertiary flex-shrink-0">
              <History className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg">Real-time Support</h3>
              <p className="text-on-surface-variant text-sm font-medium leading-relaxed">24/7 assistance and live bus tracking for your peace of mind.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Past Journeys */}
      <section className="space-y-8 px-4 max-w-7xl mx-auto">
        <div className="space-y-2">
          <h2 className="text-3xl font-display font-black tracking-tight text-on-surface">Where You've Been</h2>
          <p className="text-on-surface-variant font-medium">Relive your favorite memories</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PAST_TRIPS.map((trip) => (
            <Card key={trip.id} className="group flex flex-col sm:flex-row overflow-hidden bg-surface-container-lowest border-none shadow-ambient hover:shadow-xl transition-all rounded-3xl">
              <div className="w-full sm:w-48 h-48 relative overflow-hidden">
                <Image 
                  src={trip.image} 
                  alt={trip.route} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 200px"
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                />
              </div>
              <CardContent className="p-8 flex-1 flex flex-col justify-center gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest">
                  <History className="h-3 w-3" />
                  {trip.date}
                </div>
                <h3 className="text-xl font-bold text-on-surface">{trip.route}</h3>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-[10px] font-black uppercase tracking-widest">
                    {trip.status}
                  </div>
                </div>
                <Button variant="link" className="p-0 h-auto w-fit text-primary font-bold group mt-2">
                  View Details <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Newsletter/Inspiration */}
      <section className="px-4 max-w-7xl mx-auto">
        <div className="relative rounded-[3rem] overflow-hidden primary-gradient p-12 md:p-20 text-center text-white shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10 space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-display font-black leading-tight">Ready for your next adventure?</h2>
            <p className="text-white/80 text-lg max-w-xl mx-auto font-medium">
              Join 1,000,000+ travelers who explore India with BookMeBus every year.
            </p>
            <div className="pt-4 relative z-10">
              <Link href="/traveler/trips">
                <Button size="lg" className="h-16 px-12 !bg-white !text-primary hover:!bg-white/90 font-black rounded-2xl shadow-xl border-none">
                  Book A Trip Now
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
