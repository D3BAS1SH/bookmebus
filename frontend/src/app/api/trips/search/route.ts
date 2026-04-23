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
 * GET /api/trips/search — Search trips by route + date (paginated)
 * Proxies: GET /api/v1/trips/search?routeId=&date=&page=&size=&sort=
 */
export async function GET(request: NextRequest) {
  try {
    const headers = await getAuthHeaders()
    const { searchParams } = new URL(request.url)

    const routeId = searchParams.get('routeId')
    const date = searchParams.get('date')
    const page = searchParams.get('page') || '0'
    const size = searchParams.get('size') || '10'
    const sort = searchParams.get('sort') || 'departureTime,asc'

    if (!routeId || !date) {
      return NextResponse.json(
        { success: false, message: 'routeId and date are required' },
        { status: 400 }
      )
    }

    const url = `${BACKEND_URL}/api/v1/trips/search?routeId=${routeId}&date=${date}&page=${page}&size=${size}&sort=${sort}`
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
