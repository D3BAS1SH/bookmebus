import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        password: body.password,
        role: body.role,
      }),
    })

    const data = await backendRes.json()

    if (!backendRes.ok || !data.success) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || 'Registration failed',
          error: data.error,
        },
        { status: backendRes.status }
      )
    }

    const user = data.data
    const token = user.token

    // Store JWT in httpOnly cookie
    const cookieStore = await cookies()
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    // Store user info for session reconstruction
    const userPayload = {
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      active: user.active,
    }

    cookieStore.set('user', JSON.stringify(userPayload), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return NextResponse.json({
      success: true,
      message: data.message,
      user: userPayload,
    })
  } catch {
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
