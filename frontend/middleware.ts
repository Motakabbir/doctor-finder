import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the token from the Authorization header
  const token = request.headers.get('Authorization');

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized - No token provided' },
      { status: 401 }
    );
  }

  // You can add additional token validation here if needed
  // For example, checking if it's a valid JWT token

  // Continue to the API route
  return NextResponse.next();
}

// Configure the middleware to run only on admin API routes
export const config = {
  matcher: '/api/admin/:path*',
};
