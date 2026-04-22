'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Card } from '@/components/ui/Card'
import { useAuthStore } from '@/features/auth/store/authStore'
import { loginSchema } from '@/features/auth/types'
import type { UserRole } from '@/features/auth/types'

/** Role-based redirect after login */
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

export function LoginForm() {
  const router = useRouter()
  const login = useAuthStore((s) => s.login)
  const isLoading = useAuthStore((s) => s.isLoading)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Client-side validation
    const result = loginSchema.safeParse({ email, password })
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
      const user = await login(email, password)
      toast.success(`Welcome back, ${user.fullName}!`)
      router.push(getDashboardPath(user.role))
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Login failed. Please try again.'
      toast.error(message)
    }
  }

  return (
    <Card className="p-6 md:p-10 shadow-ambient border-none bg-surface-container-lowest rounded-[2rem]">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-on-surface tracking-tight mb-2">
          Login to your account
        </h2>
        <p className="text-on-surface-variant font-medium">
          Enter your details to continue your expedition.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Input
            label="Email Address"
            type="email"
            placeholder="explorer@voyage.com"
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

        <div className="space-y-2">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            icon={<span className="material-symbols-outlined">lock</span>}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          <div className="flex justify-end px-1">
            <Link
              href="#"
              className="text-sm font-semibold text-primary hover:text-primary-container transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-3 px-1">
          <Checkbox id="remember" name="remember" />
          <label
            htmlFor="remember"
            className="text-sm font-medium text-on-surface-variant cursor-pointer select-none"
          >
            Remember my preferences
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
              Logging in…
            </span>
          ) : (
            'Login'
          )}
        </Button>
      </form>

      <div className="mt-10 text-center">
        <p className="text-on-surface-variant font-medium">
          Don&apos;t have an account?
          <Link
            href="/signup"
            className="text-primary font-bold hover:underline ml-1"
          >
            Sign up
          </Link>
        </p>
      </div>
    </Card>
  )
}
