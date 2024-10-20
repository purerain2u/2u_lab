import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errorClasses';
import logger from '../utils/logger';

interface IError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
  code?: number | string | undefined;
  path?: string;
  value?: string;
  errors?: { [key: string]: any };
  errmsg?: string;
}

const handleCastErrorDB = (err: IError): AppError => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: IError): AppError => {
  const value = err.errmsg?.match(/(["'])(\\?.)*?\1/)?.[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: IError): AppError => {
  const errors = Object.values(err.errors || {}).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err: IError, req: Request, res: Response) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode || 500).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }
  // RENDERED WEBSITE
  console.error('ERROR 💥', err);
  return res.status(err.statusCode || 500).render('error', {
    title: 'Something went wrong!',
    msg: err.message
  });
};

const sendErrorProd = (err: IError, req: Request, res: Response) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode || 500).json({
        status: err.status,
        message: err.message
      });
    }
    // Programming or other unknown error: don't leak error details
    console.error('ERROR 💥', err);
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }

  // RENDERED WEBSITE
  if (err.isOperational) {
    return res.status(err.statusCode || 500).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
  }
  console.error('ERROR 💥', err);
  return res.status(err.statusCode || 500).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.'
  });
};

export default (err: IError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }

  logger.error(`Error: ${err.message}`, { error: err });
};
