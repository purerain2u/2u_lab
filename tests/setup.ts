import { connectToDatabase, closeDatabase } from '@/utils/db';
import jwt from 'jsonwebtoken';

export const setupTestDatabase = async () => {
  return await connectToDatabase();
};

export const generateTestToken = (userId: string = 'test_user_id') => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'test_secret', { expiresIn: '1h' });
};

export const closeTestDatabase = async () => {
  await closeDatabase();
};
