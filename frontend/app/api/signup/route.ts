import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import User from '@/server/models/User';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    console.log('Received signup data:', body);

    if (!body.username || !body.email || !body.password) {
      return NextResponse.json({ error: '모든 필드를 입력해주세요.' }, { status: 400 });
    }

    const user = await User.create(body);
    return NextResponse.json({ message: '회원가입 성공', user: { id: user._id, username: user.username, email: user.email } }, { status: 201 });
  } catch (error: any) {
    console.error('Signup error:', error);
    if (error.code === 11000) {
      return NextResponse.json({ error: '이미 사용 중인 이메일 또는 사용자 이름입니다.' }, { status: 400 });
    }
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({ error: validationErrors.join(', ') }, { status: 400 });
    }
    return NextResponse.json({ error: '회원가입 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ success: false, message: '지원되지 않는 메소드입니다.' }, { status: 405 });
}
