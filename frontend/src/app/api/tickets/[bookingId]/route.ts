import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL

async function getAuthHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) throw new Error('UNAUTHORIZED')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

/**
 * POST /api/tickets/[bookingId] — Generate ticket for a booking
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const headers = await getAuthHeaders()
    const { bookingId } = await params

    const backendRes = await fetch(`${BACKEND_URL}/api/v1/ticket/${bookingId}`, {
      method: 'POST',
      headers,
    })

    const data = await backendRes.json()

    if (!backendRes.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to generate ticket' },
        { status: backendRes.status }
      )
    }

    return NextResponse.json({
      success: true,
      data: data.data,
      message: data.message || 'Ticket generated successfully',
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { success: false, message: 'Failed to generate ticket' },
      { status: 500 }
    )
  }
}
