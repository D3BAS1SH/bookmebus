import { cookies } from 'next/headers'
import { NextResponse, NextRequest } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL

/**
 * Helper: reads the JWT token from httpOnly cookie and returns headers
 * for the Spring Boot backend request.
 */
async function getAuthHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) {
    throw new Error('UNAUTHORIZED')
  }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

/**
 * GET /api/buses — List all buses for the authenticated owner
 */
export async function GET() {
  try {
    const headers = await getAuthHeaders()

    const backendRes = await fetch(`${BACKEND_URL}/api/v1/buses`, {
      method: 'GET',
      headers,
    })

    const data = await backendRes.json()

    if (!backendRes.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to fetch buses' },
        { status: backendRes.status }
      )
    }

    return NextResponse.json({
      success: true,
      data: data.data,
      message: data.message || 'Buses fetched successfully',
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { success: false, message: 'Failed to fetch buses' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/buses — Register a new bus
 */
export async function POST(request: NextRequest) {
  try {
    const headers = await getAuthHeaders()
    const body = await request.json()

    const backendRes = await fetch(`${BACKEND_URL}/api/v1/buses`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })

    const data = await backendRes.json()

    if (!backendRes.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to create bus' },
        { status: backendRes.status }
      )
    }

    return NextResponse.json({
      success: true,
      data: data.data,
      message: data.message || 'Bus created successfully',
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { success: false, message: 'Failed to create bus' },
      { status: 500 }
    )
  }
}
