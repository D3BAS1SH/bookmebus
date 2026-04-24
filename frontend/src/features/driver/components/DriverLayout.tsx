'use client'

import React from 'react'
import { LayoutDashboard, Map, Calendar, Wallet } from 'lucide-react'
import { RoleBaseLayout } from '@/components/layouts/RoleBaseLayout'
import { NavItem } from '@/components/common/RoleNavbar'

const DRIVER_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/driver/dashboard', icon: LayoutDashboard },
  { label: 'Active Trip', href: '/driver/trips/active', icon: Map },
  { label: 'Earnings', href: '/driver/earnings', icon: Wallet },
]

export function DriverLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleBaseLayout role="Driver" navItems={DRIVER_NAV_ITEMS}>
      {children}
    </RoleBaseLayout>
  )
}
