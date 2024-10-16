import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // 여기에 로깅 로직을 구현하세요
  console.log('Page visit logged');
  return NextResponse.json({ message: 'Visit logged' });
}
