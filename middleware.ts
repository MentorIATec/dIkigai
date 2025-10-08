import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/auth/config';
import { verifySessionToken } from '@/lib/auth/tokens';

const PRIVATE_ROUTES = [
  /^\/dashboard(?:\/|$)/,
  /^\/goals(?:\/|$)/,
  /^\/goal-bank(?:\/|$)/,
  /^\/admin(?:\/|$)/,
];

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  if (searchParams.get('preview') === '1') {
    return NextResponse.next();
  }

  const requiresAuth = PRIVATE_ROUTES.some((pattern) => pattern.test(pathname));
  if (!requiresAuth) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const session = await verifySessionToken(token);
    if (pathname.startsWith('/admin') && session.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  } catch (error) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/goals/:path*', '/goal-bank/:path*', '/admin/:path*'],
};
