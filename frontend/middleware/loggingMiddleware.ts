import { NextRequest, NextResponse } from 'next/server';

export function loggingMiddleware(request: NextRequest) {
  console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`);
  return NextResponse.next();
}
