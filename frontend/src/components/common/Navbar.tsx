'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Destinations', href: '#' },
    { name: 'Experiences', href: '#' },
    { name: 'Sustainability', href: '#' },
    { name: 'Concierge', href: '#' },
  ]

  return (
    <nav 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm h-16" : "bg-transparent h-20"
      )}
    >
      <div className="max-w-screen-2xl mx-auto h-full px-8 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-tighter text-on-surface font-display">
          Ethereal Voyager
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 font-display text-sm tracking-tight">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-on-surface-variant hover:text-primary transition-colors font-medium"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button size="sm" className="ambient-shadow hover:scale-95 transition-transform">
            Book Now
          </Button>
          
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-on-surface"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-slate-900 border-b border-outline-variant/10 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-base font-medium text-on-surface py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-outline-variant/10">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button className="w-full">Book Now</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
