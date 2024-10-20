import mongoose from 'mongoose';
import { logger } from '../../server/utils/logger';

const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_DB = process.env.MONGODB_DB || 'default_db_name';

if (!MONGODB_URI) {
  throw new Error('환경 변수에 MONGODB_URI가 설정되지 않았습니다');
}

interface Connection {
  isConnected: mongoose.ConnectionStates;
}

const connection: Connection = {
  isConnected: mongoose.ConnectionStates.disconnected,
};

async function dbConnect(uri?: string): Promise<typeof mongoose> {
  if (connection.isConnected === mongoose.ConnectionStates.connected) {
    logger.info('이미 데이터베이스에 연결되어 있습니다.');
    return mongoose;
  }

  try {
    const db = await mongoose.connect(uri || MONGODB_URI, {
      bufferCommands: false,
      dbName: MONGODB_DB,
      maxPoolSize: 10,
      minPoolSize: 5,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      family: 4,
      retryWrites: true,
      w: 'majority',
    } as mongoose.ConnectOptions);

    connection.isConnected = db.connection.readyState;
    logger.info('MongoDB 연결 성공');
    return db;
  } catch (error) {
    logger.error('MongoDB 연결 실패:', error);
    throw error;
  }
}

export async function connectToDatabase(uri?: string): Promise<{ client: any; db: mongoose.Connection }> {
  await dbConnect(uri);
  return { 
    client: mongoose.connection.getClient(),
    db: mongoose.connection
  };
}

export function isConnected(): boolean {
  return connection.isConnected === mongoose.ConnectionStates.connected;
}

export async function disconnect(): Promise<void> {
  if (connection.isConnected === mongoose.ConnectionStates.connected) {
    await mongoose.disconnect();
    connection.isConnected = mongoose.ConnectionStates.disconnected;
    logger.info('MongoDB 연결 종료');
  }
}

async function retryConnect(maxRetries: number = 5, delay: number = 5000): Promise<typeof mongoose> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await dbConnect();
    } catch (error) {
      logger.warn(`MongoDB 연결 재시도 ${i + 1}/${maxRetries}`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('MongoDB 연결 실패: 최대 재시도 횟수 초과');
}

export { dbConnect, retryConnect };
