import dotenv from 'dotenv';
import mongoose from 'mongoose';
import http from 'http';
import https from 'https';
import fs from 'fs';
import app from './app';
import { config } from './config';
import logger from './utils/logger';

dotenv.config();

// 필수 환경 변수 검증 함수
function validateEnv() {
  const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'TOSS_SECRET_KEY', 'ALLOWED_ORIGIN'];
  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingEnvVars.length > 0) {
    logger.error(`다음 환경 변수가 설정되지 않았습니다: ${missingEnvVars.join(', ')}`);
    process.exit(1);
  }

  logger.info('모든 필수 환경 변수가 설정되었습니다.');
}

// 서버 시작 전에 환경 변수 검증
validateEnv();

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);
    logger.info('MongoDB connected');
  } catch (err) {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

const startServer = async () => {
  await connectDB();

  let server: http.Server | https.Server;
  if (process.env.NODE_ENV === 'production') {
    // HTTPS 서버 설정 (프로덕션 환경)
    const httpsOptions = {
      key: fs.readFileSync('/path/to/your/private-key.pem'),
      cert: fs.readFileSync('/path/to/your/certificate.pem')
    };
    server = https.createServer(httpsOptions, app);
  } else {
    // HTTP 서버 설정 (개발 환경)
    server = http.createServer(app);
  }

  server.listen(config.port, () => {
    logger.info(`서버가 ${process.env.NODE_ENV === 'production' ? 'HTTPS' : 'HTTP'} 포트 ${config.port}에서 실행 중입니다.`);
  });

  // CORS 설정 확인
  logger.info(`CORS가 ${config.allowedOrigin} 도메인에 대해 허용되었습니다.`);

  // 예기치 않은 에러 처리
  process.on('unhandledRejection', (err: Error) => {
    logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
    logger.error(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });

  process.on('SIGTERM', () => {
    logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
      logger.info('💥 Process terminated!');
    });
  });
};

startServer().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});

// 주의사항:
// 1. 환경 변수 설정: MONGODB_URI, JWT_SECRET, TOSS_SECRET_KEY, ALLOWED_ORIGIN이 .env 파일에 설정되어 있는지 확인하세요.
// 2. 프로덕션 환경에서는 SSL/TLS 인증서 파일 경로를 올바르게 설정하세요.
// 3. 추가적인 보안 조치를 고려하세요 (예: Helmet 미들웨어 사용, 적절한 rate limiting 설정 등).
