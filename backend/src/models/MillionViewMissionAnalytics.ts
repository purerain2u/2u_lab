import mongoose, { Document, Schema, Model } from 'mongoose';

interface IMillionViewMissionAnalytics extends Document {
  pageType: string;
  date: Date;
  participantMetrics: {
    totalParticipants: number;
    newParticipants: number;
    returningParticipants: number;
  };
  missionMetrics: {
    totalMissionsStarted: number;
    totalMissionsCompleted: number;
    averageMissionTime: number;
    averageScore: number;
  };
  missionTypes: {
    thumbnail: {
      attempts: number;
      completions: number;
      averageScore: number;
    };
    title: {
      attempts: number;
      completions: number;
      averageScore: number;
    };
    script: {
      attempts: number;
      completions: number;
      averageScore: number;
    };
  };
  videoPerformance: {
    totalVideosCreated: number;
    averageViewCount: number;
    averageLikeCount: number;
    averageCommentCount: number;
    videosReaching1MViews: number;
  };
  hourlyData: Array<{
    hour: number;
    participants: number;
    missionsStarted: number;
    missionsCompleted: number;
  }>;
  deviceTypes: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
}

interface IMillionViewMissionAnalyticsModel extends Model<IMillionViewMissionAnalytics> {
  // 여기에 정적 메서드를 추가할 수 있습니다.
}

const millionViewMissionAnalyticsSchema = new Schema<IMillionViewMissionAnalytics>({
  pageType: {
    type: String,
    default: 'millionViewMission',
    immutable: true
  },
  date: { 
    type: Date, 
    required: true, 
    default: Date.now 
  },
  participantMetrics: {
    totalParticipants: { type: Number, default: 0 },
    newParticipants: { type: Number, default: 0 },
    returningParticipants: { type: Number, default: 0 }
  },
  missionMetrics: {
    totalMissionsStarted: { type: Number, default: 0 },
    totalMissionsCompleted: { type: Number, default: 0 },
    averageMissionTime: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 }
  },
  missionTypes: {
    thumbnail: { 
      attempts: { type: Number, default: 0 },
      completions: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 }
    },
    title: { 
      attempts: { type: Number, default: 0 },
      completions: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 }
    },
    script: { 
      attempts: { type: Number, default: 0 },
      completions: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 }
    }
  },
  videoPerformance: {
    totalVideosCreated: { type: Number, default: 0 },
    averageViewCount: { type: Number, default: 0 },
    averageLikeCount: { type: Number, default: 0 },
    averageCommentCount: { type: Number, default: 0 },
    videosReaching1MViews: { type: Number, default: 0 }
  },
  hourlyData: [{
    hour: Number,
    participants: Number,
    missionsStarted: Number,
    missionsCompleted: Number
  }],
  deviceTypes: {
    desktop: { type: Number, default: 0 },
    mobile: { type: Number, default: 0 },
    tablet: { type: Number, default: 0 }
  }
}, { 
  timestamps: true 
});

millionViewMissionAnalyticsSchema.virtual('missionCompletionRate').get(function(this: IMillionViewMissionAnalytics) {
  return this.missionMetrics.totalMissionsStarted > 0
    ? (this.missionMetrics.totalMissionsCompleted / this.missionMetrics.totalMissionsStarted) * 100
    : 0;
});

millionViewMissionAnalyticsSchema.virtual('missionTypeCompletionRates').get(function(this: IMillionViewMissionAnalytics) {
  return {
    thumbnail: this.missionTypes.thumbnail.attempts > 0
      ? (this.missionTypes.thumbnail.completions / this.missionTypes.thumbnail.attempts) * 100
      : 0,
    title: this.missionTypes.title.attempts > 0
      ? (this.missionTypes.title.completions / this.missionTypes.title.attempts) * 100
      : 0,
    script: this.missionTypes.script.attempts > 0
      ? (this.missionTypes.script.completions / this.missionTypes.script.attempts) * 100
      : 0
  };
});

millionViewMissionAnalyticsSchema.virtual('millionViewReachRate').get(function(this: IMillionViewMissionAnalytics) {
  return this.videoPerformance.totalVideosCreated > 0
    ? (this.videoPerformance.videosReaching1MViews / this.videoPerformance.totalVideosCreated) * 100
    : 0;
});

millionViewMissionAnalyticsSchema.index({ date: 1 });

const MillionViewMissionAnalytics = mongoose.model<IMillionViewMissionAnalytics, IMillionViewMissionAnalyticsModel>('MillionViewMissionAnalytics', millionViewMissionAnalyticsSchema);

export default MillionViewMissionAnalytics;