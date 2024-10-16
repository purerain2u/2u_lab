import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { login } from '@/src/api-controllers/auth.controller';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await login(body);
    return result;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: '로그인 오류가 발생했습니다.' }, { status: 500 });
  }
}
