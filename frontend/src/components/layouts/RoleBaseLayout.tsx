'use client'

import React from 'react'
import { RoleNavbar, NavItem } from '@/components/common/RoleNavbar'

interface RoleBaseLayoutProps {
  children: React.ReactNode
  role: string
  navItems: NavItem[]
}

export function RoleBaseLayout({ children, role, navItems }: RoleBaseLayoutProps) {
  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-primary/30">
      <RoleNavbar role={role} navItems={navItems} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
