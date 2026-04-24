'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LucideIcon, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Branding } from './Branding'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/features/auth/store/authStore'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

interface RoleNavbarProps {
  role: string
  navItems: NavItem[]
}

export function RoleNavbar({ role, navItems }: RoleNavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const isLoading = useAuthStore((s) => s.isLoading)

  const displayName = user?.fullName || role
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const toggleMenu = () => setIsOpen(!isOpen)

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  return (
    <nav className="sticky top-0 z-50 w-full glass">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Desktop Branding */}
          <div className="flex items-center gap-8">
            <Branding 
              href={`/${role.toLowerCase()}/dashboard`}
              className="transition-opacity hover:opacity-80"
            />

            {/* Desktop Nav Links */}
            <div className="hidden md:flex md:items-center md:gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors",
                      isActive ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", isActive ? "text-primary" : "text-on-surface-variant group-hover:text-on-surface")} />
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="active-nav"
                        className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary shadow-[0_0_12px_rgba(var(--primary-rgb),0.5)]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex md:items-center md:gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary uppercase shadow-sm">
                {initials}
              </div>
              {user && (
                <div className="hidden lg:block">
                  <p className="text-sm font-semibold text-on-surface leading-tight">{user.fullName}</p>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">{user.role}</p>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={isLoading}
              className="h-8 border-outline-variant/30 text-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              Log out
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center rounded-md p-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overflow */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 top-0 z-50 w-[280px] border-r border-outline-variant/10 bg-surface-bright p-6 shadow-2xl md:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <Branding href={`/${role.toLowerCase()}/dashboard`} />
                  <button onClick={toggleMenu} className="text-on-surface-variant hover:text-on-surface">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="flex-1 space-y-2">
                  <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">
                    Menu
                  </p>
                  {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={toggleMenu}
                        className={cn(
                          "flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-all active:scale-95",
                          isActive 
                            ? "bg-primary/10 text-primary border border-primary/20" 
                            : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                        )}
                      >
                        <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-on-surface-variant")} />
                        {item.label}
                      </Link>
                    )
                  })}
                </div>

                <div className="mt-auto border-t border-outline-variant/10 pt-6">
                  <div className="flex items-center gap-3 px-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary uppercase shadow-sm">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-on-surface">
                        {user?.fullName || role}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {user?.email || 'bookmebus user'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="w-full border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}
