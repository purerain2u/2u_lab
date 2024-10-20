import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/dbConnect';
import User from '@/server/models/User';
import { CustomError } from '@/server/utils/errorClasses';
import logger from '@/server/utils/logger';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const { username, email, password } = await request.json();

    // 이메일 중복 체크
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: '이미 등록된 이메일입니다.' }, { status: 400 });
    }

    // 새 사용자 생성
    const newUser = new User({ username, email, password });
    await newUser.save();

    logger.info(`New user registered: ${email}`);
    return NextResponse.json({ message: '회원가입 성공', userId: newUser._id }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    logger.error(`Registration error: ${(error as Error).message}`);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
