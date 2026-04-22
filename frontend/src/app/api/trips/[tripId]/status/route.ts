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
 * PATCH /api/trips/[tripId]/status — Update trip status
 * Body: { action: 'start' | 'complete' | 'cancel' }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const headers = await getAuthHeaders()
    const { tripId } = await params
    const { action } = (await request.json()) as { action: string }

    const actionMap: Record<string, string> = {
      start: 'start',
      complete: 'complete',
      cancel: 'cancel',
    }

    const endpoint = actionMap[action]
    if (!endpoint) {
      return NextResponse.json(
        { success: false, message: `Invalid action: ${action}` },
        { status: 400 }
      )
    }

    const backendRes = await fetch(
      `${BACKEND_URL}/api/v1/trips/${tripId}/${endpoint}`,
      { method: 'PATCH', headers }
    )

    const data = await backendRes.json().catch(() => ({}))

    if (!backendRes.ok) {
      return NextResponse.json(
        { success: false, message: (data as Record<string, string>).message || `Failed to ${action} trip` },
        { status: backendRes.status }
      )
    }

    return NextResponse.json({
      success: true,
      data: (data as Record<string, unknown>).data ?? null,
      message: (data as Record<string, string>).message || `Trip ${action}ed successfully`,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { success: false, message: 'Failed to update trip status' },
      { status: 500 }
    )
  }
}
