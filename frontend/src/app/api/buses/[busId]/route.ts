import { cookies } from 'next/headers'
import { NextResponse, NextRequest } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL

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
 * GET /api/buses/[busId] — Get details for a specific bus
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ busId: string }> }
) {
  try {
    const headers = await getAuthHeaders()
    const { busId } = await params

    const backendRes = await fetch(`${BACKEND_URL}/api/v1/buses/${busId}`, {
      method: 'GET',
      headers,
    })

    const data = await backendRes.json()

    if (!backendRes.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Bus not found' },
        { status: backendRes.status }
      )
    }

    return NextResponse.json({
      success: true,
      data: data.data,
      message: data.message || 'Bus fetched successfully',
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { success: false, message: 'Failed to fetch bus details' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/buses/[busId] — Update a bus
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ busId: string }> }
) {
  try {
    const headers = await getAuthHeaders()
    const { busId } = await params
    const body = await request.json()

    const backendRes = await fetch(`${BACKEND_URL}/api/v1/buses/${busId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    })

    const data = await backendRes.json()

    if (!backendRes.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to update bus' },
        { status: backendRes.status }
      )
    }

    return NextResponse.json({
      success: true,
      data: data.data,
      message: data.message || 'Bus updated successfully',
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { success: false, message: 'Failed to update bus' },
      { status: 500 }
    )
  }
}
