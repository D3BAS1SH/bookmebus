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
 * GET /api/trips — List owner trips (paginated)
 * Query: ?page=0&size=10&sort=departureTime,desc
 */
export async function GET(request: NextRequest) {
  try {
    const headers = await getAuthHeaders()
    const { searchParams } = new URL(request.url)

    const page = searchParams.get('page') || '0'
    const size = searchParams.get('size') || '10'
    const sort = searchParams.get('sort') || 'departureTime,desc'

    const url = `${BACKEND_URL}/api/v1/trips/owner?page=${page}&size=${size}&sort=${sort}`
    const backendRes = await fetch(url, { method: 'GET', headers })
    const data = await backendRes.json()

    if (!backendRes.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to fetch trips' },
        { status: backendRes.status }
      )
    }

    return NextResponse.json({
      success: true,
      data: data.data,
      message: data.message || 'Trips fetched successfully',
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { success: false, message: 'Failed to fetch trips' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/trips — Create a new trip
 * Body: { busId, routeId, driverId, departureTime, expectedDurationMin }
 */
export async function POST(request: NextRequest) {
  try {
    const headers = await getAuthHeaders()
    const body = await request.json()

    const backendRes = await fetch(`${BACKEND_URL}/api/v1/trips`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })

    const data = await backendRes.json()

    if (!backendRes.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to create trip' },
        { status: backendRes.status }
      )
    }

    return NextResponse.json({
      success: true,
      data: data.data,
      message: data.message || 'Trip created successfully',
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { success: false, message: 'Failed to create trip' },
      { status: 500 }
    )
  }
}
