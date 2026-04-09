'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Card } from '@/components/ui/Card'

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock logic
    console.log('Signup submitted (Mock)')
  }

  return (
    <Card className="p-8 md:p-12 shadow-ambient border-none bg-surface-container-lowest rounded-[2rem]">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-on-surface tracking-tight mb-2">
          Create your account
        </h2>
        <p className="text-on-surface-variant font-medium">
          Join the elite world of weightless travel.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          icon={<span className="material-symbols-outlined">person</span>}
          required
        />

        <Input
          label="Email"
          type="email"
          placeholder="voyager@ethereal.com"
          icon={<span className="material-symbols-outlined">mail</span>}
          required
        />

        <div className="space-y-2">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            icon={<span className="material-symbols-outlined">lock</span>}
            required
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="flex items-center"
              >
                <span className="material-symbols-outlined text-lg">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            }
          />
          {/* Strength Indicator (Mock) */}
          <div className="flex gap-1.5 px-1 pt-1">
            <div className="h-1.5 flex-1 rounded-full bg-tertiary-container"></div>
            <div className="h-1.5 flex-1 rounded-full bg-tertiary-container"></div>
            <div className="h-1.5 flex-1 rounded-full bg-surface-container-highest"></div>
            <div className="h-1.5 flex-1 rounded-full bg-surface-container-highest"></div>
          </div>
          <p className="text-[10px] text-tertiary font-bold px-1 uppercase tracking-widest">
            Strong password achieved
          </p>
        </div>

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          icon={<span className="material-symbols-outlined">lock_reset</span>}
          required
        />

        <div className="flex items-start gap-3 px-1">
          <Checkbox id="terms" required className="mt-1" />
          <label htmlFor="terms" className="text-sm text-on-surface-variant leading-relaxed select-none">
            I agree to the{' '}
            <Link href="#" className="text-primary font-bold hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" className="text-primary font-bold hover:underline">
              Privacy Policy
            </Link>.
          </label>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full font-bold text-lg rounded-full py-7"
        >
          Sign Up
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-on-surface-variant font-medium">
          Already have an account?
          <Link
            href="/login"
            className="text-primary font-bold hover:text-primary-container transition-colors ml-1"
          >
            Log In
          </Link>
        </p>
      </div>

      <div className="mt-12 pt-8 border-t border-outline-variant/10 flex justify-center gap-8">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-tertiary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Carbon Neutral</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Secure Entry</span>
        </div>
      </div>
    </Card>
  )
}
