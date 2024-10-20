import { NextApiRequest, NextApiResponse } from 'next';
import { Types } from 'mongoose';
import User, { IUser } from '../models/User';
import PageAnalytics from '../models/PageAnalytics';
import { dbConnect } from '../utils/dbConnect';
import { hashPassword } from '../utils/auth';

// 데이터베이스 작업을 위한 함수들
async function findUserById(id: string): Promise<IUser | null> {
  return User.findById(id).select('-password');
}

async function updateUserById(id: string, updates: Partial<IUser>): Promise<IUser | null> {
  return User.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).select('-password');
}

// 컨트롤러 함수들
export async function getUser(id: string): Promise<IUser> {
  await dbConnect();
  const user = await findUserById(id);
  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }
  return user;
}

export async function updateUser(id: string, updates: Partial<IUser>): Promise<IUser> {
  await dbConnect();
  const user = await updateUserById(id, updates);
  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }
  return user;
}

export async function createUser(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      accountStatus: {
        isVerified: false,
        isActive: true,
        registrationDate: new Date(),
      },
    });
    await user.save();
    res.status(201).json({ message: '사용자가 성공적으로 생성되었습니다.', userId: user._id });
  } catch (error) {
    console.error('User creation error:', error);
    res.status(500).json({ error: '사용자 생성 중 오류가 발생했습니다.' });
  }
}

export async function deleteUser(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  try {
    const userId = req.query.id as string;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }
    res.json({ message: '사용자가 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error('User deletion error:', error);
    res.status(500).json({ error: '사용자 삭제 중 오류가 발생했습니다.' });
  }
}

export async function getProfile(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  try {
    const userId = (req as any).user._id;
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile retrieval error:', error);
    res.status(500).json({ error: '프로필 정보 조회 중 오류가 발생했습니다.' });
  }
}

export async function updateProfile(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  try {
    const userId = (req as any).user._id;
    const updates = req.body;
    const user = await updateUserById(userId, updates);
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: '프로필 정보 업데이트 중 오류가 발생했습니다.' });
  }
}

export async function getYoutubeInsights(req: NextApiRequest, res: NextApiResponse) {
  // YouTube API 연동 및 인사이트 데이터 가져오기 로직
  res.json({ message: 'YouTube 인사이트 기능은 아직 구현되지 않았습니다.' });
}

export async function recordPageVisit(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  try {
    const { userId, pageType } = req.body;
    const pageVisit = new PageAnalytics({
      userId,
      pageType,
      visitDate: new Date(),
    });
    await pageVisit.save();
    res.status(201).json({ message: '페이지 방문이 기록되었습니다.' });
  } catch (error) {
    console.error('Page visit recording error:', error);
    res.status(500).json({ error: '페이지 방문 기록 중 오류가 발생했습니다.' });
  }
}

export async function getPageAnalytics(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  try {
    const userId = (req as any).user._id;
    const analytics = await PageAnalytics.find({ userId }).sort({ visitDate: -1 });
    res.json(analytics);
  } catch (error) {
    console.error('Page analytics retrieval error:', error);
    res.status(500).json({ error: '페이지 분석 데이터 조회 중 오류가 발생했습니다.' });
  }
}