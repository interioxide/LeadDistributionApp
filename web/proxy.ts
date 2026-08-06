import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/brokers', '/lead-form', '/distribution', '/leads'];
const publicOnlyRoutes = ['/login', '/signup'];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get('accessToken')?.value;
    const baseUrl = request.nextUrl.origin;

    const isAuthenticated = Boolean(accessToken);

    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
    const isPublicOnlyRoute = publicOnlyRoutes.some((route) => pathname.startsWith(route));
    // Redirect unauthenticated users trying to access protected routes
    if (isProtectedRoute && !isAuthenticated) {
        const loginUrl = new URL('/login', baseUrl);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect logged-in users away from login/signup pages
    if (isPublicOnlyRoute && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', baseUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
