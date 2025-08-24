import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest){
    const path = request.nextUrl.pathname
    const isPublicPath = path === '/auth/signup' || path === '/auth/signin' || path === '/'
    const accessToken = request.cookies.get('accessToken')?.value

    if (!isPublicPath && !accessToken) {
        return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    if (isPublicPath && accessToken) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
}

export const config = {
    matcher: [
        '/',
        '/auth/:path*',
        '/dashboard',
    ],
}