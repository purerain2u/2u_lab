import { NextResponse } from 'next/server';
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import logger from '../utils/logger';
import { AppError } from '../utils/errorClasses';

// Next.js 에러 핸들러
export function nextErrorHandler(error: Error) {
  logger.error(error);
  return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
}

// Express.js 에러 핸들러
export const errorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const appError = err instanceof AppError ? err : new AppError('서버 내부 오류가 발생했습니다.', 500);

  logger.error(`${appError.status} - ${appError.message}`, {
    error: appError,
    requestInfo: {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip
    }
  });

  if (process.env.NODE_ENV === 'development') {
    res.status(appError.statusCode).json({
      status: appError.status,
      error: appError,
      message: appError.message,
      stack: appError.stack
    });
  } else {
    if (appError.isOperational) {
      res.status(appError.statusCode).json({
        status: appError.status,
        message: appError.message
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: '서버 내부 오류가 발생했습니다.'
      });
    }
  }
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const err = new AppError(`요청한 URL ${req.originalUrl}을 찾을 수 없습니다.`, 404);
  next(err);
};
