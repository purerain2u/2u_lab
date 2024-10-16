const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, '사용자 이름은 필수입니다.'],
    unique: true,
    trim: true,
    minlength: [3, '사용자 이름은 최소 2자 이상이어야 합니다.']
  },
  email: {
    type: String,
    required: [true, '이메일은 필수입니다.'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, '유효한 이메일 주소를 입력해주세요.']
  },
  password: {
    type: String,
    required: [true, '비밀번호는 필수입니다.'],
    minlength: [8, '비밀번호는 최소 8자 이상이어야 합니다.'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  membership: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Membership'
  },
  payments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  }],
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
  activityMetrics: {
    totalLogins: { type: Number, default: 0 },
    totalVideoUploads: { type: Number, default: 0 },
    totalMissionsCompleted: { type: Number, default: 0 },
    totalViewsAcrossVideos: { type: Number, default: 0 }
  },
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    language: { type: String, default: 'ko' },
    timezone: String
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
    date: Date,
    metrics: {
      type: Map,
      of: Number
    }
  }],
  performanceMetrics: {
    type: Map,
    of: Number,
    default: {}
  },
  serviceUsage: {
    aiAnalysisUsed: { type: Number, default: 0 },
    trendPredictionsViewed: { type: Number, default: 0 },
    contentOptimizationsApplied: { type: Number, default: 0 }
  },
  contentCreationInsights: {
    averageVideoCreationTime: { type: Number, default: 0 },
    mostUsedTags: [String],
    averageThumbnailCreationTime: { type: Number, default: 0 },
    averageTitleOptimizationTime: { type: Number, default: 0 }
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
  emailVerificationExpires: Date
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 비밀번호 해싱 미들웨어
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 비밀번호 검증 메서드
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// 비밀번호 재설정 토큰 생성
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10분
  return resetToken;
};

// 이메일 인증 토큰 생성
userSchema.methods.createEmailVerificationToken = function() {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24시간
  return verificationToken;
};

// 가상 필드: 전체 이름
userSchema.virtual('fullName').get(function() {
  return `${this.profileInfo.fullName || ''} (${this.username})`;
});

// 인덱스 생성
userSchema.index({ username: 1, email: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;