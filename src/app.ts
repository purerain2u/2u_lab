import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import membershipRoutes from './routes/membershipRoutes';
import paymentRoutes from './routes/paymentRoutes';

dotenv.config();

const app: Express = express();

// 미들웨어 설정
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우트 설정
app.use('/api/auth', authRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/payments', paymentRoutes);

// 에러 핸들링 미들웨어
app.use(errorHandler);

export default app;
