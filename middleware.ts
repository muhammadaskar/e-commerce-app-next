import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/auth/login', '/auth/register'];

const ROLE_PATH_RULES: Record<string, string[]> = {
    '/dashboard': ['SUPER_ADMIN', 'WAREHOUSE_ADMIN'],
    '/products': ['CUSTOMER'],
    '/orders': ['CUSTOMER'],
    '/checkout': ['CUSTOMER'],
};

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth-token')?.value;
    const role = request.cookies.get('role')?.value || '';

    if (PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
        return NextResponse.next();
    }

    if (!token) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
        for (const [path, allowedRoles] of Object.entries(ROLE_PATH_RULES)) {
            if (request.nextUrl.pathname.startsWith(path) && !allowedRoles.includes(role)) {
                return NextResponse.redirect(new URL('/403', request.url));
            }
        }
    } catch (error) {
        console.error('Middleware Error:', error);
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/dashboard/:path*',
        '/products/:path*',
        '/orders/:path*',
        '/checkout/:path*',
    ],
};
