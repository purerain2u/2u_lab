import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../src/models/User';
import Membership from '../src/models/Membership';
import PageVisit from '../src/models/PageVisit';
import PageAnalytics from '../src/models/PageAnalytics';
import Payment from '../src/models/Payment';
import UserProfile from '../src/models/UserProfile';
import TargetVideoSearchAnalytics from '../src/models/TargetVideoSearchAnalytics';
import TargetSourceCollectionAnalytics from '../src/models/TargetSourceCollectionAnalytics';
import ServicesPageAnalytics from '../src/models/ServicesPageAnalytics';
import MillionViewMissionAnalytics from '../src/models/MillionViewMissionAnalytics';
import MainPageAnalytics from '../src/models/MainPageAnalytics';
import LandingPageAnalytics from '../src/models/LandingPageAnalytics';
import AboutPageAnalytics from '../src/models/AboutPageAnalytics';

dotenv.config({ path: '../../.env' });

async function syncSchemas() {
  // 모든 모델에 대해 컬렉션 생성 및 인덱스 설정
  await User.createCollection();
  await Membership.createCollection();
  await PageVisit.createCollection();
  await PageAnalytics.createCollection();
  await Payment.createCollection();
  await UserProfile.createCollection();
  await TargetVideoSearchAnalytics.createCollection();
  await TargetSourceCollectionAnalytics.createCollection();
  await ServicesPageAnalytics.createCollection();
  await MillionViewMissionAnalytics.createCollection();
  await MainPageAnalytics.createCollection();
  await LandingPageAnalytics.createCollection();
  await AboutPageAnalytics.createCollection();

  console.log('All collections created and indexes ensured');
}

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined in the environment variables');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    return syncSchemas();
  })
  .then(() => {
    console.log('Schema synchronization completed');
    return mongoose.disconnect();
  })
  .then(() => {
    console.log('Disconnected from MongoDB');
  })
  .catch(error => {
    console.error('Error during schema synchronization:', error);
    return mongoose.disconnect();
  })
  .finally(() => {
    process.exit(0);
  });