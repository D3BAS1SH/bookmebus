'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Card } from '@/components/ui/Card'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock logic
    console.log('Login submitted (Mock)')
  }

  return (
    <Card className="p-8 md:p-10 shadow-ambient border-none bg-surface-container-lowest rounded-[2rem]">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-on-surface tracking-tight mb-2">
          Login to your account
        </h2>
        <p className="text-on-surface-variant font-medium">
          Enter your details to continue your expedition.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email Address"
          type="email"
          placeholder="explorer@voyage.com"
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
          className="w-full font-bold text-lg rounded-full py-7"
        >
          Login
        </Button>
      </form>

      <div className="mt-10 text-center">
        <p className="text-on-surface-variant font-medium">
          Don’t have an account?
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
