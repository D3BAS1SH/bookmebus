'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/features/auth/store/authStore'
import { registerSchema } from '@/features/auth/types'
import type { UserRole } from '@/features/auth/types'

// ─── Role Options ─────────────────────────────────────────────────
const roleOptions: {
  value: UserRole
  icon: string
  label: string
  description: string
}[] = [
  {
    value: 'TRAVELER',
    icon: 'luggage',
    label: 'Traveler',
    description: 'Book seats & travel',
  },
  {
    value: 'DRIVER',
    icon: 'directions_bus',
    label: 'Driver',
    description: 'Drive & track trips',
  },
  {
    value: 'OWNER',
    icon: 'domain',
    label: 'Owner',
    description: 'Manage fleet & routes',
  },
]

/** Role-based redirect after registration */
function getDashboardPath(role: UserRole): string {
  switch (role) {
    case 'OWNER':
      return '/owner/dashboard'
    case 'DRIVER':
      return '/driver/dashboard'
    case 'TRAVELER':
      return '/traveler/home'
  }
}

export function SignupForm() {
  const router = useRouter()
  const register = useAuthStore((s) => s.register)
  const isLoading = useAuthStore((s) => s.isLoading)

  const [selectedRole, setSelectedRole] = useState<UserRole>('TRAVELER')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // ─── Password Strength ────────────────────────────────
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Client-side validation
    const result = registerSchema.safeParse({
      fullName,
      email,
      phone,
      password,
      confirmPassword,
      role: selectedRole,
    })

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const field = issue.path?.[0]
        if (field) fieldErrors[String(field)] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    try {
      const user = await register({
        fullName,
        email,
        phone,
        password,
        role: selectedRole,
      })
      toast.success(`Welcome aboard, ${user.fullName}!`)
      router.push(getDashboardPath(user.role))
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Registration failed. Please try again.'
      toast.error(message)
    }
  }

  return (
    <Card className="p-6 md:p-10 shadow-ambient border-none bg-surface-container-lowest rounded-[2rem]">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-on-surface tracking-tight mb-2">
          Create your account
        </h2>
        <p className="text-on-surface-variant font-medium">
          Join the elite world of weightless travel.
        </p>
      </div>

      {/* ─── Role Selector ────────────────────────── */}
      <div className="mb-8">
        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-3 px-1">
          I am a…
        </p>
        <div className="grid grid-cols-3 gap-3">
          {roleOptions.map((role) => {
            const isSelected = selectedRole === role.value
            return (
              <motion.button
                key={role.value}
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedRole(role.value)}
                className={cn(
                  'relative flex flex-col items-center gap-1.5 rounded-2xl py-4 px-2 text-center transition-all duration-300 border-2 cursor-pointer',
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                    : 'border-outline-variant/20 bg-surface hover:border-outline-variant/40 hover:bg-surface-container-low'
                )}
              >
                <span
                  className={cn(
                    'material-symbols-outlined text-2xl transition-colors',
                    isSelected
                      ? 'text-primary'
                      : 'text-on-surface-variant'
                  )}
                >
                  {role.icon}
                </span>
                <span
                  className={cn(
                    'text-sm font-bold transition-colors',
                    isSelected ? 'text-primary' : 'text-on-surface'
                  )}
                >
                  {role.label}
                </span>
                <span className="text-[10px] text-on-surface-variant leading-tight">
                  {role.description}
                </span>
                {isSelected && (
                  <motion.div
                    layoutId="role-indicator"
                    className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <span className="material-symbols-outlined text-white text-xs font-bold">
                      check
                    </span>
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </div>
        {errors.role && (
          <p className="text-error text-xs font-semibold mt-1 px-1">
            {errors.role}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            icon={<span className="material-symbols-outlined">person</span>}
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          {errors.fullName && (
            <p className="text-error text-xs font-semibold mt-1 px-6">
              {errors.fullName}
            </p>
          )}
        </div>

        <div>
          <Input
            label="Email"
            type="email"
            placeholder="voyager@ethereal.com"
            icon={<span className="material-symbols-outlined">mail</span>}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className="text-error text-xs font-semibold mt-1 px-6">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <Input
            label="Phone"
            type="tel"
            placeholder="+855 12 345 678"
            icon={<span className="material-symbols-outlined">call</span>}
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {errors.phone && (
            <p className="text-error text-xs font-semibold mt-1 px-6">
              {errors.phone}
            </p>
          )}
        </div>

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
          {errors.password && (
            <p className="text-error text-xs font-semibold mt-1 px-6">
              {errors.password}
            </p>
          )}
          {/* Strength Indicator */}
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
              'text-[10px] font-bold px-1 uppercase tracking-widest transition-colors duration-500',
              strength > 0
                ? 'text-on-surface'
                : 'text-on-surface-variant opacity-40'
            )}
          >
            {password
              ? `${strengthLabels[strength - 1] || 'Weak'} password`
              : 'Enter a password'}
          </p>
        </div>

        <div>
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            icon={
              <span className="material-symbols-outlined">lock_reset</span>
            }
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && (
            <p className="text-error text-xs font-semibold mt-1 px-6">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div className="flex items-start gap-3 px-1">
          <Checkbox id="terms" required className="mt-1" />
          <label
            htmlFor="terms"
            className="text-sm text-on-surface-variant leading-relaxed select-none"
          >
            I agree to the{' '}
            <Link href="#" className="text-primary font-bold hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" className="text-primary font-bold hover:underline">
              Privacy Policy
            </Link>
            .
          </label>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isLoading}
          className="w-full font-bold text-lg rounded-full py-7"
        >
          {isLoading ? (
            <span className="flex items-center gap-3">
              <span className="material-symbols-outlined animate-spin text-xl">
                progress_activity
              </span>
              Creating account…
            </span>
          ) : (
            'Sign Up'
          )}
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
