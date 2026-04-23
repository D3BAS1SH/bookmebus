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
 * POST /api/v1/trips/[tripId]/location
 * Proxies location emission to the backend
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const { tripId } = await params
    const headers = await getAuthHeaders()
    const body = await request.json()

    const backendRes = await fetch(`${BACKEND_URL}/api/v1/trips/${tripId}/location`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })

    if (!backendRes.ok) {
      const errorData = await backendRes.json()
      return NextResponse.json(
        { success: false, message: errorData.message || 'Failed to update location' },
        { status: backendRes.status }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 })
    }
    return NextResponse.json({ success: false, message: 'Failed to update location' }, { status: 500 })
  }
}
