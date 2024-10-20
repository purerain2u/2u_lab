import { NextRequest, NextResponse } from 'next/server';

export function authenticate(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: '인증 토큰이 필요합니다' }, { status: 401 });
  }

  return NextResponse.next();
}
