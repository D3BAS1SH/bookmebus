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
 * GET /api/trips/[tripId]/seats — Get seat availability for a trip
 * Proxies: GET /api/v1/trips/{tripId}/seats?boardingStopId=&dropoffStopId=
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const headers = await getAuthHeaders()
    const { tripId } = await params
    const { searchParams } = new URL(request.url)

    const boardingLocationId = searchParams.get('boardingLocationId') || ''
    const dropoffLocationpId = searchParams.get('dropoffLocationpId') || ''

    let url = `${BACKEND_URL}/api/v1/trips/${tripId}/seats`
    const qp = new URLSearchParams()
    if (boardingLocationId) qp.set('boardingLocationId', boardingLocationId)
    if (dropoffLocationpId) qp.set('dropoffLocationpId', dropoffLocationpId)
    const qs = qp.toString()
    if (qs) url += `?${qs}`

    const backendRes = await fetch(url, { method: 'GET', headers })
    const data = await backendRes.json()

    if (!backendRes.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to fetch seats' },
        { status: backendRes.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { success: false, message: 'Failed to fetch seats' },
      { status: 500 }
    )
  }
}
