'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Calendar, Search, ArrowRightLeft, ChevronRight, Info, ChevronDown, Check } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

const ODISHA_CITIES = [
  'Bhubaneswar',
  'Cuttack',
  'Puri',
  'Rourkela',
  'Sambalpur',
  'Berhampur',
  'Balasore',
  'Jharsuguda',
  'Baripada',
  'Bhadrak'
]

interface CitySelectorProps {
  label: string
  value: string
  onChange: (city: string) => void
  icon: any
  placeholder: string
}

function CitySelector({ label, value, onChange, icon: Icon, placeholder }: CitySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div 
      className="relative p-6 space-y-2 hover:bg-surface-container-low transition-all duration-300 cursor-pointer group select-none" 
      ref={containerRef} 
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px]">
          <Icon className="h-3 w-3" />
          {label}
        </div>
        <ChevronDown className={cn("h-3 w-3 text-outline transition-transform duration-300", isOpen && "rotate-180")} />
      </div>
      
      <div className="text-on-surface font-semibold text-xl truncate pr-4">
        {value || <span className="text-zinc-300 font-medium">{placeholder}</span>}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute left-0 right-0 top-full mt-2 z-50 glass rounded-xl shadow-ambient overflow-hidden py-2"
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {ODISHA_CITIES.map((city) => (
                <div
                  key={city}
                  onClick={(e) => {
                    e.stopPropagation()
                    onChange(city)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "px-4 py-3 text-sm font-medium transition-colors flex items-center justify-between m-1 rounded-lg",
                    value === city 
                      ? "primary-gradient text-white shadow-sm" 
                      : "text-on-surface hover:bg-primary/10"
                  )}
                >
                  {city}
                  {value === city && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Check className="h-4 w-4" />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function SearchTrip() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  // Date constraints
  const today = new Date().toISOString().split('T')[0]
  const threeMonthsFromNow = new Date()
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
  const maxDate = threeMonthsFromNow.toISOString().split('T')[0]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!from || !to || !date) return
    
    setIsSearching(true)
    setTimeout(() => {
      setIsSearching(false)
    }, 1500)
  }

  const switchLocations = () => {
    setFrom(to)
    setTo(from)
  }

  return (
    <div className="min-h-screen bg-surface py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Editorial Header */}
        <section className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-display font-black text-on-surface tracking-tighter leading-none">
              Explore <span className="text-primary italic">Odisha</span>
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-on-surface-variant text-lg max-w-xl mx-auto font-medium"
          >
            Experience the weightless journey across the soul of India. 
            Select your route and travel in premium comfort.
          </motion.p>
        </section>

        {/* Search Engine - The Signature Component */}
        <section className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="rounded-xl border-none shadow-ambient bg-surface-container-lowest overflow-visible">
              <CardContent className="p-0">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-stretch">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-outline-variant/15">
                    {/* From Selector */}
                    <CitySelector 
                      label="From" 
                      value={from} 
                      onChange={setFrom} 
                      icon={MapPin} 
                      placeholder="Origin City" 
                    />

                    {/* To Selector */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={switchLocations}
                        className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass flex items-center justify-center text-primary shadow-sm hover:scale-110 active:rotate-180 transition-all duration-300 hidden md:flex border border-outline-variant/10"
                      >
                        <ArrowRightLeft className="h-4 w-4" />
                      </button>
                      <CitySelector 
                        label="To" 
                        value={to} 
                        onChange={setTo} 
                        icon={MapPin} 
                        placeholder="Destination" 
                      />
                    </div>

                    {/* Date Selector */}
                    <div className="p-6 space-y-2 hover:bg-surface-container-low transition-colors duration-300 relative group">
                      <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px]">
                        <Calendar className="h-3 w-3" />
                        Departure Date
                      </div>
                      <div className="relative">
                        <input
                          type="date"
                          value={date}
                          min={today}
                          max={maxDate}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full bg-transparent border-none p-0 text-on-surface font-semibold text-xl focus:ring-0 cursor-pointer [color-scheme:light]"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="p-4 md:p-6 bg-surface-container flex items-center justify-center">
                    <Button 
                      type="submit" 
                      disabled={isSearching}
                      className={cn(
                        "w-full md:w-auto h-16 md:h-full px-12 rounded-full primary-gradient text-white font-bold text-lg shadow-lg hover:shadow-primary/30 transition-all active:scale-95 disabled:opacity-70",
                        isSearching && "animate-pulse"
                      )}
                    >
                      {isSearching ? (
                        "Searching..."
                      ) : (
                        <div className="flex items-center gap-2">
                          <Search className="h-5 w-5" />
                          <span>Search Trip</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Badge */}
          <div className="absolute -top-3 right-8">
            <Badge className="bg-tertiary-container text-on-tertiary-container border-none px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
              One-way Departure
            </Badge>
          </div>
        </section>

        {/* Informational Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex gap-4 p-6 rounded-lg bg-surface-container-low"
          >
            <div className="h-12 w-12 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Info className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-bold text-on-surface">Plan Ahead</h3>
              <p className="text-on-surface-variant text-sm">
                Bookings are open up to 3 months in advance. Secure your preferred seats early for the best experience.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex gap-4 p-6 rounded-lg bg-surface-container-low"
          >
            <div className="h-12 w-12 shrink-0 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
              <ArrowRightLeft className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-bold text-on-surface">Odisha Daily Routes</h3>
              <p className="text-on-surface-variant text-sm">
                Frequent daily services connecting Bhubaneswar with major cultural and industrial hubs across the state.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Bottom CTA */}
        <section className="text-center pt-8 border-t border-outline-variant/10">
          <button className="text-primary font-bold flex items-center gap-1 mx-auto hover:gap-2 transition-all">
            See all destination guides <ChevronRight className="h-4 w-4" />
          </button>
        </section>
      </div>
    </div>
  )
}
