export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  jwtCookieExpiresIn: parseInt(process.env.JWT_COOKIE_EXPIRES_IN || '1', 10),
  tossSecretKey: process.env.TOSS_SECRET_KEY || 'your_toss_secret_key',
  allowedOrigin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000',
};