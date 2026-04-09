'use client'

import React from 'react'
import { LayoutDashboard, Bus, Users, PieChart, Settings } from 'lucide-react'
import { RoleBaseLayout } from '@/components/layouts/RoleBaseLayout'
import { NavItem } from '@/components/common/RoleNavbar'

const OWNER_NAV_ITEMS: NavItem[] = [
  { label: 'Overview', href: '/owner/dashboard', icon: LayoutDashboard },
  { label: 'Fleet', href: '/owner/fleet', icon: Bus },
  { label: 'Staff', href: '/owner/staff', icon: Users },
  { label: 'Analytics', href: '/owner/analytics', icon: PieChart },
  { label: 'Settings', href: '/owner/settings', icon: Settings },
]

export function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleBaseLayout role="Owner" navItems={OWNER_NAV_ITEMS}>
      {children}
    </RoleBaseLayout>
  )
}
