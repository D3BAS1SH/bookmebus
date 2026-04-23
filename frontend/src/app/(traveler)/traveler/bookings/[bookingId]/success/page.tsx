import { BookingSuccess } from '@/features/traveler/components/BookingSuccess'

interface SuccessPageProps {
  params: Promise<{ bookingId: string }>
}

export default async function SuccessPage({ params }: SuccessPageProps) {
  const { bookingId } = await params
  
  return <BookingSuccess bookingId={bookingId} />
}
