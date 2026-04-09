'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Search, MapPin, Calendar, ArrowRightLeft } from 'lucide-react'
import { motion } from 'framer-motion'

export function TravelerHome() {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Section */}
      <section className="relative py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight mb-6 bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            Where are you <br /> heading today?
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Book your bus tickets and track your journey in real-time. 
            Safe, reliable, and always on time.
          </p>
        </motion.div>
      </section>

      {/* Search UI */}
      <section className="relative -mt-8 z-10">
        <Card className="max-w-4xl mx-auto border-white/10 bg-zinc-900/80 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto] items-center gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">From</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                  <Input placeholder="Origin city" className="pl-10 bg-white/5 border-white/5 h-12" />
                </div>
              </div>

              <div className="flex justify-center pt-6">
                <div className="h-10 w-10 rounded-full bg-zinc-800 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-primary transition-colors cursor-pointer active:rotate-180 duration-500">
                  <ArrowRightLeft className="h-4 w-4" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">To</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                  <Input placeholder="Destination city" className="pl-10 bg-white/5 border-white/5 h-12" />
                </div>
              </div>

              <div className="md:pt-6">
                <Button className="w-full md:w-auto h-12 px-8 primary-gradient font-bold">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Popular Routes */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-display font-bold">Popular Routes</h2>
          <Button variant="link" className="text-primary p-0 h-auto">View all</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((_, i) => (
            <Card key={i} className="group overflow-hidden bg-zinc-900/40 border-white/5 hover:border-primary/20 transition-all">
              <div className="aspect-[16/9] bg-zinc-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                <div className="absolute bottom-4 left-4 z-20">
                  <p className="text-sm font-bold text-white">Route {i + 1}</p>
                  <p className="text-xs text-zinc-400">Daily service</p>
                </div>
              </div>
              <CardContent className="p-4 flex items-center justify-between">
                <p className="font-bold text-lg">$25.00</p>
                <Button size="sm" variant="outline" className="text-[10px] uppercase font-bold tracking-widest border-white/10 group-hover:bg-primary group-hover:text-white transition-all">
                  Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
