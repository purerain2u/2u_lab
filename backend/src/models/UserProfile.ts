import mongoose, { Document, Schema } from 'mongoose';

// UserProfile 인터페이스 정의
interface UserProfile extends Document {
  username: string;
  email: string;
  passwordHash: string;
  profileInfo: {
    fullName?: string;
    nickname?: string;
    profileImage?: string;
    bio?: string;
  };
  accountStatus: {
    isVerified: boolean;
    isActive: boolean;
    registrationDate: Date;
    lastLoginDate?: Date;
  };
  membershipInfo: {
    type: string;
    startDate?: Date;
    endDate?: Date;
  };
  activityMetrics: {
    totalLogins: number;
    totalVideoUploads: number;
    totalMissionsCompleted: number;
    totalViewsAcrossVideos: number;
  };
  preferences: {
    emailNotifications: boolean;
    language: string;
    timezone: string;
  };
  youtubeChannel: {
    channelUrl?: string;
    channelId?: string;
    lastSyncDate?: Date;
  };
  youtubeInsights: {
    subscriberCount: number;
    totalViews: number;
    totalVideos: number;
    averageViewsPerVideo: number;
    topPerformingVideos: Array<{
      videoId: string;
      title: string;
      views: number;
      likes: number;
      comments: number;
    }>;
    recentVideosPerformance: Array<{
      videoId: string;
      title: string;
      publishDate: Date;
      views: number;
      likes: number;
      comments: number;
    }>;
  };
  channelInsights: Array<{
    date: Date;
    폴링콘텐츠조회수?: number;
    구독자증가수?: number;
    구독전환율?: number;
    Shorts조회수?: number;
    시청지속시간?: number;
    클릭율?: number;
    탐색유입?: number;
    키콘텐츠조회수?: number;
    키콘텐츠연계율?: number;
    검색유입?: number;
    페이지유입?: number;
  }>;
  performanceMetrics: {
    매출?: number;
    객단가?: number;
    유료고객수?: number;
    유료고객전환율?: number;
    무료고객수?: number;
    무료고객전환율?: number;
    랜딩페이지접속수?: number;
    링크클릭율?: number;
  };
  serviceUsage: {
    aiAnalysisUsed: number;
    trendPredictionsViewed: number;
    contentOptimizationsApplied: number;
  };
  contentCreationInsights: {
    averageVideoCreationTime: number;
    mostUsedTags: string[];
    averageThumbnailCreationTime: number;
    averageTitleOptimizationTime: number;
  };
}

// UserProfile 스키마 정의
const userProfileSchema = new Schema<UserProfile>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  profileInfo: {
    fullName: String,
    nickname: String,
    profileImage: String,
    bio: String
  },
  accountStatus: {
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    registrationDate: { type: Date, default: Date.now },
    lastLoginDate: Date
  },
  membershipInfo: {
    type: { type: String, enum: ['free', 'basic', 'premium'] },
    startDate: Date,
    endDate: Date
  },
  activityMetrics: {
    totalLogins: { type: Number, default: 0 },
    totalVideoUploads: { type: Number, default: 0 },
    totalMissionsCompleted: { type: Number, default: 0 },
    totalViewsAcrossVideos: { type: Number, default: 0 }
  },
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    language: { type: String, default: 'ko' },
    timezone: { type: String, default: 'Asia/Seoul' }
  },
  youtubeChannel: {
    channelUrl: String,
    channelId: String,
    lastSyncDate: Date
  },
  youtubeInsights: {
    subscriberCount: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    totalVideos: { type: Number, default: 0 },
    averageViewsPerVideo: { type: Number, default: 0 },
    topPerformingVideos: [{
      videoId: String,
      title: String,
      views: Number,
      likes: Number,
      comments: Number
    }],
    recentVideosPerformance: [{
      videoId: String,
      title: String,
      publishDate: Date,
      views: Number,
      likes: Number,
      comments: Number
    }]
  },
  channelInsights: [{
    date: { type: Date, default: Date.now },
    폴링콘텐츠조회수: Number,
    구독자증가수: Number,
    구독전환율: Number,
    Shorts조회수: Number,
    시청지속시간: Number,
    클릭율: Number,
    탐색유입: Number,
    키콘텐츠조회수: Number,
    키콘텐츠연계율: Number,
    검색유입: Number,
    페이지유입: Number
  }],
  performanceMetrics: {
    매출: Number,
    객단가: Number,
    유료고객수: Number,
    유료고객전환율: Number,
    무료고객수: Number,
    무료고객전환율: Number,
    랜딩페이지접속수: Number,
    링크클릭율: Number
  },
  serviceUsage: {
    aiAnalysisUsed: { type: Number, default: 0 },
    trendPredictionsViewed: { type: Number, default: 0 },
    contentOptimizationsApplied: { type: Number, default: 0 }
  },
  contentCreationInsights: {
    averageVideoCreationTime: Number,
    mostUsedTags: [String],
    averageThumbnailCreationTime: Number,
    averageTitleOptimizationTime: Number
  }
}, {
  timestamps: true
});

// 총 수익을 계산하는 가상 필드
userProfileSchema.virtual('totalRevenue').get(function() {
  return this.performanceMetrics?.매출 || 0; // optional chaining 사용
});

// 평균 조회수를 계산하는 가상 필드
userProfileSchema.virtual('averageViews').get(function() {
  // this.youtubeInsights가 undefined인지 확인
  if (this.youtubeInsights && this.youtubeInsights.totalVideos > 0) {
    return this.youtubeInsights.totalViews / this.youtubeInsights.totalVideos;
  }
  return 0; // 기본값 반환
});

// 멤버십 상태를 확인하는 가상 필드
userProfileSchema.virtual('membershipStatus').get(function() {
  const now = new Date();
  return this.membershipInfo.endDate && this.membershipInfo.endDate > now ? 'active' : 'expired';
});

// 인덱스 생성
userProfileSchema.index({ username: 1, email: 1 });
userProfileSchema.index({ 'youtubeChannel.channelId': 1 });

const UserProfile = mongoose.model<UserProfile>('UserProfile', userProfileSchema);
export default UserProfile;
