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
 * GET /api/trips/[tripId] — Get trip detail
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const headers = await getAuthHeaders()
    const { tripId } = await params

    const backendRes = await fetch(`${BACKEND_URL}/api/v1/trips/${tripId}`, {
      method: 'GET',
      headers,
    })
    const data = await backendRes.json()

    if (!backendRes.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to fetch trip' },
        { status: backendRes.status }
      )
    }

    return NextResponse.json({
      success: true,
      data: data.data,
      message: data.message,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { success: false, message: 'Failed to fetch trip' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/trips/[tripId] — Update trip
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const headers = await getAuthHeaders()
    const { tripId } = await params
    const body = await request.json()

    const backendRes = await fetch(`${BACKEND_URL}/api/v1/trips/${tripId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    })
    const data = await backendRes.json()

    if (!backendRes.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to update trip' },
        { status: backendRes.status }
      )
    }

    return NextResponse.json({
      success: true,
      data: data.data,
      message: data.message,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { success: false, message: 'Failed to update trip' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/trips/[tripId] — Delete trip
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const headers = await getAuthHeaders()
    const { tripId } = await params

    const backendRes = await fetch(`${BACKEND_URL}/api/v1/trips/${tripId}`, {
      method: 'DELETE',
      headers,
    })

    if (!backendRes.ok) {
      const data = await backendRes.json().catch(() => ({}))
      return NextResponse.json(
        { success: false, message: (data as Record<string, string>).message || 'Failed to delete trip' },
        { status: backendRes.status }
      )
    }

    return NextResponse.json({ success: true, message: 'Trip deleted' })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { success: false, message: 'Failed to delete trip' },
      { status: 500 }
    )
  }
}
