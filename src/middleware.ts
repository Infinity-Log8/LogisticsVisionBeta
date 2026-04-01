import { NextRequest, NextResponse } from 'next/server';

// Routes accessible without auth
const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/join',
  '/api/auth/session',
  '/api/tenant/invite',
  '/api/register',
  '/_next',
  '/favicon.ico',
  '/globals.css',
];

// Routes that require auth but not a tenant
const AUTH_ONLY_PATHS = ['/setup-workspace'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Check for session cookie
  const session = req.cookies.get('session')?.value;

  if (!session) {
    // Redirect to login
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allow auth-only paths (no tenant required)
  if (AUTH_ONLY_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Session exists — let the page/layout handle deeper auth checks
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
