import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    const userCookie = cookieStore.get('user')?.value

    if (!token || !userCookie) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    const user = JSON.parse(userCookie)
    const driverId = user.userId

    if (!driverId) {
      return NextResponse.json(
        { success: false, message: 'Driver ID not found in session' },
        { status: 400 }
      )
    }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }

    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '0'
    const size = searchParams.get('size') || '20'

    const url = `${BACKEND_URL}/api/v1/trips/driver`
    const backendRes = await fetch(url, { method: 'GET', headers })
    const data = await backendRes.json()

    if (!backendRes.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to fetch driver trips' },
        { status: backendRes.status }
      )
    }

    return NextResponse.json({
      success: true,
      data: data.data,
      message: data.message || 'Trips fetched successfully',
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch driver trips' },
      { status: 500 }
    )
  }
}
