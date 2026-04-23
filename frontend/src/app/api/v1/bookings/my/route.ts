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
 * GET /api/v1/bookings/my — Get current user's bookings
 */
export async function GET(request: NextRequest) {
  try {
    const headers = await getAuthHeaders()
    const { searchParams } = new URL(request.url)

    const page = searchParams.get('page')
    const size = searchParams.get('size')
    const sort = searchParams.get('sort')

    let url = `${BACKEND_URL}/api/v1/bookings/my`

    const queryParams: string[] = []
    if (page) queryParams.push(`page=${page}`)
    if (size) queryParams.push(`size=${size}`)
    if (sort) queryParams.push(`sort=${sort}`)

    url += queryParams.join('&')

    const backendRes = await fetch(url, { method: 'GET', headers })
    const data = await backendRes.json()

    if (!backendRes.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to fetch bookings' },
        { status: backendRes.status }
      )
    }

    return NextResponse.json({
      success: true,
      data: data.data,
      message: data.message || 'Bookings fetched successfully',
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { success: false, message: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}
