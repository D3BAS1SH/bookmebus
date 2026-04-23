import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

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
 * GET /api/routes/public — Fetch all routes for traveler discovery
 *
 * Strategy: The backend only has /api/v1/route/owner (owner-restricted).
 * Since no public route listing exists, we try the owner endpoint first.
 * If it fails (403), we return an empty array with a descriptive message.
 *
 * TODO: When a public route listing endpoint is added to the backend
 * (e.g., GET /api/v1/route/all), update this proxy to use it.
 */
export async function GET() {
  try {
    const headers = await getAuthHeaders()

    // Try the owner route listing — it may work for all authenticated users
    // depending on backend security config
    const backendRes = await fetch(`${BACKEND_URL}/api/v1/route/owner`, {
      method: 'GET',
      headers,
    })

    if (backendRes.ok) {
      const data = await backendRes.json()
      return NextResponse.json({
        success: true,
        data: data.data || [],
        message: data.message || 'Routes fetched successfully',
      })
    }

    // If 403 (Forbidden) — the user doesn't have owner access
    // Return empty array gracefully instead of failing
    if (backendRes.status === 403) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'No routes available. The backend may need a public route listing endpoint.',
      })
    }

    const errorData = await backendRes.json().catch(() => ({}))
    return NextResponse.json(
      { success: false, message: (errorData as Record<string, string>).message || 'Failed to fetch routes' },
      { status: backendRes.status }
    )
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { success: false, message: 'Failed to fetch routes' },
      { status: 500 }
    )
  }
}
