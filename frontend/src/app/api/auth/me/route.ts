import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { AuthUser } from '@/features/auth/types'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')
    const userCookie = cookieStore.get('user')

    if (!token?.value || !userCookie?.value) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      )
    }

    const user: AuthUser = JSON.parse(userCookie.value)

    return NextResponse.json({
      success: true,
      user,
    })
  } catch {
    return NextResponse.json(
      { success: false, message: 'Session invalid' },
      { status: 401 }
    )
  }
}
