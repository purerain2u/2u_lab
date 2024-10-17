import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_URI) {
  throw new Error('환경 변수에 MONGODB_URI가 설정되지 않았습니다');
}

if (!MONGODB_DB) {
  throw new Error('환경 변수에 MONGODB_DB가 설정되지 않았습니다');
}

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: Cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect(uri?: string): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: MONGODB_DB,
      maxPoolSize: 50,
      minPoolSize: 10,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 10000,
      family: 4,
      retryWrites: true,
      w: 'majority',
    };

    cached.promise = mongoose.connect(uri || MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;

// 기존 mongodb 드라이버 사용 코드와의 호환성을 위한 함수
export async function connectToDatabase(): Promise<{ client: any; db: any }> {
  const conn = await dbConnect();
  return { client: conn.connection.client, db: conn.connection.db };
}
