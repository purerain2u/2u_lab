import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/src/utils/token';
import dbConnect from '@/lib/db';
import crypto from 'crypto';
import mongoose from 'mongoose';

const PageVisitSchema = new mongoose.Schema({
  timestamp: Date,
  pageType: String,
  ipHash: String,
  userAgentHash: String
});

const PageVisit = mongoose.models.PageVisit || mongoose.model('PageVisit', PageVisitSchema);

function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token');

    if (!token) {
      return NextResponse.json({ success: false, message: '인증되지 않은 요청입니다.' }, { status: 401 });
    }

    try {
      verifyToken(token);
    } catch (error) {
      return NextResponse.json({ success: false, message: '유효하지 않은 토큰입니다.' }, { status: 401 });
    }

    const body = await request.json();
    const { pageType } = body;

    if (!pageType) {
      return NextResponse.json(
        { success: false, message: 'pageType이 제공되지 않았습니다.' },
        { status: 400 }
      );
    }

    await dbConnect();

    const timestamp = new Date();
    const ip = request.ip ? hashIp(request.ip) : 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const logEntry = new PageVisit({
      timestamp,
      pageType,
      ipHash: ip,
      userAgentHash: crypto.createHash('sha256').update(userAgent).digest('hex')
    });

    await logEntry.save();

    console.log(`페이지 방문 기록: ${JSON.stringify({ ...logEntry.toObject(), ipHash: '***', userAgentHash: '***' })}`);

    return NextResponse.json({ success: true, message: '방문이 기록되었습니다.' });
  } catch (error) {
    console.error('방문 기록 오류:', error);
    return NextResponse.json(
      { success: false, message: '방문 기록 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
