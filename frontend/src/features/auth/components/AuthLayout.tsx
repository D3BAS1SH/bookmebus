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
    <main className="flex min-h-screen flex-col md:flex-row bg-surface">
      {/* Left Side: Visual Anchor */}
      <section className="relative w-full md:w-1/2 h-64 md:h-screen overflow-hidden">
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
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Branding className="text-white brightness-200" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white font-display text-4xl md:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-xl"
          >
            {title}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-white/90 text-lg md:text-xl max-w-md font-medium tracking-wide"
          >
            {subtitle}
          </motion.p>
        </div>
      </section>

      {/* Right Side: Interaction Canvas */}
      <section className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-24 bg-surface">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-md space-y-8"
        >
          {children}
          
          {/* Footer inside layout */}
          <div className="flex justify-center gap-6 text-sm text-outline font-medium pt-8 border-t border-outline-variant/10">
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="#" className="hover:text-primary transition-colors">Help Center</Link>
          </div>
        </motion.div>
      </section>
    </main>
  )
}
