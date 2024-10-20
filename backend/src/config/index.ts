import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  jwtCookieExpiresIn: parseInt(process.env.JWT_COOKIE_EXPIRES_IN || '1', 10),
  allowedOrigin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000',
  tossPayments: {
    clientKey: process.env.TOSS_PAYMENTS_CLIENT_KEY,
    secretKey: process.env.TOSS_PAYMENTS_SECRET_KEY
  }
};
