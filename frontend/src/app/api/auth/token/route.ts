import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

/**
 * GET /api/auth/token
 * Returns the JWT token from the httpOnly cookie for use in WebSockets/STOMP.
 */
export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No token found' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      token,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve token' },
      { status: 500 }
    )
  }
}
