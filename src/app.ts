import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import membershipRoutes from '../server/routes/membershipRoutes';
import paymentRoutes from '../server/routes/paymentRoutes';
import { errorController } from '../server/controllers/errorController';

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
app.use('/api/membership', membershipRoutes);
app.use('/api/payments', paymentRoutes);

// 에러 핸들러
app.use(errorController);

export default app;
