import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import membershipRoutes from './routes/membershipRoutes';
import paymentRoutes from './routes/paymentRoutes';
import logRoutes from './routes/logRoutes';
import { protect } from './middleware/authMiddleware';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware';

dotenv.config();

const app: Express = express();

// 미들웨어 설정
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API 라우트에 인증 미들웨어 적용
app.use('/api', protect);

// 라우트 설정
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api', logRoutes);

// 404 처리 (모든 라우트 처리 후)
app.use(notFoundHandler);

// 에러 핸들링 미들웨어 (항상 마지막에)
app.use(errorHandler);

export default app;
