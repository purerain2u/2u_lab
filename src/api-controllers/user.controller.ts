import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/dbConnect';
import { ObjectId } from 'mongodb';
import { hashPassword, verifyPassword } from '@/utils/auth';
import { someAuthFunction } from '@/utils/auth';

export async function getUser(id: string) {
  const { db } = await connectToDatabase();
  const user = await db.collection('users').findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });

  if (!user) {
    return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function updateUser(id: string, body: { name?: string; email?: string }) {
  const { db } = await connectToDatabase();
  const result = await db.collection('users').findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: body },
    { returnDocument: 'after', projection: { password: 0 } }
  );

  if (!result || !result.value) {
    return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
  }

  return NextResponse.json(result.value);
}