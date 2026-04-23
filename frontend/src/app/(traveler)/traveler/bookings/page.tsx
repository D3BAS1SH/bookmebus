import React from 'react'
import { MyBookings } from '@/features/traveler'

export const metadata = {
  title: 'My Bookings | BookMeBus',
  description: 'View and manage your bus trip bookings.',
}

export default function BookingsPage() {
  return <MyBookings />
}
