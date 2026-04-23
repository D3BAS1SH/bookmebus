'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin,
  Calendar,
  Search,
  ArrowRightLeft,
  ChevronRight,
  Info,
  ChevronDown,
  Check,
  Loader2,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'
import { useAllLocations } from '@/features/traveler/hooks/useTraveler'
import type { Location } from '@/features/traveler/types'

/* ─── Location Selector ────────────────────────────────────────── */

interface LocationSelectorProps {
  label: string
  icon: React.ElementType
  locations: Location[]
  value: Location | null
  onChange: (loc: Location) => void
  placeholder: string
  excludeId?: string
  isLoading: boolean
}

function LocationSelector({
  label,
  icon: Icon,
  locations,
  value,
  onChange,
  placeholder,
  excludeId,
  isLoading,
}: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState('')
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

  const filteredLocations = useMemo(() => {
    let list = locations
    if (excludeId) list = list.filter((l) => l.locationId !== excludeId)
    if (!filter) return list
    return list.filter((l) => l.locationName.toLowerCase().includes(filter.toLowerCase()))
  }, [locations, filter, excludeId])

  if (isLoading) {
    return (
      <div className="p-6 space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-7 w-36" />
      </div>
    )
  }

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
        <ChevronDown
          className={cn(
            'h-3 w-3 text-outline transition-transform duration-300',
            isOpen && 'rotate-180'
          )}
        />
      </div>

      <div className="text-on-surface font-semibold text-xl truncate pr-4">
        {value ? (
          value.locationName
        ) : (
          <span className="text-zinc-300 font-medium">{placeholder}</span>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute left-0 right-0 top-full mt-2 z-50 glass rounded-xl shadow-ambient overflow-hidden"
          >
            {/* Search filter */}
            <div className="p-3 border-b border-outline-variant/10">
              <input
                type="text"
                placeholder="Search cities..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="max-h-60 overflow-y-auto custom-scrollbar py-2">
              {filteredLocations.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-on-surface-variant">
                  No locations found
                </div>
              ) : (
                filteredLocations.map((loc) => {
                  const isSelected = value?.locationId === loc.locationId
                  return (
                    <div
                      key={loc.locationId}
                      onClick={(e) => {
                        e.stopPropagation()
                        onChange(loc)
                        setIsOpen(false)
                        setFilter('')
                      }}
                      className={cn(
                        'px-4 py-3 text-sm font-medium transition-colors flex items-center justify-between m-1 rounded-lg cursor-pointer',
                        isSelected
                          ? 'primary-gradient text-white shadow-sm'
                          : 'text-on-surface hover:bg-primary/10'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin
                          className={cn(
                            'h-3.5 w-3.5',
                            isSelected ? 'text-white/70' : 'text-primary'
                          )}
                        />
                        <span>{loc.locationName}</span>
                      </div>
                      {isSelected && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <Check className="h-4 w-4" />
                        </motion.div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Main Component ───────────────────────────────────────────── */

export function SearchTrip() {
  const router = useRouter()
  const { data: locations = [], isLoading: locationsLoading } = useAllLocations()

  const [origin, setOrigin] = useState<Location | null>(null)
  const [destination, setDestination] = useState<Location | null>(null)
  const [date, setDate] = useState('')

  // Date constraints
  const today = new Date().toISOString().split('T')[0]
  const threeMonthsFromNow = new Date()
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
  const maxDate = threeMonthsFromNow.toISOString().split('T')[0]

  const handleSwap = () => {
    const temp = origin
    setOrigin(destination)
    setDestination(temp)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!origin || !destination || !date) return

    const params = new URLSearchParams({
      originLocationId: origin.locationId,
      destinationLocationId: destination.locationId,
      date,
      originName: origin.locationName,
      destinationName: destination.locationName,
    })

    router.push(`/traveler/search/results?${params.toString()}`)
  }

  const canSearch = origin && destination && date && origin.locationId !== destination.locationId

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
            Select your boarding & destination and travel in premium comfort.
          </motion.p>
        </section>

        {/* Search Engine */}
        <section className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="rounded-xl border-none shadow-ambient bg-surface-container-lowest overflow-visible">
              <CardContent className="p-0">
                <form onSubmit={handleSearch}>
                  <div className="flex flex-col md:flex-row items-stretch">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-outline-variant/15">
                      {/* From */}
                      <LocationSelector
                        label="Boarding Point"
                        icon={MapPin}
                        locations={locations}
                        value={origin}
                        onChange={setOrigin}
                        placeholder="Select city"
                        excludeId={destination?.locationId}
                        isLoading={locationsLoading}
                      />

                      {/* To */}
                      <div className="relative">
                        {/* Swap button */}
                        <button
                          type="button"
                          onClick={handleSwap}
                          className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass flex items-center justify-center text-primary shadow-sm hover:scale-110 active:rotate-180 transition-all duration-300 hidden md:flex border border-outline-variant/10"
                        >
                          <ArrowRightLeft className="h-4 w-4" />
                        </button>
                        <LocationSelector
                          label="Drop-off Point"
                          icon={MapPin}
                          locations={locations}
                          value={destination}
                          onChange={setDestination}
                          placeholder="Select city"
                          excludeId={origin?.locationId}
                          isLoading={locationsLoading}
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
                        disabled={!canSearch}
                        className={cn(
                          'w-full md:w-auto h-16 md:h-full px-12 rounded-full primary-gradient text-white font-bold text-lg shadow-lg hover:shadow-primary/30 transition-all active:scale-95 disabled:opacity-50'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Search className="h-5 w-5" />
                          <span>Search Trips</span>
                        </div>
                      </Button>
                    </div>
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

        {/* Mobile Swap Button */}
        <div className="flex md:hidden justify-center -mt-8">
          <button
            type="button"
            onClick={handleSwap}
            className="w-10 h-10 rounded-full glass flex items-center justify-center text-primary shadow-sm hover:scale-110 active:rotate-180 transition-all duration-300 border border-outline-variant/10"
          >
            <ArrowRightLeft className="h-4 w-4 rotate-90" />
          </button>
        </div>

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
          <button
            onClick={() => router.push('/traveler/bookings')}
            className="text-primary font-bold flex items-center gap-1 mx-auto hover:gap-2 transition-all"
          >
            View my bookings <ChevronRight className="h-4 w-4" />
          </button>
        </section>
      </div>
    </div>
  )
}
