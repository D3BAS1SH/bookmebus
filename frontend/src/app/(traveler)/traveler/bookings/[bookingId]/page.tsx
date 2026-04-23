import React from 'react'
import { BookingDetail } from '@/features/traveler'

export const metadata = {
  title: 'Booking Details | BookMeBus',
  description: 'View your booking details, generate tickets, and manage your reservation.',
}

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const { bookingId } = await params
  return <BookingDetail bookingId={bookingId} />
}
