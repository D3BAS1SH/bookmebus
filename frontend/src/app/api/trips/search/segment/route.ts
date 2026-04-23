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
 * GET /api/trips/search/segment — Search trips by origin + destination location + date
 * Proxies: GET /api/v1/trips/search/segment?originLocationId=&destinationLocationId=&date=&page=&size=&sort=
 */
export async function GET(request: NextRequest) {
  try {
    const headers = await getAuthHeaders()
    const { searchParams } = new URL(request.url)

    const originLocationId = searchParams.get('originLocationId')
    const destinationLocationId = searchParams.get('destinationLocationId')
    const date = searchParams.get('date')
    const page = searchParams.get('page') || '0'
    const size = searchParams.get('size') || '10'
    const sort = searchParams.get('sort') || 'departureTime,asc'

    if (!originLocationId || !destinationLocationId || !date) {
      return NextResponse.json(
        { success: false, message: 'originLocationId, destinationLocationId, and date are required' },
        { status: 400 }
      )
    }

    const url = `${BACKEND_URL}/api/v1/trips/search/segment?originLocationId=${originLocationId}&destinationLocationId=${destinationLocationId}&date=${date}&page=${page}&size=${size}&sort=${sort}`
    const backendRes = await fetch(url, { method: 'GET', headers })
    const data = await backendRes.json()

    if (!backendRes.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to search trips' },
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
      { success: false, message: 'Failed to search trips' },
      { status: 500 }
    )
  }
}
