'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')

  const calculateStrength = (pass: string) => {
    if (!pass) return 0
    let score = 0
    if (pass.length >= 6) score += 1
    if (pass.length >= 8) score += 1
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1
    return score
  }

  const strength = calculateStrength(password)
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong']
  const strengthColors = [
    'bg-error',
    'bg-secondary-container',
    'bg-primary-container',
    'bg-tertiary-container',
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock logic
    console.log('Signup submitted (Mock)')
  }

  return (
    <Card className="p-6 md:p-10 shadow-ambient border-none bg-surface-container-lowest rounded-[2rem]">
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          {/* Strength Indicator (Dynamic) */}
          <div className="flex gap-1.5 px-1 pt-1">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-all duration-500',
                  strength >= step 
                    ? strengthColors[strength - 1] 
                    : 'bg-surface-container-highest'
                )}
              />
            ))}
          </div>
          <p 
            className={cn(
              "text-[10px] font-bold px-1 uppercase tracking-widest transition-colors duration-500",
              strength > 0 ? "text-on-surface" : "text-on-surface-variant opacity-40"
            )}
          >
            {password ? `${strengthLabels[strength - 1] || 'Weak'} password` : 'Enter a password'}
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
    </Card>
  )
}
