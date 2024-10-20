import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/src/controllers/authController';
import { generateToken } from '@/src/utils/token';
import dbConnect from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { email, password } = await request.json();
    console.log('로그인 요청 받음:', { email, password: '********' });
    
    const result = await login(email, password);
    console.log('로그인 결과:', result);
    
    if (result && result.success && result.user) {
      const token = generateToken(result.user.id.toString());
      const response = NextResponse.json({ 
        success: true, 
        message: '로그인 성공',
        user: {
          id: result.user.id,
          email: result.user.email,
          username: result.user.username
        }
      });
      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400 // 24시간
      });
      return response;
    } else {
      console.log('로그인 실패:', result?.message);
      return NextResponse.json({ success: false, message: result?.message || '로그인 실패' }, { status: 401 });
    }
  } catch (error) {
    console.error('로그인 오류:', error);
    return NextResponse.json({ success: false, message: '로그인 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
