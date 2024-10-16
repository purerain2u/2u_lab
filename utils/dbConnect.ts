import { MongoClient, MongoClientOptions, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('환경 변수에 MONGODB_URI가 설정되지 않았습니다');
}

if (!process.env.MONGODB_DB) {
  throw new Error('환경 변수에 MONGODB_DB가 설정되지 않았습니다');
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

const options: MongoClientOptions = {
  maxPoolSize: 50,
  minPoolSize: 10,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 10000,
  family: 4,
  retryWrites: true,
  w: 'majority',
};

let clientPromise: Promise<MongoClient>;

// 전역 타입 선언 추가
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  const client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  const client = await clientPromise;
  const db = client.db(dbName);
  return { client, db };
}

export default clientPromise;
