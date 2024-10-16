import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function authenticate(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: '인증 토큰이 필요합니다' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (request as any).user = decoded;
  } catch (error) {
    return NextResponse.json({ error: '유효하지 않은 토큰입니다' }, { status: 401 });
  }
}
