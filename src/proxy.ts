// ─── NEXT.JS 16 PROXY ───────────────────────────────────────────
// Route protection for dashboard routes.
// In Next.js 16, middleware.ts is DEPRECATED → proxy.ts is the replacement.
// The exported function must be named `proxy`, not `middleware`.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('medfind_token')?.value;
  const { pathname } = request.nextUrl;

  // Protect admin dashboards
  const isProtected = pathname.startsWith('/super-admin') || pathname.startsWith('/facility-admin');

  if (isProtected && !token) {
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from landing (login) page
  if (pathname === '/' && token) {
    // Redirection is handled inside the LandingPage component for more flexibility,
    // but we can also do a fast server-side redirect here if desired.
    // For now, let the component handle it to ensure store hydration.
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/super-admin/:path*',
    '/facility-admin/:path*',
  ],
};
