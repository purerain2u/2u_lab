import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_URI) {
  throw new Error('환경 변수에 MONGODB_URI가 설정되지 않았습니다');
}

if (!MONGODB_DB) {
  throw new Error('환경 변수에 MONGODB_DB가 설정되지 않았습니다');
}

interface Connection {
  isConnected: mongoose.ConnectionStates;
}

const connection: Connection = {
  isConnected: mongoose.ConnectionStates.disconnected,
};

async function dbConnect(uri?: string): Promise<typeof mongoose> {
  if (connection.isConnected === mongoose.ConnectionStates.connected) {
    console.log('이미 데이터베이스에 연결되어 있습니다.');
    return mongoose;
  }

  try {
    const db = await mongoose.connect(uri || MONGODB_URI!, {
      bufferCommands: false,
      dbName: MONGODB_DB!,
      maxPoolSize: 10,
      minPoolSize: 5,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      family: 4,
      retryWrites: true,
      w: 'majority',
    } as mongoose.ConnectOptions);

    connection.isConnected = db.connections[0].readyState;
    console.log('MongoDB 연결 성공');
    return db;
  } catch (error) {
    console.error('MongoDB 연결 실패:', error);
    throw error;
  }
}

export default dbConnect;

// 기존 mongodb 드라이버 사용 코드와의 호환성을 위한 함수
export async function connectToDatabase(uri?: string): Promise<{ client: any; db: any }> {
  await dbConnect(uri);
  return { 
    client: (mongoose.connection as any).client, 
    db: mongoose.connection.db 
  };
}

// 연결 상태 확인 함수
export function isConnected(): boolean {
  return connection.isConnected === mongoose.ConnectionStates.connected;
}

// 연결 종료 함수
export async function disconnect(): Promise<void> {
  if (connection.isConnected === mongoose.ConnectionStates.connected) {
    await mongoose.disconnect();
    connection.isConnected = mongoose.ConnectionStates.disconnected;
    console.log('MongoDB 연결 종료');
  }
}