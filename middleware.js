import { NextResponse } from 'next/server';

export function middleware(request) {
  const host = request.headers.get('host') || '';
  const allowedHosts = ['localhost:3000'] // Your machine IP + port

  if (!allowedHosts.includes(host)) {
    return new NextResponse('Access restricted to local network.', { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/api/:path*'],
};
