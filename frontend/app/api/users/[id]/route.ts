import { NextRequest, NextResponse } from 'next/server';
import { getUser, updateUser } from '@/src/controllers/userController';
import { authenticate } from '@/src/middleware/authMiddleware';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await authenticate(request);
  if (authResult instanceof NextResponse) return authResult;
  
  try {
    const user = await getUser(params.id);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await authenticate(request);
  if (authResult instanceof NextResponse) return authResult;
  
  try {
    const body = await request.json();
    const updatedUser = await updateUser(params.id, body);
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: '사용자 정보 업데이트에 실패했습니다.' }, { status: 400 });
  }
}