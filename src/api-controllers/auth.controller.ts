import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/dbConnect';
import { hashPassword, verifyPassword } from '@/utils/auth';
import jwt from 'jsonwebtoken';
import { someAuthFunction } from '@/utils/auth';

export async function login(request: NextRequest): Promise<NextResponse> {
  const { email, password } = await request.json();

  // 입력 검증
  if (!email || !password) {
    return NextResponse.json({ success: false, message: '이메일과 비밀번호를 입력해주세요.' }, { status: 400 });
  }

  // 데이터베이스 연결
  const { db } = await connectToDatabase();
  const usersCollection = db.collection('users');

  // 사용자 찾기
  const user = await usersCollection.findOne({ email: email.toLowerCase() });
  if (!user) {
    return NextResponse.json({ success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' }, { status: 400 });
  }

  // 비밀번호 검증
  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return NextResponse.json({ success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' }, { status: 400 });
  }

  // JWT 토큰 생성
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );

  return NextResponse.json({ success: true, message: '로그인 성공', token, userId: user._id });
}

export async function register(request: NextRequest): Promise<NextResponse> {
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
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return NextResponse.json({ 
      success: false, 
      message: '비밀번호는 영문, 숫자, 특수문자를 포함하여 8글자 이상이어야 합니다' 
    }, { status: 400 });
  }

  // 데이터베이스 연결
  const { db } = await connectToDatabase();
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

  return NextResponse.json({ success: true, message: '회원가입이 완료되었습니다' }, { status: 201 });
}