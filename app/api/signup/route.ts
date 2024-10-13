import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import { hashPassword } from '@/utils/auth';

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();
    
    // 입력 검증
    if (!username || !email || !password) {
      return NextResponse.json({ success: false, message: '모든 필드를 입력해주세요.' }, { status: 400 });
    }

    // 이메일 형식 검증 및 소문자 변환
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const lowerCaseEmail = email.toLowerCase();
    if (!emailRegex.test(lowerCaseEmail)) {
      return NextResponse.json({ success: false, message: '유효한 이메일 주소를 입력해주세요.' }, { status: 400 });
    }

    // 비밀번호 복잡성 검증
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json({ 
        success: false, 
        message: '비밀번호는 영문, 숫자, 특수문자를 포함하여 6글자 이상이어야 합니다.' 
      }, { status: 400 });
    }

    // 데이터베이스 연결
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');

    // 이메일 중복 체크 (소문자로 변환된 이메일 사용)
    const existingUser = await usersCollection.findOne({ email: lowerCaseEmail });
    if (existingUser) {
      return NextResponse.json({ success: false, message: '이미 사용 중인 이메일입니다.' }, { status: 400 });
    }

    // 비밀번호 해싱
    const hashedPassword = await hashPassword(password);

    // 사용자 생성
    const result = await usersCollection.insertOne({
      username,
      email: lowerCaseEmail,
      password: hashedPassword,
      createdAt: new Date(),
    });

    if (!result.insertedId) {
      throw new Error('사용자 생성 실패');
    }

    return NextResponse.json({ success: true, message: '회원가입이 완료되었습니다.' }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ success: false, message: '회원가입 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ success: false, message: '허용되지 않는 메소드입니다.' }, { status: 405 });
}
