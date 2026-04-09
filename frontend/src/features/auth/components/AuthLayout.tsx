'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Branding } from '@/components/common/Branding'

interface AuthLayoutProps {
  children: React.ReactNode
  imageSrc: string
  imageAlt: string
  title: string
  subtitle: string
}

export function AuthLayout({
  children,
  imageSrc,
  imageAlt,
  title,
  subtitle,
}: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen bg-surface overflow-x-hidden">
      {/* Left Side: Visual Anchor - Hidden on mobile */}
      <section className="relative hidden md:flex md:w-1/2 h-screen overflow-hidden shrink-0">
        <div className="absolute inset-0 z-0">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-on-background/40 backdrop-brightness-75"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center px-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Branding className="text-white drop-shadow-md" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white font-display text-4xl lg:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-2xl"
          >
            {title}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-white font-medium text-lg lg:text-xl max-w-md tracking-wide drop-shadow-lg"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Artistic Label at Bottom */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute bottom-12 left-0 right-0 flex justify-center"
        >
          <span className="text-white font-display text-sm md:text-xl lg:text-2xl font-black tracking-[0.6em] uppercase whitespace-nowrap opacity-50 select-none">
            Ethereal Voyager Experience
          </span>
        </motion.div>
      </section>

      {/* Right Side: Interaction Canvas - Scrollable container */}
      <section className="w-full md:w-1/2 h-full md:h-screen md:overflow-y-auto flex flex-col">
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full max-w-md space-y-10"
          >
            {/* Mobile Branding (Visible only when left side is hidden) */}
            <div className="md:hidden flex justify-center mb-8">
              <Branding className="text-primary" />
            </div>

            {children}
            
            {/* Footer inside interaction area */}
            <div className="flex justify-center gap-6 text-[10px] font-bold text-outline-variant uppercase tracking-widest pt-8 border-t border-outline-variant/10">
              <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
              <Link href="#" className="hover:text-primary transition-colors">Help Center</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
