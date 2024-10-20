import { MongoMemoryServer } from 'mongodb-memory-server';
import dbConnect, { disconnect } from '@/utils/dbConnect';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

let mongod: MongoMemoryServer;

export const setupTestDatabase = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await dbConnect(uri);  // 'test_db' 인자 제거
  return mongoose.connection;
};

export const generateTestToken = (userId: string = 'test_user_id') => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'test_secret', { expiresIn: '1h' });
};

export const closeTestDatabase = async () => {
  await disconnect();
  if (mongod) {
    await mongod.stop();
  }
};

export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

// Jest hooks
beforeAll(async () => {
  await setupTestDatabase();
});

afterAll(async () => {
  await closeTestDatabase();
});

beforeEach(async () => {
  await clearDatabase();
});