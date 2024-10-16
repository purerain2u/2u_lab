import { NextResponse } from 'next/server';

export function errorHandler(error: Error) {
  console.error(error);
  return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
}
