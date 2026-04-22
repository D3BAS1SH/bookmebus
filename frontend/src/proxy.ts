import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Route groups and their required roles
const ROLE_ROUTES: Record<string, string> = {
  '/owner': 'OWNER',
  '/driver': 'DRIVER',
  '/traveler': 'TRAVELER',
}

// Where each role's dashboard lives
const ROLE_DASHBOARDS: Record<string, string> = {
  OWNER: '/owner/dashboard',
  DRIVER: '/driver/dashboard',
  TRAVELER: '/traveler/home',
}

// Auth pages — redirect away if already logged in
const AUTH_PAGES = ['/login', '/signup']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Read the user cookie (contains role info)
  const userCookie = request.cookies.get('user')?.value
  const tokenCookie = request.cookies.get('token')?.value
  const isAuthenticated = !!tokenCookie && !!userCookie

  let userRole: string | null = null
  if (userCookie) {
    try {
      const parsed = JSON.parse(userCookie)
      userRole = parsed.role || null
    } catch {
      userRole = null
    }
  }

  // ─── Auth Pages: Redirect authenticated users to their dashboard ──
  if (AUTH_PAGES.some((page) => pathname.startsWith(page))) {
    if (isAuthenticated && userRole) {
      const dashboard = ROLE_DASHBOARDS[userRole] || '/login'
      return NextResponse.redirect(new URL(dashboard, request.url))
    }
    return NextResponse.next()
  }

  // ─── Protected Route Groups: Enforce authentication & role ─────────
  for (const [routePrefix, requiredRole] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(routePrefix)) {
      // Not authenticated → redirect to login
      if (!isAuthenticated) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
      }

      // Wrong role → redirect to correct dashboard
      if (userRole !== requiredRole) {
        const correctDashboard =
          ROLE_DASHBOARDS[userRole!] || '/login'
        return NextResponse.redirect(new URL(correctDashboard, request.url))
      }

      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
