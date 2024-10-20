import { NextRequest, NextResponse } from 'next/server';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AppError } from '../utils/errorClasses';

interface JwtPayload {
  userId: string;
}

// Next.js 미들웨어
export async function authenticate(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: '인증 토큰이 필요합니다' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    (request as any).user = { id: decoded.userId };
  } catch (error) {
    return NextResponse.json({ error: '유효하지 않은 토큰입니다' }, { status: 401 });
  }
}

// Express 미들웨어
export const protect = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(new AppError('인증이 필요합니다.', 401));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    next(new AppError('유효하지 않은 토큰입니다.', 401));
  }
};
