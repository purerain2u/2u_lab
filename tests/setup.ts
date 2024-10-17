import { MongoMemoryServer } from 'mongodb-memory-server';
import dbConnect from '@/utils/dbConnect';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

let mongod: MongoMemoryServer;

export const setupTestDatabase = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await dbConnect(uri);
  return mongoose.connection;
};

export const generateTestToken = (userId: string = 'test_user_id') => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'test_secret', { expiresIn: '1h' });
};

export const closeTestDatabase = async () => {
  await mongoose.connection.close();
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
