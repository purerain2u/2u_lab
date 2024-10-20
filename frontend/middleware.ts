import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authenticate } from './middleware/authMiddleware';

export function middleware(request: NextRequest) {
  // API 라우트에 대해서만 인증 적용
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return authenticate(request);
  }

  return NextResponse.next();
}
