import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User';
import Membership from '../src/models/Membership';
import Payment from '../src/models/Payment';
import PageAnalytics from '../src/models/PageAnalytics';
import Role from '@models/Role';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('데이터베이스 연결 성공');

    await Promise.all([
      User.deleteMany({}),
      Membership.deleteMany({}),
      Payment.deleteMany({}),
      PageAnalytics.deleteMany({}),
      Role.deleteMany({}) // Role 데이터 삭제 추가
    ]);
    console.log('기존 데이터 삭제 완료');

    // 역할 생성
    const adminRole = await Role.create({
      name: 'admin',
      permissions: ['manage_users', 'manage_content', 'view_analytics', 'manage_payments']
    });

    const userRole = await Role.create({
      name: 'user',
      permissions: ['view_content', 'manage_own_profile']
    });

    console.log('역할 생성 완료');

    // 관리자 사용자 생성
    const adminPassword = await bcrypt.hash('adminpassword123', 12);
    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
      roleId: adminRole._id, // 관리자 역할 연결
      profileInfo: {
        fullName: '관리자',
        nickname: '어드민',
        bio: '시스템 관리자입니다.'
      }
    });
    console.log('관리자 계정 생성 완료');

    // 일반 사용자 생성
    const userPassword = await bcrypt.hash('userpassword123', 12);
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: userPassword,
      role: 'user',
      roleId: userRole._id, // 일반 사용자 역할 연결
      profileInfo: {
        fullName: '홍길동',
        nickname: '길동이',
        bio: '테스트 사용자입니다.'
      },
      youtubeChannel: {
        channelUrl: 'https://www.youtube.com/channel/test123',
        channelId: 'UCtest123'
      },
      channelInsights: [{
        date: new Date(),
        metrics: new Map([
          ['폴링콘텐츠조회수', 1000],
          ['구독자가수', 50],
          ['구독전환율', 2.5],
          ['Shorts조회수', 5000],
          ['시청지속시간', 300],
          ['클릭율', 3.2],
          ['탐색유입', 2000],
          ['키콘텐츠조회수', 3000],
          ['키콘텐츠연계율', 1.8],
          ['검색유입', 1500],
          ['페이지유입', 1200]
        ])
      }],
      performanceMetrics: new Map([
        ['매출', 1000000],
        ['객단가', 50000],
        ['유료고객수', 20],
        ['유료고객전환율', 5],
        ['무료고객수', 100],
        ['무료고객전환율', 20],
        ['랜딩페이지접속수', 500],
        ['링크클릭율', 3.5]
      ])
    });
    console.log('일반 사용자 계정 생성 완료');

    // 멤버십 생성
    const membership = await Membership.create({
      userId: user._id,
      type: 'gold',
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      price: 209800,
      benefits: ['영상 찾기 100회', '타겟소스집 300회', '제목 분석 리포트 30회'],
      usageLimit: new Map([
        ['aiAnalysis', 100],
        ['trendPredictions', 50],
        ['contentOptimizations', 30]
      ])
    });
    console.log('멤버십 데이터 생성 완료');

    // 결제 데이터 생성
    await Payment.create({
      userId: user._id,
      membershipId: membership._id,
      orderId: 'ORDER123456',
      amount: 209800,
      currency: 'KRW',
      status: 'completed',
      paymentMethod: 'creditCard',
      paymentKey: 'PAYMENT_KEY_123',
      transactionId: 'TRANS123456',
      paymentDetails: {
        cardType: 'Visa',
        last4Digits: '1234'
      }
    });
    console.log('결제 데이터 생성 완료');

    // 페이지 분석 데이터 생성
    const pageTypes = ['landing', 'main', 'targetVideoSearch', 'membershipApplication', 'payment'];
    const startDate = new Date(new Date().setDate(new Date().getDate() - 30));

    const pageAnalyticsPromises = [];
    for (let i = 0; i < 30; i++) {
      for (const pageType of pageTypes) {
        const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        pageAnalyticsPromises.push(PageAnalytics.create({
          pageType,
          date,
          visitorMetrics: {
            totalVisitors: Math.floor(Math.random() * 1000) + 500,
            uniqueVisitors: Math.floor(Math.random() * 800) + 300,
            newVisitors: Math.floor(Math.random() * 600) + 200,
            returningVisitors: Math.floor(Math.random() * 400) + 100
          },
          engagementMetrics: {
            averageStayDuration: Math.floor(Math.random() * 180) + 60,
            bounceRate: Math.random() * 50 + 20,
            exitRate: Math.random() * 30 + 10
          },
          totalImpressions: Math.floor(Math.random() * 2000) + 1000,
          totalClicks: Math.floor(Math.random() * 200) + 50,
          clickThroughRate: Math.random() * 10 + 2,
          deviceTypes: {
            desktop: Math.floor(Math.random() * 600) + 200,
            mobile: Math.floor(Math.random() * 400) + 150,
            tablet: Math.floor(Math.random() * 100) + 50
          }
        }));
      }
    }
    await Promise.all(pageAnalyticsPromises);
    console.log('페이지 분석 데이터 생성 완료');

    console.log('데이터베이스 시드 작업이 성공적으로 완료되었습니다.');
  } catch (error) {
    console.error('데이터베이스 시드 작업 중 오류 발생:', error);
  } finally {
    await mongoose.connection.close();
    console.log('데이터베이스 연결 종료');
  }
}

seedDatabase().catch(console.error);
