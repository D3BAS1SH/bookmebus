import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL

/**
 * GET /api/tickets/[bookingId]/download — Download ticket PDF (binary passthrough)
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    const { bookingId } = await params

    const backendRes = await fetch(`${BACKEND_URL}/api/v1/ticket/${bookingId}/download`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!backendRes.ok) {
      return NextResponse.json(
        { success: false, message: 'Failed to download ticket' },
        { status: backendRes.status }
      )
    }

    // Stream the binary PDF response directly
    const blob = await backendRes.blob()
    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ticket-${bookingId}.pdf"`,
      },
    })
  } catch {
    return NextResponse.json(
      { success: false, message: 'Failed to download ticket' },
      { status: 500 }
    )
  }
}
