import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI를 환경 변수에 설정해주세요.');
}

if (!MONGODB_DB) {
  throw new Error('MONGODB_DB를 환경 변수에 설정해주세요.');
}

interface CachedConnection {
  client: MongoClient | null;
  db: Db | null;
}

let cached: CachedConnection = { client: null, db: null };

export async function connectToDatabase(): Promise<CachedConnection> {
  if (cached.client && cached.db) {
    return cached;
  }

  const client = await MongoClient.connect(MONGODB_URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as any);

  const db = await client.db(MONGODB_DB);

  cached = { client, db };

  return cached;
}
