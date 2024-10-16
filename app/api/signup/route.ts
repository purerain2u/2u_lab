import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/dbConnect';
import { hashPassword } from '@/utils/auth';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();
    
    // 입력 유효성 검사
    if (!name || !email || !password) {
      return NextResponse.json({ error: '모든 필드를 입력해주세요.' }, { status: 400 });
    }
    
    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: '유효한 이메일 주소를 입력해주세요.' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const collection = db.collection("users");

    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: '이미 존재하는 이메일입니다.' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    const result = await collection.insertOne({
      name,
      email,
      password: hashedPassword,
    });

    if (!result.acknowledged) {
      throw new Error('사용자 생성 실패');
    }

    console.log('회원가입 성공:', { name, email });

    return NextResponse.json(
      { message: '회원가입이 완료되었습니다' },
      { 
        status: 201,
        headers: {
          'Location': '/'  // 메인 페이지 URL
        }
      }
    );
  } catch (error) {
    console.error('회원가입 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ success: false, message: '지원되지 않는 메소드입니다.' }, { status: 405 });
}
