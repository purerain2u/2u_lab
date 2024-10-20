import jwt from 'jsonwebtoken';

export function generateToken(userId: string): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '1d' // 토큰 만료 시간 설정 (예: 1일)
  });
}

export function verifyToken(token: string): any {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
  }
  return jwt.verify(token, process.env.JWT_SECRET);
}
