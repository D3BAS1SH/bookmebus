'use client'

import React from 'react'
import { Search, Ticket, Map, User } from 'lucide-react'
import { RoleBaseLayout } from '@/components/layouts/RoleBaseLayout'
import { NavItem } from '@/components/common/RoleNavbar'

const TRAVELER_NAV_ITEMS: NavItem[] = [
  { label: 'Explore', href: '/traveler/home', icon: Search },
  { label: 'My Bookings', href: '/traveler/bookings', icon: Ticket },
  { label: 'Track Bus', href: '/traveler/tracking', icon: Map },
  { label: 'Profile', href: '/traveler/profile', icon: User },
]

export function TravelerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleBaseLayout role="Traveler" navItems={TRAVELER_NAV_ITEMS}>
      {children}
    </RoleBaseLayout>
  )
}
